export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  originalPrice: number;
  discountedPrice: number;
  validUntil: string;
  image: string;
  route: {
    origen: string;
    destino: string;
  };
  featured: boolean;
  limitedSeats: number;
  benefits: string[];
}

export const promotions: Promotion[] = [
  {
    id: 'promo-trujillo-2024',
    title: '¡Descubre Trujillo!',
    description: 'La ciudad de la eterna primavera te espera con sus huacas milenarias y playas espectaculares',
    discount: 30,
    originalPrice: 35.00,
    discountedPrice: 24.50,
    validUntil: '2024-03-31',
    image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800',
    route: {
      origen: 'Lima',
      destino: 'Trujillo'
    },
    featured: true,
    limitedSeats: 50,
    benefits: ['WiFi gratis', 'Snack incluido', 'Asiento premium']
  },
  {
    id: 'promo-chiclayo-2024',
    title: 'Chiclayo Gastronómico',
    description: 'Disfruta de la mejor gastronomía norteña en la capital gastronómica del Perú',
    discount: 25,
    originalPrice: 40.00,
    discountedPrice: 30.00,
    validUntil: '2024-04-15',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    route: {
      origen: 'Lima',
      destino: 'Chiclayo'
    },
    featured: true,
    limitedSeats: 40,
    benefits: ['Desayuno incluido', 'Manta de viaje', 'Descuento en restaurantes']
  },
  {
    id: 'promo-piura-2024',
    title: 'Piura Aventura',
    description: 'Explora las playas de Máncora y la cultura piurana en un viaje inolvidable',
    discount: 35,
    originalPrice: 55.00,
    discountedPrice: 35.75,
    validUntil: '2024-04-30',
    image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
    route: {
      origen: 'Lima',
      destino: 'Piura'
    },
    featured: true,
    limitedSeats: 30,
    benefits: ['Almohada de viaje', 'Agua gratis', 'Guía turística digital']
  },
  {
    id: 'promo-cajamarca-2024',
    title: 'Cajamarca Histórica',
    description: 'Conoce la tierra del Inca Atahualpa y sus paisajes montañosos únicos',
    discount: 20,
    originalPrice: 45.00,
    discountedPrice: 36.00,
    validUntil: '2024-05-15',
    image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
    route: {
      origen: 'Lima',
      destino: 'Cajamarca'
    },
    featured: false,
    limitedSeats: 25,
    benefits: ['Manta térmica', 'Té caliente', 'Música relajante']
  },
  {
    id: 'promo-tumbes-2024',
    title: 'Tumbes Tropical',
    description: 'Las mejores playas del norte peruano te esperan en esta promoción especial',
    discount: 40,
    originalPrice: 65.00,
    discountedPrice: 39.00,
    validUntil: '2024-06-01',
    image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
    route: {
      origen: 'Lima',
      destino: 'Tumbes'
    },
    featured: true,
    limitedSeats: 20,
    benefits: ['Asiento VIP', 'Comida gourmet', 'Entretenimiento a bordo']
  },
  {
    id: 'promo-chimbote-2024',
    title: 'Chimbote Pesquero',
    description: 'Descubre el puerto pesquero más importante del Perú y sus tradiciones marineras',
    discount: 15,
    originalPrice: 30.00,
    discountedPrice: 25.50,
    validUntil: '2024-04-20',
    image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    route: {
      origen: 'Lima',
      destino: 'Chimbote'
    },
    featured: false,
    limitedSeats: 35,
    benefits: ['Refrigerio marino', 'Revista de viaje', 'Descuento en marisquerías']
  }
];

export const getPromotionById = (id: string): Promotion | undefined => {
  return promotions.find(promo => promo.id === id);
};

export const getFeaturedPromotions = (): Promotion[] => {
  return promotions.filter(promo => promo.featured);
};