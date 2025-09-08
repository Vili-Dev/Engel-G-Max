/**
 * Bannière d'Installation PWA
 * Invite les utilisateurs à installer l'application G-Maxing d'Engel Garcia Gomez
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  BoltIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { usePWA } from '../../hooks/usePWA';
import { useAnalytics } from '../../hooks/useAnalytics';

interface PWAInstallBannerProps {
  variant?: 'banner' | 'modal' | 'floating';
  autoShow?: boolean;
  delay?: number;
  className?: string;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  variant = 'banner',
  autoShow = true,
  delay = 3000,
  className = ''
}) => {
  const { t } = useTranslation();
  const { trackButtonClick, trackModalView } = useAnalytics();
  
  const {
    isInstallable,
    isInstalled,
    installApp,
    capabilities,
    getDeviceInfo
  } = usePWA();

  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Vérifier si la bannière a été fermée précédemment
  useEffect(() => {
    const dismissed = localStorage.getItem('engelgmax_pwa_banner_dismissed');
    const lastShown = localStorage.getItem('engelgmax_pwa_banner_last_shown');
    
    if (dismissed === 'true') {
      // Vérifier si ça fait plus de 7 jours
      if (lastShown) {
        const daysSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
        if (daysSinceLastShown < 7) {
          setIsDismissed(true);
          return;
        }
      } else {
        setIsDismissed(true);
        return;
      }
    }

    // Afficher automatiquement si installable et pas installé
    if (autoShow && isInstallable && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        trackModalView('pwa_install_banner', variant);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isDismissed, autoShow, delay, variant, trackModalView]);

  // Ne pas afficher si pas installable, déjà installé ou fermé
  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    trackButtonClick('pwa_install_clicked', `${variant}_banner`);

    try {
      const success = await installApp();
      
      if (success) {
        setIsVisible(false);
        trackButtonClick('pwa_install_success', `${variant}_banner`);
        
        // Afficher un message de succès
        setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎉 Engel G-Max installé !', {
              body: 'L\'application G-Maxing est maintenant disponible sur votre écran d\'accueil',
              icon: '/icons/icon-192x192.png'
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur installation PWA:', error);
      trackButtonClick('pwa_install_error', `${variant}_banner`);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    
    localStorage.setItem('engelgmax_pwa_banner_dismissed', 'true');
    localStorage.setItem('engelgmax_pwa_banner_last_shown', Date.now().toString());
    
    trackButtonClick('pwa_install_dismissed', `${variant}_banner`);
  };

  const deviceInfo = getDeviceInfo();
  const isMobile = deviceInfo.isMobile;
  const isIOS = deviceInfo.isIOS;

  // Instructions spécifiques selon la plateforme
  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: 'Ajouter à l\'Écran d\'Accueil',
        instruction: 'Appuyez sur le bouton de partage puis "Ajouter à l\'écran d\'accueil"',
        icon: '📱'
      };
    } else {
      return {
        title: 'Installer l\'Application',
        instruction: 'Cliquez sur "Installer" pour accéder à G-Maxing depuis votre écran d\'accueil',
        icon: '⚡'
      };
    }
  };

  const installInfo = getInstallInstructions();

  // Avantages de l'installation
  const benefits = [
    {
      icon: BoltIcon,
      title: 'Accès Instantané',
      description: 'Lancez G-Maxing depuis votre écran d\'accueil'
    },
    {
      icon: SparklesIcon,
      title: 'Mode Hors Ligne',
      description: 'Consultez vos protocoles même sans internet'
    },
    {
      icon: HeartIcon,
      title: 'Notifications',
      description: 'Recevez les derniers conseils d\'Engel Garcia Gomez'
    }
  ];

  const renderBanner = () => (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{installInfo.icon}</div>
              <div>
                <div className="font-semibold">
                  Installer Engel G-Max
                </div>
                <div className="text-sm text-blue-100">
                  Accès rapide à la méthode G-Maxing
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isInstalling ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span>Installation...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Installer</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="bg-gray-900 text-white rounded-2xl max-w-lg w-full p-8 relative"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{installInfo.icon}</div>
          <h2 className="text-2xl font-bold mb-2">
            Installer <span className="text-engel">Engel G-Max</span>
          </h2>
          <p className="text-gray-300">
            Transformez votre smartphone en machine G-Maxing !
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold">{benefit.title}</div>
                  <div className="text-sm text-gray-400">{benefit.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isInstalling ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Installation en cours...</span>
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Installer Maintenant</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDismiss}
            className="w-full bg-white/10 text-gray-300 hover:bg-white/20 py-2 px-4 rounded-lg transition-colors"
          >
            Plus tard
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500">
            {installInfo.instruction}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderFloating = () => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className={`fixed bottom-4 right-4 z-50 ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl max-w-sm">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">{installInfo.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">
                Installer Engel G-Max
              </h3>
              <p className="text-xs text-blue-100 mt-1">
                Accès rapide à vos protocoles G-Maxing
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-white text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isInstalling ? 'Installation...' : 'Installer'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'modal':
        return renderModal();
      case 'floating':
        return renderFloating();
      case 'banner':
      default:
        return renderBanner();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && renderContent()}
    </AnimatePresence>
  );
};

export default PWAInstallBanner;