import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  customerUser: any | null;
  login: (usuario: string, password: string, type?: 'admin' | 'customer') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isCustomerAuthenticated: boolean;
  isLoading: boolean;
  userType: 'admin' | 'customer' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [customerUser, setCustomerUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<'admin' | 'customer' | null>(null);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('norteexpreso_user');
    const savedCustomer = localStorage.getItem('norteexpreso_customer');
    const savedUserType = localStorage.getItem('norteexpreso_user_type');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setUserType('admin');
    } else if (savedCustomer) {
      setCustomerUser(JSON.parse(savedCustomer));
      setUserType('customer');
    }
    
    setIsLoading(false);
  }, []);

  const login = async (usuario: string, password: string, type: 'admin' | 'customer' = 'admin'): Promise<boolean> => {
    try {
      console.log('Intentando login:', { usuario, type });
      
      if (type === 'admin') {
        // Login de administrador - conectar con API
        try {
          const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, password }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Login exitoso:', data);
            
            const adminUser: Usuario = {
              codigo: data.usuario.codigo,
              usuario: data.usuario.usuario,
              estado: 'activo',
              personal: {
                codigo: data.usuario.codigo,
                nombre: data.usuario.nombre_completo.split(' ')[0],
                apellidos: data.usuario.nombre_completo.split(' ').slice(1).join(' '),
                dni: '12345678',
                direccion: 'Lima, Perú',
                telefono: '999999999',
                email: data.usuario.email,
                cargo: data.usuario.tipo_usuario,
                area: 'Sistemas'
              },
              tipo_usuario: data.usuario.tipo_usuario
            };

            setUser(adminUser);
            setUserType('admin');
            localStorage.setItem('norteexpreso_user', JSON.stringify(adminUser));
            localStorage.setItem('norteexpreso_user_type', 'admin');
            localStorage.setItem('norteexpreso_token', data.token);
            return true;
          } else {
            const error = await response.json();
            console.error('Error de login:', error);
            return false;
          }
        } catch (error) {
          console.error('Error de conexión:', error);
          
          // Fallback para demo si no hay conexión
          if (usuario === 'admin' && password === 'admin123') {
            const mockUser: Usuario = {
              codigo: 1,
              usuario: usuario,
              estado: 'activo',
              personal: {
                codigo: 1,
                nombre: 'Admin',
                apellidos: 'Sistema',
                dni: '12345678',
                direccion: 'Lima, Perú',
                telefono: '999999999',
                email: 'admin@norteexpreso.com',
                cargo: 'Administrador',
                area: 'Sistemas'
              },
              tipo_usuario: 'Administrador'
            };

            setUser(mockUser);
            setUserType('admin');
            localStorage.setItem('norteexpreso_user', JSON.stringify(mockUser));
            localStorage.setItem('norteexpreso_user_type', 'admin');
            return true;
          }
          return false;
        }
      } else {
        // Login de cliente
        const mockCustomer = {
          codigo: 1,
          nombre: 'María',
          apellidos: 'González',
          email: usuario,
          dni: '87654321',
          telefono: '999888777',
          puntos: 2450,
          nivel: 'Oro',
          fechaRegistro: '2024-01-01'
        };

        if (usuario === 'maria@gmail.com' && password === 'maria123') {
          setCustomerUser(mockCustomer);
          setUserType('customer');
          localStorage.setItem('norteexpreso_customer', JSON.stringify(mockCustomer));
          localStorage.setItem('norteexpreso_user_type', 'customer');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCustomerUser(null);
    setUserType(null);
    localStorage.removeItem('norteexpreso_user');
    localStorage.removeItem('norteexpreso_customer');
    localStorage.removeItem('norteexpreso_user_type');
    localStorage.removeItem('norteexpreso_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerUser,
        login,
        logout,
        isAuthenticated: !!user,
        isCustomerAuthenticated: !!customerUser,
        isLoading,
        userType
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}