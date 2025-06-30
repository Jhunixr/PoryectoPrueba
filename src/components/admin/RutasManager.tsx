import React, { useState } from 'react';
import { Plus, Search, MapPin, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Ruta } from '../../types';

export function RutasManager()  {
  const [rutas, setRutas] = useState<Ruta[]>([
    {
      codigo: 1,
      origen: 'Lima',
      destino: 'Arequipa',
      costo_referencial: 45.00
    },
    {
      codigo: 2,
      origen: 'Lima',
      destino: 'Trujillo',
      costo_referencial: 35.00
    },
    {
      codigo: 3,
      origen: 'Lima',
      destino: 'Cusco',
      costo_referencial: 65.00
    },
    {
      codigo: 4,
      origen: 'Arequipa',
      destino: 'Cusco',
      costo_referencial: 40.00
    },
    {
      codigo: 5,
      origen: 'Lima',
      destino: 'Piura',
      costo_referencial: 55.00
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewRutaModal, setShowNewRutaModal] = useState(false);

  // Datos simulados de estadísticas por ruta
  const rutasStats = {
    1: { viajes_mes: 45, ocupacion_promedio: 85, ingresos_mes: 15750 },
    2: { viajes_mes: 60, ocupacion_promedio: 78, ingresos_mes: 18200 },
    3: { viajes_mes: 30, ocupacion_promedio: 92, ingresos_mes: 17940 },
    4: { viajes_mes: 25, ocupacion_promedio: 70, ingresos_mes: 7000 },
    5: { viajes_mes: 35, ocupacion_promedio: 82, ingresos_mes: 15925 },
  };

  const filteredRutas = rutas.filter(ruta =>
    ruta.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ruta.destino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIngresosMes = Object.values(rutasStats).reduce((sum, stats) => sum + stats.ingresos_mes, 0);
  const totalViajesMes = Object.values(rutasStats).reduce((sum, stats) => sum + stats.viajes_mes, 0);
  const ocupacionPromedio = Object.values(rutasStats).reduce((sum, stats) => sum + stats.ocupacion_promedio, 0) / Object.values(rutasStats).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-azul-oscuro">Gestión de Rutas</h1>
            <p className="mt-1 text-sm text-gris-suave">
              Administra las rutas disponibles y sus tarifas
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowNewRutaModal(true)}
              className="bg-azul-oscuro text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nueva Ruta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                {rutas.length}
              </h3>
              <p className="text-sm text-gris-suave">Rutas Activas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                S/ {totalIngresosMes.toLocaleString()}
              </h3>
              <p className="text-sm text-gris-suave">Ingresos del Mes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                {totalViajesMes}
              </h3>
              <p className="text-sm text-gris-suave">Viajes del Mes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                {ocupacionPromedio.toFixed(0)}%
              </h3>
              <p className="text-sm text-gris-suave">Ocupación Promedio</p>
            </div>
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
              placeholder="Buscar por origen o destino..."
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
            <option value="">Todas las ciudades origen</option>
            <option value="Lima">Lima</option>
            <option value="Arequipa">Arequipa</option>
            <option value="Cusco">Cusco</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
            <option value="">Ordenar por</option>
            <option value="precio_asc">Precio (menor a mayor)</option>
            <option value="precio_desc">Precio (mayor a menor)</option>
            <option value="popularidad">Popularidad</option>
          </select>
        </div>
      </div>

      {/* Rutas Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Viajes/Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ocupación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos/Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRutas.map((ruta) => {
                const stats = rutasStats[ruta.codigo as keyof typeof rutasStats] || { viajes_mes: 0, ocupacion_promedio: 0, ingresos_mes: 0 };
                
                return (
                  <tr key={ruta.codigo} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-azul-oscuro mr-3" />
                        <div>
                          <div className="text-sm font-medium text-azul-oscuro">
                            {ruta.origen} → {ruta.destino}
                          </div>
                          <div className="text-sm text-gris-suave">
                            Código: R{ruta.codigo.toString().padStart(3, '0')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-azul-oscuro">
                        S/ {ruta.costo_referencial.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-azul-oscuro">
                        {stats.viajes_mes}
                      </div>
                      <div className="text-sm text-gris-suave">
                        viajes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-azul-oscuro mr-2">
                          {stats.ocupacion_promedio}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              stats.ocupacion_promedio >= 80 ? 'bg-green-500' :
                              stats.ocupacion_promedio >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${stats.ocupacion_promedio}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-azul-oscuro">
                        S/ {stats.ingresos_mes.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-azul-oscuro hover:text-primary-600">
                          Ver
                        </button>
                        <button className="text-amarillo-dorado hover:text-yellow-600">
                          Editar
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          Horarios
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

      {/* Popular Routes Chart */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-medium text-azul-oscuro mb-4">
          Rutas Más Populares
        </h3>
        <div className="space-y-4">
          {filteredRutas
            .sort((a, b) => {
              const statsA = rutasStats[a.codigo as keyof typeof rutasStats] || { ocupacion_promedio: 0 };
              const statsB = rutasStats[b.codigo as keyof typeof rutasStats] || { ocupacion_promedio: 0 };
              return statsB.ocupacion_promedio - statsA.ocupacion_promedio;
            })
            .slice(0, 5)
            .map((ruta, index) => {
              const stats = rutasStats[ruta.codigo as keyof typeof rutasStats] || { ocupacion_promedio: 0, viajes_mes: 0 };
              return (
                <div key={ruta.codigo} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-yellow-600' : 'bg-azul-oscuro'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-azul-oscuro">
                        {ruta.origen} → {ruta.destino}
                      </div>
                      <div className="text-sm text-gris-suave">
                        {stats.viajes_mes} viajes este mes
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-azul-oscuro">
                      {stats.ocupacion_promedio}%
                    </div>
                    <div className="text-sm text-gris-suave">
                      ocupación
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}