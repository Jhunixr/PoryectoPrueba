import React, { useState } from 'react';
import { X, Calendar, MapPin, Bus, User, Clock } from 'lucide-react';

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTripModal({ isOpen, onClose }: NewTripModalProps) {
  const [formData, setFormData] = useState({
    ruta_codigo: '',
    bus_codigo: '',
    chofer_codigo: '',
    fecha: '',
    hora_salida: '',
    hora_llegada: ''
  });

  const [loading, setLoading] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [buses, setBuses] = useState([]);
  const [choferes, setChoferes] = useState([]);

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen]);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('norteexpreso_token');
      
      // Cargar rutas
      const rutasResponse = await fetch('http://localhost:3001/api/rutas');
      if (rutasResponse.ok) {
        const rutasData = await rutasResponse.json();
        setRutas(rutasData);
      }
      
      // Cargar buses
      const busesResponse = await fetch('http://localhost:3001/api/admin/buses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (busesResponse.ok) {
        const busesData = await busesResponse.json();
        setBuses(busesData.filter(bus => bus.estado === 'Operativo'));
      }
      
      // Cargar choferes
      const choferesResponse = await fetch('http://localhost:3001/api/admin/choferes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (choferesResponse.ok) {
        const choferesData = await choferesResponse.json();
        setChoferes(choferesData);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('norteexpreso_token');
      
      const viajeData = {
        ruta_codigo: parseInt(formData.ruta_codigo),
        bus_codigo: parseInt(formData.bus_codigo),
        chofer_codigo: parseInt(formData.chofer_codigo),
        fecha_hora_salida: `${formData.fecha} ${formData.hora_salida}:00`,
        fecha_hora_llegada_estimada: `${formData.fecha} ${formData.hora_llegada}:00`
      };
      
      const response = await fetch('http://localhost:3001/api/admin/viajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(viajeData)
      });
      
      if (response.ok) {
        alert('Viaje programado exitosamente');
        onClose();
        setFormData({
          ruta_codigo: '',
          bus_codigo: '',
          chofer_codigo: '',
          fecha: '',
          hora_salida: '',
          hora_llegada: ''
        });
        // Recargar la página para mostrar el nuevo viaje
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al programar viaje:', error);
      alert('Error al programar viaje');
    } finally {
      setLoading(false);
    }
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
                  value={formData.ruta_codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, ruta_codigo: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar ruta</option>
                  {rutas.map(ruta => (
                    <option key={ruta.codigo} value={ruta.codigo}>
                      {ruta.origen} - {ruta.destino} (S/ {ruta.costo_referencial})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Bus className="h-4 w-4 inline mr-1" />
                  Bus
                </label>
                <select
                  value={formData.bus_codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, bus_codigo: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar bus</option>
                  {buses.map(bus => (
                    <option key={bus.codigo} value={bus.codigo}>
                      {bus.placa} - {bus.fabricante} ({bus.num_asientos} asientos)
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
                  value={formData.chofer_codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, chofer_codigo: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar chofer</option>
                  {choferes.map(chofer => (
                    <option key={chofer.codigo} value={chofer.codigo}>
                      {chofer.nombre} {chofer.apellidos} - {chofer.licencia}
                    </option>
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