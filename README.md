# NORTEEXPRESO - Sistema de Transporte de Pasajeros

Sistema completo de gestión de transporte de pasajeros desarrollado con React, TypeScript, Tailwind CSS y MySQL.

## 🚌 Características Principales

### Frontend (React + TypeScript)
- **Búsqueda de viajes** con filtros avanzados
- **Reserva de asientos** interactiva
- **Panel administrativo** completo
- **Autenticación** de usuarios
- **Dashboard** con estadísticas en tiempo real
- **Diseño responsive** para móviles y desktop
- **Interfaz moderna** con animaciones y micro-interacciones

### Backend (Node.js + MySQL)
- **API REST** completa
- **Base de datos MySQL** optimizada
- **Autenticación JWT**
- **Gestión de transacciones**
- **Reportes y estadísticas**
- **Validación de datos**

## 🎨 Diseño

El sistema utiliza la paleta de colores corporativa de NORTEEXPRESO:
- **Azul Oscuro**: `#0d2c4e` - Color principal
- **Amarillo Dorado**: `#e3a518` - Color de acento
- **Blanco Crema**: `#f8f6f3` - Fondo principal
- **Gris Suave**: `#7b7d80` - Texto secundario

## 📋 Funcionalidades

### Para Pasajeros
- ✅ Búsqueda de viajes por origen, destino y fecha
- ✅ Visualización de horarios y precios
- ✅ Selección de asientos en tiempo real
- ✅ Proceso de reserva paso a paso
- ✅ Confirmación de compra

### Para Administradores
- ✅ Dashboard con métricas clave
- ✅ Gestión de viajes y horarios
- ✅ Administración de buses y mantenimiento
- ✅ Gestión de rutas y tarifas
- ✅ Control de ventas y pasajes
- ✅ Administración de personal
- ✅ Reportes y estadísticas

## 🗄️ Base de Datos

El sistema utiliza una base de datos MySQL optimizada con las siguientes entidades principales:

### Tablas Principales
- **PERSONA** - Información básica de personas
- **CLIENTE** - Datos específicos de clientes
- **PERSONAL** - Empleados de la empresa
- **CHOFER** - Conductores certificados
- **USUARIOS** - Acceso al sistema
- **BUSES** - Flota de vehículos
- **RUTAS** - Rutas disponibles
- **VIAJE** - Viajes programados
- **PASAJE** - Tickets vendidos

### Características de la BD
- ✅ Integridad referencial
- ✅ Índices optimizados
- ✅ Triggers para auditoría
- ✅ Vistas para reportes
- ✅ Procedimientos almacenados

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd norteexpreso-transport-system
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la base de datos

#### Crear la base de datos
```sql
CREATE DATABASE transporte_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Ejecutar el script de creación
Ejecuta el script SQL completo que se encuentra en la documentación para crear todas las tablas y relaciones.

### 4. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=transporte_db
DB_PORT=3306
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=3001
```

### 5. Iniciar el servidor de desarrollo
```bash
# Frontend (React)
npm run dev

# Backend (API) - en otra terminal
cd server
node api.js
```

## 🔧 Configuración de MySQL

### Conexión desde Node.js
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'tu_password',
  database: 'transporte_db',
  charset: 'utf8mb4',
  timezone: '+00:00'
});
```

### Ejemplo de consulta
```javascript
// Buscar viajes disponibles
const [viajes] = await pool.execute(`
  SELECT 
    v.codigo,
    v.fecha_hora_salida,
    r.origen,
    r.destino,
    r.costo_referencial,
    b.placa,
    (b.num_asientos - COALESCE(ocupados.total, 0)) as asientos_disponibles
  FROM VIAJE v
  INNER JOIN RUTAS r ON v.ruta_codigo = r.codigo
  INNER JOIN BUSES b ON v.bus_codigo = b.codigo
  LEFT JOIN (
    SELECT viaje_codigo, COUNT(*) as total
    FROM PASAJE 
    WHERE estado = 'Vendido'
    GROUP BY viaje_codigo
  ) ocupados ON v.codigo = ocupados.viaje_codigo
  WHERE r.origen = ? AND r.destino = ? AND DATE(v.fecha_hora_salida) = ?
`, [origen, destino, fecha]);
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Público
- `GET /api/rutas` - Obtener rutas disponibles
- `GET /api/viajes/buscar` - Buscar viajes
- `GET /api/viajes/:id/asientos` - Asientos ocupados

### Protegido (requiere autenticación)
- `POST /api/pasajes` - Vender pasaje
- `GET /api/pasajes` - Listar pasajes
- `GET /api/dashboard/estadisticas` - Estadísticas
- `GET /api/admin/viajes` - Gestión de viajes
- `POST /api/admin/viajes` - Crear viaje
- `GET /api/admin/buses` - Gestión de buses
- `POST /api/admin/rutas` - Crear ruta

## 👥 Usuarios de Prueba

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Permisos**: Acceso completo al sistema

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de entrada
- ✅ Protección CORS
- ✅ Sanitización de consultas SQL
- ✅ Rate limiting (recomendado para producción)

## 📱 Responsive Design

El sistema está optimizado para:
- 📱 **Móviles** (< 768px)
- 📱 **Tablets** (768px - 1024px)
- 💻 **Desktop** (> 1024px)

## 🎯 Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **React Router** - Navegación
- **Lucide React** - Iconografía
- **Date-fns** - Manejo de fechas

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **MySQL2** - Driver de base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **CORS** - Política de origen cruzado

## 📈 Métricas y Reportes

El sistema incluye:
- 📊 Dashboard con KPIs principales
- 📈 Gráficos de ventas
- 🎯 Rutas más populares
- 💰 Ingresos por período
- 🚌 Ocupación de buses
- 👥 Estadísticas de personal

## 🚀 Despliegue en Producción

### Recomendaciones
1. **Base de datos**: MySQL en servidor dedicado
2. **Backend**: PM2 para gestión de procesos
3. **Frontend**: Build estático en CDN
4. **SSL**: Certificados HTTPS
5. **Backup**: Respaldos automáticos de BD
6. **Monitoring**: Logs y métricas

### Variables de entorno para producción
```env
NODE_ENV=production
DB_HOST=tu_servidor_mysql
JWT_SECRET=clave_super_segura_de_64_caracteres
CORS_ORIGIN=https://tu-dominio.com
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: soporte@norteexpreso.com
- 📱 Teléfono: +51 1 234-5678
- 🌐 Web: https://norteexpreso.com

---

**NORTEEXPRESO** - Conectando destinos, creando experiencias inolvidables 🚌✨