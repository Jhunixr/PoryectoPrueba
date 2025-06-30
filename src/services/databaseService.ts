// Servicio para operaciones de base de datos
export interface PasajeData {
  viaje_codigo: number;
  cliente: {
    nombre: string;
    apellidos: string;
    dni: string;
    telefono?: string;
    email?: string;
  };
  asientos: number[];
  metodo_pago: string;
  telefono_contacto: string;
  viaja_con_mascota?: boolean;
  tipo_mascota?: string;
  nombre_mascota?: string;
  peso_mascota?: number;
  tutor_nombre?: string;
  tutor_dni?: string;
  permiso_notarial?: boolean;
}

export interface ViajeData {
  ruta_codigo: number;
  bus_codigo: number;
  chofer_codigo: number;
  fecha_hora_salida: string;
  fecha_hora_llegada_estimada: string;
}

class DatabaseService {
  private baseUrl = 'http://localhost:3001/api';

  async guardarPasaje(pasajeData: PasajeData): Promise<{ success: boolean; pasajes?: number[]; error?: string }> {
    try {
      console.log('Guardando pasaje en base de datos:', pasajeData);

      const response = await fetch(`${this.baseUrl}/pasajes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('norteexpreso_token')}`
        },
        body: JSON.stringify(pasajeData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Pasaje guardado exitosamente:', result);
        return { success: true, pasajes: result.pasajes };
      } else {
        const error = await response.json();
        console.error('Error guardando pasaje:', error);
        return { success: false, error: error.message || 'Error al guardar pasaje' };
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  async obtenerViajes(filtros: {
    origen: string;
    destino: string;
    fecha: string;
  }): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        origen: filtros.origen,
        destino: filtros.destino,
        fecha: filtros.fecha
      });

      const response = await fetch(`${this.baseUrl}/viajes/buscar?${params}`);
      
      if (response.ok) {
        const viajes = await response.json();
        return viajes;
      } else {
        console.error('Error obteniendo viajes:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error de conexión obteniendo viajes:', error);
      return [];
    }
  }

  async obtenerAsientosOcupados(viajeId: number): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/viajes/${viajeId}/asientos`);
      
      if (response.ok) {
        const asientos = await response.json();
        return asientos;
      } else {
        console.error('Error obteniendo asientos:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error de conexión obteniendo asientos:', error);
      return [];
    }
  }

  async obtenerRutas(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/rutas`);
      
      if (response.ok) {
        const rutas = await response.json();
        return rutas;
      } else {
        console.error('Error obteniendo rutas:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error de conexión obteniendo rutas:', error);
      return [];
    }
  }

  async registrarCliente(clienteData: {
    nombre: string;
    apellidos: string;
    dni: string;
    telefono?: string;
    email?: string;
  }): Promise<{ success: boolean; clienteId?: number; error?: string }> {
    try {
      console.log('Registrando cliente:', clienteData);

      const response = await fetch(`${this.baseUrl}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Cliente registrado exitosamente:', result);
        return { success: true, clienteId: result.clienteId };
      } else {
        const error = await response.json();
        console.error('Error registrando cliente:', error);
        return { success: false, error: error.message || 'Error al registrar cliente' };
      }
    } catch (error) {
      console.error('Error de conexión registrando cliente:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  async obtenerEstadisticas(): Promise<any> {
    try {
      const token = localStorage.getItem('norteexpreso_token');
      const response = await fetch(`${this.baseUrl}/dashboard/estadisticas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const estadisticas = await response.json();
        return estadisticas;
      } else {
        console.error('Error obteniendo estadísticas:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error de conexión obteniendo estadísticas:', error);
      return null;
    }
  }
}

export const databaseService = new DatabaseService();