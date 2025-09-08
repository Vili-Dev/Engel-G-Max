import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  gMaxingRecommendationEngine,
  RecommendationScore,
  RecommendationContext,
  UserProfile
} from '../utils/algorithms/recommendationEngine';
import { 
  gMaxingLearningSystem,
  UserFeedback
} from '../utils/algorithms/learningSystem';
import { Protocol, User, WorkoutSession, ProgressData } from '../types';

interface UseRecommendationsOptions {
  maxRecommendations?: number;
  refreshInterval?: number; // milliseconds
  enableLearning?: boolean;
}

interface RecommendationState {
  recommendations: RecommendationScore[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useRecommendations = (
  user: User | null,
  options: UseRecommendationsOptions = {}
) => {
  const {
    maxRecommendations = 5,
    refreshInterval = 300000, // 5 minutes
    enableLearning = true
  } = options;

  const [state, setState] = useState<RecommendationState>({
    recommendations: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [context, setContext] = useState<RecommendationContext | null>(null);

  // Convert User to UserProfile
  const createUserProfile = useCallback((user: User): UserProfile => {
    return {
      id: user.id,
      age: user.profile?.age || 25,
      weight: user.profile?.weight || 70,
      height: user.profile?.height || 175,
      fitnessLevel: user.profile?.fitnessLevel || 'intermediate',
      goals: user.profile?.goals || ['muscle-gain', 'strength'],
      preferences: user.profile?.preferences || [],
      medicalConditions: user.profile?.medicalConditions || [],
      availableTime: user.profile?.availableTime || 60,
      frequency: user.profile?.frequency || 3,
      equipment: user.profile?.equipment || ['dumbbells', 'barbell'],
      experience: user.profile?.experience || {}
    };
  }, []);

  // Update user profile when user changes
  useEffect(() => {
    if (user) {
      const profile = createUserProfile(user);
      setUserProfile(profile);
      
      // Create recommendation context
      const newContext: RecommendationContext = {
        userProfile: profile,
        currentProgress: user.progress,
        recentSessions: user.recentSessions,
        seasonality: user.profile?.currentPhase || 'maintain',
        availability: user.profile?.availability || 'medium'
      };
      setContext(newContext);
    } else {
      setUserProfile(null);
      setContext(null);
    }
  }, [user, createUserProfile]);

  // Generate recommendations
  const generateRecommendations = useCallback(async () => {
    if (!context) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🧠 Generating G-Maxing recommendations...');
      
      // Apply learning system optimizations
      let optimizedMaxRecs = maxRecommendations;
      if (enableLearning) {
        const userInsights = gMaxingLearningSystem.getUserInsights(context.userProfile.id);
        // Adjust recommendations based on user feedback history
        if (userInsights.totalFeedbacks > 10) {
          optimizedMaxRecs = Math.max(3, Math.min(8, maxRecommendations + 2));
        }
      }

      const recommendations = gMaxingRecommendationEngine.recommendProtocols(
        context,
        optimizedMaxRecs
      );

      // Enhance recommendations with learning insights
      if (enableLearning) {
        for (const rec of recommendations) {
          const prediction = gMaxingLearningSystem.predictSatisfaction(
            context.userProfile.id,
            rec.protocolId
          );
          
          // Adjust score based on predicted satisfaction
          rec.score = rec.score * 0.7 + (prediction.predictedRating / 5) * 0.3;
          
          // Add prediction insights to reasons
          if (prediction.confidence > 0.5) {
            rec.reasons.push(`Satisfaction prédite: ${prediction.predictedRating.toFixed(1)}/5`);
          }
        }

        // Re-sort after learning adjustments
        recommendations.sort((a, b) => b.score - a.score);
      }

      setState(prev => ({
        ...prev,
        recommendations,
        isLoading: false,
        lastUpdated: new Date()
      }));

      console.log(`✅ Generated ${recommendations.length} recommendations`);
    } catch (error) {
      console.error('❌ Failed to generate recommendations:', error);
      setState(prev => ({
        ...prev,
        recommendations: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [context, maxRecommendations, enableLearning]);

  // Auto-refresh recommendations
  useEffect(() => {
    if (context && refreshInterval > 0) {
      generateRecommendations();
      
      const interval = setInterval(generateRecommendations, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [context, generateRecommendations, refreshInterval]);

  // Manual refresh
  const refreshRecommendations = useCallback(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  // Record feedback for learning
  const recordFeedback = useCallback((feedback: Omit<UserFeedback, 'userId' | 'timestamp'>) => {
    if (!user || !enableLearning) return;

    const fullFeedback: UserFeedback = {
      ...feedback,
      userId: user.id,
      timestamp: new Date()
    };

    gMaxingLearningSystem.recordFeedback(fullFeedback);
    
    // Trigger recommendation refresh after feedback
    setTimeout(() => {
      generateRecommendations();
    }, 1000);
  }, [user, enableLearning, generateRecommendations]);

  // Get personalization insights
  const getPersonalizationInsights = useCallback(() => {
    if (!user) return null;
    
    return gMaxingLearningSystem.getUserInsights(user.id);
  }, [user]);

  // Memoized recommendations with additional metadata
  const enhancedRecommendations = useMemo(() => {
    return state.recommendations.map(rec => ({
      ...rec,
      personalizedFactors: enableLearning 
        ? gMaxingLearningSystem.getPersonalizationFactors(user?.id || '')
        : new Map(),
      protocolMetrics: enableLearning
        ? gMaxingLearningSystem.getProtocolMetrics(rec.protocolId)
        : undefined
    }));
  }, [state.recommendations, enableLearning, user?.id]);

  return {
    // State
    recommendations: enhancedRecommendations,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Profile
    userProfile,
    
    // Actions
    refreshRecommendations,
    recordFeedback,
    getPersonalizationInsights,
    
    // Utilities
    isReady: !!context && !state.isLoading,
    hasRecommendations: state.recommendations.length > 0
  };
};

/**
 * Hook for quick protocol recommendations without full state management
 */
export const useQuickRecommendations = (userGoals: string[], fitnessLevel: string) => {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateQuickRecs = async () => {
      setIsLoading(true);

      // Create minimal user profile for quick recommendations
      const quickProfile: UserProfile = {
        id: 'guest',
        age: 30,
        weight: 75,
        height: 175,
        fitnessLevel: fitnessLevel as any,
        goals: userGoals,
        preferences: [],
        medicalConditions: [],
        availableTime: 60,
        frequency: 3,
        equipment: ['dumbbells', 'barbell', 'bodyweight'],
        experience: {}
      };

      const context: RecommendationContext = {
        userProfile: quickProfile
      };

      try {
        const recs = gMaxingRecommendationEngine.recommendProtocols(context, 3);
        setRecommendations(recs);
      } catch (error) {
        console.error('Quick recommendations failed:', error);
        setRecommendations([]);
      }

      setIsLoading(false);
    };

    if (userGoals.length > 0) {
      generateQuickRecs();
    }
  }, [userGoals, fitnessLevel]);

  return {
    recommendations,
    isLoading
  };
};

/**
 * Hook for recommendation analytics and insights
 */
export const useRecommendationAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  const loadAnalytics = useCallback(() => {
    const data = gMaxingLearningSystem.exportLearningData();
    setAnalytics(data);
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const resetSystem = useCallback(() => {
    gMaxingLearningSystem.resetLearningSystem();
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    analytics,
    refreshAnalytics: loadAnalytics,
    resetSystem
  };
};