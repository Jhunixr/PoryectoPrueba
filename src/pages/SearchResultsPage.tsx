import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, CreditCard, Star, Gift } from 'lucide-react';
import { SearchFilters, Viaje } from '../types';
import { Promotion } from '../data/promotions';
import { getRouteByOriginDestination } from '../data/routes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = location.state?.filters as SearchFilters;
  const selectedPromotion = location.state?.selectedPromotion as Promotion;

  useEffect(() => {
    if (!filters) {
      navigate('/search');
      return;
    }

    // Buscar viajes reales desde la base de datos
    setTimeout(() => {
      buscarViajesReales();
    }, 1000);
  }, [filters, navigate, selectedPromotion]);

  const buscarViajesReales = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/viajes/buscar?origen=${filters.origen}&destino=${filters.destino}&fecha=${filters.fecha}`);
      
      if (response.ok) {
        const viajesData = await response.json();
        console.log('Viajes encontrados:', viajesData);
        
        // Transformar datos de la BD al formato esperado
        const viajesTransformados = viajesData.map((viaje: any) => ({
          codigo: viaje.codigo,
          fecha_hora_salida: viaje.fecha_hora_salida,
          fecha_hora_llegada_estimada: viaje.fecha_hora_llegada_estimada,
          estado: viaje.estado,
          ruta: {
            codigo: viaje.ruta_codigo || 1,
            origen: viaje.origen,
            destino: viaje.destino,
            costo_referencial: selectedPromotion ? selectedPromotion.discountedPrice : viaje.costo_referencial
          },
          bus: {
            codigo: viaje.bus_codigo || 1,
            placa: viaje.placa,
            fabricante: viaje.fabricante,
            num_asientos: viaje.num_asientos,
            estado: 'Operativo'
          },
          chofer: {
            codigo: viaje.chofer_codigo || 1,
            nombre: viaje.chofer_nombre?.split(' ')[0] || 'Chofer',
            apellidos: viaje.chofer_nombre?.split(' ').slice(1).join(' ') || 'Asignado',
            dni: '12345678',
            direccion: 'Lima',
            telefono: '999999999',
            email: 'chofer@norteexpreso.com',
            cargo: 'Chofer',
            area: 'Operaciones'
          },
          asientos_disponibles: viaje.asientos_disponibles || viaje.num_asientos
        }));
        
        setViajes(viajesTransformados);
      } else {
        console.error('Error al buscar viajes:', response.statusText);
        setViajes([]);
      }
    } catch (error) {
      console.error('Error de conexión al buscar viajes:', error);
      // Fallback con datos simulados si no hay conexión
      const routeData = getRouteByOriginDestination(filters.origen, filters.destino);
      if (routeData) {
        const mockViajes: Viaje[] = [
          {
            codigo: 1,
            fecha_hora_salida: `${filters.fecha}T06:00:00`,
            fecha_hora_llegada_estimada: `${filters.fecha}T${String(6 + routeData.duracion_horas).padStart(2, '0')}:00:00`,
            estado: 'Programado',
            ruta: {
              codigo: routeData.codigo,
              origen: filters.origen,
              destino: filters.destino,
              costo_referencial: selectedPromotion ? selectedPromotion.discountedPrice : routeData.costo_referencial
            },
            bus: {
              codigo: 1,
              placa: 'NTE-001',
              fabricante: 'Mercedes Benz',
              num_asientos: 40,
              estado: 'Operativo'
            },
            chofer: {
              codigo: 1,
              nombre: 'Carlos',
              apellidos: 'Mendoza',
              dni: '12345678',
              direccion: 'Lima',
              telefono: '999999999',
              email: 'carlos@norteexpreso.com',
              cargo: 'Chofer',
              area: 'Operaciones'
            },
            asientos_disponibles: 35
          }
        ];
        setViajes(mockViajes);
      } else {
        setViajes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectViaje = (viaje: Viaje) => {
    navigate('/booking', { state: { viaje, filters, selectedPromotion } });
  };

  const formatTime = (datetime: string) => {
    return format(new Date(datetime), 'HH:mm', { locale: es });
  };

  const formatDuration = (salida: string, llegada: string) => {
    const start = new Date(salida);
    const end = new Date(llegada);
    const diffHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return `${diffHours}h`;
  };

  const getBusFeatures = (fabricante: string) => {
    const features = {
      'Mercedes Benz': ['WiFi Premium', 'Asientos Reclinables', 'Aire Acondicionado', 'Entretenimiento'],
      'Scania': ['WiFi Gratis', 'Asientos Cómodos', 'Baño a Bordo', 'Snack Incluido'],
      'Volvo': ['WiFi Ultra', 'Asientos Premium', 'Climatización', 'Servicio VIP']
    };
    return features[fabricante as keyof typeof features] || ['WiFi', 'Comodidad', 'Seguridad'];
  };

  if (!filters) {
    return null;
  }

  return (
    <div className="min-h-screen bg-blanco-crema py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-azul-oscuro mb-2">
                  {filters.origen} → {filters.destino}
                </h1>
                <p className="text-gris-suave">
                  {format(new Date(filters.fecha), 'EEEE, d MMMM yyyy', { locale: es })} • {filters.pasajeros} {filters.pasajeros === 1 ? 'pasajero' : 'pasajeros'}
                </p>
                {selectedPromotion && (
                  <div className="mt-2 inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    <Gift className="h-4 w-4 mr-1" />
                    Promoción aplicada: {selectedPromotion.title}
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate('/search')}
                className="bg-azul-oscuro text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Modificar búsqueda
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-oscuro mx-auto mb-4"></div>
              <p className="text-gris-suave">Buscando los mejores viajes al norte...</p>
            </div>
          )}

          {/* Results */}
          {!loading && viajes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-azul-oscuro">
                  {viajes.length} viajes encontrados
                </h2>
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
                  <option>Ordenar por horario</option>
                  <option>Ordenar por precio</option>
                  <option>Ordenar por duración</option>
                </select>
              </div>

              {viajes.map((viaje, index) => (
                <div key={viaje.codigo} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                      {/* Horarios */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-azul-oscuro">
                              {formatTime(viaje.fecha_hora_salida)}
                            </div>
                            <div className="text-sm text-gris-suave">
                              {viaje.ruta.origen}
                            </div>
                          </div>
                          
                          <div className="flex-1 relative">
                            <div className="border-t-2 border-gray-300 relative">
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amarillo-dorado text-azul-oscuro text-xs px-2 py-1 rounded-full font-medium">
                                {formatDuration(viaje.fecha_hora_salida, viaje.fecha_hora_llegada_estimada)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-azul-oscuro">
                              {formatTime(viaje.fecha_hora_llegada_estimada)}
                            </div>
                            <div className="text-sm text-gris-suave">
                              {viaje.ruta.destino}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gris-suave mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {viaje.bus.fabricante} - {viaje.bus.placa}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {viaje.asientos_disponibles} asientos disponibles
                          </div>
                        </div>

                        {/* Bus Features */}
                        <div className="flex flex-wrap gap-2">
                          {getBusFeatures(viaje.bus.fabricante).map((feature, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              ✓ {feature}
                            </span>
                          ))}
                        </div>

                        {/* Promotion indicator */}
                        {selectedPromotion && index === 0 && (
                          <div className="mt-3 flex items-center text-sm text-red-600">
                            <Gift className="h-4 w-4 mr-1" />
                            Precio promocional aplicado
                          </div>
                        )}
                      </div>

                      {/* Precio */}
                      <div className="text-center lg:text-right">
                        {selectedPromotion && index === 0 ? (
                          <div>
                            <div className="text-sm text-gray-500 line-through">
                              S/ {selectedPromotion.originalPrice.toFixed(2)}
                            </div>
                            <div className="text-3xl font-bold text-red-600 mb-1">
                              S/ {viaje.ruta.costo_referencial.toFixed(2)}
                            </div>
                            <div className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full inline-block">
                              -{selectedPromotion.discount}% OFF
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-3xl font-bold text-azul-oscuro mb-1">
                              S/ {viaje.ruta.costo_referencial.toFixed(2)}
                            </div>
                            <div className="text-sm text-gris-suave">
                              por pasajero
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botón */}
                      <div className="text-center lg:text-right">
                        <button
                          onClick={() => handleSelectViaje(viaje)}
                          className="w-full lg:w-auto bg-amarillo-dorado text-azul-oscuro px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                        >
                          <CreditCard className="h-5 w-5" />
                          <span>Seleccionar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && viajes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚌</div>
              <h3 className="text-xl font-semibold text-azul-oscuro mb-2">
                No hay viajes disponibles
              </h3>
              <p className="text-gris-suave mb-6">
                No encontramos viajes para esta ruta en la fecha seleccionada.
                Intenta con otra fecha o revisa nuestras promociones especiales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/search')}
                  className="bg-azul-oscuro text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Buscar otras fechas
                </button>
                <button
                  onClick={() => navigate('/promotions')}
                  className="border border-azul-oscuro text-azul-oscuro px-6 py-3 rounded-lg hover:bg-azul-oscuro hover:text-white transition-colors"
                >
                  Ver Promociones
                </button>
              </div>
            </div>
          )}

          {/* Route Information */}
          {!loading && viajes.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-azul-oscuro mb-4">
                Información de la Ruta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amarillo-dorado mb-2">
                    {getRouteByOriginDestination(filters.origen, filters.destino)?.distancia_km} km
                  </div>
                  <div className="text-sm text-gris-suave">Distancia total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amarillo-dorado mb-2">
                    ~{getRouteByOriginDestination(filters.origen, filters.destino)?.duracion_horas}h
                  </div>
                  <div className="text-sm text-gris-suave">Duración promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amarillo-dorado mb-2">
                    4.8★
                  </div>
                  <div className="text-sm text-gris-suave">Calificación de ruta</div>
                </div>
              </div>
              
              {getRouteByOriginDestination(filters.origen, filters.destino)?.atractivos && (
                <div className="mt-6">
                  <h4 className="font-semibold text-azul-oscuro mb-3">
                    Atractivos en {filters.destino}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getRouteByOriginDestination(filters.origen, filters.destino)?.atractivos.map((atractivo, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        📍 {atractivo}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}