// Servicio para notificaciones
export interface NotificationData {
  pasajeroId: string;
  telefono: string;
  mensaje: string;
  fechaEnvio: Date;
  tipo: 'sms' | 'whatsapp';
}

class NotificationService {
  async enviarNotificacionPreViaje(
    telefono: string, 
    nombrePasajero: string, 
    origen: string, 
    destino: string, 
    horaSalida: string,
    placa: string
  ): Promise<boolean> {
    try {
      const mensaje = `Hola ${nombrePasajero}! Tu bus ${placa} sale en 30 minutos desde ${origen} hacia ${destino} a las ${horaSalida}. ¡Buen viaje! - NORTEEXPRESO`;
      
      // Simulación de envío de SMS/WhatsApp
      console.log('Enviando notificación:', { telefono, mensaje });
      
      // Aquí iría la integración real con servicios como Twilio, etc.
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return false;
    }
  }

  async programarNotificacion(
    telefono: string,
    nombrePasajero: string,
    fechaHoraSalida: string,
    origen: string,
    destino: string,
    placa: string
  ): Promise<void> {
    const fechaSalida = new Date(fechaHoraSalida);
    const fechaNotificacion = new Date(fechaSalida.getTime() - 30 * 60 * 1000); // 30 minutos antes
    
    const ahora = new Date();
    const tiempoEspera = fechaNotificacion.getTime() - ahora.getTime();
    
    if (tiempoEspera > 0) {
      setTimeout(() => {
        this.enviarNotificacionPreViaje(
          telefono,
          nombrePasajero,
          origen,
          destino,
          fechaSalida.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          placa
        );
      }, tiempoEspera);
    }
  }
}

export const notificationService = new NotificationService();