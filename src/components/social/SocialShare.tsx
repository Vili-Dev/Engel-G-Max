/**
 * Composant Partage Social
 * Boutons de partage optimisés pour les contenus G-Maxing d'Engel Garcia Gomez
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ShareIcon,
  ClipboardIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { socialEngine } from '../../utils/social/socialEngine';
import { useAnalytics } from '../../hooks/useAnalytics';

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  hashtags?: string[];
  variant?: 'compact' | 'expanded' | 'floating';
  platforms?: string[];
  showLabels?: boolean;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  title,
  description,
  url = window.location.href,
  image,
  hashtags = ['GMaxing', 'EngelGarciaGomez', 'Transformation'],
  variant = 'compact',
  platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'instagram', 'telegram'],
  showLabels = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const { trackButtonClick } = useAnalytics();

  const [isExpanded, setIsExpanded] = useState(variant === 'expanded');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  // Données de partage
  const shareData = {
    title,
    description,
    url,
    image,
    hashtags
  };

  // Configuration des plateformes
  const platformConfigs: Record<string, {
    name: string;
    icon: string;
    color: string;
    bgColor: string;
    hoverColor: string;
  }> = {
    facebook: {
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    twitter: {
      name: 'Twitter/X',
      icon: '🐦',
      color: '#000000',
      bgColor: 'bg-gray-900',
      hoverColor: 'hover:bg-gray-800'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0A66C2',
      bgColor: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800'
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    instagram: {
      name: 'Instagram',
      icon: '📸',
      color: '#E4405F',
      bgColor: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700'
    },
    telegram: {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088CC',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    youtube: {
      name: 'YouTube',
      icon: '📺',
      color: '#FF0000',
      bgColor: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    },
    tiktok: {
      name: 'TikTok',
      icon: '🎵',
      color: '#000000',
      bgColor: 'bg-gray-900',
      hoverColor: 'hover:bg-gray-800'
    }
  };

  // Gérer le partage
  const handleShare = async (platform: string) => {
    try {
      const success = await socialEngine.share(platform, shareData);
      
      if (success) {
        setShareCount(prev => prev + 1);
        trackButtonClick('social_share', platform, {
          content_title: title,
          platform: platform,
          share_type: 'external'
        });
        
        console.log(`✅ Contenu partagé sur ${platform}`);
        
        // Feedback visuel léger
        const button = document.getElementById(`share-${platform}`);
        if (button) {
          button.style.transform = 'scale(1.1)';
          setTimeout(() => {
            button.style.transform = 'scale(1)';
          }, 200);
        }
      }
    } catch (error) {
      console.error(`❌ Erreur partage ${platform}:`, error);
    }
  };

  // Gérer la copie dans le presse-papier
  const handleCopyLink = async () => {
    try {
      const success = await socialEngine.copyToClipboard(shareData);
      
      if (success) {
        setCopiedToClipboard(true);
        trackButtonClick('copy_link', 'clipboard');
        
        // Reset après 2 secondes
        setTimeout(() => {
          setCopiedToClipboard(false);
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erreur copie lien:', error);
    }
  };

  // Utiliser le partage natif si disponible
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url
        });
        
        trackButtonClick('native_share', 'system');
        setShareCount(prev => prev + 1);
      } catch (error) {
        // Utilisateur a annulé le partage
        console.log('Partage natif annulé');
      }
    } else {
      // Fallback vers les boutons de partage
      setIsExpanded(!isExpanded);
    }
  };

  // Rendu compact
  const renderCompact = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Bouton partage principal */}
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 group"
      >
        <ShareIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
        {showLabels && <span>Partager</span>}
        {shareCount > 0 && (
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
            {shareCount}
          </span>
        )}
      </button>

      {/* Bouton copier lien */}
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg border border-white/20 transition-all duration-200 ${
          copiedToClipboard
            ? 'bg-green-500 text-white'
            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
        }`}
        title="Copier le lien"
      >
        {copiedToClipboard ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <ClipboardIcon className="h-4 w-4" />
        )}
      </button>

      {/* Bouton d'expansion */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-2 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white rounded-lg transition-all duration-200"
        title="Plus d'options"
      >
        {isExpanded ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );

  // Rendu étendu
  const renderExpanded = () => (
    <div className={`space-y-4 ${className}`}>
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center space-x-2">
          <ShareIcon className="h-5 w-5" />
          <span>Partager ce contenu G-Maxing</span>
        </h3>
        
        {shareCount > 0 && (
          <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
            {shareCount} partage{shareCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Grille de boutons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {platforms.map((platform) => {
          const config = platformConfigs[platform];
          if (!config) return null;

          return (
            <motion.button
              key={platform}
              id={`share-${platform}`}
              onClick={() => handleShare(platform)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center space-x-2 ${config.bgColor} ${config.hoverColor} text-white p-3 rounded-xl transition-all duration-200 group`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {config.icon}
              </span>
              {showLabels && (
                <span className="text-sm font-medium hidden sm:inline">
                  {config.name}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Actions supplémentaires */}
      <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
        <button
          onClick={handleCopyLink}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            copiedToClipboard
              ? 'bg-green-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
          }`}
        >
          {copiedToClipboard ? (
            <>
              <CheckIcon className="h-4 w-4" />
              <span>Lien copié !</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="h-4 w-4" />
              <span>Copier le lien</span>
            </>
          )}
        </button>

        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <ShareIcon className="h-4 w-4" />
            <span>Partage natif</span>
          </button>
        )}
      </div>
    </div>
  );

  // Rendu flottant
  const renderFloating = () => (
    <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-40 ${className}`}>
      <div className="glass-card p-3 space-y-2">
        <div className="text-center mb-2">
          <ShareIcon className="h-5 w-5 text-blue-400 mx-auto mb-1" />
          <div className="text-white text-xs">Partager</div>
        </div>

        <div className="space-y-2">
          {platforms.slice(0, 4).map((platform) => {
            const config = platformConfigs[platform];
            if (!config) return null;

            return (
              <motion.button
                key={platform}
                onClick={() => handleShare(platform)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 ${config.bgColor} ${config.hoverColor} text-white rounded-full flex items-center justify-center transition-all duration-200 group`}
                title={`Partager sur ${config.name}`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {config.icon}
                </span>
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={handleCopyLink}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            copiedToClipboard
              ? 'bg-green-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
          }`}
          title="Copier le lien"
        >
          {copiedToClipboard ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <ClipboardIcon className="h-4 w-4" />
          )}
        </button>

        {shareCount > 0 && (
          <div className="text-center">
            <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
              {shareCount}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Gestion des variantes
  const renderContent = () => {
    switch (variant) {
      case 'floating':
        return renderFloating();
      case 'expanded':
        return renderExpanded();
      case 'compact':
      default:
        return (
          <div>
            {renderCompact()}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="glass-card p-4">
                    {renderExpanded()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
    }
  };

  return renderContent();
};

export default SocialShare;