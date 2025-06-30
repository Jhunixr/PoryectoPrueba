import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchForm } from '../components/SearchForm';
import { SearchFilters } from '../types';

export function SearchPage() {
  const navigate = useNavigate();

  const handleSearch = (filters: SearchFilters) => {
    navigate('/search-results', { state: { filters } });
  };

  return (
    <div className="min-h-screen bg-blanco-crema py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-azul-oscuro mb-4">
              Buscar Viajes
            </h1>
            <p className="text-xl text-gris-suave">
              Encuentra el viaje perfecto para tu destino
            </p>
          </div>
          
          <SearchForm onSearch={handleSearch} className="animate-fade-in" />
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-azul-oscuro mb-4">
                Consejos para tu viaje
              </h3>
              <ul className="space-y-2 text-gris-suave">
                <li>• Llega 30 minutos antes de la salida</li>
                <li>• Trae tu documento de identidad</li>
                <li>• Equipaje de mano: máximo 8kg</li>
                <li>• Equipaje de bodega: máximo 20kg</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-azul-oscuro mb-4">
                Servicios incluidos
              </h3>
              <ul className="space-y-2 text-gris-suave">
                <li>• WiFi gratuito</li>
                <li>• Asientos reclinables</li>
                <li>• Aire acondicionado</li>
                <li>• Baño a bordo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}