import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en' | 'pt';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Header
  'header.home': { es: 'Inicio', en: 'Home', pt: 'Início' },
  'header.search': { es: 'Buscar Viajes', en: 'Search Trips', pt: 'Buscar Viagens' },
  'header.promotions': { es: 'Promociones', en: 'Promotions', pt: 'Promoções' },
  'header.loyalty': { es: 'Programa Fidelidad', en: 'Loyalty Program', pt: 'Programa Fidelidade' },
  'header.about': { es: 'Nosotros', en: 'About Us', pt: 'Sobre Nós' },
  'header.contact': { es: 'Contacto', en: 'Contact', pt: 'Contato' },
  'header.login': { es: 'Iniciar Sesión', en: 'Login', pt: 'Entrar' },
  
  // Home Page
  'home.hero.title': { es: 'Descubre el Norte del Perú', en: 'Discover Northern Peru', pt: 'Descubra o Norte do Peru' },
  'home.hero.subtitle': { es: 'Conectamos Lima con las maravillas del norte peruano', en: 'We connect Lima with the wonders of northern Peru', pt: 'Conectamos Lima com as maravilhas do norte peruano' },
  'home.search.placeholder.origin': { es: 'Seleccionar ciudad', en: 'Select city', pt: 'Selecionar cidade' },
  'home.search.button': { es: 'Buscar', en: 'Search', pt: 'Buscar' },
  
  // Common
  'common.loading': { es: 'Cargando...', en: 'Loading...', pt: 'Carregando...' },
  'common.save': { es: 'Guardar', en: 'Save', pt: 'Salvar' },
  'common.cancel': { es: 'Cancelar', en: 'Cancel', pt: 'Cancelar' },
  'common.close': { es: 'Cerrar', en: 'Close', pt: 'Fechar' },
  'common.edit': { es: 'Editar', en: 'Edit', pt: 'Editar' },
  'common.delete': { es: 'Eliminar', en: 'Delete', pt: 'Excluir' },
  'common.view': { es: 'Ver', en: 'View', pt: 'Ver' },
  
  // Admin
  'admin.dashboard': { es: 'Dashboard', en: 'Dashboard', pt: 'Painel' },
  'admin.trips': { es: 'Viajes', en: 'Trips', pt: 'Viagens' },
  'admin.buses': { es: 'Buses', en: 'Buses', pt: 'Ônibus' },
  'admin.routes': { es: 'Rutas', en: 'Routes', pt: 'Rotas' },
  'admin.tickets': { es: 'Pasajes', en: 'Tickets', pt: 'Passagens' },
  'admin.staff': { es: 'Personal', en: 'Staff', pt: 'Pessoal' },
  'admin.reports': { es: 'Reportes', en: 'Reports', pt: 'Relatórios' },
  
  // Loyalty
  'loyalty.points': { es: 'puntos', en: 'points', pt: 'pontos' },
  'loyalty.level': { es: 'Nivel', en: 'Level', pt: 'Nível' },
  'loyalty.redeem': { es: 'Canjear', en: 'Redeem', pt: 'Resgatar' },
  'loyalty.available': { es: 'Disponible', en: 'Available', pt: 'Disponível' },
  'loyalty.notAvailable': { es: 'No disponible', en: 'Not available', pt: 'Não disponível' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('norteexpreso-language');
    return (saved as Language) || 'es';
  });

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('norteexpreso-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}