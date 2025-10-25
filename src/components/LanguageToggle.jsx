import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === 'en'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('uk')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === 'uk'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        🇺🇦
      </button>
    </div>
  );
}