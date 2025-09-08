/**
 * Natural Language Processing Engine for G-Maxing Chatbot
 * Processes user queries and generates intelligent responses
 */

import { 
  ChatbotKnowledgeBase, 
  Intent, 
  ChatbotResponse, 
  UserContext,
  Entity
} from './knowledgeBase';

interface ProcessingResult {
  intent: Intent | null;
  confidence: number;
  entities: Entity[];
  response: ChatbotResponse;
  context: UserContext;
}

interface QueryAnalysis {
  tokens: string[];
  stemmed: string[];
  entities: Entity[];
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency: 'low' | 'medium' | 'high';
}

export class GMaxingNLPProcessor {
  private knowledgeBase: ChatbotKnowledgeBase;
  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 
    'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);

  private synonyms = new Map([
    ['workout', ['training', 'exercise', 'routine', 'session', 'program']],
    ['muscle', ['muscles', 'muscular', 'gains', 'mass', 'size']],
    ['strength', ['strong', 'power', 'powerful', 'force']],
    ['fat', ['weight', 'lose', 'loss', 'burn', 'cutting']],
    ['diet', ['nutrition', 'eating', 'food', 'meal', 'calories']],
    ['beginner', ['new', 'start', 'starting', 'novice', 'first']],
    ['advanced', ['expert', 'experienced', 'pro', 'professional']],
    ['help', ['assist', 'support', 'guide', 'advice', 'tips']]
  ]);

  constructor() {
    this.knowledgeBase = new ChatbotKnowledgeBase();
  }

  /**
   * Process user query and generate response
   */
  public async processQuery(
    query: string, 
    context: UserContext = {}
  ): Promise<ProcessingResult> {
    console.log('🧠 Processing query:', query);

    // Analyze the query
    const analysis = this.analyzeQuery(query);
    
    // Find matching intent
    const intentMatch = this.findBestIntent(query, analysis);
    
    // Extract entities
    const entities = this.extractEntities(query, analysis);
    
    // Generate response
    const response = intentMatch.intent 
      ? this.generateResponse(intentMatch.intent, entities, context)
      : this.generateFallbackResponse(query, analysis);
    
    // Update context
    const updatedContext = this.updateContext(context, intentMatch.intent, entities);

    console.log('✅ Generated response:', response.text.substring(0, 100) + '...');

    return {
      intent: intentMatch.intent,
      confidence: intentMatch.confidence,
      entities,
      response,
      context: updatedContext
    };
  }

  /**
   * Analyze query structure and content
   */
  private analyzeQuery(query: string): QueryAnalysis {
    const normalized = query.toLowerCase().trim();
    
    // Tokenization
    const tokens = normalized
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1);
    
    // Remove stop words and stem
    const stemmed = tokens
      .filter(token => !this.stopWords.has(token))
      .map(token => this.stemWord(token));
    
    // Extract entities
    const entities = this.extractEntities(normalized, { tokens, stemmed } as QueryAnalysis);
    
    // Determine sentiment
    const sentiment = this.analyzeSentiment(normalized);
    
    // Determine urgency
    const urgency = this.analyzeUrgency(normalized);

    return {
      tokens,
      stemmed,
      entities,
      sentiment,
      urgency
    };
  }

  /**
   * Find best matching intent
   */
  private findBestIntent(query: string, analysis: QueryAnalysis): { intent: Intent | null; confidence: number } {
    const intents = this.knowledgeBase.getAllIntents();
    let bestMatch: { intent: Intent | null; confidence: number } = { intent: null, confidence: 0 };

    for (const intent of intents) {
      const confidence = this.calculateIntentConfidence(query, analysis, intent);
      
      if (confidence > bestMatch.confidence && confidence > 0.3) {
        bestMatch = { intent, confidence };
      }
    }

    return bestMatch;
  }

  /**
   * Calculate confidence score for intent matching
   */
  private calculateIntentConfidence(query: string, analysis: QueryAnalysis, intent: Intent): number {
    let score = 0;
    let matchCount = 0;
    const totalPatterns = intent.patterns.length;

    // Pattern matching
    for (const pattern of intent.patterns) {
      const patternScore = this.matchPattern(query, pattern);
      score += patternScore;
      if (patternScore > 0.5) matchCount++;
    }

    // Keyword matching
    const keywordScore = this.matchKeywords(analysis.stemmed, intent.keywords || []);
    score += keywordScore * 0.8;

    // Entity matching
    const entityScore = this.matchEntities(analysis.entities, intent.entities || []);
    score += entityScore * 0.6;

    // Context relevance
    const contextScore = this.calculateContextRelevance(intent);
    score += contextScore * 0.4;

    // Normalize score
    const normalizedScore = Math.min(1, score / Math.max(1, totalPatterns));
    
    // Boost score if multiple patterns matched
    const matchBoost = matchCount > 1 ? 0.2 : 0;
    
    return Math.min(1, normalizedScore + matchBoost);
  }

  /**
   * Match query against pattern
   */
  private matchPattern(query: string, pattern: string): number {
    const normalizedQuery = query.toLowerCase();
    const normalizedPattern = pattern.toLowerCase();

    // Exact match
    if (normalizedQuery === normalizedPattern) return 1;

    // Contains match
    if (normalizedQuery.includes(normalizedPattern)) return 0.8;

    // Word-level matching with synonyms
    const queryWords = normalizedQuery.split(/\s+/);
    const patternWords = normalizedPattern.split(/\s+/);
    
    let matches = 0;
    for (const patternWord of patternWords) {
      if (this.findWordMatch(queryWords, patternWord)) {
        matches++;
      }
    }

    return matches / patternWords.length;
  }

  /**
   * Find word match considering synonyms
   */
  private findWordMatch(queryWords: string[], targetWord: string): boolean {
    // Direct match
    if (queryWords.includes(targetWord)) return true;

    // Synonym match
    for (const [key, synonyms] of this.synonyms) {
      if (key === targetWord && queryWords.some(word => synonyms.includes(word))) {
        return true;
      }
      if (synonyms.includes(targetWord) && queryWords.includes(key)) {
        return true;
      }
    }

    // Partial match for longer words
    return queryWords.some(word => 
      word.length > 4 && targetWord.length > 4 && 
      (word.includes(targetWord) || targetWord.includes(word))
    );
  }

  /**
   * Match keywords
   */
  private matchKeywords(queryTokens: string[], intentKeywords: string[]): number {
    if (intentKeywords.length === 0) return 0;

    let matches = 0;
    for (const keyword of intentKeywords) {
      if (this.findWordMatch(queryTokens, keyword.toLowerCase())) {
        matches++;
      }
    }

    return matches / intentKeywords.length;
  }

  /**
   * Match entities
   */
  private matchEntities(queryEntities: Entity[], intentEntities: string[]): number {
    if (intentEntities.length === 0) return 0;

    const queryEntityTypes = queryEntities.map(e => e.type);
    let matches = 0;

    for (const entityType of intentEntities) {
      if (queryEntityTypes.includes(entityType)) {
        matches++;
      }
    }

    return matches / intentEntities.length;
  }

  /**
   * Calculate context relevance
   */
  private calculateContextRelevance(intent: Intent): number {
    // Base relevance for different intent types
    const relevanceMap: Record<string, number> = {
      'greeting': 0.8,
      'gmax_methodology': 0.9,
      'engel_info': 0.9,
      'training_advice': 0.8,
      'nutrition_advice': 0.7,
      'exercise_form': 0.8,
      'motivation': 0.6,
      'scheduling': 0.7,
      'progress_tracking': 0.7,
      'injury_prevention': 0.8,
      'supplement_advice': 0.6,
      'general_support': 0.5
    };

    return relevanceMap[intent.id] || 0.5;
  }

  /**
   * Extract entities from query
   */
  private extractEntities(query: string, analysis: QueryAnalysis): Entity[] {
    const entities: Entity[] = [];
    const normalizedQuery = query.toLowerCase();

    // Exercise entities
    const exercises = [
      'squat', 'deadlift', 'bench', 'press', 'row', 'curl', 'extension',
      'pullup', 'pushup', 'lunge', 'dip', 'fly', 'raise', 'pull', 'push'
    ];
    
    for (const exercise of exercises) {
      if (normalizedQuery.includes(exercise)) {
        entities.push({
          type: 'exercise',
          value: exercise,
          confidence: 0.8
        });
      }
    }

    // Body part entities
    const bodyParts = [
      'chest', 'back', 'shoulders', 'arms', 'legs', 'abs', 'core',
      'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves'
    ];
    
    for (const bodyPart of bodyParts) {
      if (normalizedQuery.includes(bodyPart)) {
        entities.push({
          type: 'body_part',
          value: bodyPart,
          confidence: 0.8
        });
      }
    }

    // Goal entities
    const goals = [
      'strength', 'muscle', 'fat loss', 'endurance', 'power', 'size',
      'lose weight', 'gain muscle', 'get strong', 'bulk', 'cut'
    ];
    
    for (const goal of goals) {
      if (normalizedQuery.includes(goal)) {
        entities.push({
          type: 'goal',
          value: goal,
          confidence: 0.7
        });
      }
    }

    // Numerical entities (sets, reps, weight)
    const numberRegex = /(\d+)\s*(sets?|reps?|lbs?|kgs?|minutes?|hours?)/gi;
    let match;
    while ((match = numberRegex.exec(normalizedQuery)) !== null) {
      entities.push({
        type: 'number',
        value: match[1],
        confidence: 0.9
      });
    }

    return entities;
  }

  /**
   * Generate response based on intent and entities
   */
  private generateResponse(intent: Intent, entities: Entity[], context: UserContext): ChatbotResponse {
    // Get base response from knowledge base
    const baseResponse = this.knowledgeBase.getResponse(intent.id, context);
    
    // Personalize response based on entities
    let personalizedText = this.personalizeResponse(baseResponse.text, entities, context);
    
    // Add entity-specific information
    const entityInfo = this.generateEntityInfo(entities);
    if (entityInfo) {
      personalizedText += `\n\n${entityInfo}`;
    }

    return {
      ...baseResponse,
      text: personalizedText,
      confidence: Math.min(1, baseResponse.confidence + 0.1) // Slight boost for personalization
    };
  }

  /**
   * Personalize response text
   */
  private personalizeResponse(text: string, entities: Entity[], context: UserContext): string {
    let personalizedText = text;

    // Replace entity placeholders
    const exerciseEntities = entities.filter(e => e.type === 'exercise');
    const bodyPartEntities = entities.filter(e => e.type === 'body_part');
    const goalEntities = entities.filter(e => e.type === 'goal');

    if (exerciseEntities.length > 0) {
      personalizedText = personalizedText.replace(
        /\{exercise\}/g, 
        exerciseEntities[0].value
      );
    }

    if (bodyPartEntities.length > 0) {
      personalizedText = personalizedText.replace(
        /\{body_part\}/g, 
        bodyPartEntities[0].value
      );
    }

    if (goalEntities.length > 0) {
      personalizedText = personalizedText.replace(
        /\{goal\}/g, 
        goalEntities[0].value
      );
    }

    // Add user name if available
    if (context.userName) {
      personalizedText = personalizedText.replace(/\{name\}/g, context.userName);
    } else {
      personalizedText = personalizedText.replace(/\{name\}/g, '');
    }

    return personalizedText;
  }

  /**
   * Generate additional information based on entities
   */
  private generateEntityInfo(entities: Entity[]): string {
    const exerciseEntities = entities.filter(e => e.type === 'exercise');
    const bodyPartEntities = entities.filter(e => e.type === 'body_part');
    
    let info = '';

    if (exerciseEntities.length > 0) {
      const exercise = exerciseEntities[0].value;
      info += this.getExerciseTip(exercise);
    }

    if (bodyPartEntities.length > 0) {
      const bodyPart = bodyPartEntities[0].value;
      if (info) info += '\n\n';
      info += this.getBodyPartAdvice(bodyPart);
    }

    return info;
  }

  /**
   * Get exercise-specific tip
   */
  private getExerciseTip(exercise: string): string {
    const tips: Record<string, string> = {
      'squat': '💡 **G-Maxing Squat Tip**: Focus on depth and control. Engel emphasizes that proper squat depth activates more muscle fibers and improves mobility.',
      'deadlift': '💡 **G-Maxing Deadlift Tip**: Keep the bar close to your body throughout the movement. Engel teaches that this maximizes leverage and reduces injury risk.',
      'bench': '💡 **G-Maxing Bench Tip**: Control the eccentric (lowering) phase. Engel\'s methodology emphasizes the negative portion for maximum muscle activation.',
      'row': '💡 **G-Maxing Row Tip**: Squeeze your shoulder blades together at the top. This ensures proper posterior chain activation.',
      'curl': '💡 **G-Maxing Curl Tip**: Focus on the mind-muscle connection. Engel teaches that mental focus can increase muscle activation by up to 30%.'
    };

    return tips[exercise] || `💡 **G-Maxing ${exercise} Tip**: Focus on perfect form and progressive overload for maximum results.`;
  }

  /**
   * Get body part-specific advice
   */
  private getBodyPartAdvice(bodyPart: string): string {
    const advice: Record<string, string> = {
      'chest': '🎯 **Chest Training Focus**: Engel recommends varying angles (incline, flat, decline) and rep ranges for complete pectoral development.',
      'back': '🎯 **Back Training Focus**: Pull from different angles - vertical and horizontal pulls are essential for balanced back development.',
      'shoulders': '🎯 **Shoulder Training Focus**: Prioritize rear delt work to balance pressing movements and maintain shoulder health.',
      'arms': '🎯 **Arm Training Focus**: Compound movements like close-grip bench and chin-ups should form the foundation before isolation work.',
      'legs': '🎯 **Leg Training Focus**: Engel emphasizes both bilateral and unilateral movements for balanced lower body strength and stability.'
    };

    return advice[bodyPart] || `🎯 **${bodyPart} Training Focus**: Apply G-Maxing principles of progressive overload and perfect technique.`;
  }

  /**
   * Generate fallback response
   */
  private generateFallbackResponse(query: string, analysis: QueryAnalysis): ChatbotResponse {
    const fallbackResponses = [
      "I understand you're asking about fitness, but I'd like to make sure I give you the most accurate G-Maxing advice. Could you rephrase your question?",
      "That's an interesting question! While I specialize in Engel Garcia Gomez's G-Maxing methodology, I want to make sure I address your specific concern correctly. Can you provide more details?",
      "I'm here to help with all things G-Maxing! Could you be more specific about what aspect of training, nutrition, or methodology you'd like to know about?",
      "Great question! To give you the best G-Maxing advice, could you clarify what you're most interested in - training techniques, nutrition strategies, or general methodology?"
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return {
      text: randomResponse,
      confidence: 0.5,
      suggestedFollowUps: [
        "Tell me about G-Maxing training",
        "How do I build muscle effectively?",
        "What's Engel Garcia Gomez's approach to nutrition?",
        "Help me create a workout plan"
      ],
      requiresAction: false
    };
  }

  /**
   * Update context based on conversation
   */
  private updateContext(
    currentContext: UserContext, 
    intent: Intent | null, 
    entities: Entity[]
  ): UserContext {
    const updatedContext = { ...currentContext };

    // Update last intent
    if (intent) {
      updatedContext.lastIntent = intent.id;
      updatedContext.conversationHistory = [
        ...(updatedContext.conversationHistory || []),
        intent.id
      ].slice(-5); // Keep last 5 intents
    }

    // Update user preferences based on entities
    const goalEntities = entities.filter(e => e.type === 'goal');
    if (goalEntities.length > 0) {
      updatedContext.currentGoal = goalEntities[0].value;
    }

    const bodyPartEntities = entities.filter(e => e.type === 'body_part');
    if (bodyPartEntities.length > 0) {
      updatedContext.focusArea = bodyPartEntities[0].value;
    }

    // Update engagement level
    updatedContext.engagementLevel = this.calculateEngagementLevel(updatedContext);

    return updatedContext;
  }

  /**
   * Calculate user engagement level
   */
  private calculateEngagementLevel(context: UserContext): 'low' | 'medium' | 'high' {
    const historyLength = context.conversationHistory?.length || 0;
    const hasGoal = !!context.currentGoal;
    const hasFocus = !!context.focusArea;

    if (historyLength >= 3 && hasGoal && hasFocus) return 'high';
    if (historyLength >= 2 || hasGoal || hasFocus) return 'medium';
    return 'low';
  }

  /**
   * Analyze sentiment of query
   */
  private analyzeSentiment(query: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'amazing', 'love', 'like', 'excited', 'motivated'];
    const negativeWords = ['bad', 'terrible', 'hate', 'difficult', 'hard', 'pain', 'hurt', 'frustrated', 'confused'];

    const words = query.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of words) {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    }

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Analyze urgency of query
   */
  private analyzeUrgency(query: string): 'low' | 'medium' | 'high' {
    const urgentWords = ['urgent', 'emergency', 'immediately', 'asap', 'now', 'quickly', 'help', 'pain', 'injury'];
    const mediumUrgencyWords = ['soon', 'today', 'need', 'important', 'problem'];

    const words = query.toLowerCase().split(/\s+/);
    
    for (const word of words) {
      if (urgentWords.includes(word)) return 'high';
    }
    
    for (const word of words) {
      if (mediumUrgencyWords.includes(word)) return 'medium';
    }

    return 'low';
  }

  /**
   * Simple word stemming
   */
  private stemWord(word: string): string {
    // Simple English stemming rules
    const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 's'];
    
    for (const suffix of suffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        return word.slice(0, -suffix.length);
      }
    }
    
    return word;
  }

  /**
   * Get processing statistics
   */
  public getProcessingStats() {
    const intentStats = this.knowledgeBase.getStats();
    
    return {
      ...intentStats,
      synonymGroups: this.synonyms.size,
      stopWords: this.stopWords.size,
      processingCapabilities: [
        'Pattern Matching',
        'Entity Recognition', 
        'Sentiment Analysis',
        'Urgency Detection',
        'Context Management',
        'Response Personalization'
      ]
    };
  }
}

export default GMaxingNLPProcessor;