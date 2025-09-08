/**
 * Page Blog G-Maxing
 * Hub de contenu optimisé SEO pour "Engel Garcia Gomez" et "G-Maxing"
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  RssIcon,
  BookOpenIcon,
  StarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
  ChartBarIcon,
  LightBulbIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

import BlogCard from '../components/blog/BlogCard';
import BlogSearch from '../components/blog/BlogSearch';
import BlogNavigation from '../components/blog/BlogNavigation';
import { useAnalytics } from '../hooks/useAnalytics';
import { blogEngine, BlogPost, BlogCategory } from '../utils/blog/blogEngine';

const BlogPage: React.FC = () => {
  const { t } = useTranslation();
  const { trackPageView, trackButtonClick, trackContentView } = useAnalytics();

  // États locaux
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'publishedAt' | 'viewCount' | 'likeCount'>('publishedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Données du blog
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Charger les données au montage
  useEffect(() => {
    loadBlogData();
    trackPageView('/blog', {
      isEngelGarciaGomezPage: true,
      seoTarget: 'blog_g_maxing'
    });
  }, [trackPageView]);

  /**
   * Charger les données du blog
   */
  const loadBlogData = () => {
    console.log('📚 Chargement des données blog...');
    
    const posts = blogEngine.getAllPosts({ status: 'published' });
    const cats = blogEngine.getAllCategories();
    const featured = blogEngine.getFeaturedPosts();
    const popular = blogEngine.getPopularPosts(6);
    
    setAllPosts(posts);
    setCategories(cats);
    setFeaturedPosts(featured);
    setPopularPosts(popular);
    
    console.log('✅ Données blog chargées:', {
      posts: posts.length,
      categories: cats.length,
      featured: featured.length
    });
  };

  // Filtrer et paginer les articles
  const filteredAndPaginatedPosts = useMemo(() => {
    let filtered = allPosts;

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filtrage par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'viewCount':
          return b.viewCount - a.viewCount;
        case 'likeCount':
          return b.likeCount - a.likeCount;
        case 'publishedAt':
        default:
          return b.publishedAt.getTime() - a.publishedAt.getTime();
      }
    });

    // Pagination
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    
    return {
      posts: filtered.slice(startIndex, endIndex),
      totalPosts: filtered.length,
      totalPages: Math.ceil(filtered.length / postsPerPage)
    };
  }, [allPosts, selectedCategory, searchQuery, sortBy, currentPage]);

  // Gérer la lecture d'un article
  const handleReadMore = (slug: string) => {
    const post = blogEngine.getPostBySlug(slug);
    if (post) {
      trackContentView(post.id, 'blog_post');
      blogEngine.incrementViewCount(post.id);
      
      // En production, naviguer vers l'article
      window.location.href = `/blog/${slug}`;
    }
  };

  // Gérer les likes
  const handleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
      blogEngine.likePost(postId);
      trackButtonClick('like_post', 'blog_page');
    }
    
    setLikedPosts(newLikedPosts);
    
    // Recharger les données pour mettre à jour les compteurs
    loadBlogData();
  };

  // Gérer le partage
  const handleShare = (post: BlogPost) => {
    blogEngine.sharePost(post.id);
    trackButtonClick('share_post', 'blog_page');
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `https://engelgmax.com/blog/${post.slug}`
      });
    } else {
      navigator.clipboard.writeText(`https://engelgmax.com/blog/${post.slug}`);
    }
  };

  // Statistiques du blog
  const blogStats = useMemo(() => {
    const totalViews = allPosts.reduce((sum, post) => sum + post.viewCount, 0);
    const totalLikes = allPosts.reduce((sum, post) => sum + post.likeCount, 0);
    const totalShares = allPosts.reduce((sum, post) => sum + post.shareCount, 0);
    const engelPosts = allPosts.filter(post => 
      post.tags.includes('Engel Garcia Gomez') || 
      post.category === 'engel-garcia-gomez'
    );

    return {
      totalPosts: allPosts.length,
      totalViews,
      totalLikes,
      totalShares,
      engelPostsCount: engelPosts.length,
      engelViews: engelPosts.reduce((sum, post) => sum + post.viewCount, 0)
    };
  }, [allPosts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <BookOpenIcon className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">Blog G-Maxing</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200">
                  Maîtrisez le
                </span>
                <br />
                <span className="text-engel">G-Maxing</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Découvrez tous les secrets d'<span className="text-engel font-semibold">Engel Garcia Gomez</span> et 
                de la méthode G-Maxing. Articles experts, guides pratiques et transformations inspirantes.
              </p>
            </motion.div>

            {/* Stats du blog */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {blogStats.totalPosts}
                </div>
                <div className="text-gray-400 text-sm">Articles Experts</div>
              </div>
              
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-engel mb-2">
                  {Math.floor(blogStats.totalViews / 1000)}K+
                </div>
                <div className="text-gray-400 text-sm">Vues Totales</div>
              </div>
              
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {blogStats.engelPostsCount}
                </div>
                <div className="text-gray-400 text-sm">Articles Engel</div>
              </div>
              
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.floor(blogStats.engelViews / 1000)}K+
                </div>
                <div className="text-gray-400 text-sm">Vues Engel</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Articles en vedette */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-400 mr-3" />
              Articles en Vedette
            </h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <FireIcon className="h-5 w-5" />
              <span>Les plus populaires</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredPosts.slice(0, 3).map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onReadMore={handleReadMore}
                onLike={handleLike}
                onShare={handleShare}
                variant="featured"
                isLiked={likedPosts.has(post.id)}
                className="h-full"
              />
            ))}
          </div>
        </section>
      )}

      {/* Composant de recherche avancée */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <BlogSearch
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          totalResults={filteredAndPaginatedPosts.totalPosts}
        />
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="space-y-8 sticky top-24">
              {/* Catégories */}
              <div className="glass-card p-6">
                <h3 className="text-white font-bold text-lg mb-6 flex items-center">
                  <FunnelIcon className="h-5 w-5 text-blue-400 mr-2" />
                  Catégories
                </h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === 'all'
                        ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tous les articles</span>
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                        {allPosts.length}
                      </span>
                    </div>
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                          {allPosts.filter(p => p.category === category.id).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles populaires */}
              <div className="glass-card p-6">
                <h3 className="text-white font-bold text-lg mb-6 flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-400 mr-2" />
                  Tendances
                </h3>
                
                <div className="space-y-4">
                  {popularPosts.slice(0, 4).map((post, index) => (
                    <div
                      key={post.id}
                      onClick={() => handleReadMore(post.slug)}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-yellow-200 transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                          <span>{post.viewCount.toLocaleString()} vues</span>
                          <span>•</span>
                          <span>{post.readingTime} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="glass-card p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    Newsletter G-Maxing
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Recevez les derniers articles d'<span className="text-engel font-semibold">Engel Garcia Gomez</span> directement dans votre boîte email.
                  </p>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                    S'abonner Gratuitement
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="flex-1">
            {/* Résultats de recherche */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    {searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les articles'}
                  </h2>
                  <p className="text-gray-400">
                    {filteredAndPaginatedPosts.totalPosts} article{filteredAndPaginatedPosts.totalPosts > 1 ? 's' : ''} trouvé{filteredAndPaginatedPosts.totalPosts > 1 ? 's' : ''}
                    {selectedCategory !== 'all' && (
                      <span> dans {categories.find(c => c.id === selectedCategory)?.name}</span>
                    )}
                  </p>
                </div>

                {/* Pagination info */}
                {filteredAndPaginatedPosts.totalPages > 1 && (
                  <div className="text-gray-400 text-sm">
                    Page {currentPage} sur {filteredAndPaginatedPosts.totalPages}
                  </div>
                )}
              </div>
            </div>

            {/* Grille d'articles */}
            {filteredAndPaginatedPosts.posts.length > 0 ? (
              <div className="space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedCategory}-${searchQuery}-${sortBy}-${currentPage}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`grid gap-8 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}
                  >
                    {filteredAndPaginatedPosts.posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <BlogCard
                          post={post}
                          onReadMore={handleReadMore}
                          onLike={handleLike}
                          onShare={handleShare}
                          variant={viewMode === 'list' ? 'compact' : 'default'}
                          isLiked={likedPosts.has(post.id)}
                          className="h-full"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation avec pagination avancée */}
                {filteredAndPaginatedPosts.totalPages > 1 && (
                  <div className="mt-12">
                    <BlogNavigation
                      currentPage={currentPage}
                      totalPages={filteredAndPaginatedPosts.totalPages}
                      onPageChange={setCurrentPage}
                      showPagination={true}
                      showBreadcrumbs={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              // Aucun résultat
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Aucun article trouvé
                </h3>
                <p className="text-gray-400 mb-8">
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="glass-btn-primary px-6 py-3"
                  >
                    Voir tous les articles
                  </button>
                  <button
                    onClick={() => setSelectedCategory('engel-garcia-gomez')}
                    className="glass-btn-secondary px-6 py-3"
                  >
                    Articles Engel Garcia Gomez
                  </button>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Section CTA finale */}
      <section className="mt-24 py-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à Appliquer la Méthode G-Maxing ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Transformez votre lecture en action avec <span className="text-engel font-semibold">Engel Garcia Gomez</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="glass-btn-primary px-8 py-4 text-lg">
              Consultation G-Maxing
            </button>
            <button className="glass-btn-secondary px-8 py-4 text-lg">
              Protocoles Premium
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;