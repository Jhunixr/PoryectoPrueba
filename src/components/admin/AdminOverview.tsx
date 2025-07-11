import React, { useState } from 'react';
import { TrendingUp, Users, Bus, CreditCard, Calendar, AlertCircle, Plus, FileText, UserPlus, Route } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// Modals
import { NewTripModal } from './modals/NewTripModal';
import { NewBusModal } from './modals/NewBusModal';
import { NewEmployeeModal } from './modals/NewEmployeeModal';
import { NewRouteModal } from './modals/NewRouteModal';

export function AdminOverview() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    ventas_dia: 'S/ 0',
    pasajeros_hoy: '0',
    buses_operativos: '0',
    viajes_programados: '0'
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [showNewBusModal, setShowNewBusModal] = useState(false);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [showNewRouteModal, setShowNewRouteModal] = useState(false);

  useEffect(() => {
    cargarEstadisticas();
    cargarReservasRecientes();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('norteexpreso_token');
      const response = await fetch('http://localhost:3001/api/dashboard/estadisticas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          ventas_dia: `S/ ${data.ventas_hoy.ingresos.toFixed(2)}`,
          pasajeros_hoy: data.ventas_hoy.pasajeros.toString(),
          buses_operativos: data.buses_operativos.toString(),
          viajes_programados: data.viajes_programados.toString()
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarReservasRecientes = async () => {
    try {
      const token = localStorage.getItem('norteexpreso_token');
      const response = await fetch('http://localhost:3001/api/admin/pasajes/recientes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentBookings(data);
      }
    } catch (error) {
      console.error('Error al cargar reservas recientes:', error);
    }
  };

  const statsData = [
    {
      name: 'Ventas del día',
      value: stats.ventas_dia,
      change: '+12%',
      changeType: 'increase',
      icon: CreditCard,
    },
    {
      name: 'Pasajeros hoy',
      value: stats.pasajeros_hoy,
      change: '+5%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Buses operativos',
      value: stats.buses_operativos,
      change: '-2',
      changeType: 'decrease',
      icon: Bus,
    },
    {
      name: 'Viajes programados',
      value: stats.viajes_programados,
      change: '+3',
      changeType: 'increase',
      icon: Calendar,
    },
  ];


  const alerts = [
    {
      type: 'warning',
      message: 'Bus ABC-123 requiere mantenimiento preventivo',
      time: 'Hace 2 horas'
    },
    {
      type: 'info',
      message: 'Nueva ruta Lima-Iquitos disponible desde mañana',
      time: 'Hace 4 horas'
    },
    {
      type: 'error',
      message: 'Retraso en viaje V-456 por tráfico intenso',
      time: 'Hace 1 hora'
    },
  ];

  const quickActions = [
    {
      title: 'Nuevo Viaje',
      description: 'Programar un nuevo viaje',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setShowNewTripModal(true)
    },
    {
      title: 'Registrar Bus',
      description: 'Añadir nuevo bus a la flota',
      icon: Bus,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => setShowNewBusModal(true)
    },
    {
      title: 'Nuevo Empleado',
      description: 'Registrar nuevo empleado',
      icon: UserPlus,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => setShowNewEmployeeModal(true)
    },
    {
      title: 'Nueva Ruta',
      description: 'Crear nueva ruta de viaje',
      icon: Route,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => setShowNewRouteModal(true)
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('admin.dashboard')}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Resumen general de operaciones
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((item) => (
          <div key={item.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-azul-oscuro to-primary-600 rounded-xl flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <div className={`flex items-center text-sm font-medium ${
                    item.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      item.changeType === 'decrease' ? 'rotate-180' : ''
                    }`} />
                    {item.change}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    vs. ayer
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-amarillo-dorado" />
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group`}
              >
                <div className="flex flex-col items-center text-center">
                  <action.icon className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-lg mb-1">{action.title}</h4>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Reservas Recientes
            </h3>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pasajero
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ruta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {booking.passenger}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {booking.route}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.departure}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'Confirmado'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Alertas y Notificaciones
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewTripModal 
        isOpen={showNewTripModal} 
        onClose={() => setShowNewTripModal(false)} 
      />
      <NewBusModal 
        isOpen={showNewBusModal} 
        onClose={() => setShowNewBusModal(false)} 
      />
      <NewEmployeeModal 
        isOpen={showNewEmployeeModal} 
        onClose={() => setShowNewEmployeeModal(false)} 
      />
      <NewRouteModal 
        isOpen={showNewRouteModal} 
        onClose={() => setShowNewRouteModal(false)} 
      />
    </div>
  );
}