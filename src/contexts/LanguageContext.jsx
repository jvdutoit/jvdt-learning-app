// Translation context for language switching
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create language context
const LanguageContext = createContext();

// Language provider component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('jvdt:language');
    if (savedLanguage && ['en', 'uk'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference when it changes
  const changeLanguage = (newLanguage) => {
    if (['en', 'uk'].includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem('jvdt:language', newLanguage);
    }
  };

  const value = {
    language,
    changeLanguage,
    isUkrainian: language === 'uk',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation hook
export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key, fallback = key) => {
    try {
      // Import translations dynamically
      const translations = require(`./translations/${language}.json`);
      
      // Support nested keys like "jvdt2.title"
      const keys = key.split('.');
      let value = translations;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return fallback || key;
        }
      }
      
      return typeof value === 'string' ? value : fallback || key;
    } catch (error) {
      console.warn(`Translation not found for key: ${key}`, error);
      return fallback || key;
    }
  };

  return { t, language };
}