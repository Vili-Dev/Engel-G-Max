/**
 * Composant Inscription Newsletter
 * Formulaire d'inscription optimisé pour Engel Garcia Gomez G-Maxing
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  EnvelopeIcon,
  UserIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  HeartIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckSolid } from '@heroicons/react/24/solid';
import { newsletterEngine } from '../../utils/newsletter/newsletterEngine';
import { useAnalytics } from '../../hooks/useAnalytics';

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'sidebar' | 'footer';
  source?: string;
  className?: string;
  showBenefits?: boolean;
  compactMode?: boolean;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'inline',
  source = 'newsletter_signup',
  className = '',
  showBenefits = true,
  compactMode = false,
  onSuccess,
  onError
}) => {
  const { t } = useTranslation();
  const { trackButtonClick, trackFormSubmit } = useAnalytics();

  // États du formulaire
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);

  // États des préférences
  const [preferences, setPreferences] = useState({
    gMaxing: true,
    engelGarciaGomez: true,
    transformation: true,
    entrainement: true,
    nutrition: true
  });

  // Validation email
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('L\'adresse email est requise.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Tracker l'événement
      trackFormSubmit('newsletter_subscription', source, {
        email_domain: email.split('@')[1],
        has_first_name: !!firstName.trim(),
        source: source
      });

      // Inscire via le moteur newsletter
      const result = await newsletterEngine.subscribe(email.trim(), {
        firstName: firstName.trim() || undefined,
        source: source,
        language: 'fr',
        preferences: preferences,
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        }
      });

      if (result.success) {
        setIsSuccess(true);
        setShowForm(false);
        
        // Callbacks
        onSuccess?.(email);
        
        // Tracker le succès
        trackButtonClick('newsletter_subscribed', source);
        
        console.log('✅ Inscription newsletter réussie:', email);
      } else {
        setError(result.message);
        onError?.(result.message);
      }

    } catch (error: any) {
      const errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMessage);
      onError?.(errorMessage);
      
      console.error('❌ Erreur inscription newsletter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modifier les préférences
  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Avantages de la newsletter
  const benefits = [
    {
      icon: SparklesIcon,
      title: 'Conseils Exclusifs',
      description: 'Techniques G-Maxing inédites d\'Engel Garcia Gomez'
    },
    {
      icon: BoltIcon,
      title: 'Transformations',
      description: 'Études de cas et résultats concrets'
    },
    {
      icon: HeartIcon,
      title: 'Communauté',
      description: 'Rejoignez la communauté G-Maxing'
    },
    {
      icon: TrophyIcon,
      title: 'Récompenses',
      description: 'Accès prioritaire aux nouveautés'
    }
  ];

  // Styles par variante
  const variantStyles = {
    inline: 'glass-card p-8',
    modal: 'bg-white/10 backdrop-blur-sm p-6 rounded-xl',
    sidebar: 'glass-card p-6',
    footer: 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-xl'
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key="form"
          >
            {/* En-tête */}
            <div className="text-center mb-6">
              {!compactMode && (
                <>
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Newsletter G-Maxing
                  </h3>
                  <p className="text-gray-300">
                    Recevez les derniers conseils d'<span className="text-engel font-semibold">Engel Garcia Gomez</span> 
                    {' '}directement dans votre boîte email.
                  </p>
                </>
              )}
              
              {compactMode && (
                <h3 className="text-lg font-bold text-white mb-2">
                  🚀 Newsletter G-Maxing
                </h3>
              )}
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Champ prénom (optionnel) */}
              {!compactMode && (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Votre prénom (optionnel)"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Champ email */}
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Préférences (mode étendu) */}
              {!compactMode && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">Vos centres d'intérêt :</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(preferences).map(([key, value]) => {
                      const labels: Record<string, string> = {
                        gMaxing: 'G-Maxing',
                        engelGarciaGomez: 'Engel Garcia Gomez',
                        transformation: 'Transformation',
                        entrainement: 'Entraînement',
                        nutrition: 'Nutrition'
                      };

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => togglePreference(key as any)}
                          className={`flex items-center space-x-2 p-2 rounded-lg border transition-all text-sm ${
                            value
                              ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            value ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                          }`}>
                            {value && <CheckSolid className="h-3 w-3 text-white" />}
                          </div>
                          <span>{labels[key]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Message d'erreur */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Bouton de soumission */}
              <motion.button
                type="submit"
                disabled={isLoading || !email.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Inscription en cours...</span>
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>S'abonner Gratuitement</span>
                  </>
                )}
              </motion.button>

              {/* Informations légales */}
              <p className="text-xs text-gray-500 text-center">
                En vous abonnant, vous acceptez de recevoir nos emails. 
                Désabonnement possible à tout moment.
              </p>
            </form>

            {/* Avantages */}
            {showBenefits && !compactMode && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-white font-medium mb-4 text-center">
                  Ce que vous allez recevoir :
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="flex-shrink-0 p-1">
                          <IconComponent className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">
                            {benefit.title}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {benefit.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // Message de succès
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key="success"
            className="text-center"
          >
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckSolid className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                🎉 Inscription Réussie !
              </h3>
              <p className="text-gray-300 mb-4">
                Merci <span className="text-engel font-semibold">{firstName || 'mon ami'}</span> ! 
                Vérifiez votre email pour confirmer votre abonnement.
              </p>
              <div className="text-sm text-gray-400">
                📧 Email envoyé à : <span className="text-white">{email}</span>
              </div>
            </div>

            {/* Actions après inscription */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/blog'}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Découvrir le Blog G-Maxing
              </button>
              
              <button
                onClick={() => {
                  setShowForm(true);
                  setIsSuccess(false);
                  setEmail('');
                  setFirstName('');
                  setError('');
                }}
                className="w-full bg-white/10 text-gray-300 hover:text-white py-2 px-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-sm"
              >
                Nouvelle inscription
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsletterSignup;