import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, CreditCard, CheckCircle, AlertCircle, UserCheck, Baby, FileText, Phone, Heart, Search, Save, Database } from 'lucide-react';
import { Viaje, SearchFilters, Cliente } from '../types';
import { reniecService, ReniecData } from '../services/reniecService';
import { databaseService, PasajeData } from '../services/databaseService';
import { ReniecConsultButton } from '../components/ReniecConsultButton';
import { notificationService } from '../services/notificationService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PassengerData extends Partial<Cliente> {
  edad?: number;
  genero?: 'M' | 'F';
  esmenor?: boolean;
  tutor_nombre?: string;
  tutor_dni?: string;
  permiso_notarial?: boolean;
  telefono_contacto?: string;
  viaja_con_mascota?: boolean;
  tipo_mascota?: string;
  nombre_mascota?: string;
  peso_mascota?: number;
}

export function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { viaje, filters } = location.state as { viaje: Viaje; filters: SearchFilters };
  
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

  if (!viaje || !filters) {
    navigate('/search');
    return null;
  }

  // Cargar asientos ocupados desde la base de datos
  useEffect(() => {
    const loadOccupiedSeats = async () => {
      try {
        const asientos = await databaseService.obtenerAsientosOcupados(viaje.codigo);
        setOccupiedSeats(asientos);
      } catch (error) {
        console.error('Error cargando asientos ocupados:', error);
        // Fallback con datos simulados
        setOccupiedSeats([2, 5, 8, 12, 15, 18, 23, 27, 31]);
      }
    };

    loadOccupiedSeats();
  }, [viaje.codigo]);

  // Simulación de asientos ocupados con género para la UI
  const occupiedSeatsData = {
    2: { gender: 'M', name: 'Juan P.' },
    5: { gender: 'F', name: 'María G.' },
    8: { gender: 'M', name: 'Carlos M.' },
    12: { gender: 'F', name: 'Ana R.' },
    15: { gender: 'M', name: 'Luis S.' },
    18: { gender: 'F', name: 'Carmen L.' },
    23: { gender: 'M', name: 'Pedro H.' },
    27: { gender: 'F', name: 'Rosa T.' },
    31: { gender: 'M', name: 'Miguel A.' }
  };

  // Estado para rastrear los géneros de los asientos seleccionados
  const [selectedSeatsGender, setSelectedSeatsGender] = useState<{[key: number]: 'M' | 'F'}>({});

  // Políticas de mascotas
  const politicaMascota = {
    peso_maximo: 8, // kg
    tipos_permitidos: ['Perro', 'Gato'],
    costo_adicional: 15.00,
    requiere_certificado: true
  };

  // Generar distribución de asientos
  const generateSeats = () => {
    const seats = [];
    const totalSeats = viaje.bus.num_asientos;
    
    for (let i = 1; i <= totalSeats; i++) {
      const occupiedData = occupiedSeatsData[i as keyof typeof occupiedSeatsData];
      const isOccupied = occupiedSeats.includes(i);
      
      seats.push({
        number: i,
        isOccupied: isOccupied,
        isSelected: selectedSeats.includes(i),
        occupiedBy: isOccupied ? occupiedData : undefined
      });
    }
    return seats;
  };

  const handleSeatClick = (seatNumber: number) => {
    const seat = generateSeats().find(s => s.number === seatNumber);
    if (seat?.isOccupied) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
      // Remover el género del asiento deseleccionado
      const newGenders = { ...selectedSeatsGender };
      delete newGenders[seatNumber];
      setSelectedSeatsGender(newGenders);
    } else if (selectedSeats.length < filters.pasajeros) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleReniecDataReceived = (index: number, data: ReniecData) => {
    const edad = reniecService.calcularEdad(data.fechaNacimiento);
    const newData = [...passengerData];
    newData[index] = {
      ...newData[index],
      nombre: reniecService.formatearNombre(data.nombres),
      apellidos: `${reniecService.formatearNombre(data.apellidoPaterno)} ${reniecService.formatearNombre(data.apellidoMaterno)}`,
      dni: data.dni,
      edad: edad,
      genero: data.sexo,
      esmenor: edad < 18
    };
    setPassengerData(newData);
  };

  const handlePassengerDataChange = (index: number, field: keyof PassengerData, value: string | number | boolean) => {
    const newData = [...passengerData];
    if (!newData[index]) newData[index] = {};
    newData[index] = { ...newData[index], [field]: value };
    
    // Verificar si es menor de edad
    if (field === 'edad') {
      const edad = value as number;
      newData[index].esmenor = edad < 18;
    }
    
    // Actualizar el género del asiento cuando se cambia el género del pasajero
    if (field === 'genero' && selectedSeats[index]) {
      const newGenders = { ...selectedSeatsGender };
      newGenders[selectedSeats[index]] = value as 'M' | 'F';
      setSelectedSeatsGender(newGenders);
    }
    
    setPassengerData(newData);
  };

  const calculateTotal = () => {
    let total = selectedSeats.length * viaje.ruta.costo_referencial;
    
    // Agregar costo de mascotas
    const pasajerosConMascota = passengerData.filter(p => p.viaja_con_mascota).length;
    total += pasajerosConMascota * politicaMascota.costo_adicional;
    
    return total;
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    
    try {
      // Preparar datos para guardar en la base de datos
      const pasajeData: PasajeData = {
        viaje_codigo: viaje.codigo,
        cliente: {
          nombre: passengerData[0]?.nombre || '',
          apellidos: passengerData[0]?.apellidos || '',
          dni: passengerData[0]?.dni || '',
          telefono: passengerData[0]?.telefono_contacto,
          email: '' // Se puede agregar campo email si es necesario
        },
        asientos: selectedSeats,
        metodo_pago: paymentMethod,
        telefono_contacto: passengerData[0]?.telefono_contacto || '',
        viaja_con_mascota: passengerData.some(p => p.viaja_con_mascota),
        tipo_mascota: passengerData.find(p => p.viaja_con_mascota)?.tipo_mascota,
        nombre_mascota: passengerData.find(p => p.viaja_con_mascota)?.nombre_mascota,
        peso_mascota: passengerData.find(p => p.viaja_con_mascota)?.peso_mascota,
        tutor_nombre: passengerData.find(p => p.esmenor)?.tutor_nombre,
        tutor_dni: passengerData.find(p => p.esmenor)?.tutor_dni,
        permiso_notarial: passengerData.find(p => p.esmenor)?.permiso_notarial
      };

      // Guardar en la base de datos
      const result = await databaseService.guardarPasaje(pasajeData);
      
      if (result.success) {
        // Programar notificaciones para cada pasajero
        for (const passenger of passengerData) {
          if (passenger.telefono_contacto) {
            await notificationService.programarNotificacion(
              passenger.telefono_contacto,
              `${passenger.nombre} ${passenger.apellidos}`,
              viaje.fecha_hora_salida,
              viaje.ruta.origen,
              viaje.ruta.destino,
              viaje.bus.placa
            );
          }
        }
        
        setLoading(false);
        navigate('/booking-confirmation', {
          state: {
            viaje,
            selectedSeats,
            passengerData,
            totalAmount: calculateTotal(),
            paymentMethod,
            pasajesCodigos: result.pasajes
          }
        });
      } else {
        setLoading(false);
        alert(`Error al procesar la reserva: ${result.error}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error procesando reserva:', error);
      alert('Error al procesar la reserva. Por favor, intenta nuevamente.');
    }
  };

  const canProceedToStep2 = selectedSeats.length === filters.pasajeros;
  const canProceedToStep3 = passengerData.length === filters.pasajeros && 
    passengerData.every(p => {
      const basicDataComplete = p.nombre && p.apellidos && p.dni && p.edad && p.genero && p.telefono_contacto;
      if (!p.esmenor) return basicDataComplete;
      
      // Para menores, verificar tutor o permiso
      return basicDataComplete && (
        (p.tutor_nombre && p.tutor_dni) || p.permiso_notarial
      );
    });
  const canConfirm = paymentMethod && canProceedToStep3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar Mejorado */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 bg-clip-text text-transparent">
                Reservar Pasaje
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Database className="h-4 w-4" />
                <span>Paso {step} de 3</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 text-white dark:text-azul-oscuro shadow-lg transform scale-110' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="h-6 w-6" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                      step > stepNumber 
                        ? 'bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-sm">
              <span className={`transition-colors ${step >= 1 ? 'text-azul-oscuro dark:text-amarillo-dorado font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                Seleccionar Asientos
              </span>
              <span className={`transition-colors ${step >= 2 ? 'text-azul-oscuro dark:text-amarillo-dorado font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                Datos de Pasajeros
              </span>
              <span className={`transition-colors ${step >= 3 ? 'text-azul-oscuro dark:text-amarillo-dorado font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                Pago y Confirmación
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Seat Selection */}
              {step === 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-azul-oscuro dark:text-white mb-8 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white dark:text-azul-oscuro font-bold">1</span>
                    </div>
                    Selecciona {filters.pasajeros} {filters.pasajeros === 1 ? 'asiento' : 'asientos'}
                  </h2>
                  
                  <div className="mb-8">
                    <div className="flex items-center space-x-6 text-sm flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Disponible</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white dark:text-azul-oscuro text-xs font-bold">✓</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Seleccionado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">♂</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Ocupado (Hombre)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">♀</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Ocupado (Mujer)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bus Layout Mejorado */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-inner">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center bg-azul-oscuro dark:bg-amarillo-dorado text-white dark:text-azul-oscuro px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        🚗 Conductor - {viaje.bus.placa}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                      {generateSeats().map((seat) => (
                        <button
                          key={seat.number}
                          onClick={() => handleSeatClick(seat.number)}
                          disabled={seat.isOccupied}
                          className={`w-14 h-14 rounded-xl text-sm font-bold transition-all duration-300 relative group shadow-lg ${
                            seat.isOccupied
                              ? seat.occupiedBy?.gender === 'M'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white cursor-not-allowed'
                              : seat.isSelected
                              ? 'bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 text-white dark:text-azul-oscuro transform scale-110 shadow-xl'
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-xl'
                          }`}
                          title={seat.isOccupied ? `Ocupado por ${seat.occupiedBy?.name}` : `Asiento ${seat.number}`}
                        >
                          {seat.isOccupied ? (
                            seat.occupiedBy?.gender === 'M' ? '♂' : '♀'
                          ) : (
                            // Mostrar el género del pasajero asignado a este asiento
                            selectedSeatsGender[seat.number] ? 
                              seat.number
                            seat.number
                          )}
                          
                          {seat.isOccupied && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                              {seat.occupiedBy?.name}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep2}
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                        canProceedToStep2
                          ? 'bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 text-white dark:text-azul-oscuro hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continuar →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Passenger Data */}
              {step === 2 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-azul-oscuro dark:text-white mb-8 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white dark:text-azul-oscuro font-bold">2</span>
                    </div>
                    Datos de los Pasajeros
                  </h2>
                  
                  <div className="space-y-8">
                    {selectedSeats.map((seatNumber, index) => (
                      <div key={seatNumber} className="border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 shadow-lg">
                        <h3 className="font-bold text-azul-oscuro dark:text-white mb-6 flex items-center text-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-white dark:text-azul-oscuro" />
                          </div>
                          Pasajero {index + 1} - Asiento {seatNumber}
                        </h3>
                        
                        {/* DNI y consulta RENIEC */}
                        <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            DNI *
                          </label>
                          <div className="flex space-x-3">
                            <input
                              type="text"
                              value={passengerData[index]?.dni || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'dni', e.target.value)}
                              className="flex-1 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-all shadow-lg"
                              maxLength={8}
                              placeholder="12345678"
                              required
                            />
                            <ReniecConsultButton
                              dni={passengerData[index]?.dni || ''}
                              onDataReceived={(data) => handleReniecDataReceived(index, data)}
                              disabled={!passengerData[index]?.dni || passengerData[index]?.dni?.length !== 8}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Nombres *
                            </label>
                            <input
                              type="text"
                              value={passengerData[index]?.nombre || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'nombre', e.target.value)}
                              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-all shadow-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Apellidos *
                            </label>
                            <input
                              type="text"
                              value={passengerData[index]?.apellidos || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'apellidos', e.target.value)}
                              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-all shadow-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Edad *
                            </label>
                            <input
                              type="number"
                              value={passengerData[index]?.edad || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'edad', parseInt(e.target.value))}
                              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-all shadow-lg"
                              min={1}
                              max={120}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Género *
                            </label>
                            <select
                              value={passengerData[index]?.genero || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'genero', e.target.value)}
                              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-all shadow-lg"
                              required
                            >
                              <option value="">Seleccionar</option>
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              <Phone className="h-4 w-4 inline mr-1" />
                              Teléfono de contacto *
                            </label>
                            <input
                              type="tel"
                              value={passengerData[index]?.telefono_contacto || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'telefono_contacto', e.target.value)}
                              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-all shadow-lg"
                              placeholder="999999999"
                              required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                              <Database className="h-3 w-3 mr-1" />
                              Recibirás notificaciones 30 min antes del viaje
                            </p>
                          </div>
                        </div>

                        {/* Sección para mascotas mejorada */}
                        {(filters.conMascota || viaje.bus.petFriendly) && (
                          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-800 rounded-2xl p-6 mt-6 shadow-lg">
                            <div className="flex items-center mb-4">
                              <Heart className="h-6 w-6 text-pink-600 mr-3" />
                              <h4 className="font-bold text-pink-800 dark:text-pink-200 text-lg">
                                Información de Mascota (Pet Friendly)
                              </h4>
                            </div>
                            
                            <div className="mb-4">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={passengerData[index]?.viaja_con_mascota || false}
                                  onChange={(e) => handlePassengerDataChange(index, 'viaja_con_mascota', e.target.checked)}
                                  className="mr-3 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-pink-600 focus:ring-pink-500 dark:bg-gray-700"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                  Este pasajero viaja con mascota (+S/ {politicaMascota.costo_adicional})
                                </span>
                              </label>
                            </div>
                            
                            {passengerData[index]?.viaja_con_mascota && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Tipo de mascota *
                                  </label>
                                  <select
                                    value={passengerData[index]?.tipo_mascota || ''}
                                    onChange={(e) => handlePassengerDataChange(index, 'tipo_mascota', e.target.value)}
                                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white transition-all"
                                    required
                                  >
                                    <option value="">Seleccionar</option>
                                    {politicaMascota.tipos_permitidos.map(tipo => (
                                      <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre de la mascota *
                                  </label>
                                  <input
                                    type="text"
                                    value={passengerData[index]?.nombre_mascota || ''}
                                    onChange={(e) => handlePassengerDataChange(index, 'nombre_mascota', e.target.value)}
                                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white transition-all"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Peso (kg) *
                                  </label>
                                  <input
                                    type="number"
                                    value={passengerData[index]?.peso_mascota || ''}
                                    onChange={(e) => handlePassengerDataChange(index, 'peso_mascota', parseFloat(e.target.value))}
                                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white transition-all"
                                    max={politicaMascota.peso_maximo}
                                    step="0.1"
                                    required
                                  />
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-4 text-xs text-pink-700 dark:text-pink-300 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                              <p className="font-semibold mb-2">Políticas Pet Friendly:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Peso máximo: {politicaMascota.peso_maximo} kg</li>
                                <li>Tipos permitidos: {politicaMascota.tipos_permitidos.join(', ')}</li>
                                <li>Costo adicional: S/ {politicaMascota.costo_adicional}</li>
                                {politicaMascota.requiere_certificado && (
                                  <li>Requiere certificado veterinario (presentar al abordar)</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Sección para menores de edad mejorada */}
                        {passengerData[index]?.esmenor && (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 mt-6 shadow-lg">
                            <div className="flex items-center mb-4">
                              <Baby className="h-6 w-6 text-yellow-600 mr-3" />
                              <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-lg">
                                Menor de edad - Documentación requerida
                              </h4>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center space-x-6">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`minor_option_${index}`}
                                    checked={!passengerData[index]?.permiso_notarial}
                                    onChange={() => handlePassengerDataChange(index, 'permiso_notarial', false)}
                                    className="mr-2 w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                                  />
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Viaja con tutor/familiar</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`minor_option_${index}`}
                                    checked={passengerData[index]?.permiso_notarial || false}
                                    onChange={() => handlePassengerDataChange(index, 'permiso_notarial', true)}
                                    className="mr-2 w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                                  />
                                  <FileText className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Tiene permiso notarial</span>
                                </label>
                              </div>
                              
                              {!passengerData[index]?.permiso_notarial && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                      Nombre del tutor/familiar *
                                    </label>
                                    <input
                                      type="text"
                                      value={passengerData[index]?.tutor_nombre || ''}
                                      onChange={(e) => handlePassengerDataChange(index, 'tutor_nombre', e.target.value)}
                                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-all"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                      DNI del tutor/familiar *
                                    </label>
                                    <input
                                      type="text"
                                      value={passengerData[index]?.tutor_dni || ''}
                                      onChange={(e) => handlePassengerDataChange(index, 'tutor_dni', e.target.value)}
                                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-all"
                                      maxLength={8}
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {passengerData[index]?.permiso_notarial && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                    <strong>Importante:</strong> Debe presentar el permiso notarial original al momento del viaje.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold shadow-lg"
                    >
                      ← Volver
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                        canProceedToStep3
                          ? 'bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 text-white dark:text-azul-oscuro hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continuar →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-azul-oscuro dark:text-white mb-8 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white dark:text-azul-oscuro font-bold">3</span>
                    </div>
                    Método de Pago
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'visa', name: 'Tarjeta de Crédito/Débito', icon: CreditCard, description: 'Visa, Mastercard, American Express', color: 'from-blue-500 to-blue-600' },
                      { id: 'yape', name: 'Yape', icon: CreditCard, description: 'Pago rápido y seguro', color: 'from-purple-500 to-purple-600' },
                      { id: 'plin', name: 'Plin', icon: CreditCard, description: 'Transferencia instantánea', color: 'from-green-500 to-green-600' },
                      { id: 'efectivo', name: 'Efectivo', icon: CreditCard, description: 'Pago en terminal', color: 'from-gray-500 to-gray-600' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
                          paymentMethod === method.id
                            ? 'border-azul-oscuro dark:border-amarillo-dorado bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-yellow-900/20 dark:to-orange-900/20 transform scale-105'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                          <method.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 dark:text-white text-lg">{method.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{method.description}</div>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle className="h-6 w-6 text-azul-oscuro dark:text-amarillo-dorado" />
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold shadow-lg"
                    >
                      ← Volver
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={!canConfirm || loading}
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg ${
                        canConfirm && !loading
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Confirmar Reserva</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Trip Summary Mejorado */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sticky top-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-azul-oscuro dark:text-white mb-6 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white dark:text-azul-oscuro text-xs">📋</span>
                  </div>
                  Resumen del Viaje
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-azul-oscuro dark:text-white">Ruta:</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {viaje.ruta.origen} → {viaje.ruta.destino}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-azul-oscuro dark:text-white">Fecha:</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {format(new Date(viaje.fecha_hora_salida), 'EEEE, d MMMM yyyy', { locale: es })}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-azul-oscuro dark:text-white">Horario:</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      Salida: {format(new Date(viaje.fecha_hora_salida), 'HH:mm')}
                      <br />
                      Llegada: {format(new Date(viaje.fecha_hora_llegada_estimada), 'HH:mm')}
                    </div>
                  </div>
                  
                  {selectedSeats.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-azul-oscuro dark:text-white">Asientos:</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {selectedSeats.sort((a, b) => a - b).join(', ')}
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedSeats.length} Pasajeros:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white font-semibold">
                          S/ {(selectedSeats.length * viaje.ruta.costo_referencial).toFixed(2)}
                        </span>
                      </div>
                      
                      {passengerData.filter(p => p.viaja_con_mascota).length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {passengerData.filter(p => p.viaja_con_mascota).length} Mascotas:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white font-semibold">
                            S/ {(passengerData.filter(p => p.viaja_con_mascota).length * politicaMascota.costo_adicional).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-azul-oscuro dark:text-white">Total:</span>
                      <span className="text-green-600 dark:text-green-400">S/ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}