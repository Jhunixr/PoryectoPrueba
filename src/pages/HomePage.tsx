import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchForm } from '../components/SearchForm';
import { PromotionCard } from '../components/PromotionCard';
import { Shield, Clock, Users, Star, CheckCircle, Award, Gift, Zap, Heart, TrendingUp, MapPin, Compass } from 'lucide-react';
import { SearchFilters } from '../types';
import { promotions, getFeaturedPromotions, Promotion } from '../data/promotions';
import { getPopularRoutes } from '../data/routes';

export function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (filters: SearchFilters) => {
    navigate('/search-results', { state: { filters } });
  };

  const handlePromotionSelect = (promotion: Promotion) => {
    const filters: SearchFilters = {
      origen: promotion.route.origen,
      destino: promotion.route.destino,
      fecha: new Date().toISOString().split('T')[0],
      pasajeros: 1
    };
    navigate('/search-results', { state: { filters, selectedPromotion: promotion } });
  };

  const featuredPromotions = getFeaturedPromotions();
  const popularRoutes = getPopularRoutes();

  const features = [
    {
      icon: Shield,
      title: 'Seguridad Garantizada',
      description: 'Conductores certificados y buses con mantenimiento preventivo',
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    },
    {
      icon: Clock,
      title: 'Puntualidad',
      description: 'Salidas puntuales y horarios confiables',
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      title: 'Comodidad Premium',
      description: 'Asientos reclinables, WiFi gratuito y servicios a bordo',
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    },
    {
      icon: Award,
      title: 'Excelencia Reconocida',
      description: 'Más de 30 años conectando el norte del Perú',
      color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
    }
  ];

  const loyaltyBenefits = [
    {
      icon: Gift,
      title: 'Descuentos Exclusivos',
      description: 'Hasta 20% de descuento en tus viajes al norte'
    },
    {
      icon: Zap,
      title: 'Check-in Prioritario',
      description: 'Evita las colas y aborda primero'
    },
    {
      icon: Heart,
      title: 'Puntos por Viaje',
      description: 'Acumula puntos y canjea viajes gratis'
    }
  ];

  return (
    <div className="min-h-screen bg-blanco-crema dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-azul-oscuro via-primary-700 to-primary-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-amarillo-dorado/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-amarillo-dorado/20 px-4 py-2 rounded-full mb-6 animate-bounce-subtle">
              <Compass className="h-5 w-5 text-amarillo-dorado" />
              <span className="text-sm font-medium">Especialistas en el Norte del Perú</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
              Descubre el <span className="text-amarillo-dorado">Norte</span>
              <br />del Perú
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-200 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in">
              Conectamos Lima con las maravillas del norte peruano. 
              Trujillo, Chiclayo, Piura, Cajamarca y más destinos te esperan.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto animate-slide-up">
            <SearchForm onSearch={handleSearch} />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            {[
              { number: '30+', label: 'Años conectando el norte' },
              { number: '8', label: 'Destinos norteños' },
              { number: '500K+', label: 'Pasajeros al norte/año' },
              { number: '99%', label: 'Satisfacción' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amarillo-dorado mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-300 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promociones Especiales */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900/20 px-4 py-2 rounded-full mb-6">
              <Gift className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Ofertas limitadas</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-azul-oscuro dark:text-white mb-6">
              Promociones Especiales
            </h2>
            <p className="text-xl text-gris-suave dark:text-gray-400 max-w-3xl mx-auto">
              Aprovecha nuestras ofertas exclusivas para descubrir el norte del Perú a precios increíbles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredPromotions.map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                onSelect={handlePromotionSelect}
              />
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/promotions')}
              className="bg-amarillo-dorado text-azul-oscuro px-8 py-4 rounded-xl font-semibold hover:bg-yellow-500 transition-colors text-lg"
            >
              Ver Todas las Promociones
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-blanco-crema dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-azul-oscuro/10 dark:bg-amarillo-dorado/20 px-4 py-2 rounded-full mb-6">
              <CheckCircle className="h-5 w-5 text-azul-oscuro dark:text-amarillo-dorado" />
              <span className="text-sm font-medium text-azul-oscuro dark:text-amarillo-dorado">Calidad garantizada</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-azul-oscuro dark:text-white mb-6">
              ¿Por qué elegir NORTEEXPRESO?
            </h2>
            <p className="text-xl text-gris-suave dark:text-gray-400 max-w-3xl mx-auto">
              Somos especialistas en conectar Lima con el norte del Perú con la mejor calidad de servicio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-500 border border-transparent hover:border-amarillo-dorado/20 dark:border-gray-700"
              >
                <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-azul-oscuro dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gris-suave dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinos Populares del Norte */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-full mb-6">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Destinos más visitados</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-azul-oscuro dark:text-white mb-6">
              Explora el Norte del Perú
            </h2>
            <p className="text-xl text-gris-suave dark:text-gray-400 max-w-3xl mx-auto">
              Desde las huacas milenarias de Trujillo hasta las playas paradisíacas de Tumbes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                city: 'Trujillo',
                subtitle: 'Ciudad de la Eterna Primavera',
                price: 'Desde S/ 24.50',
                duration: '8 horas',
                image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800',
                popular: true,
                attractions: ['Chan Chan', 'Huacas del Sol y Luna', 'Huanchaco']
              },
              {
                city: 'Chiclayo',
                subtitle: 'Capital Gastronómica del Norte',
                price: 'Desde S/ 30.00',
                duration: '10 horas',
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
                popular: true,
                attractions: ['Señor de Sipán', 'Pimentel', 'Mercado Modelo']
              },
              {
                city: 'Piura',
                subtitle: 'Puerta al Norte Tropical',
                price: 'Desde S/ 35.75',
                duration: '14 horas',
                image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
                popular: true,
                attractions: ['Catacaos', 'Sechura', 'Cerca de Máncora']
              }
            ].map((destination, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {destination.popular && (
                    <div className="absolute top-4 left-4 bg-amarillo-dorado text-azul-oscuro px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ Popular
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-azul-oscuro px-4 py-2 rounded-full font-bold">
                    {destination.price}
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-azul-oscuro dark:text-white mb-2">
                    {destination.city}
                  </h3>
                  <p className="text-amarillo-dorado font-medium mb-3">
                    {destination.subtitle}
                  </p>
                  <p className="text-gris-suave dark:text-gray-400 mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Duración: {destination.duration}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-azul-oscuro dark:text-white mb-2">Atractivos principales:</h4>
                    <div className="flex flex-wrap gap-2">
                      {destination.attractions.map((attraction, i) => (
                        <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full">
                          {attraction}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSearch({
                      origen: 'Lima',
                      destino: destination.city,
                      fecha: new Date().toISOString().split('T')[0],
                      pasajeros: 1
                    })}
                    className="w-full bg-azul-oscuro text-white py-3 px-6 rounded-xl hover:bg-primary-600 transition-colors font-semibold group-hover:bg-amarillo-dorado group-hover:text-azul-oscuro"
                  >
                    Ver Horarios
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program Section */}
      <section className="py-20 bg-gradient-to-r from-amarillo-dorado to-yellow-500 dark:from-yellow-600 dark:to-yellow-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-azul-oscuro dark:text-white mb-6">
              Programa de Fidelidad Norte
            </h2>
            <p className="text-xl text-azul-oscuro/80 dark:text-gray-200 max-w-3xl mx-auto">
              Viaja más al norte y obtén beneficios exclusivos en cada destino
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {loyaltyBenefits.map((benefit, index) => (
              <div key={index} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl text-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <div className="w-16 h-16 bg-azul-oscuro dark:bg-amarillo-dorado rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-amarillo-dorado dark:text-azul-oscuro" />
                </div>
                <h3 className="text-xl font-bold text-azul-oscuro dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gris-suave dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/loyalty')}
              className="bg-azul-oscuro text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors text-lg"
            >
              Únete Ahora - Es Gratis
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blanco-crema dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-azul-oscuro dark:text-white mb-6">
              Historias del Norte
            </h2>
            <p className="text-xl text-gris-suave dark:text-gray-400 max-w-3xl mx-auto">
              Conoce las experiencias de quienes han descubierto el norte del Perú con nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'María González',
                role: 'Turista de Lima',
                comment: 'Increíble viaje a Trujillo. Conocí Chan Chan y las Huacas del Sol y Luna. El bus súper cómodo y el servicio excelente.',
                rating: 5,
                avatar: '👩‍💼',
                destination: 'Trujillo'
              },
              {
                name: 'Carlos Mendoza',
                role: 'Familia viajera',
                comment: 'Llevamos a los niños a conocer Chiclayo. La gastronomía increíble y el viaje muy seguro. Recomendado 100%.',
                rating: 5,
                avatar: '👨‍👩‍👧‍👦',
                destination: 'Chiclayo'
              },
              {
                name: 'Ana Rodríguez',
                role: 'Estudiante universitaria',
                comment: 'Viajé a Piura para mis vacaciones. Precios justos y llegué puntual. Desde ahí fui a Máncora, ¡espectacular!',
                rating: 5,
                avatar: '👩‍🎓',
                destination: 'Piura'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amarillo-dorado fill-current" />
                  ))}
                </div>
                
                <p className="text-gris-suave dark:text-gray-400 mb-6 italic text-lg leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <p className="font-bold text-azul-oscuro dark:text-white text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-gris-suave dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-amarillo-dorado font-semibold">
                      Viajó a {testimonial.destination}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-azul-oscuro via-primary-700 to-primary-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute top-10 right-20 w-40 h-40 bg-amarillo-dorado/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            ¿Listo para descubrir el Norte?
          </h2>
          <p className="text-xl mb-12 text-gray-200 dark:text-gray-300 max-w-3xl mx-auto">
            Aprovecha nuestras promociones especiales y vive una experiencia única 
            en los destinos más fascinantes del norte peruano.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/search')}
              className="bg-amarillo-dorado text-azul-oscuro px-10 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 text-lg hover:scale-105"
            >
              Buscar Viajes al Norte
            </button>
            <button
              onClick={() => navigate('/promotions')}
              className="border-2 border-amarillo-dorado text-amarillo-dorado px-10 py-4 rounded-xl font-bold hover:bg-amarillo-dorado hover:text-azul-oscuro transition-all duration-300 text-lg hover:scale-105"
            >
              Ver Promociones
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}