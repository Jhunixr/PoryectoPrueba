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
    
    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    const usuarioData = usuarios[0];
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuarioData.clave);
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
    
    // Registrar cliente si no existe
    let clienteCodigo;
    const [clienteExistente] = await db.pool.execute(`
      SELECT codigo FROM PERSONA WHERE dni = ?
    `, [cliente.dni]);
    
    if (clienteExistente.length > 0) {
      clienteCodigo = clienteExistente[0].codigo;
    } else {
      clienteCodigo = await db.registrarCliente(
        cliente.nombre,
        cliente.apellidos,
        cliente.dni
      );
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
    
    // Crear pasajes para cada asiento
    for (const asiento of asientos) {
      const pasajeCodigo = await db.venderPasaje(
        viaje_codigo,
        clienteCodigo,
        asiento,
        costoUnitario,
        usuario_vendedor
      );
      pasajesCreados.push(pasajeCodigo);
    }
    
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
    
    // Rutas más populares
    const rutasPopulares = await db.obtenerRutasPopulares(5);
    
    res.json({
      ventas_hoy: {
        pasajeros: ventasHoy[0].total_pasajes,
        ingresos: ventasHoy[0].total_ingresos
      },
      buses_operativos: busesOperativos[0].total,
      viajes_programados: viajesHoy[0].total,
      rutas_populares: rutasPopulares
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