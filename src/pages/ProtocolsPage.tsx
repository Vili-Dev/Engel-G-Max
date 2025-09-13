/**
 * Page Protocoles Publique - Engel G-Max
 * Vitrine des protocoles de supplémentation payants
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  FireIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { SupplementProtocol, ProtocolCategory } from '../types/supplementProtocol';
import { protocolsData } from '../data/protocols';

const ProtocolsPage: React.FC = () => {
  const [protocols, setProtocols] = useState<SupplementProtocol[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProtocolCategory | 'all'>('all');
  const [cart, setCart] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Les données sont maintenant centralisées dans /data/protocols.ts

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setProtocols(protocolsData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProtocols = protocols.filter(protocol => {
    if (selectedCategory === 'all') return true;
    return protocol.category === selectedCategory;
  });

  const getCategoryInfo = (category: ProtocolCategory) => {
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
    return categoryData[category];
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  const addToCart = (protocolId: string) => {
    setCart(prev => [...prev, protocolId]);
  };

  const removeFromCart = (protocolId: string) => {
    setCart(prev => prev.filter(id => id !== protocolId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, protocolId) => {
      const protocol = protocols.find(p => p.id === protocolId);
      return total + (protocol?.price || 0);
    }, 0);
  };

  const getDiscountedPrice = () => {
    const total = getTotalPrice();
    return cart.length >= 2 ? total * 0.75 : total; // 25% de réduction si 2+ protocoles
  };

  const categories = [
    { value: 'all' as const, label: 'Tous les Protocoles', count: protocols.length },
    { value: 'looxmax' as const, label: 'Looxmax', count: protocols.filter(p => p.category === 'looxmax').length },
    { value: 'performance' as const, label: 'Performance', count: protocols.filter(p => p.category === 'performance').length },
    { value: 'productivity' as const, label: 'Productivité', count: protocols.filter(p => p.category === 'productivity').length },
    { value: 'advanced' as const, label: 'Avancé', count: protocols.filter(p => p.category === 'advanced').length },
    { value: 'coaching' as const, label: 'Coaching', count: protocols.filter(p => p.category === 'coaching').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-engel mx-auto mb-4"></div>
          <p className="text-white text-center">Chargement des protocoles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Protocoles <span className="text-engel">G-Maxing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Des protocoles de supplémentation scientifiques créés par{' '}
            <span className="text-engel font-semibold">Engel Garcia Gomez</span> pour
            optimiser votre transformation physique et mentale.
          </motion.p>
          
          {/* Special Offer Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card bg-gradient-to-r from-engel/20 to-purple-500/20 border border-engel/30 p-6 rounded-2xl max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-3">
              <FireIcon className="h-6 w-6 text-engel" />
              <h3 className="text-xl font-bold text-white">Offre Spéciale</h3>
              <FireIcon className="h-6 w-6 text-engel" />
            </div>
            <p className="text-engel font-semibold text-lg">
              2 protocoles achetés = -25% de réduction automatique
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Maximisez vos résultats en combinant plusieurs protocoles
            </p>
          </motion.div>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`glass-card px-6 py-3 rounded-xl transition-all ${
                  selectedCategory === category.value
                    ? 'bg-engel/20 border-engel/40 text-white'
                    : 'hover:bg-white/10 text-gray-300'
                }`}
              >
                <span className="font-medium">{category.label}</span>
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Protocols Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {filteredProtocols.map((protocol, index) => {
              const categoryInfo = getCategoryInfo(protocol.category);
              const IconComponent = categoryInfo.icon;
              const isInCart = cart.includes(protocol.id);
              
              return (
                <motion.div
                  key={protocol.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 ${
                    protocol.featured ? 'ring-2 ring-engel/30' : ''
                  }`}
                >
                  {protocol.featured && (
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gradient-to-r from-engel to-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
                        <TrophyIcon className="h-4 w-4 mr-1" />
                        POPULAIRE
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${categoryInfo.bgColor} ${categoryInfo.borderColor} border`}>
                      <IconComponent className={`h-6 w-6 ${categoryInfo.color}`} />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 font-medium">{protocol.rating}</span>
                        <span className="text-gray-400 text-sm">({protocol.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span className="flex items-center">
                          <UserGroupIcon className="h-3 w-3 mr-1" />
                          {protocol.purchaseCount}
                        </span>
                        <span className={getDifficultyColor(protocol.difficulty)}>
                          {protocol.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3">{protocol.name}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{protocol.shortDescription}</p>
                  
                  {/* Duration & Budget */}
                  <div className="flex items-center justify-between mb-6 text-sm">
                    <div className="flex items-center text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {protocol.duration}
                    </div>
                    {protocol.estimatedBudget && (
                      <div className="text-gray-400">
                        Budget: {protocol.estimatedBudget.min}-{protocol.estimatedBudget.max}€
                      </div>
                    )}
                  </div>

                  {/* Includes Preview */}
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-2">Inclus :</p>
                    <div className="space-y-1">
                      {protocol.includes.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircleIcon className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">{item.name}</span>
                        </div>
                      ))}
                      {protocol.includes.length > 3 && (
                        <p className="text-xs text-gray-500 ml-5">
                          +{protocol.includes.length - 3} autres éléments...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-white">{protocol.price}€</span>
                        <span className="text-gray-400 text-sm ml-1">TTC</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Link 
                          to={`/protocols/${protocol.slug}`}
                          className="glass-btn-secondary px-4 py-2 text-sm flex items-center"
                        >
                          <InformationCircleIcon className="h-4 w-4 mr-1" />
                          Détails
                        </Link>
                        {isInCart ? (
                          <button
                            onClick={() => removeFromCart(protocol.id)}
                            className="glass-btn-secondary px-4 py-2 text-sm text-red-400 border-red-500/30 hover:bg-red-500/10"
                          >
                            Retirer
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(protocol.id)}
                            className="glass-btn-primary px-4 py-2 text-sm flex items-center"
                          >
                            <ShoppingCartIcon className="h-4 w-4 mr-1" />
                            Ajouter
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Cart Summary */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 glass-card p-6 rounded-2xl max-w-md z-50"
            >
              <h4 className="text-white font-bold text-lg mb-4 flex items-center">
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Panier ({cart.length} protocole{cart.length > 1 ? 's' : ''})
              </h4>
              
              <div className="space-y-2 mb-4">
                {cart.map(protocolId => {
                  const protocol = protocols.find(p => p.id === protocolId);
                  return protocol ? (
                    <div key={protocolId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{protocol.name}</span>
                      <span className="text-white font-medium">{protocol.price}€</span>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Sous-total:</span>
                  <span className="text-white">{getTotalPrice()}€</span>
                </div>
                
                {cart.length >= 2 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400">Réduction -25%:</span>
                    <span className="text-green-400">-{(getTotalPrice() * 0.25).toFixed(2)}€</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-bold">Total:</span>
                  <span className="text-engel font-bold text-xl">{getDiscountedPrice().toFixed(2)}€</span>
                </div>

                <button className="w-full glass-btn-primary py-3 font-bold">
                  Passer Commande
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <div className="text-center glass-card p-12 rounded-3xl bg-gradient-to-r from-engel/10 to-purple-500/10 border border-engel/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre transformation ?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers de personnes qui ont déjà transformé leur physique et leur mental
            avec les protocoles d'<span className="text-engel font-semibold">Engel Garcia Gomez</span>.
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Link to="/blog" className="glass-btn-secondary px-6 py-3">
              Lire le Blog
            </Link>
            <Link to="/about" className="glass-btn-primary px-6 py-3">
              À propos d'Engel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolsPage;