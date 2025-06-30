import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Home, Moon, Sun, Globe, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export function Header() {
  const { user, customerUser, logout, isAuthenticated, isCustomerAuthenticated, userType } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg relative z-50 transition-colors duration-300 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <img 
                src="/logo.svg" 
                alt="NORTEEXPRESO" 
                className="h-12 w-auto transition-transform group-hover:scale-105"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-amarillo-dorado to-yellow-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-azul-oscuro to-primary-600 dark:from-amarillo-dorado dark:to-yellow-500 bg-clip-text text-transparent">
                NORTEEXPRESO
              </span>
              <div className="text-xs text-amarillo-dorado dark:text-yellow-400 font-medium">
                Especialistas en el Norte
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors flex items-center space-x-1 group text-gray-700 dark:text-gray-300"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>{t('header.home')}</span>
            </Link>
            <Link 
              to="/search" 
              className="hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors group text-gray-700 dark:text-gray-300"
            >
              <span className="group-hover:scale-105 transition-transform inline-block">
                {t('header.search')}
              </span>
            </Link>
            <Link 
              to="/promotions" 
              className="hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors relative group text-gray-700 dark:text-gray-300"
            >
              <span className="group-hover:scale-105 transition-transform inline-block">
                {t('header.promotions')}
              </span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2 animate-pulse"></span>
            </Link>
            <Link 
              to="/loyalty" 
              className="hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors group text-gray-700 dark:text-gray-300"
            >
              <span className="group-hover:scale-105 transition-transform inline-block">
                {t('header.loyalty')}
              </span>
            </Link>
            <Link 
              to="/about" 
              className="hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors group text-gray-700 dark:text-gray-300"
            >
              <span className="group-hover:scale-105 transition-transform inline-block">
                {t('header.about')}
              </span>
            </Link>
            <Link 
              to="/contact" 
              className="hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors group text-gray-700 dark:text-gray-300"
            >
              <span className="group-hover:scale-105 transition-transform inline-block">
                {t('header.contact')}
              </span>
            </Link>
          </nav>

          {/* Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1 text-gray-600 dark:text-gray-400"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {languages.find(l => l.code === language)?.flag}
                </span>
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 py-2 min-w-[150px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 text-gray-700 dark:text-gray-300 ${
                        language === lang.code ? 'bg-amarillo-dorado/10 text-amarillo-dorado dark:text-amarillo-dorado' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Section */}
            {isAuthenticated || isCustomerAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={userType === 'admin' ? '/admin' : '/loyalty'}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amarillo-dorado to-yellow-500 text-azul-oscuro hover:from-yellow-500 hover:to-amarillo-dorado transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {userType === 'admin' ? user?.personal.nombre : customerUser?.nombre}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login?type=customer"
                  className="px-4 py-2 text-azul-oscuro dark:text-white hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors font-medium"
                >
                  Cliente
                </Link>
                <Link
                  to="/login?type=admin"
                  className="px-4 py-2 bg-gradient-to-r from-azul-oscuro to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-azul-oscuro transition-all duration-300 font-medium transform hover:scale-105 shadow-lg"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-xl animate-slide-up">
            <nav className="flex flex-col p-4 space-y-3">
              <Link
                to="/"
                className="py-3 hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>{t('header.home')}</span>
              </Link>
              <Link
                to="/search"
                className="py-3 hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.search')}
              </Link>
              <Link
                to="/promotions"
                className="py-3 hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors flex items-center text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.promotions')}
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
              </Link>
              <Link
                to="/loyalty"
                className="py-3 hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.loyalty')}
              </Link>
              <Link
                to="/about"
                className="py-3 hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.about')}
              </Link>
              <Link
                to="/contact"
                className="py-3 hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.contact')}
              </Link>
              
              <div className="pt-3 border-t dark:border-gray-700 space-y-3">
                {/* Theme and Language Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"
                  >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
                  </button>
                  
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-800"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code} className="dark:bg-gray-800">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {isAuthenticated || isCustomerAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      to={userType === 'admin' ? '/admin' : '/loyalty'}
                      className="flex items-center space-x-2 py-2 text-amarillo-dorado dark:text-yellow-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>{userType === 'admin' ? user?.personal.nombre : customerUser?.nombre}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 py-2 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login?type=customer"
                      className="block py-2 text-azul-oscuro dark:text-white hover:text-amarillo-dorado dark:hover:text-yellow-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión - Cliente
                    </Link>
                    <Link
                      to="/login?type=admin"
                      className="block py-2 px-4 bg-azul-oscuro text-white rounded-lg hover:bg-primary-600 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión - Admin
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}