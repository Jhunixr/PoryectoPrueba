import React, { useState } from 'react';
import { PromotionCard } from '../components/PromotionCard';
import { promotions, Promotion } from '../data/promotions';
import { SearchFilters } from '../types';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, MapPin, Calendar, Percent } from 'lucide-react';

export function PromotionsPage() {
  const navigate = useNavigate();
  const [filteredPromotions, setFilteredPromotions] = useState(promotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [sortBy, setSortBy] = useState('discount');

  const destinations = [...new Set(promotions.map(p => p.route.destino))];

  const handlePromotionSelect = (promotion: Promotion) => {
    const filters: SearchFilters = {
      origen: promotion.route.origen,
      destino: promotion.route.destino,
      fecha: new Date().toISOString().split('T')[0],
      pasajeros: 1
    };
    navigate('/search-results', { state: { filters, selectedPromotion: promotion } });
  };

  const handleFilter = () => {
    let filtered = promotions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(promo =>
        promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.route.destino.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by destination
    if (selectedDestination) {
      filtered = filtered.filter(promo => promo.route.destino === selectedDestination);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return b.discount - a.discount;
        case 'price':
          return a.discountedPrice - b.discountedPrice;
        case 'expiry':
          return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
        default:
          return 0;
      }
    });

    setFilteredPromotions(filtered);
  };

  React.useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedDestination, sortBy]);

  return (
    <div className="min-h-screen bg-blanco-crema py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full mb-6">
              <Percent className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-600">Ofertas especiales</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-azul-oscuro mb-6">
              Todas las Promociones
            </h1>
            <p className="text-xl text-gris-suave max-w-3xl mx-auto">
              Descubre todas nuestras ofertas especiales para viajar al norte del Perú con los mejores precios
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                  placeholder="Buscar promociones..."
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                >
                  <option value="">Todos los destinos</option>
                  {destinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
              >
                <option value="discount">Mayor descuento</option>
                <option value="price">Menor precio</option>
                <option value="expiry">Próximo a vencer</option>
              </select>

              <button
                onClick={handleFilter}
                className="bg-azul-oscuro text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Filter className="h-5 w-5" />
                <span>Filtrar</span>
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-8">
            <p className="text-gris-suave">
              Mostrando {filteredPromotions.length} promociones disponibles
            </p>
          </div>

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromotions.map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                onSelect={handlePromotionSelect}
              />
            ))}
          </div>

          {/* No results */}
          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-azul-oscuro mb-2">
                No se encontraron promociones
              </h3>
              <p className="text-gris-suave mb-6">
                Intenta ajustar los filtros para encontrar más ofertas.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDestination('');
                  setSortBy('discount');
                }}
                className="bg-azul-oscuro text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          )}

          {/* Newsletter signup */}
          <div className="mt-16 bg-gradient-to-r from-azul-oscuro to-primary-700 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              ¡No te pierdas nuestras ofertas!
            </h3>
            <p className="text-gray-200 mb-6">
              Suscríbete y recibe las mejores promociones directamente en tu email
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg text-azul-oscuro"
              />
              <button className="bg-amarillo-dorado text-azul-oscuro px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}