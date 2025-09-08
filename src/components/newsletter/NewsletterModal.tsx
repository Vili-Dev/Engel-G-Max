/**
 * Modal Newsletter G-Maxing
 * Pop-up d'inscription stratégique pour maximiser les conversions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  XMarkIcon,
  SparklesIcon,
  FireIcon,
  GiftIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import NewsletterSignup from './NewsletterSignup';
import { useAnalytics } from '../../hooks/useAnalytics';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'welcome' | 'exit-intent' | 'scroll' | 'time-based' | 'special-offer';
  source?: string;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
  variant = 'welcome',
  source = 'newsletter_modal'
}) => {
  const { t } = useTranslation();
  const { trackButtonClick, trackModalView } = useAnalytics();
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes pour les offres limitées
  const [hasViewed, setHasViewed] = useState(false);

  // Tracker la vue du modal
  useEffect(() => {
    if (isOpen && !hasViewed) {
      trackModalView('newsletter_modal', variant);
      setHasViewed(true);
    }
  }, [isOpen, hasViewed, variant, trackModalView]);

  // Timer pour les offres limitées
  useEffect(() => {
    if (isOpen && variant === 'special-offer' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, variant, timeLeft]);

  // Gérer la fermeture
  const handleClose = () => {
    trackButtonClick('modal_close', `${source}_${variant}`);
    onClose();
  };

  // Éviter la fermeture lors du clic sur le contenu
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Configuration par variante
  const getVariantConfig = () => {
    switch (variant) {
      case 'welcome':
        return {
          title: '🚀 Bienvenue dans l\'univers G-Maxing !',
          subtitle: 'Découvrez les secrets d\'Engel Garcia Gomez',
          description: 'Rejoignez plus de 10,000 personnes qui transforment leur vie avec la méthode G-Maxing.',
          backgroundColor: 'from-blue-600/90 to-purple-600/90',
          showTimer: false,
          showOffer: false
        };
        
      case 'exit-intent':
        return {
          title: '⚡ Attendez ! Ne partez pas sans cela...',
          subtitle: 'Votre transformation G-Maxing vous attend',
          description: 'Recevez GRATUITEMENT le guide exclusif "Les 7 Piliers du G-Maxing" d\'Engel Garcia Gomez.',
          backgroundColor: 'from-red-600/90 to-orange-600/90',
          showTimer: false,
          showOffer: true
        };
        
      case 'scroll':
        return {
          title: '💪 Intéressé par le G-Maxing ?',
          subtitle: 'Allez plus loin avec Engel Garcia Gomez',
          description: 'Vous semblez passionné par nos contenus ! Rejoignez notre newsletter pour ne rien manquer.',
          backgroundColor: 'from-green-600/90 to-teal-600/90',
          showTimer: false,
          showOffer: false
        };
        
      case 'time-based':
        return {
          title: '🎯 Moment parfait pour commencer !',
          subtitle: 'Votre parcours G-Maxing commence maintenant',
          description: 'Plus de 500 transformations réussies ce mois-ci. Rejoignez la communauté G-Maxing maintenant !',
          backgroundColor: 'from-purple-600/90 to-pink-600/90',
          showTimer: false,
          showOffer: false
        };
        
      case 'special-offer':
        return {
          title: '🔥 OFFRE LIMITÉE : G-Maxing Premium !',
          subtitle: 'Accès exclusif aux méthodes d\'Engel Garcia Gomez',
          description: 'Inscription gratuite + accès premium pendant 30 jours. Plus que quelques places disponibles !',
          backgroundColor: 'from-yellow-600/90 to-red-600/90',
          showTimer: true,
          showOffer: true
        };
        
      default:
        return getVariantConfig();
    }
  };

  const config = getVariantConfig();

  // Formater le temps restant
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={handleContentClick}
          >
            {/* Arrière-plan avec gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.backgroundColor} rounded-2xl`} />
            
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-2xl" />
            
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
              {/* Bouton de fermeture */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors group"
              >
                <XMarkIcon className="h-6 w-6 text-white group-hover:text-gray-200" />
              </button>

              <div className="p-8">
                {/* Timer pour les offres limitées */}
                {config.showTimer && (
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 text-red-300">
                      <ClockIcon className="h-5 w-5" />
                      <span className="font-mono text-lg font-bold">
                        {formatTime(timeLeft)}
                      </span>
                      <span className="text-sm">restantes</span>
                    </div>
                  </div>
                )}

                {/* En-tête */}
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {config.title}
                  </motion.h2>
                  
                  <motion.h3 
                    className="text-xl text-gray-200 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {config.subtitle}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-300 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {config.description}
                  </motion.p>
                </div>

                {/* Avantages spéciaux pour certaines variantes */}
                {(variant === 'exit-intent' || variant === 'special-offer') && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                  >
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                      <h4 className="text-white font-bold text-lg mb-4 flex items-center">
                        <GiftIcon className="h-6 w-6 text-yellow-400 mr-2" />
                        Bonus Exclusifs Inclus :
                      </h4>
                      <ul className="space-y-2 text-gray-200">
                        <li className="flex items-center space-x-2">
                          <SparklesIcon className="h-5 w-5 text-yellow-400" />
                          <span>Guide PDF "Les 7 Piliers du G-Maxing"</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <FireIcon className="h-5 w-5 text-orange-400" />
                          <span>Accès aux protocoles secrets d'Engel Garcia Gomez</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <GiftIcon className="h-5 w-5 text-green-400" />
                          <span>Communauté privée G-Maxing (valeur 97€)</span>
                        </li>
                        {variant === 'special-offer' && (
                          <li className="flex items-center space-x-2">
                            <SparklesIcon className="h-5 w-5 text-purple-400" />
                            <span>30 jours d'accès premium GRATUIT</span>
                          </li>
                        )}
                      </ul>
                      
                      {variant === 'special-offer' && (
                        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                          <div className="text-yellow-300 font-bold text-center">
                            🎉 Valeur totale : 297€ - Gratuit aujourd'hui seulement !
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Formulaire d'inscription */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <NewsletterSignup
                    variant="modal"
                    source={`${source}_${variant}`}
                    showBenefits={variant === 'welcome' || variant === 'scroll'}
                    compactMode={variant === 'exit-intent' || variant === 'special-offer'}
                    onSuccess={(email) => {
                      console.log('✅ Inscription newsletter modal réussie:', email);
                      
                      // Fermer le modal après 3 secondes
                      setTimeout(() => {
                        onClose();
                      }, 3000);
                    }}
                    onError={(error) => {
                      console.error('❌ Erreur inscription modal:', error);
                    }}
                  />
                </motion.div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 text-center"
                >
                  <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span>Rejoint par plus de 10,247 personnes</span>
                  </div>
                  
                  <div className="mt-2 text-gray-500 text-xs">
                    ⭐⭐⭐⭐⭐ Note moyenne 4.9/5 basée sur 2,341 avis
                  </div>
                </motion.div>

                {/* Garantie */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 text-center"
                >
                  <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-green-300 text-sm">
                    <SparklesIcon className="h-4 w-4" />
                    <span>100% Gratuit - Désabonnement en 1 clic</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;