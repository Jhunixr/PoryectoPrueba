import React, { useState } from 'react';
import { X, MapPin, DollarSign, Clock, Route } from 'lucide-react';

interface NewRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewRouteModal({ isOpen, onClose }: NewRouteModalProps) {
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    costo_referencial: '',
    duracion_horas: '',
    distancia_km: '',
    descripcion: ''
  });

  const [loading, setLoading] = useState(false);

  const ciudades = [
    'Lima', 'Trujillo', 'Chiclayo', 'Piura', 'Cajamarca', 'Tumbes', 
    'Chimbote', 'Sullana', 'Talara', 'Paita', 'Lambayeque', 'Ferreñafe',
    'Arequipa', 'Cusco', 'Iquitos', 'Huancayo', 'Ayacucho'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      alert('Ruta creada exitosamente');
      onClose();
      setFormData({
        origen: '',
        destino: '',
        costo_referencial: '',
        duracion_horas: '',
        distancia_km: '',
        descripcion: ''
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Route className="h-6 w-6 mr-2 text-azul-oscuro" />
              Crear Nueva Ruta
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Ciudad de Origen *
                </label>
                <select
                  value={formData.origen}
                  onChange={(e) => setFormData(prev => ({ ...prev, origen: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar origen</option>
                  {ciudades.map(ciudad => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Ciudad de Destino *
                </label>
                <select
                  value={formData.destino}
                  onChange={(e) => setFormData(prev => ({ ...prev, destino: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar destino</option>
                  {ciudades.filter(ciudad => ciudad !== formData.origen).map(ciudad => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Costo Referencial (S/) *
                </label>
                <input
                  type="number"
                  value={formData.costo_referencial}
                  onChange={(e) => setFormData(prev => ({ ...prev, costo_referencial: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  min="0"
                  step="0.01"
                  placeholder="45.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Duración (horas) *
                </label>
                <input
                  type="number"
                  value={formData.duracion_horas}
                  onChange={(e) => setFormData(prev => ({ ...prev, duracion_horas: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="24"
                  placeholder="8"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Distancia (km)
                </label>
                <input
                  type="number"
                  value={formData.distancia_km}
                  onChange={(e) => setFormData(prev => ({ ...prev, distancia_km: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  min="1"
                  placeholder="560"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Descripción de la ruta y atractivos turísticos..."
                />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Vista previa de la ruta
              </h4>
              {formData.origen && formData.destino ? (
                <div className="text-sm text-green-700 dark:text-green-300">
                  <p><strong>Ruta:</strong> {formData.origen} → {formData.destino}</p>
                  {formData.costo_referencial && (
                    <p><strong>Precio:</strong> S/ {formData.costo_referencial}</p>
                  )}
                  {formData.duracion_horas && (
                    <p><strong>Duración:</strong> {formData.duracion_horas} horas</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-green-700 dark:text-green-300">
                  Selecciona origen y destino para ver la vista previa
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-azul-oscuro text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <span>Crear Ruta</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}