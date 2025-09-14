import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { translations } from './translations';

const resources = {
  en: {
    translation: translations.en,
  },
  fr: {
    translation: translations.fr,
  },
  es: {
    translation: translations.es,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    returnObjects: true, // Allow returning arrays and objects

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Language configuration
export const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English',
  },
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    nativeName: 'Français',
  },
  {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    nativeName: 'Español',
  },
];

// Helper function to get current language
export const getCurrentLanguage = () => i18n.language || 'en';

// Helper function to change language
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
  
  // Update HTML meta tags for SEO
  const htmlTag = document.querySelector('html');
  if (htmlTag) {
    htmlTag.setAttribute('lang', lng);
  }

  // Dispatch custom event for other components to listen
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: lng }));
};

// Get language direction (for RTL support if needed later)
export const getLanguageDirection = (lng?: string) => {
  const currentLng = lng || getCurrentLanguage();
  // Add RTL languages here if needed
  const rtlLanguages = ['ar', 'he', 'fa'];
  return rtlLanguages.includes(currentLng) ? 'rtl' : 'ltr';
};

// Format number according to locale
export const formatNumber = (number: number, lng?: string) => {
  const currentLng = lng || getCurrentLanguage();
  return new Intl.NumberFormat(currentLng).format(number);
};

// Format currency according to locale
export const formatCurrency = (amount: number, currency = 'EUR', lng?: string) => {
  const currentLng = lng || getCurrentLanguage();
  return new Intl.NumberFormat(currentLng, {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date according to locale
export const formatDate = (date: Date, lng?: string) => {
  const currentLng = lng || getCurrentLanguage();
  return new Intl.DateTimeFormat(currentLng, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};