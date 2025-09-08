/**
 * Composant Navigation Blog
 * Navigation optimisée SEO pour le blog G-Maxing d'Engel Garcia Gomez
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  ChevronRightIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface BlogNavigationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  currentPost?: {
    title: string;
    category: string;
    author: string;
    publishedAt: Date;
  };
  showPagination?: boolean;
  showBreadcrumbs?: boolean;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
}

export const BlogNavigation: React.FC<BlogNavigationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  currentPost,
  showPagination = true,
  showBreadcrumbs = true,
  breadcrumbs = []
}) => {
  const { t } = useTranslation();

  // Fil d'Ariane par défaut
  const defaultBreadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Blog G-Maxing', href: '/blog' },
    ...(currentPost ? [{ label: currentPost.title }] : [])
  ];

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  // Générer les numéros de page
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Couleur de catégorie
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

  return (
    <div className="space-y-4">
      {/* Fil d'Ariane */}
      {showBreadcrumbs && (
        <nav className="glass-card p-4">
          <ol className="flex items-center space-x-2 text-sm">
            {finalBreadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index === 0 && (
                  <HomeIcon className="h-4 w-4 text-gray-400 mr-2" />
                )}
                
                {crumb.href || crumb.onClick ? (
                  <button
                    onClick={crumb.onClick || (() => window.location.href = crumb.href!)}
                    className="text-gray-400 hover:text-white transition-colors truncate max-w-40 sm:max-w-none"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-white font-medium truncate max-w-40 sm:max-w-none">
                    {crumb.label}
                  </span>
                )}
                
                {index < finalBreadcrumbs.length - 1 && (
                  <ChevronRightIcon className="h-4 w-4 text-gray-500 mx-2 flex-shrink-0" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Informations de l'article actuel */}
      {currentPost && (
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getCategoryColor(currentPost.category)}`}>
                  <TagIcon className="h-3 w-3 mr-1" />
                  <span className="capitalize">{currentPost.category.replace('-', ' ')}</span>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Intl.DateTimeFormat('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }).format(currentPost.publishedAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-gray-400 text-sm space-x-1">
                <UserIcon className="h-4 w-4" />
                <span>Par {currentPost.author}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors">
                <span>Partager</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                <span>Sauvegarder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <nav className="glass-card p-4">
          <div className="flex items-center justify-between">
            {/* Informations de pagination */}
            <div className="text-sm text-gray-400">
              Page {currentPage} sur {totalPages}
            </div>

            {/* Navigation pagination */}
            <div className="flex items-center space-x-1">
              {/* Bouton précédent */}
              <button
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === 1
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>

              {/* Numéros de page */}
              <div className="flex items-center space-x-1">
                {/* Première page si pas visible */}
                {getPageNumbers()[0] > 1 && (
                  <>
                    <button
                      onClick={() => onPageChange && onPageChange(1)}
                      className="px-3 py-1 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                      1
                    </button>
                    {getPageNumbers()[0] > 2 && (
                      <span className="text-gray-500 px-1">...</span>
                    )}
                  </>
                )}

                {/* Pages visibles */}
                {getPageNumbers().map((pageNum) => (
                  <motion.button
                    key={pageNum}
                    onClick={() => onPageChange && onPageChange(pageNum)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 text-sm rounded-lg transition-all ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                ))}

                {/* Dernière page si pas visible */}
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                      <span className="text-gray-500 px-1">...</span>
                    )}
                    <button
                      onClick={() => onPageChange && onPageChange(totalPages)}
                      className="px-3 py-1 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Bouton suivant */}
              <button
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === totalPages
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Navigation rapide entre articles */}
      {currentPost && (
        <div className="glass-card p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group">
              <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <ArrowLeftIcon className="h-4 w-4 text-gray-300" />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Article précédent</div>
                <div className="text-sm text-white font-medium truncate">
                  Les secrets de la transformation G-Maxing
                </div>
              </div>
            </button>

            <button className="flex items-center justify-end space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-right group">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Article suivant</div>
                <div className="text-sm text-white font-medium truncate">
                  Guide complet nutrition par Engel Garcia Gomez
                </div>
              </div>
              <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <ArrowRightIcon className="h-4 w-4 text-gray-300" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogNavigation;