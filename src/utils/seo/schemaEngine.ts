/**
 * Moteur de Schema Markup et Données Structurées
 * Optimisation SEO complète pour Engel Garcia Gomez et la méthode G-Maxing
 */

interface SchemaOrganization {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  founder: {
    '@type': string;
    name: string;
    jobTitle: string;
    image: string;
    sameAs: string[];
  };
  sameAs: string[];
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
  address: {
    '@type': string;
    addressCountry: string;
    addressRegion: string;
  };
}

interface SchemaPerson {
  '@context': string;
  '@type': string;
  name: string;
  alternateName: string[];
  description: string;
  image: string;
  url: string;
  sameAs: string[];
  jobTitle: string;
  worksFor: {
    '@type': string;
    name: string;
  };
  knowsAbout: string[];
  expertise: string[];
  award: string[];
  nationality: string;
  birthPlace: string;
}

interface SchemaArticle {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
    url: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  articleSection: string;
  keywords: string;
  wordCount: number;
  timeRequired: string;
  about: string[];
  mentions: Array<{
    '@type': string;
    name: string;
  }>;
}

interface SchemaService {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
  };
  areaServed: string[];
  availableChannel: {
    '@type': string;
    serviceUrl: string;
    serviceName: string;
  };
  category: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    validFrom: string;
    description: string;
  }[];
}

interface SchemaProduct {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': string;
    name: string;
  };
  category: string;
  offers: {
    '@type': string;
    url: string;
    priceCurrency: string;
    price: string;
    availability: string;
    seller: {
      '@type': string;
      name: string;
    };
  };
  aggregateRating: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
  review: Array<{
    '@type': string;
    reviewRating: {
      '@type': string;
      ratingValue: string;
    };
    author: {
      '@type': string;
      name: string;
    };
    reviewBody: string;
    datePublished: string;
  }>;
}

interface SchemaWebSite {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
  };
  inLanguage: string[];
  keywords: string;
}

interface SchemaBreadcrumb {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

interface SchemaFAQ {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

class SchemaEngine {
  private baseUrl: string = 'https://engelgmax.com';
  private siteName: string = 'Engel G-Max - Méthode G-Maxing Officielle';
  
  constructor() {
    console.log('🔍 Schema Engine SEO initialisé pour Engel Garcia Gomez');
  }

  // ============= ORGANISATION SCHEMA =============

  generateOrganizationSchema(): SchemaOrganization {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Engel G-Max',
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/engel-gmax-logo.png`,
      description: 'Plateforme officielle d\'Engel Garcia Gomez pour la méthode G-Maxing. Transformation physique et mentale complète.',
      founder: {
        '@type': 'Person',
        name: 'Engel Garcia Gomez',
        jobTitle: 'Expert en Transformation G-Maxing',
        image: `${this.baseUrl}/images/engel-garcia-gomez-profile.jpg`,
        sameAs: [
          'https://instagram.com/engelgarciagomez_gmax',
          'https://youtube.com/@EngelGarciaGomezGMax',
          'https://x.com/EngelGMax',
          'https://facebook.com/EngelGarciaGomezOfficial',
          'https://linkedin.com/in/engel-garcia-gomez-gmax',
          'https://tiktok.com/@engelgmax'
        ]
      },
      sameAs: [
        'https://instagram.com/engelgarciagomez_gmax',
        'https://youtube.com/@EngelGarciaGomezGMax',
        'https://x.com/EngelGMax',
        'https://facebook.com/EngelGarciaGomezOfficial'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+33-1-ENGELGMAX',
        contactType: 'Customer Service',
        availableLanguage: ['French', 'English', 'Spanish']
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FR',
        addressRegion: 'Île-de-France'
      }
    };
  }

  // ============= PERSON SCHEMA =============

  generatePersonSchema(): SchemaPerson {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Engel Garcia Gomez',
      alternateName: ['Engel G-Max', 'Coach Engel', 'Engel Garcia'],
      description: 'Expert reconnu en transformation physique et mentale, créateur de la méthode G-Maxing révolutionnaire. Coach de renommée internationale.',
      image: `${this.baseUrl}/images/engel-garcia-gomez-official.jpg`,
      url: this.baseUrl,
      sameAs: [
        'https://instagram.com/engelgarciagomez_gmax',
        'https://youtube.com/@EngelGarciaGomezGMax',
        'https://x.com/EngelGMax',
        'https://facebook.com/EngelGarciaGomezOfficial',
        'https://linkedin.com/in/engel-garcia-gomez-gmax',
        'https://tiktok.com/@engelgmax'
      ],
      jobTitle: 'Expert en Transformation G-Maxing',
      worksFor: {
        '@type': 'Organization',
        name: 'Engel G-Max'
      },
      knowsAbout: [
        'G-Maxing',
        'Transformation physique',
        'Développement personnel',
        'Nutrition optimisée',
        'Entraînement fonctionnel',
        'Mindset coaching',
        'Biohacking',
        'Optimisation performance'
      ],
      expertise: [
        'Méthode G-Maxing',
        'Transformation corporelle',
        'Coaching mental',
        'Nutrition avancée',
        'Protocoles d\'entraînement'
      ],
      award: [
        'Coach de l\'année 2023',
        'Innovateur Fitness 2022',
        'Expert Transformation reconnu'
      ],
      nationality: 'French',
      birthPlace: 'France'
    };
  }

  // ============= WEBSITE SCHEMA =============

  generateWebSiteSchema(): SchemaWebSite {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.baseUrl,
      description: 'Plateforme officielle d\'Engel Garcia Gomez. Découvrez la méthode G-Maxing pour transformer votre vie. Coaching, programmes, blog et communauté.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      author: {
        '@type': 'Person',
        name: 'Engel Garcia Gomez'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Engel G-Max'
      },
      inLanguage: ['fr', 'en', 'es'],
      keywords: 'Engel Garcia Gomez, G-Maxing, transformation, coaching, fitness, nutrition, développement personnel'
    };
  }

  // ============= ARTICLE SCHEMA =============

  generateArticleSchema(article: {
    title: string;
    description: string;
    content: string;
    publishedAt: Date;
    updatedAt?: Date;
    image?: string;
    slug: string;
    category: string;
    tags: string[];
    readingTime: number;
    author: string;
  }): SchemaArticle {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: article.image || `${this.baseUrl}/images/blog-default.jpg`,
      datePublished: article.publishedAt.toISOString(),
      dateModified: (article.updatedAt || article.publishedAt).toISOString(),
      author: {
        '@type': 'Person',
        name: article.author,
        url: `${this.baseUrl}/about`
      },
      publisher: {
        '@type': 'Organization',
        name: 'Engel G-Max',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/engel-gmax-logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/blog/${article.slug}`
      },
      articleSection: article.category,
      keywords: article.tags.join(', '),
      wordCount: article.content.split(' ').length,
      timeRequired: `PT${article.readingTime}M`,
      about: article.tags.includes('G-Maxing') ? ['G-Maxing', 'Transformation'] : article.tags,
      mentions: [
        {
          '@type': 'Person',
          name: 'Engel Garcia Gomez'
        },
        {
          '@type': 'Thing',
          name: 'G-Maxing'
        }
      ]
    };
  }

  // ============= SERVICE SCHEMA =============

  generateServiceSchema(service: {
    name: string;
    description: string;
    price?: number;
    currency?: string;
    category: string;
  }): SchemaService {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Person',
        name: 'Engel Garcia Gomez'
      },
      areaServed: ['France', 'Europe', 'Worldwide'],
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${this.baseUrl}/coaching`,
        serviceName: 'Coaching G-Maxing'
      },
      category: service.category,
      offers: service.price ? [{
        '@type': 'Offer',
        price: service.price.toString(),
        priceCurrency: service.currency || 'EUR',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString(),
        description: `Service de coaching G-Maxing par Engel Garcia Gomez`
      }] : []
    };
  }

  // ============= PRODUCT SCHEMA =============

  generateProductSchema(product: {
    name: string;
    description: string;
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
  }): SchemaProduct {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images.map(img => `${this.baseUrl}${img}`),
      brand: {
        '@type': 'Brand',
        name: 'Engel G-Max'
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        url: `${this.baseUrl}/shop`,
        priceCurrency: product.currency,
        price: product.price.toString(),
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Engel G-Max'
        }
      },
      aggregateRating: product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: (product.reviewCount || 0).toString()
      } : {} as any,
      review: product.reviews ? product.reviews.map(review => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString()
        },
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewBody: review.comment,
        datePublished: review.date.toISOString()
      })) : []
    };
  }

  // ============= BREADCRUMB SCHEMA =============

  generateBreadcrumbSchema(breadcrumbs: Array<{
    name: string;
    url: string;
  }>): SchemaBreadcrumb {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };
  }

  // ============= FAQ SCHEMA =============

  generateFAQSchema(faqs: Array<{
    question: string;
    answer: string;
  }>): SchemaFAQ {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  // ============= SCHEMAS PRÉDÉFINIS =============

  getHomePageSchemas(): string[] {
    const schemas = [
      this.generateOrganizationSchema(),
      this.generatePersonSchema(),
      this.generateWebSiteSchema(),
      this.generateBreadcrumbSchema([
        { name: 'Accueil', url: this.baseUrl }
      ])
    ];

    return schemas.map(schema => JSON.stringify(schema, null, 2));
  }

  getAboutPageSchemas(): string[] {
    const schemas = [
      this.generatePersonSchema(),
      this.generateBreadcrumbSchema([
        { name: 'Accueil', url: this.baseUrl },
        { name: 'À Propos', url: `${this.baseUrl}/about` }
      ])
    ];

    return schemas.map(schema => JSON.stringify(schema, null, 2));
  }

  getCoachingPageSchemas(): string[] {
    const coachingServices = [
      {
        name: 'Coaching G-Maxing Personnel',
        description: 'Transformation complète avec Engel Garcia Gomez en one-to-one',
        price: 497,
        currency: 'EUR',
        category: 'Personal Coaching'
      },
      {
        name: 'Programme G-Maxing Intensif',
        description: 'Programme complet de transformation en 90 jours',
        price: 197,
        currency: 'EUR',
        category: 'Group Coaching'
      }
    ];

    const schemas = [
      ...coachingServices.map(service => this.generateServiceSchema(service)),
      this.generateBreadcrumbSchema([
        { name: 'Accueil', url: this.baseUrl },
        { name: 'Coaching', url: `${this.baseUrl}/coaching` }
      ])
    ];

    return schemas.map(schema => JSON.stringify(schema, null, 2));
  }

  getBlogPageSchemas(articles?: any[]): string[] {
    const schemas = [
      this.generateBreadcrumbSchema([
        { name: 'Accueil', url: this.baseUrl },
        { name: 'Blog G-Maxing', url: `${this.baseUrl}/blog` }
      ])
    ];

    // Ajouter les schemas des articles si fournis
    if (articles) {
      articles.forEach(article => {
        schemas.push(this.generateArticleSchema(article));
      });
    }

    return schemas.map(schema => JSON.stringify(schema, null, 2));
  }

  // ============= FAQ G-MAXING =============

  getGMaxingFAQSchema(): string {
    const faqs = [
      {
        question: 'Qu\'est-ce que la méthode G-Maxing d\'Engel Garcia Gomez ?',
        answer: 'Le G-Maxing est une méthode révolutionnaire de transformation physique et mentale développée par Engel Garcia Gomez. Elle combine entraînement fonctionnel, nutrition optimisée et développement du mindset pour maximiser votre potentiel.'
      },
      {
        question: 'Combien de temps faut-il pour voir des résultats avec G-Maxing ?',
        answer: 'Avec la méthode G-Maxing d\'Engel Garcia Gomez, les premiers résultats sont visibles dès les 2-3 premières semaines. Une transformation complète s\'observe généralement entre 90 et 180 jours selon votre engagement.'
      },
      {
        question: 'Le G-Maxing convient-il aux débutants ?',
        answer: 'Absolument ! Engel Garcia Gomez a conçu la méthode G-Maxing pour s\'adapter à tous les niveaux. Les protocoles sont progressifs et personnalisables selon votre condition physique actuelle.'
      },
      {
        question: 'Peut-on faire du G-Maxing à la maison ?',
        answer: 'Oui, une grande partie des protocoles G-Maxing d\'Engel Garcia Gomez peuvent être réalisés à domicile avec un équipement minimal. Des adaptations sont prévues pour tous les environnements.'
      },
      {
        question: 'Quelle est la différence entre G-Maxing et les autres méthodes ?',
        answer: 'Le G-Maxing d\'Engel Garcia Gomez est unique car il intègre une approche holistique : transformation physique, optimisation mentale et développement personnel simultanés. C\'est cette synergie qui génère des résultats exceptionnels.'
      }
    ];

    return JSON.stringify(this.generateFAQSchema(faqs), null, 2);
  }

  // ============= INJECTION DES SCHEMAS =============

  injectSchemas(schemas: string[]): void {
    // Supprimer les anciens schemas
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(schema => schema.remove());

    // Injecter les nouveaux schemas
    schemas.forEach((schemaJson, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = schemaJson;
      script.id = `schema-${index}`;
      document.head.appendChild(script);
    });

    console.log('✅ Schemas JSON-LD injectés:', schemas.length);
  }

  // ============= META TAGS SEO =============

  updateMetaTags(meta: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
    publishedAt?: Date;
    modifiedAt?: Date;
  }): void {
    // Title
    document.title = meta.title;

    // Meta description
    this.updateMetaTag('description', meta.description);

    // Keywords
    if (meta.keywords) {
      this.updateMetaTag('keywords', meta.keywords);
    }

    // Author
    this.updateMetaTag('author', meta.author || 'Engel Garcia Gomez');

    // Open Graph
    this.updateMetaTag('og:title', meta.title, 'property');
    this.updateMetaTag('og:description', meta.description, 'property');
    this.updateMetaTag('og:url', meta.url || window.location.href, 'property');
    this.updateMetaTag('og:type', meta.type || 'website', 'property');
    this.updateMetaTag('og:site_name', this.siteName, 'property');
    this.updateMetaTag('og:locale', 'fr_FR', 'property');

    if (meta.image) {
      this.updateMetaTag('og:image', meta.image, 'property');
      this.updateMetaTag('og:image:alt', meta.title, 'property');
    }

    // Twitter Card
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', meta.title);
    this.updateMetaTag('twitter:description', meta.description);
    this.updateMetaTag('twitter:site', '@EngelGMax');
    this.updateMetaTag('twitter:creator', '@EngelGMax');

    if (meta.image) {
      this.updateMetaTag('twitter:image', meta.image);
    }

    // Article specific
    if (meta.type === 'article') {
      if (meta.publishedAt) {
        this.updateMetaTag('article:published_time', meta.publishedAt.toISOString(), 'property');
      }
      if (meta.modifiedAt) {
        this.updateMetaTag('article:modified_time', meta.modifiedAt.toISOString(), 'property');
      }
      this.updateMetaTag('article:author', meta.author || 'Engel Garcia Gomez', 'property');
      this.updateMetaTag('article:section', 'G-Maxing', 'property');
    }

    console.log('✅ Meta tags SEO mis à jour');
  }

  private updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }
    
    tag.content = content;
  }
}

// Instance singleton
export const schemaEngine = new SchemaEngine();

export default SchemaEngine;