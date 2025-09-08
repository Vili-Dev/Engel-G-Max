/**
 * Hook Newsletter Modal
 * Gestion intelligente des pop-ups newsletter pour maximiser les conversions
 */

import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

interface NewsletterModalConfig {
  showOnExitIntent: boolean;
  showOnScroll: boolean;
  showOnTimeDelay: boolean;
  showOnPageCount: boolean;
  exitIntentSensitivity: number;
  scrollPercentage: number;
  timeDelay: number; // en secondes
  pageCountThreshold: number;
  showMaxTimes: number;
  daysBetweenShows: number;
}

interface NewsletterModalState {
  isOpen: boolean;
  variant: 'welcome' | 'exit-intent' | 'scroll' | 'time-based' | 'special-offer';
  source: string;
  hasShown: boolean;
  showCount: number;
  lastShownDate: string | null;
}

const DEFAULT_CONFIG: NewsletterModalConfig = {
  showOnExitIntent: true,
  showOnScroll: true,
  showOnTimeDelay: true,
  showOnPageCount: true,
  exitIntentSensitivity: 50, // pixels
  scrollPercentage: 60,
  timeDelay: 30, // 30 secondes
  pageCountThreshold: 3,
  showMaxTimes: 3,
  daysBetweenShows: 7
};

export const useNewsletterModal = (config: Partial<NewsletterModalConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { trackModalTrigger, trackUserBehavior } = useAnalytics();
  
  const [modalState, setModalState] = useState<NewsletterModalState>({
    isOpen: false,
    variant: 'welcome',
    source: 'unknown',
    hasShown: false,
    showCount: 0,
    lastShownDate: null
  });

  // Charger l'état depuis localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('engelgmax_newsletter_modal_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setModalState(prev => ({
          ...prev,
          showCount: parsed.showCount || 0,
          lastShownDate: parsed.lastShownDate || null
        }));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'état modal:', error);
      }
    }
  }, []);

  // Sauvegarder l'état dans localStorage
  const saveState = useCallback((newState: Partial<NewsletterModalState>) => {
    const stateToSave = {
      showCount: newState.showCount ?? modalState.showCount,
      lastShownDate: newState.lastShownDate ?? modalState.lastShownDate
    };
    
    localStorage.setItem('engelgmax_newsletter_modal_state', JSON.stringify(stateToSave));
  }, [modalState]);

  // Vérifier si on peut afficher le modal
  const canShowModal = useCallback((): boolean => {
    // Vérifier le nombre max d'affichages
    if (modalState.showCount >= finalConfig.showMaxTimes) {
      return false;
    }

    // Vérifier la fréquence d'affichage
    if (modalState.lastShownDate) {
      const lastShown = new Date(modalState.lastShownDate);
      const daysSinceLastShown = (Date.now() - lastShown.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastShown < finalConfig.daysBetweenShows) {
        return false;
      }
    }

    // Vérifier si déjà abonné
    const isSubscribed = localStorage.getItem('engelgmax_newsletter_subscribed') === 'true';
    if (isSubscribed) {
      return false;
    }

    return true;
  }, [modalState, finalConfig]);

  // Afficher le modal avec une variante spécifique
  const showModal = useCallback((variant: NewsletterModalState['variant'], source: string) => {
    if (!canShowModal()) {
      return false;
    }

    setModalState(prev => ({
      ...prev,
      isOpen: true,
      variant,
      source,
      hasShown: true
    }));

    // Tracker le déclenchement
    trackModalTrigger('newsletter_modal', variant, source);

    return true;
  }, [canShowModal, trackModalTrigger]);

  // Fermer le modal
  const closeModal = useCallback(() => {
    setModalState(prev => {
      const newState = {
        ...prev,
        isOpen: false,
        showCount: prev.showCount + 1,
        lastShownDate: new Date().toISOString()
      };

      // Sauvegarder l'état
      saveState(newState);
      
      return newState;
    });
  }, [saveState]);

  // =============  DÉCLENCHEURS AUTOMATIQUES =============

  // Déclencheur : Exit Intent
  useEffect(() => {
    if (!finalConfig.showOnExitIntent) return;

    let hasTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered || modalState.isOpen) return;
      
      if (e.clientY <= finalConfig.exitIntentSensitivity) {
        hasTriggered = true;
        const shown = showModal('exit-intent', 'exit_intent');
        
        if (shown) {
          trackUserBehavior('exit_intent_detected', {
            cursorY: e.clientY,
            timeOnPage: Date.now() - (window as any).__pageLoadTime
          });
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [finalConfig.showOnExitIntent, finalConfig.exitIntentSensitivity, showModal, modalState.isOpen, trackUserBehavior]);

  // Déclencheur : Scroll
  useEffect(() => {
    if (!finalConfig.showOnScroll) return;

    let hasTriggered = false;

    const handleScroll = () => {
      if (hasTriggered || modalState.isOpen) return;

      const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage >= finalConfig.scrollPercentage) {
        hasTriggered = true;
        const shown = showModal('scroll', 'scroll_trigger');
        
        if (shown) {
          trackUserBehavior('scroll_threshold_reached', {
            scrollPercentage: Math.round(scrollPercentage),
            timeOnPage: Date.now() - (window as any).__pageLoadTime
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [finalConfig.showOnScroll, finalConfig.scrollPercentage, showModal, modalState.isOpen, trackUserBehavior]);

  // Déclencheur : Délai temporel
  useEffect(() => {
    if (!finalConfig.showOnTimeDelay) return;

    const timer = setTimeout(() => {
      if (!modalState.isOpen && !modalState.hasShown) {
        const shown = showModal('time-based', 'time_delay');
        
        if (shown) {
          trackUserBehavior('time_delay_reached', {
            delaySeconds: finalConfig.timeDelay,
            timeOnPage: finalConfig.timeDelay
          });
        }
      }
    }, finalConfig.timeDelay * 1000);

    return () => clearTimeout(timer);
  }, [finalConfig.showOnTimeDelay, finalConfig.timeDelay, showModal, modalState.isOpen, modalState.hasShown, trackUserBehavior]);

  // Déclencheur : Nombre de pages vues
  useEffect(() => {
    if (!finalConfig.showOnPageCount) return;

    // Incrémenter le compteur de pages
    const pageCount = parseInt(sessionStorage.getItem('engelgmax_page_count') || '0') + 1;
    sessionStorage.setItem('engelgmax_page_count', pageCount.toString());

    // Vérifier le seuil
    if (pageCount >= finalConfig.pageCountThreshold && !modalState.hasShown) {
      setTimeout(() => {
        if (!modalState.isOpen) {
          const shown = showModal('welcome', 'page_count');
          
          if (shown) {
            trackUserBehavior('page_count_threshold_reached', {
              pageCount,
              threshold: finalConfig.pageCountThreshold
            });
          }
        }
      }, 2000); // Délai de 2 secondes pour laisser le temps à la page de se charger
    }
  }, [finalConfig.showOnPageCount, finalConfig.pageCountThreshold, showModal, modalState.isOpen, modalState.hasShown, trackUserBehavior]);

  // =============  MÉTHODES MANUELLES =============

  // Afficher manuellement une offre spéciale
  const showSpecialOffer = useCallback(() => {
    return showModal('special-offer', 'manual_special_offer');
  }, [showModal]);

  // Afficher modal de bienvenue
  const showWelcomeModal = useCallback(() => {
    return showModal('welcome', 'manual_welcome');
  }, [showModal]);

  // Marquer comme abonné (empêche les futurs affichages)
  const markAsSubscribed = useCallback(() => {
    localStorage.setItem('engelgmax_newsletter_subscribed', 'true');
    closeModal();
  }, [closeModal]);

  // Réinitialiser les données (pour les tests)
  const resetModalData = useCallback(() => {
    localStorage.removeItem('engelgmax_newsletter_modal_state');
    localStorage.removeItem('engelgmax_newsletter_subscribed');
    sessionStorage.removeItem('engelgmax_page_count');
    
    setModalState({
      isOpen: false,
      variant: 'welcome',
      source: 'reset',
      hasShown: false,
      showCount: 0,
      lastShownDate: null
    });
  }, []);

  // Statistiques d'utilisation
  const getModalStats = useCallback(() => {
    return {
      showCount: modalState.showCount,
      lastShownDate: modalState.lastShownDate,
      canShowModal: canShowModal(),
      isSubscribed: localStorage.getItem('engelgmax_newsletter_subscribed') === 'true',
      pageCount: parseInt(sessionStorage.getItem('engelgmax_page_count') || '0'),
      config: finalConfig
    };
  }, [modalState, canShowModal, finalConfig]);

  return {
    // État
    isOpen: modalState.isOpen,
    variant: modalState.variant,
    source: modalState.source,
    
    // Actions
    showModal,
    closeModal,
    showSpecialOffer,
    showWelcomeModal,
    markAsSubscribed,
    
    // Utilitaires
    resetModalData,
    getModalStats,
    canShowModal: canShowModal()
  };
};

export default useNewsletterModal;