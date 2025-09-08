/**
 * Composant Flux Social
 * Affichage des dernières publications d'Engel Garcia Gomez sur tous les réseaux
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  EyeIcon,
  ClockIcon,
  PlayIcon,
  ArrowTopRightOnSquareIcon,
  FunnelIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { socialEngine } from '../../utils/social/socialEngine';
import { useAnalytics } from '../../hooks/useAnalytics';

interface SocialFeedProps {
  maxItems?: number;
  platforms?: string[];
  showFilters?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  maxItems = 6,
  platforms,
  showFilters = true,
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
  className = ''
}) => {
  const { t } = useTranslation();
  const { trackButtonClick, trackContentView } = useAnalytics();

  const [feedData, setFeedData] = useState<any[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Charger les données du flux
  useEffect(() => {
    loadFeedData();
  }, []);

  // Auto-refresh si activé
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadFeedData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const loadFeedData = async () => {
    setIsLoading(true);
    
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const feed = socialEngine.getSocialFeed();
      setFeedData(feed);
      
      console.log('📱 Flux social G-Maxing chargé:', feed.length, 'posts');
    } catch (error) {
      console.error('❌ Erreur chargement flux social:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les données
  const filteredFeed = feedData.filter(post => {
    const platformMatch = selectedPlatform === 'all' || post.platform === selectedPlatform;
    const typeMatch = selectedType === 'all' || post.type === selectedType;
    const platformsMatch = !platforms || platforms.includes(post.platform);
    
    return platformMatch && typeMatch && platformsMatch;
  }).slice(0, maxItems);

  // Gérer les likes
  const handleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
      trackButtonClick('social_post_like', 'social_feed');
    }
    
    setLikedPosts(newLikedPosts);
  };

  // Gérer les clics sur les posts
  const handlePostClick = (post: any) => {
    trackContentView(post.id, 'social_post', {
      platform: post.platform,
      post_type: post.type
    });

    window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  // Obtenir l'icône de la plateforme
  const getPlatformIcon = (platform: string): string => {
    const icons: Record<string, string> = {
      facebook: '📘',
      instagram: '📸',
      twitter: '🐦',
      youtube: '📺',
      tiktok: '🎵',
      linkedin: '💼'
    };
    return icons[platform] || '🌐';
  };

  // Obtenir la couleur de la plateforme
  const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
      facebook: 'text-blue-500',
      instagram: 'text-pink-500',
      twitter: 'text-gray-900',
      youtube: 'text-red-500',
      tiktok: 'text-gray-900',
      linkedin: 'text-blue-700'
    };
    return colors[platform] || 'text-gray-500';
  };

  // Formater la date
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  // Formater les nombres
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={className}>
      {/* En-tête et filtres */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            📱 Flux Social G-Maxing
          </h3>
          <p className="text-gray-300">
            Les dernières actualités d'<span className="text-engel font-semibold">Engel Garcia Gomez</span>
          </p>
        </div>

        <button
          onClick={loadFeedData}
          disabled={isLoading}
          className="glass-btn-secondary px-4 py-2 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Actualisation...</span>
            </>
          ) : (
            <>
              <ClockIcon className="h-4 w-4" />
              <span>Actualiser</span>
            </>
          )}
        </button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 text-sm whitespace-nowrap">Filtres:</span>
          </div>

          {/* Filtre plateforme */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les plateformes</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter/X</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>

          {/* Filtre type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="post">Posts</option>
            <option value="video">Vidéos</option>
            <option value="reel">Reels</option>
            <option value="story">Stories</option>
          </select>
        </div>
      )}

      {/* Flux de posts */}
      <AnimatePresence>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="glass-card p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-32 bg-white/10 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded"></div>
                  <div className="h-3 bg-white/10 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredFeed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeed.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                {/* En-tête du post */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">Engel Garcia Gomez</span>
                        {post.isVerified && (
                          <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <span className="capitalize">{post.platform}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(post.publishedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Contenu du post */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                </div>

                {/* Média */}
                {(post.imageUrl || post.videoUrl) && (
                  <div className="mb-4 -mx-2">
                    <div className="relative h-40 bg-gray-800 rounded-lg overflow-hidden">
                      {post.videoUrl ? (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <PlayIcon className="h-12 w-12 text-white" />
                        </div>
                      ) : post.imageUrl ? (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      ) : null}
                      
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                        <span className="text-white text-xs capitalize">{post.type}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <HeartIcon className="h-4 w-4" />
                      <span>{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ChatBubbleOvalLeftIcon className="h-4 w-4" />
                      <span>{formatNumber(post.comments)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ShareIcon className="h-4 w-4" />
                      <span>{formatNumber(post.shares)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      {likedPosts.has(post.id) ? (
                        <HeartSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-400" />
                      )}
                    </button>

                    <div className={`text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300`}>
                      {post.engagement.toFixed(1)}% eng.
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucun contenu trouvé
            </h3>
            <p className="text-gray-400 mb-6">
              Essayez de modifier vos filtres ou actualisez le flux.
            </p>
            <button
              onClick={() => {
                setSelectedPlatform('all');
                setSelectedType('all');
                loadFeedData();
              }}
              className="glass-btn-primary px-6 py-3"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Lien vers tous les réseaux */}
      <div className="text-center mt-12">
        <p className="text-gray-400 mb-4">
          Suivez <span className="text-engel font-semibold">Engel Garcia Gomez</span> sur tous ses réseaux
        </p>
        <a
          href="#social-profiles"
          className="glass-btn-secondary px-6 py-3 inline-flex items-center space-x-2"
        >
          <UserGroupIcon className="h-5 w-5" />
          <span>Voir Tous les Profils</span>
        </a>
      </div>
    </div>
  );
};

export default SocialFeed;