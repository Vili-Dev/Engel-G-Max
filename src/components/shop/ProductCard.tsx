/**
 * Composant Carte Produit G-Maxing
 * Affichage élégant des services et produits d'Engel Garcia Gomez
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  StarIcon,
  CheckIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowRightIcon,
  HeartIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { GMaxingProduct, formatPrice, calculateDiscountedPrice } from '../../utils/ecommerce/stripeConfig';

interface ProductCardProps {
  product: GMaxingProduct;
  onPurchase: (product: GMaxingProduct) => void;
  className?: string;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPurchase,
  className = '',
  featured = false
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const discountedPrice = calculateDiscountedPrice(product);
  const hasDiscount = product.discount && product.discount > 0;

  // Obtenir l'icône selon le type de produit
  const getProductIcon = () => {
    switch (product.category) {
      case 'coaching':
        return UserGroupIcon;
      case 'consultation':
        return AcademicCapIcon;
      case 'protocol':
        return SparklesIcon;
      case 'premium':
        return StarIcon;
      default:
        return SparklesIcon;
    }
  };

  const ProductIcon = getProductIcon();

  // Obtenir la couleur d'accent selon la catégorie
  const getAccentColor = () => {
    switch (product.category) {
      case 'coaching':
        return 'from-blue-500 to-purple-500';
      case 'consultation':
        return 'from-green-500 to-teal-500';
      case 'protocol':
        return 'from-purple-500 to-pink-500';
      case 'premium':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const accentColor = getAccentColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group ${className}`}
    >
      {/* Badge populaire */}
      {product.popular && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className={`bg-gradient-to-r ${accentColor} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1`}>
            <FireIcon className="h-4 w-4" />
            <span>Populaire</span>
          </div>
        </div>
      )}

      {/* Badge réduction */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
            -{product.discount}%
          </div>
        </div>
      )}

      {/* Carte principale */}
      <div className={`glass-card overflow-hidden h-full ${
        featured ? 'border-2 border-yellow-500/30 shadow-2xl' : ''
      } ${isHovered ? 'shadow-2xl border-white/30' : ''} transition-all duration-300`}>
        
        {/* En-tête avec icône et prix */}
        <div className={`p-6 bg-gradient-to-r ${accentColor} bg-opacity-10 relative`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${accentColor} shadow-lg`}>
              <ProductIcon className="h-8 w-8 text-white" />
            </div>
            
            <div className="text-right">
              {hasDiscount && (
                <div className="text-gray-400 line-through text-sm mb-1">
                  {formatPrice(product.price)}
                </div>
              )}
              <div className="text-2xl font-bold text-white">
                {formatPrice(discountedPrice)}
              </div>
              {product.type === 'subscription' && (
                <div className="text-gray-400 text-sm">/mois</div>
              )}
            </div>
          </div>

          {/* Titre et description */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-yellow-200 transition-all duration-300">
            {product.name}
          </h3>
          
          {product.duration && (
            <div className="flex items-center space-x-2 text-gray-300 text-sm mb-3">
              <ClockIcon className="h-4 w-4" />
              <span>{product.duration}</span>
            </div>
          )}
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Corps de la carte */}
        <div className="p-6 flex-1 flex flex-col">
          
          {/* Caractéristiques principales */}
          <div className="mb-6 flex-1">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
              Caractéristiques
            </h4>
            <ul className="space-y-2">
              {product.features.slice(0, 4).map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2 text-sm text-gray-300"
                >
                  <CheckIcon className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
              
              {product.features.length > 4 && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>{showDetails ? 'Voir moins' : `+${product.features.length - 4} autres`}</span>
                  <ArrowRightIcon className={`h-3 w-3 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                </button>
              )}
            </ul>

            {/* Détails étendus */}
            <motion.div
              initial={false}
              animate={{ height: showDetails ? 'auto' : 0, opacity: showDetails ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {showDetails && (
                <ul className="space-y-2 mt-3">
                  {product.features.slice(4).map((feature, index) => (
                    <li key={index + 4} className="flex items-start space-x-2 text-sm text-gray-300">
                      <CheckIcon className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>

          {/* Témoignages si disponibles */}
          {product.testimonials && product.testimonials.length > 0 && (
            <div className="mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarSolid key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white font-medium text-sm">
                    {product.testimonials[0].name}
                  </span>
                </div>
                <p className="text-gray-300 text-sm italic">
                  "{product.testimonials[0].text}"
                </p>
              </div>
            </div>
          )}

          {/* Informations additionnelles */}
          {(product.maxClients || product.includes.length > 0) && (
            <div className="mb-6 space-y-3">
              {product.maxClients && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Places limitées:</span>
                  <span className="text-yellow-400 font-medium">{product.maxClients} max</span>
                </div>
              )}
              
              {product.includes.length > 0 && (
                <div>
                  <h5 className="text-white font-medium text-sm mb-2">Inclus:</h5>
                  <div className="text-xs text-gray-400 space-y-1">
                    {product.includes.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span>{item}</span>
                      </div>
                    ))}
                    {product.includes.length > 3 && (
                      <div className="text-gray-500">
                        +{product.includes.length - 3} autres éléments...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bouton d'achat */}
          <motion.button
            onClick={() => onPurchase(product)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg relative overflow-hidden group/btn ${
              featured 
                ? `bg-gradient-to-r ${accentColor} hover:shadow-2xl` 
                : `bg-gradient-to-r ${accentColor} hover:shadow-xl`
            } transition-all duration-300`}
          >
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            
            <span className="relative flex items-center justify-center space-x-2">
              {product.category === 'coaching' && <HeartIcon className="h-5 w-5" />}
              {product.category === 'consultation' && <AcademicCapIcon className="h-5 w-5" />}
              {product.category === 'protocol' && <SparklesIcon className="h-5 w-5" />}
              {product.category === 'premium' && <StarIcon className="h-5 w-5" />}
              
              <span>
                {product.type === 'subscription' ? 'S\'abonner' : 'Commander'}
              </span>
              
              <ArrowRightIcon className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          {/* Badge de confiance */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-xs text-gray-400">
              <CheckIcon className="h-4 w-4 text-green-400" />
              <span>Paiement sécurisé Stripe</span>
            </div>
            {product.category === 'coaching' && (
              <div className="inline-flex items-center space-x-2 text-xs text-gray-400 mt-1">
                <HeartIcon className="h-4 w-4 text-red-400" />
                <span>Garantie satisfaction ou remboursé</span>
              </div>
            )}
          </div>
        </div>

        {/* Effet de survol */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;