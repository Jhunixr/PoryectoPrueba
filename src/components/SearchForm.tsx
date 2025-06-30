import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Heart, Bus } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export function SearchForm({ onSearch, className = '' }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    origen: '',
    destino: '',
    fecha: '',
    pasajeros: 1,
    conMascota: false,
    alquilerCompleto: false
  });

  // Ciudades del norte del Perú
  const ciudadesNorte = [
    'Lima', 'Trujillo', 'Chiclayo', 'Piura', 'Cajamarca', 'Tumbes', 
    'Chimbote', 'Sullana', 'Talara', 'Paita', 'Lambayeque', 'Ferreñafe'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.origen && filters.destino && filters.fecha) {
      onSearch(filters);
    }
  };

  const handleInputChange = (field: keyof SearchFilters, value: string | number | boolean) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getAvailableDestinations = () => {
    if (!filters.origen) return ciudadesNorte;
    return ciudadesNorte.filter(ciudad => ciudad !== filters.origen);
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Origen */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="inline h-4 w-4 mr-1 text-azul-oscuro dark:text-amarillo-dorado" />
            Origen
          </label>
          <select
            value={filters.origen}
            onChange={(e) => handleInputChange('origen', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-colors"
            required
          >
            <option value="">Seleccionar ciudad</option>
            {ciudadesNorte.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
        </div>

        {/* Destino */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="inline h-4 w-4 mr-1 text-azul-oscuro dark:text-amarillo-dorado" />
            Destino
          </label>
          <select
            value={filters.destino}
            onChange={(e) => handleInputChange('destino', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-colors"
            required
          >
            <option value="">Seleccionar ciudad</option>
            {getAvailableDestinations().map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="inline h-4 w-4 mr-1 text-azul-oscuro dark:text-amarillo-dorado" />
            Fecha de viaje
          </label>
          <input
            type="date"
            value={filters.fecha}
            onChange={(e) => handleInputChange('fecha', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>

        {/* Pasajeros */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users className="inline h-4 w-4 mr-1 text-azul-oscuro dark:text-amarillo-dorado" />
            Pasajeros
          </label>
          <select
            value={filters.pasajeros}
            onChange={(e) => handleInputChange('pasajeros', parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-colors"
            disabled={filters.alquilerCompleto}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'pasajero' : 'pasajeros'}</option>
            ))}
          </select>
        </div>

        {/* Botón de búsqueda */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-azul-oscuro dark:bg-amarillo-dorado text-white dark:text-azul-oscuro p-3 rounded-lg hover:bg-primary-600 dark:hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <Search className="h-5 w-5" />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {/* Opciones adicionales */}
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.conMascota || false}
            onChange={(e) => handleInputChange('conMascota', e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-azul-oscuro focus:ring-azul-oscuro dark:bg-gray-700"
          />
          <Heart className="h-4 w-4 text-pink-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Viajo con mascota (Pet Friendly)</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.alquilerCompleto || false}
            onChange={(e) => {
              handleInputChange('alquilerCompleto', e.target.checked);
              if (e.target.checked) {
                handleInputChange('pasajeros', 40); // Capacidad completa del bus
              }
            }}
            className="rounded border-gray-300 dark:border-gray-600 text-azul-oscuro focus:ring-azul-oscuro dark:bg-gray-700"
          />
          <Bus className="h-4 w-4 text-azul-oscuro dark:text-amarillo-dorado" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Alquiler completo del bus</span>
        </label>
      </div>

      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Rutas populares:</span>
        {[
          { origen: 'Lima', destino: 'Trujillo' },
          { origen: 'Lima', destino: 'Chiclayo' },
          { origen: 'Lima', destino: 'Piura' }
        ].map((route, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setFilters(prev => ({
                ...prev,
                origen: route.origen,
                destino: route.destino,
                fecha: prev.fecha || new Date().toISOString().split('T')[0]
              }));
            }}
            className="text-sm bg-azul-oscuro/10 dark:bg-amarillo-dorado/20 text-azul-oscuro dark:text-amarillo-dorado px-3 py-1 rounded-full hover:bg-azul-oscuro/20 dark:hover:bg-amarillo-dorado/30 transition-colors"
          >
            {route.origen} → {route.destino}
          </button>
        ))}
      </div>
    </form>
  );
}