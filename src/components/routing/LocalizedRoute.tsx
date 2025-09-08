import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentLanguage, changeLanguage, languages } from '../../i18n';

interface LocalizedRouteProps {
  children: React.ReactNode;
  defaultLanguage?: string;
}

export const LocalizedRoute: React.FC<LocalizedRouteProps> = ({
  children,
  defaultLanguage = 'en',
}) => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguage = getCurrentLanguage();

  useEffect(() => {
    const supportedLanguages = languages.map(l => l.code);
    
    // If no language in URL, redirect to default language
    if (!lang) {
      const detectedLanguage = currentLanguage || defaultLanguage;
      if (detectedLanguage !== 'en') {
        navigate(`/${detectedLanguage}${location.pathname}${location.search}`, {
          replace: true,
        });
      }
      return;
    }

    // If language in URL is not supported, redirect to default
    if (!supportedLanguages.includes(lang)) {
      navigate(`/${defaultLanguage}${location.pathname.replace(`/${lang}`, '')}${location.search}`, {
        replace: true,
      });
      return;
    }

    // If language in URL differs from current i18n language, update it
    if (lang !== currentLanguage) {
      changeLanguage(lang);
    }
  }, [lang, currentLanguage, navigate, location, defaultLanguage]);

  return <>{children}</>;
};

// Hook for generating localized paths
export const useLocalizedPath = () => {
  const currentLanguage = getCurrentLanguage();

  const getLocalizedPath = (path: string, language?: string) => {
    const lang = language || currentLanguage;
    
    // Don't prefix English routes
    if (lang === 'en') {
      return path;
    }
    
    // Add language prefix for other languages
    return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const getPathForAllLanguages = (path: string) => {
    return languages.reduce((acc, lang) => {
      acc[lang.code] = getLocalizedPath(path, lang.code);
      return acc;
    }, {} as Record<string, string>);
  };

  return {
    getLocalizedPath,
    getPathForAllLanguages,
    currentLanguage,
  };
};

// Component for language-aware navigation links
interface LocalizedLinkProps {
  to: string;
  language?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LocalizedLink: React.FC<LocalizedLinkProps> = ({
  to,
  language,
  children,
  className,
  onClick,
}) => {
  const { getLocalizedPath } = useLocalizedPath();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const localizedPath = getLocalizedPath(to, language);
    navigate(localizedPath);
    onClick?.();
  };

  return (
    <a
      href={getLocalizedPath(to, language)}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

// Language switcher with URL preservation
export const useLanguageSwitch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguage = getCurrentLanguage();

  const switchLanguage = (newLanguage: string) => {
    let newPath = location.pathname;
    
    // Remove current language prefix if it exists
    if (currentLanguage !== 'en' && newPath.startsWith(`/${currentLanguage}`)) {
      newPath = newPath.replace(`/${currentLanguage}`, '');
    }
    
    // Add new language prefix if not English
    if (newLanguage !== 'en') {
      newPath = `/${newLanguage}${newPath}`;
    }
    
    // Ensure path starts with /
    if (!newPath.startsWith('/')) {
      newPath = `/${newPath}`;
    }

    // Navigate to new URL
    navigate(`${newPath}${location.search}${location.hash}`);
    
    // Update i18n language
    changeLanguage(newLanguage);
  };

  return { switchLanguage, currentLanguage };
};

// Route configuration for multilingual routing
export const getRouteConfig = () => {
  const routes = [
    { path: '/', key: 'home' },
    { path: '/about', key: 'about' },
    { path: '/services', key: 'services' },
    { path: '/coaching', key: 'coaching' },
    { path: '/protocols', key: 'protocols' },
    { path: '/blog', key: 'blog' },
    { path: '/blog/:slug', key: 'blog-post' },
    { path: '/shop', key: 'shop' },
    { path: '/shop/:id', key: 'product' },
    { path: '/contact', key: 'contact' },
    { path: '/login', key: 'login' },
    { path: '/register', key: 'register' },
    { path: '/dashboard', key: 'dashboard' },
    { path: '/profile', key: 'profile' },
  ];

  // Generate routes for all languages
  const localizedRoutes: Array<{
    path: string;
    key: string;
    language: string;
  }> = [];

  languages.forEach(lang => {
    routes.forEach(route => {
      if (lang.code === 'en') {
        // English routes don't have language prefix
        localizedRoutes.push({
          path: route.path,
          key: `${route.key}-${lang.code}`,
          language: lang.code,
        });
      } else {
        // Other languages have language prefix
        localizedRoutes.push({
          path: `/${lang.code}${route.path}`,
          key: `${route.key}-${lang.code}`,
          language: lang.code,
        });
      }
    });
  });

  return { routes, localizedRoutes };
};

// SEO-friendly URL slug generator
export const generateSlug = (text: string, language: string = 'en'): string => {
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-áéíóúüñç]/g, '') // Remove special characters but keep accented chars
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Language-specific slug adjustments
  if (language === 'es') {
    slug = slug
      .replace(/ñ/g, 'n')
      .replace(/[áàä]/g, 'a')
      .replace(/[éèë]/g, 'e')
      .replace(/[íìï]/g, 'i')
      .replace(/[óòö]/g, 'o')
      .replace(/[úùü]/g, 'u');
  } else if (language === 'fr') {
    slug = slug
      .replace(/[àáâäæ]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/ç/g, 'c');
  }

  return slug;
};