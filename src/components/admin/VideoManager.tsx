/**
 * Gestionnaire de Vidéos - Interface Admin
 * Permet la gestion des vidéos YouTube/Vimeo pour les protocoles
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  VideoCameraIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LinkIcon,
  PhotoIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ProtocolVideo, VideoPlatform, CreateVideoRequest, VideoFilters } from '../../types/video';
import { protocolsData } from '../../data/protocols';
import VideoUtils from '../../utils/videoUtils';

interface VideoManagerProps {
  onVideoCreate?: (video: ProtocolVideo) => void;
  onVideoUpdate?: (video: ProtocolVideo) => void;
  onVideoDelete?: (videoId: string) => void;
}

const VideoManager: React.FC<VideoManagerProps> = ({
  onVideoCreate,
  onVideoUpdate,
  onVideoDelete
}) => {
  const [videos, setVideos] = useState<ProtocolVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ProtocolVideo | null>(null);
  const [filters, setFilters] = useState<VideoFilters>({ platform: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour le formulaire
  const [formData, setFormData] = useState<CreateVideoRequest>({
    title: '',
    description: '',
    platform: 'youtube',
    videoId: '',
    protocolId: '',
    videoType: 'introduction',
    order: 1,
    isRequired: false
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreview, setVideoPreview] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock data pour les vidéos
  useEffect(() => {
    const mockVideos: ProtocolVideo[] = [
      {
        id: '1',
        title: 'Introduction au Protocole Looxmax',
        description: 'Découvrez les bases du protocole d\'amélioration faciale Looxmax dans cette vidéo d\'introduction complète.',
        platform: 'youtube',
        videoId: 'dQw4w9WgXcQ',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: 420,
        views: 1250,
        protocolId: '1',
        protocolName: 'Looxmax',
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
        description: 'Apprenez les techniques de mewing et les exercices faciaux essentiels pour maximiser vos résultats.',
        platform: 'youtube',
        videoId: 'oHg5SJYRHA0',
        url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
        thumbnail: 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
        duration: 680,
        views: 890,
        protocolId: '1',
        protocolName: 'Looxmax',
        videoType: 'tutorial',
        order: 2,
        isRequired: true,
        watchTime: 500,
        createdAt: new Date('2024-03-16'),
        updatedAt: new Date('2024-03-21')
      },
      {
        id: '3',
        title: 'Témoignage Client - Transformation 8 Semaines',
        description: 'Découvrez la transformation impressionnante d\'Alexandre après 8 semaines du protocole Natty Plus.',
        platform: 'vimeo',
        videoId: '123456789',
        url: 'https://vimeo.com/123456789',
        thumbnail: 'https://vumbnail.com/123456789.jpg',
        duration: 320,
        views: 540,
        protocolId: '2',
        protocolName: 'Natty Plus',
        videoType: 'testimonial',
        order: 1,
        isRequired: false,
        createdAt: new Date('2024-03-18'),
        updatedAt: new Date('2024-03-22')
      },
      {
        id: '4',
        title: 'Démonstration Peptides Avancés',
        description: 'Guide complet pour l\'utilisation sécurisée des peptides dans le protocole Looxmaxing Avancé.',
        platform: 'youtube',
        videoId: 'jNQXAC9IVRw',
        url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
        duration: 1200,
        views: 320,
        protocolId: '3',
        protocolName: 'Looxmaxing Avancé',
        videoType: 'demonstration',
        order: 1,
        isRequired: true,
        watchTime: 900,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-25')
      }
    ];

    setTimeout(() => {
      setVideos(mockVideos);
      setLoading(false);
    }, 800);
  }, []);

  // Filtrage des vidéos
  const filteredVideos = videos.filter(video => {
    const matchesPlatform = filters.platform === 'all' || video.platform === filters.platform;
    const matchesProtocol = !filters.protocolId || video.protocolId === filters.protocolId;
    const matchesType = filters.videoType === 'all' || !filters.videoType || video.videoType === filters.videoType;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.protocolName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesProtocol && matchesType && matchesSearch;
  });

  // Gestion de l'URL vidéo
  useEffect(() => {
    if (videoUrl.trim()) {
      const preview = VideoUtils.generateVideoPreview(videoUrl);
      setVideoPreview(preview);
      
      if (preview.isValid && preview.videoId && preview.platform) {
        setFormData(prev => ({
          ...prev,
          videoId: preview.videoId!,
          platform: preview.platform!
        }));
      }
    } else {
      setVideoPreview(null);
    }
  }, [videoUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Titre requis';
    if (!videoUrl.trim()) errors.videoUrl = 'URL vidéo requise';
    if (!videoPreview?.isValid) errors.videoUrl = videoPreview?.error || 'URL vidéo invalide';
    if (!formData.protocolId) errors.protocolId = 'Protocole requis';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Créer ou mettre à jour la vidéo
    const videoData: ProtocolVideo = {
      id: editingVideo?.id || Date.now().toString(),
      ...formData,
      url: videoUrl,
      thumbnail: VideoUtils.getVideoThumbnail(formData.platform, formData.videoId),
      protocolName: protocolsData.find(p => p.id === formData.protocolId)?.name || '',
      views: editingVideo?.views || 0,
      createdAt: editingVideo?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingVideo) {
      setVideos(prev => prev.map(v => v.id === editingVideo.id ? videoData : v));
      onVideoUpdate?.(videoData);
      setEditingVideo(null);
    } else {
      setVideos(prev => [...prev, videoData]);
      onVideoCreate?.(videoData);
    }

    // Reset form
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      platform: 'youtube',
      videoId: '',
      protocolId: '',
      videoType: 'introduction',
      order: 1,
      isRequired: false
    });
    setVideoUrl('');
    setVideoPreview(null);
    setFormErrors({});
  };

  const handleEdit = (video: ProtocolVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      platform: video.platform,
      videoId: video.videoId,
      protocolId: video.protocolId,
      videoType: video.videoType,
      order: video.order,
      isRequired: video.isRequired || false
    });
    setVideoUrl(video.url);
    setShowCreateForm(true);
  };

  const handleDelete = async (videoId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
      onVideoDelete?.(videoId);
    }
  };

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
        return 'bg-red-500/20 text-red-300';
      case 'vimeo':
        return 'bg-blue-500/20 text-blue-300';
      case 'direct':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const renderVideoForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-card p-6 mb-8 bg-blue-500/10 border-blue-500/30"
    >
      <h3 className="text-xl font-bold text-white mb-6">
        {editingVideo ? 'Modifier la Vidéo' : 'Nouvelle Vidéo'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Vidéo */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">URL Vidéo *</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`glass-input w-full px-4 py-3 ${formErrors.videoUrl ? 'border-red-500' : ''}`}
          />
          {formErrors.videoUrl && (
            <p className="text-red-400 text-sm mt-1">{formErrors.videoUrl}</p>
          )}
          
          {/* Aperçu vidéo */}
          {videoPreview && (
            <div className="mt-4 p-4 border rounded-xl">
              {videoPreview.isValid ? (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={videoPreview.thumbnailUrl} 
                      alt="Aperçu"
                      className="w-20 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/video-placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{getPlatformIcon(videoPreview.platform)}</span>
                      <span className={`px-2 py-1 rounded text-xs ${getPlatformColor(videoPreview.platform)}`}>
                        {videoPreview.platform.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">ID: {videoPreview.videoId}</p>
                  </div>
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-red-400">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="text-sm">{videoPreview.error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Titre */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Titre *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la vidéo"
              className={`glass-input w-full px-4 py-2 ${formErrors.title ? 'border-red-500' : ''}`}
            />
            {formErrors.title && (
              <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Protocole */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Protocole *</label>
            <select
              value={formData.protocolId}
              onChange={(e) => setFormData(prev => ({ ...prev, protocolId: e.target.value }))}
              className={`glass-input w-full px-4 py-2 ${formErrors.protocolId ? 'border-red-500' : ''}`}
            >
              <option value="">Sélectionner un protocole</option>
              {protocolsData.map(protocol => (
                <option key={protocol.id} value={protocol.id}>{protocol.name}</option>
              ))}
            </select>
            {formErrors.protocolId && (
              <p className="text-red-400 text-sm mt-1">{formErrors.protocolId}</p>
            )}
          </div>

          {/* Type de vidéo */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Type</label>
            <select
              value={formData.videoType}
              onChange={(e) => setFormData(prev => ({ ...prev, videoType: e.target.value as any }))}
              className="glass-input w-full px-4 py-2"
            >
              <option value="introduction">Introduction</option>
              <option value="tutorial">Tutoriel</option>
              <option value="testimonial">Témoignage</option>
              <option value="demonstration">Démonstration</option>
              <option value="supplement">Complément</option>
            </select>
          </div>

          {/* Ordre */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Ordre d'affichage</label>
            <input
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
              className="glass-input w-full px-4 py-2"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description de la vidéo (optionnel)"
            rows={3}
            className="glass-input w-full px-4 py-3 resize-none"
          />
        </div>

        {/* Options */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
              className="rounded border-gray-600 bg-gray-700"
            />
            <span className="text-sm text-gray-400">Visionnage obligatoire</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(false);
              setEditingVideo(null);
              setFormData({
                title: '',
                description: '',
                platform: 'youtube',
                videoId: '',
                protocolId: '',
                videoType: 'introduction',
                order: 1,
                isRequired: false
              });
              setVideoUrl('');
              setVideoPreview(null);
              setFormErrors({});
            }}
            className="glass-btn-secondary px-6 py-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!videoPreview?.isValid}
            className="glass-btn-primary px-6 py-2 disabled:opacity-50"
          >
            {editingVideo ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-engel"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion des Vidéos</h2>
          <p className="text-gray-400">Gérez les vidéos YouTube et Vimeo de vos protocoles</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="glass-btn-primary px-4 py-2 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nouvelle Vidéo</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Vidéos</p>
              <p className="text-2xl font-bold text-white">{videos.length}</p>
            </div>
            <VideoCameraIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">YouTube</p>
              <p className="text-2xl font-bold text-red-400">
                {videos.filter(v => v.platform === 'youtube').length}
              </p>
            </div>
            <span className="text-2xl">📺</span>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Vimeo</p>
              <p className="text-2xl font-bold text-blue-400">
                {videos.filter(v => v.platform === 'vimeo').length}
              </p>
            </div>
            <span className="text-2xl">🎬</span>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Vues Totales</p>
              <p className="text-2xl font-bold text-white">
                {videos.reduce((sum, v) => sum + (v.views || 0), 0).toLocaleString()}
              </p>
            </div>
            <EyeIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showCreateForm && renderVideoForm()}
      </AnimatePresence>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtres
          </h3>
          <button 
            onClick={() => {
              setFilters({ platform: 'all' });
              setSearchQuery('');
            }}
            className="text-sm text-gray-400 hover:text-white"
          >
            Réinitialiser
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Plateforme</label>
            <select 
              value={filters.platform || 'all'}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value as VideoPlatform | 'all' })}
              className="glass-input w-full px-3 py-2"
            >
              <option value="all">Toutes les plateformes</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="direct">Vidéo directe</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Protocole</label>
            <select 
              value={filters.protocolId || ''}
              onChange={(e) => setFilters({ ...filters, protocolId: e.target.value || undefined })}
              className="glass-input w-full px-3 py-2"
            >
              <option value="">Tous les protocoles</option>
              {protocolsData.map(protocol => (
                <option key={protocol.id} value={protocol.id}>{protocol.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Type</label>
            <select 
              value={filters.videoType || 'all'}
              onChange={(e) => setFilters({ ...filters, videoType: e.target.value === 'all' ? undefined : e.target.value as any })}
              className="glass-input w-full px-3 py-2"
            >
              <option value="all">Tous les types</option>
              <option value="introduction">Introduction</option>
              <option value="tutorial">Tutoriel</option>
              <option value="testimonial">Témoignage</option>
              <option value="demonstration">Démonstration</option>
              <option value="supplement">Complément</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recherche</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Vidéos ({filteredVideos.length})
          </h3>
        </div>
        
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 hover:scale-105 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative mb-4">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.src = '/images/video-placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <PlayIcon className="h-12 w-12 text-white" />
                  </div>
                  
                  {/* Platform Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(video.platform)}`}>
                      {getPlatformIcon(video.platform)} {video.platform.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {VideoUtils.formatDuration(video.duration)}
                    </div>
                  )}
                  
                  {/* Required Badge */}
                  {video.isRequired && (
                    <div className="absolute top-2 right-2 bg-engel px-2 py-1 rounded text-xs text-black font-bold">
                      REQUIS
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-1 line-clamp-2">{video.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {video.description || 'Aucune description'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="text-engel font-medium">{video.protocolName}</span>
                    <span className="capitalize">{video.videoType}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{video.views?.toLocaleString() || 0}</span>
                    </div>
                    <span>Ordre: {video.order}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      <span>Voir</span>
                    </a>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucune vidéo</h3>
            <p className="text-gray-400 mb-6">
              {videos.length === 0 
                ? 'Commencez par ajouter votre première vidéo.'
                : 'Aucune vidéo ne correspond à vos critères de recherche.'
              }
            </p>
            {videos.length === 0 && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="glass-btn-primary px-6 py-3"
              >
                Ajouter une vidéo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoManager;