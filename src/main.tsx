import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Initialize i18n
import './i18n';

// Import performance monitoring
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Performance monitoring function
const sendToAnalytics = (metric: any) => {
  // Send to Google Analytics or your analytics service
  if (window.gtag && import.meta.env.PROD) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(metric);
  }
};

// Measure and report Core Web Vitals
// getCLS(sendToAnalytics);
// getFID(sendToAnalytics);
// getFCP(sendToAnalytics);
// getLCP(sendToAnalytics);
// getTTFB(sendToAnalytics);

// Error boundary for global error handling
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Application error:', error, errorInfo);
    
    // Send error to monitoring service in production
    if (import.meta.env.PROD && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true,
      });
    }
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center glass-card p-8 max-w-md mx-4">
            <h1 className="text-2xl font-bold mb-4 text-engel">
              Oops! Une erreur s'est produite
            </h1>
            <p className="text-gray-300 mb-6">
              Nous nous excusons pour la gêne occasionnée. Veuillez actualiser la page ou 
              contacter notre support si le problème persiste.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="glass-btn-primary px-6 py-3"
            >
              Actualiser la page
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Erreur signalée automatiquement à notre équipe technique.
            </p>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

// Initialize the React application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Development mode warnings
if (import.meta.env.DEV) {
  console.log('🚀 EngelGMax.com - Development Mode');
  console.log('🔥 Built with React 18 + TypeScript + Vite');
  console.log('✨ Glassmorphism Design System Active');
  console.log('🧠 Free Intelligence Features Enabled');
  console.log('🎯 SEO Optimization: "Engel Garcia Gomez" Ready');
  
  // Check for required environment variables
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingEnvVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingEnvVars);
    console.warn('Please check your .env file');
  }
}

// Production optimizations
if (import.meta.env.PROD) {
  // Remove console logs in production
  console.log = () => {};
  console.warn = () => {};
  
  // Enable React's concurrent features
  console.info('🚀 EngelGMax.com - Production Build');
  console.info('⚡ Optimized for Engel Garcia Gomez SEO');
}

// Render the application
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.info('SW registered: ', registration);
        
        // Check for updates every 5 minutes
        setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000);
      })
      .catch((registrationError) => {
        console.info('SW registration failed: ', registrationError);
      });
  });

  // Handle service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Show update notification to user
    const updateBanner = document.createElement('div');
    updateBanner.className = 'fixed top-0 left-0 right-0 bg-primary-600 text-white p-3 text-center z-50 glass-card border-0 rounded-none';
    updateBanner.innerHTML = `
      <span>Une nouvelle version est disponible!</span>
      <button onclick="window.location.reload()" class="ml-4 bg-white/20 px-3 py-1 rounded text-sm hover:bg-white/30 transition">
        Actualiser
      </button>
      <button onclick="this.parentElement.remove()" class="ml-2 bg-white/20 px-3 py-1 rounded text-sm hover:bg-white/30 transition">
        ×
      </button>
    `;
    document.body.appendChild(updateBanner);
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
      updateBanner.remove();
    }, 30000);
  });
}

// Initialize analytics if available
if (import.meta.env.PROD && window.gtag) {
  // Track page views
  window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || '', {
    page_title: 'EngelGMax - Engel Garcia Gomez Coach G-Maxing',
    custom_map: {
      'custom_parameter_1': 'engel_garcia_gomez_main_app'
    }
  });

  // Track initial app load
  window.gtag('event', 'app_load', {
    event_category: 'engel_garcia_gomez',
    event_label: 'app_initialization',
    value: 1
  });
}

// Performance monitoring for LCP, FID, CLS
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'largest-contentful-paint') {
      console.info('LCP:', entry.startTime);
    }
    if (entry.entryType === 'first-input') {
      console.info('FID:', (entry as any).processingStart - entry.startTime);
    }
    if (entry.entryType === 'layout-shift') {
      if (!(entry as any).hadRecentInput) {
        console.info('CLS:', (entry as any).value);
      }
    }
  });
});

observer.observe({ 
  type: 'largest-contentful-paint', 
  buffered: true 
});

observer.observe({ 
  type: 'first-input', 
  buffered: true 
});

observer.observe({ 
  type: 'layout-shift', 
  buffered: true 
});

// Intersection Observer for lazy loading and animations
const createIntersectionObserver = () => {
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animation classes
        entry.target.classList.add('revealed');
        
        // Lazy load images
        if (entry.target.tagName === 'IMG' && entry.target.hasAttribute('data-src')) {
          (entry.target as HTMLImageElement).src = (entry.target as HTMLImageElement).dataset.src!;
          entry.target.removeAttribute('data-src');
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that need animation or lazy loading
  document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.reveal, .lazy-load, [data-src]');
    elements.forEach(el => observer.observe(el));
  });

  return observer;
};

// Initialize intersection observer
createIntersectionObserver();

// Handle offline/online status for PWA
window.addEventListener('online', () => {
  console.info('🌐 Connection restored');
  // Show success toast
});

window.addEventListener('offline', () => {
  console.info('📵 Connection lost - Running in offline mode');
  // Show offline toast
});

// Prefetch critical resources
if (import.meta.env.PROD) {
  // Prefetch commonly accessed routes
  const routesToPrefetch = [
    '/engel-garcia-gomez',
    '/coaching-g-maxing',
    '/produits-g-maxing',
    '/blog'
  ];

  routesToPrefetch.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
}

// Initialize theme based on user preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('engelgmax-theme');
  const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDarkMode)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Initialize theme immediately
initializeTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('engelgmax-theme')) {
    if (e.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
});