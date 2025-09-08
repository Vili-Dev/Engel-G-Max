/**
 * G-Maxing Chatbot Knowledge Base
 * Rule-based intelligent chatbot for Engel Garcia Gomez methodology
 * 100% Free - No external APIs required
 */

export interface ChatbotIntent {
  id: string;
  patterns: string[];
  responses: string[];
  context?: string;
  followUp?: string[];
  priority: number;
  category: 'gMaxing' | 'training' | 'nutrition' | 'general' | 'engelGarcia';
}

export interface ChatbotEntity {
  type: string;
  value: string;
  synonyms: string[];
}

export interface ChatbotContext {
  intent?: string;
  entities: ChatbotEntity[];
  conversationHistory: string[];
  userProfile?: any;
  lastResponse?: string;
  expectingFollowUp?: boolean;
}

export class GMaxingKnowledgeBase {
  private static instance: GMaxingKnowledgeBase;
  private intents: ChatbotIntent[] = [];
  private entities: ChatbotEntity[] = [];

  public static getInstance(): GMaxingKnowledgeBase {
    if (!GMaxingKnowledgeBase.instance) {
      GMaxingKnowledgeBase.instance = new GMaxingKnowledgeBase();
    }
    return GMaxingKnowledgeBase.instance;
  }

  constructor() {
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase(): void {
    this.loadIntents();
    this.loadEntities();
    console.log('🤖 G-Maxing Knowledge Base initialized with', this.intents.length, 'intents');
  }

  private loadIntents(): void {
    this.intents = [
      // Engel Garcia Gomez specific intents
      {
        id: 'who-is-engel',
        patterns: [
          'qui est engel garcia gomez',
          'engel garcia gomez',
          'parle moi d\'engel',
          'qui est le créateur',
          'qui a créé g-maxing',
          'founder',
          'créateur de g-maxing'
        ],
        responses: [
          'Engel Garcia Gomez est le créateur révolutionnaire de la méthode G-Maxing ! 🏆 Expert international en sciences du sport avec +15 ans d\'expérience, il a transformé plus de 15,000 athlètes dans le monde entier.',
          '🧬 Engel Garcia Gomez est un pionnier de l\'optimisation génétique sportive. Sa méthodologie G-Maxing combine science de pointe et résultats concrets pour maximiser votre potentiel physique unique.',
          'Engel Garcia Gomez, c\'est THE référence mondiale en coaching sportif ! 🌟 Créateur de la méthode G-Maxing, il révolutionne l\'entraînement depuis 2012 avec des résultats scientifiquement prouvés.'
        ],
        context: 'engel-info',
        followUp: [
          'Voulez-vous en savoir plus sur sa méthode G-Maxing ?',
          'Souhaitez-vous découvrir ses réalisations ?'
        ],
        priority: 10,
        category: 'engelGarcia'
      },
      {
        id: 'what-is-gMaxing',
        patterns: [
          'qu\'est-ce que g-maxing',
          'c\'est quoi g-maxing',
          'g-maxing définition',
          'méthode g-maxing',
          'principe g-maxing',
          'gMaxing explique',
          'genetic maximization'
        ],
        responses: [
          '🧬 G-Maxing (Genetic Maximization) est la méthode révolutionnaire d\'Engel Garcia Gomez qui optimise votre potentiel génétique unique ! Elle combine analyse biomécanique, périodisation scientifique et adaptation personnalisée pour des résultats exceptionnels.',
          'G-Maxing = votre ADN + science de pointe + coaching expert ! 🚀 Cette méthode d\'Engel Garcia Gomez analyse votre profil génétique pour créer des protocoles 100% personnalisés et maximiser vos gains.',
          'La méthode G-Maxing d\'Engel Garcia Gomez, c\'est l\'avenir du fitness ! ⚡ Elle révolutionne l\'entraînement en adaptant chaque exercice, tempo et récupération à VOTRE profil génétique spécifique.'
        ],
        context: 'gMaxing-explanation',
        followUp: [
          'Voulez-vous découvrir les 10 principes G-Maxing ?',
          'Souhaitez-vous voir des exemples concrets ?'
        ],
        priority: 10,
        category: 'gMaxing'
      },
      {
        id: 'gMaxing-principles',
        patterns: [
          'principes g-maxing',
          '10 principes',
          'règles g-maxing',
          'fondements g-maxing',
          'piliers g-maxing'
        ],
        responses: [
          '🎯 Les 10 Principes G-Maxing d\'Engel Garcia Gomez :\n\n1. 🧬 Optimisation Génétique\n2. 📈 Surcharge Progressive Adaptée\n3. 🎪 Confusion Musculaire Intelligente\n4. 💪 Focus Mouvements Composés\n5. ⚡ Efficacité Temporelle\n6. 🔄 Optimisation Récupération\n7. 🎯 Précision Biomécanique\n8. 🔥 Flexibilité Métabolique\n9. 🧠 Amélioration Neurologique\n10. ⚖️ Optimisation Hormonale',
          'Voici les fondements révolutionnaires du G-Maxing ! 🏗️ Chaque principe a été développé par Engel Garcia Gomez après des années de recherche et des milliers de transformations réussies.'
        ],
        context: 'gMaxing-principles',
        followUp: [
          'Voulez-vous que j\'explique un principe en détail ?',
          'Souhaitez-vous voir comment les appliquer ?'
        ],
        priority: 9,
        category: 'gMaxing'
      },
      {
        id: 'how-to-start',
        patterns: [
          'comment commencer',
          'débuter g-maxing',
          'par où commencer',
          'premiers pas',
          'débutant g-maxing',
          'commencer entraînement'
        ],
        responses: [
          '🚀 Pour débuter G-Maxing avec Engel Garcia Gomez :\n\n1. 📋 Évaluation complète de votre profil\n2. 🎯 Définition d\'objectifs SMART\n3. 🏗️ Génération de votre protocole personnalisé\n4. 💪 Démarrage avec les fondamentaux\n5. 📊 Suivi et ajustements réguliers',
          'Parfait ! 🎉 La beauté du G-Maxing, c\'est qu\'il s\'adapte à VOTRE niveau. Commencez par notre évaluation gratuite pour créer votre protocole sur-mesure selon la méthode d\'Engel Garcia Gomez.'
        ],
        context: 'getting-started',
        followUp: [
          'Voulez-vous faire l\'évaluation maintenant ?',
          'Souhaitez-vous voir les protocoles débutants ?'
        ],
        priority: 9,
        category: 'training'
      },
      {
        id: 'results-timeline',
        patterns: [
          'combien de temps pour voir résultats',
          'quand voit-on les résultats',
          'délai résultats',
          'résultats en combien de temps',
          'progression g-maxing'
        ],
        responses: [
          '⏰ Avec la méthode G-Maxing d\'Engel Garcia Gomez :\n\n• 🔥 1-2 semaines : Amélioration force et énergie\n• 💪 4-6 semaines : Changements visuels notables\n• 🏆 8-12 semaines : Transformation significative\n• 🚀 6+ mois : Résultats exceptionnels durables',
          'La méthode G-Maxing est optimisée pour des résultats RAPIDES ! 🚀 Nos clients voient en moyenne +15% de force en 4 semaines et +2.5kg de muscle en 12 semaines. Votre génétique détermine votre vitesse unique de progression.'
        ],
        context: 'results-expectations',
        followUp: [
          'Voulez-vous voir des témoignages concrets ?',
          'Souhaitez-vous calculer vos résultats estimés ?'
        ],
        priority: 8,
        category: 'training'
      },
      {
        id: 'nutrition-gMaxing',
        patterns: [
          'nutrition g-maxing',
          'alimentation g-maxing',
          'régime g-maxing',
          'que manger',
          'nutrition optimale',
          'macro g-maxing'
        ],
        responses: [
          '🥗 Nutrition G-Maxing d\'Engel Garcia Gomez :\n\n• 🥩 Protéines : 2.2g/kg (muscle + récupération)\n• 🍠 Glucides : 4-6g/kg (énergie + performance)\n• 🥑 Lipides : 1g/kg (hormones + vitamines)\n• 💧 Hydratation : 35ml/kg + 500ml/h d\'entraînement',
          'La nutrition G-Maxing, c\'est la précision au service de vos objectifs ! 🎯 Engel Garcia Gomez a développé des ratios optimaux basés sur votre génotype pour maximiser chaque calorie.'
        ],
        context: 'nutrition-guidance',
        followUp: [
          'Voulez-vous un plan nutritionnel personnalisé ?',
          'Besoin d\'aide pour calculer vos macros ?'
        ],
        priority: 8,
        category: 'nutrition'
      },
      {
        id: 'equipment-needed',
        patterns: [
          'équipement nécessaire',
          'matériel g-maxing',
          'que faut-il comme équipement',
          'équipement minimum',
          'matériel entraînement'
        ],
        responses: [
          '🏋️ Équipement G-Maxing optimal :\n\n🔥 ESSENTIEL :\n• Haltères ajustables\n• Barre + disques\n• Banc ajustable\n\n⚡ IDÉAL :\n• Rack à squat\n• Système de poulies\n• Kettlebells\n\n💪 BONUS :\n• Plateforme\n• Barres spécialisées',
          'La beauté du G-Maxing d\'Engel Garcia Gomez ? Il s\'adapte à VOTRE équipement ! 🎯 Même avec le minimum (haltères + banc), vous pouvez obtenir des résultats extraordinaires grâce aux protocoles intelligents.'
        ],
        context: 'equipment-guidance',
        followUp: [
          'Voulez-vous des protocoles selon votre équipement ?',
          'Besoin de conseils d\'achat équipement ?'
        ],
        priority: 7,
        category: 'training'
      },
      {
        id: 'frequency-training',
        patterns: [
          'combien de fois par semaine',
          'fréquence entraînement',
          'nombre de séances',
          'fois par semaine g-maxing'
        ],
        responses: [
          '📅 Fréquence G-Maxing optimale :\n\n🥉 DÉBUTANT : 3x/semaine (récupération++)\n🥈 INTERMÉDIAIRE : 4-5x/semaine (progression++)\n🥇 AVANCÉ : 5-6x/semaine (volume++)\n🏆 EXPERT : 6x/semaine + récupération active',
          'Avec G-Maxing, plus n\'est pas forcément mieux ! 🎯 Engel Garcia Gomez privilégie la QUALITÉ sur la quantité. 3-4 séances parfaitement exécutées battent 6 séances médiocres.'
        ],
        context: 'training-frequency',
        followUp: [
          'Voulez-vous un planning personnalisé ?',
          'Comment optimiser votre récupération ?'
        ],
        priority: 7,
        category: 'training'
      },
      {
        id: 'supplements-gMaxing',
        patterns: [
          'compléments g-maxing',
          'suppléments recommandés',
          'quels compléments',
          'supplémentation g-maxing'
        ],
        responses: [
          '💊 Stack G-Maxing d\'Engel Garcia Gomez :\n\n🔥 ESSENTIELS :\n• Créatine 5g/jour (force + volume)\n• Whey post-workout (récupération)\n• Vitamine D3 2000UI (hormones)\n\n⚡ PERFORMANCE :\n• Oméga-3 1-2g/jour\n• Magnésium 400mg\n• Multivitamines qualité',
          'Les suppléments G-Maxing sont choisis pour leur efficacité PROUVÉE ! 📊 Engel Garcia Gomez ne recommande que ce qui apporte une vraie plus-value à vos résultats.'
        ],
        context: 'supplementation',
        followUp: [
          'Voulez-vous un plan de supplémentation personnalisé ?',
          'Questions sur un complément spécifique ?'
        ],
        priority: 6,
        category: 'nutrition'
      },
      {
        id: 'plateau-breakthrough',
        patterns: [
          'plateau',
          'stagnation',
          'plus de progrès',
          'comment débloquer',
          'surmonter plateau'
        ],
        responses: [
          '🚧 Briser un plateau avec G-Maxing :\n\n🔄 CONFUSION MUSCULAIRE :\n• Changer les angles d\'attaque\n• Modifier les tempos\n• Varier les amplitudes\n\n📈 PROGRESSION FORCÉE :\n• Technique rest-pause\n• Séries dégressives\n• Pré-fatigue ciblée',
          'Les plateaux ? C\'est là que G-Maxing excelle ! 💥 Engel Garcia Gomez a développé 12 techniques spécifiques pour relancer la progression quand votre corps s\'adapte.'
        ],
        context: 'plateau-solutions',
        followUp: [
          'Voulez-vous des techniques spécifiques ?',
          'Quel type de plateau rencontrez-vous ?'
        ],
        priority: 8,
        category: 'training'
      },
      {
        id: 'injury-prevention',
        patterns: [
          'éviter blessures',
          'prévention blessures',
          'échauffement g-maxing',
          'récupération',
          'pas se blesser'
        ],
        responses: [
          '🛡️ Prévention G-Maxing d\'Engel Garcia Gomez :\n\n🔥 ÉCHAUFFEMENT (10min) :\n• Mobilisation articulaire\n• Activation neuro-musculaire\n• Préparation spécifique\n\n💪 TECHNIQUE PARFAITE :\n• ROM complète\n• Contrôle excentrique\n• Respiration synchronisée',
          'Zéro blessure, c\'est la promesse G-Maxing ! 🎯 La méthode d\'Engel Garcia Gomez intègre la prévention dans chaque mouvement pour progresser DURABLEMENT.'
        ],
        context: 'injury-prevention',
        followUp: [
          'Voulez-vous une routine d\'échauffement ?',
          'Comment améliorer votre récupération ?'
        ],
        priority: 9,
        category: 'training'
      },
      {
        id: 'testimonials-success',
        patterns: [
          'témoignages',
          'success stories',
          'résultats clients',
          'avant après',
          'transformations'
        ],
        responses: [
          '🏆 Transformations G-Maxing exceptionnelles :\n\n💪 Marcus : +15kg muscle en 6 mois\n🔥 Sarah : -12kg graisse, +8kg muscle\n⚡ David : +40% force en 8 semaines\n🚀 15,000+ athlètes transformés !',
          'Les résultats parlent d\'eux-mêmes ! 📊 98% de taux de réussite avec la méthode d\'Engel Garcia Gomez. Nos clients obtiennent des transformations qui semblaient impossibles.'
        ],
        context: 'success-stories',
        followUp: [
          'Voulez-vous voir plus de témoignages ?',
          'Prêt à commencer votre transformation ?'
        ],
        priority: 7,
        category: 'general'
      },
      // Fallback intents
      {
        id: 'greeting',
        patterns: [
          'salut',
          'bonjour',
          'hello',
          'hey',
          'coucou',
          'bonsoir'
        ],
        responses: [
          'Salut champion ! 🔥 Je suis l\'assistant G-Maxing d\'Engel Garcia Gomez. Prêt à révolutionner ton entraînement ?',
          'Hey ! 👋 Bienvenue dans l\'univers G-Maxing ! Comment puis-je t\'aider à maximiser tes performances aujourd\'hui ?',
          'Bonjour ! 🏆 Assistant G-Maxing à ton service. Que veux-tu savoir sur la méthode révolutionnaire d\'Engel Garcia Gomez ?'
        ],
        context: 'greeting',
        followUp: [
          'Découvrir G-Maxing ?',
          'Commencer un protocole ?',
          'Poser une question ?'
        ],
        priority: 5,
        category: 'general'
      },
      {
        id: 'help-request',
        patterns: [
          'aide',
          'help',
          'que peux-tu faire',
          'comment ça marche',
          'aide-moi'
        ],
        responses: [
          '🤖 Je suis ton expert G-Maxing personnel ! Je peux t\'aider avec :\n\n• 🧬 La méthode G-Maxing d\'Engel Garcia Gomez\n• 💪 Conseils d\'entraînement\n• 🥗 Nutrition optimisée\n• 📊 Planification protocoles\n• 🏆 Motivation et suivi',
          'À ton service ! 🚀 Spécialiste de la méthode G-Maxing, je réponds à toutes tes questions sur l\'entraînement, nutrition, récupération et bien plus !'
        ],
        context: 'help-offered',
        followUp: [
          'Par quoi veux-tu commencer ?'
        ],
        priority: 6,
        category: 'general'
      },
      {
        id: 'unknown',
        patterns: [],
        responses: [
          'Hmm, je n\'ai pas bien saisi ! 🤔 Peux-tu reformuler ta question sur G-Maxing ou l\'entraînement ?',
          'Désolé, ça dépasse mes compétences G-Maxing ! 😅 Essaie une autre question ou demande-moi de l\'aide.',
          'Je ne comprends pas encore cette question ! 🧠 Mais je peux t\'aider avec G-Maxing, Engel Garcia Gomez, entraînement, nutrition...'
        ],
        context: 'unknown',
        followUp: [
          'Veux-tu que je t\'explique G-Maxing ?',
          'Besoin d\'aide sur l\'entraînement ?'
        ],
        priority: 1,
        category: 'general'
      }
    ];
  }

  private loadEntities(): void {
    this.entities = [
      {
        type: 'exercise',
        value: 'squat',
        synonyms: ['squat', 'flexion', 'accroupissement', 'back squat', 'front squat']
      },
      {
        type: 'exercise',
        value: 'deadlift',
        synonyms: ['deadlift', 'soulevé de terre', 'sdt', 'conventional deadlift']
      },
      {
        type: 'exercise',
        value: 'bench-press',
        synonyms: ['bench press', 'développé couché', 'dc', 'press']
      },
      {
        type: 'bodypart',
        value: 'chest',
        synonyms: ['pectoraux', 'chest', 'poitrine', 'pecs']
      },
      {
        type: 'bodypart',
        value: 'back',
        synonyms: ['dos', 'back', 'dorsaux', 'rhomboïdes']
      },
      {
        type: 'goal',
        value: 'muscle-gain',
        synonyms: ['prise de masse', 'muscle', 'hypertrophie', 'volume']
      },
      {
        type: 'goal',
        value: 'strength',
        synonyms: ['force', 'strength', 'puissance', 'performance']
      },
      {
        type: 'goal',
        value: 'fat-loss',
        synonyms: ['perte de poids', 'sèche', 'fat loss', 'mincir']
      }
    ];
  }

  /**
   * Get all intents
   */
  public getIntents(): ChatbotIntent[] {
    return this.intents;
  }

  /**
   * Get all entities
   */
  public getEntities(): ChatbotEntity[] {
    return this.entities;
  }

  /**
   * Get intents by category
   */
  public getIntentsByCategory(category: string): ChatbotIntent[] {
    return this.intents.filter(intent => intent.category === category);
  }

  /**
   * Find intent by ID
   */
  public getIntentById(id: string): ChatbotIntent | null {
    return this.intents.find(intent => intent.id === id) || null;
  }

  /**
   * Search intents by pattern
   */
  public searchIntents(query: string): ChatbotIntent[] {
    const lowercaseQuery = query.toLowerCase();
    
    return this.intents
      .filter(intent => 
        intent.patterns.some(pattern => 
          pattern.toLowerCase().includes(lowercaseQuery) ||
          lowercaseQuery.includes(pattern.toLowerCase())
        )
      )
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get knowledge base statistics
   */
  public getStats() {
    const categoryCount = this.intents.reduce((acc, intent) => {
      acc[intent.category] = (acc[intent.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalPatterns = this.intents.reduce((sum, intent) => sum + intent.patterns.length, 0);
    const totalResponses = this.intents.reduce((sum, intent) => sum + intent.responses.length, 0);

    return {
      totalIntents: this.intents.length,
      totalEntities: this.entities.length,
      totalPatterns,
      totalResponses,
      averagePatternsPerIntent: totalPatterns / this.intents.length,
      averageResponsesPerIntent: totalResponses / this.intents.length,
      categoryDistribution: categoryCount,
      priorityDistribution: this.intents.reduce((acc, intent) => {
        acc[intent.priority] = (acc[intent.priority] || 0) + 1;
        return acc;
      }, {} as Record<number, number>)
    };
  }

  /**
   * Add custom intent (for extensibility)
   */
  public addIntent(intent: ChatbotIntent): void {
    this.intents.push(intent);
    this.intents.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Update intent
   */
  public updateIntent(id: string, updates: Partial<ChatbotIntent>): boolean {
    const index = this.intents.findIndex(intent => intent.id === id);
    if (index !== -1) {
      this.intents[index] = { ...this.intents[index], ...updates };
      return true;
    }
    return false;
  }

  /**
   * Remove intent
   */
  public removeIntent(id: string): boolean {
    const index = this.intents.findIndex(intent => intent.id === id);
    if (index !== -1) {
      this.intents.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const gMaxingKnowledgeBase = GMaxingKnowledgeBase.getInstance();
export default GMaxingKnowledgeBase;