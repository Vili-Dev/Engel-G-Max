/**
 * G-Maxing Learning System
 * Simple Machine Learning for recommendation improvement
 * 100% Client-side - No external APIs
 */

export interface UserFeedback {
  userId: string;
  protocolId: string;
  rating: number; // 1-5 stars
  completed: boolean;
  effectiveness: number; // 1-10 perceived effectiveness
  difficulty: number; // 1-10 perceived difficulty
  enjoyment: number; // 1-10 enjoyment level
  timestamp: Date;
  comments?: string;
}

export interface LearningData {
  userFeatures: number[];
  protocolFeatures: number[];
  outcome: number; // success metric
  feedback: UserFeedback;
}

export interface ModelWeights {
  collaborativeWeight: number;
  contentWeight: number;
  gMaxingWeight: number;
  progressWeight: number;
  personalizedAdjustments: Map<string, number>;
}

class GMaxingLearningSystem {
  private feedbackHistory: UserFeedback[] = [];
  private modelWeights: ModelWeights;
  private userPersonalization = new Map<string, Map<string, number>>();
  private protocolPerformance = new Map<string, {
    avgRating: number;
    completionRate: number;
    effectivenessScore: number;
    totalFeedbacks: number;
  }>();

  constructor() {
    this.initializeWeights();
    this.loadStoredData();
  }

  private initializeWeights(): void {
    this.modelWeights = {
      collaborativeWeight: 0.2,
      contentWeight: 0.3,
      gMaxingWeight: 0.4,
      progressWeight: 0.1,
      personalizedAdjustments: new Map()
    };
  }

  private loadStoredData(): void {
    try {
      const storedFeedback = localStorage.getItem('gmax-feedback-history');
      if (storedFeedback) {
        this.feedbackHistory = JSON.parse(storedFeedback);
      }

      const storedWeights = localStorage.getItem('gmax-model-weights');
      if (storedWeights) {
        const weights = JSON.parse(storedWeights);
        this.modelWeights = { ...this.modelWeights, ...weights };
      }

      const storedPersonalization = localStorage.getItem('gmax-user-personalization');
      if (storedPersonalization) {
        const data = JSON.parse(storedPersonalization);
        this.userPersonalization = new Map(data);
      }

      this.updateProtocolPerformance();
    } catch (error) {
      console.warn('Failed to load stored learning data:', error);
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem('gmax-feedback-history', JSON.stringify(this.feedbackHistory));
      localStorage.setItem('gmax-model-weights', JSON.stringify(this.modelWeights));
      localStorage.setItem('gmax-user-personalization', JSON.stringify([...this.userPersonalization.entries()]));
    } catch (error) {
      console.warn('Failed to save learning data:', error);
    }
  }

  /**
   * Record user feedback and trigger learning
   */
  public recordFeedback(feedback: UserFeedback): void {
    console.log('🎯 Recording user feedback for learning system');
    
    this.feedbackHistory.push(feedback);
    
    // Limit history to last 10,000 entries to prevent memory issues
    if (this.feedbackHistory.length > 10000) {
      this.feedbackHistory = this.feedbackHistory.slice(-10000);
    }

    this.updateProtocolPerformance();
    this.updateUserPersonalization(feedback);
    this.adaptModelWeights();
    this.saveData();

    console.log(`📊 Learning system updated with feedback for protocol ${feedback.protocolId}`);
  }

  /**
   * Get personalized adjustment factors for a user
   */
  public getPersonalizationFactors(userId: string): Map<string, number> {
    return this.userPersonalization.get(userId) || new Map();
  }

  /**
   * Get current model weights optimized by learning
   */
  public getOptimizedWeights(): ModelWeights {
    return { ...this.modelWeights };
  }

  /**
   * Get protocol performance metrics
   */
  public getProtocolMetrics(protocolId: string) {
    return this.protocolPerformance.get(protocolId);
  }

  /**
   * Update protocol performance metrics
   */
  private updateProtocolPerformance(): void {
    const protocolStats = new Map<string, {
      ratings: number[];
      completions: boolean[];
      effectiveness: number[];
    }>();

    // Aggregate feedback by protocol
    this.feedbackHistory.forEach(feedback => {
      const stats = protocolStats.get(feedback.protocolId) || {
        ratings: [],
        completions: [],
        effectiveness: []
      };

      stats.ratings.push(feedback.rating);
      stats.completions.push(feedback.completed);
      stats.effectiveness.push(feedback.effectiveness);

      protocolStats.set(feedback.protocolId, stats);
    });

    // Calculate metrics
    protocolStats.forEach((stats, protocolId) => {
      const avgRating = stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length;
      const completionRate = stats.completions.filter(c => c).length / stats.completions.length;
      const effectivenessScore = stats.effectiveness.reduce((a, b) => a + b, 0) / stats.effectiveness.length;

      this.protocolPerformance.set(protocolId, {
        avgRating,
        completionRate,
        effectivenessScore,
        totalFeedbacks: stats.ratings.length
      });
    });
  }

  /**
   * Update user personalization based on feedback patterns
   */
  private updateUserPersonalization(feedback: UserFeedback): void {
    const userId = feedback.userId;
    let userFactors = this.userPersonalization.get(userId) || new Map();

    // Analyze user preferences from feedback
    const userFeedbacks = this.feedbackHistory.filter(f => f.userId === userId);
    
    if (userFeedbacks.length < 3) return; // Need sufficient data

    // Calculate preference factors
    const avgRating = userFeedbacks.reduce((sum, f) => sum + f.rating, 0) / userFeedbacks.length;
    const avgEffectiveness = userFeedbacks.reduce((sum, f) => sum + f.effectiveness, 0) / userFeedbacks.length;
    const avgDifficulty = userFeedbacks.reduce((sum, f) => sum + f.difficulty, 0) / userFeedbacks.length;
    const avgEnjoyment = userFeedbacks.reduce((sum, f) => sum + f.enjoyment, 0) / userFeedbacks.length;

    // Preference for difficulty level
    if (avgDifficulty > 7) {
      userFactors.set('prefers-high-difficulty', 1.2);
    } else if (avgDifficulty < 4) {
      userFactors.set('prefers-low-difficulty', 1.2);
    }

    // Preference for effectiveness
    if (avgEffectiveness > 8) {
      userFactors.set('effectiveness-focused', 1.3);
    }

    // Enjoyment factor
    if (avgEnjoyment > 8) {
      userFactors.set('enjoyment-important', 1.1);
    }

    // Success rate adjustment
    const completionRate = userFeedbacks.filter(f => f.completed).length / userFeedbacks.length;
    if (completionRate > 0.8) {
      userFactors.set('high-completion', 1.15);
    } else if (completionRate < 0.5) {
      userFactors.set('needs-simpler-protocols', 1.25);
    }

    this.userPersonalization.set(userId, userFactors);
  }

  /**
   * Adapt model weights based on overall feedback patterns
   */
  private adaptModelWeights(): void {
    if (this.feedbackHistory.length < 50) return; // Need sufficient data

    // Analyze which recommendation components correlate with success
    const recentFeedbacks = this.feedbackHistory.slice(-500); // Last 500 feedbacks
    
    // Simple correlation analysis
    let collaborativeSuccess = 0;
    let contentSuccess = 0;
    let gMaxingSuccess = 0;
    let progressSuccess = 0;

    recentFeedbacks.forEach(feedback => {
      const successScore = (feedback.rating + feedback.effectiveness) / 2;
      
      // This is a simplified correlation - in practice, you'd track which
      // component contributed most to each recommendation
      if (successScore > 6) {
        collaborativeSuccess += 0.2;
        contentSuccess += 0.3;
        gMaxingSuccess += 0.4;
        progressSuccess += 0.1;
      }
    });

    // Normalize and adjust weights
    const totalSuccess = collaborativeSuccess + contentSuccess + gMaxingSuccess + progressSuccess;
    if (totalSuccess > 0) {
      this.modelWeights.collaborativeWeight = Math.max(0.1, Math.min(0.4, collaborativeSuccess / totalSuccess));
      this.modelWeights.contentWeight = Math.max(0.1, Math.min(0.4, contentSuccess / totalSuccess));
      this.modelWeights.gMaxingWeight = Math.max(0.3, Math.min(0.6, gMaxingSuccess / totalSuccess)); // Keep G-Maxing prominent
      this.modelWeights.progressWeight = Math.max(0.05, Math.min(0.2, progressSuccess / totalSuccess));

      console.log('🎯 Model weights adapted:', this.modelWeights);
    }
  }

  /**
   * Predict user satisfaction for a protocol
   */
  public predictSatisfaction(userId: string, protocolId: string): {
    predictedRating: number;
    confidence: number;
    factors: string[];
  } {
    const userFactors = this.userPersonalization.get(userId);
    const protocolMetrics = this.protocolPerformance.get(protocolId);

    let predictedRating = 3.5; // Baseline
    let confidence = 0.3; // Base confidence
    const factors: string[] = [];

    // Use protocol historical performance
    if (protocolMetrics) {
      predictedRating = protocolMetrics.avgRating * 0.6 + predictedRating * 0.4;
      confidence += 0.2;
      factors.push(`Performance historique: ${protocolMetrics.avgRating.toFixed(1)}/5`);
    }

    // Apply user personalization factors
    if (userFactors && userFactors.size > 0) {
      userFactors.forEach((factor, key) => {
        if (factor > 1) {
          predictedRating *= factor;
          confidence += 0.1;
          factors.push(`Préférence utilisateur: ${key}`);
        }
      });
    }

    // Normalize rating to 1-5 scale
    predictedRating = Math.max(1, Math.min(5, predictedRating));
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      predictedRating,
      confidence,
      factors
    };
  }

  /**
   * Get insights about user preferences
   */
  public getUserInsights(userId: string): {
    totalFeedbacks: number;
    averageRating: number;
    completionRate: number;
    preferredDifficulty: string;
    topProtocols: string[];
    recommendations: string[];
  } {
    const userFeedbacks = this.feedbackHistory.filter(f => f.userId === userId);

    if (userFeedbacks.length === 0) {
      return {
        totalFeedbacks: 0,
        averageRating: 0,
        completionRate: 0,
        preferredDifficulty: 'unknown',
        topProtocols: [],
        recommendations: ['Essayez plus de protocoles pour des recommandations personnalisées']
      };
    }

    const totalFeedbacks = userFeedbacks.length;
    const averageRating = userFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks;
    const completionRate = userFeedbacks.filter(f => f.completed).length / totalFeedbacks;
    const avgDifficulty = userFeedbacks.reduce((sum, f) => sum + f.difficulty, 0) / totalFeedbacks;

    let preferredDifficulty = 'intermediate';
    if (avgDifficulty > 7) preferredDifficulty = 'advanced';
    else if (avgDifficulty < 4) preferredDifficulty = 'beginner';

    // Top rated protocols
    const protocolRatings = new Map<string, number[]>();
    userFeedbacks.forEach(f => {
      const ratings = protocolRatings.get(f.protocolId) || [];
      ratings.push(f.rating);
      protocolRatings.set(f.protocolId, ratings);
    });

    const topProtocols = [...protocolRatings.entries()]
      .map(([id, ratings]) => ({
        id,
        avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3)
      .map(p => p.id);

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (completionRate < 0.5) {
      recommendations.push('Considérez des protocoles plus courts ou moins intensifs');
    }
    
    if (averageRating > 4) {
      recommendations.push('Vous réussissez bien ! Essayez des protocoles plus avancés');
    }
    
    if (avgDifficulty < 4 && completionRate > 0.8) {
      recommendations.push('Vous êtes prêt pour des défis plus difficiles');
    }

    return {
      totalFeedbacks,
      averageRating,
      completionRate,
      preferredDifficulty,
      topProtocols,
      recommendations
    };
  }

  /**
   * Export learning data for analysis
   */
  public exportLearningData(): {
    totalFeedbacks: number;
    protocolPerformance: Array<{
      protocolId: string;
      avgRating: number;
      completionRate: number;
      effectivenessScore: number;
      totalFeedbacks: number;
    }>;
    modelWeights: ModelWeights;
    userInsights: Array<{
      userId: string;
      totalFeedbacks: number;
      averageRating: number;
      completionRate: number;
    }>;
  } {
    const protocolPerformance: any[] = [];
    this.protocolPerformance.forEach((metrics, protocolId) => {
      protocolPerformance.push({
        protocolId,
        ...metrics
      });
    });

    const userInsights: any[] = [];
    const userIds = [...new Set(this.feedbackHistory.map(f => f.userId))];
    userIds.forEach(userId => {
      const insights = this.getUserInsights(userId);
      userInsights.push({
        userId,
        totalFeedbacks: insights.totalFeedbacks,
        averageRating: insights.averageRating,
        completionRate: insights.completionRate
      });
    });

    return {
      totalFeedbacks: this.feedbackHistory.length,
      protocolPerformance: protocolPerformance.sort((a, b) => b.avgRating - a.avgRating),
      modelWeights: this.modelWeights,
      userInsights: userInsights.sort((a, b) => b.totalFeedbacks - a.totalFeedbacks)
    };
  }

  /**
   * Reset learning system (for testing or privacy)
   */
  public resetLearningSystem(): void {
    this.feedbackHistory = [];
    this.userPersonalization.clear();
    this.protocolPerformance.clear();
    this.initializeWeights();
    
    localStorage.removeItem('gmax-feedback-history');
    localStorage.removeItem('gmax-model-weights');
    localStorage.removeItem('gmax-user-personalization');

    console.log('🔄 G-Maxing Learning System reset');
  }
}

// Export singleton instance
export const gMaxingLearningSystem = new GMaxingLearningSystem();
export default GMaxingLearningSystem;