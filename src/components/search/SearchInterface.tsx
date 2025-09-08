/**
 * Advanced Search Interface Component
 * Intelligent search with real-time suggestions, filters, and results
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { fuzzySearchEngine } from '../../utils/search/fuzzySearchEngine';

interface SearchResult {
  item: {
    id: string;
    title: string;
    description: string;
    category: string;
    url: string;
    metadata?: Record<string, any>;
  };
  score: number;
  highlightedTitle: string;
  highlightedDescription: string;
  explanation: string;
}

interface SearchSuggestion {
  text: string;
  score: number;
  type: 'correction' | 'completion' | 'similar';
  originalQuery: string;
}

interface SearchInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  isOpen,
  onToggle,
  onResultClick,
  placeholder,
  showFilters = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchStats, setSearchStats] = useState({ total: 0, time: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Categories for filtering
  const categories = [
    { id: '', label: 'Tous', icon: '🔍' },
    { id: 'about', label: 'À propos', icon: '👤' },
    { id: 'methodology', label: 'G-Maxing', icon: '🧬' },
    { id: 'training', label: 'Entraînement', icon: '💪' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'services', label: 'Services', icon: '🎯' },
    { id: 'blog', label: 'Blog', icon: '📝' },
    { id: 'testimonials', label: 'Témoignages', icon: '⭐' }
  ];

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Perform search with debouncing
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSuggestions([]);
      setSearchStats({ total: 0, time: 0 });
      return;
    }

    setIsSearching(true);

    try {
      const searchResult = fuzzySearchEngine.search({
        text: searchQuery,
        category: selectedCategory || undefined,
        sortBy,
        limit: 20
      });

      setResults(searchResult.results);
      setSuggestions(searchResult.suggestions);
      setSearchStats(searchResult.stats);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, [selectedCategory, sortBy]);

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Get autocomplete suggestions immediately
    if (value.length >= 2) {
      const autocomplete = fuzzySearchEngine.getAutocompleteSuggestions(value, 5);
      setAutocompleteSuggestions(autocomplete);
    } else {
      setAutocompleteSuggestions([]);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setAutocompleteSuggestions([]);
    performSearch(suggestion);
  }, [performSearch]);

  // Handle result click
  const handleResultClick = useCallback((result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Navigate to result URL
      window.location.href = result.item.url;
    }
    onToggle(); // Close search
  }, [onResultClick, onToggle]);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, performSearch]);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, performSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onToggle();
    }
  }, [onToggle]);

  // Get category info
  const getCategoryInfo = useCallback((categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  }, []);

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl mx-4"
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center space-x-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                        <MagnifyingGlassIcon className="h-5 w-5 text-white/60" />
                      </div>
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || "Rechercher dans G-Maxing..."}
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                      />
                      {query && (
                        <button
                          onClick={() => handleSearchChange('')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white/80 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Advanced Filters Toggle */}
                    {showFilters && (
                      <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          showAdvancedFilters
                            ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                            : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                      </button>
                    )}

                    {/* Close Button */}
                    <button
                      onClick={onToggle}
                      className="p-3 rounded-xl bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 hover:text-white transition-all duration-200"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Autocomplete Suggestions */}
                  <AnimatePresence>
                    {autocompleteSuggestions.length > 0 && query.length >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-1"
                      >
                        {autocompleteSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center space-x-2"
                          >
                            <MagnifyingGlassIcon className="h-4 w-4 text-white/40" />
                            <span>{suggestion}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Advanced Filters */}
                  <AnimatePresence>
                    {showAdvancedFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4"
                      >
                        {/* Categories */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-3">
                            <FunnelIcon className="h-4 w-4 inline mr-2" />
                            Catégories
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  selectedCategory === category.id
                                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-300 border'
                                    : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                                }`}
                              >
                                <span className="mr-2">{category.icon}</span>
                                {category.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sort Options */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-3">
                            <ArrowTrendingUpIcon className="h-4 w-4 inline mr-2" />
                            Trier par
                          </label>
                          <div className="flex gap-2">
                            {[
                              { id: 'relevance', label: 'Pertinence', icon: SparklesIcon },
                              { id: 'popularity', label: 'Popularité', icon: FireIcon },
                              { id: 'date', label: 'Date', icon: ClockIcon }
                            ].map(({ id, label, icon: Icon }) => (
                              <button
                                key={id}
                                onClick={() => handleSortChange(id as typeof sortBy)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                                  sortBy === id
                                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-300 border'
                                    : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto" ref={resultsRef}>
                  {/* Search Stats */}
                  {(results.length > 0 || searchStats.total > 0) && (
                    <div className="px-6 py-3 border-b border-white/10 bg-white/5">
                      <p className="text-sm text-white/60">
                        {isSearching ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/60 border-t-transparent mr-2" />
                            Recherche en cours...
                          </span>
                        ) : (
                          `${searchStats.total} résultat${searchStats.total > 1 ? 's' : ''} trouvé${searchStats.total > 1 ? 's' : ''} en ${searchStats.time}ms`
                        )}
                        {selectedCategory && (
                          <span className="ml-2">
                            dans {getCategoryInfo(selectedCategory).label}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Search Results List */}
                  <div className="p-6 space-y-4">
                    <AnimatePresence>
                      {results.map((result, index) => (
                        <motion.div
                          key={result.item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            onClick={() => handleResultClick(result)}
                            className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {getCategoryInfo(result.item.category).icon}
                                </span>
                                <h3
                                  className="font-semibold text-white group-hover:text-blue-300 transition-colors"
                                  dangerouslySetInnerHTML={{ __html: result.highlightedTitle }}
                                />
                              </div>
                              <div className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/60">
                                {Math.round(result.score)}
                              </div>
                            </div>
                            
                            <p
                              className="text-white/70 text-sm mb-2 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: result.highlightedDescription }}
                            />
                            
                            <div className="flex items-center justify-between text-xs text-white/50">
                              <span>{result.explanation}</span>
                              <span>{getCategoryInfo(result.item.category).label}</span>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* No Results */}
                    {!isSearching && query && results.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Aucun résultat trouvé
                        </h3>
                        <p className="text-white/60 mb-6">
                          Essayez avec d'autres mots-clés ou utilisez les suggestions ci-dessous.
                        </p>

                        {/* Search Suggestions */}
                        {suggestions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-white/70 mb-3">Suggestions :</p>
                            {suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion.text)}
                                className="inline-block mr-2 mb-2 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-sm text-white/70 hover:text-white transition-all duration-200"
                              >
                                {suggestion.type === 'correction' && '✏️ '}
                                {suggestion.type === 'completion' && '🔮 '}
                                {suggestion.type === 'similar' && '🔍 '}
                                {suggestion.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Empty State */}
                    {!query && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Recherche G-Maxing
                        </h3>
                        <p className="text-white/60 mb-6">
                          Trouvez tout sur la méthode G-Maxing d'Engel Garcia Gomez
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {['Engel Garcia Gomez', 'G-Maxing méthode', 'Transformation physique', 'Coaching personnel'].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-white/70 hover:text-white transition-all duration-200"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInterface;