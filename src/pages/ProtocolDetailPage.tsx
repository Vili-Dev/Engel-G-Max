/**
 * Page Détail Protocole - Engel G-Max
 * Page individuelle pour chaque protocole avec description complète
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  RocketLaunchIcon,
  BeakerIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  StarIcon,
  ShoppingCartIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  PlayIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  ShareIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { SupplementProtocol } from '../types/supplementProtocol';
import { protocolsData } from '../data/protocols';
import ProtocolComments from '../components/public/ProtocolComments';
import ProtocolVideos from '../components/public/ProtocolVideos';

const ProtocolDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [protocol, setProtocol] = useState<SupplementProtocol | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'includes' | 'reviews' | 'faq'>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Les données sont maintenant centralisées dans /data/protocols.ts

  useEffect(() => {
    // Simuler la récupération du protocole par slug
    setTimeout(() => {
      const foundProtocol = protocolsData.find(p => p.slug === slug);
      setProtocol(foundProtocol || null);
      setLoading(false);
    }, 800);
  }, [slug]);

  const getCategoryInfo = (category: string) => {
    const categoryData = {
      looxmax: { 
        icon: SparklesIcon, 
        label: 'Looxmax (Apparence)', 
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/30'
      },
      performance: { 
        icon: RocketLaunchIcon, 
        label: 'Performance', 
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
      },
      productivity: { 
        icon: AcademicCapIcon, 
        label: 'Productivité', 
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30'
      },
      advanced: { 
        icon: BeakerIcon, 
        label: 'Avancé (Peptides)', 
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30'
      },
      coaching: { 
        icon: BriefcaseIcon, 
        label: 'Coaching', 
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30'
      }
    };
    return categoryData[category] || categoryData.looxmax;
  };

  const handlePurchase = () => {
    setShowPaymentModal(true);
    // Ici on intégrerait Stripe Checkout avec le vrai Price ID
    console.log('Achat protocole:', protocol?.stripePriceId);
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: InformationCircleIcon },
    { id: 'includes', label: 'Inclus', icon: CheckCircleIcon },
    { id: 'reviews', label: 'Avis', icon: StarIcon },
    { id: 'faq', label: 'FAQ', icon: ChatBubbleLeftEllipsisIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-engel mx-auto mb-4"></div>
          <p className="text-white text-center">Chargement du protocole...</p>
        </div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Protocole introuvable</h2>
          <p className="text-gray-400 mb-6">Le protocole que vous cherchez n'existe pas ou a été supprimé.</p>
          <Link to="/protocols" className="glass-btn-primary px-6 py-3">
            Retour aux protocoles
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(protocol.category);
  const IconComponent = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link to="/protocols" className="flex items-center text-gray-400 hover:text-white transition">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Protocoles
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-white">{protocol.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl ${categoryInfo.bgColor} ${categoryInfo.borderColor} border`}>
                    <IconComponent className={`h-8 w-8 ${categoryInfo.color}`} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{protocol.name}</h1>
                    <p className="text-xl text-gray-300">{protocol.shortDescription}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="p-2 glass-card rounded-lg hover:bg-white/10 transition">
                    <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-400" />
                  </button>
                  <button className="p-2 glass-card rounded-lg hover:bg-white/10 transition">
                    <ShareIcon className="h-5 w-5 text-gray-400 hover:text-blue-400" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">{protocol.rating}</span>
                  <span className="text-gray-400">({protocol.reviewCount} avis)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>{protocol.purchaseCount} utilisateurs</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <ClockIcon className="h-4 w-4" />
                  <span>{protocol.duration}</span>
                </div>
              </div>

              {/* Featured Image */}
              {protocol.featuredImage && (
                <div className="relative rounded-xl overflow-hidden mb-6">
                  <img 
                    src={protocol.featuredImage} 
                    alt={protocol.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      // Fallback en cas d'image manquante
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                    <PlayIcon className="h-5 w-5 text-white" />
                    <span className="text-white text-sm">Voir la présentation vidéo</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {protocol.longDescription}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="glass-card p-2 rounded-2xl">
              <div className="flex space-x-2">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-engel text-black'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <TabIcon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-8 rounded-2xl"
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Vue d'ensemble</h3>
                    
                    {/* Target Audience */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Pour qui ?</h4>
                      <div className="flex flex-wrap gap-2">
                        {protocol.targetAudience.map((audience, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    {protocol.estimatedBudget && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Budget estimé</h4>
                        <p className="text-gray-300">
                          Entre <span className="text-white font-semibold">{protocol.estimatedBudget.min}€</span> et{' '}
                          <span className="text-white font-semibold">{protocol.estimatedBudget.max}€</span> pour
                          l'achat des suppléments et produits recommandés.
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Mots-clés</h4>
                      <div className="flex flex-wrap gap-2">
                        {protocol.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Ce qui est inclus</h3>
                    <div className="space-y-4">
                      {protocol.includes.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
                          <CheckCircleIcon className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                          <div>
                            <h5 className="text-white font-semibold mb-1">{item.name}</h5>
                            <p className="text-gray-400">{item.description}</p>
                            {item.quantity && (
                              <span className="inline-block mt-2 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Avis clients</h3>
                    <div className="text-center py-12">
                      <ChatBubbleLeftEllipsisIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">
                        Système d'avis en cours de développement.
                        <br />
                        Les avis clients seront bientôt disponibles !
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Questions fréquentes</h3>
                    <div className="space-y-4">
                      <div className="glass-card p-4">
                        <h5 className="text-white font-semibold mb-2">
                          Combien de temps faut-il pour voir des résultats ?
                        </h5>
                        <p className="text-gray-400">
                          Les premiers effets sont généralement visibles dès 2-3 semaines, 
                          avec des résultats significatifs après {protocol.duration}.
                        </p>
                      </div>
                      <div className="glass-card p-4">
                        <h5 className="text-white font-semibold mb-2">
                          Le protocole est-il sûr ?
                        </h5>
                        <p className="text-gray-400">
                          Tous nos protocoles sont conçus pour une utilisation responsable et sécurisée. 
                          Consultez toujours un professionnel de santé avant de commencer.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="glass-card p-6 rounded-2xl sticky top-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">{protocol.price}€</div>
                <div className="text-gray-400">TTC - Paiement unique</div>
                <div className="text-sm text-green-400 mt-1">
                  Stripe ID: {protocol.stripePriceId}
                </div>
              </div>

              <button 
                onClick={handlePurchase}
                className="w-full glass-btn-primary py-4 text-lg font-bold mb-4 flex items-center justify-center space-x-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Acheter maintenant</span>
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <ShieldCheckIcon className="h-4 w-4 text-green-400" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                  <span>Accès immédiat après paiement</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <HeartIcon className="h-4 w-4 text-green-400" />
                  <span>Garantie satisfaction</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-6">
                <p className="text-xs text-gray-500 text-center">
                  En achetant ce protocole, vous acceptez nos conditions d'utilisation.
                  Consultez un professionnel de santé avant utilisation.
                </p>
              </div>
            </div>

            {/* Author */}
            <div className="glass-card p-6 rounded-2xl">
              <h4 className="text-white font-bold mb-4">Créé par</h4>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-engel to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">EG</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Engel Garcia Gomez</div>
                  <div className="text-gray-400 text-sm">Expert G-Maxing</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Coach reconnu spécialisé en transformation physique et optimisation génétique.
              </p>
              <Link to="/about" className="text-engel text-sm hover:underline mt-2 inline-block">
                En savoir plus →
              </Link>
            </div>

            {/* Related Protocols */}
            <div className="glass-card p-6 rounded-2xl">
              <h4 className="text-white font-bold mb-4">Protocoles similaires</h4>
              <div className="space-y-3">
                <div className="text-center py-8">
                  <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Recommandations basées sur vos intérêts à venir...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Videos Section */}
        <div className="mt-12">
          <ProtocolVideos 
            protocolId={protocol.id}
            protocolName={protocol.name}
            isSubscribed={true}
            onVideoWatch={(videoId, watchTime) => {
              console.log(`Vidéo ${videoId} regardée pendant ${watchTime}s`);
            }}
          />
        </div>
        
        {/* Comments Section */}
        <div className="mt-12">
          <ProtocolComments 
            protocolId={protocol.id}
            protocolName={protocol.name}
            allowComments={true}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card p-8 rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Confirmer l'achat</h3>
              <p className="text-gray-300 mb-6">
                Vous allez être redirigé vers Stripe pour finaliser votre achat de manière sécurisée.
              </p>
              <div className="flex items-center justify-between mb-6">
                <span className="text-white">{protocol.name}</span>
                <span className="text-engel font-bold">{protocol.price}€</span>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 glass-btn-secondary py-3"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    // Ici on intégrerait la vraie redirection Stripe
                    console.log('Redirection vers Stripe:', protocol.stripePriceId);
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 glass-btn-primary py-3"
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProtocolDetailPage;