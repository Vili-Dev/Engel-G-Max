import { useTranslation as useI18nTranslation, TFunction } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentLanguage, changeLanguage, formatCurrency, formatDate, formatNumber } from '../i18n';

export interface TranslationHook {
  t: TFunction;
  language: string;
  changeLanguage: (lng: string) => void;
  isRTL: boolean;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
}

/**
 * Enhanced useTranslation hook with additional localization utilities
 */
export const useTranslation = (namespace?: string): TranslationHook => {
  const { t, i18n } = useI18nTranslation(namespace);
  const [language, setLanguage] = useState(getCurrentLanguage());

  // Update language state when i18n language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleChangeLanguage = useCallback((lng: string) => {
    changeLanguage(lng);
  }, []);

  const isRTL = ['ar', 'he', 'fa'].includes(language);

  // Localized formatting functions
  const localFormatCurrency = useCallback((amount: number, currency = 'EUR') => {
    return formatCurrency(amount, currency, language);
  }, [language]);

  const localFormatDate = useCallback((date: Date) => {
    return formatDate(date, language);
  }, [language]);

  const localFormatNumber = useCallback((number: number) => {
    return formatNumber(number, language);
  }, [language]);

  return {
    t,
    language,
    changeLanguage: handleChangeLanguage,
    isRTL,
    formatCurrency: localFormatCurrency,
    formatDate: localFormatDate,
    formatNumber: localFormatNumber,
  };
};

/**
 * Hook for formatting numbers with locale support
 */
export const useNumberFormatter = () => {
  const language = getCurrentLanguage();

  return useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(language, options).format(number);
  }, [language]);
};

/**
 * Hook for formatting currencies with locale support
 */
export const useCurrencyFormatter = () => {
  const language = getCurrentLanguage();

  return useCallback((amount: number, currency = 'EUR', options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency,
      ...options,
    }).format(amount);
  }, [language]);
};

/**
 * Hook for formatting dates with locale support
 */
export const useDateFormatter = () => {
  const language = getCurrentLanguage();

  return useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    }).format(date);
  }, [language]);
};

/**
 * Hook for formatting relative time (e.g., "2 hours ago")
 */
export const useRelativeTimeFormatter = () => {
  const language = getCurrentLanguage();

  return useCallback((date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });

    if (diffYear > 0) return rtf.format(-diffYear, 'year');
    if (diffMonth > 0) return rtf.format(-diffMonth, 'month');
    if (diffWeek > 0) return rtf.format(-diffWeek, 'week');
    if (diffDay > 0) return rtf.format(-diffDay, 'day');
    if (diffHour > 0) return rtf.format(-diffHour, 'hour');
    if (diffMin > 0) return rtf.format(-diffMin, 'minute');
    
    return rtf.format(-diffSec, 'second');
  }, [language]);
};

/**
 * Hook for pluralization with locale support
 */
export const usePluralization = () => {
  const { t } = useTranslation();

  return useCallback((count: number, key: string, options?: any) => {
    return t(key, { count, ...options });
  }, [t]);
};

/**
 * Hook for getting direction-aware CSS classes
 */
export const useDirectionClasses = () => {
  const { isRTL } = useTranslation();

  return {
    textAlign: isRTL ? 'text-right' : 'text-left',
    marginLeft: (size: string) => isRTL ? `mr-${size}` : `ml-${size}`,
    marginRight: (size: string) => isRTL ? `ml-${size}` : `mr-${size}`,
    paddingLeft: (size: string) => isRTL ? `pr-${size}` : `pl-${size}`,
    paddingRight: (size: string) => isRTL ? `pl-${size}` : `pr-${size}`,
    borderLeft: isRTL ? 'border-r' : 'border-l',
    borderRight: isRTL ? 'border-l' : 'border-r',
    roundedLeft: isRTL ? 'rounded-r' : 'rounded-l',
    roundedRight: isRTL ? 'rounded-l' : 'rounded-r',
    isRTL,
  };
};

export default useTranslation;