import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'sw' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.welcome': 'Welcome to AgroFarmer Connect',
    'nav.platform': 'Platform',
    'nav.home': 'Home',
    'nav.jobs': 'Jobs',
    'nav.tools': 'Tools',
    'nav.workers': 'Workers',
    'nav.map': 'Map',
    'nav.activity': 'My Activity',
    'nav.messages': 'Messages',
    'nav.bookings': 'Bookings',
    'nav.wallet': 'Wallet',
    'nav.account': 'Account',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.admin': 'Admin',
    'action.signOut': 'Sign Out',
    'header.postJob': 'Post Job',
    'header.dashboard': 'Dashboard'
  },
  sw: {
    'app.welcome': 'Karibu AgroFarmer Connect',
    'nav.platform': 'Jukwaa',
    'nav.home': 'Nyumbani',
    'nav.jobs': 'Kazi',
    'nav.tools': 'Vifaa',
    'nav.workers': 'Wafanyakazi',
    'nav.map': 'Ramani',
    'nav.activity': 'Shughuli Zangu',
    'nav.messages': 'Ujumbe',
    'nav.bookings': 'Oda',
    'nav.wallet': 'Pochi',
    'nav.account': 'Akaunti',
    'nav.profile': 'Wasifu',
    'nav.settings': 'Mipangilio',
    'nav.admin': 'Admin',
    'action.signOut': 'Ondoka',
    'header.postJob': 'Weka Kazi',
    'header.dashboard': 'Dashibodi'
  },
  fr: {
    'app.welcome': 'Bienvenue à AgroFarmer Connect',
    'nav.platform': 'Plateforme',
    'nav.home': 'Accueil',
    'nav.jobs': 'Emplois',
    'nav.tools': 'Outils',
    'nav.workers': 'Travailleurs',
    'nav.map': 'Carte',
    'nav.activity': 'Mon Activité',
    'nav.messages': 'Messages',
    'nav.bookings': 'Réservations',
    'nav.wallet': 'Portefeuille',
    'nav.account': 'Compte',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.admin': 'Admin',
    'action.signOut': 'Déconnexion',
    'header.postJob': 'Publier',
    'header.dashboard': 'Tableau de bord'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};