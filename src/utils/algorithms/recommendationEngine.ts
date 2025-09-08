/**
 * G-Maxing Smart Recommendation Engine
 * 100% Free - No External APIs Required
 * 
 * Advanced collaborative filtering and content-based recommendations
 * specifically designed for Engel Garcia Gomez's G-Maxing methodology
 */

import { Protocol, User, WorkoutSession, ProgressData } from '../../types';

// User profile analysis types
export interface UserProfile {
  id: string;
  age: number;
  weight: number;
  height: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  goals: string[];
  preferences: string[];
  medicalConditions: string[];
  availableTime: number; // minutes per session
  frequency: number; // sessions per week
  equipment: string[];
  experience: Record<string, number>; // exercise -> years of experience
}

export interface RecommendationScore {
  protocolId: string;
  score: number;
  reasons: string[];
  confidence: number;
  gMaxingCompatibility: number;
}

export interface RecommendationContext {
  userProfile: UserProfile;
  currentProgress?: ProgressData;
  recentSessions?: WorkoutSession[];
  seasonality?: 'bulk' | 'cut' | 'maintain' | 'competition';
  availability?: 'low' | 'medium' | 'high';
}

class GMaxingRecommendationEngine {
  private protocols: Protocol[] = [];
  private userSimilarityCache = new Map<string, Map<string, number>>();
  private protocolEmbeddings = new Map<string, number[]>();

  constructor() {
    this.initializeEngine();
  }

  /**
   * Initialize the recommendation engine with G-Maxing specific parameters
   */
  private initializeEngine(): void {
    console.log('🧠 Initializing G-Maxing Recommendation Engine...');
    this.loadGMaxingProtocols();
    this.precomputeEmbeddings();
  }

  /**
   * Load G-Maxing specific protocols and methodologies
   */
  private loadGMaxingProtocols(): void {
    // This would normally load from database
    // For demo purposes, we'll use hardcoded protocols
    this.protocols = [
      {
        id: 'gmax-strength-foundation',
        name: 'G-Maxing Strength Foundation',
        category: 'strength',
        difficulty: 'beginner',
        duration: 8, // weeks
        frequency: 3,
        equipment: ['barbell', 'dumbbells', 'bench'],
        goals: ['strength', 'muscle-gain'],
        principles: ['progressive-overload', 'compound-movements', 'genetic-optimization'],
        targetMuscles: ['chest', 'back', 'legs', 'shoulders'],
        metabolicDemand: 'moderate',
        recoveryRequirement: 'standard'
      },
      {
        id: 'gmax-hypertrophy-accelerated',
        name: 'G-Maxing Hypertrophy Accelerated',
        category: 'hypertrophy',
        difficulty: 'intermediate',
        duration: 12,
        frequency: 4,
        equipment: ['barbell', 'dumbbells', 'cables', 'machines'],
        goals: ['muscle-gain', 'aesthetics'],
        principles: ['volume-periodization', 'muscle-confusion', 'metabolic-stress'],
        targetMuscles: ['chest', 'back', 'legs', 'shoulders', 'arms'],
        metabolicDemand: 'high',
        recoveryRequirement: 'enhanced'
      },
      {
        id: 'gmax-fat-loss-metabolic',
        name: 'G-Maxing Metabolic Fat Loss',
        category: 'fat-loss',
        difficulty: 'intermediate',
        duration: 6,
        frequency: 5,
        equipment: ['bodyweight', 'kettlebells', 'dumbbells'],
        goals: ['fat-loss', 'conditioning'],
        principles: ['metabolic-conditioning', 'hiit', 'circuit-training'],
        targetMuscles: ['full-body'],
        metabolicDemand: 'very-high',
        recoveryRequirement: 'active'
      },
      {
        id: 'gmax-powerlifting-elite',
        name: 'G-Maxing Elite Powerlifting',
        category: 'powerlifting',
        difficulty: 'expert',
        duration: 16,
        frequency: 4,
        equipment: ['barbell', 'power-rack', 'bench', 'platform'],
        goals: ['strength', 'competition'],
        principles: ['specificity', 'peaking', 'max-effort'],
        targetMuscles: ['chest', 'back', 'legs'],
        metabolicDemand: 'low-moderate',
        recoveryRequirement: 'high'
      }
    ] as Protocol[];
  }

  /**
   * Precompute protocol embeddings for faster similarity calculations
   */
  private precomputeEmbeddings(): void {
    this.protocols.forEach(protocol => {
      const embedding = this.createProtocolEmbedding(protocol);
      this.protocolEmbeddings.set(protocol.id, embedding);
    });
  }

  /**
   * Create a numerical embedding for a protocol
   */
  private createProtocolEmbedding(protocol: Protocol): number[] {
    const embedding: number[] = [];

    // Difficulty encoding (one-hot)
    const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
    difficulties.forEach(diff => {
      embedding.push(protocol.difficulty === diff ? 1 : 0);
    });

    // Category encoding
    const categories = ['strength', 'hypertrophy', 'fat-loss', 'powerlifting', 'conditioning'];
    categories.forEach(cat => {
      embedding.push(protocol.category === cat ? 1 : 0);
    });

    // Duration (normalized)
    embedding.push(protocol.duration / 24); // Normalize by max typical duration

    // Frequency (normalized)
    embedding.push(protocol.frequency / 7); // Normalize by max weekly frequency

    // Equipment requirements (binary encoding)
    const allEquipment = ['barbell', 'dumbbells', 'kettlebells', 'machines', 'cables', 'bodyweight', 'bench', 'power-rack', 'platform'];
    allEquipment.forEach(eq => {
      embedding.push(protocol.equipment.includes(eq) ? 1 : 0);
    });

    // Goals (binary encoding)
    const allGoals = ['strength', 'muscle-gain', 'fat-loss', 'conditioning', 'aesthetics', 'competition'];
    allGoals.forEach(goal => {
      embedding.push(protocol.goals.includes(goal) ? 1 : 0);
    });

    // Metabolic demand encoding
    const metabolicLevels = ['low', 'low-moderate', 'moderate', 'high', 'very-high'];
    metabolicLevels.forEach(level => {
      embedding.push(protocol.metabolicDemand === level ? 1 : 0);
    });

    return embedding;
  }

  /**
   * Main recommendation function using G-Maxing methodology
   */
  public recommendProtocols(
    context: RecommendationContext,
    maxRecommendations: number = 5
  ): RecommendationScore[] {
    console.log('🎯 Generating G-Maxing recommendations for user:', context.userProfile.id);

    const recommendations: RecommendationScore[] = [];

    // Collaborative filtering component
    const collaborativeScores = this.calculateCollaborativeFiltering(context);
    
    // Content-based filtering component
    const contentScores = this.calculateContentBasedFiltering(context);
    
    // G-Maxing specific scoring
    const gMaxingScores = this.calculateGMaxingCompatibility(context);
    
    // Progress-based adjustments
    const progressScores = this.calculateProgressBasedScoring(context);

    // Combine all scoring methods
    this.protocols.forEach(protocol => {
      const collaborativeScore = collaborativeScores.get(protocol.id) || 0;
      const contentScore = contentScores.get(protocol.id) || 0;
      const gMaxingScore = gMaxingScores.get(protocol.id) || 0;
      const progressScore = progressScores.get(protocol.id) || 0;

      // Weighted combination (G-Maxing methodology gets highest weight)
      const finalScore = (
        gMaxingScore * 0.4 +
        contentScore * 0.3 +
        collaborativeScore * 0.2 +
        progressScore * 0.1
      );

      const reasons = this.generateRecommendationReasons(protocol, context);
      const confidence = this.calculateConfidence(protocol, context);

      recommendations.push({
        protocolId: protocol.id,
        score: finalScore,
        reasons,
        confidence,
        gMaxingCompatibility: gMaxingScore
      });
    });

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations);
  }

  /**
   * Collaborative filtering based on user similarity
   */
  private calculateCollaborativeFiltering(context: RecommendationContext): Map<string, number> {
    const scores = new Map<string, number>();
    const { userProfile } = context;

    // Find similar users based on profile characteristics
    const similarUsers = this.findSimilarUsers(userProfile);

    // For each protocol, calculate score based on similar users' preferences
    this.protocols.forEach(protocol => {
      let totalScore = 0;
      let weightSum = 0;

      similarUsers.forEach(([userId, similarity]) => {
        // In a real implementation, we'd look up this user's rating for this protocol
        // For demo, we'll simulate based on user characteristics
        const userRating = this.simulateUserRating(userId, protocol);
        totalScore += userRating * similarity;
        weightSum += similarity;
      });

      const finalScore = weightSum > 0 ? totalScore / weightSum : 0;
      scores.set(protocol.id, finalScore);
    });

    return scores;
  }

  /**
   * Content-based filtering using protocol characteristics
   */
  private calculateContentBasedFiltering(context: RecommendationContext): Map<string, number> {
    const scores = new Map<string, number>();
    const { userProfile } = context;

    const userVector = this.createUserVector(userProfile);

    this.protocols.forEach(protocol => {
      const protocolVector = this.protocolEmbeddings.get(protocol.id) || [];
      const similarity = this.cosineSimilarity(userVector, protocolVector);
      
      // Apply user-specific multipliers
      let adjustedScore = similarity;

      // Equipment availability
      const hasRequiredEquipment = protocol.equipment.every(eq => 
        userProfile.equipment.includes(eq)
      );
      if (!hasRequiredEquipment) {
        adjustedScore *= 0.3; // Heavy penalty for missing equipment
      }

      // Time constraints
      const estimatedSessionTime = this.estimateSessionTime(protocol);
      if (estimatedSessionTime > userProfile.availableTime) {
        adjustedScore *= 0.5; // Penalty for time constraints
      }

      // Frequency match
      if (protocol.frequency > userProfile.frequency) {
        adjustedScore *= 0.7; // Penalty for frequency mismatch
      }

      scores.set(protocol.id, adjustedScore);
    });

    return scores;
  }

  /**
   * G-Maxing specific compatibility scoring
   */
  private calculateGMaxingCompatibility(context: RecommendationContext): Map<string, number> {
    const scores = new Map<string, number>();
    const { userProfile, currentProgress } = context;

    this.protocols.forEach(protocol => {
      let gMaxingScore = 0;

      // Genetic optimization principles alignment
      if (protocol.principles.includes('genetic-optimization')) {
        gMaxingScore += 0.3;
      }

      // Progressive adaptation scoring
      if (protocol.principles.includes('progressive-overload')) {
        gMaxingScore += 0.2;
      }

      // Compound movement focus (G-Maxing principle)
      if (protocol.principles.includes('compound-movements')) {
        gMaxingScore += 0.2;
      }

      // Metabolic efficiency
      const metabolicMatch = this.calculateMetabolicMatch(userProfile, protocol);
      gMaxingScore += metabolicMatch * 0.15;

      // Recovery optimization
      const recoveryMatch = this.calculateRecoveryMatch(userProfile, protocol);
      gMaxingScore += recoveryMatch * 0.15;

      // Current progress alignment
      if (currentProgress) {
        const progressAlignment = this.calculateProgressAlignment(currentProgress, protocol);
        gMaxingScore += progressAlignment * 0.1;
      }

      scores.set(protocol.id, Math.min(gMaxingScore, 1.0)); // Cap at 1.0
    });

    return scores;
  }

  /**
   * Progress-based dynamic scoring
   */
  private calculateProgressBasedScoring(context: RecommendationContext): Map<string, number> {
    const scores = new Map<string, number>();
    const { currentProgress, recentSessions } = context;

    if (!currentProgress || !recentSessions) {
      // Return neutral scores if no progress data
      this.protocols.forEach(protocol => {
        scores.set(protocol.id, 0.5);
      });
      return scores;
    }

    this.protocols.forEach(protocol => {
      let progressScore = 0.5; // Neutral baseline

      // Analyze recent performance trends
      const performanceTrend = this.analyzePerformanceTrend(recentSessions);
      
      if (performanceTrend === 'plateau' && protocol.principles.includes('muscle-confusion')) {
        progressScore += 0.3; // Recommend variety for plateaus
      }

      if (performanceTrend === 'declining' && protocol.recoveryRequirement === 'high') {
        progressScore += 0.2; // Recommend recovery-focused protocols
      }

      if (performanceTrend === 'improving' && protocol.difficulty === 'advanced') {
        progressScore += 0.25; // Recommend advanced protocols for improving users
      }

      // Goal alignment with current progress
      const goalAlignment = this.calculateGoalAlignment(currentProgress, protocol);
      progressScore += goalAlignment * 0.2;

      scores.set(protocol.id, Math.max(0, Math.min(progressScore, 1.0)));
    });

    return scores;
  }

  /**
   * Generate human-readable reasons for recommendations
   */
  private generateRecommendationReasons(
    protocol: Protocol, 
    context: RecommendationContext
  ): string[] {
    const reasons: string[] = [];
    const { userProfile } = context;

    // Goal alignment
    const matchingGoals = protocol.goals.filter(goal => userProfile.goals.includes(goal));
    if (matchingGoals.length > 0) {
      reasons.push(`Parfait pour vos objectifs: ${matchingGoals.join(', ')}`);
    }

    // Equipment compatibility
    const hasAllEquipment = protocol.equipment.every(eq => userProfile.equipment.includes(eq));
    if (hasAllEquipment) {
      reasons.push('Compatible avec votre équipement disponible');
    }

    // Difficulty match
    if (protocol.difficulty === userProfile.fitnessLevel) {
      reasons.push('Niveau de difficulté adapté à votre expérience');
    }

    // G-Maxing specific benefits
    if (protocol.principles.includes('genetic-optimization')) {
      reasons.push('Optimisé selon les principes G-Maxing d\'Engel Garcia Gomez');
    }

    // Time efficiency
    const estimatedTime = this.estimateSessionTime(protocol);
    if (estimatedTime <= userProfile.availableTime) {
      reasons.push(`Séances de ${estimatedTime}min - compatible avec votre emploi du temps`);
    }

    // Frequency match
    if (protocol.frequency <= userProfile.frequency) {
      reasons.push(`${protocol.frequency} séances/semaine - idéal pour votre disponibilité`);
    }

    return reasons;
  }

  /**
   * Calculate confidence score for recommendation
   */
  private calculateConfidence(protocol: Protocol, context: RecommendationContext): number {
    const { userProfile, currentProgress } = context;
    let confidence = 0.5; // Base confidence

    // Equipment match increases confidence
    const equipmentMatch = protocol.equipment.every(eq => userProfile.equipment.includes(eq));
    if (equipmentMatch) confidence += 0.2;

    // Goal alignment increases confidence
    const goalOverlap = protocol.goals.filter(goal => userProfile.goals.includes(goal)).length;
    confidence += (goalOverlap / protocol.goals.length) * 0.2;

    // Experience level match
    if (protocol.difficulty === userProfile.fitnessLevel) {
      confidence += 0.15;
    }

    // Progress data availability
    if (currentProgress) {
      confidence += 0.1;
    }

    // Time and frequency feasibility
    const timeMatch = this.estimateSessionTime(protocol) <= userProfile.availableTime;
    const freqMatch = protocol.frequency <= userProfile.frequency;
    if (timeMatch && freqMatch) {
      confidence += 0.15;
    }

    return Math.max(0, Math.min(confidence, 1.0));
  }

  // Helper methods
  private createUserVector(userProfile: UserProfile): number[] {
    const vector: number[] = [];
    
    // Add user characteristics as numerical features
    vector.push(userProfile.age / 100); // Normalized age
    vector.push(userProfile.weight / 200); // Normalized weight
    vector.push(userProfile.height / 250); // Normalized height
    vector.push(userProfile.availableTime / 180); // Normalized time
    vector.push(userProfile.frequency / 7); // Normalized frequency
    
    // Fitness level (one-hot)
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    levels.forEach(level => {
      vector.push(userProfile.fitnessLevel === level ? 1 : 0);
    });

    return vector;
  }

  private findSimilarUsers(userProfile: UserProfile): [string, number][] {
    // In a real implementation, this would query similar users from database
    // For demo, return simulated similar users
    return [
      ['user123', 0.85],
      ['user456', 0.72],
      ['user789', 0.69]
    ];
  }

  private simulateUserRating(userId: string, protocol: Protocol): number {
    // Simulate user rating based on protocol characteristics
    const hash = this.simpleHash(userId + protocol.id);
    return 0.3 + (hash % 70) / 100; // Random rating between 0.3 and 1.0
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private estimateSessionTime(protocol: Protocol): number {
    // Estimate session time based on protocol characteristics
    let baseTime = 45; // Base time in minutes

    if (protocol.category === 'strength') baseTime = 60;
    if (protocol.category === 'powerlifting') baseTime = 90;
    if (protocol.category === 'fat-loss') baseTime = 40;
    if (protocol.category === 'hypertrophy') baseTime = 75;

    // Adjust based on difficulty
    const difficultyMultipliers = {
      'beginner': 0.8,
      'intermediate': 1.0,
      'advanced': 1.2,
      'expert': 1.4
    };

    return Math.round(baseTime * difficultyMultipliers[protocol.difficulty]);
  }

  private calculateMetabolicMatch(userProfile: UserProfile, protocol: Protocol): number {
    // Calculate how well the protocol's metabolic demand matches user preferences
    const userAge = userProfile.age;
    const userLevel = userProfile.fitnessLevel;

    let idealDemand = 'moderate';
    if (userAge < 25 && userLevel === 'advanced') idealDemand = 'high';
    if (userAge > 45) idealDemand = 'low-moderate';
    if (userProfile.goals.includes('fat-loss')) idealDemand = 'high';

    return protocol.metabolicDemand === idealDemand ? 1.0 : 0.5;
  }

  private calculateRecoveryMatch(userProfile: UserProfile, protocol: Protocol): number {
    const userAge = userProfile.age;
    let idealRecovery = 'standard';
    
    if (userAge > 40) idealRecovery = 'enhanced';
    if (userProfile.frequency > 5) idealRecovery = 'active';
    if (userProfile.medicalConditions.length > 0) idealRecovery = 'high';

    return protocol.recoveryRequirement === idealRecovery ? 1.0 : 0.6;
  }

  private calculateProgressAlignment(progress: ProgressData, protocol: Protocol): number {
    // Align protocol with current progress trends
    // This is a simplified implementation
    return 0.7; // Placeholder
  }

  private analyzePerformanceTrend(sessions: WorkoutSession[]): 'improving' | 'plateau' | 'declining' {
    if (sessions.length < 3) return 'improving'; // Default for new users

    // Simple trend analysis based on recent sessions
    const recentScores = sessions.slice(-5).map(s => s.performanceScore || 0);
    const trend = recentScores[recentScores.length - 1] - recentScores[0];

    if (trend > 0.1) return 'improving';
    if (trend < -0.1) return 'declining';
    return 'plateau';
  }

  private calculateGoalAlignment(progress: ProgressData, protocol: Protocol): number {
    // Calculate how well protocol aligns with progress toward goals
    return 0.8; // Placeholder implementation
  }
}

// Export singleton instance
export const gMaxingRecommendationEngine = new GMaxingRecommendationEngine();
export default GMaxingRecommendationEngine;