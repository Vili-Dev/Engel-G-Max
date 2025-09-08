/**
 * Composant Profils Sociaux
 * Liens vers tous les réseaux sociaux d'Engel Garcia Gomez
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowTopRightOnSquareIcon,
  UserGroupIcon,
  HeartIcon,
  EyeIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';
import { socialEngine } from '../../utils/social/socialEngine';
import { useAnalytics } from '../../hooks/useAnalytics';

interface SocialProfilesProps {
  variant?: 'horizontal' | 'vertical' | 'grid' | 'compact';
  showStats?: boolean;
  showFollowButton?: boolean;
  platforms?: string[];
  className?: string;
}

export const SocialProfiles: React.FC<SocialProfilesProps> = ({
  variant = 'horizontal',
  showStats = false,
  showFollowButton = true,
  platforms,
  className = ''
}) => {
  const { t } = useTranslation();
  const { trackButtonClick } = useAnalytics();

  const [analytics, setAnalytics] = useState<Record<string, any>>({});
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  // Charger les profils sociaux
  const socialProfiles = socialEngine.getSocialProfiles();
  
  // Filtrer les plateformes si spécifié
  const filteredProfiles = platforms 
    ? socialProfiles.filter(profile => platforms.includes(profile.name.toLowerCase()))
    : socialProfiles;

  // Charger les analytics si demandées
  useEffect(() => {
    if (showStats) {
      const analyticsData = socialEngine.getSocialAnalytics();
      setAnalytics(analyticsData);
    }
  }, [showStats]);

  // Gérer le clic sur un profil
  const handleProfileClick = (platform: string, url: string) => {
    trackButtonClick('social_profile_visit', platform.toLowerCase(), {
      platform: platform,
      external_link: url
    });

    // Ouvrir dans un nouvel onglet
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Configuration des plateformes avec statistiques
  const getPlatformConfig = (profile: any) => {
    const platformKey = profile.name.toLowerCase().replace('/', '').replace(' ', '');
    const stats = analytics[platformKey] || analytics[profile.name.toLowerCase()];
    
    return {
      ...profile,
      stats,
      displayName: profile.name === 'Twitter/X' ? 'X (Twitter)' : profile.name,
      followers: stats?.followers || 0,
      engagement: stats?.averageEngagement || 0,
      posts: stats?.posts || 0
    };
  };

  // Formater les nombres
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Rendu horizontal
  const renderHorizontal = () => (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center space-x-2 text-white">
        <UserGroupIcon className="h-5 w-5 text-blue-400" />
        <span className="font-medium">Suivez Engel Garcia Gomez :</span>
      </div>
      
      <div className="flex items-center space-x-3">
        {filteredProfiles.map((profile, index) => {
          const config = getPlatformConfig(profile);
          
          return (
            <motion.button
              key={profile.name}
              onClick={() => handleProfileClick(profile.name, profile.url)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 group border border-white/20 hover:border-white/40"
              style={{ '--platform-color': profile.color } as any}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                {profile.icon}
              </span>
              <span className="text-sm font-medium">{config.displayName}</span>
              {config.followers > 0 && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {formatNumber(config.followers)}
                </span>
              )}
              <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  // Rendu vertical
  const renderVertical = () => (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-white font-semibold flex items-center space-x-2">
        <UserGroupIcon className="h-5 w-5 text-blue-400" />
        <span>Réseaux Sociaux G-Maxing</span>
      </h3>
      
      <div className="space-y-2">
        {filteredProfiles.map((profile) => {
          const config = getPlatformConfig(profile);
          
          return (
            <motion.button
              key={profile.name}
              onClick={() => handleProfileClick(profile.name, profile.url)}
              whileHover={{ x: 5 }}
              className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group border border-white/10 hover:border-white/20"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {profile.icon}
                </span>
                <div className="text-left">
                  <div className="text-white font-medium">{config.displayName}</div>
                  {config.handle && (
                    <div className="text-gray-400 text-sm">{config.handle}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {showStats && config.followers > 0 && (
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">
                      {formatNumber(config.followers)}
                    </div>
                    <div className="text-gray-400 text-xs">followers</div>
                  </div>
                )}
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  // Rendu grille
  const renderGrid = () => (
    <div className={className}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Rejoignez la Communauté G-Maxing
        </h3>
        <p className="text-gray-300">
          Suivez <span className="text-engel font-semibold">Engel Garcia Gomez</span> sur tous ses réseaux
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProfiles.map((profile, index) => {
          const config = getPlatformConfig(profile);
          
          return (
            <motion.div
              key={profile.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => handleProfileClick(profile.name, profile.url)}
              onMouseEnter={() => setHoveredPlatform(profile.name)}
              onMouseLeave={() => setHoveredPlatform(null)}
            >
              <div className="mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform block">
                  {profile.icon}
                </span>
              </div>
              
              <h4 className="text-white font-semibold mb-2">
                {config.displayName}
              </h4>
              
              {config.handle && (
                <p className="text-gray-400 text-sm mb-3">
                  {config.handle}
                </p>
              )}
              
              {showStats && config.stats && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="text-white font-semibold">
                        {formatNumber(config.followers)}
                      </div>
                      <div className="text-gray-400 text-xs">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold">
                        {config.engagement.toFixed(1)}%
                      </div>
                      <div className="text-gray-400 text-xs">Engagement</div>
                    </div>
                  </div>
                </div>
              )}
              
              {showFollowButton && (
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                  <span>Suivre</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Stats globales */}
      {showStats && Object.keys(analytics).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-card p-6"
        >
          <h4 className="text-white font-semibold mb-4 text-center">
            🚀 Impact Global G-Maxing
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {formatNumber(
                  Object.values(analytics).reduce((sum: number, platform: any) => 
                    sum + (platform.followers || 0), 0
                  )
                )}
              </div>
              <div className="text-gray-400 text-sm">Total Followers</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {(
                  Object.values(analytics).reduce((sum: number, platform: any) => 
                    sum + (platform.averageEngagement || 0), 0
                  ) / Object.values(analytics).length
                ).toFixed(1)}%
              </div>
              <div className="text-gray-400 text-sm">Engagement Moyen</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {Object.values(analytics).reduce((sum: number, platform: any) => 
                  sum + (platform.posts || 0), 0
                )}
              </div>
              <div className="text-gray-400 text-sm">Contenus Publiés</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {formatNumber(
                  Object.values(analytics).reduce((sum: number, platform: any) => 
                    sum + (platform.totalReach || 0), 0
                  )
                )}
              </div>
              <div className="text-gray-400 text-sm">Portée Totale</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  // Rendu compact
  const renderCompact = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      {filteredProfiles.map((profile) => (
        <motion.button
          key={profile.name}
          onClick={() => handleProfileClick(profile.name, profile.url)}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 group border border-white/20 hover:border-white/40"
          title={`Suivre sur ${profile.name}`}
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            {profile.icon}
          </span>
        </motion.button>
      ))}
    </div>
  );

  // Gestion des variantes
  const renderContent = () => {
    switch (variant) {
      case 'vertical':
        return renderVertical();
      case 'grid':
        return renderGrid();
      case 'compact':
        return renderCompact();
      case 'horizontal':
      default:
        return renderHorizontal();
    }
  };

  return renderContent();
};

export default SocialProfiles;