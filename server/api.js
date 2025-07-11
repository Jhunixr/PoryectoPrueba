// API REST para NORTEEXPRESO - Versión actualizada
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'norteexpreso_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    
    console.log('Intento de login:', { usuario, password: '***' });
    
    // Buscar usuario en la base de datos
    const [usuarios] = await db.pool.execute(`
      SELECT 
        u.codigo,
        u.usuario,
        u.clave,
        u.estado,
        u.tipo_usuario_codigo,
        tu.descripcion as tipo_usuario,
        CONCAT(p.nombre, ' ', p.apellidos) as nombre_completo,
        e.email
      FROM USUARIOS u
      INNER JOIN TIPO_USUARIO tu ON u.tipo_usuario_codigo = tu.codigo
      INNER JOIN EMPLEADO e ON u.empleado_codigo = e.codigo
      INNER JOIN PERSONA p ON e.codigo = p.codigo
      WHERE u.usuario = ? AND u.estado = 'activo'
    `, [usuario]);
    
    console.log('Usuarios encontrados:', usuarios.length);
    
    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    const usuarioData = usuarios[0];
    console.log('Usuario encontrado:', usuarioData.usuario);
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuarioData.clave);
    console.log('Password válida:', passwordValida);
    
    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    
    // Generar JWT
    const token = jwt.sign(
      { 
        codigo: usuarioData.codigo,
        usuario: usuarioData.usuario,
        tipo_usuario: usuarioData.tipo_usuario
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    console.log('Login exitoso para:', usuarioData.usuario);
    
    res.json({
      token,
      usuario: {
        codigo: usuarioData.codigo,
        usuario: usuarioData.usuario,
        nombre_completo: usuarioData.nombre_completo,
        email: usuarioData.email,
        tipo_usuario: usuarioData.tipo_usuario
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTAS PÚBLICAS (sin autenticación)
// ==========================================

// Obtener rutas disponibles
app.get('/api/rutas', async (req, res) => {
  try {
    const rutas = await db.obtenerRutas();
    res.json(rutas);
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    res.status(500).json({ error: 'Error al obtener rutas' });
  }
});

// Buscar viajes
app.get('/api/viajes/buscar', async (req, res) => {
  try {
    const { origen, destino, fecha } = req.query;
    
    const [viajes] = await db.pool.execute(`
      SELECT 
        v.codigo,
        v.fecha_hora_salida,
        v.fecha_hora_llegada_estimada,
        v.estado,
        r.origen,
        r.destino,
        r.costo_referencial,
        b.placa,
        b.fabricante,
        b.num_asientos,
        CONCAT(p.nombre, ' ', p.apellidos) as chofer_nombre,
        (b.num_asientos - COALESCE(asientos_ocupados.ocupados, 0)) as asientos_disponibles
      FROM VIAJE v
      INNER JOIN RUTAS r ON v.ruta_codigo = r.codigo
      INNER JOIN BUSES b ON v.bus_codigo = b.codigo
      INNER JOIN CHOFER ch ON v.chofer_codigo = ch.codigo
      INNER JOIN EMPLEADO e ON ch.codigo = e.codigo
      INNER JOIN PERSONA p ON e.codigo = p.codigo
      LEFT JOIN (
        SELECT viaje_codigo, COUNT(*) as ocupados
        FROM PASAJE 
        WHERE estado = 'Vendido'
        GROUP BY viaje_codigo
      ) asientos_ocupados ON v.codigo = asientos_ocupados.viaje_codigo
      WHERE r.origen = ? 
        AND r.destino = ? 
        AND DATE(v.fecha_hora_salida) = ?
        AND v.estado = 'Programado'
      ORDER BY v.fecha_hora_salida
    `, [origen, destino, fecha]);
    
    res.json(viajes);
  } catch (error) {
    console.error('Error al buscar viajes:', error);
    res.status(500).json({ error: 'Error al buscar viajes' });
  }
});

// Obtener asientos ocupados de un viaje
app.get('/api/viajes/:viajeId/asientos', async (req, res) => {
  try {
    const { viajeId } = req.params;
    
    const [asientosOcupados] = await db.pool.execute(`
      SELECT asiento 
      FROM PASAJE 
      WHERE viaje_codigo = ? AND estado = 'Vendido'
    `, [viajeId]);
    
    res.json(asientosOcupados.map(a => a.asiento));
  } catch (error) {
    console.error('Error al obtener asientos:', error);
    res.status(500).json({ error: 'Error al obtener asientos' });
  }
});

// ==========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ==========================================

// Vender pasaje
app.post('/api/pasajes', verificarToken, async (req, res) => {
  try {
    const { viaje_codigo, cliente, asientos, metodo_pago } = req.body;
    const usuario_vendedor = req.usuario.codigo;
    
    console.log('Datos recibidos para venta de pasaje:', {
      viaje_codigo,
      cliente,
      asientos,
      metodo_pago,
      usuario_vendedor
    });
    
    // Registrar cliente si no existe
    let clienteCodigo;
    const [clienteExistente] = await db.pool.execute(`
      SELECT codigo FROM PERSONA WHERE dni = ?
    `, [cliente.dni]);
    
    if (clienteExistente.length > 0) {
      clienteCodigo = clienteExistente[0].codigo;
      console.log('Cliente existente encontrado:', clienteCodigo);
    } else {
      console.log('Registrando nuevo cliente...');
      
      // Insertar persona
      const [personaResult] = await db.pool.execute(`
        INSERT INTO PERSONA (nombre, apellidos, dni) 
        VALUES (?, ?, ?)
      `, [cliente.nombre, cliente.apellidos, cliente.dni]);
      
      clienteCodigo = personaResult.insertId;
      
      // Insertar cliente
      await db.pool.execute(`
        INSERT INTO CLIENTE (codigo, razon_social, ruc) 
        VALUES (?, NULL, NULL)
      `, [clienteCodigo]);
      
      console.log('Nuevo cliente registrado:', clienteCodigo);
    }
    
    // Obtener información del viaje
    const [viajeInfo] = await db.pool.execute(`
      SELECT r.costo_referencial 
      FROM VIAJE v
      INNER JOIN RUTAS r ON v.ruta_codigo = r.codigo
      WHERE v.codigo = ?
    `, [viaje_codigo]);
    
    if (viajeInfo.length === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    
    const costoUnitario = viajeInfo[0].costo_referencial;
    const pasajesCreados = [];
    
    console.log('Costo unitario:', costoUnitario);
    
    // Crear pasajes para cada asiento
    for (const asiento of asientos) {
      console.log('Creando pasaje para asiento:', asiento);
      
      // Verificar disponibilidad del asiento
      const [asientoOcupado] = await db.pool.execute(`
        SELECT codigo FROM PASAJE 
        WHERE viaje_codigo = ? AND asiento = ? AND estado = 'Vendido'
      `, [viaje_codigo, asiento]);
      
      if (asientoOcupado.length > 0) {
        throw new Error(`El asiento ${asiento} ya está ocupado`);
      }
      
      // Insertar el pasaje
      const [result] = await db.pool.execute(`
        INSERT INTO PASAJE (viaje_codigo, cliente_codigo, asiento, importe_pagar, usuario_vendedor_codigo, estado) 
        VALUES (?, ?, ?, ?, ?, 'Vendido')
      `, [viaje_codigo, clienteCodigo, asiento, costoUnitario, usuario_vendedor]);
      
      const pasajeCodigo = result.insertId;
      pasajesCreados.push(pasajeCodigo);
      console.log('Pasaje creado:', pasajeCodigo);
    }
    
    console.log('Venta completada exitosamente');
    
    res.json({
      message: 'Pasajes vendidos exitosamente',
      pasajes: pasajesCreados,
      total: costoUnitario * asientos.length
    });
    
  } catch (error) {
    console.error('Error al vender pasaje:', error);
    res.status(500).json({ error: error.message || 'Error al vender pasaje' });
  }
});

// Obtener estadísticas del dashboard
app.get('/api/dashboard/estadisticas', verificarToken, async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Ventas del día
    const [ventasHoy] = await db.pool.execute(`
      SELECT 
        COUNT(*) as total_pasajes,
        COALESCE(SUM(importe_pagar), 0) as total_ingresos
      FROM PASAJE 
      WHERE DATE(fecha_emision) = ? AND estado = 'Vendido'
    `, [hoy]);
    
    // Buses operativos
    const [busesOperativos] = await db.pool.execute(`
      SELECT COUNT(*) as total FROM BUSES WHERE estado = 'Operativo'
    `);
    
    // Viajes programados hoy
    const [viajesHoy] = await db.pool.execute(`
      SELECT COUNT(*) as total FROM VIAJE 
      WHERE DATE(fecha_hora_salida) = ? AND estado = 'Programado'
    `, [hoy]);
    
    res.json({
      ventas_hoy: {
        pasajeros: ventasHoy[0].total_pasajes,
        ingresos: ventasHoy[0].total_ingresos
      },
      buses_operativos: busesOperativos[0].total,
      viajes_programados: viajesHoy[0].total
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Obtener todos los viajes (admin)
app.get('/api/admin/viajes', verificarToken, async (req, res) => {
  try {
    const { fecha, estado } = req.query;
    const viajes = await db.obtenerViajes(fecha);
    res.json(viajes);
  } catch (error) {
    console.error('Error al obtener viajes:', error);
    res.status(500).json({ error: 'Error al obtener viajes' });
  }
});

// Obtener buses
app.get('/api/admin/buses', verificarToken, async (req, res) => {
  try {
    const buses = await db.obtenerBuses();
    res.json(buses);
  } catch (error) {
    console.error('Error al obtener buses:', error);
    res.status(500).json({ error: 'Error al obtener buses' });
  }
});

// Obtener choferes
app.get('/api/admin/choferes', verificarToken, async (req, res) => {
  try {
    const [choferes] = await db.pool.execute(`
      SELECT 
        ch.codigo,
        ch.licencia,
        CONCAT(p.nombre, ' ', p.apellidos) as nombre,
        p.nombre,
        p.apellidos
      FROM CHOFER ch
      INNER JOIN EMPLEADO e ON ch.codigo = e.codigo
      INNER JOIN PERSONA p ON e.codigo = p.codigo
      ORDER BY p.apellidos, p.nombre
    `);
    res.json(choferes);
  } catch (error) {
    console.error('Error al obtener choferes:', error);
    res.status(500).json({ error: 'Error al obtener choferes' });
  }
});

// Crear nuevo viaje
app.post('/api/admin/viajes', verificarToken, async (req, res) => {
  try {
    const { ruta_codigo, bus_codigo, chofer_codigo, fecha_hora_salida, fecha_hora_llegada_estimada } = req.body;
    
    console.log('Datos del viaje a crear:', {
      ruta_codigo, bus_codigo, chofer_codigo, fecha_hora_salida, fecha_hora_llegada_estimada
    });
    
    // Verificar que el bus esté disponible en esa fecha/hora
    const [busOcupado] = await db.pool.execute(`
      SELECT codigo FROM VIAJE 
      WHERE bus_codigo = ? 
        AND estado = 'Programado'
        AND (
          (fecha_hora_salida <= ? AND fecha_hora_llegada_estimada >= ?) OR
          (fecha_hora_salida <= ? AND fecha_hora_llegada_estimada >= ?)
        )
    `, [bus_codigo, fecha_hora_salida, fecha_hora_salida, fecha_hora_llegada_estimada, fecha_hora_llegada_estimada]);
    
    if (busOcupado.length > 0) {
      return res.status(400).json({ error: 'El bus ya tiene un viaje programado en ese horario' });
    }
    
    // Verificar que el chofer esté disponible
    const [choferOcupado] = await db.pool.execute(`
      SELECT codigo FROM VIAJE 
      WHERE chofer_codigo = ? 
        AND estado = 'Programado'
        AND (
          (fecha_hora_salida <= ? AND fecha_hora_llegada_estimada >= ?) OR
          (fecha_hora_salida <= ? AND fecha_hora_llegada_estimada >= ?)
        )
    `, [chofer_codigo, fecha_hora_salida, fecha_hora_salida, fecha_hora_llegada_estimada, fecha_hora_llegada_estimada]);
    
    if (choferOcupado.length > 0) {
      return res.status(400).json({ error: 'El chofer ya tiene un viaje programado en ese horario' });
    }
    
    // Crear el viaje
    const [result] = await db.pool.execute(`
      INSERT INTO VIAJE (ruta_codigo, bus_codigo, chofer_codigo, fecha_hora_salida, fecha_hora_llegada_estimada, estado) 
      VALUES (?, ?, ?, ?, ?, 'Programado')
    `, [ruta_codigo, bus_codigo, chofer_codigo, fecha_hora_salida, fecha_hora_llegada_estimada]);
    
    console.log('Viaje creado con ID:', result.insertId);
    
    res.json({
      message: 'Viaje programado exitosamente',
      viaje_id: result.insertId
    });
    
  } catch (error) {
    console.error('Error al crear viaje:', error);
    res.status(500).json({ error: 'Error al programar viaje' });
  }
});

// Obtener reservas recientes
app.get('/api/admin/pasajes/recientes', verificarToken, async (req, res) => {
  try {
    const [pasajes] = await db.pool.execute(`
      SELECT 
        p.codigo,
        CONCAT(pe.nombre, ' ', pe.apellidos) as passenger,
        CONCAT(r.origen, ' - ', r.destino) as route,
        TIME_FORMAT(v.fecha_hora_salida, '%H:%i') as departure,
        CONCAT('S/ ', FORMAT(p.importe_pagar, 2)) as amount,
        p.estado as status
      FROM PASAJE p
      INNER JOIN VIAJE v ON p.viaje_codigo = v.codigo
      INNER JOIN RUTAS r ON v.ruta_codigo = r.codigo
      INNER JOIN CLIENTE c ON p.cliente_codigo = c.codigo
      INNER JOIN PERSONA pe ON c.codigo = pe.codigo
      WHERE p.estado = 'Vendido'
      ORDER BY p.fecha_emision DESC
      LIMIT 10
    `);
    
    res.json(pasajes);
  } catch (error) {
    console.error('Error al obtener reservas recientes:', error);
    res.status(500).json({ error: 'Error al obtener reservas recientes' });
  }
});

// ==========================================
// MANEJO DE ERRORES Y SERVIDOR
// ==========================================

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Iniciar servidor
async function iniciarServidor() {
  try {
    // Probar conexión a la base de datos
    const conexionExitosa = await db.testConnection();
    
    if (!conexionExitosa) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Inicializar datos de prueba
    await db.initializeTestData();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor API ejecutándose en puerto ${PORT}`);
      console.log(`📡 Endpoints disponibles:`);
      console.log(`   POST /api/auth/login`);
      console.log(`   GET  /api/rutas`);
      console.log(`   GET  /api/viajes/buscar`);
      console.log(`   POST /api/pasajes`);
      console.log(`   GET  /api/dashboard/estadisticas`);
      console.log(`   GET  /api/admin/viajes`);
      console.log(`   GET  /api/admin/buses`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await db.cerrarConexion();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await db.cerrarConexion();
  process.exit(0);
});

// Iniciar servidor si este archivo se ejecuta directamente
if (require.main === module) {
  iniciarServidor();
}

module.exports = app;