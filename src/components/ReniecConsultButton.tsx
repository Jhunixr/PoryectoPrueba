import React, { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Loader, Database } from 'lucide-react';
import { reniecService, ReniecData } from '../services/reniecService';

interface ReniecConsultButtonProps {
  dni: string;
  onDataReceived: (data: ReniecData) => void;
  disabled?: boolean;
  className?: string;
}

export function ReniecConsultButton({ 
  dni, 
  onDataReceived, 
  disabled = false, 
  className = '' 
}: ReniecConsultButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleConsult = async () => {
    if (!dni || dni.length !== 8) {
      setStatus('error');
      setMessage('DNI debe tener 8 dígitos');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const data = await reniecService.consultarDNI(dni);
      
      if (data) {
        setStatus('success');
        setMessage('Datos obtenidos correctamente');
        onDataReceived(data);
      } else {
        setStatus('error');
        setMessage('No se encontraron datos para este DNI');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error al consultar RENIEC');
      console.error('Error en consulta RENIEC:', error);
    } finally {
      setLoading(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const getButtonColor = () => {
    if (status === 'success') return 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600';
    if (status === 'error') return 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600';
    return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600';
  };

  const getIcon = () => {
    if (loading) return <Loader className="h-4 w-4 animate-spin" />;
    if (status === 'success') return <CheckCircle className="h-4 w-4" />;
    if (status === 'error') return <AlertCircle className="h-4 w-4" />;
    return <Database className="h-4 w-4" />;
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleConsult}
        disabled={disabled || loading || !reniecService.validarDNI(dni)}
        className={`
          px-4 py-3 text-white rounded-lg transition-all duration-300 
          flex items-center justify-center space-x-2 font-medium
          disabled:bg-gray-400 disabled:cursor-not-allowed
          shadow-lg hover:shadow-xl transform hover:scale-105
          ${getButtonColor()}
          ${className}
        `}
      >
        {getIcon()}
        <span>
          {loading ? 'Consultando...' : 
           status === 'success' ? 'Consultado' :
           status === 'error' ? 'Error' : 'RENIEC'}
        </span>
      </button>
      
      {message && (
        <div className={`
          mt-2 text-xs px-3 py-2 rounded-lg text-center font-medium
          ${status === 'success' ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' : 
            status === 'error' ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30' : 
            'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'}
        `}>
          {message}
        </div>
      )}
    </div>
  );
}