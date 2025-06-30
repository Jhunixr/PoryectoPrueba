import React, { useState } from 'react';
import { X, Bus, Hash, Building, Users } from 'lucide-react';

interface NewBusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewBusModal({ isOpen, onClose }: NewBusModalProps) {
  const [formData, setFormData] = useState({
    placa: '',
    fabricante: '',
    num_asientos: '',
    año: '',
    modelo: ''
  });

  const [loading, setLoading] = useState(false);

  const fabricantes = [
    'Mercedes Benz',
    'Scania',
    'Volvo',
    'Iveco',
    'MAN'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      alert('Bus registrado exitosamente');
      onClose();
      setFormData({
        placa: '',
        fabricante: '',
        num_asientos: '',
        año: '',
        modelo: ''
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
              <Bus className="h-6 w-6 mr-2 text-azul-oscuro" />
              Registrar Nuevo Bus
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
                  <Hash className="h-4 w-4 inline mr-1" />
                  Placa *
                </label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  placeholder="NTE-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Building className="h-4 w-4 inline mr-1" />
                  Fabricante *
                </label>
                <select
                  value={formData.fabricante}
                  onChange={(e) => setFormData(prev => ({ ...prev, fabricante: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar fabricante</option>
                  {fabricantes.map(fabricante => (
                    <option key={fabricante} value={fabricante}>{fabricante}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modelo
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  placeholder="O500RS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Año
                </label>
                <input
                  type="number"
                  value={formData.año}
                  onChange={(e) => setFormData(prev => ({ ...prev, año: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  placeholder="2024"
                  min="2000"
                  max="2030"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Número de Asientos *
                </label>
                <input
                  type="number"
                  value={formData.num_asientos}
                  onChange={(e) => setFormData(prev => ({ ...prev, num_asientos: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  placeholder="40"
                  min="20"
                  max="60"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Información adicional
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                El bus será registrado con estado "Operativo" por defecto. Podrás modificar su estado desde la gestión de buses.
              </p>
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
                    <span>Registrando...</span>
                  </>
                ) : (
                  <span>Registrar Bus</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}