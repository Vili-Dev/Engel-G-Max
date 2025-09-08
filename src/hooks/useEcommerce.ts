/**
 * Hook personnalisé pour l'e-commerce G-Maxing
 * Gestion complète des achats, abonnements et paiements Stripe
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  GMaxingProduct, 
  GMAX_PRODUCTS, 
  getProductById, 
  getProductsByCategory,
  getPopularProducts,
  initializeStripe,
  validateCoupon,
  calculateDiscount,
  DiscountCoupon
} from '../utils/ecommerce/stripeConfig';
import { useAuth } from './useAuth';
import { useAnalytics } from './useAnalytics';

interface CartItem {
  product: GMaxingProduct;
  quantity: number;
  appliedCoupon?: DiscountCoupon;
  addedAt: Date;
}

interface PurchaseHistory {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  stripeSessionId?: string;
  couponUsed?: string;
}

interface EcommerceState {
  cart: CartItem[];
  wishlist: string[];
  purchaseHistory: PurchaseHistory[];
  isLoading: boolean;
  error: string | null;
  currentCheckout: {
    product: GMaxingProduct | null;
    isOpen: boolean;
  };
}

interface UseEcommerceReturn {
  // État
  cart: CartItem[];
  wishlist: string[];
  purchaseHistory: PurchaseHistory[];
  isLoading: boolean;
  error: string | null;
  
  // Modal checkout
  checkoutProduct: GMaxingProduct | null;
  isCheckoutOpen: boolean;
  
  // Actions panier
  addToCart: (product: GMaxingProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Actions wishlist
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Actions checkout
  openCheckout: (product: GMaxingProduct) => void;
  closeCheckout: () => void;
  purchaseProduct: (product: GMaxingProduct, couponCode?: string) => Promise<boolean>;
  
  // Utilitaires produits
  getProduct: (id: string) => GMaxingProduct | undefined;
  getProductsByCategory: (category: string) => GMaxingProduct[];
  getPopularProducts: () => GMaxingProduct[];
  searchProducts: (query: string) => GMaxingProduct[];
  
  // Calculs
  getCartTotal: () => number;
  getCartItemCount: () => number;
  hasActiveSubscriptions: () => boolean;
  
  // Analytics
  getRecommendedProducts: (userId?: string) => GMaxingProduct[];
  trackProductView: (productId: string) => void;
  
  // Historique
  loadPurchaseHistory: () => void;
  getPurchasedProducts: () => string[];
  hasUserPurchased: (productId: string) => boolean;
}

export const useEcommerce = (): UseEcommerceReturn => {
  const { user } = useAuth();
  const { trackEvent, trackPurchase } = useAnalytics();

  const [state, setState] = useState<EcommerceState>({
    cart: [],
    wishlist: [],
    purchaseHistory: [],
    isLoading: false,
    error: null,
    currentCheckout: {
      product: null,
      isOpen: false
    }
  });

  // Charger les données utilisateur au montage
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Sauvegarder les données utilisateur quand elles changent
  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [state.cart, state.wishlist, user]);

  /**
   * Charger les données utilisateur depuis localStorage
   */
  const loadUserData = useCallback(() => {
    if (!user) return;

    try {
      const savedCart = localStorage.getItem(`gmax-cart-${user.uid}`);
      const savedWishlist = localStorage.getItem(`gmax-wishlist-${user.uid}`);
      const savedHistory = localStorage.getItem(`gmax-history-${user.uid}`);

      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        // Convertir les dates
        const cart = cartData.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setState(prev => ({ ...prev, cart }));
      }

      if (savedWishlist) {
        const wishlist = JSON.parse(savedWishlist);
        setState(prev => ({ ...prev, wishlist }));
      }

      if (savedHistory) {
        const historyData = JSON.parse(savedHistory);
        const purchaseHistory = historyData.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setState(prev => ({ ...prev, purchaseHistory }));
      }

      console.log('📱 Données e-commerce chargées pour:', user.uid);
    } catch (error) {
      console.warn('⚠️ Erreur chargement données e-commerce:', error);
    }
  }, [user]);

  /**
   * Sauvegarder les données utilisateur dans localStorage
   */
  const saveUserData = useCallback(() => {
    if (!user) return;

    try {
      localStorage.setItem(`gmax-cart-${user.uid}`, JSON.stringify(state.cart));
      localStorage.setItem(`gmax-wishlist-${user.uid}`, JSON.stringify(state.wishlist));
      localStorage.setItem(`gmax-history-${user.uid}`, JSON.stringify(state.purchaseHistory));
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde données e-commerce:', error);
    }
  }, [user, state.cart, state.wishlist, state.purchaseHistory]);

  /**
   * Ajouter un produit au panier
   */
  const addToCart = useCallback((product: GMaxingProduct, quantity: number = 1) => {
    setState(prev => {
      const existingItem = prev.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Mettre à jour la quantité
        return {
          ...prev,
          cart: prev.cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        // Ajouter nouveau produit
        const newItem: CartItem = {
          product,
          quantity,
          addedAt: new Date()
        };
        return {
          ...prev,
          cart: [...prev.cart, newItem]
        };
      }
    });

    // Tracker l'événement
    trackEvent({
      type: 'button_click',
      data: {
        action: 'add_to_cart',
        productId: product.id,
        productName: product.name,
        quantity
      }
    });

    console.log('🛒 Produit ajouté au panier:', product.name);
  }, [trackEvent]);

  /**
   * Retirer un produit du panier
   */
  const removeFromCart = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.product.id !== productId)
    }));
    
    console.log('🗑️ Produit retiré du panier:', productId);
  }, []);

  /**
   * Mettre à jour la quantité d'un produit dans le panier
   */
  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    }));
  }, [removeFromCart]);

  /**
   * Vider le panier
   */
  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, cart: [] }));
    console.log('🧹 Panier vidé');
  }, []);

  /**
   * Ajouter à la wishlist
   */
  const addToWishlist = useCallback((productId: string) => {
    setState(prev => {
      if (!prev.wishlist.includes(productId)) {
        return {
          ...prev,
          wishlist: [...prev.wishlist, productId]
        };
      }
      return prev;
    });
    
    trackEvent({
      type: 'button_click',
      data: {
        action: 'add_to_wishlist',
        productId
      }
    });
  }, [trackEvent]);

  /**
   * Retirer de la wishlist
   */
  const removeFromWishlist = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      wishlist: prev.wishlist.filter(id => id !== productId)
    }));
  }, []);

  /**
   * Vérifier si un produit est dans la wishlist
   */
  const isInWishlist = useCallback((productId: string): boolean => {
    return state.wishlist.includes(productId);
  }, [state.wishlist]);

  /**
   * Ouvrir le checkout pour un produit
   */
  const openCheckout = useCallback((product: GMaxingProduct) => {
    setState(prev => ({
      ...prev,
      currentCheckout: {
        product,
        isOpen: true
      }
    }));

    trackEvent({
      type: 'button_click',
      data: {
        action: 'open_checkout',
        productId: product.id,
        productName: product.name
      }
    });

    console.log('💳 Checkout ouvert pour:', product.name);
  }, [trackEvent]);

  /**
   * Fermer le checkout
   */
  const closeCheckout = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentCheckout: {
        product: null,
        isOpen: false
      }
    }));
  }, []);

  /**
   * Acheter un produit
   */
  const purchaseProduct = useCallback(async (product: GMaxingProduct, couponCode?: string): Promise<boolean> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'Vous devez être connecté pour effectuer un achat' }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('💳 Initialisation achat:', product.name);

      // Valider le coupon si fourni
      let appliedCoupon: DiscountCoupon | undefined;
      let finalPrice = product.price;

      if (couponCode) {
        const couponValidation = validateCoupon(couponCode, [product.id], product.price);
        if (couponValidation.valid && couponValidation.coupon) {
          appliedCoupon = couponValidation.coupon;
          const discountAmount = calculateDiscount(product.price, appliedCoupon);
          finalPrice = product.price - discountAmount;
          console.log('🎟️ Coupon appliqué:', couponCode, '-', discountAmount, '€');
        }
      }

      // Initialiser Stripe
      const stripe = await initializeStripe();
      if (!stripe) {
        throw new Error('Impossible d\'initialiser Stripe');
      }

      // Simuler l'appel API pour créer une session Stripe
      // En production, ceci serait un appel à votre API backend
      const sessionResponse = await simulateStripeSession({
        productId: product.id,
        userId: user.uid,
        userEmail: user.email,
        couponCode: appliedCoupon?.code,
        finalPrice
      });

      if (!sessionResponse.success) {
        throw new Error(sessionResponse.error || 'Erreur lors de la création de la session');
      }

      // Ajouter à l'historique d'achat
      const purchase: PurchaseHistory = {
        id: sessionResponse.sessionId,
        productId: product.id,
        productName: product.name,
        amount: finalPrice,
        currency: 'EUR',
        date: new Date(),
        status: 'completed',
        stripeSessionId: sessionResponse.sessionId,
        couponUsed: appliedCoupon?.code
      };

      setState(prev => ({
        ...prev,
        purchaseHistory: [purchase, ...prev.purchaseHistory],
        isLoading: false
      }));

      // Tracker l'achat
      trackPurchase(finalPrice, product.name);

      console.log('✅ Achat réussi:', product.name);
      return true;

    } catch (error) {
      console.error('❌ Erreur achat:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'achat'
      }));
      return false;
    }
  }, [user, trackPurchase]);

  /**
   * Simuler une session Stripe (remplacer par un vrai appel API en production)
   */
  const simulateStripeSession = async (data: any): Promise<{ success: boolean; sessionId?: string; error?: string }> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simuler une réussite (90% du temps)
    if (Math.random() > 0.1) {
      return {
        success: true,
        sessionId: `cs_gmax_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Erreur de paiement simulée'
      };
    }
  };

  /**
   * Obtenir un produit par ID
   */
  const getProduct = useCallback((id: string) => {
    return getProductById(id);
  }, []);

  /**
   * Rechercher des produits
   */
  const searchProducts = useCallback((query: string): GMaxingProduct[] => {
    const normalizedQuery = query.toLowerCase();
    return GMAX_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.features.some(feature => feature.toLowerCase().includes(normalizedQuery))
    );
  }, []);

  /**
   * Calculer le total du panier
   */
  const getCartTotal = useCallback((): number => {
    return state.cart.reduce((total, item) => {
      const price = item.appliedCoupon 
        ? item.product.price - calculateDiscount(item.product.price, item.appliedCoupon)
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }, [state.cart]);

  /**
   * Compter les articles dans le panier
   */
  const getCartItemCount = useCallback((): number => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  }, [state.cart]);

  /**
   * Vérifier les abonnements actifs
   */
  const hasActiveSubscriptions = useCallback((): boolean => {
    return state.purchaseHistory.some(purchase => {
      const product = getProductById(purchase.productId);
      return product?.type === 'subscription' && purchase.status === 'completed';
    });
  }, [state.purchaseHistory]);

  /**
   * Charger l'historique d'achat
   */
  const loadPurchaseHistory = useCallback(() => {
    loadUserData();
  }, [loadUserData]);

  /**
   * Obtenir les produits achetés
   */
  const getPurchasedProducts = useCallback((): string[] => {
    return state.purchaseHistory
      .filter(purchase => purchase.status === 'completed')
      .map(purchase => purchase.productId);
  }, [state.purchaseHistory]);

  /**
   * Vérifier si un utilisateur a acheté un produit
   */
  const hasUserPurchased = useCallback((productId: string): boolean => {
    return getPurchasedProducts().includes(productId);
  }, [getPurchasedProducts]);

  /**
   * Obtenir des recommandations de produits
   */
  const getRecommendedProducts = useCallback((userId?: string): GMaxingProduct[] => {
    const purchasedProducts = getPurchasedProducts();
    
    // Exclure les produits déjà achetés
    const availableProducts = GMAX_PRODUCTS.filter(product => 
      !purchasedProducts.includes(product.id)
    );
    
    // Prioriser les produits populaires
    const popularProducts = availableProducts.filter(product => product.popular);
    const otherProducts = availableProducts.filter(product => !product.popular);
    
    // Recommandations basées sur les achats précédents
    if (purchasedProducts.length > 0) {
      // Si l'utilisateur a acheté des protocoles, recommander du coaching
      const hasBoughtProtocols = purchasedProducts.some(id => {
        const product = getProductById(id);
        return product?.category === 'protocol';
      });
      
      if (hasBoughtProtocols) {
        const coachingProducts = availableProducts.filter(p => p.category === 'coaching');
        return [...coachingProducts, ...popularProducts, ...otherProducts].slice(0, 6);
      }
    }
    
    return [...popularProducts, ...otherProducts].slice(0, 6);
  }, [getPurchasedProducts]);

  /**
   * Tracker la vue d'un produit
   */
  const trackProductView = useCallback((productId: string) => {
    const product = getProductById(productId);
    if (product) {
      trackEvent({
        type: 'content_view',
        data: {
          contentType: 'product',
          contentId: productId,
          productName: product.name,
          productCategory: product.category,
          productPrice: product.price
        }
      });
    }
  }, [trackEvent]);

  // Valeurs calculées
  const cartTotal = useMemo(() => getCartTotal(), [getCartTotal]);
  const cartItemCount = useMemo(() => getCartItemCount(), [getCartItemCount]);

  return {
    // État
    cart: state.cart,
    wishlist: state.wishlist,
    purchaseHistory: state.purchaseHistory,
    isLoading: state.isLoading,
    error: state.error,
    
    // Modal checkout
    checkoutProduct: state.currentCheckout.product,
    isCheckoutOpen: state.currentCheckout.isOpen,
    
    // Actions panier
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    
    // Actions wishlist
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    
    // Actions checkout
    openCheckout,
    closeCheckout,
    purchaseProduct,
    
    // Utilitaires produits
    getProduct,
    getProductsByCategory,
    getPopularProducts,
    searchProducts,
    
    // Calculs
    getCartTotal: () => cartTotal,
    getCartItemCount: () => cartItemCount,
    hasActiveSubscriptions,
    
    // Analytics
    getRecommendedProducts,
    trackProductView,
    
    // Historique
    loadPurchaseHistory,
    getPurchasedProducts,
    hasUserPurchased
  };
};

export default useEcommerce;