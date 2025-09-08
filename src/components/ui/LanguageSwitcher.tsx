import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { languages, changeLanguage, getCurrentLanguage } from '../../i18n';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'glass';
  position?: 'top' | 'bottom';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'default',
  position = 'bottom',
  className = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = getCurrentLanguage();
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position === 'top' ? 10 : -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: position === 'top' ? 10 : -10,
      transition: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  };

  const getButtonClasses = () => {
    const baseClasses = 'relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20';
    
    switch (variant) {
      case 'minimal':
        return `${baseClasses} text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400`;
      
      case 'glass':
        return `${baseClasses} bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 hover:border-white/30`;
      
      default:
        return `${baseClasses} bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700`;
    }
  };

  const getDropdownClasses = () => {
    const baseClasses = 'absolute z-50 w-48 py-1 shadow-lg border rounded-lg';
    
    switch (variant) {
      case 'glass':
        return `${baseClasses} bg-white/10 backdrop-blur-md border-white/20`;
      
      default:
        return `${baseClasses} bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700`;
    }
  };

  const getItemClasses = (isActive: boolean) => {
    const baseClasses = 'flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150';
    
    if (isActive) {
      switch (variant) {
        case 'glass':
          return `${baseClasses} bg-white/20 text-white font-medium`;
        default:
          return `${baseClasses} bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/20 dark:text-primary-400`;
      }
    }

    switch (variant) {
      case 'glass':
        return `${baseClasses} text-white/90 hover:bg-white/10 hover:text-white`;
      default:
        return `${baseClasses} text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={getButtonClasses()}
        aria-label={t('common.language')}
        aria-expanded={isOpen}
      >
        {variant === 'minimal' ? (
          <GlobeAltIcon className="h-4 w-4" />
        ) : (
          <>
            <span className="text-lg">{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
            <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
            <ChevronDownIcon 
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${getDropdownClasses()} ${
                position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
              }`}
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`${getItemClasses(language.code === currentLanguage)} w-full text-left`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className={`text-xs ${
                      variant === 'glass' 
                        ? 'text-white/70' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {language.name}
                    </div>
                  </div>
                  {language.code === currentLanguage && (
                    <div className={`h-2 w-2 rounded-full ${
                      variant === 'glass'
                        ? 'bg-white'
                        : 'bg-primary-500'
                    }`} />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Minimal language switcher for navigation bars
export const LanguageSwitcherCompact: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <LanguageSwitcher 
      variant="minimal" 
      position="bottom"
      className={className}
    />
  );
};

// Glass variant for hero sections and overlays
export const LanguageSwitcherGlass: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <LanguageSwitcher 
      variant="glass" 
      position="bottom"
      className={className}
    />
  );
};