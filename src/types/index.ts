export interface Persona {
  codigo: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export interface Cliente extends Persona {
  razon_social?: string;
  ruc?: string;
  telefono?: string;
  email?: string;
}

export interface Ruta {
  codigo: number;
  origen: string;
  destino: string;
  costo_referencial: number;
  petFriendly?: boolean;
  costoMascota?: number;
}

export interface Bus {
  codigo: number;
  placa: string;
  fabricante: string;
  num_asientos: number;
  estado: string;
  petFriendly?: boolean;
}

export interface Viaje {
  codigo: number;
  fecha_hora_salida: string;
  fecha_hora_llegada_estimada: string;
  estado: string;
  ruta: Ruta;
  bus: Bus;
  chofer: Personal;
  asientos_disponibles: number;
  alquilerCompleto?: boolean;
  clienteAlquiler?: Cliente;
}

export interface Personal extends Persona {
  direccion: string;
  telefono: string;
  email: string;
  cargo: string;
  area: string;
}

export interface Pasaje {
  codigo: number;
  fecha_emision: string;
  asiento: number;
  importe_pagar: number;
  estado: string;
  viaje: Viaje;
  cliente: Cliente;
  telefono_contacto?: string;
  viaja_con_mascota?: boolean;
  tipo_mascota?: string;
  nombre_mascota?: string;
  cancelable?: boolean;
  fecha_limite_cancelacion?: string;
  metodo_pago?: string;
}

export interface Usuario {
  codigo: number;
  usuario: string;
  estado: string;
  personal: Personal;
  tipo_usuario: string;
}

export interface SearchFilters {
  origen: string;
  destino: string;
  fecha: string;
  pasajeros: number;
  conMascota?: boolean;
  alquilerCompleto?: boolean;
}

export interface ReporteBus {
  bus: {
    codigo: number;
    placa: string;
    fabricante: string;
  };
  viaje: {
    codigo: number;
    fecha_hora_salida: string;
    origen: string;
    destino: string;
  };
  ingresos: {
    total: number;
    pasajeros_adultos: number;
    pasajeros_menores: number;
    pasajeros_mascotas: number;
    precio_adulto: number;
    precio_menor: number;
    precio_mascota: number;
  };
  egresos: {
    combustible: number;
    peajes: number;
    cargaderos: number;
    otros: number;
    total: number;
  };
  medios_pago: {
    efectivo: number;
    yape: number;
    tarjeta: number;
    plin: number;
    otros: number;
  };
  utilidad: number;
}

export interface PoliticaCancelacion {
  horas_antes: number;
  porcentaje_devolucion: number;
  aplica_penalidad: boolean;
  monto_penalidad?: number;
}

export interface PoliticaMascota {
  peso_maximo: number;
  tipos_permitidos: string[];
  requiere_certificado: boolean;
  costo_adicional: number;
  asientos_especiales: boolean;
}