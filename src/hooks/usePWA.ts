/**
 * Hook PWA pour Engel G-Max
 * Gestion des fonctionnalités Progressive Web App
 */

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

interface PWACapabilities {
  supportsNotifications: boolean;
  supportsBackgroundSync: boolean;
  supportsPushNotifications: boolean;
  supportsOfflineMode: boolean;
  supportsInstallation: boolean;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null
  });

  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    supportsNotifications: 'Notification' in window,
    supportsBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    supportsPushNotifications: 'serviceWorker' in navigator && 'PushManager' in window,
    supportsOfflineMode: 'serviceWorker' in navigator,
    supportsInstallation: false
  });

  const [serviceWorker, setServiceWorker] = useState<ServiceWorkerRegistration | null>(null);
  const [cacheSize, setCacheSize] = useState<number>(0);

  // Initialiser le Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  // Écouter les changements de connexion
  useEffect(() => {
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }));
      console.log('🟢 Engel G-Max: Connexion rétablie');
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }));
      console.log('🔴 Engel G-Max: Mode hors ligne activé');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Écouter l'événement d'installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: installEvent
      }));

      setCapabilities(prev => ({
        ...prev,
        supportsInstallation: true
      }));

      console.log('📱 Engel G-Max: Application installable détectée');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Détecter si l'app est déjà installée
  useEffect(() => {
    const checkIfInstalled = () => {
      // Méthode 1: Vérifier le display mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // Méthode 2: Vérifier si lancé depuis l'écran d'accueil (iOS)
      const isIOSInstalled = (window.navigator as any).standalone === true;
      
      // Méthode 3: Vérifier l'URL si pas de beforeinstallprompt
      const noInstallPrompt = !pwaState.installPrompt && !pwaState.isInstallable;

      const installed = isStandalone || isIOSInstalled || (noInstallPrompt && window.location.protocol === 'https:');

      setPwaState(prev => ({
        ...prev,
        isInstalled: installed
      }));

      if (installed) {
        console.log('✅ Engel G-Max: Application PWA installée');
      }
    };

    checkIfInstalled();

    // Écouter les changements de display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => checkIfInstalled();
    
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleDisplayModeChange);
    } else {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleDisplayModeChange);
      } else {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
    };
  }, [pwaState.installPrompt, pwaState.isInstallable]);

  // Enregistrer le Service Worker
  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      setServiceWorker(registration);

      // Vérifier les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                setPwaState(prev => ({ ...prev, isUpdateAvailable: true }));
                console.log('🔄 Engel G-Max: Mise à jour disponible');
              }
            }
          });
        }
      });

      console.log('✅ Service Worker Engel G-Max enregistré');
      
      // Calculer la taille du cache
      getCacheSize();
      
    } catch (error) {
      console.error('❌ Erreur enregistrement Service Worker:', error);
    }
  };

  // Installer l'application
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!pwaState.installPrompt) {
      console.warn('⚠️ Aucune invite d\'installation disponible');
      return false;
    }

    try {
      await pwaState.installPrompt.prompt();
      const { outcome } = await pwaState.installPrompt.userChoice;

      if (outcome === 'accepted') {
        setPwaState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          installPrompt: null
        }));
        
        console.log('✅ Engel G-Max installé avec succès');
        
        // Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_install', {
            event_category: 'PWA',
            event_label: 'Engel G-Max Installation'
          });
        }
        
        return true;
      } else {
        console.log('❌ Installation annulée par l\'utilisateur');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'installation:', error);
      return false;
    }
  }, [pwaState.installPrompt]);

  // Appliquer la mise à jour
  const applyUpdate = useCallback(async (): Promise<boolean> => {
    if (!serviceWorker) return false;

    try {
      const newWorker = serviceWorker.waiting;
      if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        
        // Recharger la page après activation
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

        console.log('🔄 Mise à jour Engel G-Max appliquée');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur application mise à jour:', error);
      return false;
    }
  }, [serviceWorker]);

  // Demander les permissions de notification
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!capabilities.supportsNotifications) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('📧 Permission notifications Engel G-Max:', permission);
      
      if (permission === 'granted') {
        // Test notification
        new Notification('🚀 Notifications G-Maxing activées !', {
          body: 'Vous recevrez maintenant les dernières actualités d\'Engel Garcia Gomez',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'engelgmax-welcome'
        });
      }
      
      return permission;
    } catch (error) {
      console.error('❌ Erreur permission notifications:', error);
      return 'denied';
    }
  }, [capabilities.supportsNotifications]);

  // Obtenir la taille du cache
  const getCacheSize = useCallback(async () => {
    if (!serviceWorker) return;

    try {
      const messageChannel = new MessageChannel();
      
      const sizePromise = new Promise<number>((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'CACHE_SIZE_RESPONSE') {
            resolve(event.data.size);
          }
        };
      });

      serviceWorker.active?.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );

      const size = await sizePromise;
      setCacheSize(size);
      
      console.log('💾 Taille cache Engel G-Max:', (size / 1024 / 1024).toFixed(2), 'MB');
    } catch (error) {
      console.error('❌ Erreur calcul taille cache:', error);
    }
  }, [serviceWorker]);

  // Vider le cache
  const clearCache = useCallback(async (): Promise<boolean> => {
    if (!serviceWorker) return false;

    try {
      const messageChannel = new MessageChannel();
      
      const clearPromise = new Promise<boolean>((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'CACHE_CLEARED') {
            resolve(true);
          }
        };
      });

      serviceWorker.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );

      const success = await clearPromise;
      if (success) {
        setCacheSize(0);
        console.log('🗑️ Cache Engel G-Max vidé');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erreur vidage cache:', error);
      return false;
    }
  }, [serviceWorker]);

  // Partage natif
  const shareContent = useCallback(async (data: {
    title: string;
    text: string;
    url?: string;
  }): Promise<boolean> => {
    if (!navigator.share) {
      // Fallback: copier dans le presse-papier
      try {
        await navigator.clipboard.writeText(data.url || window.location.href);
        console.log('📋 Lien copié dans le presse-papier');
        return true;
      } catch {
        return false;
      }
    }

    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url || window.location.href
      });
      
      console.log('📤 Contenu partagé via API native');
      return true;
    } catch (error) {
      console.error('❌ Erreur partage natif:', error);
      return false;
    }
  }, []);

  // Informations sur l'appareil
  const getDeviceInfo = useCallback(() => {
    return {
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isAndroid: /Android/.test(navigator.userAgent),
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      supportsInstallBanner: 'BeforeInstallPromptEvent' in window,
      platform: navigator.platform,
      userAgent: navigator.userAgent
    };
  }, []);

  return {
    // État
    ...pwaState,
    capabilities,
    cacheSize: Math.round(cacheSize / 1024 / 1024 * 100) / 100, // MB avec 2 décimales
    
    // Actions
    installApp,
    applyUpdate,
    requestNotificationPermission,
    shareContent,
    getCacheSize,
    clearCache,
    
    // Informations
    getDeviceInfo
  };
};

export default usePWA;