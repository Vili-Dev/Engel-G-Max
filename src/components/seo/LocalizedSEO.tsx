import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../hooks/useTranslation';
import { getCurrentLanguage, languages } from '../../i18n';

interface LocalizedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  article?: boolean;
  noindex?: boolean;
  canonical?: string;
  alternates?: Record<string, string>;
  structuredData?: any;
}

export const LocalizedSEO: React.FC<LocalizedSEOProps> = ({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  article = false,
  noindex = false,
  canonical,
  alternates,
  structuredData,
}) => {
  const { language } = useTranslation();
  const currentLang = getCurrentLanguage();
  
  // Build localized title
  const localizedTitle = `${title} | EngelGMax - Engel Garcia Gomez`;
  
  // Build canonical URL
  const baseUrl = 'https://engelgmax.com';
  const canonicalUrl = canonical || `${baseUrl}/${currentLang === 'en' ? '' : currentLang}`;
  
  // Build alternate URLs for hreflang
  const alternateUrls = alternates || {};
  languages.forEach(lang => {
    if (!alternateUrls[lang.code]) {
      alternateUrls[lang.code] = `${baseUrl}/${lang.code === 'en' ? '' : lang.code}`;
    }
  });

  // Default structured data
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': canonicalUrl,
    'url': canonicalUrl,
    'name': title,
    'description': description,
    'inLanguage': currentLang,
    'isPartOf': {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      'url': baseUrl,
      'name': 'EngelGMax',
      'description': 'Professional Sports Coaching Platform by Engel Garcia Gomez',
      'publisher': {
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        'name': 'Engel Garcia Gomez',
        'url': baseUrl,
        'sameAs': [
          'https://instagram.com/engelgarciagomez',
          'https://youtube.com/@engelgarciagomez',
          'https://twitter.com/engelgarciagomez'
        ]
      }
    },
    'author': {
      '@type': 'Person',
      'name': 'Engel Garcia Gomez',
      '@id': `${baseUrl}/#person`
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  // Language-specific meta tags
  const getLanguageSpecificMeta = () => {
    switch (currentLang) {
      case 'fr':
        return {
          'twitter:site': '@engelgarciagomez_fr',
          'fb:app_id': 'engelgmax_fr',
        };
      case 'es':
        return {
          'twitter:site': '@engelgarciagomez_es',
          'fb:app_id': 'engelgmax_es',
        };
      default:
        return {
          'twitter:site': '@engelgarciagomez',
          'fb:app_id': 'engelgmax',
        };
    }
  };

  const languageSpecificMeta = getLanguageSpecificMeta();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLang} />
      <title>{localizedTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Language URLs (hreflang) */}
      {Object.entries(alternateUrls).map(([lang, url]) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={url}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.en || baseUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={currentLang === 'en' ? 'en_US' : currentLang === 'fr' ? 'fr_FR' : 'es_ES'} />
      <meta property="og:site_name" content="EngelGMax" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />
      <meta name="twitter:creator" content="@engelgarciagomez" />
      
      {/* Language-specific meta tags */}
      {Object.entries(languageSpecificMeta).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Additional SEO tags for Engel Garcia Gomez branding */}
      <meta name="author" content="Engel Garcia Gomez" />
      <meta name="creator" content="Engel Garcia Gomez" />
      <meta name="publisher" content="EngelGMax" />
      <meta name="copyright" content="© 2024 Engel Garcia Gomez. All rights reserved." />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Additional SEO enhancements */}
      <meta name="theme-color" content="#0066FF" />
      <meta name="msapplication-TileColor" content="#0066FF" />
      <meta name="apple-mobile-web-app-title" content="EngelGMax" />
      <meta name="application-name" content="EngelGMax" />
    </Helmet>
  );
};

// Specialized SEO component for Engel Garcia Gomez personal pages
export const EngelGarciaSEO: React.FC<Omit<LocalizedSEOProps, 'structuredData'>> = (props) => {
  const { language } = useTranslation();
  
  const engelStructuredData = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'Coach'],
    '@id': 'https://engelgmax.com/#person',
    'name': 'Engel Garcia Gomez',
    'alternateName': ['Engel Garcia', 'Coach G-Max', 'G-Maxing Expert'],
    'description': 'Professional Sports Performance Coach and Creator of G-Maxing Methodology',
    'url': 'https://engelgmax.com',
    'sameAs': [
      'https://instagram.com/engelgarciagomez',
      'https://youtube.com/@engelgarciagomez',
      'https://twitter.com/engelgarciagomez',
      'https://linkedin.com/in/engelgarciagomez',
      'https://facebook.com/engelgarciagomez'
    ],
    'knowsAbout': [
      'Sports Performance',
      'Athletic Training',
      'Strength and Conditioning',
      'G-Maxing Methodology',
      'Sports Psychology',
      'Athletic Performance Optimization'
    ],
    'hasOccupation': {
      '@type': 'Occupation',
      'name': 'Sports Performance Coach',
      'description': 'Expert in athletic performance optimization and G-Maxing methodology'
    },
    'worksFor': {
      '@type': 'Organization',
      'name': 'EngelGMax',
      'url': 'https://engelgmax.com'
    },
    'image': 'https://engelgmax.com/images/engel-garcia-gomez.jpg',
    'nationality': 'Spanish',
    'gender': 'Male',
    'jobTitle': 'Sports Performance Coach',
    'award': [
      'Certified Strength and Conditioning Specialist',
      'Sports Performance Optimization Expert',
      'G-Maxing Methodology Creator'
    ]
  };

  return (
    <LocalizedSEO
      {...props}
      structuredData={engelStructuredData}
    />
  );
};

// SEO component for blog articles
export const BlogSEO: React.FC<LocalizedSEOProps & {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}> = ({ publishedTime, modifiedTime, author = 'Engel Garcia Gomez', tags, ...props }) => {
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': props.title,
    'description': props.description,
    'image': props.image || '/og-image.jpg',
    'author': {
      '@type': 'Person',
      'name': author,
      'url': 'https://engelgmax.com'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'EngelGMax',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://engelgmax.com/logo.png'
      }
    },
    'datePublished': publishedTime,
    'dateModified': modifiedTime || publishedTime,
    'keywords': tags?.join(', '),
    'articleSection': 'Sports Performance',
    'inLanguage': getCurrentLanguage(),
  };

  return (
    <LocalizedSEO
      {...props}
      article={true}
      structuredData={blogStructuredData}
    />
  );
};