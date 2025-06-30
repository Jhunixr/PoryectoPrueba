-- Script completo para configurar la base de datos NORTEEXPRESO
-- Ejecutar este script en MySQL Workbench o línea de comandos

CREATE DATABASE IF NOT EXISTS transporte_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE transporte_db;

-- -----------------------------------------------------
-- Tablas base y de configuración (Lookups)
-- -----------------------------------------------------

CREATE TABLE PERSONA (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni CHAR(8) NOT NULL UNIQUE
);

CREATE TABLE TIPO_USUARIO (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE AREA (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE TURNO (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100),
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL
);

CREATE TABLE RUTAS (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    origen VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    costo_referencial DECIMAL(8, 2) COMMENT 'Costo base que puede variar por temporada o viaje'
);

CREATE TABLE BUSES (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    fabricante VARCHAR(100),
    num_asientos INT NOT NULL,
    estado VARCHAR(50) DEFAULT 'Operativo' COMMENT 'Operativo, Mantenimiento, etc.'
);

-- -----------------------------------------------------
-- Tablas de Entidades Principales (Personas, Contratos)
-- -----------------------------------------------------

CREATE TABLE CLIENTE (
    codigo INT PRIMARY KEY,
    razon_social VARCHAR(255),
    ruc CHAR(11) UNIQUE,
    FOREIGN KEY (codigo) REFERENCES PERSONA(codigo) ON DELETE CASCADE
);

CREATE TABLE CARGO (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    area_codigo INT NOT NULL,
    FOREIGN KEY (area_codigo) REFERENCES AREA(codigo)
);

CREATE TABLE CONTRATO (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    sueldo DECIMAL(10, 2) NOT NULL,
    turno_codigo INT NOT NULL,
    FOREIGN KEY (turno_codigo) REFERENCES TURNO(codigo)
);

CREATE TABLE EMPLEADO (
    codigo INT PRIMARY KEY,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    contrato_codigo INT UNIQUE,
    cargo_codigo INT NOT NULL,
    FOREIGN KEY (codigo) REFERENCES PERSONA(codigo) ON DELETE CASCADE,
    FOREIGN KEY (cargo_codigo) REFERENCES CARGO(codigo),
    FOREIGN KEY (contrato_codigo) REFERENCES CONTRATO(codigo)
);

CREATE TABLE CHOFER (
    codigo INT PRIMARY KEY,
    licencia VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (codigo) REFERENCES EMPLEADO(codigo) ON DELETE CASCADE
);

CREATE TABLE USUARIOS (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL COMMENT 'Guardar siempre contraseñas hasheadas',
    estado VARCHAR(20) DEFAULT 'activo',
    empleado_codigo INT NOT NULL,
    tipo_usuario_codigo INT NOT NULL,
    FOREIGN KEY (empleado_codigo) REFERENCES EMPLEADO(codigo),
    FOREIGN KEY (tipo_usuario_codigo) REFERENCES TIPO_USUARIO(codigo)
);

-- -------------------------------------------------------------------
-- TABLA CENTRAL: VIAJE
-- -------------------------------------------------------------------
CREATE TABLE VIAJE (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora_salida DATETIME NOT NULL,
    fecha_hora_llegada_estimada DATETIME NOT NULL,
    estado VARCHAR(50) NOT NULL COMMENT 'Programado, En Curso, Finalizado, Cancelado',
    ruta_codigo INT NOT NULL,
    bus_codigo INT NOT NULL,
    chofer_codigo INT NOT NULL,
    FOREIGN KEY (ruta_codigo) REFERENCES RUTAS(codigo),
    FOREIGN KEY (bus_codigo) REFERENCES BUSES(codigo),
    FOREIGN KEY (chofer_codigo) REFERENCES CHOFER(codigo)
);

-- -------------------------------------------------------------------
-- Tabla de Transacciones: PASAJE
-- -------------------------------------------------------------------
CREATE TABLE PASAJE (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    asiento INT NOT NULL,
    importe_pagar DECIMAL(8, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Vendido' COMMENT 'Vendido, Cancelado, No Show',
    viaje_codigo INT NOT NULL,
    cliente_codigo INT NOT NULL,
    usuario_vendedor_codigo INT NOT NULL,
    UNIQUE(viaje_codigo, asiento),
    FOREIGN KEY (viaje_codigo) REFERENCES VIAJE(codigo),
    FOREIGN KEY (cliente_codigo) REFERENCES CLIENTE(codigo),
    FOREIGN KEY (usuario_vendedor_codigo) REFERENCES USUARIOS(codigo)
);

-- -----------------------------------------------------
-- INSERTAR DATOS INICIALES
-- -----------------------------------------------------

-- Tipos de usuario
INSERT INTO TIPO_USUARIO (codigo, descripcion) VALUES 
(1, 'Administrador'),
(2, 'Vendedor'),
(3, 'Supervisor');

-- Áreas
INSERT INTO AREA (codigo, descripcion) VALUES 
(1, 'Administración'),
(2, 'Ventas'),
(3, 'Operaciones'),
(4, 'Mantenimiento');

-- Turnos
INSERT INTO TURNO (codigo, descripcion, hora_inicio, hora_final) VALUES 
(1, 'Mañana', '06:00:00', '14:00:00'),
(2, 'Tarde', '14:00:00', '22:00:00'),
(3, 'Noche', '22:00:00', '06:00:00');

-- Rutas del norte
INSERT INTO RUTAS (codigo, origen, destino, costo_referencial) VALUES 
(1, 'Lima', 'Trujillo', 35.00),
(2, 'Lima', 'Chiclayo', 40.00),
(3, 'Lima', 'Piura', 55.00),
(4, 'Lima', 'Cajamarca', 45.00),
(5, 'Lima', 'Tumbes', 65.00),
(6, 'Lima', 'Chimbote', 30.00),
(7, 'Trujillo', 'Chiclayo', 25.00),
(8, 'Chiclayo', 'Piura', 30.00);

-- Buses
INSERT INTO BUSES (codigo, placa, fabricante, num_asientos, estado) VALUES 
(1, 'NTE-001', 'Mercedes Benz', 40, 'Operativo'),
(2, 'NTE-002', 'Scania', 44, 'Operativo'),
(3, 'NTE-003', 'Volvo', 36, 'Operativo'),
(4, 'NTE-004', 'Mercedes Benz', 42, 'Operativo'),
(5, 'NTE-005', 'Scania', 40, 'Mantenimiento');

-- Cargos
INSERT INTO CARGO (codigo, descripcion, area_codigo) VALUES 
(1, 'Administrador General', 1),
(2, 'Vendedor', 2),
(3, 'Chofer', 3),
(4, 'Supervisor de Operaciones', 3),
(5, 'Mecánico', 4);

-- Contratos
INSERT INTO CONTRATO (codigo, fecha_inicio, sueldo, turno_codigo) VALUES 
(1, '2024-01-01', 3500.00, 1),
(2, '2024-01-01', 2500.00, 1),
(3, '2024-01-01', 2800.00, 1),
(4, '2024-01-01', 2800.00, 2),
(5, '2024-01-01', 3000.00, 1);

-- Personas
INSERT INTO PERSONA (codigo, nombre, apellidos, dni) VALUES 
(1, 'Admin', 'Sistema', '12345678'),
(2, 'María', 'González Pérez', '87654321'),
(3, 'Carlos', 'Mendoza Silva', '11223344'),
(4, 'Ana', 'Rodríguez López', '44332211'),
(5, 'Luis', 'García Torres', '55667788');

-- Empleados
INSERT INTO EMPLEADO (codigo, direccion, telefono, email, contrato_codigo, cargo_codigo) VALUES 
(1, 'Av. Lima 123, San Isidro', '999999999', 'admin@norteexpreso.com', 1, 1),
(2, 'Jr. Arequipa 456, Miraflores', '888888888', 'maria@norteexpreso.com', 2, 2),
(3, 'Av. Brasil 789, Magdalena', '777777777', 'carlos@norteexpreso.com', 3, 3),
(4, 'Calle Los Olivos 321, San Borja', '666666666', 'ana@norteexpreso.com', 4, 2),
(5, 'Av. Javier Prado 654, San Isidro', '555555555', 'luis@norteexpreso.com', 5, 4);

-- Choferes
INSERT INTO CHOFER (codigo, licencia) VALUES 
(3, 'A2B-12345678'),
(5, 'A2B-87654321');

-- Clientes
INSERT INTO CLIENTE (codigo, razon_social, ruc) VALUES 
(2, NULL, NULL),
(4, NULL, NULL);

-- Usuario administrador (contraseña: admin123)
INSERT INTO USUARIOS (codigo, usuario, clave, estado, empleado_codigo, tipo_usuario_codigo) VALUES 
(1, 'admin', '$2b$10$rOvHmj1FxlZJ8qY9vK5zKOQJ8qY9vK5zKOQJ8qY9vK5zKOQJ8qY9vK', 'activo', 1, 1);

-- Viajes de ejemplo
INSERT INTO VIAJE (codigo, fecha_hora_salida, fecha_hora_llegada_estimada, estado, ruta_codigo, bus_codigo, chofer_codigo) VALUES 
(1, '2024-02-15 08:00:00', '2024-02-15 16:00:00', 'Programado', 1, 1, 3),
(2, '2024-02-15 14:00:00', '2024-02-15 22:00:00', 'Programado', 2, 2, 5),
(3, '2024-02-16 06:00:00', '2024-02-16 20:00:00', 'Programado', 3, 3, 3);

-- Pasajes de ejemplo
INSERT INTO PASAJE (codigo, fecha_emision, asiento, importe_pagar, estado, viaje_codigo, cliente_codigo, usuario_vendedor_codigo) VALUES 
(1, '2024-01-15 10:30:00', 15, 35.00, 'Vendido', 1, 2, 1),
(2, '2024-01-15 11:15:00', 8, 40.00, 'Vendido', 2, 4, 1);