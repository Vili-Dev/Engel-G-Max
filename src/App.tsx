import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import AuthButton from './components/auth/AuthButton';

// i18n setup - TODO: Create i18n configuration
// import './i18n';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ProductsPage = React.lazy(() => import('./pages/ShopPage'));
// ProductDetailPage will be created later
// const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
// BlogPostPage will be created later
// const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
// ContactPage will be created later
// const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const NewsletterPage = React.lazy(() => import('./pages/NewsletterPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const TestAuthPage = React.lazy(() => import('./pages/TestAuthPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const ProtocolsPage = React.lazy(() => import('./pages/ProtocolsPage'));
const ProtocolDetailPage = React.lazy(() => import('./pages/ProtocolDetailPage'));
// ProtocolAccessPage will be created later
// const ProtocolAccessPage = React.lazy(() => import('./pages/ProtocolAccessPage'));
// TestimonialsPage will be created later
// const TestimonialsPage = React.lazy(() => import('./pages/TestimonialsPage'));

// Admin pages (protected routes) - TODO: Create these pages
// const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
// const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
// const ProductManager = React.lazy(() => import('./pages/admin/ProductManager'));
// const BlogManager = React.lazy(() => import('./pages/admin/BlogManager'));
// const OrderManager = React.lazy(() => import('./pages/admin/OrderManager'));
// const NewsletterManager = React.lazy(() => import('./pages/admin/NewsletterManager'));
// const AnalyticsManager = React.lazy(() => import('./pages/admin/AnalyticsManager'));

// Common components - TODO: Create these components
// import Header from './components/common/Header';
// import Footer from './components/common/Footer';
// import LoadingSpinner from './components/common/LoadingSpinner';
// import ErrorBoundary from './components/common/ErrorBoundary';
// import SEOHead from './components/common/SEOHead';
// import ChatInterface from './components/chatbot/ChatInterface';

// Multilingual components - TODO: Create these components
// import { LocalizedRoute, getRouteConfig } from './components/routing/LocalizedRoute';
// import { LocalizedSEO } from './components/seo/LocalizedSEO';

// Hooks - TODO: Create these hooks
// import { useAuth } from './hooks/useAuth';
// import { useSEO } from './hooks/useSEO';
// import { useTranslation } from './hooks/useTranslation';
// import { useChatbot } from './hooks/useChatbot';

// Types
// import type { User } from 'firebase/auth';

// Loading component for Suspense fallback
const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="glass-card p-8 rounded-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white mt-4 text-center">Chargement...</p>
      </div>
    </div>
  );
};

// Not found component
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 px-4">
      <div className="text-center glass-card p-8 max-w-md">
        <h1 className="text-6xl font-bold text-engel mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Page non trouvée
        </h2>
        <p className="text-gray-300 mb-6">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          className="glass-btn-primary px-6 py-3 inline-block"
        >
          Accueil
        </a>
      </div>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  // Simplified for now - TODO: Add hooks back when they exist
  // const { user, loading: authLoading } = useAuth();
  // const { updateSEO } = useSEO();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const { t, language } = useTranslation();
  
  const user = null; // Temporary - will be replaced with real auth
  const authLoading = false;

  // Set default SEO data - TODO: Implement real SEO hook
  useEffect(() => {
    document.title = 'Engel Garcia Gomez - Coach G-Maxing Expert | Transformation Physique';
  }, []);

  // Track page views for analytics
  useEffect(() => {
    const handleRouteChange = () => {
      // Send page view to Google Analytics
      if (window.gtag && import.meta.env.PROD) {
        window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || '', {
          page_path: window.location.pathname,
          page_title: document.title,
        });

        // Track specific searches for "Engel Garcia Gomez"
        if (window.location.pathname.includes('engel-garcia-gomez')) {
          window.gtag('event', 'engel_garcia_gomez_page_view', {
            event_category: 'seo',
            event_label: window.location.pathname,
            value: 1,
          });
        }
      }
    };

    // Track initial page load
    handleRouteChange();

    // Track route changes (for SPA navigation)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      setTimeout(handleRouteChange, 0);
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      setTimeout(handleRouteChange, 0);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* SEO Head component - TODO: Create SEOHead */}
      {/* <SEOHead /> */}
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
          },
          success: {
            style: {
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            },
          },
          error: {
            style: {
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            },
          },
        }}
      />

      {/* Main application layout */}
      <div className="flex flex-col min-h-screen">
        {/* Header Navigation - TODO: Create Header component */}
        {/* <Header user={user} /> */}
        <nav className="bg-gray-900/50 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="text-2xl font-bold text-engel">
                EngelGMax
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-white hover:text-engel transition">Accueil</Link>
                <Link to="/about" className="text-white hover:text-engel transition">À propos</Link>
                <Link to="/protocols" className="text-white hover:text-engel transition">Protocoles</Link>
                <Link to="/shop" className="text-white hover:text-engel transition">Boutique</Link>
                <Link to="/blog" className="text-white hover:text-engel transition">Blog</Link>
                
                {/* Auth buttons */}
                <div className="ml-8">
                  <AuthButton />
                </div>
              </div>

              {/* Mobile menu button - Hidden on desktop */}
              <div className="block md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white hover:text-engel transition-colors"
                  aria-label="Menu mobile"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden border-t border-white/10 mt-2 pt-4 pb-4"
                >
                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/" 
                      className="text-white hover:text-engel transition px-4 py-2 rounded-lg hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Accueil
                    </Link>
                    <Link 
                      to="/about" 
                      className="text-white hover:text-engel transition px-4 py-2 rounded-lg hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      À propos
                    </Link>
                    <Link 
                      to="/protocols" 
                      className="text-white hover:text-engel transition px-4 py-2 rounded-lg hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Protocoles
                    </Link>
                    <Link 
                      to="/shop" 
                      className="text-white hover:text-engel transition px-4 py-2 rounded-lg hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Boutique
                    </Link>
                    <Link 
                      to="/blog" 
                      className="text-white hover:text-engel transition px-4 py-2 rounded-lg hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                    
                    {/* Auth buttons for mobile */}
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className="px-4">
                        <AuthButton />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {/* <ErrorBoundary> TODO: Create ErrorBoundary */}
            <AnimatePresence mode="wait">
              <Suspense fallback={<PageLoader />}>
                {/* <LocalizedRoute> TODO: Create LocalizedRoute */}
                  <Routes>
                    {/* English routes (no prefix) */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/services" element={<ProductsPage />} />
                    <Route path="/coaching" element={<ProductsPage />} />
                    <Route path="/coaching-g-maxing" element={<ProductsPage />} />
                    <Route path="/protocols" element={<ProtocolsPage />} />
                    <Route path="/protocols/:slug" element={<ProtocolDetailPage />} />
                    <Route path="/transformation-results" element={<AboutPage />} />
                    <Route path="/shop" element={<ProductsPage />} />
                    <Route path="/shop/:id" element={<ProductsPage />} />
                    
                    {/* Blog routes - SEO optimized for Engel Garcia Gomez */}
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPage />} />
                    <Route path="/g-maxing-guide-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/transformation-method-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/who-is-engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/secrets-g-maxing-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/client-testimonials-engel-garcia-gomez" element={<AboutPage />} />
                    
                    {/* Contact and newsletter */}
                    <Route path="/contact" element={<AboutPage />} />
                    <Route path="/contact-engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/newsletter" element={<NewsletterPage />} />
                    <Route path="/testimonials" element={<AboutPage />} />
                    
                    {/* Auth routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/test-auth" element={<TestAuthPage />} />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    
                    {/* French routes */}
                    <Route path="/fr" element={<HomePage />} />
                    <Route path="/fr/a-propos" element={<AboutPage />} />
                    <Route path="/fr/engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/fr/services" element={<ProductsPage />} />
                    <Route path="/fr/coaching" element={<ProductsPage />} />
                    <Route path="/fr/coaching-g-maxing" element={<ProductsPage />} />
                    <Route path="/fr/protocoles" element={<ProtocolsPage />} />
                    <Route path="/fr/protocoles/:slug" element={<ProtocolDetailPage />} />
                    <Route path="/fr/transformation-physique" element={<AboutPage />} />
                    <Route path="/fr/boutique" element={<ProductsPage />} />
                    <Route path="/fr/boutique/:id" element={<ProductsPage />} />
                    <Route path="/fr/blog" element={<BlogPage />} />
                    <Route path="/fr/blog/:slug" element={<BlogPage />} />
                    <Route path="/fr/guide-g-maxing-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/fr/methode-transformation-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/fr/qui-est-engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/fr/secrets-g-maxing-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/fr/temoignages-clients-engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/fr/contact" element={<AboutPage />} />
                    <Route path="/fr/contact-engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/fr/newsletter" element={<NewsletterPage />} />
                    <Route path="/fr/temoignages" element={<AboutPage />} />
                    
                    {/* Spanish routes */}
                    <Route path="/es" element={<HomePage />} />
                    <Route path="/es/acerca-de" element={<AboutPage />} />
                    <Route path="/es/engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/es/servicios" element={<ProductsPage />} />
                    <Route path="/es/entrenamiento" element={<ProductsPage />} />
                    <Route path="/es/entrenamiento-g-maxing" element={<ProductsPage />} />
                    <Route path="/es/protocolos" element={<ProductsPage />} />
                    <Route path="/es/transformacion-fisica" element={<AboutPage />} />
                    <Route path="/es/tienda" element={<ProductsPage />} />
                    <Route path="/es/tienda/:id" element={<ProductsPage />} />
                    <Route path="/es/blog" element={<BlogPage />} />
                    <Route path="/es/blog/:slug" element={<BlogPage />} />
                    <Route path="/es/guia-g-maxing-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/es/metodo-transformacion-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/es/quien-es-engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/es/secretos-g-maxing-engel-garcia-gomez" element={<BlogPage />} />
                    <Route path="/es/testimonios-clientes-engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/es/contacto" element={<AboutPage />} />
                    <Route path="/es/contacto-engel-garcia-gomez" element={<AboutPage />} />
                    <Route path="/es/newsletter" element={<NewsletterPage />} />
                    <Route path="/es/testimonios" element={<AboutPage />} />

                    {/* Admin routes - TODO: Create admin pages */}
                    {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
                    {/* {user?.role === 'admin' && (
                      <>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/products" element={<ProductManager />} />
                        <Route path="/admin/blog" element={<BlogManager />} />
                        <Route path="/admin/orders" element={<OrderManager />} />
                        <Route path="/admin/newsletter" element={<NewsletterManager />} />
                        <Route path="/admin/analytics" element={<AnalyticsManager />} />
                      </>
                    )} */}

                    {/* Catch all - 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                {/* </LocalizedRoute> */}
              </Suspense>
            </AnimatePresence>
          {/* TODO: Add </ErrorBoundary> when ErrorBoundary component is created */}
        </main>

        {/* Footer - TODO: Create Footer component */}
        {/* <Footer /> */}
        <footer className="bg-gray-900 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-2xl font-bold text-engel mb-4">EngelGMax</p>
              <p className="text-gray-400">
                Transformez votre physique avec Engel Garcia Gomez
              </p>
              <p className="text-sm text-gray-500 mt-4">
                © 2024 EngelGMax. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* G-Maxing Intelligent Chatbot - TODO: Create ChatInterface */}
      {/* <ChatInterface
        isOpen={isOpen}
        onToggle={toggle}
        userContext={context}
      /> */}

      {/* Structured data for Engel Garcia Gomez */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Engel Garcia Gomez",
            "alternateName": ["Engel Garcia", "Engel Gomez", "EngelGMax"],
            "description": "Coach sportif spécialisé en G-Maxing et transformation physique. Expert reconnu en optimisation génétique et développement physique maximum.",
            "url": "https://engelgmax.com",
            "image": "https://engelgmax.com/images/engel-garcia-gomez-profile.jpg",
            "jobTitle": "Coach G-Maxing & Expert Transformation Physique",
            "worksFor": {
              "@type": "Organization",
              "name": "EngelGMax",
              "url": "https://engelgmax.com"
            },
            "sameAs": [
              "https://instagram.com/engelgmax",
              "https://tiktok.com/@engelgmax", 
              "https://youtube.com/@engelgmax",
              "https://linkedin.com/in/engel-garcia-gomez"
            ],
            "knowsAbout": [
              "G-Maxing",
              "Transformation physique",
              "Musculation", 
              "Nutrition sportive",
              "Coaching personnel",
              "Optimisation génétique"
            ]
          })
        }}
      />

      {/* Business structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsActivityLocation",
            "name": "EngelGMax",
            "description": "Plateforme de coaching G-Maxing et transformation physique dirigée par Engel Garcia Gomez",
            "url": "https://engelgmax.com",
            "founder": {
              "@type": "Person",
              "name": "Engel Garcia Gomez"
            },
            "logo": "https://engelgmax.com/images/engelgmax-logo.png",
            "priceRange": "€€",
            "paymentAccepted": ["Credit Card", "PayPal"],
            "currenciesAccepted": "EUR"
          })
        }}
      />
    </div>
  );
};

export default App;