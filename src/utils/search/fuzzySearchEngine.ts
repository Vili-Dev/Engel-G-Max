/**
 * Advanced Fuzzy Search Engine for G-Maxing Platform
 * Intelligent search with auto-suggestions, typo correction, and personalized results
 */

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  url: string;
  metadata?: Record<string, any>;
  searchWeight?: number; // Higher weight = more important results
}

interface SearchQuery {
  text: string;
  category?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'relevance' | 'date' | 'popularity' | 'alphabetical';
  limit?: number;
  offset?: number;
}

interface SearchResult {
  item: SearchableItem;
  score: number;
  matches: SearchMatch[];
  highlightedTitle: string;
  highlightedDescription: string;
  explanation: string;
}

interface SearchMatch {
  field: string;
  text: string;
  indices: [number, number][];
  score: number;
}

interface SearchSuggestion {
  text: string;
  score: number;
  type: 'correction' | 'completion' | 'similar';
  originalQuery: string;
}

interface SearchStats {
  totalQueries: number;
  avgResponseTime: number;
  popularQueries: Array<{ query: string; count: number }>;
  noResultsQueries: Array<{ query: string; count: number }>;
  categoryDistribution: Record<string, number>;
}

export class FuzzySearchEngine {
  private searchIndex: SearchableItem[] = [];
  private queryHistory: string[] = [];
  private queryStats: Map<string, number> = new Map();
  private noResultsQueries: Map<string, number> = new Map();
  private responseTimeHistory: number[] = [];

  constructor() {
    this.initializeSearchData();
  }

  /**
   * Initialize search data with G-Maxing content
   */
  private initializeSearchData() {
    this.searchIndex = [
      // Engel Garcia Gomez content
      {
        id: 'engel-garcia-gomez-bio',
        title: 'Engel Garcia Gomez - Expert G-Maxing & Transformation Physique',
        description: 'Découvrez Engel Garcia Gomez, créateur de la méthode G-Maxing révolutionnaire pour la transformation physique maximale.',
        content: 'Engel Garcia Gomez est un coach sportif de renommée mondiale, créateur de la méthode G-Maxing. Fort de plus de 15 ans d\'expérience, il a transformé la vie de plus de 15,000 clients à travers le monde. Sa méthode unique combine science, nutrition et entraînement personnalisé pour des résultats exceptionnels.',
        category: 'about',
        tags: ['engel garcia gomez', 'coach', 'g-maxing', 'transformation', 'expert'],
        url: '/engel-garcia-gomez',
        searchWeight: 10,
        metadata: { priority: 'highest', featured: true }
      },
      {
        id: 'gmax-methodology',
        title: 'Méthode G-Maxing - Science et Performance',
        description: 'La méthode G-Maxing d\'Engel Garcia Gomez : une approche scientifique pour maximiser vos résultats physiques.',
        content: 'G-Maxing (Genetic Maxing) est une méthode révolutionnaire développée par Engel Garcia Gomez qui optimise votre potentiel génétique. Cette approche combine entraînement périodisé, nutrition précise et récupération optimale pour des transformations extraordinaires.',
        category: 'methodology',
        tags: ['g-maxing', 'méthode', 'science', 'génétique', 'optimisation', 'engel garcia gomez'],
        url: '/g-maxing-guide-engel-garcia-gomez',
        searchWeight: 9,
        metadata: { difficulty: 'intermediate', duration: '8-12 weeks' }
      },

      // Training content
      {
        id: 'strength-training-gmax',
        title: 'Entraînement Force G-Maxing',
        description: 'Programme d\'entraînement force basé sur la méthode G-Maxing pour développer une force maximale.',
        content: 'L\'entraînement force G-Maxing utilise des protocoles avancés de périodisation pour maximiser les gains de force. Techniques de surcharge progressive, tempos contrôlés et récupération optimisée.',
        category: 'training',
        tags: ['force', 'strength', 'entraînement', 'g-maxing', 'progressive overload'],
        url: '/protocols?category=strength',
        searchWeight: 8,
        metadata: { level: 'advanced', equipment: 'gym' }
      },
      {
        id: 'hypertrophy-protocols',
        title: 'Protocoles Hypertrophie G-Maxing',
        description: 'Programmes d\'hypertrophie avancés pour maximiser la croissance musculaire avec la méthode G-Maxing.',
        content: 'Protocoles d\'hypertrophie G-Maxing optimisés pour la croissance musculaire maximale. Volume progressif, techniques d\'intensité et timing nutritionnel précis.',
        category: 'training',
        tags: ['hypertrophie', 'muscle', 'croissance', 'volume', 'g-maxing'],
        url: '/protocols?category=hypertrophy',
        searchWeight: 8,
        metadata: { level: 'intermediate', duration: '12-16 weeks' }
      },
      {
        id: 'fat-loss-protocols',
        title: 'Protocoles Perte de Gras G-Maxing',
        description: 'Stratégies avancées de perte de gras tout en préservant la masse musculaire.',
        content: 'Protocoles G-Maxing pour une perte de gras optimisée. Déficit calorique calculé, cardio stratégique et préservation musculaire maximale.',
        category: 'training',
        tags: ['perte de gras', 'fat loss', 'cardio', 'déficit', 'préservation musculaire'],
        url: '/protocols?category=fat-loss',
        searchWeight: 7,
        metadata: { level: 'beginner', duration: '8-16 weeks' }
      },

      // Nutrition content
      {
        id: 'gmax-nutrition-fundamentals',
        title: 'Nutrition G-Maxing - Fondamentaux',
        description: 'Les principes nutritionnels G-Maxing pour optimiser vos résultats et votre santé.',
        content: 'Nutrition G-Maxing : calculs précis des macronutriments, timing des repas, supplémentation ciblée et hydratation optimale pour des performances maximales.',
        category: 'nutrition',
        tags: ['nutrition', 'macros', 'timing', 'suppléments', 'hydratation', 'g-maxing'],
        url: '/blog/nutrition-g-maxing-engel-garcia-gomez',
        searchWeight: 7,
        metadata: { difficulty: 'beginner', scientificBacked: true }
      },
      {
        id: 'meal-planning-gmax',
        title: 'Planification Repas G-Maxing',
        description: 'Guide complet pour planifier vos repas selon les principes G-Maxing.',
        content: 'Planification nutritionnelle G-Maxing : calculs caloriques, répartition des macros, timing des nutriments et exemples de menus pour tous les objectifs.',
        category: 'nutrition',
        tags: ['planification', 'repas', 'calories', 'macros', 'menus'],
        url: '/blog/meal-planning-g-maxing',
        searchWeight: 6,
        metadata: { practical: true, examples: true }
      },

      // Services content
      {
        id: 'personal-coaching',
        title: 'Coaching Personnel G-Maxing',
        description: 'Coaching personnel 1-on-1 avec Engel Garcia Gomez pour une transformation maximale.',
        content: 'Coaching personnel exclusif avec Engel Garcia Gomez. Programme 100% personnalisé, suivi quotidien, ajustements en temps réel et garantie de résultats.',
        category: 'services',
        tags: ['coaching', 'personnel', '1-on-1', 'personnalisé', 'engel garcia gomez'],
        url: '/coaching-g-maxing',
        searchWeight: 9,
        metadata: { price: 'premium', availability: 'limited', results: 'guaranteed' }
      },
      {
        id: 'group-coaching',
        title: 'Coaching Groupe G-Maxing',
        description: 'Programme de coaching en groupe pour apprendre la méthode G-Maxing avec d\'autres passionnés.',
        content: 'Coaching de groupe G-Maxing : apprentissage collectif, motivation mutuelle, programmes adaptés et suivi régulier dans une communauté dynamique.',
        category: 'services',
        tags: ['coaching', 'groupe', 'communauté', 'motivation', 'apprentissage'],
        url: '/services?type=group',
        searchWeight: 6,
        metadata: { price: 'moderate', community: true }
      },

      // Blog content
      {
        id: 'transformation-secrets',
        title: 'Secrets Transformation G-Maxing',
        description: 'Les secrets cachés de la transformation physique selon Engel Garcia Gomez.',
        content: 'Découvrez les secrets de transformation que seuls les initiés connaissent. Techniques avancées, astuces psychologiques et méthodes exclusives d\'Engel Garcia Gomez.',
        category: 'blog',
        tags: ['secrets', 'transformation', 'techniques', 'psychologie', 'exclusif'],
        url: '/secrets-g-maxing-engel-garcia-gomez',
        searchWeight: 7,
        metadata: { exclusive: true, advanced: true }
      },
      {
        id: 'client-testimonials',
        title: 'Témoignages Clients Engel Garcia Gomez',
        description: 'Découvrez les témoignages authentiques des clients transformés par Engel Garcia Gomez.',
        content: 'Témoignages authentiques de clients ayant vécu une transformation complète avec Engel Garcia Gomez. Photos avant/après, histoires inspirantes et résultats mesurables.',
        category: 'testimonials',
        tags: ['témoignages', 'clients', 'résultats', 'transformation', 'avant après'],
        url: '/client-testimonials-engel-garcia-gomez',
        searchWeight: 8,
        metadata: { authentic: true, beforeAfter: true }
      }
    ];
  }

  /**
   * Main search function
   */
  public search(query: SearchQuery): {
    results: SearchResult[];
    suggestions: SearchSuggestion[];
    stats: { total: number; time: number };
  } {
    const startTime = Date.now();
    
    // Normalize query
    const normalizedQuery = this.normalizeQuery(query.text);
    
    // Track query
    this.trackQuery(normalizedQuery);
    
    // Search items
    const results = this.performSearch(normalizedQuery, query);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(normalizedQuery, results.length === 0);
    
    // Track response time
    const responseTime = Date.now() - startTime;
    this.responseTimeHistory.push(responseTime);
    if (this.responseTimeHistory.length > 1000) {
      this.responseTimeHistory = this.responseTimeHistory.slice(-1000);
    }

    // Track no results
    if (results.length === 0) {
      this.trackNoResultsQuery(normalizedQuery);
    }

    console.log(`🔍 Search completed: "${query.text}" → ${results.length} results in ${responseTime}ms`);

    return {
      results,
      suggestions,
      stats: {
        total: results.length,
        time: responseTime
      }
    };
  }

  /**
   * Perform the actual search
   */
  private performSearch(query: string, searchQuery: SearchQuery): SearchResult[] {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const results: SearchResult[] = [];

    for (const item of this.searchIndex) {
      // Category filter
      if (searchQuery.category && item.category !== searchQuery.category) {
        continue;
      }

      // Tag filter
      if (searchQuery.tags && searchQuery.tags.length > 0) {
        const hasMatchingTag = searchQuery.tags.some(tag => 
          item.tags.some(itemTag => itemTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) continue;
      }

      // Calculate search score
      const searchResult = this.calculateItemScore(item, queryTerms, query);
      
      if (searchResult.score > 0) {
        results.push(searchResult);
      }
    }

    // Sort results
    this.sortResults(results, searchQuery.sortBy || 'relevance');

    // Apply limit and offset
    const start = searchQuery.offset || 0;
    const limit = searchQuery.limit || 50;
    
    return results.slice(start, start + limit);
  }

  /**
   * Calculate relevance score for an item
   */
  private calculateItemScore(item: SearchableItem, queryTerms: string[], fullQuery: string): SearchResult {
    let totalScore = 0;
    const matches: SearchMatch[] = [];
    const searchFields = [
      { field: 'title', text: item.title, weight: 3 },
      { field: 'description', text: item.description, weight: 2 },
      { field: 'content', text: item.content, weight: 1 },
      { field: 'tags', text: item.tags.join(' '), weight: 2.5 },
      { field: 'category', text: item.category, weight: 1.5 }
    ];

    for (const { field, text, weight } of searchFields) {
      const fieldScore = this.calculateFieldScore(text, queryTerms, fullQuery);
      if (fieldScore.score > 0) {
        totalScore += fieldScore.score * weight;
        matches.push({
          field,
          text,
          indices: fieldScore.indices,
          score: fieldScore.score
        });
      }
    }

    // Apply search weight multiplier
    totalScore *= (item.searchWeight || 1);

    // Boost for exact phrase matches
    if (fullQuery.length > 3) {
      const normalizedTitle = item.title.toLowerCase();
      const normalizedContent = item.content.toLowerCase();
      
      if (normalizedTitle.includes(fullQuery)) {
        totalScore *= 1.5;
      }
      if (normalizedContent.includes(fullQuery)) {
        totalScore *= 1.2;
      }
    }

    // Generate highlighted versions
    const highlightedTitle = this.highlightMatches(item.title, queryTerms);
    const highlightedDescription = this.highlightMatches(item.description, queryTerms);
    
    // Generate explanation
    const explanation = this.generateMatchExplanation(matches, totalScore);

    return {
      item,
      score: totalScore,
      matches,
      highlightedTitle,
      highlightedDescription,
      explanation
    };
  }

  /**
   * Calculate score for a specific field
   */
  private calculateFieldScore(text: string, queryTerms: string[], fullQuery: string): {
    score: number;
    indices: [number, number][];
  } {
    const normalizedText = text.toLowerCase();
    let score = 0;
    const indices: [number, number][] = [];

    // Exact phrase match
    if (fullQuery.length > 2 && normalizedText.includes(fullQuery)) {
      score += 10;
      const index = normalizedText.indexOf(fullQuery);
      if (index !== -1) {
        indices.push([index, index + fullQuery.length]);
      }
    }

    // Individual term matches
    for (const term of queryTerms) {
      if (term.length < 2) continue;

      // Exact word match
      const wordRegex = new RegExp(`\\b${this.escapeRegExp(term)}\\b`, 'gi');
      const exactMatches = [...normalizedText.matchAll(wordRegex)];
      
      for (const match of exactMatches) {
        score += 5;
        if (match.index !== undefined) {
          indices.push([match.index, match.index + term.length]);
        }
      }

      // Fuzzy matches
      const fuzzyScore = this.calculateFuzzyMatch(normalizedText, term);
      score += fuzzyScore * 2;

      // Partial matches
      if (normalizedText.includes(term)) {
        score += 3;
        let index = normalizedText.indexOf(term);
        while (index !== -1) {
          indices.push([index, index + term.length]);
          index = normalizedText.indexOf(term, index + 1);
        }
      }
    }

    // Bonus for matches at the beginning of text
    if (normalizedText.startsWith(queryTerms[0])) {
      score *= 1.3;
    }

    return { score, indices };
  }

  /**
   * Calculate fuzzy match score using Levenshtein distance
   */
  private calculateFuzzyMatch(text: string, term: string): number {
    const words = text.split(/\s+/);
    let bestScore = 0;

    for (const word of words) {
      if (word.length < 3 || term.length < 3) continue;
      
      const distance = this.levenshteinDistance(word, term);
      const maxLength = Math.max(word.length, term.length);
      const similarity = (maxLength - distance) / maxLength;
      
      if (similarity > 0.7) { // 70% similarity threshold
        bestScore = Math.max(bestScore, similarity * 3);
      }
    }

    return bestScore;
  }

  /**
   * Levenshtein distance calculation
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Highlight search matches in text
   */
  private highlightMatches(text: string, queryTerms: string[]): string {
    let highlightedText = text;
    
    for (const term of queryTerms) {
      if (term.length < 2) continue;
      
      const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    }
    
    return highlightedText;
  }

  /**
   * Generate search suggestions
   */
  private generateSuggestions(query: string, noResults: boolean): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    
    // Typo corrections
    const corrections = this.generateTypoCorrections(query);
    suggestions.push(...corrections);
    
    // Query completions
    if (query.length >= 2) {
      const completions = this.generateCompletions(query);
      suggestions.push(...completions);
    }
    
    // Similar queries from history
    const similarQueries = this.findSimilarQueries(query);
    suggestions.push(...similarQueries);
    
    // Popular suggestions if no results
    if (noResults) {
      const popular = this.getPopularSuggestions();
      suggestions.push(...popular);
    }
    
    // Sort by score and limit
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }

  /**
   * Generate typo corrections
   */
  private generateTypoCorrections(query: string): SearchSuggestion[] {
    const corrections: SearchSuggestion[] = [];
    const commonTerms = [
      'engel garcia gomez', 'g-maxing', 'gmax', 'transformation', 'coaching',
      'nutrition', 'entraînement', 'musculation', 'force', 'hypertrophie',
      'perte de gras', 'fat loss', 'strength', 'muscle', 'diet', 'workout'
    ];

    const queryTerms = query.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < queryTerms.length; i++) {
      const term = queryTerms[i];
      if (term.length < 3) continue;
      
      for (const commonTerm of commonTerms) {
        const distance = this.levenshteinDistance(term, commonTerm);
        const similarity = (Math.max(term.length, commonTerm.length) - distance) / Math.max(term.length, commonTerm.length);
        
        if (similarity > 0.6 && similarity < 0.95) { // Potential typo
          const correctedQuery = [...queryTerms];
          correctedQuery[i] = commonTerm;
          
          corrections.push({
            text: correctedQuery.join(' '),
            score: similarity * 5,
            type: 'correction',
            originalQuery: query
          });
        }
      }
    }
    
    return corrections;
  }

  /**
   * Generate query completions
   */
  private generateCompletions(query: string): SearchSuggestion[] {
    const completions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();
    
    const completionTemplates = [
      'engel garcia gomez coach',
      'engel garcia gomez méthode',
      'engel garcia gomez g-maxing',
      'g-maxing entraînement',
      'g-maxing nutrition',
      'g-maxing transformation',
      'coaching personnel',
      'programme musculation',
      'perte de poids',
      'prise de muscle',
      'transformation physique'
    ];
    
    for (const template of completionTemplates) {
      if (template.startsWith(queryLower) && template !== queryLower) {
        completions.push({
          text: template,
          score: 3,
          type: 'completion',
          originalQuery: query
        });
      }
    }
    
    return completions;
  }

  /**
   * Find similar queries from history
   */
  private findSimilarQueries(query: string): SearchSuggestion[] {
    const similar: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();
    
    // Get most frequent queries
    const sortedQueries = Array.from(this.queryStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100);
    
    for (const [historicalQuery, count] of sortedQueries) {
      if (historicalQuery === queryLower) continue;
      
      // Check for partial matches
      const words1 = queryLower.split(/\s+/);
      const words2 = historicalQuery.split(/\s+/);
      
      const commonWords = words1.filter(word => 
        words2.some(w2 => w2.includes(word) || word.includes(w2))
      );
      
      if (commonWords.length > 0) {
        const similarity = (commonWords.length * 2) / (words1.length + words2.length);
        
        if (similarity > 0.3) {
          similar.push({
            text: historicalQuery,
            score: similarity * Math.log(count + 1),
            type: 'similar',
            originalQuery: query
          });
        }
      }
    }
    
    return similar;
  }

  /**
   * Get popular suggestions
   */
  private getPopularSuggestions(): SearchSuggestion[] {
    const popular = [
      'engel garcia gomez',
      'g-maxing méthode',
      'transformation physique',
      'coaching personnel',
      'programme musculation',
      'nutrition g-maxing'
    ];
    
    return popular.map(text => ({
      text,
      score: 2,
      type: 'similar' as const,
      originalQuery: ''
    }));
  }

  /**
   * Sort search results
   */
  private sortResults(results: SearchResult[], sortBy: string) {
    switch (sortBy) {
      case 'relevance':
        results.sort((a, b) => b.score - a.score);
        break;
      case 'date':
        // Sort by date if available in metadata
        results.sort((a, b) => {
          const dateA = a.item.metadata?.date || new Date(0);
          const dateB = b.item.metadata?.date || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'popularity':
        results.sort((a, b) => (b.item.searchWeight || 0) - (a.item.searchWeight || 0));
        break;
      case 'alphabetical':
        results.sort((a, b) => a.item.title.localeCompare(b.item.title));
        break;
    }
  }

  /**
   * Normalize search query
   */
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Track search query
   */
  private trackQuery(query: string) {
    this.queryHistory.push(query);
    this.queryStats.set(query, (this.queryStats.get(query) || 0) + 1);
    
    // Keep only last 10,000 queries
    if (this.queryHistory.length > 10000) {
      this.queryHistory = this.queryHistory.slice(-10000);
    }
  }

  /**
   * Track queries with no results
   */
  private trackNoResultsQuery(query: string) {
    this.noResultsQueries.set(query, (this.noResultsQueries.get(query) || 0) + 1);
  }

  /**
   * Generate match explanation
   */
  private generateMatchExplanation(matches: SearchMatch[], score: number): string {
    if (matches.length === 0) return 'No matches found';
    
    const fieldNames = matches.map(m => m.field);
    const uniqueFields = [...new Set(fieldNames)];
    
    if (uniqueFields.length === 1) {
      return `Matched in ${uniqueFields[0]}`;
    }
    
    return `Matched in ${uniqueFields.slice(0, -1).join(', ')} and ${uniqueFields[uniqueFields.length - 1]}`;
  }

  /**
   * Escape regex special characters
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Add new searchable item
   */
  public addItem(item: SearchableItem) {
    this.searchIndex.push(item);
    console.log(`📝 Added search item: ${item.title}`);
  }

  /**
   * Remove searchable item
   */
  public removeItem(id: string) {
    const index = this.searchIndex.findIndex(item => item.id === id);
    if (index !== -1) {
      this.searchIndex.splice(index, 1);
      console.log(`🗑️ Removed search item: ${id}`);
    }
  }

  /**
   * Update searchable item
   */
  public updateItem(id: string, updates: Partial<SearchableItem>) {
    const index = this.searchIndex.findIndex(item => item.id === id);
    if (index !== -1) {
      this.searchIndex[index] = { ...this.searchIndex[index], ...updates };
      console.log(`🔄 Updated search item: ${id}`);
    }
  }

  /**
   * Get search statistics
   */
  public getSearchStats(): SearchStats {
    const totalQueries = this.queryHistory.length;
    const avgResponseTime = this.responseTimeHistory.length > 0
      ? this.responseTimeHistory.reduce((sum, time) => sum + time, 0) / this.responseTimeHistory.length
      : 0;

    const popularQueries = Array.from(this.queryStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    const noResultsQueries = Array.from(this.noResultsQueries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    const categoryDistribution = this.searchIndex.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalQueries,
      avgResponseTime,
      popularQueries,
      noResultsQueries,
      categoryDistribution
    };
  }

  /**
   * Get autocomplete suggestions
   */
  public getAutocompleteSuggestions(query: string, limit: number = 5): string[] {
    if (query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase();
    const suggestions = new Set<string>();
    
    // Search in titles
    for (const item of this.searchIndex) {
      const title = item.title.toLowerCase();
      if (title.includes(normalizedQuery)) {
        suggestions.add(item.title);
      }
      
      // Search in tags
      for (const tag of item.tags) {
        if (tag.toLowerCase().includes(normalizedQuery)) {
          suggestions.add(tag);
        }
      }
    }
    
    // Add from query history
    for (const historicalQuery of this.queryHistory) {
      if (historicalQuery.includes(normalizedQuery)) {
        suggestions.add(historicalQuery);
      }
    }
    
    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Clear search history
   */
  public clearHistory() {
    this.queryHistory = [];
    this.queryStats.clear();
    this.noResultsQueries.clear();
    this.responseTimeHistory = [];
    console.log('🧹 Search history cleared');
  }
}

// Export singleton instance
export const fuzzySearchEngine = new FuzzySearchEngine();
export default FuzzySearchEngine;