/**
 * Gestionnaire de Blog - Interface Admin
 * Permet la création, modification et suppression des articles de blog
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  VideoCameraIcon,
  PhotoIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  TagIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { BlogPost, BlogCategory, PostStatus } from '../../types/blog';
import BlogEditor from './BlogEditor';

interface BlogManagerProps {
  onPostCreate?: (post: BlogPost) => void;
  onPostUpdate?: (post: BlogPost) => void;
  onPostDelete?: (postId: string) => void;
}

const BlogManager: React.FC<BlogManagerProps> = ({
  onPostCreate,
  onPostUpdate,
  onPostDelete
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [filters, setFilters] = useState({
    status: 'all' as PostStatus | 'all',
    category: 'all' as BlogCategory | 'all',
    search: ''
  });

  // Initialisation avec des données vides (plus d'exemples mockés)
  useEffect(() => {
    // Simuler le chargement
    setTimeout(() => {
      setPosts([]); // Commencer avec une liste vide
      setLoading(false);
    }, 500);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesStatus = filters.status === 'all' || post.status === filters.status;
    const matchesCategory = filters.category === 'all' || post.category === filters.category;
    const matchesSearch = filters.search === '' || 
      post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      onPostDelete?.(postId);
    }
  };

  const handleSavePost = (postData: Partial<BlogPost>) => {
    if (editingPost) {
      // Modification
      const updatedPost: BlogPost = {
        ...editingPost,
        ...postData,
        updatedAt: new Date()
      };
      setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedPost : p));
      onPostUpdate?.(updatedPost);
    } else {
      // Création
      const newPost: BlogPost = {
        id: Date.now().toString(),
        slug: postData.title?.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim() || '',
        authorId: 'admin',
        authorName: 'Engel Garcia Gomez',
        published: postData.status === 'published',
        publishedAt: postData.status === 'published' ? new Date() : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        likeCount: 0,
        shareCount: 0,
        commentCount: 0,
        featured: false,
        sticky: false,
        allowComments: true,
        tags: [],
        videos: [],
        gallery: [],
        targetAudience: [],
        relatedPosts: [],
        ...postData
      } as BlogPost;
      
      setPosts(prev => [newPost, ...prev]);
      onPostCreate?.(newPost);
    }
    
    setShowEditor(false);
    setEditingPost(null);
  };

  const getStatusColor = (status: PostStatus): string => {
    const colors = {
      draft: 'text-gray-400 bg-gray-500/10',
      review: 'text-yellow-400 bg-yellow-500/10',
      published: 'text-green-400 bg-green-500/10',
      scheduled: 'text-blue-400 bg-blue-500/10',
      archived: 'text-red-400 bg-red-500/10'
    };
    return colors[status];
  };

  const getStatusIcon = (status: PostStatus) => {
    const icons = {
      draft: DocumentTextIcon,
      review: ClockIcon,
      published: CheckCircleIcon,
      scheduled: CalendarDaysIcon,
      archived: XCircleIcon
    };
    return icons[status];
  };

  const getCategoryColor = (category: BlogCategory): string => {
    const colors = {
      g_maxing_guide: 'text-blue-400 bg-blue-500/10',
      transformation_stories: 'text-green-400 bg-green-500/10',
      nutrition_tips: 'text-orange-400 bg-orange-500/10',
      workout_guides: 'text-red-400 bg-red-500/10',
      lifestyle: 'text-purple-400 bg-purple-500/10',
      science_research: 'text-cyan-400 bg-cyan-500/10',
      success_stories: 'text-emerald-400 bg-emerald-500/10',
      engel_updates: 'text-yellow-400 bg-yellow-500/10',
      expert_interviews: 'text-pink-400 bg-pink-500/10',
      product_updates: 'text-indigo-400 bg-indigo-500/10',
      community_highlights: 'text-teal-400 bg-teal-500/10'
    };
    return colors[category] || 'text-gray-400 bg-gray-500/10';
  };

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'g_maxing_guide', label: 'Guide G-Maxing' },
    { value: 'transformation_stories', label: 'Transformations' },
    { value: 'nutrition_tips', label: 'Nutrition' },
    { value: 'workout_guides', label: 'Entraînement' },
    { value: 'lifestyle', label: 'Style de vie' },
    { value: 'science_research', label: 'Recherche' },
    { value: 'success_stories', label: 'Success Stories' },
    { value: 'engel_updates', label: 'Actualités' },
    { value: 'expert_interviews', label: 'Interviews' },
    { value: 'product_updates', label: 'Produits' },
    { value: 'community_highlights', label: 'Communauté' }
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'review', label: 'En révision' },
    { value: 'published', label: 'Publiés' },
    { value: 'scheduled', label: 'Programmés' },
    { value: 'archived', label: 'Archivés' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-engel"></div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setShowEditor(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion du Blog</h2>
          <p className="text-gray-400">Créez et gérez vos articles de blog G-Maxing</p>
        </div>
        <button
          onClick={handleCreatePost}
          className="glass-btn-primary px-4 py-2 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nouvel Article</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Articles</p>
              <p className="text-2xl font-bold text-white">{posts.length}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Publiés</p>
              <p className="text-2xl font-bold text-green-400">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Brouillons</p>
              <p className="text-2xl font-bold text-gray-400">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Vues Totales</p>
              <p className="text-2xl font-bold text-white">
                {posts.reduce((sum, p) => sum + (p.viewCount || 0), 0).toLocaleString()}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtres
          </h3>
          <button 
            onClick={() => setFilters({ status: 'all', category: 'all', search: '' })}
            className="text-sm text-gray-400 hover:text-white"
          >
            Réinitialiser
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Statut</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              className="glass-input w-full px-3 py-2"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Catégorie</label>
            <select 
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value as any })}
              className="glass-input w-full px-3 py-2"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recherche</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="glass-input w-full pl-10 pr-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Articles ({filteredPosts.length})
          </h3>
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-white/10">
            {filteredPosts.map((post) => {
              const StatusIcon = getStatusIcon(post.status);
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-white hover:text-engel cursor-pointer">
                          {post.title}
                        </h4>
                        <div className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${getStatusColor(post.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{post.status}</span>
                        </div>
                        {post.featured && (
                          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-bold">
                            À LA UNE
                          </span>
                        )}
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-gray-400 mb-3 line-clamp-2">{post.excerpt}</p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(post.category)}`}>
                            {categories.find(c => c.value === post.category)?.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {post.readingTime && (
                            <span className="flex items-center space-x-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>{post.readingTime} min</span>
                            </span>
                          )}
                          
                          <span className="flex items-center space-x-1">
                            <EyeIcon className="h-3 w-3" />
                            <span>{post.viewCount?.toLocaleString() || 0}</span>
                          </span>

                          {post.videos && post.videos.length > 0 && (
                            <span className="flex items-center space-x-1 text-red-400">
                              <VideoCameraIcon className="h-3 w-3" />
                              <span>{post.videos.length}</span>
                            </span>
                          )}

                          {post.gallery && post.gallery.length > 0 && (
                            <span className="flex items-center space-x-1 text-blue-400">
                              <PhotoIcon className="h-3 w-3" />
                              <span>{post.gallery.length}</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs">
                          <CalendarDaysIcon className="h-3 w-3" />
                          <span>
                            {post.publishedAt 
                              ? post.publishedAt.toLocaleDateString()
                              : post.updatedAt.toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <TagIcon className="h-3 w-3 text-gray-500" />
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 5).map((tag, index) => (
                              <span key={index} className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 5 && (
                              <span className="text-gray-500 text-xs">
                                +{post.tags.length - 5} autres
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {post.status === 'published' && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="Voir l'article"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 text-blue-400" />
                        </a>
                      )}
                      
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-400" />
                      </button>
                      
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {posts.length === 0 ? 'Aucun article' : 'Aucun article trouvé'}
            </h3>
            <p className="text-gray-400 mb-6">
              {posts.length === 0 
                ? 'Commencez par créer votre premier article de blog G-Maxing.'
                : 'Aucun article ne correspond à vos critères de recherche.'
              }
            </p>
            {posts.length === 0 && (
              <button
                onClick={handleCreatePost}
                className="glass-btn-primary px-6 py-3"
              >
                Créer le premier article
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManager;