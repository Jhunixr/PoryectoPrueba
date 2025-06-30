import React, { useState } from 'react';
import { Search, Filter, Download, CreditCard, User, Calendar, MapPin, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { Pasaje, PoliticaCancelacion } from '../../types';

export function PasajesManager() {
  const [pasajes, setPasajes] = useState<Pasaje[]>([
    {
      codigo: 1,
      fecha_emision: '2024-01-15T10:30:00',
      asiento: 15,
      importe_pagar: 45.00,
      estado: 'Vendido',
      telefono_contacto: '999888777',
      metodo_pago: 'tarjeta',
      cancelable: true,
      fecha_limite_cancelacion: '2024-01-15T06:00:00',
      viaje: {
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
      cliente: {
        codigo: 1,
        nombre: 'María',
        apellidos: 'González',
        dni: '87654321',
        razon_social: undefined,
        ruc: undefined
      }
    },
    {
      codigo: 2,
      fecha_emision: '2024-01-15T11:15:00',
      asiento: 8,
      importe_pagar: 50.00,
      estado: 'Vendido',
      telefono_contacto: '888777666',
      metodo_pago: 'yape',
      viaja_con_mascota: true,
      tipo_mascota: 'Perro',
      nombre_mascota: 'Max',
      cancelable: true,
      fecha_limite_cancelacion: '2024-01-15T12:00:00',
      viaje: {
        codigo: 2,
        fecha_hora_salida: '2024-01-15T14:00:00',
        fecha_hora_llegada_estimada: '2024-01-15T22:00:00',
        estado: 'Programado',
        ruta: {
          codigo: 2,
          origen: 'Lima',
          destino: 'Trujillo',
          costo_referencial: 35.00,
          petFriendly: true,
          costoMascota: 15.00
        },
        bus: {
          codigo: 2,
          placa: 'DEF-456',
          fabricante: 'Scania',
          num_asientos: 44,
          estado: 'Operativo',
          petFriendly: true
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
      cliente: {
        codigo: 2,
        nombre: 'Carlos',
        apellidos: 'Mendoza',
        dni: '11223344',
        razon_social: undefined,
        ruc: undefined
      }
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterFecha, setFilterFecha] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPasaje, setSelectedPasaje] = useState<Pasaje | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Políticas de cancelación
  const politicasCancelacion: PoliticaCancelacion[] = [
    { horas_antes: 2, porcentaje_devolucion: 100, aplica_penalidad: false },
    { horas_antes: 1, porcentaje_devolucion: 50, aplica_penalidad: true, monto_penalidad: 10 },
    { horas_antes: 0, porcentaje_devolucion: 0, aplica_penalidad: true, monto_penalidad: 0 }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Vendido':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'No Show':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getMetodoPagoIcon = (metodo: string) => {
    switch (metodo) {
      case 'tarjeta': return '💳';
      case 'yape': return '📱';
      case 'plin': return '💰';
      case 'efectivo': return '💵';
      default: return '💳';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('es-PE'),
      time: date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const calcularPoliticaCancelacion = (pasaje: Pasaje) => {
    const ahora = new Date();
    const fechaSalida = new Date(pasaje.viaje.fecha_hora_salida);
    const horasRestantes = (fechaSalida.getTime() - ahora.getTime()) / (1000 * 60 * 60);
    
    for (const politica of politicasCancelacion) {
      if (horasRestantes >= politica.horas_antes) {
        return politica;
      }
    }
    
    return politicasCancelacion[politicasCancelacion.length - 1];
  };

  const puedeSerCancelado = (pasaje: Pasaje) => {
    if (pasaje.estado !== 'Vendido') return false;
    
    const ahora = new Date();
    const fechaSalida = new Date(pasaje.viaje.fecha_hora_salida);
    
    return fechaSalida > ahora;
  };

  const handleCancelarPasaje = (pasaje: Pasaje) => {
    setSelectedPasaje(pasaje);
    setShowCancelModal(true);
  };

  const confirmarCancelacion = () => {
    if (!selectedPasaje || !cancelReason.trim()) return;

    const politica = calcularPoliticaCancelacion(selectedPasaje);
    const montoDevolucion = (selectedPasaje.importe_pagar * politica.porcentaje_devolucion) / 100;
    const penalidad = politica.aplica_penalidad ? (politica.monto_penalidad || 0) : 0;
    const montoFinal = montoDevolucion - penalidad;

    // Actualizar el estado del pasaje
    setPasajes(prev => prev.map(p => 
      p.codigo === selectedPasaje.codigo 
        ? { ...p, estado: 'Cancelado' }
        : p
    ));

    alert(`Pasaje cancelado exitosamente.\nMonto a devolver: S/ ${montoFinal.toFixed(2)}\nRazón: ${cancelReason}`);
    
    setShowCancelModal(false);
    setSelectedPasaje(null);
    setCancelReason('');
  };

  const filteredPasajes = pasajes.filter(pasaje => {
    const matchesSearch = 
      pasaje.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pasaje.cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pasaje.cliente.dni.includes(searchTerm) ||
      pasaje.viaje.ruta.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pasaje.viaje.ruta.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pasaje.codigo.toString().includes(searchTerm);

    const matchesEstado = !filterEstado || pasaje.estado === filterEstado;
    
    const matchesFecha = !filterFecha || 
      pasaje.fecha_emision.startsWith(filterFecha);

    return matchesSearch && matchesEstado && matchesFecha;
  });

  const totalVentas = filteredPasajes
    .filter(p => p.estado === 'Vendido')
    .reduce((sum, p) => sum + p.importe_pagar, 0);

  const ventasHoy = filteredPasajes
    .filter(p => p.estado === 'Vendido' && p.fecha_emision.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum, p) => sum + p.importe_pagar, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-azul-oscuro dark:text-white">Gestión de Pasajes</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra las ventas y reservas de pasajes
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white">
                S/ {totalVentas.toFixed(2)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Ventas</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white">
                S/ {ventasHoy.toFixed(2)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ventas Hoy</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white">
                {filteredPasajes.filter(p => p.estado === 'Vendido').length}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pasajes Vendidos</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <X className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white">
                {filteredPasajes.filter(p => p.estado === 'Cancelado').length}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cancelados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
              placeholder="Buscar por cliente, DNI, ruta..."
            />
          </div>
          <select 
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los estados</option>
            <option value="Vendido">Vendido</option>
            <option value="Cancelado">Cancelado</option>
            <option value="No Show">No Show</option>
          </select>
          <input
            type="date"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
          />
          <button className="bg-azul-oscuro dark:bg-amarillo-dorado text-white dark:text-azul-oscuro px-4 py-2 rounded-lg hover:bg-primary-600 dark:hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtrar</span>
          </button>
        </div>
      </div>

      {/* Pasajes Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pasaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Viaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Detalles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPasajes.map((pasaje) => {
                const emision = formatDateTime(pasaje.fecha_emision);
                const salida = formatDateTime(pasaje.viaje.fecha_hora_salida);

                return (
                  <tr key={pasaje.codigo} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-azul-oscuro dark:text-white">
                          #{pasaje.codigo.toString().padStart(6, '0')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {emision.date} {emision.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-azul-oscuro dark:text-amarillo-dorado mr-2" />
                        <div>
                          <div className="text-sm font-medium text-azul-oscuro dark:text-white">
                            {pasaje.cliente.nombre} {pasaje.cliente.apellidos}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            DNI: {pasaje.cliente.dni}
                          </div>
                          {pasaje.telefono_contacto && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              📞 {pasaje.telefono_contacto}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-azul-oscuro dark:text-amarillo-dorado mr-2" />
                        <div>
                          <div className="text-sm font-medium text-azul-oscuro dark:text-white">
                            {pasaje.viaje.ruta.origen} → {pasaje.viaje.ruta.destino}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {salida.date} {salida.time}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-azul-oscuro dark:text-white">
                          Asiento {pasaje.asiento}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Bus: {pasaje.viaje.bus.placa}
                        </div>
                        {pasaje.viaja_con_mascota && (
                          <div className="text-pink-600 dark:text-pink-400 text-xs">
                            🐾 {pasaje.tipo_mascota}: {pasaje.nombre_mascota}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-azul-oscuro dark:text-white">
                          S/ {pasaje.importe_pagar.toFixed(2)}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="mr-1">{getMetodoPagoIcon(pasaje.metodo_pago || 'tarjeta')}</span>
                          {pasaje.metodo_pago || 'Tarjeta'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(pasaje.estado)}`}>
                        {pasaje.estado}
                      </span>
                      {puedeSerCancelado(pasaje) && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Cancelable
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <button className="text-azul-oscuro dark:text-amarillo-dorado hover:text-primary-600 dark:hover:text-yellow-500 text-left">
                          Ver
                        </button>
                        <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-left">
                          Imprimir
                        </button>
                        {puedeSerCancelado(pasaje) && (
                          <button 
                            onClick={() => handleCancelarPasaje(pasaje)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-left"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cancelación */}
      {showCancelModal && selectedPasaje && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-azul-oscuro dark:text-white flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
                  Cancelar Pasaje
                </h2>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-azul-oscuro dark:text-white mb-2">Información del Pasaje</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Pasajero:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedPasaje.cliente.nombre} {selectedPasaje.cliente.apellidos}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Ruta:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedPasaje.viaje.ruta.origen} → {selectedPasaje.viaje.ruta.destino}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Asiento:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedPasaje.asiento}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Importe:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      S/ {selectedPasaje.importe_pagar.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {(() => {
                const politica = calcularPoliticaCancelacion(selectedPasaje);
                const montoDevolucion = (selectedPasaje.importe_pagar * politica.porcentaje_devolucion) / 100;
                const penalidad = politica.aplica_penalidad ? (politica.monto_penalidad || 0) : 0;
                const montoFinal = montoDevolucion - penalidad;

                return (
                  <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Política de Cancelación</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-yellow-700 dark:text-yellow-300">Porcentaje de devolución:</span>
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">{politica.porcentaje_devolucion}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-700 dark:text-yellow-300">Monto a devolver:</span>
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">S/ {montoDevolucion.toFixed(2)}</span>
                      </div>
                      {politica.aplica_penalidad && (
                        <div className="flex justify-between">
                          <span className="text-yellow-700 dark:text-yellow-300">Penalidad:</span>
                          <span className="font-medium text-red-600 dark:text-red-400">-S/ {penalidad.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-yellow-300 dark:border-yellow-700 pt-2 flex justify-between">
                        <span className="font-semibold text-yellow-800 dark:text-yellow-200">Total a devolver:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">S/ {montoFinal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivo de cancelación *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Ingrese el motivo de la cancelación..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCancelacion}
                  disabled={!cancelReason.trim()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Confirmar Cancelación</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-azul-oscuro dark:text-white mb-2">
              Resumen de Ventas
            </h4>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              S/ {totalVentas.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredPasajes.filter(p => p.estado === 'Vendido').length} pasajes vendidos
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-azul-oscuro dark:text-white mb-2">
              Promedio por Pasaje
            </h4>
            <div className="text-3xl font-bold text-azul-oscuro dark:text-amarillo-dorado">
              S/ {filteredPasajes.length > 0 ? (totalVentas / filteredPasajes.filter(p => p.estado === 'Vendido').length).toFixed(2) : '0.00'}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Precio promedio
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-azul-oscuro dark:text-white mb-2">
              Tasa de Cancelación
            </h4>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {filteredPasajes.length > 0 ? ((filteredPasajes.filter(p => p.estado === 'Cancelado').length / filteredPasajes.length) * 100).toFixed(1) : '0.0'}%
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredPasajes.filter(p => p.estado === 'Cancelado').length} cancelados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}