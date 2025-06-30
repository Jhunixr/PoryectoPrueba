import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, MapPin, FileText, PieChart, Bus, Fuel, CreditCard } from 'lucide-react';
import { ReporteBus } from '../../types';

export function ReportsManager() {
  const [selectedReport, setSelectedReport] = useState('buses');
  const [dateRange, setDateRange] = useState({
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    fin: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Datos simulados para reportes de buses
  const reportesBuses: ReporteBus[] = [
    {
      bus: {
        codigo: 1,
        placa: 'NTE-001',
        fabricante: 'Mercedes Benz'
      },
      viaje: {
        codigo: 1,
        fecha_hora_salida: '2024-01-15T08:00:00',
        origen: 'Lima',
        destino: 'Trujillo'
      },
      ingresos: {
        total: 1400.00,
        pasajeros_adultos: 35,
        pasajeros_menores: 3,
        pasajeros_mascotas: 2,
        precio_adulto: 35.00,
        precio_menor: 25.00,
        precio_mascota: 15.00
      },
      egresos: {
        combustible: 180.00,
        peajes: 45.00,
        cargaderos: 25.00,
        otros: 20.00,
        total: 270.00
      },
      medios_pago: {
        efectivo: 560.00,
        yape: 420.00,
        tarjeta: 350.00,
        plin: 70.00,
        otros: 0.00
      },
      utilidad: 1130.00
    },
    {
      bus: {
        codigo: 2,
        placa: 'NTE-002',
        fabricante: 'Scania'
      },
      viaje: {
        codigo: 2,
        fecha_hora_salida: '2024-01-15T14:00:00',
        origen: 'Lima',
        destino: 'Chiclayo'
      },
      ingresos: {
        total: 1680.00,
        pasajeros_adultos: 38,
        pasajeros_menores: 4,
        pasajeros_mascotas: 1,
        precio_adulto: 40.00,
        precio_menor: 30.00,
        precio_mascota: 15.00
      },
      egresos: {
        combustible: 220.00,
        peajes: 60.00,
        cargaderos: 30.00,
        otros: 15.00,
        total: 325.00
      },
      medios_pago: {
        efectivo: 672.00,
        yape: 504.00,
        tarjeta: 420.00,
        plin: 84.00,
        otros: 0.00
      },
      utilidad: 1355.00
    }
  ];

  const reportTypes = [
    { id: 'buses', name: 'Reportes por Bus', icon: Bus, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
    { id: 'ventas', name: 'Reporte de Ventas', icon: DollarSign, color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
    { id: 'rutas', name: 'Análisis de Rutas', icon: MapPin, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
    { id: 'personal', name: 'Desempeño Personal', icon: Users, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' }
  ];

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => {
      switch (selectedReport) {
        case 'buses':
          setReportData(reportesBuses);
          break;
        case 'ventas':
          setReportData({
            totalIngresos: 125450.50,
            totalPasajes: 2847,
            promedioVenta: 44.05,
            crecimiento: 12.5
          });
          break;
        default:
          setReportData(null);
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateReport();
  }, [selectedReport, dateRange]);

  const exportReport = (format: string) => {
    const fileName = `reporte_${selectedReport}_${dateRange.inicio}_${dateRange.fin}.${format}`;
    alert(`Exportando reporte: ${fileName}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-azul-oscuro dark:text-white">Centro de Reportes</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Análisis detallado de operaciones y rendimiento
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <button
              onClick={() => exportReport('pdf')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportReport('xlsx')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedReport(type.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedReport === type.id
                ? 'border-azul-oscuro dark:border-amarillo-dorado bg-blue-50 dark:bg-yellow-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${type.color}`}>
              <type.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-azul-oscuro dark:text-white mb-2">{type.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {type.id === 'buses' && 'Ingresos, egresos y utilidad por bus'}
              {type.id === 'ventas' && 'Ingresos, pasajes vendidos y tendencias'}
              {type.id === 'rutas' && 'Popularidad y rentabilidad por ruta'}
              {type.id === 'personal' && 'Productividad y desempeño del equipo'}
            </p>
          </button>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white mb-4 md:mb-0">
            Filtros de Fecha
          </h3>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={dateRange.inicio}
                onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={dateRange.fin}
                onChange={(e) => setDateRange(prev => ({ ...prev, fin: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={generateReport}
                className="bg-azul-oscuro dark:bg-amarillo-dorado text-white dark:text-azul-oscuro px-6 py-2 rounded-lg hover:bg-primary-600 dark:hover:bg-yellow-500 transition-colors"
              >
                Generar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-oscuro dark:border-amarillo-dorado mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Generando reporte...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Buses Report */}
          {selectedReport === 'buses' && reportData && (
            <>
              {/* Resumen General */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white">
                        S/ {reportData.reduce((sum: number, r: ReporteBus) => sum + r.ingresos.total, 0).toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Ingresos</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <Fuel className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white">
                        S/ {reportData.reduce((sum: number, r: ReporteBus) => sum + r.egresos.total, 0).toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Egresos</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white">
                        S/ {reportData.reduce((sum: number, r: ReporteBus) => sum + r.utilidad, 0).toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Utilidad Total</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white">
                        {reportData.reduce((sum: number, r: ReporteBus) => sum + r.ingresos.pasajeros_adultos + r.ingresos.pasajeros_menores, 0)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Pasajeros</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalle por Bus */}
              <div className="space-y-6">
                {reportData.map((reporte: ReporteBus, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Bus className="h-8 w-8 text-azul-oscuro dark:text-amarillo-dorado mr-3" />
                        <div>
                          <h3 className="text-xl font-bold text-azul-oscuro dark:text-white">
                            {reporte.bus.placa} - {reporte.bus.fabricante}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {reporte.viaje.origen} → {reporte.viaje.destino} | 
                            {new Date(reporte.viaje.fecha_hora_salida).toLocaleDateString('es-PE')} {new Date(reporte.viaje.fecha_hora_salida).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          S/ {reporte.utilidad.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Utilidad</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Ingresos */}
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                          <DollarSign className="h-5 w-5 mr-2" />
                          Ingresos
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">Adultos ({reporte.ingresos.pasajeros_adultos}):</span>
                            <span className="font-medium text-green-900 dark:text-green-100">
                              S/ {(reporte.ingresos.pasajeros_adultos * reporte.ingresos.precio_adulto).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">Menores ({reporte.ingresos.pasajeros_menores}):</span>
                            <span className="font-medium text-green-900 dark:text-green-100">
                              S/ {(reporte.ingresos.pasajeros_menores * reporte.ingresos.precio_menor).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">Mascotas ({reporte.ingresos.pasajeros_mascotas}):</span>
                            <span className="font-medium text-green-900 dark:text-green-100">
                              S/ {(reporte.ingresos.pasajeros_mascotas * reporte.ingresos.precio_mascota).toFixed(2)}
                            </span>
                          </div>
                          <div className="border-t border-green-200 dark:border-green-800 pt-2 flex justify-between">
                            <span className="font-semibold text-green-800 dark:text-green-200">Total:</span>
                            <span className="font-bold text-green-900 dark:text-green-100">S/ {reporte.ingresos.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Egresos */}
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center">
                          <Fuel className="h-5 w-5 mr-2" />
                          Egresos
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-red-700 dark:text-red-300">Combustible:</span>
                            <span className="font-medium text-red-900 dark:text-red-100">S/ {reporte.egresos.combustible.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700 dark:text-red-300">Peajes:</span>
                            <span className="font-medium text-red-900 dark:text-red-100">S/ {reporte.egresos.peajes.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700 dark:text-red-300">Cargaderos:</span>
                            <span className="font-medium text-red-900 dark:text-red-100">S/ {reporte.egresos.cargaderos.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700 dark:text-red-300">Otros:</span>
                            <span className="font-medium text-red-900 dark:text-red-100">S/ {reporte.egresos.otros.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-red-200 dark:border-red-800 pt-2 flex justify-between">
                            <span className="font-semibold text-red-800 dark:text-red-200">Total:</span>
                            <span className="font-bold text-red-900 dark:text-red-100">S/ {reporte.egresos.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Medios de Pago */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Medios de Pago
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700 dark:text-blue-300">💵 Efectivo:</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">S/ {reporte.medios_pago.efectivo.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700 dark:text-blue-300">📱 Yape:</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">S/ {reporte.medios_pago.yape.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700 dark:text-blue-300">💳 Tarjeta:</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">S/ {reporte.medios_pago.tarjeta.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700 dark:text-blue-300">💰 Plin:</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">S/ {reporte.medios_pago.plin.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-blue-200 dark:border-blue-800 pt-2">
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              Efectivo: {((reporte.medios_pago.efectivo / reporte.ingresos.total) * 100).toFixed(1)}% |
                              Digital: {(((reporte.medios_pago.yape + reporte.medios_pago.tarjeta + reporte.medios_pago.plin) / reporte.ingresos.total) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Otros reportes existentes */}
          {selectedReport === 'ventas' && reportData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-azul-oscuro dark:text-white mb-6">
                Reporte de Ventas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    S/ {reportData.totalIngresos.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Ingresos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {reportData.totalPasajes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Pasajes Vendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    S/ {reportData.promedioVenta.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Promedio por Venta</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    +{reportData.crecimiento}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Crecimiento</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}