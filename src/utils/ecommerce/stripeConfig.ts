/**
 * Configuration Stripe pour la plateforme G-Maxing
 * Gestion des paiements et abonnements pour Engel Garcia Gomez
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Clés Stripe (à configurer dans les variables d'environnement)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here';

// Instance Stripe
let stripeInstance: Stripe | null = null;

/**
 * Initialiser Stripe
 */
export const initializeStripe = async (): Promise<Stripe | null> => {
  if (!stripeInstance) {
    try {
      stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY, {
        locale: 'fr', // Interface en français
        apiVersion: '2023-10-16'
      });
      console.log('💳 Stripe initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation Stripe:', error);
    }
  }
  return stripeInstance;
};

/**
 * Obtenir l'instance Stripe
 */
export const getStripe = (): Stripe | null => {
  return stripeInstance;
};

// Configuration des produits G-Maxing
export interface GMaxingProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'one-time' | 'subscription';
  category: 'coaching' | 'protocol' | 'consultation' | 'premium' | 'clothing' | 'manga';
  features: string[];
  stripePriceId: string;
  stripeProductId: string;
  popular?: boolean;
  discount?: number;
  duration?: string;
  maxClients?: number;
  includes: string[];
  image?: string;
  testimonials?: Array<{
    name: string;
    text: string;
    rating: number;
  }>;
}

// Catalogue produits Engel Garcia Gomez
export const GMAX_PRODUCTS: GMaxingProduct[] = [
  // Coaching Personnel Premium
  {
    id: 'coaching-premium-3m',
    name: 'Coaching G-Maxing Premium - 3 Mois',
    description: 'Coaching personnel 1-on-1 avec Engel Garcia Gomez. Transformation physique garantie avec la méthode G-Maxing exclusive.',
    price: 2997,
    currency: 'EUR',
    type: 'one-time',
    category: 'coaching',
    stripePriceId: 'price_coaching_premium_3m',
    stripeProductId: 'prod_coaching_premium',
    popular: true,
    duration: '3 mois',
    maxClients: 10,
    features: [
      'Sessions 1-on-1 avec Engel Garcia Gomez',
      'Protocole G-Maxing 100% personnalisé',
      'Suivi quotidien via WhatsApp',
      'Plan nutrition sur-mesure',
      'Ajustements en temps réel',
      'Accès groupe VIP exclusif',
      'Garantie résultats ou remboursé'
    ],
    includes: [
      '12 sessions coaching vidéo (1h)',
      'Protocole entrainement personnalisé',
      'Plan nutrition détaillé',
      'Suivi quotidien 90 jours',
      'Accès communauté premium',
      'Certificat G-Maxing'
    ],
    testimonials: [
      {
        name: 'Marc D.',
        text: 'Transformation incroyable en 3 mois ! -15kg et +8kg de muscle avec Engel.',
        rating: 5
      },
      {
        name: 'Sophie L.',
        text: 'La méthode G-Maxing a changé ma vie. Engel est un coach exceptionnel.',
        rating: 5
      }
    ]
  },

  // Coaching Groupe
  {
    id: 'coaching-groupe-6m',
    name: 'Coaching G-Maxing Groupe - 6 Mois',
    description: 'Programme de coaching en groupe avec Engel Garcia Gomez. Apprenez la méthode G-Maxing avec une communauté motivée.',
    price: 997,
    currency: 'EUR',
    type: 'one-time',
    category: 'coaching',
    stripePriceId: 'price_coaching_groupe_6m',
    stripeProductId: 'prod_coaching_groupe',
    duration: '6 mois',
    maxClients: 50,
    features: [
      'Sessions groupe hebdomadaires',
      'Protocoles G-Maxing adaptés',
      'Communauté exclusive',
      'Support continu',
      'Masterclass mensuelles',
      'Challenges et défis'
    ],
    includes: [
      '24 sessions groupe (1h)',
      'Protocoles G-Maxing évolutifs',
      'Accès plateforme premium',
      'Communauté privée',
      '6 masterclass bonus',
      'Suivi progressions'
    ]
  },

  // Consultation Unique
  {
    id: 'consultation-gmax',
    name: 'Consultation G-Maxing - Session Unique',
    description: 'Consultation individuelle avec Engel Garcia Gomez pour analyser votre situation et créer votre roadmap G-Maxing.',
    price: 297,
    currency: 'EUR',
    type: 'one-time',
    category: 'consultation',
    stripePriceId: 'price_consultation_gmax',
    stripeProductId: 'prod_consultation',
    duration: '1 session',
    features: [
      'Session 1-on-1 (90 minutes)',
      'Analyse complète de votre profil',
      'Roadmap G-Maxing personnalisée',
      'Recommandations prioritaires',
      'Support 7 jours post-session'
    ],
    includes: [
      'Session vidéo 90 minutes',
      'Analyse morphologique',
      'Plan d\'action détaillé',
      'Ressources personnalisées',
      'Enregistrement session',
      'Support 7 jours'
    ]
  },

  // Protocoles Premium
  {
    id: 'protocoles-premium-pack',
    name: 'Pack Protocoles G-Maxing Premium',
    description: 'Collection complète des protocoles G-Maxing d\'Engel Garcia Gomez. Tous les secrets pour maximiser votre génétique.',
    price: 197,
    currency: 'EUR',
    type: 'one-time',
    category: 'protocol',
    stripePriceId: 'price_protocoles_premium',
    stripeProductId: 'prod_protocoles_premium',
    features: [
      '8 protocoles G-Maxing complets',
      'Guides nutrition avancés',
      'Techniques récupération',
      'Vidéos explicatives',
      'Mises à jour à vie',
      'Support communauté'
    ],
    includes: [
      '8 protocoles PDF détaillés',
      '12 vidéos techniques',
      '4 plans nutrition',
      'Guide supplémentation',
      'Templates Excel tracking',
      'Accès mises à jour'
    ]
  },

  // Abonnement Premium Mensuel
  {
    id: 'premium-monthly',
    name: 'G-Maxing Premium - Mensuel',
    description: 'Accès complet à tous les contenus G-Maxing, protocoles exclusifs et communauté premium.',
    price: 47,
    currency: 'EUR',
    type: 'subscription',
    category: 'premium',
    stripePriceId: 'price_premium_monthly',
    stripeProductId: 'prod_premium_subscription',
    popular: true,
    features: [
      'Tous les protocoles G-Maxing',
      'Nouveaux contenus chaque semaine',
      'Communauté premium',
      'Sessions Q&A mensuelles',
      'Support prioritaire',
      'Outils et calculateurs avancés'
    ],
    includes: [
      'Protocoles illimités',
      'Contenus exclusifs',
      'Communauté VIP',
      'Sessions live mensuelles',
      'Support premium',
      'Outils avancés'
    ]
  },

  // Vêtements de Sport G-Maxing
  {
    id: 'tshirt-gmax-classic',
    name: 'T-Shirt G-Maxing Classic',
    description: 'T-shirt premium en coton bio avec le logo G-Maxing. Parfait pour vos séances d\'entraînement.',
    price: 29,
    currency: 'EUR',
    type: 'one-time',
    category: 'clothing',
    stripePriceId: 'price_tshirt_classic',
    stripeProductId: 'prod_tshirt_classic',
    features: [
      '100% coton bio certifié',
      'Coupe moderne et confortable',
      'Logo G-Maxing brodé',
      'Résistant aux lavages',
      'Disponible en plusieurs tailles'
    ],
    includes: [
      'T-shirt premium qualité',
      'Emballage écologique',
      'Guide d\'entretien',
      'Sticker G-Maxing offert'
    ]
  },

  {
    id: 'debardeur-gmax-performance',
    name: 'Débardeur G-Maxing Performance',
    description: 'Débardeur technique respirant pour des entraînements intensifs. Design moderne inspiré du fitness.',
    price: 25,
    currency: 'EUR',
    type: 'one-time',
    category: 'clothing',
    stripePriceId: 'price_debardeur_performance',
    stripeProductId: 'prod_debardeur_performance',
    popular: true,
    features: [
      'Tissu technique respirant',
      'Séchage rapide',
      'Coupe athlétique',
      'Design G-Maxing moderne',
      'Idéal musculation'
    ],
    includes: [
      'Débardeur technique',
      'Emballage premium',
      'Guide d\'entraînement bonus'
    ]
  },

  {
    id: 'short-gmax-training',
    name: 'Short G-Maxing Training',
    description: 'Short d\'entraînement avec poches pratiques. Confort optimal pour vos séances G-Maxing.',
    price: 35,
    currency: 'EUR',
    type: 'one-time',
    category: 'clothing',
    stripePriceId: 'price_short_training',
    stripeProductId: 'prod_short_training',
    features: [
      'Tissu stretch 4-way',
      '2 poches latérales',
      'Poche téléphone sécurisée',
      'Taille élastique confortable',
      'Longueur optimale'
    ],
    includes: [
      'Short technique premium',
      'Cordon de serrage inclus',
      'Emballage écologique'
    ]
  },

  // Collection Manga Style
  {
    id: 'tshirt-manga-warrior',
    name: 'T-Shirt Manga Warrior',
    description: 'T-shirt style manga avec design guerrier inspiré des animes. Pour les passionnés de culture japonaise.',
    price: 32,
    currency: 'EUR',
    type: 'one-time',
    category: 'manga',
    stripePriceId: 'price_tshirt_manga_warrior',
    stripeProductId: 'prod_tshirt_manga_warrior',
    features: [
      'Design manga original',
      'Impression haute qualité',
      'Style streetwear japonais',
      'Coton premium 220g/m²',
      'Couleurs vives durables'
    ],
    includes: [
      'T-shirt design exclusif',
      'Carte postale manga offerte',
      'Emballage collector'
    ]
  },

  {
    id: 'hoodie-anime-champion',
    name: 'Hoodie Anime Champion',
    description: 'Sweat à capuche style anime avec motifs inspirés des champions. Confort et style réunis.',
    price: 55,
    currency: 'EUR',
    type: 'one-time',
    category: 'manga',
    stripePriceId: 'price_hoodie_anime_champion',
    stripeProductId: 'prod_hoodie_anime_champion',
    popular: true,
    features: [
      'Capuche doublée',
      'Poche kangourou',
      'Design anime exclusif',
      'Molleton épais 300g/m²',
      'Finitions japonaises'
    ],
    includes: [
      'Hoodie premium',
      'Pins collector offerts',
      'Stickers manga pack',
      'Emballage cadeau'
    ]
  },

  {
    id: 'casquette-manga-style',
    name: 'Casquette Manga Style',
    description: 'Casquette snapback avec broderies manga. Accessoire parfait pour les fans d\'anime.',
    price: 22,
    currency: 'EUR',
    type: 'one-time',
    category: 'manga',
    stripePriceId: 'price_casquette_manga',
    stripeProductId: 'prod_casquette_manga',
    features: [
      'Visière plate moderne',
      'Broderie manga 3D',
      'Système snapback ajustable',
      'Matières premium',
      'Design street japonais'
    ],
    includes: [
      'Casquette ajustable',
      'Boîte de protection',
      'Autocollants bonus'
    ]
  }
];

/**
 * Configuration des webhooks Stripe
 */
export const STRIPE_WEBHOOK_EVENTS = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'checkout.session.completed'
];

/**
 * Types de paiement supportés
 */
export const SUPPORTED_PAYMENT_METHODS = [
  'card',
  'sepa_debit',
  'ideal',
  'bancontact',
  'giropay',
  'sofort',
  'paypal'
];

/**
 * Configuration des métadonnées pour chaque produit
 */
export const getProductMetadata = (product: GMaxingProduct, userId?: string) => {
  return {
    product_id: product.id,
    product_name: product.name,
    product_type: product.type,
    product_category: product.category,
    coach: 'Engel Garcia Gomez',
    method: 'G-Maxing',
    user_id: userId || 'anonymous',
    platform: 'EngelGMax.com',
    version: '1.0'
  };
};

/**
 * Configuration des options de checkout Stripe
 */
export const getCheckoutOptions = (
  product: GMaxingProduct,
  userId?: string,
  userEmail?: string,
  successUrl?: string,
  cancelUrl?: string
) => {
  const metadata = getProductMetadata(product, userId);
  
  return {
    mode: product.type === 'subscription' ? 'subscription' : 'payment',
    payment_method_types: SUPPORTED_PAYMENT_METHODS,
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    metadata,
    success_url: successUrl || `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${window.location.origin}/shop`,
    customer_email: userEmail,
    locale: 'fr',
    billing_address_collection: 'required',
    shipping_address_collection: product.category === 'coaching' ? undefined : {
      allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC']
    },
    phone_number_collection: {
      enabled: true,
    },
    custom_text: {
      submit: {
        message: 'Commencer ma transformation G-Maxing avec Engel Garcia Gomez'
      }
    },
    invoice_creation: {
      enabled: true,
    },
    payment_intent_data: {
      metadata,
      description: `${product.name} - Coaching G-Maxing avec Engel Garcia Gomez`,
    },
    subscription_data: product.type === 'subscription' ? {
      metadata,
      description: `Abonnement G-Maxing Premium - Engel Garcia Gomez`
    } : undefined
  };
};

/**
 * Calculer le prix avec réduction éventuelle
 */
export const calculateDiscountedPrice = (product: GMaxingProduct): number => {
  if (product.discount) {
    return product.price * (1 - product.discount / 100);
  }
  return product.price;
};

/**
 * Formater le prix pour l'affichage
 */
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Obtenir la TVA applicable (France)
 */
export const getTaxRate = (productCategory: string): number => {
  switch (productCategory) {
    case 'coaching':
    case 'consultation':
      return 0; // Exonéré en tant que formation
    case 'protocol':
    case 'premium':
      return 0.20; // 20% TVA normale
    default:
      return 0.20;
  }
};

/**
 * Calculer le prix TTC
 */
export const calculatePriceWithTax = (price: number, category: string): number => {
  const taxRate = getTaxRate(category);
  return price * (1 + taxRate);
};

/**
 * Vérifier si un produit est disponible
 */
export const isProductAvailable = (product: GMaxingProduct): boolean => {
  if (product.maxClients) {
    // En production, vérifier la base de données pour le nombre de clients actuels
    // Pour la démo, considérer tous les produits comme disponibles
    return true;
  }
  return true;
};

/**
 * Obtenir les produits par catégorie
 */
export const getProductsByCategory = (category: string): GMaxingProduct[] => {
  return GMAX_PRODUCTS.filter(product => product.category === category);
};

/**
 * Obtenir les produits populaires
 */
export const getPopularProducts = (): GMaxingProduct[] => {
  return GMAX_PRODUCTS.filter(product => product.popular);
};

/**
 * Rechercher un produit par ID
 */
export const getProductById = (id: string): GMaxingProduct | undefined => {
  return GMAX_PRODUCTS.find(product => product.id === id);
};

/**
 * Configuration des coupons de réduction
 */
export interface DiscountCoupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  validUntil?: Date;
  applicableProducts?: string[];
  maxUses?: number;
  currentUses?: number;
  minAmount?: number;
}

// Coupons promotionnels G-Maxing
export const GMAX_COUPONS: DiscountCoupon[] = [
  {
    code: 'GMAX20',
    description: '20% de réduction sur tous les protocoles',
    discountType: 'percentage',
    discountValue: 20,
    applicableProducts: ['protocoles-premium-pack'],
    maxUses: 100,
    currentUses: 0
  },
  {
    code: 'ENGEL50',
    description: '50€ de réduction sur le coaching premium',
    discountType: 'amount',
    discountValue: 50,
    applicableProducts: ['coaching-premium-3m', 'coaching-groupe-6m'],
    minAmount: 500,
    maxUses: 50,
    currentUses: 0
  },
  {
    code: 'FIRST10',
    description: '10% de réduction pour les nouveaux clients',
    discountType: 'percentage',
    discountValue: 10,
    maxUses: 500,
    currentUses: 0
  }
];

/**
 * Valider un coupon de réduction
 */
export const validateCoupon = (
  couponCode: string, 
  productIds: string[], 
  totalAmount: number
): { valid: boolean; coupon?: DiscountCoupon; error?: string } => {
  const coupon = GMAX_COUPONS.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
  
  if (!coupon) {
    return { valid: false, error: 'Coupon non trouvé' };
  }
  
  if (coupon.validUntil && new Date() > coupon.validUntil) {
    return { valid: false, error: 'Coupon expiré' };
  }
  
  if (coupon.maxUses && (coupon.currentUses || 0) >= coupon.maxUses) {
    return { valid: false, error: 'Coupon épuisé' };
  }
  
  if (coupon.minAmount && totalAmount < coupon.minAmount) {
    return { valid: false, error: `Montant minimum ${formatPrice(coupon.minAmount)} requis` };
  }
  
  if (coupon.applicableProducts) {
    const hasApplicableProduct = productIds.some(id => 
      coupon.applicableProducts!.includes(id)
    );
    if (!hasApplicableProduct) {
      return { valid: false, error: 'Coupon non applicable à ces produits' };
    }
  }
  
  return { valid: true, coupon };
};

/**
 * Calculer la réduction appliquée
 */
export const calculateDiscount = (
  amount: number, 
  coupon: DiscountCoupon
): number => {
  if (coupon.discountType === 'percentage') {
    return amount * (coupon.discountValue / 100);
  } else {
    return Math.min(coupon.discountValue, amount);
  }
};

export default {
  initializeStripe,
  getStripe,
  GMAX_PRODUCTS,
  getProductById,
  getProductsByCategory,
  getPopularProducts,
  formatPrice,
  calculateDiscountedPrice,
  calculatePriceWithTax,
  isProductAvailable,
  validateCoupon,
  calculateDiscount,
  getCheckoutOptions,
  getProductMetadata
};