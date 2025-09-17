/**
 * Composant Carte Article de Blog
 * Affichage optimisé SEO pour les articles G-Maxing d'Engel Garcia Gomez
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ClockIcon,
  TagIcon,
  ArrowRightIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { BlogPost } from '../../utils/blog/blogEngine';

interface BlogCardProps {
  post: BlogPost;
  onReadMore: (slug: string) => void;
  onLike?: (postId: string) => void;
  onShare?: (post: BlogPost) => void;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  showAuthor?: boolean;
  showStats?: boolean;
  isLiked?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onReadMore,
  onLike,
  onShare,
  variant = 'default',
  className = '',
  showAuthor = true,
  showStats = true,
  isLiked = false
}) => {
  const { t } = useTranslation();

  // Obtenir la couleur de catégorie
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'engel-garcia-gomez': 'from-yellow-500 to-orange-500',
      'methode-gmax': 'from-blue-500 to-purple-500',
      'transformation': 'from-green-500 to-teal-500',
      'entrainement': 'from-red-500 to-pink-500',
      'nutrition': 'from-emerald-500 to-cyan-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  // Obtenir l'émoji de difficulté
  const getDifficultyIcon = (difficulty: string) => {
    const icons: Record<string, string> = {
      'débutant': '🟢',
      'intermédiaire': '🟡',
      'avancé': '🟠',
      'expert': '🔴'
    };
    return icons[difficulty] || '⚪';
  };

  // Formater la date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Gérer le partage
  const handleShare = () => {
    if (onShare) {
      onShare(post);
    } else {
      // Partage natif si disponible
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.excerpt,
          url: `https://engelgmax.com/blog/${post.slug}`
        });
      } else {
        // Fallback : copier l'URL
        navigator.clipboard.writeText(`https://engelgmax.com/blog/${post.slug}`);
      }
    }
  };

  const cardVariants = {
    default: 'glass-card p-6 h-full flex flex-col',
    featured: 'glass-card p-8 border-2 border-yellow-500/30 shadow-2xl h-full flex flex-col',
    compact: 'glass-card p-4 h-full flex flex-col'
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-xl ${cardVariants[variant]} ${className}`}
    >
      {/* Badge featured */}
      {post.featured && variant !== 'featured' && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
            <TagIcon className="h-3 w-3" />
            <span>À la Une</span>
          </div>
        </div>
      )}

      {/* Badge difficulté */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium flex items-center space-x-1">
          <span>{getDifficultyIcon(post.difficulty)}</span>
          <span className="capitalize">{post.difficulty}</span>
        </div>
      </div>

      {/* Image d'en-tête */}
      <div className="relative h-48 mb-6 -mx-6 -mt-6 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(post.category)} opacity-80`} />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Placeholder image avec gradient */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl text-white/80">
            {post.category === 'engel-garcia-gomez' && '👤'}
            {post.category === 'methode-gmax' && '🧬'}
            {post.category === 'transformation' && '📈'}
            {post.category === 'entrainement' && '💪'}
            {post.category === 'nutrition' && '🥗'}
          </div>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Temps de lecture */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm flex items-center space-x-1">
          <ClockIcon className="h-4 w-4" />
          <span>{post.readingTime} min</span>
        </div>
      </div>

      {/* Contenu principal - flex-grow pour uniformiser les hauteurs */}
      <div className="space-y-4 flex-grow flex flex-col">
        {/* Catégorie et date */}
        <div className="flex items-center justify-between text-sm">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r ${getCategoryColor(post.category)}`}>
            <TagIcon className="h-3 w-3 mr-1" />
            <span className="capitalize">{post.category.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center text-gray-400 space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-yellow-200 transition-all duration-300 line-clamp-2">
          {post.title}
        </h3>

        {/* Extrait */}
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{post.tags.length - 3} autres
              </span>
            )}
          </div>
        )}

        {/* Auteur */}
        {showAuthor && (
          <div className="flex items-center space-x-3 pt-2 border-t border-white/10">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{post.author.name}</p>
              <p className="text-gray-400 text-xs line-clamp-1">{post.author.bio}</p>
            </div>
          </div>
        )}

        {/* Stats et actions - toujours au bas */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          {/* Stats */}
          {showStats && (
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-4 w-4" />
                <span>{post.viewCount.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <HeartIcon className="h-4 w-4" />
                <span>{post.likeCount}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <ShareIcon className="h-4 w-4" />
                <span>{post.shareCount}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Bouton like */}
            {onLike && (
              <button
                onClick={() => onLike(post.id)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group/like"
              >
                {isLiked ? (
                  <HeartSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-400 group-hover/like:text-red-400 transition-colors" />
                )}
              </button>
            )}

            {/* Bouton partage */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors group/share"
            >
              <ShareIcon className="h-5 w-5 text-gray-400 group-hover/share:text-blue-400 transition-colors" />
            </button>

            {/* Bouton lire plus */}
            <button
              onClick={() => onReadMore(post.slug)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 group/read"
            >
              <span>Lire</span>
              <ArrowRightIcon className="h-4 w-4 group-hover/read:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Informations supplémentaires pour les variantes étendues */}
        {variant === 'featured' && (
          <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
            {/* Résultats estimés */}
            {post.estimatedResults && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Résultats estimés:</span>
                <span className="text-green-400 font-medium">{post.estimatedResults}</span>
              </div>
            )}

            {/* Équipement requis */}
            {post.equipment && post.equipment.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Équipement:</span>
                <span className="text-blue-400 font-medium">
                  {post.equipment.slice(0, 2).join(', ')}
                  {post.equipment.length > 2 && ` +${post.equipment.length - 2}`}
                </span>
              </div>
            )}

            {/* Nutrition incluse */}
            {post.nutrition && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Nutrition:</span>
                <span className="text-emerald-400 font-medium">✓ Incluse</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Effet de survol */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.article>
  );
};

export default BlogCard;