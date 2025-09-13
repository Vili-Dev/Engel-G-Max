/**
 * Éditeur d'Articles Blog - Interface Admin
 * Éditeur complet avec support vidéo, images et contenu riche
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  TagIcon,
  EyeIcon,
  BookmarkIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { BlogPost, BlogCategory, BlogVideo, BlogImage, TargetAudience, PostStatus } from '../../types/blog';
import VideoUtils from '../../utils/videoUtils';

interface BlogEditorProps {
  post?: BlogPost | null;
  onSave: (post: Partial<BlogPost>) => void;
  onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ post, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'seo' | 'settings' | 'preview'>('content');
  
  // États du formulaire
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    category: 'g_maxing_guide',
    tags: [],
    status: 'draft',
    published: false,
    featured: false,
    sticky: false,
    allowComments: true,
    targetAudience: [],
    videos: [],
    gallery: [],
    ...post
  });

  // États pour la gestion des vidéos
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoPreview, setVideoPreview] = useState<any>(null);
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);

  // États pour les images
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // États pour les tags
  const [newTag, setNewTag] = useState('');

  // Gestion des erreurs
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preview vidéo en temps réel
  useEffect(() => {
    if (videoUrl.trim()) {
      const preview = VideoUtils.generateVideoPreview(videoUrl);
      setVideoPreview(preview);
    } else {
      setVideoPreview(null);
    }
  }, [videoUrl]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = 'Le contenu est requis';
    }
    
    if (!formData.excerpt?.trim()) {
      newErrors.excerpt = 'L\'extrait est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Ajout d'une vidéo
  const handleAddVideo = () => {
    if (!videoUrl.trim() || !videoTitle.trim() || !videoPreview?.isValid) {
      return;
    }

    const newVideo: BlogVideo = {
      id: Date.now().toString(),
      url: videoUrl,
      videoId: videoPreview.videoId,
      platform: videoPreview.platform,
      title: videoTitle,
      description: videoDescription,
      thumbnailUrl: videoPreview.thumbnailUrl,
      embedCode: VideoUtils.generateEmbedCode(videoPreview.platform, videoPreview.videoId),
      order: (formData.videos?.length || 0) + 1,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (editingVideoIndex !== null) {
      // Modification
      const updatedVideos = [...(formData.videos || [])];
      updatedVideos[editingVideoIndex] = newVideo;
      setFormData(prev => ({ ...prev, videos: updatedVideos }));
      setEditingVideoIndex(null);
    } else {
      // Ajout
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), newVideo]
      }));
    }

    // Reset form
    setVideoUrl('');
    setVideoTitle('');
    setVideoDescription('');
    setVideoPreview(null);
    setShowVideoForm(false);
  };

  // Modification d'une vidéo
  const handleEditVideo = (index: number) => {
    const video = formData.videos?.[index];
    if (video) {
      setVideoUrl(video.url);
      setVideoTitle(video.title);
      setVideoDescription(video.description || '');
      setEditingVideoIndex(index);
      setShowVideoForm(true);
    }
  };

  // Suppression d'une vidéo
  const handleDeleteVideo = (index: number) => {
    if (window.confirm('Supprimer cette vidéo ?')) {
      const updatedVideos = formData.videos?.filter((_, i) => i !== index) || [];
      setFormData(prev => ({ ...prev, videos: updatedVideos }));
    }
  };

  // Ajout d'un tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Suppression d'un tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Sauvegarde
  const handleSave = () => {
    if (!validateForm()) return;

    // Générer le slug si nouveau post
    if (!formData.slug) {
      const slug = formData.title?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({ ...prev, slug }));
    }

    // Calculer le temps de lecture estimé
    const wordCount = formData.content?.split(/\s+/).length || 0;
    const readingTime = Math.ceil(wordCount / 200); // 200 mots par minute

    const postData: Partial<BlogPost> = {
      ...formData,
      wordCount,
      readingTime,
      updatedAt: new Date(),
      // Générer l'extrait automatiquement si vide
      excerpt: formData.excerpt || formData.content?.substring(0, 160) + '...'
    };

    onSave(postData);
  };

  const categories: Array<{ value: BlogCategory; label: string }> = [
    { value: 'g_maxing_guide', label: 'Guide G-Maxing' },
    { value: 'transformation_stories', label: 'Histoires de Transformation' },
    { value: 'nutrition_tips', label: 'Conseils Nutrition' },
    { value: 'workout_guides', label: 'Guides d\'Entraînement' },
    { value: 'lifestyle', label: 'Style de Vie' },
    { value: 'science_research', label: 'Recherche Scientifique' },
    { value: 'success_stories', label: 'Success Stories' },
    { value: 'engel_updates', label: 'Actualités Engel' },
    { value: 'expert_interviews', label: 'Interviews d\'Experts' },
    { value: 'product_updates', label: 'Nouveaux Produits' },
    { value: 'community_highlights', label: 'Communauté' }
  ];

  const audiences: Array<{ value: TargetAudience; label: string }> = [
    { value: 'beginners', label: 'Débutants' },
    { value: 'intermediate', label: 'Intermédiaires' },
    { value: 'advanced', label: 'Avancés' },
    { value: 'men', label: 'Hommes' },
    { value: 'women', label: 'Femmes' },
    { value: 'athletes', label: 'Athlètes' },
    { value: 'busy_professionals', label: 'Professionnels' },
    { value: 'students', label: 'Étudiants' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'parents', label: 'Parents' }
  ];

  const tabs = [
    { id: 'content', label: 'Contenu', icon: DocumentTextIcon },
    { id: 'media', label: 'Médias', icon: VideoCameraIcon },
    { id: 'seo', label: 'SEO', icon: TagIcon },
    { id: 'settings', label: 'Paramètres', icon: TagIcon },
    { id: 'preview', label: 'Aperçu', icon: EyeIcon }
  ];

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Titre */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Titre *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Titre de l'article..."
          className={`glass-input w-full px-4 py-3 text-lg font-medium ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Extrait */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Extrait *</label>
        <textarea
          value={formData.excerpt || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Résumé de l'article (160 caractères max)..."
          rows={3}
          maxLength={160}
          className={`glass-input w-full px-4 py-3 resize-none ${errors.excerpt ? 'border-red-500' : ''}`}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.excerpt && (
            <p className="text-red-400 text-sm">{errors.excerpt}</p>
          )}
          <p className="text-gray-500 text-sm">
            {formData.excerpt?.length || 0}/160 caractères
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Contenu *</label>
        <textarea
          value={formData.content || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Rédigez votre article ici..."
          rows={15}
          className={`glass-input w-full px-4 py-3 resize-none ${errors.content ? 'border-red-500' : ''}`}
        />
        {errors.content && (
          <p className="text-red-400 text-sm mt-1">{errors.content}</p>
        )}
        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
          <span>{formData.content?.split(/\s+/).length || 0} mots</span>
          <span>≈ {Math.ceil((formData.content?.split(/\s+/).length || 0) / 200)} min de lecture</span>
        </div>
      </div>

      {/* Catégorie et Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Catégorie</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as BlogCategory }))}
            className="glass-input w-full px-4 py-2"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Tags</label>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Ajouter un tag..."
              className="glass-input flex-1 px-3 py-2"
            />
            <button
              onClick={handleAddTag}
              className="glass-btn-primary px-3 py-2"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm flex items-center space-x-1"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-400 hover:text-red-400"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMediaTab = () => (
    <div className="space-y-6">
      {/* Section Vidéos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <VideoCameraIcon className="h-5 w-5 mr-2" />
            Vidéos ({formData.videos?.length || 0})
          </h3>
          <button
            onClick={() => setShowVideoForm(true)}
            className="glass-btn-primary px-4 py-2 flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Ajouter une vidéo</span>
          </button>
        </div>

        {/* Liste des vidéos */}
        <div className="space-y-4">
          {formData.videos?.map((video, index) => (
            <div key={video.id} className="glass-card p-4">
              <div className="flex items-start space-x-4">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/images/video-placeholder.jpg';
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-white">{video.title}</h4>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      {video.platform.toUpperCase()}
                    </span>
                  </div>
                  {video.description && (
                    <p className="text-gray-400 text-sm mb-2">{video.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {video.duration && (
                      <span>⏱️ {VideoUtils.formatDuration(video.duration)}</span>
                    )}
                    <span>👁️ {video.views || 0}</span>
                    <span>📍 Position {video.order}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Voir la vidéo"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 text-blue-400" />
                  </a>
                  <button
                    onClick={() => handleEditVideo(index)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Modifier"
                  >
                    <PencilIcon className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(index)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {formData.videos?.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <VideoCameraIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Aucune vidéo ajoutée</p>
              <p className="text-sm">Cliquez sur "Ajouter une vidéo" pour commencer</p>
            </div>
          )}
        </div>
      </div>

      {/* Section Images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <PhotoIcon className="h-5 w-5 mr-2" />
            Images ({formData.gallery?.length || 0})
          </h3>
          <button
            onClick={() => setShowImageUpload(true)}
            className="glass-btn-secondary px-4 py-2 flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Ajouter des images</span>
          </button>
        </div>

        <div className="text-center py-8 text-gray-400">
          <PhotoIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Gestion d'images sera implémentée avec Cloudinary</p>
          <p className="text-sm">Upload, redimensionnement et optimisation automatiques</p>
        </div>
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Titre SEO</label>
          <input
            type="text"
            value={formData.seoTitle || formData.title || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
            placeholder="Titre optimisé pour les moteurs de recherche"
            maxLength={60}
            className="glass-input w-full px-4 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {(formData.seoTitle || formData.title || '').length}/60 caractères
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Mot-clé principal</label>
          <input
            type="text"
            value={formData.focusKeyword || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, focusKeyword: e.target.value }))}
            placeholder="Ex: Engel Garcia Gomez, transformation physique..."
            className="glass-input w-full px-4 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Description SEO</label>
        <textarea
          value={formData.seoDescription || formData.excerpt || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
          placeholder="Description qui apparaîtra dans les résultats de recherche"
          rows={3}
          maxLength={160}
          className="glass-input w-full px-4 py-3 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {(formData.seoDescription || formData.excerpt || '').length}/160 caractères
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Mots-clés SEO</label>
        <input
          type="text"
          value={formData.seoKeywords?.join(', ') || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
          }))}
          placeholder="transformation, nutrition, workout, Engel Garcia Gomez..."
          className="glass-input w-full px-4 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Séparez les mots-clés par des virgules
        </p>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Statut</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PostStatus }))}
            className="glass-input w-full px-4 py-2"
          >
            <option value="draft">Brouillon</option>
            <option value="review">En révision</option>
            <option value="published">Publié</option>
            <option value="scheduled">Programmé</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Niveau G-Maxing</label>
          <select
            value={formData.gmaxingLevel || 'beginner'}
            onChange={(e) => setFormData(prev => ({ ...prev, gmaxingLevel: e.target.value as any }))}
            className="glass-input w-full px-4 py-2"
          >
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Public cible</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {audiences.map(audience => (
            <label key={audience.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.targetAudience?.includes(audience.value) || false}
                onChange={(e) => {
                  const current = formData.targetAudience || [];
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      targetAudience: [...current, audience.value]
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      targetAudience: current.filter(a => a !== audience.value)
                    }));
                  }
                }}
                className="rounded border-gray-600 bg-gray-700"
              />
              <span className="text-sm text-gray-300">{audience.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="rounded border-gray-600 bg-gray-700"
          />
          <span className="text-sm text-gray-300">Article à la une</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.sticky || false}
            onChange={(e) => setFormData(prev => ({ ...prev, sticky: e.target.checked }))}
            className="rounded border-gray-600 bg-gray-700"
          />
          <span className="text-sm text-gray-300">Épingler en haut</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.allowComments || false}
            onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
            className="rounded border-gray-600 bg-gray-700"
          />
          <span className="text-sm text-gray-300">Autoriser commentaires</span>
        </label>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-white mb-4">{formData.title || 'Titre de l\'article'}</h1>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
          <span>Par Engel Garcia Gomez</span>
          <span>•</span>
          <span>{Math.ceil((formData.content?.split(/\s+/).length || 0) / 200)} min de lecture</span>
          <span>•</span>
          <span className="capitalize">{categories.find(c => c.value === formData.category)?.label}</span>
        </div>

        {formData.excerpt && (
          <p className="text-lg text-gray-300 mb-6 italic">{formData.excerpt}</p>
        )}

        {formData.videos && formData.videos.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Vidéos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.videos.map((video, index) => (
                <div key={video.id} className="relative">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <PlayIcon className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                    {video.platform.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          {formData.content?.split('\n').map((paragraph, index) => (
            paragraph.trim() ? (
              <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ) : (
              <br key={index} />
            )
          ))}
        </div>

        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <TagIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {post ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
          <p className="text-gray-400">
            {post ? 'Modifiez votre article de blog' : 'Créez un nouvel article pour le blog G-Maxing'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="glass-btn-secondary px-4 py-2"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="glass-btn-primary px-4 py-2 flex items-center space-x-2"
          >
            <BookmarkIcon className="h-4 w-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-engel text-engel'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'media' && renderMediaTab()}
          {activeTab === 'seo' && renderSEOTab()}
          {activeTab === 'settings' && renderSettingsTab()}
          {activeTab === 'preview' && renderPreviewTab()}
        </div>
      </div>

      {/* Modal d'ajout de vidéo */}
      <AnimatePresence>
        {showVideoForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowVideoForm(false);
              setEditingVideoIndex(null);
              setVideoUrl('');
              setVideoTitle('');
              setVideoDescription('');
              setVideoPreview(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {editingVideoIndex !== null ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">URL de la vidéo</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                    className="glass-input w-full px-4 py-3"
                  />
                  
                  {videoPreview && (
                    <div className="mt-3 p-3 border rounded">
                      {videoPreview.isValid ? (
                        <div className="flex items-center space-x-3 text-green-400">
                          <CheckCircleIcon className="h-5 w-5" />
                          <span className="text-sm">
                            Vidéo {videoPreview.platform.toUpperCase()} détectée
                          </span>
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

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Titre</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Titre de la vidéo..."
                    className="glass-input w-full px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description (optionnel)</label>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Description de la vidéo..."
                    rows={3}
                    className="glass-input w-full px-4 py-3 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowVideoForm(false);
                      setEditingVideoIndex(null);
                      setVideoUrl('');
                      setVideoTitle('');
                      setVideoDescription('');
                      setVideoPreview(null);
                    }}
                    className="glass-btn-secondary px-4 py-2"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddVideo}
                    disabled={!videoUrl.trim() || !videoTitle.trim() || !videoPreview?.isValid}
                    className="glass-btn-primary px-4 py-2 disabled:opacity-50"
                  >
                    {editingVideoIndex !== null ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogEditor;