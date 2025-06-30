import React, { useState } from 'react';
import { X, Calendar, MapPin, Bus, User, Clock } from 'lucide-react';

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTripModal({ isOpen, onClose }: NewTripModalProps) {
  const [formData, setFormData] = useState({
    ruta: '',
    bus: '',
    chofer: '',
    fecha: '',
    hora_salida: '',
    hora_llegada: ''
  });

  const [loading, setLoading] = useState(false);

  const rutas = [
    { id: 1, nombre: 'Lima - Trujillo' },
    { id: 2, nombre: 'Lima - Chiclayo' },
    { id: 3, nombre: 'Lima - Piura' },
    { id: 4, nombre: 'Lima - Cajamarca' }
  ];

  const buses = [
    { id: 1, placa: 'NTE-001', fabricante: 'Mercedes Benz' },
    { id: 2, placa: 'NTE-002', fabricante: 'Scania' },
    { id: 3, placa: 'NTE-003', fabricante: 'Volvo' }
  ];

  const choferes = [
    { id: 1, nombre: 'Carlos Mendoza' },
    { id: 2, nombre: 'Luis García' },
    { id: 3, nombre: 'Miguel Torres' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      alert('Viaje programado exitosamente');
      onClose();
      setFormData({
        ruta: '',
        bus: '',
        chofer: '',
        fecha: '',
        hora_salida: '',
        hora_llegada: ''
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
              <Calendar className="h-6 w-6 mr-2 text-azul-oscuro" />
              Programar Nuevo Viaje
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
                  Ruta
                </label>
                <select
                  value={formData.ruta}
                  onChange={(e) => setFormData(prev => ({ ...prev, ruta: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar ruta</option>
                  {rutas.map(ruta => (
                    <option key={ruta.id} value={ruta.id}>{ruta.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Bus className="h-4 w-4 inline mr-1" />
                  Bus
                </label>
                <select
                  value={formData.bus}
                  onChange={(e) => setFormData(prev => ({ ...prev, bus: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar bus</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.placa} - {bus.fabricante}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Chofer
                </label>
                <select
                  value={formData.chofer}
                  onChange={(e) => setFormData(prev => ({ ...prev, chofer: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar chofer</option>
                  {choferes.map(chofer => (
                    <option key={chofer.id} value={chofer.id}>{chofer.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Hora de Salida
                </label>
                <input
                  type="time"
                  value={formData.hora_salida}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_salida: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Hora de Llegada
                </label>
                <input
                  type="time"
                  value={formData.hora_llegada}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_llegada: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
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
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Programar Viaje</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}