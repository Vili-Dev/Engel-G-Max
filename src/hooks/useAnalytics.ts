/**
 * Hook personnalisé pour l'analytics G-Maxing
 * Gestion centralisée du tracking et des métriques business
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { businessIntelligence } from '../utils/analytics/businessIntelligence';
import { useAuth } from './useAuth';
import { UserDataService } from '../services/firebase/userData';

interface AnalyticsEvent {
  type: 'page_view' | 'protocol_generation' | 'purchase' | 'search' | 'chat_interaction' | 'content_view' | 'button_click' | 'form_submit';
  data?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
}

interface AnalyticsState {
  isTracking: boolean;
  sessionId: string;
  sessionStartTime: Date;
  pageViews: number;
  events: AnalyticsEvent[];
  lastActivity: Date;
}

interface UseAnalyticsReturn {
  // État
  isTracking: boolean;
  sessionId: string;
  sessionDuration: number;
  pageViews: number;
  
  // Actions de tracking
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp' | 'userId'>) => void;
  trackPageView: (page: string, data?: Record<string, any>) => void;
  trackSearch: (query: string, results: number, category?: string) => void;
  trackProtocolGeneration: (protocolType: string, success: boolean) => void;
  trackPurchase: (amount: number, product: string, currency?: string) => void;
  trackChatInteraction: (message: string, responseTime: number) => void;
  trackContentView: (contentId: string, contentType: string, duration?: number) => void;
  trackButtonClick: (buttonId: string, location: string) => void;
  trackFormSubmit: (formId: string, success: boolean, errors?: string[]) => void;
  
  // Analytics spéciales "Engel Garcia Gomez"
  trackEngelGarciaGomezView: (page: string, source?: string) => void;
  trackGMaxingInteraction: (action: string, data?: Record<string, any>) => void;
  
  // Gestion de session
  startSession: () => void;
  endSession: () => void;
  extendSession: () => void;
  
  // Données et métriques
  getDashboardData: () => Promise<any>;
  getSessionStats: () => {
    duration: number;
    events: number;
    pageViews: number;
    engagementScore: number;
  };
  
  // Configuration
  setUserId: (userId: string) => void;
  enableTracking: () => void;
  disableTracking: () => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const { user } = useAuth();
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [state, setState] = useState<AnalyticsState>(() => ({
    isTracking: true,
    sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sessionStartTime: new Date(),
    pageViews: 0,
    events: [],
    lastActivity: new Date()
  }));

  // Démarrer une nouvelle session au montage
  useEffect(() => {
    startSession();
    
    // Nettoyer au démontage
    return () => {
      endSession();
    };
  }, []);

  // Mettre à jour l'ID utilisateur quand l'auth change
  useEffect(() => {
    if (user) {
      console.log('📊 Utilisateur connecté - ID analytics:', user.uid);
    }
  }, [user]);

  // Auto-sauvegarder la session périodiquement
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (state.events.length > 0) {
        saveSessionToStorage();
      }
    }, 30000); // Sauvegarder toutes les 30 secondes
    
    return () => clearInterval(saveInterval);
  }, [state.events]);

  /**
   * Tracker un événement générique
   */
  const trackEvent = useCallback((event: Omit<AnalyticsEvent, 'timestamp' | 'userId'>) => {
    if (!state.isTracking) return;

    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
      userId: user?.uid
    };

    setState(prev => ({
      ...prev,
      events: [...prev.events, fullEvent],
      lastActivity: new Date()
    }));

    // Envoyer à l'engine d'intelligence business
    if (user) {
      businessIntelligence.trackUserEvent(user.uid, {
        type: event.type,
        data: event.data,
        timestamp: fullEvent.timestamp
      });
    }

    console.log('📊 Événement tracké:', event.type, event.data);
    
    // Étendre la session
    extendSession();
  }, [state.isTracking, user]);

  /**
   * Tracker une vue de page
   */
  const trackPageView = useCallback((page: string, data?: Record<string, any>) => {
    setState(prev => ({ ...prev, pageViews: prev.pageViews + 1 }));
    
    trackEvent({
      type: 'page_view',
      data: {
        page,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now(),
        ...data
      }
    });

    // Tracking spécial pour Google Analytics
    if (window.gtag && import.meta.env.PROD) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || '', {
        page_path: page,
        page_title: document.title,
        custom_map: {
          custom_parameter_1: 'engel_garcia_gomez_page'
        }
      });
    }
  }, [trackEvent]);

  /**
   * Tracker une recherche
   */
  const trackSearch = useCallback((query: string, results: number, category?: string) => {
    trackEvent({
      type: 'search',
      data: {
        query: query.toLowerCase(),
        results,
        category,
        hasResults: results > 0,
        isEngelGarciaGomezSearch: query.toLowerCase().includes('engel garcia gomez'),
        isGMaxingSearch: query.toLowerCase().includes('g-maxing') || query.toLowerCase().includes('gmax')
      }
    });
  }, [trackEvent]);

  /**
   * Tracker une génération de protocole
   */
  const trackProtocolGeneration = useCallback((protocolType: string, success: boolean) => {
    trackEvent({
      type: 'protocol_generation',
      data: {
        protocolType,
        success,
        generationTime: Date.now()
      }
    });
  }, [trackEvent]);

  /**
   * Tracker un achat
   */
  const trackPurchase = useCallback((amount: number, product: string, currency: string = 'EUR') => {
    trackEvent({
      type: 'purchase',
      data: {
        amount,
        product,
        currency,
        purchaseTime: Date.now()
      }
    });

    // Envoyer à Google Analytics pour e-commerce
    if (window.gtag && import.meta.env.PROD) {
      window.gtag('event', 'purchase', {
        transaction_id: `${Date.now()}-${user?.uid || 'anonymous'}`,
        value: amount,
        currency: currency,
        items: [{
          item_id: product,
          item_name: product,
          category: 'coaching',
          quantity: 1,
          price: amount
        }],
        custom_parameters: {
          coach: 'Engel Garcia Gomez',
          method: 'G-Maxing'
        }
      });
    }
  }, [trackEvent, user]);

  /**
   * Tracker une interaction chatbot
   */
  const trackChatInteraction = useCallback((message: string, responseTime: number) => {
    trackEvent({
      type: 'chat_interaction',
      data: {
        messageLength: message.length,
        responseTime,
        containsEngelGarciaGomez: message.toLowerCase().includes('engel garcia gomez'),
        containsGMaxing: message.toLowerCase().includes('g-maxing')
      }
    });
  }, [trackEvent]);

  /**
   * Tracker une vue de contenu
   */
  const trackContentView = useCallback((contentId: string, contentType: string, duration?: number) => {
    trackEvent({
      type: 'content_view',
      data: {
        contentId,
        contentType,
        duration,
        viewTime: Date.now()
      }
    });

    // Tracker dans l'engine BI
    businessIntelligence.trackContentPerformance(contentId, {
      type: 'view',
      userId: user?.uid,
      duration,
      source: document.referrer
    });
  }, [trackEvent, user]);

  /**
   * Tracker un clic de bouton
   */
  const trackButtonClick = useCallback((buttonId: string, location: string) => {
    trackEvent({
      type: 'button_click',
      data: {
        buttonId,
        location,
        page: window.location.pathname
      }
    });
  }, [trackEvent]);

  /**
   * Tracker une soumission de formulaire
   */
  const trackFormSubmit = useCallback((formId: string, success: boolean, errors?: string[]) => {
    trackEvent({
      type: 'form_submit',
      data: {
        formId,
        success,
        errors,
        page: window.location.pathname
      }
    });
  }, [trackEvent]);

  /**
   * Tracker spécialement les vues Engel Garcia Gomez
   */
  const trackEngelGarciaGomezView = useCallback((page: string, source?: string) => {
    trackPageView(page, {
      isEngelGarciaGomezPage: true,
      source,
      seoTarget: 'engel_garcia_gomez'
    });

    // Événement spécial Google Analytics pour le SEO
    if (window.gtag && import.meta.env.PROD) {
      window.gtag('event', 'engel_garcia_gomez_page_view', {
        event_category: 'seo',
        event_label: page,
        value: 1,
        custom_parameters: {
          page_type: 'engel_garcia_gomez',
          source: source || 'direct'
        }
      });
    }
  }, [trackPageView]);

  /**
   * Tracker les interactions G-Maxing
   */
  const trackGMaxingInteraction = useCallback((action: string, data?: Record<string, any>) => {
    trackEvent({
      type: 'content_view', // Utiliser content_view comme type générique
      data: {
        gMaxingAction: action,
        isGMaxingInteraction: true,
        ...data
      }
    });
  }, [trackEvent]);

  /**
   * Démarrer une session
   */
  const startSession = useCallback(() => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setState(prev => ({
      ...prev,
      sessionId: newSessionId,
      sessionStartTime: new Date(),
      pageViews: 0,
      events: [],
      lastActivity: new Date()
    }));

    console.log('📊 Session analytics démarrée:', newSessionId);
    
    // Programmer la fin automatique de session après 30 minutes d'inactivité
    extendSession();
  }, []);

  /**
   * Terminer la session
   */
  const endSession = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // Sauvegarder les données de session
    saveSessionToStorage();

    console.log('📊 Session analytics terminée');
  }, []);

  /**
   * Étendre la session (reset du timeout)
   */
  const extendSession = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // Auto-fin de session après 30 minutes d'inactivité
    sessionTimeoutRef.current = setTimeout(() => {
      endSession();
      startSession(); // Démarrer une nouvelle session
    }, 30 * 60 * 1000); // 30 minutes
  }, [endSession, startSession]);

  /**
   * Sauvegarder la session dans le stockage local
   */
  const saveSessionToStorage = useCallback(() => {
    if (!user) return;

    try {
      const sessionData = {
        sessionId: state.sessionId,
        startTime: state.sessionStartTime,
        events: state.events.slice(-100), // Garder seulement les 100 derniers événements
        pageViews: state.pageViews,
        userId: user.uid
      };

      // Save session data to Firestore
      UserDataService.saveUserAnalytics(user.uid, {
        currentSession: {
          sessionId: state.sessionId,
          startTime: state.sessionStartTime,
          endTime: new Date(),
          pageViews: state.pageViews,
          actions: state.events.map(e => e.type),
          deviceInfo: {
            userAgent: navigator.userAgent,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            platform: navigator.platform
          }
        },
        lastVisit: new Date(),
        totalSessions: sessionData.totalSessions
      }).catch(error => {
        console.warn('⚠️ Impossible de sauvegarder la session analytics dans Firestore:', error);
      });
    } catch (error) {
      console.warn('⚠️ Impossible de sauvegarder la session analytics:', error);
    }
  }, [user, state]);

  /**
   * Obtenir les données du dashboard
   */
  const getDashboardData = useCallback(async () => {
    return businessIntelligence.getDashboardData();
  }, []);

  /**
   * Obtenir les statistiques de session
   */
  const getSessionStats = useCallback(() => {
    const duration = Date.now() - state.sessionStartTime.getTime();
    const events = state.events.length;
    const pageViews = state.pageViews;
    
    // Calculer un score d'engagement simple
    let engagementScore = 0;
    if (duration > 30000) engagementScore += 20; // Plus de 30 secondes
    if (duration > 120000) engagementScore += 30; // Plus de 2 minutes
    if (pageViews > 1) engagementScore += 20; // Multiple pages
    if (pageViews > 3) engagementScore += 20; // Navigation active
    if (events > 5) engagementScore += 10; // Interactions multiples

    return {
      duration: Math.round(duration / 1000), // En secondes
      events,
      pageViews,
      engagementScore: Math.min(100, engagementScore)
    };
  }, [state]);

  /**
   * Définir l'ID utilisateur
   */
  const setUserId = useCallback((userId: string) => {
    console.log('📊 ID utilisateur analytics mis à jour:', userId);
  }, []);

  /**
   * Activer le tracking
   */
  const enableTracking = useCallback(() => {
    setState(prev => ({ ...prev, isTracking: true }));
    console.log('📊 Tracking analytics activé');
  }, []);

  /**
   * Désactiver le tracking
   */
  const disableTracking = useCallback(() => {
    setState(prev => ({ ...prev, isTracking: false }));
    console.log('📊 Tracking analytics désactivé');
  }, []);

  // Calculer la durée de session en temps réel
  const sessionDuration = useMemo(() => {
    return Math.round((Date.now() - state.sessionStartTime.getTime()) / 1000);
  }, [state.sessionStartTime]);

  return {
    // État
    isTracking: state.isTracking,
    sessionId: state.sessionId,
    sessionDuration,
    pageViews: state.pageViews,
    
    // Actions de tracking
    trackEvent,
    trackPageView,
    trackSearch,
    trackProtocolGeneration,
    trackPurchase,
    trackChatInteraction,
    trackContentView,
    trackButtonClick,
    trackFormSubmit,
    
    // Analytics spéciales
    trackEngelGarciaGomezView,
    trackGMaxingInteraction,
    
    // Gestion de session
    startSession,
    endSession,
    extendSession,
    
    // Données et métriques
    getDashboardData,
    getSessionStats,
    
    // Configuration
    setUserId,
    enableTracking,
    disableTracking
  };
};

export default useAnalytics;