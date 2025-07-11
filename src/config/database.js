import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Bdvargas2005',
  database: process.env.DB_NAME || 'transporte_db',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Pool de conexiones
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Función para probar la conexión
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    console.log(`📊 Base de datos: ${dbConfig.database}`);
    console.log(`🏠 Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    return false;
  }
}

// Funciones de base de datos

// 1. GESTIÓN DE RUTAS
export async function obtenerRutas() {
  try {
    const [rows] = await pool.execute(`
      SELECT codigo, origen, destino, costo_referencial 
      FROM RUTAS 
      ORDER BY origen, destino
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    throw error;
  }
}

export async function crearRuta(origen, destino, costoReferencial) {
  try {
    const [result] = await pool.execute(`
      INSERT INTO RUTAS (origen, destino, costo_referencial) 
      VALUES (?, ?, ?)
    `, [origen, destino, costoReferencial]);
    return result.insertId;
  } catch (error) {
    console.error('Error al crear ruta:', error);
    throw error;
  }
}

// 2. GESTIÓN DE BUSES
export async function obtenerBuses() {
  try {
    const [rows] = await pool.execute(`
      SELECT codigo, placa, fabricante, num_asientos, estado 
      FROM BUSES 
      ORDER BY placa
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener buses:', error);
    throw error;
  }
}

export async function registrarBus(placa, fabricante, numAsientos) {
  try {
    const [result] = await pool.execute(`
      INSERT INTO BUSES (placa, fabricante, num_asientos, estado) 
      VALUES (?, ?, ?, 'Operativo')
    `, [placa, fabricante, numAsientos]);
    return result.insertId;
  } catch (error) {
    console.error('Error al registrar bus:', error);
    throw error;
  }
}

// 3. GESTIÓN DE VIAJES
export async function obtenerViajes(fecha = null) {
  try {
    let query = `
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
        CONCAT(p.nombre, ' ', p.apellidos) as chofer_nombre
      FROM VIAJE v
      INNER JOIN RUTAS r ON v.ruta_codigo = r.codigo
      INNER JOIN BUSES b ON v.bus_codigo = b.codigo
      INNER JOIN CHOFER ch ON v.chofer_codigo = ch.codigo
      INNER JOIN PERSONAL pe ON ch.codigo = pe.codigo
      INNER JOIN PERSONA p ON pe.codigo = p.codigo
    `;
    
    const params = [];
    if (fecha) {
      query += ' WHERE DATE(v.fecha_hora_salida) = ?';
      params.push(fecha);
    }
    
    query += ' ORDER BY v.fecha_hora_salida';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error al obtener viajes:', error);
    throw error;
  }
}

export async function programarViaje(rutaCodigo, busCodigo, choferCodigo, fechaHoraSalida, fechaHoraLlegada) {
  try {
    const [result] = await pool.execute(`
      INSERT INTO VIAJE (ruta_codigo, bus_codigo, chofer_codigo, fecha_hora_salida, fecha_hora_llegada_estimada, estado) 
      VALUES (?, ?, ?, ?, ?, 'Programado')
    `, [rutaCodigo, busCodigo, choferCodigo, fechaHoraSalida, fechaHoraLlegada]);
    return result.insertId;
  } catch (error) {
    console.error('Error al programar viaje:', error);
    throw error;
  }
}

// 4. GESTIÓN DE PASAJES
export async function venderPasaje(viajeCodigo, clienteCodigo, asiento, importePagar, usuarioVendedorCodigo) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Verificar disponibilidad del asiento
    const [asientoOcupado] = await connection.execute(`
      SELECT codigo FROM PASAJE 
      WHERE viaje_codigo = ? AND asiento = ? AND estado = 'Vendido'
    `, [viajeCodigo, asiento]);
    
    if (asientoOcupado.length > 0) {
      throw new Error('El asiento ya está ocupado');
    }
    
    // Insertar el pasaje
    const [result] = await connection.execute(`
      INSERT INTO PASAJE (viaje_codigo, cliente_codigo, asiento, importe_pagar, usuario_vendedor_codigo, estado) 
      VALUES (?, ?, ?, ?, ?, 'Vendido')
    `, [viajeCodigo, clienteCodigo, asiento, importePagar, usuarioVendedorCodigo]);
    
    await connection.commit();
    return result.insertId;
    
  } catch (error) {
    await connection.rollback();
    console.error('Error al vender pasaje:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 5. GESTIÓN DE CLIENTES
export async function registrarCliente(nombre, apellidos, dni, email, telefono) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insertar persona
    const [personaResult] = await connection.execute(`
      INSERT INTO PERSONA (nombre, apellidos, dni) 
      VALUES (?, ?, ?)
    `, [nombre, apellidos, dni]);
    
    const personaCodigo = personaResult.insertId;
    
    // Insertar cliente
    await connection.execute(`
      INSERT INTO CLIENTE (codigo, email, telefono, puntos, nivel, fecha_registro) 
      VALUES (?, ?, ?, 0, 'Bronce', NOW())
    `, [personaCodigo, email, telefono]);
    
    await connection.commit();
    return personaCodigo;
    
  } catch (error) {
    await connection.rollback();
    console.error('Error al registrar cliente:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 6. GESTIÓN DE PERSONAL
export async function obtenerPersonal() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.codigo,
        p.nombre,
        p.apellidos,
        p.dni,
        pe.direccion,
        pe.telefono,
        pe.email,
        c.descripcion as cargo,
        a.descripcion as area,
        co.sueldo
      FROM PERSONA p
      INNER JOIN PERSONAL pe ON p.codigo = pe.codigo
      INNER JOIN CARGO c ON pe.cargo_codigo = c.codigo
      INNER JOIN AREA a ON c.area_codigo = a.codigo
      INNER JOIN CONTRATO co ON pe.contrato_codigo = co.codigo
      ORDER BY p.apellidos, p.nombre
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener personal:', error);
    throw error;
  }
}

export async function registrarEmpleado(datosPersonales, datosLaborales) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insertar persona
    const [personaResult] = await connection.execute(`
      INSERT INTO PERSONA (nombre, apellidos, dni) 
      VALUES (?, ?, ?)
    `, [datosPersonales.nombre, datosPersonales.apellidos, datosPersonales.dni]);
    
    const personaCodigo = personaResult.insertId;
    
    // Crear contrato
    const [contratoResult] = await connection.execute(`
      INSERT INTO CONTRATO (fecha_inicio, sueldo, turno_codigo) 
      VALUES (NOW(), ?, 1)
    `, [datosLaborales.sueldo]);
    
    const contratoCodigo = contratoResult.insertId;
    
    // Insertar empleado
    await connection.execute(`
      INSERT INTO EMPLEADO (codigo, direccion, telefono, email, contrato_codigo, cargo_codigo) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [personaCodigo, datosPersonales.direccion, datosPersonales.telefono, datosPersonales.email, contratoCodigo, datosLaborales.cargo]);
    
    await connection.commit();
    return personaCodigo;
    
  } catch (error) {
    await connection.rollback();
    console.error('Error al registrar empleado:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 7. REPORTES Y ESTADÍSTICAS
export async function obtenerEstadisticasVentas(fechaInicio, fechaFin) {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        DATE(pa.fecha_emision) as fecha,
        COUNT(*) as total_pasajes,
        SUM(pa.importe_pagar) as total_ingresos,
        AVG(pa.importe_pagar) as promedio_pasaje
      FROM PASAJE pa
      WHERE DATE(pa.fecha_emision) BETWEEN ? AND ?
        AND pa.estado = 'Vendido'
      GROUP BY DATE(pa.fecha_emision)
      ORDER BY fecha
    `, [fechaInicio, fechaFin]);
    return rows;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
}

export async function obtenerRutasPopulares(limite = 10) {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        r.origen,
        r.destino,
        COUNT(pa.codigo) as total_pasajes,
        SUM(pa.importe_pagar) as total_ingresos
      FROM RUTAS r
      INNER JOIN VIAJE v ON r.codigo = v.ruta_codigo
      INNER JOIN PASAJE pa ON v.codigo = pa.viaje_codigo
      WHERE pa.estado = 'Vendido'
      GROUP BY r.codigo, r.origen, r.destino
      ORDER BY total_pasajes DESC
      LIMIT ?
    `, [limite]);
    return rows;
  } catch (error) {
    console.error('Error al obtener rutas populares:', error);
    throw error;
  }
}

// Función para cerrar el pool de conexiones
export async function cerrarConexion() {
  try {
    await pool.end();
    console.log('🔌 Pool de conexiones cerrado');
  } catch (error) {
    console.error('Error al cerrar conexiones:', error);
  }
}

export { pool };