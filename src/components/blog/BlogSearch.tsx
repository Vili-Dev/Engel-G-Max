/**
 * Composant Recherche Blog
 * Recherche avancée pour les articles G-Maxing d'Engel Garcia Gomez
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  TagIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface BlogSearchProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: 'publishedAt' | 'viewCount' | 'likeCount') => void;
  selectedCategory: string;
  sortBy: string;
  totalResults: number;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({
  onSearchChange,
  onCategoryChange,
  onSortChange,
  selectedCategory,
  sortBy,
  totalResults
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Catégories disponibles
  const categories = [
    { id: 'all', label: 'Tous les articles', count: totalResults },
    { id: 'engel-garcia-gomez', label: 'Engel Garcia Gomez', count: 0 },
    { id: 'methode-gmax', label: 'Méthode G-Max', count: 0 },
    { id: 'transformation', label: 'Transformation', count: 0 },
    { id: 'entrainement', label: 'Entraînement', count: 0 },
    { id: 'nutrition', label: 'Nutrition', count: 0 }
  ];

  // Options de tri
  const sortOptions = [
    { id: 'publishedAt', label: 'Plus récent', icon: ClockIcon },
    { id: 'viewCount', label: 'Plus populaire', icon: EyeIcon },
    { id: 'likeCount', label: 'Plus aimé', icon: HeartIcon }
  ];

  // Gérer la recherche avec debounce
  useEffect(() => {
    setIsSearching(true);
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearchChange]);

  // Couleurs de catégorie
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

  // Effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche principale */}
      <div className="relative">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            {/* Champ de recherche */}
            <div className="flex-1 relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher dans les articles G-Maxing d'Engel Garcia Gomez..."
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                
                {/* Indicateur de recherche */}
                {isSearching && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
                
                {/* Bouton effacer */}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-center space-x-2 ${
                showFilters 
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg' 
                  : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
              }`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>

          {/* Résumé des résultats */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <div>
              {totalResults} {totalResults === 1 ? 'article trouvé' : 'articles trouvés'}
              {searchQuery && (
                <span> pour "{searchQuery}"</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedCategory !== 'all' && (
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-4 w-4" />
                  <span className="capitalize">{selectedCategory.replace('-', ' ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5" />
                <span>Filtres avancés</span>
              </h3>
              
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Catégories */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategoryChange(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r ' + getCategoryColor(category.id) + ' border-transparent text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <TagIcon className="h-4 w-4" />
                        <span className="text-sm capitalize">{category.label}</span>
                      </div>
                      <span className="text-xs opacity-70">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options de tri */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Trier par</h4>
                <div className="space-y-2">
                  {sortOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => onSortChange(option.id as any)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          sortBy === option.id
                            ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Recherches suggérées:
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['G-Maxing', 'Transformation', 'Engel Garcia Gomez'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogSearch;