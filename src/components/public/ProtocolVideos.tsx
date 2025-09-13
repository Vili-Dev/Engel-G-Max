/**
 * Composant d'affichage des vidéos pour les protocoles
 * Interface publique pour visionner les vidéos YouTube/Vimeo
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VideoCameraIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { ProtocolVideo, VideoPlatform } from '../../types/video';
import VideoUtils from '../../utils/videoUtils';

interface ProtocolVideosProps {
  protocolId: string;
  protocolName: string;
  isSubscribed?: boolean;
  onVideoWatch?: (videoId: string, watchTime: number) => void;
}

const ProtocolVideos: React.FC<ProtocolVideosProps> = ({ 
  protocolId, 
  protocolName,
  isSubscribed = false,
  onVideoWatch
}) => {
  const [videos, setVideos] = useState<ProtocolVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<ProtocolVideo | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({});

  // Mock data pour les vidéos du protocole
  useEffect(() => {
    const mockVideos: ProtocolVideo[] = [
      {
        id: '1',
        title: 'Introduction au Protocole Looxmax',
        description: 'Découvrez les bases du protocole d\'amélioration faciale Looxmax dans cette vidéo d\'introduction complète. Apprenez les principes fondamentaux et les objectifs de ce programme révolutionnaire.',
        platform: 'youtube',
        videoId: 'dQw4w9WgXcQ',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: 420,
        views: 1250,
        protocolId,
        protocolName,
        videoType: 'introduction',
        order: 1,
        isRequired: true,
        watchTime: 300,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-20')
      },
      {
        id: '2',
        title: 'Tutoriel Mewing et Exercices Faciaux',
        description: 'Apprenez les techniques de mewing et les exercices faciaux essentiels pour maximiser vos résultats. Guide pratique avec démonstrations détaillées.',
        platform: 'youtube',
        videoId: 'oHg5SJYRHA0',
        url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
        thumbnail: 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
        duration: 680,
        views: 890,
        protocolId,
        protocolName,
        videoType: 'tutorial',
        order: 2,
        isRequired: true,
        watchTime: 500,
        createdAt: new Date('2024-03-16'),
        updatedAt: new Date('2024-03-21')
      },
      {
        id: '3',
        title: 'Guide des Suppléments et Vitamines',
        description: 'Découvrez les suppléments essentiels pour optimiser vos résultats. Dosages, timing et interactions expliqués en détail.',
        platform: 'vimeo',
        videoId: '123456789',
        url: 'https://vimeo.com/123456789',
        thumbnail: 'https://vumbnail.com/123456789.jpg',
        duration: 520,
        views: 640,
        protocolId,
        protocolName,
        videoType: 'supplement',
        order: 3,
        isRequired: false,
        createdAt: new Date('2024-03-18'),
        updatedAt: new Date('2024-03-22')
      },
      {
        id: '4',
        title: 'Témoignages et Résultats Clients',
        description: 'Découvrez les transformations impressionnantes de nos clients après avoir suivi le protocole Looxmax.',
        platform: 'youtube',
        videoId: 'jNQXAC9IVRw',
        url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
        duration: 380,
        views: 420,
        protocolId,
        protocolName,
        videoType: 'testimonial',
        order: 4,
        isRequired: false,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-03-25')
      }
    ];

    // Filtrer les vidéos pour ce protocole spécifique
    const protocolVideos = mockVideos.filter(v => v.protocolId === protocolId);
    
    setTimeout(() => {
      setVideos(protocolVideos.sort((a, b) => a.order - b.order));
      setLoading(false);
    }, 800);

    // Simuler les vidéos déjà regardées (localStorage en production)
    const watched = new Set(['1']); // Première vidéo déjà regardée
    setWatchedVideos(watched);
    
    // Simuler le progrès de visionnage
    setVideoProgress({
      '1': 100, // Complètement regardée
      '2': 65,  // Partiellement regardée
      '3': 0,   // Pas encore regardée
      '4': 0    // Pas encore regardée
    });
  }, [protocolId]);

  const getPlatformIcon = (platform: VideoPlatform) => {
    switch (platform) {
      case 'youtube':
        return '📺';
      case 'vimeo':
        return '🎬';
      case 'direct':
        return '📁';
      default:
        return '🎥';
    }
  };

  const getPlatformColor = (platform: VideoPlatform) => {
    switch (platform) {
      case 'youtube':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'vimeo':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'direct':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getVideoTypeLabel = (type: ProtocolVideo['videoType']) => {
    const labels = {
      introduction: 'Introduction',
      tutorial: 'Tutoriel',
      testimonial: 'Témoignage',
      demonstration: 'Démonstration',
      supplement: 'Suppléments'
    };
    return labels[type] || type;
  };

  const getVideoTypeIcon = (type: ProtocolVideo['videoType']) => {
    switch (type) {
      case 'introduction':
        return '👋';
      case 'tutorial':
        return '🎯';
      case 'testimonial':
        return '💬';
      case 'demonstration':
        return '🔬';
      case 'supplement':
        return '💊';
      default:
        return '🎥';
    }
  };

  const handleVideoSelect = (video: ProtocolVideo) => {
    if (!isSubscribed && video.isRequired) {
      // Afficher une modal d'abonnement requis
      alert('Abonnement requis pour accéder à cette vidéo.');
      return;
    }
    
    setSelectedVideo(video);
    setCurrentVideoIndex(videos.findIndex(v => v.id === video.id));
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      const nextVideo = videos[currentVideoIndex + 1];
      setSelectedVideo(nextVideo);
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      const prevVideo = videos[currentVideoIndex - 1];
      setSelectedVideo(prevVideo);
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleVideoComplete = (videoId: string) => {
    setWatchedVideos(prev => new Set([...prev, videoId]));
    setVideoProgress(prev => ({ ...prev, [videoId]: 100 }));
    onVideoWatch?.(videoId, videos.find(v => v.id === videoId)?.duration || 0);
  };

  const renderVideoPlayer = () => {
    if (!selectedVideo) return null;

    const embedCode = VideoUtils.generateEmbedCode(
      selectedVideo.platform,
      selectedVideo.videoId,
      {
        width: '100%',
        height: '500',
        responsive: true,
        autoplay: false,
        controls: true,
        privacy: true
      }
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedVideo(null)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{selectedVideo.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className={`px-2 py-1 rounded border text-xs ${getPlatformColor(selectedVideo.platform)}`}>
                  {getPlatformIcon(selectedVideo.platform)} {selectedVideo.platform.toUpperCase()}
                </div>
                <span>{getVideoTypeIcon(selectedVideo.videoType)} {getVideoTypeLabel(selectedVideo.videoType)}</span>
                {selectedVideo.duration && (
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {VideoUtils.formatDuration(selectedVideo.duration)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Video Player */}
          <div className="p-6">
            <div 
              className="w-full"
              dangerouslySetInnerHTML={{ __html: embedCode }}
            />
          </div>

          {/* Description */}
          {selectedVideo.description && (
            <div className="px-6 pb-4">
              <h4 className="font-semibold text-white mb-2">Description</h4>
              <p className="text-gray-300 leading-relaxed">{selectedVideo.description}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <button
              onClick={handlePrevVideo}
              disabled={currentVideoIndex === 0}
              className="glass-btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                {currentVideoIndex + 1} / {videos.length}
              </span>
              <a
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                <span>Ouvrir sur {selectedVideo.platform}</span>
              </a>
            </div>

            <button
              onClick={handleNextVideo}
              disabled={currentVideoIndex === videos.length - 1}
              className="glass-btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant →
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3">
                <div className="w-full h-32 bg-gray-700 rounded-xl"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="glass-card p-8">
        <div className="text-center py-8">
          <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucune vidéo disponible
          </h3>
          <p className="text-gray-400">
            Les vidéos pour ce protocole seront bientôt disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center">
            <VideoCameraIcon className="h-6 w-6 mr-3" />
            Vidéos du Protocole
          </h3>
          <p className="text-gray-400 mt-2">
            {videos.length} vidéo{videos.length > 1 ? 's' : ''} • 
            {videos.filter(v => v.isRequired).length} obligatoire{videos.filter(v => v.isRequired).length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Progress */}
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">Progression</div>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-engel h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(watchedVideos.size / videos.length) * 100}%` 
                }}
              ></div>
            </div>
            <span className="text-sm text-white font-medium">
              {Math.round((watchedVideos.size / videos.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, index) => {
          const isWatched = watchedVideos.has(video.id);
          const progress = videoProgress[video.id] || 0;
          const isLocked = !isSubscribed && video.isRequired;

          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group cursor-pointer ${
                isLocked ? 'opacity-60' : ''
              }`}
              onClick={() => !isLocked && handleVideoSelect(video)}
            >
              <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
                {/* Thumbnail */}
                <div className="relative mb-4">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.src = '/images/video-placeholder.jpg';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isLocked ? (
                      <LockClosedIcon className="h-8 w-8 text-white" />
                    ) : (
                      <PlayIcon className="h-8 w-8 text-white" />
                    )}
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    <span className={`px-2 py-1 rounded text-xs border ${getPlatformColor(video.platform)}`}>
                      {getPlatformIcon(video.platform)}
                    </span>
                    {video.isRequired && (
                      <span className="bg-engel text-black px-2 py-1 rounded text-xs font-bold">
                        REQUIS
                      </span>
                    )}
                  </div>

                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {VideoUtils.formatDuration(video.duration)}
                    </div>
                  )}

                  {/* Watch Status */}
                  {isWatched && (
                    <div className="absolute top-2 right-2 bg-green-500 p-1 rounded-full">
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    </div>
                  )}

                  {/* Progress Bar */}
                  {progress > 0 && progress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-xl">
                      <div 
                        className="h-full bg-engel rounded-bl-xl transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-white line-clamp-2 flex-1 mr-2">
                      {video.title}
                    </h4>
                    <span className="text-sm text-gray-400 flex-shrink-0">
                      #{video.order}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-400">
                      {getVideoTypeIcon(video.videoType)}
                      <span className="ml-1">{getVideoTypeLabel(video.videoType)}</span>
                    </span>
                    
                    <div className="flex items-center space-x-3 text-gray-400">
                      <span className="flex items-center">
                        <EyeIcon className="h-3 w-3 mr-1" />
                        {video.views?.toLocaleString() || 0}
                      </span>
                      {isWatched && (
                        <span className="text-green-400 text-xs flex items-center">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Regardée
                        </span>
                      )}
                    </div>
                  </div>

                  {video.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}

                  {/* Required Video Notice */}
                  {video.isRequired && video.watchTime && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mt-2">
                      <p className="text-xs text-yellow-300">
                        <ClockIcon className="h-3 w-3 inline mr-1" />
                        Temps de visionnage minimum: {VideoUtils.formatDuration(video.watchTime)}
                      </p>
                    </div>
                  )}

                  {/* Locked Notice */}
                  {isLocked && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 mt-2">
                      <p className="text-xs text-blue-300">
                        <LockClosedIcon className="h-3 w-3 inline mr-1" />
                        Abonnement requis pour accéder à cette vidéo
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && renderVideoPlayer()}
      </AnimatePresence>

      {/* Subscription CTA */}
      {!isSubscribed && videos.some(v => v.isRequired) && (
        <div className="mt-8 glass-card p-6 bg-gradient-to-r from-engel/10 to-purple-500/10 border border-engel/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white mb-2">
                🔓 Débloquez toutes les vidéos
              </h4>
              <p className="text-gray-300 text-sm">
                Accédez à {videos.filter(v => v.isRequired).length} vidéos exclusives 
                et suivez le protocole complet.
              </p>
            </div>
            <button className="glass-btn-primary px-6 py-3 ml-6">
              S'abonner
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolVideos;