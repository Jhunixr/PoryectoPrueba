import React, { useState } from 'react';
import { Plus, Search, Bus, PenTool as Tool, CheckCircle, AlertCircle, Wrench, Calendar, MapPin, Users, Fuel, Settings } from 'lucide-react';

interface BusData {
  codigo: number;
  placa: string;
  fabricante: string;
  num_asientos: number;
  estado: string;
  ultimo_mantenimiento: string;
  proximo_mantenimiento: string;
  kilometraje: number;
  combustible: number;
  ubicacion: string;
  chofer_asignado?: string;
  viajes_completados: number;
  calificacion: number;
}

export function BusesManager() {
  const [buses, setBuses] = useState<BusData[]>([
    {
      codigo: 1,
      placa: 'NTE-001',
      fabricante: 'Mercedes Benz',
      num_asientos: 40,
      estado: 'Operativo',
      ultimo_mantenimiento: '2024-01-01',
      proximo_mantenimiento: '2024-04-01',
      kilometraje: 125000,
      combustible: 85,
      ubicacion: 'Terminal Lima',
      chofer_asignado: 'Carlos Mendoza',
      viajes_completados: 156,
      calificacion: 4.8
    },
    {
      codigo: 2,
      placa: 'NTE-002',
      fabricante: 'Scania',
      num_asientos: 44,
      estado: 'En Viaje',
      ultimo_mantenimiento: '2024-01-05',
      proximo_mantenimiento: '2024-04-05',
      kilometraje: 98000,
      combustible: 45,
      ubicacion: 'Ruta Lima-Trujillo',
      chofer_asignado: 'Luis García',
      viajes_completados: 142,
      calificacion: 4.9
    },
    {
      codigo: 3,
      placa: 'NTE-003',
      fabricante: 'Volvo',
      num_asientos: 36,
      estado: 'Mantenimiento',
      ultimo_mantenimiento: '2024-01-10',
      proximo_mantenimiento: '2024-01-15',
      kilometraje: 87000,
      combustible: 0,
      ubicacion: 'Taller Central',
      viajes_completados: 98,
      calificacion: 4.6
    },
    {
      codigo: 4,
      placa: 'NTE-004',
      fabricante: 'Mercedes Benz',
      num_asientos: 42,
      estado: 'Operativo',
      ultimo_mantenimiento: '2024-01-08',
      proximo_mantenimiento: '2024-04-08',
      kilometraje: 156000,
      combustible: 92,
      ubicacion: 'Terminal Chiclayo',
      chofer_asignado: 'Miguel Torres',
      viajes_completados: 203,
      calificacion: 4.7
    },
    {
      codigo: 5,
      placa: 'NTE-005',
      fabricante: 'Scania',
      num_asientos: 40,
      estado: 'Disponible',
      ultimo_mantenimiento: '2024-01-12',
      proximo_mantenimiento: '2024-04-12',
      kilometraje: 67000,
      combustible: 78,
      ubicacion: 'Terminal Lima',
      viajes_completados: 89,
      calificacion: 4.5
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewBusModal, setShowNewBusModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [showBusDetail, setShowBusDetail] = useState(false);
  const [view3D, setView3D] = useState(false);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return 'bg-green-100 text-green-800';
      case 'En Viaje':
        return 'bg-blue-100 text-blue-800';
      case 'Disponible':
        return 'bg-yellow-100 text-yellow-800';
      case 'Mantenimiento':
        return 'bg-orange-100 text-orange-800';
      case 'Fuera de Servicio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return CheckCircle;
      case 'En Viaje':
        return MapPin;
      case 'Disponible':
        return CheckCircle;
      case 'Mantenimiento':
        return Tool;
      case 'Fuera de Servicio':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getCombustibleColor = (nivel: number) => {
    if (nivel >= 70) return 'bg-green-500';
    if (nivel >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isMantenimientoProximo = (fechaProximoMantenimiento: string) => {
    const hoy = new Date();
    const fechaMantenimiento = new Date(fechaProximoMantenimiento);
    const diferenciaDias = Math.ceil((fechaMantenimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferenciaDias <= 7;
  };

  const filteredBuses = buses.filter(bus =>
    bus.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const BusDetail3D = ({ bus }: { bus: BusData }) => (
    <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-8 text-white">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Vista 3D - {bus.placa}</h3>
        <p className="text-blue-200">{bus.fabricante}</p>
      </div>
      
      {/* Representación 3D del bus */}
      <div className="relative mx-auto w-96 h-48 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-azul-oscuro to-primary-600 rounded-lg transform perspective-1000 rotate-y-12 shadow-2xl">
          {/* Cuerpo del bus */}
          <div className="w-full h-full relative">
            {/* Ventanas */}
            <div className="absolute top-2 left-4 right-4 h-8 bg-blue-300 rounded opacity-70 flex space-x-1 p-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex-1 bg-blue-100 rounded"></div>
              ))}
            </div>
            
            {/* Puerta */}
            <div className="absolute top-12 left-4 w-8 h-16 bg-gray-300 rounded"></div>
            
            {/* Ruedas */}
            <div className="absolute bottom-0 left-8 w-6 h-6 bg-gray-800 rounded-full"></div>
            <div className="absolute bottom-0 right-8 w-6 h-6 bg-gray-800 rounded-full"></div>
            
            {/* Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amarillo-dorado font-bold text-xs">
              NORTEEXPRESO
            </div>
          </div>
        </div>
      </div>

      {/* Información técnica */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Capacidad:</span>
            <span className="font-bold">{bus.num_asientos} asientos</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Kilometraje:</span>
            <span className="font-bold">{bus.kilometraje.toLocaleString()} km</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Viajes:</span>
            <span className="font-bold">{bus.viajes_completados}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Combustible:</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getCombustibleColor(bus.combustible)}`}
                  style={{ width: `${bus.combustible}%` }}
                />
              </div>
              <span className="font-bold text-sm">{bus.combustible}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Calificación:</span>
            <div className="flex items-center space-x-1">
              <span className="font-bold">{bus.calificacion}</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(bus.calificacion) ? 'text-yellow-400' : 'text-gray-400'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Estado:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getEstadoColor(bus.estado)}`}>
              {bus.estado}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-azul-oscuro">Gestión de Buses Inteligente</h1>
            <p className="mt-1 text-sm text-gris-suave">
              Control avanzado de la flota con monitoreo en tiempo real
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <button
              onClick={() => setView3D(!view3D)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Settings className="h-5 w-5" />
              <span>Vista {view3D ? '2D' : '3D'}</span>
            </button>
            <button
              onClick={() => setShowNewBusModal(true)}
              className="bg-azul-oscuro text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Registrar Bus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {buses.filter(b => b.estado === 'Operativo').length}
              </h3>
              <p className="text-green-100">Operativos</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {buses.filter(b => b.estado === 'En Viaje').length}
              </h3>
              <p className="text-blue-100">En Viaje</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {buses.filter(b => b.estado === 'Mantenimiento').length}
              </h3>
              <p className="text-orange-100">Mantenimiento</p>
            </div>
            <Tool className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {buses.filter(b => isMantenimientoProximo(b.proximo_mantenimiento)).length}
              </h3>
              <p className="text-red-100">Mant. Próximo</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {buses.length}
              </h3>
              <p className="text-purple-100">Total Flota</p>
            </div>
            <Bus className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro transition-colors"
              placeholder="Buscar por placa, fabricante, estado..."
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
            <option value="">Todos los estados</option>
            <option value="Operativo">Operativo</option>
            <option value="En Viaje">En Viaje</option>
            <option value="Disponible">Disponible</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Fuera de Servicio">Fuera de Servicio</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
            <option value="">Todos los fabricantes</option>
            <option value="Mercedes Benz">Mercedes Benz</option>
            <option value="Scania">Scania</option>
            <option value="Volvo">Volvo</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
            <option value="">Todas las ubicaciones</option>
            <option value="Terminal Lima">Terminal Lima</option>
            <option value="Terminal Chiclayo">Terminal Chiclayo</option>
            <option value="Taller Central">Taller Central</option>
          </select>
        </div>
      </div>

      {/* Vista 3D o Lista */}
      {view3D ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBuses.map((bus) => (
            <BusDetail3D key={bus.codigo} bus={bus} />
          ))}
        </div>
      ) : (
        /* Buses Table Mejorada */
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-azul-oscuro to-primary-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Bus
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Estado & Ubicación
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Combustible
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Mantenimiento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuses.map((bus) => {
                  const EstadoIcon = getEstadoIcon(bus.estado);
                  const mantenimientoProximo = isMantenimientoProximo(bus.proximo_mantenimiento);

                  return (
                    <tr key={bus.codigo} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-azul-oscuro to-primary-600 rounded-lg flex items-center justify-center mr-4">
                            <Bus className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-azul-oscuro">
                              {bus.placa}
                            </div>
                            <div className="text-sm text-gris-suave">
                              {bus.fabricante} • {bus.num_asientos} asientos
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gris-suave mr-2">Calificación:</span>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-xs ${i < Math.floor(bus.calificacion) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-gris-suave ml-1">({bus.calificacion})</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center mb-2">
                          <EstadoIcon className="h-5 w-5 mr-2" />
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEstadoColor(bus.estado)}`}>
                            {bus.estado}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gris-suave">
                          <MapPin className="h-4 w-4 mr-1" />
                          {bus.ubicacion}
                        </div>
                        {bus.chofer_asignado && (
                          <div className="flex items-center text-sm text-gris-suave mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            {bus.chofer_asignado}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Fuel className="h-4 w-4 mr-2 text-gris-suave" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-azul-oscuro">{bus.combustible}%</span>
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${getCombustibleColor(bus.combustible)}`}
                                style={{ width: `${bus.combustible}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-azul-oscuro">
                            Último: {new Date(bus.ultimo_mantenimiento).toLocaleDateString('es-PE')}
                          </div>
                          <div className={`text-sm ${mantenimientoProximo ? 'text-red-600 font-semibold' : 'text-gris-suave'}`}>
                            Próximo: {new Date(bus.proximo_mantenimiento).toLocaleDateString('es-PE')}
                            {mantenimientoProximo && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Urgente
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-azul-oscuro">
                            {bus.kilometraje.toLocaleString()} km
                          </div>
                          <div className="text-sm text-gris-suave">
                            {bus.viajes_completados} viajes
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            Eficiencia: {((bus.viajes_completados / (bus.kilometraje / 1000)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={() => {
                              setSelectedBus(bus);
                              setShowBusDetail(true);
                            }}
                            className="text-azul-oscuro hover:text-primary-600 text-left"
                          >
                            Ver Detalle
                          </button>
                          <button className="text-amarillo-dorado hover:text-yellow-600 text-left">
                            Editar
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-left">
                            Mantenimiento
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 text-left">
                            Asignar Viaje
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Detalle del Bus */}
      {showBusDetail && selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-azul-oscuro">
                  Detalle del Bus {selectedBus.placa}
                </h2>
                <button
                  onClick={() => setShowBusDetail(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <BusDetail3D bus={selectedBus} />

              {/* Información adicional */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-azul-oscuro mb-4">Historial de Viajes</h3>
                  <div className="space-y-3">
                    {[
                      { fecha: '2024-01-15', ruta: 'Lima - Trujillo', duracion: '8h 30m', pasajeros: 38 },
                      { fecha: '2024-01-14', ruta: 'Trujillo - Lima', duracion: '8h 45m', pasajeros: 42 },
                      { fecha: '2024-01-13', ruta: 'Lima - Chiclayo', duracion: '10h 15m', pasajeros: 35 }
                    ].map((viaje, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <div className="font-medium text-azul-oscuro">{viaje.ruta}</div>
                          <div className="text-sm text-gris-suave">{viaje.fecha}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{viaje.duracion}</div>
                          <div className="text-sm text-gris-suave">{viaje.pasajeros} pasajeros</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-azul-oscuro mb-4">Mantenimiento</h3>
                  <div className="space-y-3">
                    {[
                      { tipo: 'Cambio de aceite', fecha: '2024-01-01', costo: 'S/ 250' },
                      { tipo: 'Revisión de frenos', fecha: '2023-12-15', costo: 'S/ 180' },
                      { tipo: 'Cambio de llantas', fecha: '2023-11-20', costo: 'S/ 800' }
                    ].map((mantenimiento, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <div className="font-medium text-azul-oscuro">{mantenimiento.tipo}</div>
                          <div className="text-sm text-gris-suave">{mantenimiento.fecha}</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          {mantenimiento.costo}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}