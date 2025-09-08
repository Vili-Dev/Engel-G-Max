import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentLanguage, changeLanguage, languages } from '../../i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  availableLanguages: typeof languages;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(getCurrentLanguage());
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Detect language from URL
  useEffect(() => {
    const detectLanguageFromURL = () => {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const possibleLang = pathSegments[0];
      
      // Check if first path segment is a valid language code
      if (languages.some(lang => lang.code === possibleLang)) {
        if (possibleLang !== language) {
          changeLanguage(possibleLang);
          setLanguageState(possibleLang);
        }
      } else {
        // No language prefix, default to English
        if (language !== 'en') {
          changeLanguage('en');
          setLanguageState('en');
        }
      }
    };

    detectLanguageFromURL();
    setIsLoading(false);
  }, [location.pathname, language]);

  // Set language and update URL if needed
  const setLanguage = (lang: string) => {
    if (!languages.some(l => l.code === lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }

    // Update i18n
    changeLanguage(lang);
    setLanguageState(lang);

    // Update URL
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // Remove current language prefix if exists
    if (languages.some(l => l.code === pathSegments[0])) {
      pathSegments.shift();
    }

    // Build new path
    let newPath = '';
    if (lang !== 'en') {
      newPath = `/${lang}`;
    }
    
    if (pathSegments.length > 0) {
      newPath += `/${pathSegments.join('/')}`;
    }

    if (!newPath) {
      newPath = '/';
    }

    // Navigate to new URL
    if (newPath !== currentPath) {
      navigate(newPath + location.search + location.hash, { replace: true });
    }

    // Store preference in localStorage
    localStorage.setItem('engelgmax-language', lang);
  };

  // Auto-detect user language on first visit
  useEffect(() => {
    const storedLanguage = localStorage.getItem('engelgmax-language');
    const browserLanguage = navigator.language.split('-')[0];
    const urlHasLanguage = languages.some(lang => 
      location.pathname.startsWith(`/${lang.code}`)
    );

    // Only auto-detect if no URL language and no stored preference
    if (!urlHasLanguage && !storedLanguage) {
      // Check if browser language is supported
      const supportedBrowserLang = languages.find(lang => lang.code === browserLanguage);
      
      if (supportedBrowserLang && supportedBrowserLang.code !== 'en') {
        // Redirect to browser language version
        const newPath = `/${supportedBrowserLang.code}${location.pathname}${location.search}${location.hash}`;
        navigate(newPath, { replace: true });
        return;
      }
    }

    // Use stored language if available and no URL language
    if (storedLanguage && !urlHasLanguage && storedLanguage !== 'en') {
      const newPath = `/${storedLanguage}${location.pathname}${location.search}${location.hash}`;
      navigate(newPath, { replace: true });
    }
  }, []);

  // Listen for language changes from other components
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLang = event.detail;
      if (newLang !== language) {
        setLanguageState(newLang);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    availableLanguages: languages,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for easy language switching with URL updates
export const useLanguageSwitch = () => {
  const { setLanguage } = useLanguageContext();
  return setLanguage;
};

// HOC for components that need language context
export function withLanguage<P extends object>(Component: React.ComponentType<P>) {
  return function LanguageAwareComponent(props: P) {
    const languageContext = useLanguageContext();
    
    return (
      <Component
        {...props}
        language={languageContext.language}
        setLanguage={languageContext.setLanguage}
        availableLanguages={languageContext.availableLanguages}
      />
    );
  };
}