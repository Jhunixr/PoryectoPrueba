export interface RouteData {
  codigo: number;
  origen: string;
  destino: string;
  costo_referencial: number;
  duracion_horas: number;
  distancia_km: number;
  popular: boolean;
  descripcion: string;
  atractivos: string[];
}

export const northernRoutes: RouteData[] = [
  {
    codigo: 1,
    origen: 'Lima',
    destino: 'Trujillo',
    costo_referencial: 35.00,
    duracion_horas: 8,
    distancia_km: 560,
    popular: true,
    descripcion: 'La ciudad de la eterna primavera, cuna de la cultura Moche y Chimú',
    atractivos: ['Huacas del Sol y de la Luna', 'Chan Chan', 'Huanchaco', 'Centro Histórico']
  },
  {
    codigo: 2,
    origen: 'Lima',
    destino: 'Chiclayo',
    costo_referencial: 40.00,
    duracion_horas: 10,
    distancia_km: 770,
    popular: true,
    descripcion: 'Capital gastronómica del norte, tierra del Señor de Sipán',
    atractivos: ['Museo Tumbas Reales', 'Mercado Modelo', 'Pimentel', 'Lambayeque']
  },
  {
    codigo: 3,
    origen: 'Lima',
    destino: 'Piura',
    costo_referencial: 55.00,
    duracion_horas: 14,
    distancia_km: 970,
    popular: true,
    descripcion: 'Puerta de entrada al norte, cerca de las mejores playas',
    atractivos: ['Catacaos', 'Sechura', 'Máncora (cercano)', 'Centro Histórico']
  },
  {
    codigo: 4,
    origen: 'Lima',
    destino: 'Cajamarca',
    costo_referencial: 45.00,
    duracion_horas: 12,
    distancia_km: 870,
    popular: false,
    descripcion: 'Ciudad histórica en los Andes del norte',
    atractivos: ['Cuarto del Rescate', 'Baños del Inca', 'Ventanillas de Otuzco', 'Granja Porcón']
  },
  {
    codigo: 5,
    origen: 'Lima',
    destino: 'Tumbes',
    costo_referencial: 65.00,
    duracion_horas: 18,
    distancia_km: 1280,
    popular: false,
    descripcion: 'El paraíso tropical del Perú, playas de ensueño',
    atractivos: ['Punta Sal', 'Zorritos', 'Manglares de Tumbes', 'Puerto Pizarro']
  },
  {
    codigo: 6,
    origen: 'Lima',
    destino: 'Chimbote',
    costo_referencial: 30.00,
    duracion_horas: 6,
    distancia_km: 420,
    popular: false,
    descripcion: 'Principal puerto pesquero del Perú',
    atractivos: ['Puerto Pesquero', 'Isla Blanca', 'Nepeña', 'Casma']
  },
  {
    codigo: 7,
    origen: 'Trujillo',
    destino: 'Chiclayo',
    costo_referencial: 25.00,
    duracion_horas: 3,
    distancia_km: 210,
    popular: true,
    descripcion: 'Ruta costera entre dos importantes ciudades norteñas',
    atractivos: ['Pacasmayo', 'San Pedro de Lloc', 'Guadalupe']
  },
  {
    codigo: 8,
    origen: 'Chiclayo',
    destino: 'Piura',
    costo_referencial: 30.00,
    duracion_horas: 4,
    distancia_km: 280,
    popular: true,
    descripcion: 'Conecta la región Lambayeque con Piura',
    atractivos: ['Mórrope', 'Olmos', 'Motupe']
  }
];

export const getRouteByOriginDestination = (origen: string, destino: string): RouteData | undefined => {
  return northernRoutes.find(route => 
    route.origen === origen && route.destino === destino
  );
};

export const getPopularRoutes = (): RouteData[] => {
  return northernRoutes.filter(route => route.popular);
};