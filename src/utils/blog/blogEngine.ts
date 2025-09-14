/**
 * Moteur de Blog G-Maxing avec Optimisation SEO
 * Système de contenu optimisé pour "Engel Garcia Gomez" et "G-Maxing"
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    socialLinks: {
      instagram?: string;
      tiktok?: string;
      youtube?: string;
      linkedin?: string;
    };
  };
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  featured: boolean;
  readingTime: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    ogImage: string;
    structuredData: Record<string, any>;
  };
  status: 'draft' | 'published' | 'scheduled';
  scheduledFor?: Date;
  relatedPosts: string[];
  comments: BlogComment[];
  mediaGallery: string[];
  difficulty: 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
  estimatedResults?: string;
  equipment?: string[];
  nutrition?: boolean;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  publishedAt: Date;
  approved: boolean;
  replies: BlogComment[];
  rating?: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  postCount: number;
  seoTitle: string;
  seoDescription: string;
}

export interface BlogAnalytics {
  totalPosts: number;
  totalViews: number;
  totalShares: number;
  totalComments: number;
  topPosts: Array<{
    postId: string;
    views: number;
    title: string;
  }>;
  categoryStats: Record<string, number>;
  trafficSources: Record<string, number>;
  searchQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
  }>;
  engelGarciaGomezMetrics: {
    mentionCount: number;
    totalViews: number;
    avgEngagement: number;
    topKeywords: string[];
  };
}

export class BlogEngine {
  private posts: Map<string, BlogPost> = new Map();
  private categories: Map<string, BlogCategory> = new Map();
  private analytics: BlogAnalytics = this.initializeAnalytics();
  private readonly STORAGE_KEY = 'engelgmax_blogengine_posts';

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultContent();
  }

  /**
   * Charger les données depuis localStorage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Restaurer les posts
        if (data.posts) {
          Object.entries(data.posts).forEach(([id, postData]: [string, any]) => {
            // Convertir les dates string en objets Date
            const post = {
              ...postData,
              publishedAt: new Date(postData.publishedAt),
              updatedAt: new Date(postData.updatedAt)
            };
            this.posts.set(id, post);
          });
        }
        console.log(`📚 Chargé ${this.posts.size} articles depuis localStorage`);
      }
    } catch (error) {
      console.error('Erreur lors du chargement depuis localStorage:', error);
    }
  }

  /**
   * Sauvegarder les données dans localStorage
   */
  private saveToStorage() {
    try {
      const data = {
        posts: Object.fromEntries(this.posts.entries())
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }

  /**
   * Initialiser le contenu par défaut optimisé pour le SEO
   */
  private initializeDefaultContent() {
    // Catégories optimisées SEO
    this.createCategory({
      id: 'engel-garcia-gomez',
      name: 'Engel Garcia Gomez',
      slug: 'engel-garcia-gomez',
      description: 'Tout sur Engel Garcia Gomez, créateur de la méthode G-Maxing et expert en transformation physique.',
      color: 'from-yellow-500 to-orange-500',
      icon: '👤',
      postCount: 0,
      seoTitle: 'Engel Garcia Gomez - Coach G-Maxing Expert | Articles et Conseils',
      seoDescription: 'Découvrez les articles exclusifs d\'Engel Garcia Gomez sur la méthode G-Maxing, transformation physique et coaching sportif professionnel.'
    });

    this.createCategory({
      id: 'methode-gmax',
      name: 'Méthode G-Maxing',
      slug: 'methode-g-maxing',
      description: 'Découvrez tous les secrets de la méthode G-Maxing pour maximiser votre potentiel génétique.',
      color: 'from-blue-500 to-purple-500',
      icon: '🧬',
      postCount: 0,
      seoTitle: 'Méthode G-Maxing - Guide Complet | Engel Garcia Gomez',
      seoDescription: 'Apprenez la méthode G-Maxing révolutionnaire d\'Engel Garcia Gomez. Protocoles, techniques et secrets pour une transformation physique maximale.'
    });

    this.createCategory({
      id: 'transformation',
      name: 'Transformations Clients',
      slug: 'transformations-clients',
      description: 'Les incroyables transformations physiques réalisées avec la méthode G-Maxing.',
      color: 'from-green-500 to-teal-500',
      icon: '📈',
      postCount: 0,
      seoTitle: 'Transformations Physiques G-Maxing | Résultats Clients Engel Garcia Gomez',
      seoDescription: 'Découvrez les transformations physiques spectaculaires obtenues avec la méthode G-Maxing d\'Engel Garcia Gomez. Avant/après authentiques.'
    });

    this.createCategory({
      id: 'entrainement',
      name: 'Entraînement G-Maxing',
      slug: 'entrainement-g-maxing',
      description: 'Techniques d\'entraînement avancées selon la méthode G-Maxing.',
      color: 'from-red-500 to-pink-500',
      icon: '💪',
      postCount: 0,
      seoTitle: 'Entraînement G-Maxing - Techniques et Protocoles | Engel Garcia Gomez',
      seoDescription: 'Maîtrisez les techniques d\'entraînement G-Maxing avec les protocoles exclusifs d\'Engel Garcia Gomez. Maximisez vos résultats physiques.'
    });

    this.createCategory({
      id: 'nutrition',
      name: 'Nutrition G-Maxing',
      slug: 'nutrition-g-maxing',
      description: 'Stratégies nutritionnelles pour optimiser vos résultats G-Maxing.',
      color: 'from-emerald-500 to-cyan-500',
      icon: '🥗',
      postCount: 0,
      seoTitle: 'Nutrition G-Maxing - Guide Alimentaire | Engel Garcia Gomez',
      seoDescription: 'Optimisez votre nutrition avec les stratégies alimentaires G-Maxing d\'Engel Garcia Gomez. Alimentation pour la transformation physique.'
    });

    // Articles d'exemple supprimés - démarrage avec un blog vide
  }


  /**
   * Créer une nouvelle catégorie
   */
  public createCategory(category: BlogCategory): void {
    this.categories.set(category.id, category);
    console.log('📝 Catégorie blog créée:', category.name);
  }

  /**
   * Créer un nouvel article
   */
  public createPost(post: BlogPost): string {
    // Vérifier si l'article existe déjà
    const existingPost = this.posts.get(post.id);
    const isUpdate = !!existingPost;

    // Générer un ID si non fourni
    if (!post.id) {
      post.id = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Générer un slug si non fourni
    if (!post.slug) {
      post.slug = this.generateSlug(post.title);
    }

    // Calculer le temps de lecture
    if (!post.readingTime) {
      post.readingTime = Math.ceil(post.content.length / 1000);
    }

    // Préserver les compteurs existants si c'est une mise à jour
    if (isUpdate) {
      post.viewCount = post.viewCount || existingPost.viewCount || 0;
      post.likeCount = post.likeCount || existingPost.likeCount || 0;
      post.shareCount = post.shareCount || existingPost.shareCount || 0;
    } else {
      // Initialiser les compteurs pour un nouveau post
      post.viewCount = post.viewCount || 0;
      post.likeCount = post.likeCount || 0;
      post.shareCount = post.shareCount || 0;
    }

    this.posts.set(post.id, post);

    // Mettre à jour le compteur de la catégorie seulement pour les nouveaux posts
    if (!isUpdate) {
      const category = this.categories.get(post.category);
      if (category) {
        category.postCount++;
      }
    }

    // Sauvegarder dans localStorage
    this.saveToStorage();

    console.log(isUpdate ? '📝 Article blog mis à jour:' : '📄 Article blog créé:', post.title);
    return post.id;
  }

  /**
   * Générer un slug SEO-friendly
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
      .replace(/[^a-z0-9 -]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Éviter tirets multiples
      .trim();
  }

  /**
   * Obtenir tous les articles
   */
  public getAllPosts(options: {
    status?: 'draft' | 'published' | 'scheduled';
    category?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'publishedAt' | 'viewCount' | 'likeCount' | 'title';
    sortOrder?: 'asc' | 'desc';
  } = {}): BlogPost[] {
    let posts = Array.from(this.posts.values());

    // Filtrage par statut
    if (options.status) {
      posts = posts.filter(post => post.status === options.status);
    }

    // Filtrage par catégorie
    if (options.category) {
      posts = posts.filter(post => post.category === options.category);
    }

    // Tri
    const sortBy = options.sortBy || 'publishedAt';
    const sortOrder = options.sortOrder || 'desc';
    
    posts.sort((a, b) => {
      let valueA = a[sortBy as keyof BlogPost];
      let valueB = b[sortBy as keyof BlogPost];
      
      if (valueA instanceof Date) valueA = valueA.getTime();
      if (valueB instanceof Date) valueB = valueB.getTime();
      
      if (sortOrder === 'desc') {
        return (valueB as number) - (valueA as number);
      } else {
        return (valueA as number) - (valueB as number);
      }
    });

    // Pagination
    const offset = options.offset || 0;
    const limit = options.limit || posts.length;
    
    return posts.slice(offset, offset + limit);
  }

  /**
   * Obtenir un article par slug
   */
  public getPostBySlug(slug: string): BlogPost | null {
    return Array.from(this.posts.values()).find(post => post.slug === slug) || null;
  }

  /**
   * Obtenir un article par ID
   */
  public getPostById(id: string): BlogPost | null {
    return this.posts.get(id) || null;
  }

  /**
   * Rechercher des articles
   */
  public searchPosts(query: string): BlogPost[] {
    const normalizedQuery = query.toLowerCase();
    
    return Array.from(this.posts.values()).filter(post => {
      return post.status === 'published' && (
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.content.toLowerCase().includes(normalizedQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }

  /**
   * Obtenir les articles populaires
   */
  public getPopularPosts(limit: number = 5): BlogPost[] {
    return this.getAllPosts({ 
      status: 'published',
      sortBy: 'viewCount',
      sortOrder: 'desc',
      limit 
    });
  }

  /**
   * Obtenir les articles récents
   */
  public getRecentPosts(limit: number = 5): BlogPost[] {
    return this.getAllPosts({ 
      status: 'published',
      sortBy: 'publishedAt',
      sortOrder: 'desc',
      limit 
    });
  }

  /**
   * Obtenir les articles en vedette
   */
  public getFeaturedPosts(): BlogPost[] {
    return Array.from(this.posts.values()).filter(post => 
      post.status === 'published' && post.featured
    );
  }

  /**
   * Obtenir toutes les catégories
   */
  public getAllCategories(): BlogCategory[] {
    return Array.from(this.categories.values());
  }

  /**
   * Obtenir une catégorie par slug
   */
  public getCategoryBySlug(slug: string): BlogCategory | null {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug) || null;
  }

  /**
   * Incrementer le compteur de vues
   */
  public incrementViewCount(postId: string): void {
    const post = this.posts.get(postId);
    if (post) {
      post.viewCount++;
      this.analytics.totalViews++;
      this.saveToStorage(); // Sauvegarder les changements
    }
  }

  /**
   * Ajouter un like
   */
  public likePost(postId: string): void {
    const post = this.posts.get(postId);
    if (post) {
      post.likeCount++;
      this.saveToStorage(); // Sauvegarder les changements
    }
  }

  /**
   * Incrementer le compteur de partages
   */
  public sharePost(postId: string): void {
    const post = this.posts.get(postId);
    if (post) {
      post.shareCount++;
      this.saveToStorage(); // Sauvegarder les changements
    }
  }

  /**
   * Obtenir les analytics du blog
   */
  public getAnalytics(): BlogAnalytics {
    const posts = Array.from(this.posts.values());
    
    // Mettre à jour les statistiques
    this.analytics.totalPosts = posts.filter(p => p.status === 'published').length;
    this.analytics.totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0);
    this.analytics.totalShares = posts.reduce((sum, p) => sum + p.shareCount, 0);
    this.analytics.totalComments = posts.reduce((sum, p) => sum + p.comments.length, 0);
    
    // Top posts
    this.analytics.topPosts = posts
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10)
      .map(p => ({
        postId: p.id,
        views: p.viewCount,
        title: p.title
      }));
    
    // Stats par catégorie
    this.analytics.categoryStats = {};
    posts.forEach(post => {
      this.analytics.categoryStats[post.category] = 
        (this.analytics.categoryStats[post.category] || 0) + post.viewCount;
    });
    
    // Métriques Engel Garcia Gomez
    const engelPosts = posts.filter(p => 
      p.tags.includes('Engel Garcia Gomez') || 
      p.category === 'engel-garcia-gomez'
    );
    
    this.analytics.engelGarciaGomezMetrics = {
      mentionCount: engelPosts.length,
      totalViews: engelPosts.reduce((sum, p) => sum + p.viewCount, 0),
      avgEngagement: engelPosts.length > 0 
        ? engelPosts.reduce((sum, p) => sum + p.likeCount + p.shareCount, 0) / engelPosts.length 
        : 0,
      topKeywords: [
        'Engel Garcia Gomez',
        'G-Maxing',
        'transformation physique',
        'coaching expert',
        'méthode G-Maxing'
      ]
    };
    
    return this.analytics;
  }

  /**
   * Initialiser les analytics
   */
  private initializeAnalytics(): BlogAnalytics {
    return {
      totalPosts: 0,
      totalViews: 0,
      totalShares: 0,
      totalComments: 0,
      topPosts: [],
      categoryStats: {},
      trafficSources: {
        organic: 65,
        direct: 20,
        social: 10,
        referral: 5
      },
      searchQueries: [
        { query: 'Engel Garcia Gomez', clicks: 1250, impressions: 8500 },
        { query: 'méthode G-Maxing', clicks: 890, impressions: 5200 },
        { query: 'G-Maxing coach', clicks: 670, impressions: 3800 },
        { query: 'transformation physique', clicks: 540, impressions: 4200 }
      ],
      engelGarciaGomezMetrics: {
        mentionCount: 0,
        totalViews: 0,
        avgEngagement: 0,
        topKeywords: []
      }
    };
  }

  /**
   * Générer le sitemap XML du blog
   */
  public generateSitemap(): string {
    const posts = this.getAllPosts({ status: 'published' });
    const categories = this.getAllCategories();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Ajouter les posts
    posts.forEach(post => {
      sitemap += `
  <url>
    <loc>https://engelgmax.com/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${post.featured ? '0.9' : '0.8'}</priority>
  </url>`;
    });
    
    // Ajouter les catégories
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>https://engelgmax.com/blog/category/${category.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
    
    sitemap += `
</urlset>`;
    
    return sitemap;
  }

  /**
   * Obtenir les statistiques SEO
   */
  public getSEOStats() {
    const posts = this.getAllPosts({ status: 'published' });
    
    return {
      totalPosts: posts.length,
      engelGarciaGomezMentions: posts.filter(p => 
        p.content.toLowerCase().includes('engel garcia gomez')
      ).length,
      gMaxingMentions: posts.filter(p => 
        p.content.toLowerCase().includes('g-maxing')
      ).length,
      avgTitleLength: posts.reduce((sum, p) => sum + p.title.length, 0) / posts.length,
      avgDescriptionLength: posts.reduce((sum, p) => sum + p.seoData.metaDescription.length, 0) / posts.length,
      postsWithImages: posts.filter(p => p.seoData.ogImage).length,
      avgReadingTime: posts.reduce((sum, p) => sum + p.readingTime, 0) / posts.length
    };
  }
}

// Export singleton instance
export const blogEngine = new BlogEngine();
export default BlogEngine;