/**
 * G-Maxing Template Library
 * Curated workout templates based on Engel Garcia Gomez methodology
 */

import { WorkoutTemplate, Exercise } from './protocolGenerator';

export class GMaxingTemplateLibrary {
  private static instance: GMaxingTemplateLibrary;
  
  public static getInstance(): GMaxingTemplateLibrary {
    if (!GMaxingTemplateLibrary.instance) {
      GMaxingTemplateLibrary.instance = new GMaxingTemplateLibrary();
    }
    return GMaxingTemplateLibrary.instance;
  }

  /**
   * Get all available G-Maxing templates
   */
  public getTemplates(): WorkoutTemplate[] {
    return [
      this.getStrengthFoundationTemplate(),
      this.getHypertrophyAcceleratedTemplate(),
      this.getFatLossMetabolicTemplate(),
      this.getPowerliftingEliteTemplate(),
      this.getAthleticPerformanceTemplate(),
      this.getBodyRecompositionTemplate(),
      this.getFunctionalStrengthTemplate(),
      this.getEnduranceBaseTemplate()
    ];
  }

  /**
   * G-Maxing Strength Foundation Template
   * Perfect for beginners to intermediate athletes
   */
  private getStrengthFoundationTemplate(): WorkoutTemplate {
    return {
      id: 'gmax-strength-foundation',
      name: 'G-Maxing Strength Foundation',
      category: 'strength',
      gMaxingPrinciples: [
        'progressive-overload',
        'compound-focus',
        'biomechanical-precision',
        'recovery-optimization',
        'neurological-enhancement'
      ],
      targetGoals: ['strength', 'muscle-gain', 'technique-mastery'],
      duration: 75,
      intensity: 'high',
      structure: {
        warmup: 10,
        mainWork: 55,
        cooldown: 10
      },
      exerciseSlots: {
        primary: 1, // One main lift per session
        secondary: 2, // Supporting compound movements
        accessory: 2 // Isolation for weak points
      },
      restPeriods: {
        betweenSets: [180, 300], // 3-5 minutes for strength
        betweenExercises: [120, 180],
        betweenBlocks: [300, 420]
      },
      progressionScheme: 'linear',
      adaptationFocus: 'strength'
    };
  }

  /**
   * G-Maxing Hypertrophy Accelerated Template
   * Advanced muscle building protocol
   */
  private getHypertrophyAcceleratedTemplate(): WorkoutTemplate {
    return {
      id: 'gmax-hypertrophy-accelerated',
      name: 'G-Maxing Hypertrophy Accelerated',
      category: 'hypertrophy',
      gMaxingPrinciples: [
        'muscle-confusion',
        'time-efficiency',
        'metabolic-flexibility',
        'progressive-overload',
        'recovery-optimization'
      ],
      targetGoals: ['muscle-gain', 'aesthetics', 'body-composition'],
      duration: 90,
      intensity: 'moderate',
      structure: {
        warmup: 10,
        mainWork: 70,
        cooldown: 10
      },
      exerciseSlots: {
        primary: 2, // Two main movements
        secondary: 3, // Supporting exercises
        accessory: 3 // Detail work
      },
      restPeriods: {
        betweenSets: [60, 90], // Shorter rest for hypertrophy
        betweenExercises: [90, 120],
        betweenBlocks: [180, 240]
      },
      progressionScheme: 'undulating',
      adaptationFocus: 'hypertrophy'
    };
  }

  /**
   * G-Maxing Metabolic Fat Loss Template
   * High-intensity fat burning protocol
   */
  private getFatLossMetabolicTemplate(): WorkoutTemplate {
    return {
      id: 'gmax-fat-loss-metabolic',
      name: 'G-Maxing Metabolic Fat Loss',
      category: 'fat-loss',
      gMaxingPrinciples: [
        'metabolic-flexibility',
        'time-efficiency',
        'compound-focus',
        'hormonal-optimization',
        'recovery-optimization'
      ],
      targetGoals: ['fat-loss', 'conditioning', 'metabolic-health'],
      duration: 45,
      intensity: 'very-high',
      structure: {
        warmup: 8,
        mainWork: 32,
        cooldown: 5
      },
      exerciseSlots: {
        primary: 3, // Circuit-style movements
        secondary: 2, // Metabolic exercises
        accessory: 2, // Core/stabilization
        cardio: 1 // HIIT component
      },
      restPeriods: {
        betweenSets: [30, 60], // Minimal rest
        betweenExercises: [45, 75],
        betweenBlocks: [120, 180]
      },
      progressionScheme: 'undulating',
      adaptationFocus: 'endurance'
    };
  }

  /**
   * G-Maxing Elite Powerlifting Template
   * Competition-focused strength development
   */
  private getPowerliftingEliteTemplate(): WorkoutTemplate {
    return {
      id: 'gmax-powerlifting-elite',
      name: 'G-Maxing Elite Powerlifting',
      category: 'powerlifting',
      gMaxingPrinciples: [
        'progressive-overload',
        'biomechanical-precision',
        'neurological-enhancement',
        'recovery-optimization',
        'genetic-adaptation'
      ],
      targetGoals: ['strength', 'competition', 'powerlifting'],
      duration: 120,
      intensity: 'high',
      structure: {
        warmup: 15,
        mainWork: 90,
        cooldown: 15
      },
      exerciseSlots: {
        primary: 1, // Main powerlifting movement
        secondary: 2, // Competition assistance
        accessory: 3 // Weak point training
      },
      restPeriods: {
        betweenSets: [240, 360], // Extended rest for max strength
        betweenExercises: [180, 240],
        betweenBlocks: [300, 480]
      },
      progressionScheme: 'block',
      adaptationFocus: 'strength'
    };
  }

  /**
   * G-Maxing Athletic Performance Template
   * Sport-specific performance enhancement
   */
  private getAthleticPerformanceTemplate(): WorkoutTemplate {
    return {
      id: 'gmax-athletic-performance',
      name: 'G-Maxing Athletic Performance',
      category: 'athletic',
      gMaxingPrinciples: [
        'neurological-enhancement',
        'compound-focus',
        'metabolic-flexibility',
        'biomechanical-precision',
        'recovery-optimization'
      ],
      targetGoals: ['power', 'athleticism', 'performance', 'sport-specific'],
      duration: 75,
      intensity: 'high',
      structure: {
        warmup: 12,
        mainWork: 55,
        cooldown: 8
      },
      exerciseSlots: {
        primary: 2, // Power/strength movements
        secondary: 2, // Athletic patterns
        accessory: 2, // Injury prevention
        cardio: 1 // Conditioning
      },
      restPeriods: {
        betweenSets: [120, 180], // Quality over fatigue
        betweenExercises: [90, 150],
        betweenBlocks: [180, 300]
      },
      progressionScheme: 'conjugate',
      adaptationFocus: 'power'
    };
  }

  /**
   * G-Maxing Body Recomposition Template
   * Simultaneous muscle gain and fat loss
   */
  private getBodyRecompositionTemplate(): WorkoutTemplate {
    return {
      id: 'gmax-body-recomposition',
      name: 'G-Maxing Body Recomposition',
      category: 'recomposition',
      gMaxingPrinciples: [
        'metabolic-flexibility',
        'compound-focus',
        'progressive-overload',
        'hormonal-optimization',
        'time-efficiency'
      ],
      targetGoals: ['body-composition', 'muscle-gain', 'fat-loss'],
      duration: 65,
      intensity: 'moderate',
      structure: {
        warmup: 8,
        mainWork: 50,
        cooldown: 7
      },
      exerciseSlots: {
        primary: 2, // Strength foundation
        secondary: 3, // Hypertrophy work
        accessory: 2, // Metabolic finishers
      },
      restPeriods: {
        betweenSets: [90, 120], // Balanced approach
        betweenExercises: [75, 120],
        betweenBlocks: [150, 240]
      },
      progressionScheme: 'undulating',
      adaptationFocus: 'mixed'
    };
  }

  /**
   * G-Maxing Functional Strength Template
   * Real-world strength and movement quality
   */
  private getFunctionalStrengthTemplate(): WorkoutTemplate {
    return {
      id: 'gmax-functional-strength',
      name: 'G-Maxing Functional Strength',
      category: 'functional',
      gMaxingPrinciples: [
        'biomechanical-precision',
        'compound-focus',
        'neurological-enhancement',
        'recovery-optimization',
        'genetic-adaptation'
      ],
      targetGoals: ['functional-strength', 'mobility', 'stability', 'movement-quality'],
      duration: 60,
      intensity: 'moderate',
      structure: {
        warmup: 10,
        mainWork: 45,
        cooldown: 5
      },
      exerciseSlots: {
        primary: 2, // Multi-planar movements
        secondary: 3, // Stabilization exercises
        accessory: 2, // Mobility/corrective
      },
      restPeriods: {
        betweenSets: [90, 120],
        betweenExercises: [60, 90],
        betweenBlocks: [120, 180]
      },
      progressionScheme: 'linear',
      adaptationFocus: 'strength'
    };
  }

  /**
   * G-Maxing Endurance Base Template
   * Aerobic foundation and conditioning
   */
  private getEnduranceBaseTemplate(): WorkoutTemplate {
    return {
      id: 'gmax-endurance-base',
      name: 'G-Maxing Endurance Base',
      category: 'endurance',
      gMaxingPrinciples: [
        'metabolic-flexibility',
        'recovery-optimization',
        'progressive-overload',
        'time-efficiency',
        'hormonal-optimization'
      ],
      targetGoals: ['endurance', 'cardiovascular-health', 'conditioning'],
      duration: 50,
      intensity: 'low',
      structure: {
        warmup: 8,
        mainWork: 35,
        cooldown: 7
      },
      exerciseSlots: {
        primary: 1, // Main cardio activity
        secondary: 2, // Strength endurance
        accessory: 2, // Support work
        cardio: 2 // Additional conditioning
      },
      restPeriods: {
        betweenSets: [45, 75], // Active recovery
        betweenExercises: [60, 90],
        betweenBlocks: [90, 150]
      },
      progressionScheme: 'linear',
      adaptationFocus: 'endurance'
    };
  }

  /**
   * Get template by ID
   */
  public getTemplateById(id: string): WorkoutTemplate | null {
    const templates = this.getTemplates();
    return templates.find(t => t.id === id) || null;
  }

  /**
   * Get templates by goal
   */
  public getTemplatesByGoal(goal: string): WorkoutTemplate[] {
    const templates = this.getTemplates();
    return templates.filter(t => t.targetGoals.includes(goal));
  }

  /**
   * Get templates by category
   */
  public getTemplatesByCategory(category: string): WorkoutTemplate[] {
    const templates = this.getTemplates();
    return templates.filter(t => t.category === category);
  }

  /**
   * Get templates by duration range
   */
  public getTemplatesByDuration(minDuration: number, maxDuration: number): WorkoutTemplate[] {
    const templates = this.getTemplates();
    return templates.filter(t => t.duration >= minDuration && t.duration <= maxDuration);
  }

  /**
   * Get beginner-friendly templates
   */
  public getBeginnerTemplates(): WorkoutTemplate[] {
    const templates = this.getTemplates();
    return templates.filter(t => 
      t.exerciseSlots.primary + t.exerciseSlots.secondary <= 4 &&
      t.intensity !== 'very-high' &&
      t.progressionScheme === 'linear'
    );
  }

  /**
   * Get advanced templates
   */
  public getAdvancedTemplates(): WorkoutTemplate[] {
    const templates = this.getTemplates();
    return templates.filter(t => 
      t.exerciseSlots.primary + t.exerciseSlots.secondary + t.exerciseSlots.accessory >= 6 ||
      t.progressionScheme === 'conjugate' ||
      t.intensity === 'very-high'
    );
  }

  /**
   * Search templates by G-Maxing principle
   */
  public getTemplatesByPrinciple(principle: string): WorkoutTemplate[] {
    const templates = this.getTemplates();
    return templates.filter(t => t.gMaxingPrinciples.includes(principle));
  }

  /**
   * Get template statistics
   */
  public getTemplateStats() {
    const templates = this.getTemplates();
    
    const categories = [...new Set(templates.map(t => t.category))];
    const principles = [...new Set(templates.flatMap(t => t.gMaxingPrinciples))];
    const avgDuration = templates.reduce((sum, t) => sum + t.duration, 0) / templates.length;
    
    const intensityDistribution = templates.reduce((acc, t) => {
      acc[t.intensity] = (acc[t.intensity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTemplates: templates.length,
      categories: categories.length,
      uniquePrinciples: principles.length,
      averageDuration: Math.round(avgDuration),
      intensityDistribution,
      mostCommonPrinciples: this.getMostCommonPrinciples(templates),
      templatesByCategory: categories.map(cat => ({
        category: cat,
        count: templates.filter(t => t.category === cat).length
      }))
    };
  }

  private getMostCommonPrinciples(templates: WorkoutTemplate[]): Array<{principle: string, count: number}> {
    const principleCount = templates
      .flatMap(t => t.gMaxingPrinciples)
      .reduce((acc, principle) => {
        acc[principle] = (acc[principle] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(principleCount)
      .map(([principle, count]) => ({ principle, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  /**
   * Validate template structure
   */
  public validateTemplate(template: WorkoutTemplate): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!template.id) errors.push('Template ID is required');
    if (!template.name) errors.push('Template name is required');
    if (!template.category) errors.push('Template category is required');
    if (template.gMaxingPrinciples.length === 0) errors.push('At least one G-Maxing principle is required');
    if (template.targetGoals.length === 0) errors.push('At least one target goal is required');

    // Structure validation
    if (template.duration < 20) warnings.push('Template duration is very short (< 20 minutes)');
    if (template.duration > 150) warnings.push('Template duration is very long (> 150 minutes)');

    const totalExercises = template.exerciseSlots.primary + template.exerciseSlots.secondary + template.exerciseSlots.accessory;
    if (totalExercises < 3) warnings.push('Very few exercises (< 3 total)');
    if (totalExercises > 10) warnings.push('Too many exercises (> 10 total)');

    // Rest period validation
    if (template.restPeriods.betweenSets[0] > template.restPeriods.betweenSets[1]) {
      errors.push('Minimum rest time cannot be greater than maximum');
    }

    // Consistency checks
    if (template.adaptationFocus === 'strength' && template.intensity === 'low') {
      warnings.push('Low intensity may not be optimal for strength adaptation');
    }

    if (template.adaptationFocus === 'endurance' && template.restPeriods.betweenSets[0] > 120) {
      warnings.push('Long rest periods may not be optimal for endurance adaptation');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
export const gMaxingTemplateLibrary = GMaxingTemplateLibrary.getInstance();
export default GMaxingTemplateLibrary;