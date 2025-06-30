import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, MapPin, Bus, User } from 'lucide-react';
import { Viaje } from '../../types';

export function ViajesManager() {
  const [viajes, setViajes] = useState<Viaje[]>([
    {
      codigo: 1,
      fecha_hora_salida: '2024-01-15T08:00:00',
      fecha_hora_llegada_estimada: '2024-01-15T16:00:00',
      estado: 'Programado',
      ruta: {
        codigo: 1,
        origen: 'Lima',
        destino: 'Arequipa',
        costo_referencial: 45.00
      },
      bus: {
        codigo: 1,
        placa: 'ABC-123',
        fabricante: 'Mercedes Benz',
        num_asientos: 40,
        estado: 'Operativo'
      },
      chofer: {
        codigo: 1,
        nombre: 'Juan',
        apellidos: 'Pérez',
        dni: '12345678',
        direccion: 'Lima',
        telefono: '999999999',
        email: 'juan@norteexpreso.com',
        cargo: 'Chofer',
        area: 'Operaciones'
      },
      asientos_disponibles: 35
    },
    {
      codigo: 2,
      fecha_hora_salida: '2024-01-15T14:00:00',
      fecha_hora_llegada_estimada: '2024-01-15T22:00:00',
      estado: 'En Curso',
      ruta: {
        codigo: 2,
        origen: 'Lima',
        destino: 'Trujillo',
        costo_referencial: 35.00
      },
      bus: {
        codigo: 2,
        placa: 'DEF-456',
        fabricante: 'Scania',
        num_asientos: 44,
        estado: 'Operativo'
      },
      chofer: {
        codigo: 2,
        nombre: 'Carlos',
        apellidos: 'García',
        dni: '87654321',
        direccion: 'Lima',
        telefono: '888888888',
        email: 'carlos@norteexpreso.com',
        cargo: 'Chofer',
        area: 'Operaciones'
      },
      asientos_disponibles: 20
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewViajeModal, setShowNewViajeModal] = useState(false);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programado':
        return 'bg-blue-100 text-blue-800';
      case 'En Curso':
        return 'bg-green-100 text-green-800';
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('es-PE'),
      time: date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredViajes = viajes.filter(viaje =>
    viaje.ruta.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    viaje.ruta.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    viaje.bus.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    viaje.chofer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    viaje.chofer.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-azul-oscuro">Gestión de Viajes</h1>
            <p className="mt-1 text-sm text-gris-suave">
              Administra los viajes programados y en curso
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowNewViajeModal(true)}
              className="bg-azul-oscuro text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Viaje</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
              placeholder="Buscar por ruta, placa o chofer..."
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
            <option value="">Todos los estados</option>
            <option value="Programado">Programado</option>
            <option value="En Curso">En Curso</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
          />
        </div>
      </div>

      {/* Viajes Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chofer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ocupación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredViajes.map((viaje) => {
                const salida = formatDateTime(viaje.fecha_hora_salida);
                const llegada = formatDateTime(viaje.fecha_hora_llegada_estimada);
                const ocupacion = viaje.bus.num_asientos - viaje.asientos_disponibles;
                const porcentajeOcupacion = (ocupacion / viaje.bus.num_asientos) * 100;

                return (
                  <tr key={viaje.codigo} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-azul-oscuro mr-2" />
                        <div>
                          <div className="text-sm font-medium text-azul-oscuro">
                            {viaje.ruta.origen} → {viaje.ruta.destino}
                          </div>
                          <div className="text-sm text-gris-suave">
                            S/ {viaje.ruta.costo_referencial.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-azul-oscuro mr-2" />
                        <div>
                          <div className="text-sm font-medium text-azul-oscuro">
                            {salida.time} - {llegada.time}
                          </div>
                          <div className="text-sm text-gris-suave">
                            {salida.date}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bus className="h-5 w-5 text-azul-oscuro mr-2" />
                        <div>
                          <div className="text-sm font-medium text-azul-oscuro">
                            {viaje.bus.placa}
                          </div>
                          <div className="text-sm text-gris-suave">
                            {viaje.bus.fabricante}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-azul-oscuro mr-2" />
                        <div>
                          <div className="text-sm font-medium text-azul-oscuro">
                            {viaje.chofer.nombre} {viaje.chofer.apellidos}
                          </div>
                          <div className="text-sm text-gris-suave">
                            DNI: {viaje.chofer.dni}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-azul-oscuro">
                          {ocupacion}/{viaje.bus.num_asientos}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              porcentajeOcupacion >= 80 ? 'bg-red-500' :
                              porcentajeOcupacion >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${porcentajeOcupacion}%` }}
                          />
                        </div>
                        <div className="text-xs text-gris-suave mt-1">
                          {porcentajeOcupacion.toFixed(0)}% ocupado
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(viaje.estado)}`}>
                        {viaje.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-azul-oscuro hover:text-primary-600">
                          Ver
                        </button>
                        <button className="text-amarillo-dorado hover:text-yellow-600">
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          Cancelar
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

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-lg">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Anterior
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredViajes.length}</span> de{' '}
              <span className="font-medium">{viajes.length}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Anterior
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-azul-oscuro text-sm font-medium text-white">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}