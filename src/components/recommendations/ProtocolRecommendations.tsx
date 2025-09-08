import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  StarIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  HeartIcon,
  ChartBarIcon,
  BoltIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

// Components
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

// Hooks
import { useRecommendations } from '../../hooks/useRecommendations';
import { useTranslation } from '../../hooks/useTranslation';

// Types
import { User } from '../../types';
import { RecommendationScore } from '../../utils/algorithms/recommendationEngine';
import { UserFeedback } from '../../utils/algorithms/learningSystem';

interface ProtocolRecommendationsProps {
  user: User | null;
  maxRecommendations?: number;
  showFeedback?: boolean;
  onProtocolSelect?: (protocolId: string) => void;
}

interface FeedbackModalProps {
  protocolId: string;
  protocolName: string;
  onSubmit: (feedback: Omit<UserFeedback, 'userId' | 'timestamp'>) => void;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  protocolId, 
  protocolName, 
  onSubmit, 
  onClose 
}) => {
  const [rating, setRating] = useState(5);
  const [completed, setCompleted] = useState(true);
  const [effectiveness, setEffectiveness] = useState(8);
  const [difficulty, setDifficulty] = useState(6);
  const [enjoyment, setEnjoyment] = useState(7);
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    onSubmit({
      protocolId,
      rating,
      completed,
      effectiveness,
      difficulty,
      enjoyment,
      comments: comments.trim() || undefined
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="m-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                📊 Feedback pour {protocolName}
              </h3>
              <p className="text-gray-300">
                Votre feedback améliore nos recommandations G-Maxing
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-white font-medium mb-3">
                Note globale (1-5 étoiles)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <StarIcon
                      className={`h-8 w-8 ${
                        star <= rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Completed */}
            <div>
              <label className="block text-white font-medium mb-3">
                Avez-vous terminé ce protocole ?
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCompleted(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    completed 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  ✅ Oui, terminé
                </button>
                <button
                  onClick={() => setCompleted(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !completed 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  ⏸️ Non, arrêté
                </button>
              </div>
            </div>

            {/* Effectiveness */}
            <div>
              <label className="block text-white font-medium mb-3">
                Efficacité perçue (1-10)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={effectiveness}
                  onChange={(e) => setEffectiveness(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-primary-400 font-bold text-xl min-w-[2rem]">
                  {effectiveness}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Peu efficace</span>
                <span>Très efficace</span>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-white font-medium mb-3">
                Difficulté ressentie (1-10)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-primary-400 font-bold text-xl min-w-[2rem]">
                  {difficulty}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Très facile</span>
                <span>Très difficile</span>
              </div>
            </div>

            {/* Enjoyment */}
            <div>
              <label className="block text-white font-medium mb-3">
                Plaisir d'entraînement (1-10)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={enjoyment}
                  onChange={(e) => setEnjoyment(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-primary-400 font-bold text-xl min-w-[2rem]">
                  {enjoyment}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Ennuyeux</span>
                <span>Très plaisant</span>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-white font-medium mb-3">
                Commentaires (optionnel)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Partagez votre expérience avec ce protocole G-Maxing..."
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-primary-500 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-4 pt-4">
              <Button
                variant="primary"
                className="flex-1 glass-btn-primary"
                onClick={handleSubmit}
              >
                📊 Envoyer le Feedback
              </Button>
              <Button
                variant="ghost"
                className="px-6"
                onClick={onClose}
              >
                Annuler
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

const RecommendationCard: React.FC<{
  recommendation: RecommendationScore & {
    personalizedFactors: Map<string, number>;
    protocolMetrics?: any;
  };
  onSelect?: (protocolId: string) => void;
  onFeedback?: (protocolId: string) => void;
}> = ({ recommendation, onSelect, onFeedback }) => {
  const { formatNumber } = useTranslation();

  // Mock protocol data (in real app, this would come from protocol database)
  const getProtocolInfo = (protocolId: string) => {
    const protocols = {
      'gmax-strength-foundation': {
        name: 'G-Maxing Strength Foundation',
        category: 'Strength',
        duration: '8 semaines',
        frequency: '3x/semaine',
        equipment: ['Barbell', 'Dumbbells', 'Bench'],
        icon: <TrophyIcon className="h-6 w-6" />,
        color: 'from-red-500 to-red-600'
      },
      'gmax-hypertrophy-accelerated': {
        name: 'G-Maxing Hypertrophy Accelerated',
        category: 'Hypertrophy',
        duration: '12 semaines',
        frequency: '4x/semaine',
        equipment: ['Full Gym'],
        icon: <FireIcon className="h-6 w-6" />,
        color: 'from-orange-500 to-orange-600'
      },
      'gmax-fat-loss-metabolic': {
        name: 'G-Maxing Metabolic Fat Loss',
        category: 'Fat Loss',
        duration: '6 semaines',
        frequency: '5x/semaine',
        equipment: ['Minimal'],
        icon: <BoltIcon className="h-6 w-6" />,
        color: 'from-green-500 to-green-600'
      },
      'gmax-powerlifting-elite': {
        name: 'G-Maxing Elite Powerlifting',
        category: 'Powerlifting',
        duration: '16 semaines',
        frequency: '4x/semaine',
        equipment: ['Powerlifting Gym'],
        icon: <ChartBarIcon className="h-6 w-6" />,
        color: 'from-purple-500 to-purple-600'
      }
    };

    return protocols[protocolId as keyof typeof protocols] || {
      name: 'Unknown Protocol',
      category: 'General',
      duration: 'Variable',
      frequency: 'Variable',
      equipment: ['Various'],
      icon: <SparklesIcon className="h-6 w-6" />,
      color: 'from-gray-500 to-gray-600'
    };
  };

  const protocol = getProtocolInfo(recommendation.protocolId);
  const scorePercentage = Math.round(recommendation.score * 100);
  const confidencePercentage = Math.round(recommendation.confidence * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-6 h-full hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${protocol.color} opacity-5`} />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${protocol.color}`}>
                {protocol.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  {protocol.name}
                </h3>
                <p className="text-primary-400 text-sm font-medium">
                  {protocol.category}
                </p>
              </div>
            </div>
            
            {/* Score Badge */}
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-400">
                {scorePercentage}%
              </div>
              <div className="text-xs text-gray-400">
                Compatibilité
              </div>
            </div>
          </div>

          {/* Protocol Info */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <ClockIcon className="h-4 w-4" />
              <span>{protocol.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ChartBarIcon className="h-4 w-4" />
              <span>{protocol.frequency}</span>
            </div>
          </div>

          {/* Equipment */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {protocol.equipment.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* G-Maxing Compatibility */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-300">G-Maxing Compatibility</span>
              <span className="text-primary-400 font-bold">
                {Math.round(recommendation.gMaxingCompatibility * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${recommendation.gMaxingCompatibility * 100}%` }}
              />
            </div>
          </div>

          {/* Reasons */}
          <div className="mb-6">
            <h4 className="text-white font-medium text-sm mb-2 flex items-center">
              <LightBulbIcon className="h-4 w-4 mr-1 text-primary-400" />
              Pourquoi ce protocole ?
            </h4>
            <div className="space-y-2">
              {recommendation.reasons.slice(0, 2).map((reason, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          {recommendation.protocolMetrics && (
            <div className="mb-6 p-3 bg-black/20 rounded-lg">
              <h4 className="text-white font-medium text-sm mb-2">
                📊 Performance Communautaire
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-primary-400 font-bold">
                    {recommendation.protocolMetrics.avgRating.toFixed(1)}
                  </div>
                  <div className="text-gray-400">Note Moy.</div>
                </div>
                <div className="text-center">
                  <div className="text-primary-400 font-bold">
                    {Math.round(recommendation.protocolMetrics.completionRate * 100)}%
                  </div>
                  <div className="text-gray-400">Terminé</div>
                </div>
                <div className="text-center">
                  <div className="text-primary-400 font-bold">
                    {formatNumber(recommendation.protocolMetrics.totalFeedbacks)}
                  </div>
                  <div className="text-gray-400">Avis</div>
                </div>
              </div>
            </div>
          )}

          {/* Confidence Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Confiance de la recommandation</span>
              <span className="text-primary-400">{confidencePercentage}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="primary"
              className="flex-1 glass-btn-primary text-sm"
              onClick={() => onSelect?.(recommendation.protocolId)}
            >
              Commencer
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Button>
            
            {onFeedback && (
              <Button
                variant="ghost"
                className="text-primary-400 hover:text-primary-300 text-sm px-3"
                onClick={() => onFeedback(recommendation.protocolId)}
              >
                💬
              </Button>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const ProtocolRecommendations: React.FC<ProtocolRecommendationsProps> = ({
  user,
  maxRecommendations = 5,
  showFeedback = true,
  onProtocolSelect
}) => {
  const { t } = useTranslation();
  const [feedbackModal, setFeedbackModal] = useState<{
    protocolId: string;
    protocolName: string;
  } | null>(null);

  const {
    recommendations,
    isLoading,
    error,
    lastUpdated,
    refreshRecommendations,
    recordFeedback,
    getPersonalizationInsights,
    isReady,
    hasRecommendations
  } = useRecommendations(user, {
    maxRecommendations,
    enableLearning: showFeedback
  });

  const handleFeedback = (protocolId: string) => {
    const protocolName = `Protocol ${protocolId}`; // In real app, get from protocol database
    setFeedbackModal({ protocolId, protocolName });
  };

  const handleFeedbackSubmit = (feedback: Omit<UserFeedback, 'userId' | 'timestamp'>) => {
    recordFeedback(feedback);
    setFeedbackModal(null);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <SparklesIcon className="h-12 w-12 mx-auto mb-4" />
          <p>Connectez-vous pour obtenir des recommandations G-Maxing personnalisées</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="text-gray-300 mt-4">
          🧠 Génération de vos recommandations G-Maxing...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <XMarkIcon className="h-12 w-12 mx-auto mb-4" />
          <p>Erreur lors de la génération des recommandations</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
        <Button
          variant="secondary"
          onClick={refreshRecommendations}
          className="glass-btn-secondary"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <SparklesIcon className="h-7 w-7 text-primary-400 mr-2" />
            Protocoles G-Maxing Recommandés
          </h2>
          <p className="text-gray-300 mt-1">
            Sélectionnés spécialement pour vous par l'IA Engel Garcia Gomez
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              Dernière mise à jour: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <Button
          variant="ghost"
          onClick={refreshRecommendations}
          className="text-primary-400 hover:text-primary-300"
        >
          🔄 Actualiser
        </Button>
      </div>

      {/* Personalization Insights */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <HeartIcon className="h-5 w-5 text-primary-400" />
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm">
                  Personnalisation Active
                </h3>
                <p className="text-gray-300 text-xs">
                  Plus vous donnez de feedback, plus nos recommandations s'améliorent
                </p>
              </div>
              {getPersonalizationInsights && (
                <div className="text-primary-400 text-sm font-bold">
                  {getPersonalizationInsights()?.totalFeedbacks || 0} feedback
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Recommendations Grid */}
      {hasRecommendations ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.protocolId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RecommendationCard
                recommendation={recommendation}
                onSelect={onProtocolSelect}
                onFeedback={showFeedback ? handleFeedback : undefined}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <SparklesIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300 mb-4">
            Aucune recommandation disponible pour le moment
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Complétez votre profil pour obtenir des recommandations personnalisées
          </p>
          <Button
            variant="primary"
            className="glass-btn-primary"
            onClick={refreshRecommendations}
          >
            Générer des Recommandations
          </Button>
        </div>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackModal && (
          <FeedbackModal
            protocolId={feedbackModal.protocolId}
            protocolName={feedbackModal.protocolName}
            onSubmit={handleFeedbackSubmit}
            onClose={() => setFeedbackModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProtocolRecommendations;