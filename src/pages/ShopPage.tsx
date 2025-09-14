/**
 * Page Boutique G-Maxing
 * Services de coaching, protocoles et vêtements de sport/manga d'Engel Garcia Gomez
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  FireIcon,
  CheckCircleIcon,
  SparklesIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, ShoppingCartIcon as CartSolid } from '@heroicons/react/24/solid';

import ProductCard from '../components/shop/ProductCard';
import CheckoutModal from '../components/shop/CheckoutModal';
import { useEcommerce } from '../hooks/useEcommerce';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import { GMaxingProduct, GMAX_PRODUCTS, formatPrice } from '../utils/ecommerce/stripeConfig';

const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { trackPageView, trackButtonClick } = useAnalytics();
  const {
    cart,
    wishlist,
    isCheckoutOpen,
    checkoutProduct,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    openCheckout,
    closeCheckout,
    purchaseProduct,
    getProductsByCategory,
    getPopularProducts,
    getRecommendedProducts,
    trackProductView,
    getCartItemCount,
    hasUserPurchased
  } = useEcommerce();

  // États locaux
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'name'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Tracker la vue de page
  useEffect(() => {
    trackPageView('/boutique', {
      isEngelGarciaGomezPage: true,
      seoTarget: 'boutique_g_maxing'
    });
  }, [trackPageView]);

  // Catégories disponibles
  const categories = [
    { id: 'all', name: 'Tous les produits', icon: Squares2X2Icon, count: GMAX_PRODUCTS.length },
    { id: 'coaching', name: 'Coaching Personnel', icon: UserGroupIcon, count: getProductsByCategory('coaching').length },
    { id: 'consultation', name: 'Consultations', icon: AcademicCapIcon, count: getProductsByCategory('consultation').length },
    { id: 'protocol', name: 'Protocoles', icon: SparklesIcon, count: getProductsByCategory('protocol').length },
    { id: 'clothing', name: 'Vêtements Sport', icon: FireIcon, count: getProductsByCategory('clothing').length },
    { id: 'manga', name: 'Style Manga', icon: GlobeAltIcon, count: getProductsByCategory('manga').length },
    { id: 'premium', name: 'Premium', icon: StarIcon, count: getProductsByCategory('premium').length }
  ];

  // Filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let products = GMAX_PRODUCTS;

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      products = products.filter(product => product.category === selectedCategory);
    }

    // Filtrage par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Tri
    switch (sortBy) {
      case 'popular':
        products.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [selectedCategory, searchQuery, sortBy]);

  // Produits populaires pour la section hero
  const popularProducts = useMemo(() => getPopularProducts().slice(0, 3), []);

  // Recommandations personnalisées
  const recommendedProducts = useMemo(() => {
    if (user) {
      return getRecommendedProducts(user.uid).slice(0, 4);
    }
    return [];
  }, [user, getRecommendedProducts]);

  // Gérer l'achat d'un produit
  const handlePurchaseProduct = async (product: GMaxingProduct) => {
    trackProductView(product.id);
    trackButtonClick('purchase_product', 'shop_page');
    openCheckout(product);
  };

  // Gérer l'ajout à la wishlist
  const handleToggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      trackButtonClick('remove_from_wishlist', 'shop_page');
    } else {
      addToWishlist(productId);
      trackButtonClick('add_to_wishlist', 'shop_page');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Section Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
                <SparklesIcon className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">Boutique G-Maxing</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200">
                  Transformez-vous avec
                </span>
                <br />
                <span className="text-engel">Engel Garcia Gomez</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Découvrez les services exclusifs et protocoles G-Maxing pour maximiser votre potentiel génétique et atteindre vos objectifs physiques.
              </p>
            </motion.div>

            {/* Stats et badges de confiance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center items-center gap-8 mb-12"
            >
              <div className="flex items-center space-x-2 text-gray-300">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
                <span className="font-medium">15,000+ Clients Transformés</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <StarIcon className="h-6 w-6 text-yellow-400" />
                <span className="font-medium">98% de Satisfaction</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FireIcon className="h-6 w-6 text-red-400" />
                <span className="font-medium">Méthode G-Maxing Exclusive</span>
              </div>
            </motion.div>

            {/* Produits populaires en vedette */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {popularProducts.map((product, index) => (
                <div key={product.id} className="group">
                  <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-yellow-500/30">
                    <div className="text-4xl mb-4">
                      {product.category === 'coaching' && '👨‍🏫'}
                      {product.category === 'protocol' && '📋'}
                      {product.category === 'premium' && '⭐'}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.description.slice(0, 80)}...</p>
                    <div className="text-2xl font-bold text-engel mb-4">
                      {formatPrice(product.price)}
                      {product.type === 'subscription' && <span className="text-lg text-gray-400">/mois</span>}
                    </div>
                    <button
                      onClick={() => handlePurchaseProduct(product)}
                      className="glass-btn-primary w-full py-2"
                    >
                      Découvrir
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Barre de recherche et filtres */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Options d'affichage et tri */}
            <div className="flex items-center space-x-4">
              {/* Mode d'affichage */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="popular">Plus populaires</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>

              {/* Panier */}
              {getCartItemCount() > 0 && (
                <button className="relative p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white hover:shadow-lg transition-all duration-200">
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filtres */}
          <aside className="lg:w-1/4">
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg flex items-center">
                  <FunnelIcon className="h-5 w-5 mr-2 text-blue-400" />
                  Filtres
                </h3>
                <span className="text-gray-400 text-sm">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Catégories */}
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
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
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Gammes de prix */}
              <div className="mt-8">
                <h4 className="text-white font-semibold mb-4">Gammes de prix</h4>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-300">• Consultation: {formatPrice(297)}</div>
                  <div className="text-gray-300">• Protocoles: {formatPrice(197)}</div>
                  <div className="text-gray-300">• Coaching Groupe: {formatPrice(997)}</div>
                  <div className="text-gray-300">• Coaching Premium: {formatPrice(2997)}</div>
                  <div className="text-gray-300">• Abonnement: {formatPrice(47)}/mois</div>
                </div>
              </div>

              {/* Badge de confiance */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Garantie Satisfaction</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Tous nos services sont garantis satisfait ou remboursé sous 30 jours.
                </p>
              </div>
            </div>
          </aside>

          {/* Liste des produits */}
          <main className="flex-1">
            {/* Recommandations personnalisées */}
            {recommendedProducts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <SparklesIcon className="h-6 w-6 text-yellow-400 mr-2" />
                  Recommandé pour vous
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {recommendedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onPurchase={handlePurchaseProduct}
                      className="h-full"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Grille des produits */}
            <section>
              {filteredProducts.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedCategory}-${sortBy}-${searchQuery}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`grid gap-8 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' 
                        : 'grid-cols-1'
                    }`}
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        {/* Badge acheté */}
                        {hasUserPurchased(product.id) && (
                          <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                            ✓ Acheté
                          </div>
                        )}

                        <ProductCard
                          product={product}
                          onPurchase={handlePurchaseProduct}
                          featured={product.popular}
                          className="h-full"
                        />

                        {/* Boutons d'actions overlay */}
                        <div className="absolute top-4 left-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(product.id);
                            }}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                          >
                            {isInWishlist(product.id) ? (
                              <HeartSolid className="h-5 w-5 text-red-400" />
                            ) : (
                              <HeartIcon className="h-5 w-5 text-white" />
                            )}
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                          >
                            <ShoppingCartIcon className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                // Aucun résultat
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="glass-btn-primary px-6 py-3"
                  >
                    Voir tous les produits
                  </button>
                </motion.div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Section finale CTA */}
      <section className="mt-24 py-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre transformation G-Maxing ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez les 15,000+ personnes qui ont déjà transformé leur physique avec Engel Garcia Gomez.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const coachingProduct = GMAX_PRODUCTS.find(p => p.category === 'coaching' && p.popular);
                if (coachingProduct) handlePurchaseProduct(coachingProduct);
              }}
              className="glass-btn-primary px-8 py-4 text-lg"
            >
              Commencer le Coaching
            </button>
            <button
              onClick={() => setSelectedCategory('consultation')}
              className="glass-btn-secondary px-8 py-4 text-lg"
            >
              Consultation Gratuite
            </button>
          </div>
        </div>
      </section>

      {/* Modal de checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        product={checkoutProduct!}
        user={user}
        onSuccess={(sessionId) => {
          console.log('✅ Paiement réussi:', sessionId);
          // Rediriger vers une page de succès ou afficher une confirmation
        }}
      />
    </div>
  );
};

export default ShopPage;