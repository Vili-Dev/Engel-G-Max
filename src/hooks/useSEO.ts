/**
 * Hook SEO pour Engel Garcia Gomez
 * Gestion complète du SEO et des données structurées
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { schemaEngine } from '../utils/seo/schemaEngine';
import { useAnalytics } from './useAnalytics';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  author?: string;
  publishedAt?: Date;
  modifiedAt?: Date;
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  alternates?: Array<{
    lang: string;
    href: string;
  }>;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  article?: {
    content: string;
    category: string;
    tags: string[];
    readingTime: number;
    slug: string;
  };
  product?: {
    name: string;
    price: number;
    currency: string;
    images: string[];
    category: string;
    rating?: number;
    reviewCount?: number;
    reviews?: Array<{
      author: string;
      rating: number;
      comment: string;
      date: Date;
    }>;
  };
  service?: {
    name: string;
    price?: number;
    currency?: string;
    category: string;
  };
}

export const useSEO = (config: SEOConfig) => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Construire le titre complet avec branding Engel Garcia Gomez
    const fullTitle = config.title.includes('Engel Garcia Gomez') 
      ? config.title 
      : `${config.title} | Engel Garcia Gomez - Méthode G-Maxing`;

    // Enrichir la description avec des mots-clés SEO
    let enrichedDescription = config.description;
    if (!config.description.includes('Engel Garcia Gomez')) {
      enrichedDescription = `${config.description} Découvrez la méthode G-Maxing d'Engel Garcia Gomez.`;
    }

    // Keywords par défaut optimisés pour Engel Garcia Gomez
    const defaultKeywords = [
      'Engel Garcia Gomez',
      'G-Maxing',
      'méthode G-Maxing',
      'transformation physique',
      'coaching fitness',
      'développement personnel',
      'nutrition optimisée',
      'entraînement fonctionnel'
    ];

    const finalKeywords = config.keywords 
      ? `${config.keywords}, ${defaultKeywords.join(', ')}`
      : defaultKeywords.join(', ');

    // URL canonique
    const canonicalUrl = config.canonical || `https://engelgmax.com${location.pathname}`;

    // Image par défaut
    const defaultImage = 'https://engelgmax.com/images/engel-garcia-gomez-og-image.jpg';
    const finalImage = config.image || defaultImage;

    // Mettre à jour les meta tags
    schemaEngine.updateMetaTags({
      title: fullTitle,
      description: enrichedDescription,
      keywords: finalKeywords,
      image: finalImage,
      url: canonicalUrl,
      type: config.type || 'website',
      author: config.author || 'Engel Garcia Gomez',
      publishedAt: config.publishedAt,
      modifiedAt: config.modifiedAt
    });

    // Gérer les directives robots
    updateRobotsDirectives(config.noIndex, config.noFollow);

    // URL canonique
    updateCanonicalUrl(canonicalUrl);

    // Liens alternates (multilingue)
    updateAlternateLinks(config.alternates);

    // Générer et injecter les schémas JSON-LD
    generateAndInjectSchemas(config, location.pathname);

    // Tracker la page vue avec informations SEO
    trackPageView(location.pathname, {
      page_title: fullTitle,
      page_type: config.type || 'website',
      isEngelGarciaGomezPage: true,
      seoOptimized: true
    });

    console.log('🔍 SEO configuré pour:', fullTitle);

  }, [config, location.pathname, trackPageView]);

  return {
    updateSEO: (newConfig: Partial<SEOConfig>) => {
      // Permettre la mise à jour dynamique du SEO
      console.log('🔄 Mise à jour SEO dynamique');
    }
  };
};

// Fonctions utilitaires privées

const updateRobotsDirectives = (noIndex?: boolean, noFollow?: boolean) => {
  let robotsContent = 'index,follow';
  
  if (noIndex && noFollow) {
    robotsContent = 'noindex,nofollow';
  } else if (noIndex) {
    robotsContent = 'noindex,follow';
  } else if (noFollow) {
    robotsContent = 'index,nofollow';
  }

  let robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
  if (!robotsTag) {
    robotsTag = document.createElement('meta');
    robotsTag.name = 'robots';
    document.head.appendChild(robotsTag);
  }
  robotsTag.content = robotsContent;
};

const updateCanonicalUrl = (url: string) => {
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = url;
};

const updateAlternateLinks = (alternates?: Array<{lang: string; href: string}>) => {
  // Supprimer les anciens liens alternates
  const existingAlternates = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingAlternates.forEach(link => link.remove());

  // Ajouter les nouveaux
  if (alternates) {
    alternates.forEach(alt => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alt.lang;
      link.href = alt.href;
      document.head.appendChild(link);
    });
  }

  // Ajouter les alternates par défaut pour Engel Garcia Gomez
  const defaultAlternates = [
    { lang: 'fr', href: `https://engelgmax.com${window.location.pathname}` },
    { lang: 'en', href: `https://engelgmax.com/en${window.location.pathname}` },
    { lang: 'es', href: `https://engelgmax.com/es${window.location.pathname}` },
    { lang: 'x-default', href: `https://engelgmax.com${window.location.pathname}` }
  ];

  if (!alternates) {
    defaultAlternates.forEach(alt => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alt.lang;
      link.href = alt.href;
      document.head.appendChild(link);
    });
  }
};

const generateAndInjectSchemas = (config: SEOConfig, pathname: string) => {
  const schemas: string[] = [];

  // Schémas selon la page
  switch (pathname) {
    case '/':
      schemas.push(...schemaEngine.getHomePageSchemas());
      break;
      
    case '/about':
      schemas.push(...schemaEngine.getAboutPageSchemas());
      break;
      
    case '/coaching':
      schemas.push(...schemaEngine.getCoachingPageSchemas());
      break;
      
    case '/blog':
      schemas.push(...schemaEngine.getBlogPageSchemas());
      break;
      
    default:
      // Schémas de base pour toutes les pages
      schemas.push(
        JSON.stringify(schemaEngine.generateOrganizationSchema(), null, 2),
        JSON.stringify(schemaEngine.generatePersonSchema(), null, 2)
      );
  }

  // Breadcrumbs
  if (config.breadcrumbs) {
    schemas.push(
      JSON.stringify(schemaEngine.generateBreadcrumbSchema(config.breadcrumbs), null, 2)
    );
  }

  // Article
  if (config.type === 'article' && config.article) {
    const articleData = {
      title: config.title,
      description: config.description,
      content: config.article.content,
      publishedAt: config.publishedAt || new Date(),
      updatedAt: config.modifiedAt,
      image: config.image,
      slug: config.article.slug,
      category: config.article.category,
      tags: config.article.tags,
      readingTime: config.article.readingTime,
      author: config.author || 'Engel Garcia Gomez'
    };
    
    schemas.push(
      JSON.stringify(schemaEngine.generateArticleSchema(articleData), null, 2)
    );
  }

  // Product
  if (config.type === 'product' && config.product) {
    schemas.push(
      JSON.stringify(schemaEngine.generateProductSchema({
        name: config.product.name,
        description: config.description,
        price: config.product.price,
        currency: config.product.currency,
        images: config.product.images,
        category: config.product.category,
        rating: config.product.rating,
        reviewCount: config.product.reviewCount,
        reviews: config.product.reviews
      }), null, 2)
    );
  }

  // Service
  if (config.type === 'service' && config.service) {
    schemas.push(
      JSON.stringify(schemaEngine.generateServiceSchema({
        name: config.service.name,
        description: config.description,
        price: config.service.price,
        currency: config.service.currency,
        category: config.service.category
      }), null, 2)
    );
  }

  // FAQ
  if (config.faq) {
    schemas.push(
      JSON.stringify(schemaEngine.generateFAQSchema(config.faq), null, 2)
    );
  } else if (pathname.includes('gmax') || pathname.includes('engel')) {
    // FAQ par défaut G-Maxing
    schemas.push(schemaEngine.getGMaxingFAQSchema());
  }

  // Injecter tous les schémas
  schemaEngine.injectSchemas(schemas);
};

// Hook spécialisés pour différents types de contenu

export const useSEOArticle = (article: {
  title: string;
  description: string;
  content: string;
  slug: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt: Date;
  updatedAt?: Date;
  image?: string;
  author?: string;
}) => {
  const seoConfig: SEOConfig = {
    title: article.title,
    description: article.description,
    type: 'article',
    author: article.author || 'Engel Garcia Gomez',
    publishedAt: article.publishedAt,
    modifiedAt: article.updatedAt,
    image: article.image,
    keywords: [...article.tags, 'Engel Garcia Gomez', 'G-Maxing'].join(', '),
    breadcrumbs: [
      { name: 'Accueil', url: 'https://engelgmax.com' },
      { name: 'Blog G-Maxing', url: 'https://engelgmax.com/blog' },
      { name: article.title, url: `https://engelgmax.com/blog/${article.slug}` }
    ],
    article: {
      content: article.content,
      category: article.category,
      tags: article.tags,
      readingTime: article.readingTime,
      slug: article.slug
    }
  };

  return useSEO(seoConfig);
};

export const useSEOProduct = (product: {
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  rating?: number;
  reviewCount?: number;
  reviews?: any[];
}) => {
  const seoConfig: SEOConfig = {
    title: `${product.name} - Engel Garcia Gomez`,
    description: product.description,
    type: 'product',
    image: product.images[0],
    keywords: `${product.name}, Engel Garcia Gomez, G-Maxing, ${product.category}`,
    breadcrumbs: [
      { name: 'Accueil', url: 'https://engelgmax.com' },
      { name: 'Boutique G-Max', url: 'https://engelgmax.com/shop' },
      { name: product.name, url: `https://engelgmax.com/shop/product` }
    ],
    product
  };

  return useSEO(seoConfig);
};

export const useSEOService = (service: {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  category: string;
}) => {
  const seoConfig: SEOConfig = {
    title: `${service.name} - Coaching G-Maxing Engel Garcia Gomez`,
    description: service.description,
    type: 'service',
    keywords: `${service.name}, coaching, Engel Garcia Gomez, G-Maxing, ${service.category}`,
    breadcrumbs: [
      { name: 'Accueil', url: 'https://engelgmax.com' },
      { name: 'Coaching G-Maxing', url: 'https://engelgmax.com/coaching' },
      { name: service.name, url: 'https://engelgmax.com/coaching/service' }
    ],
    service
  };

  return useSEO(seoConfig);
};

export default useSEO;