/**
 * Modal de Checkout Stripe G-Maxing
 * Interface de paiement sécurisée pour les services d'Engel Garcia Gomez
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  XMarkIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  GMaxingProduct, 
  formatPrice, 
  calculateDiscountedPrice,
  calculatePriceWithTax,
  validateCoupon,
  calculateDiscount,
  GMAX_COUPONS,
  DiscountCoupon
} from '../../utils/ecommerce/stripeConfig';
import { initializeStripe } from '../../utils/ecommerce/stripeConfig';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: GMaxingProduct;
  user?: {
    uid: string;
    email?: string;
    displayName?: string;
  };
  onSuccess?: (sessionId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  user,
  onSuccess
}) => {
  const { t } = useTranslation();
  
  // États du composant
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'details' | 'payment' | 'processing'>('details');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Calculs de prix
  const basePrice = calculateDiscountedPrice(product);
  const discountAmount = appliedCoupon ? calculateDiscount(basePrice, appliedCoupon) : 0;
  const subtotal = basePrice - discountAmount;
  const taxAmount = calculatePriceWithTax(subtotal, product.category) - subtotal;
  const totalPrice = subtotal + taxAmount;

  // Réinitialiser les états quand la modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setError(null);
      setCouponCode('');
      setAppliedCoupon(null);
      setCouponError(null);
    }
  }, [isOpen]);

  /**
   * Appliquer un coupon de réduction
   */
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Veuillez saisir un code promo');
      return;
    }

    const validation = validateCoupon(couponCode, [product.id], basePrice);
    
    if (validation.valid && validation.coupon) {
      setAppliedCoupon(validation.coupon);
      setCouponError(null);
      console.log('✅ Coupon appliqué:', validation.coupon.code);
    } else {
      setCouponError(validation.error || 'Code promo invalide');
      setAppliedCoupon(null);
    }
  };

  /**
   * Retirer le coupon appliqué
   */
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  /**
   * Procéder au paiement Stripe
   */
  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    setStep('processing');

    try {
      console.log('💳 Initialisation du paiement Stripe...');
      
      const stripe = await initializeStripe();
      if (!stripe) {
        throw new Error('Impossible d\'initialiser Stripe');
      }

      // Simuler l'appel à l'API backend pour créer une session Stripe
      // En production, ceci serait un appel à votre API backend
      const sessionData = {
        productId: product.id,
        userId: user?.uid,
        userEmail: user?.email,
        couponCode: appliedCoupon?.code,
        metadata: {
          productName: product.name,
          coach: 'Engel Garcia Gomez',
          method: 'G-Maxing'
        }
      };

      console.log('📤 Données session:', sessionData);

      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En production, remplacer par un vrai appel API
      const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simuler la redirection Stripe Checkout
      if (onSuccess) {
        onSuccess(mockSessionId);
      }
      
      // En production, utiliser:
      // const { error } = await stripe.redirectToCheckout({ sessionId: mockSessionId });
      // if (error) throw error;

      console.log('✅ Paiement initié avec succès');
      onClose();

    } catch (error) {
      console.error('❌ Erreur paiement:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du paiement');
      setStep('details');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Valider les détails avant le paiement
   */
  const validateAndProceed = () => {
    if (!user) {
      setError('Vous devez être connecté pour effectuer un achat');
      return;
    }

    if (!user.email) {
      setError('Une adresse email est requise pour la facturation');
      return;
    }

    setStep('payment');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* En-tête */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              {step === 'payment' && (
                <button
                  onClick={() => setStep('details')}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              )}
              <div>
                <h2 className="text-xl font-bold text-white">
                  {step === 'details' && 'Détails de la commande'}
                  {step === 'payment' && 'Paiement sécurisé'}
                  {step === 'processing' && 'Traitement en cours...'}
                </h2>
                <p className="text-gray-400 text-sm">
                  Coaching G-Maxing avec Engel Garcia Gomez
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6">
            {/* Étape 1: Détails */}
            {step === 'details' && (
              <div className="space-y-6">
                {/* Produit sélectionné */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                      <SparklesIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {product.description}
                      </p>
                      
                      {/* Caractéristiques principales */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                            <CheckCircleIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code promo */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <TagIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    Code promo
                  </h4>
                  
                  {!appliedCoupon ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Entrez votre code promo"
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Appliquer
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        <span className="text-green-400 font-medium">{appliedCoupon.code}</span>
                        <span className="text-gray-300 text-sm">- {appliedCoupon.description}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-400 hover:text-red-300 text-sm underline"
                      >
                        Retirer
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {couponError}
                    </p>
                  )}

                  {/* Codes promo suggérés */}
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm mb-2">Codes promo disponibles :</p>
                    <div className="flex flex-wrap gap-2">
                      {GMAX_COUPONS.slice(0, 3).map((coupon) => (
                        <button
                          key={coupon.code}
                          onClick={() => setCouponCode(coupon.code)}
                          className="text-xs bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-lg px-3 py-1 text-gray-300 hover:text-white transition-all duration-200"
                        >
                          {coupon.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Résumé des prix */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-semibold mb-4">Résumé de la commande</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Prix de base</span>
                      <span>{formatPrice(basePrice)}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Réduction ({appliedCoupon?.code})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-300">
                      <span>Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    {taxAmount > 0 && (
                      <div className="flex justify-between text-gray-300 text-sm">
                        <span>TVA (20%)</span>
                        <span>{formatPrice(taxAmount)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      {product.type === 'subscription' && (
                        <p className="text-gray-400 text-sm text-right mt-1">
                          Facturation mensuelle
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations utilisateur */}
                {user ? (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">Informations de facturation</h4>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p><span className="text-gray-400">Email:</span> {user.email}</p>
                      {user.displayName && (
                        <p><span className="text-gray-400">Nom:</span> {user.displayName}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-orange-400">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <p className="font-medium">Connexion requise</p>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                      Vous devez être connecté pour effectuer un achat.
                    </p>
                  </div>
                )}

                {/* Erreur */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-red-400">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {/* Bouton continuer */}
                <button
                  onClick={validateAndProceed}
                  disabled={!user}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Continuer vers le paiement
                </button>
              </div>
            )}

            {/* Étape 2: Paiement */}
            {step === 'payment' && (
              <div className="space-y-6">
                {/* Récapitulatif */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{formatPrice(totalPrice)}</p>
                      {product.type === 'subscription' && (
                        <p className="text-gray-400 text-sm">/mois</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations de sécurité */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-green-400 mb-2">
                    <ShieldCheckIcon className="h-5 w-5" />
                    <h4 className="font-medium">Paiement 100% sécurisé</h4>
                  </div>
                  <ul className="text-green-300 text-sm space-y-1">
                    <li>• Chiffrement SSL 256-bit</li>
                    <li>• Traitement sécurisé par Stripe</li>
                    <li>• Vos données bancaires ne sont jamais stockées</li>
                    <li>• Garantie satisfaction 30 jours</li>
                  </ul>
                </div>

                {/* Bouton de paiement */}
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <CreditCardIcon className="h-6 w-6" />
                  <span>
                    {isLoading ? 'Redirection...' : `Payer ${formatPrice(totalPrice)}`}
                  </span>
                </button>

                <p className="text-center text-gray-400 text-xs">
                  En cliquant sur "Payer", vous acceptez nos conditions de vente et êtes redirigé vers Stripe pour le paiement sécurisé.
                </p>
              </div>
            )}

            {/* Étape 3: Traitement */}
            {step === 'processing' && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-blue-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Traitement de votre paiement...
                </h3>
                <p className="text-gray-400">
                  Vous allez être redirigé vers Stripe pour finaliser votre achat.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;