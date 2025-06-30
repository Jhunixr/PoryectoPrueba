import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { User, Lock, AlertCircle, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { theme } = useTheme();
  
  const [loginType, setLoginType] = useState<'admin' | 'customer'>(() => {
    return (searchParams.get('type') as 'admin' | 'customer') || 'customer';
  });
  
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || (loginType === 'admin' ? '/admin' : '/loyalty');

  useEffect(() => {
    const type = searchParams.get('type') as 'admin' | 'customer';
    if (type) {
      setLoginType(type);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData.usuario, formData.password, loginType);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const demoCredentials = loginType === 'admin' 
    ? { usuario: 'admin', password: 'admin123' }
    : { usuario: 'maria@gmail.com', password: 'maria123' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-azul-oscuro via-primary-700 to-primary-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <img 
                src="/logo.svg" 
                alt="NORTEEXPRESO" 
                className="h-16 w-auto"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-amarillo-dorado to-yellow-500 rounded-full opacity-20 blur-lg"></div>
            </div>
            <span className="text-3xl font-bold text-white">NORTEEXPRESO</span>
          </div>
          
          {/* Login Type Selector */}
          <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6">
            <button
              onClick={() => setLoginType('customer')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                loginType === 'customer'
                  ? 'bg-white text-azul-oscuro shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="h-5 w-5" />
              <span className="font-medium">Cliente</span>
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                loginType === 'admin'
                  ? 'bg-white text-azul-oscuro shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span className="font-medium">Administrador</span>
            </button>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {loginType === 'admin' ? 'Panel de Administración' : 'Programa de Fidelidad'}
          </h2>
          <p className="text-gray-300">
            {loginType === 'admin' 
              ? 'Accede al sistema de gestión' 
              : 'Accede a tus puntos y beneficios'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {loginType === 'admin' ? 'Usuario' : 'Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="usuario"
                  type={loginType === 'admin' ? 'text' : 'email'}
                  value={formData.usuario}
                  onChange={(e) => handleInputChange('usuario', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder={loginType === 'admin' ? 'Ingresa tu usuario' : 'Ingresa tu email'}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-azul-oscuro to-primary-600 text-white py-3 px-4 rounded-lg hover:from-primary-600 hover:to-azul-oscuro transition-all duration-300 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amarillo-dorado/10 to-yellow-500/10 rounded-lg border border-amarillo-dorado/20">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <div className="w-2 h-2 bg-amarillo-dorado rounded-full mr-2"></div>
              Credenciales de demostración:
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>{loginType === 'admin' ? 'Usuario:' : 'Email:'}</strong> {demoCredentials.usuario}</p>
              <p><strong>Contraseña:</strong> {demoCredentials.password}</p>
            </div>
            <button
              onClick={() => setFormData(demoCredentials)}
              className="mt-2 text-xs bg-amarillo-dorado text-azul-oscuro px-3 py-1 rounded-full hover:bg-yellow-500 transition-colors"
            >
              Usar credenciales demo
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <span>← Volver al inicio</span>
          </button>
        </div>
      </div>
    </div>
  );
}