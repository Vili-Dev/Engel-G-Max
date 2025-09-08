/**
 * Custom hook for advanced search functionality
 * Manages search state, history, and integration with fuzzy search engine
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { fuzzySearchEngine } from '../utils/search/fuzzySearchEngine';
import { useAuth } from './useAuth';

interface SearchQuery {
  text: string;
  category?: string;
  tags?: string[];
  sortBy?: 'relevance' | 'date' | 'popularity' | 'alphabetical';
  limit?: number;
  offset?: number;
}

interface SearchResult {
  item: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    url: string;
    metadata?: Record<string, any>;
    searchWeight?: number;
  };
  score: number;
  matches: Array<{
    field: string;
    text: string;
    indices: [number, number][];
    score: number;
  }>;
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

interface SearchState {
  isOpen: boolean;
  isSearching: boolean;
  query: string;
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  autocompleteSuggestions: string[];
  selectedCategory: string;
  sortBy: 'relevance' | 'date' | 'popularity' | 'alphabetical';
  searchHistory: string[];
  recentQueries: string[];
  stats: {
    total: number;
    time: number;
  };
}

interface SearchAnalytics {
  totalSearches: number;
  averageResultCount: number;
  popularQueries: Array<{ query: string; count: number }>;
  noResultsQueries: Array<{ query: string; count: number }>;
  categoryUsage: Record<string, number>;
  averageResponseTime: number;
}

interface UseSearchReturn {
  // State
  isOpen: boolean;
  isSearching: boolean;
  query: string;
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  autocompleteSuggestions: string[];
  selectedCategory: string;
  sortBy: 'relevance' | 'date' | 'popularity' | 'alphabetical';
  searchHistory: string[];
  recentQueries: string[];
  stats: { total: number; time: number };

  // Actions
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  performSearch: (query: string, options?: Partial<SearchQuery>) => Promise<void>;
  setQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: SearchState['sortBy']) => void;
  clearResults: () => void;
  clearHistory: () => void;
  
  // Utilities
  getAutocompleteSuggestions: (query: string) => string[];
  saveSearch: (query: string) => void;
  
  // Analytics
  getAnalytics: () => SearchAnalytics;
  
  // State queries
  hasResults: boolean;
  hasHistory: boolean;
  canSearch: boolean;
}

export const useSearch = (): UseSearchReturn => {
  const { user } = useAuth();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const [state, setState] = useState<SearchState>({
    isOpen: false,
    isSearching: false,
    query: '',
    results: [],
    suggestions: [],
    autocompleteSuggestions: [],
    selectedCategory: '',
    sortBy: 'relevance',
    searchHistory: [],
    recentQueries: [],
    stats: { total: 0, time: 0 }
  });

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, [user]);

  // Save search history when it changes
  useEffect(() => {
    if (user && state.searchHistory.length > 0) {
      const saveTimer = setTimeout(() => {
        saveSearchHistory();
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [state.searchHistory, user]);

  /**
   * Open search interface
   */
  const openSearch = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  /**
   * Close search interface
   */
  const closeSearch = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isOpen: false,
      query: '',
      results: [],
      suggestions: [],
      autocompleteSuggestions: []
    }));
    
    // Clear any pending search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  /**
   * Toggle search interface
   */
  const toggleSearch = useCallback(() => {
    setState(prev => prev.isOpen ? { 
      ...prev, 
      isOpen: false,
      query: '',
      results: [],
      suggestions: [],
      autocompleteSuggestions: []
    } : { ...prev, isOpen: true });
  }, []);

  /**
   * Perform search with fuzzy search engine
   */
  const performSearch = useCallback(async (searchQuery: string, options: Partial<SearchQuery> = {}) => {
    if (!searchQuery.trim()) {
      setState(prev => ({
        ...prev,
        results: [],
        suggestions: [],
        stats: { total: 0, time: 0 }
      }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true }));

    try {
      const searchOptions: SearchQuery = {
        text: searchQuery,
        category: options.category || state.selectedCategory || undefined,
        sortBy: options.sortBy || state.sortBy,
        limit: options.limit || 20,
        offset: options.offset || 0,
        ...options
      };

      console.log('🔍 Performing search:', searchOptions);

      const searchResult = fuzzySearchEngine.search(searchOptions);

      setState(prev => ({
        ...prev,
        results: searchResult.results,
        suggestions: searchResult.suggestions,
        stats: searchResult.stats,
        isSearching: false
      }));

      // Save successful search to history
      if (searchResult.results.length > 0) {
        saveSearch(searchQuery);
      }

      console.log(`✅ Search completed: ${searchResult.results.length} results`);

    } catch (error) {
      console.error('❌ Search error:', error);
      setState(prev => ({
        ...prev,
        results: [],
        suggestions: [],
        stats: { total: 0, time: 0 },
        isSearching: false
      }));
    }
  }, [state.selectedCategory, state.sortBy]);

  /**
   * Set search query
   */
  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Get autocomplete suggestions immediately for queries >= 2 chars
    if (query.length >= 2) {
      const autocomplete = fuzzySearchEngine.getAutocompleteSuggestions(query, 5);
      setState(prev => ({ ...prev, autocompleteSuggestions: autocomplete }));
    } else {
      setState(prev => ({ ...prev, autocompleteSuggestions: [] }));
    }

    // Debounce actual search
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      }
    }, 300);
  }, [performSearch]);

  /**
   * Set search category
   */
  const setCategory = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
    
    // Re-run search if query exists
    if (state.query.trim()) {
      performSearch(state.query, { category });
    }
  }, [state.query, performSearch]);

  /**
   * Set sort order
   */
  const setSortBy = useCallback((sortBy: SearchState['sortBy']) => {
    setState(prev => ({ ...prev, sortBy }));
    
    // Re-run search if query exists
    if (state.query.trim()) {
      performSearch(state.query, { sortBy });
    }
  }, [state.query, performSearch]);

  /**
   * Clear search results
   */
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      suggestions: [],
      autocompleteSuggestions: [],
      stats: { total: 0, time: 0 }
    }));

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  /**
   * Clear search history
   */
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchHistory: [],
      recentQueries: []
    }));

    if (user) {
      localStorage.removeItem(`gmax-search-history-${user.uid}`);
    }

    fuzzySearchEngine.clearHistory();
    console.log('🧹 Search history cleared');
  }, [user]);

  /**
   * Get autocomplete suggestions
   */
  const getAutocompleteSuggestions = useCallback((query: string): string[] => {
    if (query.length < 2) return [];
    return fuzzySearchEngine.getAutocompleteSuggestions(query, 5);
  }, []);

  /**
   * Save search to history
   */
  const saveSearch = useCallback((query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery || normalizedQuery.length < 2) return;

    setState(prev => {
      // Add to recent queries (keep last 10)
      const newRecentQueries = [normalizedQuery, ...prev.recentQueries.filter(q => q !== normalizedQuery)].slice(0, 10);
      
      // Add to full history (keep last 100)
      const newSearchHistory = [normalizedQuery, ...prev.searchHistory.filter(q => q !== normalizedQuery)].slice(0, 100);

      return {
        ...prev,
        recentQueries: newRecentQueries,
        searchHistory: newSearchHistory
      };
    });

    console.log('💾 Search saved to history:', normalizedQuery);
  }, []);

  /**
   * Load search history from localStorage
   */
  const loadSearchHistory = useCallback(() => {
    if (!user) return;

    try {
      const savedHistory = localStorage.getItem(`gmax-search-history-${user.uid}`);
      if (savedHistory) {
        const { searchHistory, recentQueries } = JSON.parse(savedHistory);
        setState(prev => ({
          ...prev,
          searchHistory: searchHistory || [],
          recentQueries: recentQueries || []
        }));
        console.log('📱 Search history loaded');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load search history:', error);
    }
  }, [user]);

  /**
   * Save search history to localStorage
   */
  const saveSearchHistory = useCallback(() => {
    if (!user) return;

    try {
      const historyData = {
        searchHistory: state.searchHistory,
        recentQueries: state.recentQueries
      };
      localStorage.setItem(`gmax-search-history-${user.uid}`, JSON.stringify(historyData));
      console.log('💾 Search history saved');
    } catch (error) {
      console.warn('⚠️ Failed to save search history:', error);
    }
  }, [user, state.searchHistory, state.recentQueries]);

  /**
   * Get search analytics
   */
  const getAnalytics = useCallback((): SearchAnalytics => {
    const engineStats = fuzzySearchEngine.getSearchStats();
    
    // Calculate category usage from history
    const categoryUsage: Record<string, number> = {};
    // This would be tracked in a real implementation
    
    return {
      totalSearches: state.searchHistory.length,
      averageResultCount: state.results.length, // Simplified
      popularQueries: engineStats.popularQueries,
      noResultsQueries: engineStats.noResultsQueries,
      categoryUsage: engineStats.categoryDistribution,
      averageResponseTime: engineStats.avgResponseTime
    };
  }, [state.searchHistory.length, state.results.length]);

  // Computed values
  const hasResults = useMemo(() => state.results.length > 0, [state.results.length]);
  const hasHistory = useMemo(() => state.searchHistory.length > 0, [state.searchHistory.length]);
  const canSearch = useMemo(() => !state.isSearching, [state.isSearching]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    isOpen: state.isOpen,
    isSearching: state.isSearching,
    query: state.query,
    results: state.results,
    suggestions: state.suggestions,
    autocompleteSuggestions: state.autocompleteSuggestions,
    selectedCategory: state.selectedCategory,
    sortBy: state.sortBy,
    searchHistory: state.searchHistory,
    recentQueries: state.recentQueries,
    stats: state.stats,

    // Actions
    openSearch,
    closeSearch,
    toggleSearch,
    performSearch,
    setQuery,
    setCategory,
    setSortBy,
    clearResults,
    clearHistory,
    
    // Utilities
    getAutocompleteSuggestions,
    saveSearch,
    
    // Analytics
    getAnalytics,
    
    // State queries
    hasResults,
    hasHistory,
    canSearch
  };
};

export default useSearch;