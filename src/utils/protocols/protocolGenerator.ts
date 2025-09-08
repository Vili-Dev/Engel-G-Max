/**
 * G-Maxing Protocol Generation System
 * Advanced template-based workout protocol creation
 * 100% Free - Based on Engel Garcia Gomez methodology
 */

export interface Exercise {
  id: string;
  name: string;
  category: 'compound' | 'isolation' | 'cardio' | 'plyometric' | 'mobility';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  biomechanicalMovement: 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'rotate';
  energySystem: 'phosphocreatine' | 'glycolytic' | 'oxidative' | 'mixed';
  timeUnderTension: number; // seconds per rep
  restTime: number; // seconds between sets
  scalingFactors: {
    strength: number;
    hypertrophy: number;
    endurance: number;
    power: number;
    fatLoss: number;
  };
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  gMaxingPrinciples: string[];
  targetGoals: string[];
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high' | 'very-high';
  structure: {
    warmup: number; // minutes
    mainWork: number;
    cooldown: number;
  };
  exerciseSlots: {
    primary: number; // number of primary exercises
    secondary: number; // number of secondary exercises
    accessory: number; // number of accessory exercises
    cardio?: number; // optional cardio exercises
  };
  restPeriods: {
    betweenSets: [number, number]; // min-max seconds
    betweenExercises: [number, number];
    betweenBlocks: [number, number];
  };
  progressionScheme: 'linear' | 'undulating' | 'block' | 'conjugate';
  adaptationFocus: 'strength' | 'hypertrophy' | 'power' | 'endurance' | 'mixed';
}

export interface GeneratedProtocol {
  id: string;
  name: string;
  description: string;
  duration: number; // weeks
  frequency: number; // per week
  sessions: WorkoutSession[];
  progressionPlan: ProgressionWeek[];
  nutritionGuidelines: NutritionGuideline[];
  recoveryProtocol: RecoveryProtocol;
  gMaxingScore: number;
  estimatedResults: {
    strengthGain: number; // percentage
    muscleGain: number; // kg
    fatLoss: number; // kg
    enduranceImprovement: number; // percentage
  };
}

export interface WorkoutSession {
  id: string;
  name: string;
  day: number;
  type: 'strength' | 'hypertrophy' | 'power' | 'endurance' | 'recovery';
  exercises: ProgrammedExercise[];
  totalDuration: number;
  estimatedCalories: number;
  intensityScore: number;
}

export interface ProgrammedExercise {
  exercise: Exercise;
  sets: number;
  reps: number | string; // can be "AMRAP", "12-15", etc.
  weight: string; // "75% 1RM", "RPE 8", etc.
  tempo: string; // "3-1-2-0"
  restTime: number;
  notes: string[];
  gMaxingModifications: string[];
}

export interface ProgressionWeek {
  week: number;
  focus: string;
  intensityMultiplier: number;
  volumeMultiplier: number;
  modifications: string[];
  testingProtocols: string[];
}

export interface NutritionGuideline {
  phase: string;
  calories: number;
  protein: number; // grams per kg bodyweight
  carbs: number;
  fats: number;
  timing: string[];
  supplements: string[];
}

export interface RecoveryProtocol {
  sleepRecommendation: number; // hours
  activeRecoveryDays: number;
  modalityRecommendations: string[];
  stressManagement: string[];
  monitoringMetrics: string[];
}

class GMaxingProtocolGenerator {
  private exerciseDatabase: Exercise[] = [];
  private templateLibrary: WorkoutTemplate[] = [];
  private gMaxingPrinciples = [
    'progressive-overload',
    'muscle-confusion',
    'compound-focus',
    'time-efficiency',
    'recovery-optimization',
    'biomechanical-precision',
    'genetic-adaptation',
    'metabolic-flexibility',
    'neurological-enhancement',
    'hormonal-optimization'
  ];

  constructor() {
    this.initializeDatabase();
    this.loadTemplates();
  }

  private initializeDatabase(): void {
    // Initialize comprehensive exercise database
    this.exerciseDatabase = [
      // Compound Movements (G-Maxing Foundation)
      {
        id: 'barbell-squat',
        name: 'Barbell Back Squat',
        category: 'compound',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core', 'calves'],
        equipment: ['barbell', 'squat-rack'],
        difficulty: 'intermediate',
        biomechanicalMovement: 'squat',
        energySystem: 'phosphocreatine',
        timeUnderTension: 4,
        restTime: 180,
        scalingFactors: {
          strength: 1.0,
          hypertrophy: 0.8,
          endurance: 0.4,
          power: 0.9,
          fatLoss: 0.7
        }
      },
      {
        id: 'deadlift',
        name: 'Conventional Deadlift',
        category: 'compound',
        muscleGroups: ['hamstrings', 'glutes', 'erectors', 'lats', 'traps', 'forearms'],
        equipment: ['barbell', 'plates'],
        difficulty: 'intermediate',
        biomechanicalMovement: 'hinge',
        energySystem: 'phosphocreatine',
        timeUnderTension: 3,
        restTime: 240,
        scalingFactors: {
          strength: 1.0,
          hypertrophy: 0.9,
          endurance: 0.3,
          power: 0.8,
          fatLoss: 0.8
        }
      },
      {
        id: 'bench-press',
        name: 'Barbell Bench Press',
        category: 'compound',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        equipment: ['barbell', 'bench'],
        difficulty: 'beginner',
        biomechanicalMovement: 'push',
        energySystem: 'phosphocreatine',
        timeUnderTension: 3,
        restTime: 180,
        scalingFactors: {
          strength: 1.0,
          hypertrophy: 0.9,
          endurance: 0.4,
          power: 0.8,
          fatLoss: 0.6
        }
      },
      // ... More exercises would be added here
    ];
  }

  private loadTemplates(): void {
    this.templateLibrary = [
      {
        id: 'gmax-strength-foundation',
        name: 'G-Maxing Strength Foundation',
        category: 'strength',
        gMaxingPrinciples: ['progressive-overload', 'compound-focus', 'recovery-optimization'],
        targetGoals: ['strength', 'muscle-gain'],
        duration: 75,
        intensity: 'high',
        structure: {
          warmup: 10,
          mainWork: 55,
          cooldown: 10
        },
        exerciseSlots: {
          primary: 1,
          secondary: 2,
          accessory: 2
        },
        restPeriods: {
          betweenSets: [180, 300],
          betweenExercises: [120, 180],
          betweenBlocks: [300, 420]
        },
        progressionScheme: 'linear',
        adaptationFocus: 'strength'
      },
      {
        id: 'gmax-hypertrophy-accelerated',
        name: 'G-Maxing Hypertrophy Accelerated',
        category: 'hypertrophy',
        gMaxingPrinciples: ['muscle-confusion', 'time-efficiency', 'metabolic-flexibility'],
        targetGoals: ['muscle-gain', 'aesthetics'],
        duration: 90,
        intensity: 'moderate',
        structure: {
          warmup: 10,
          mainWork: 70,
          cooldown: 10
        },
        exerciseSlots: {
          primary: 2,
          secondary: 3,
          accessory: 3
        },
        restPeriods: {
          betweenSets: [60, 90],
          betweenExercises: [90, 120],
          betweenBlocks: [180, 240]
        },
        progressionScheme: 'undulating',
        adaptationFocus: 'hypertrophy'
      },
      // ... More templates
    ];
  }

  /**
   * Generate a complete protocol based on user parameters
   */
  public generateProtocol(params: {
    userId: string;
    goals: string[];
    experience: string;
    equipment: string[];
    timeAvailable: number;
    frequency: number;
    duration: number;
    bodyWeight: number;
    age: number;
    preferences: string[];
    limitations: string[];
  }): GeneratedProtocol {
    console.log('🏗️ Generating G-Maxing protocol for user:', params.userId);

    // Select optimal template
    const template = this.selectOptimalTemplate(params);
    
    // Generate workout sessions
    const sessions = this.generateWorkoutSessions(template, params);
    
    // Create progression plan
    const progressionPlan = this.createProgressionPlan(template, params);
    
    // Generate nutrition guidelines
    const nutritionGuidelines = this.generateNutritionGuidelines(params);
    
    // Create recovery protocol
    const recoveryProtocol = this.createRecoveryProtocol(params);
    
    // Calculate G-Maxing compatibility score
    const gMaxingScore = this.calculateGMaxingScore(template, params);
    
    // Estimate results
    const estimatedResults = this.estimateResults(template, params);

    const protocol: GeneratedProtocol = {
      id: this.generateProtocolId(),
      name: this.generateProtocolName(template, params),
      description: this.generateProtocolDescription(template, params),
      duration: params.duration,
      frequency: params.frequency,
      sessions,
      progressionPlan,
      nutritionGuidelines,
      recoveryProtocol,
      gMaxingScore,
      estimatedResults
    };

    console.log(`✅ Generated protocol: ${protocol.name} (G-Maxing Score: ${gMaxingScore})`);
    return protocol;
  }

  private selectOptimalTemplate(params: any): WorkoutTemplate {
    let bestTemplate = this.templateLibrary[0];
    let bestScore = 0;

    for (const template of this.templateLibrary) {
      let score = 0;

      // Goal alignment
      const goalMatch = template.targetGoals.filter(goal => params.goals.includes(goal)).length;
      score += goalMatch * 0.4;

      // Time compatibility
      const timeMatch = Math.abs(template.duration - params.timeAvailable) <= 15 ? 0.3 : 0;
      score += timeMatch;

      // Experience level match
      const experienceMap = { 'beginner': 0, 'intermediate': 1, 'advanced': 2, 'expert': 3 };
      const userExp = experienceMap[params.experience as keyof typeof experienceMap] || 1;
      const templateComplexity = template.exerciseSlots.primary + template.exerciseSlots.secondary;
      const expMatch = Math.abs(userExp - (templateComplexity / 2)) <= 1 ? 0.2 : 0;
      score += expMatch;

      // G-Maxing principles bonus
      score += template.gMaxingPrinciples.length * 0.1;

      if (score > bestScore) {
        bestScore = score;
        bestTemplate = template;
      }
    }

    return bestTemplate;
  }

  private generateWorkoutSessions(template: WorkoutTemplate, params: any): WorkoutSession[] {
    const sessions: WorkoutSession[] = [];
    
    for (let day = 1; day <= params.frequency; day++) {
      const sessionType = this.determineSessionType(day, params.frequency, template);
      const exercises = this.selectExercisesForSession(template, sessionType, params);
      const programmedExercises = this.programExercises(exercises, template, params);

      const session: WorkoutSession = {
        id: `session-${day}`,
        name: `${template.name} - Jour ${day}`,
        day,
        type: sessionType,
        exercises: programmedExercises,
        totalDuration: template.duration,
        estimatedCalories: this.estimateCalories(programmedExercises, params.bodyWeight),
        intensityScore: this.calculateIntensityScore(programmedExercises, template.intensity)
      };

      sessions.push(session);
    }

    return sessions;
  }

  private determineSessionType(day: number, frequency: number, template: WorkoutTemplate): any {
    if (frequency <= 3) {
      return 'strength'; // Full body focus
    } else if (frequency === 4) {
      return day % 2 === 1 ? 'strength' : 'hypertrophy';
    } else {
      const types = ['strength', 'hypertrophy', 'power', 'endurance'];
      return types[(day - 1) % types.length];
    }
  }

  private selectExercisesForSession(template: WorkoutTemplate, sessionType: string, params: any): Exercise[] {
    const availableExercises = this.exerciseDatabase.filter(exercise => {
      // Filter by equipment availability
      return exercise.equipment.every(eq => params.equipment.includes(eq));
    });

    const selectedExercises: Exercise[] = [];
    
    // Select primary exercises (compound movements)
    const primaryExercises = availableExercises
      .filter(ex => ex.category === 'compound')
      .sort((a, b) => b.scalingFactors[sessionType as keyof typeof a.scalingFactors] - 
                     a.scalingFactors[sessionType as keyof typeof a.scalingFactors]);
    
    selectedExercises.push(...primaryExercises.slice(0, template.exerciseSlots.primary));

    // Select secondary exercises
    const secondaryExercises = availableExercises
      .filter(ex => !selectedExercises.includes(ex))
      .slice(0, template.exerciseSlots.secondary);
    
    selectedExercises.push(...secondaryExercises);

    // Select accessory exercises
    const accessoryExercises = availableExercises
      .filter(ex => !selectedExercises.includes(ex) && ex.category === 'isolation')
      .slice(0, template.exerciseSlots.accessory);
    
    selectedExercises.push(...accessoryExercises);

    return selectedExercises;
  }

  private programExercises(exercises: Exercise[], template: WorkoutTemplate, params: any): ProgrammedExercise[] {
    return exercises.map((exercise, index) => {
      const isCompound = exercise.category === 'compound';
      const isPrimary = index < template.exerciseSlots.primary;

      let sets: number;
      let reps: string;
      let weight: string;

      if (template.adaptationFocus === 'strength') {
        sets = isPrimary ? 5 : 3;
        reps = isPrimary ? '3-5' : '6-8';
        weight = isPrimary ? '85-95% 1RM' : '75-85% 1RM';
      } else if (template.adaptationFocus === 'hypertrophy') {
        sets = isPrimary ? 4 : 3;
        reps = isPrimary ? '6-10' : '10-15';
        weight = isPrimary ? '75-85% 1RM' : '65-75% 1RM';
      } else {
        sets = 3;
        reps = '8-12';
        weight = '70-80% 1RM';
      }

      // G-Maxing specific modifications
      const gMaxingMods = this.generateGMaxingModifications(exercise, template);

      return {
        exercise,
        sets,
        reps,
        weight,
        tempo: this.calculateOptimalTempo(exercise, template.adaptationFocus),
        restTime: isPrimary ? template.restPeriods.betweenSets[1] : template.restPeriods.betweenSets[0],
        notes: [
          `Focus sur la qualité du mouvement`,
          `Contrôle excentrique strict`,
          `ROM complète requise`
        ],
        gMaxingModifications: gMaxingMods
      };
    });
  }

  private generateGMaxingModifications(exercise: Exercise, template: WorkoutTemplate): string[] {
    const modifications: string[] = [];

    if (template.gMaxingPrinciples.includes('biomechanical-precision')) {
      modifications.push('Position de départ optimisée selon votre morphologie');
    }

    if (template.gMaxingPrinciples.includes('neurological-enhancement')) {
      modifications.push('Activation neuro-musculaire pré-exercice');
    }

    if (template.gMaxingPrinciples.includes('metabolic-flexibility')) {
      modifications.push('Temps de repos adaptés au système énergétique');
    }

    if (exercise.category === 'compound') {
      modifications.push('Principe G-Maxing: Focus sur les mouvements polyarticulaires');
    }

    return modifications;
  }

  private calculateOptimalTempo(exercise: Exercise, focus: string): string {
    const baseTempos = {
      'strength': '3-1-X-1',
      'hypertrophy': '3-1-2-1',
      'power': '1-0-X-0',
      'endurance': '2-0-2-0'
    };

    return baseTempos[focus as keyof typeof baseTempos] || '2-1-2-1';
  }

  private createProgressionPlan(template: WorkoutTemplate, params: any): ProgressionWeek[] {
    const weeks: ProgressionWeek[] = [];
    
    for (let week = 1; week <= params.duration; week++) {
      const phase = this.determinePhase(week, params.duration);
      
      weeks.push({
        week,
        focus: phase.focus,
        intensityMultiplier: phase.intensityMultiplier,
        volumeMultiplier: phase.volumeMultiplier,
        modifications: phase.modifications,
        testingProtocols: week % 4 === 0 ? ['Test 1RM', 'Mesures corporelles'] : []
      });
    }

    return weeks;
  }

  private determinePhase(week: number, totalDuration: number): any {
    const phaseLength = Math.ceil(totalDuration / 3);
    
    if (week <= phaseLength) {
      return {
        focus: 'Adaptation anatomique',
        intensityMultiplier: 0.7 + (week / phaseLength) * 0.2,
        volumeMultiplier: 0.8 + (week / phaseLength) * 0.3,
        modifications: ['Volume progressif', 'Apprentissage technique']
      };
    } else if (week <= phaseLength * 2) {
      return {
        focus: 'Développement intensif',
        intensityMultiplier: 0.9 + ((week - phaseLength) / phaseLength) * 0.1,
        volumeMultiplier: 1.0,
        modifications: ['Intensité maximale', 'Techniques avancées']
      };
    } else {
      return {
        focus: 'Réalisation',
        intensityMultiplier: 1.0,
        volumeMultiplier: 0.8,
        modifications: ['Tapering', 'Performance optimale']
      };
    }
  }

  private generateNutritionGuidelines(params: any): NutritionGuideline[] {
    const bmr = this.calculateBMR(params.bodyWeight, params.age);
    const tdee = bmr * this.getActivityMultiplier(params.frequency);
    
    let calorieAdjustment = 0;
    if (params.goals.includes('fat-loss')) calorieAdjustment = -500;
    if (params.goals.includes('muscle-gain')) calorieAdjustment = 300;

    return [
      {
        phase: 'Phase de base',
        calories: tdee + calorieAdjustment,
        protein: params.goals.includes('muscle-gain') ? 2.2 : 1.8,
        carbs: params.goals.includes('fat-loss') ? 3 : 5,
        fats: 1,
        timing: [
          'Petit-déjeuner riche en protéines',
          'Glucides pré-entraînement',
          'Protéines post-entraînement',
          'Repas équilibré dans les 2h'
        ],
        supplements: [
          'Créatine monohydrate (5g/jour)',
          'Vitamine D3 (2000 UI)',
          'Oméga-3 (1g EPA/DHA)'
        ]
      }
    ];
  }

  private createRecoveryProtocol(params: any): RecoveryProtocol {
    return {
      sleepRecommendation: 7.5 + (params.frequency > 4 ? 0.5 : 0),
      activeRecoveryDays: Math.max(1, 7 - params.frequency),
      modalityRecommendations: [
        'Étirements dynamiques pré-entraînement',
        'Étirements statiques post-entraînement',
        'Massage des tissus mous',
        'Bains froids/chauds contrastés',
        'Méditation/respiration'
      ],
      stressManagement: [
        'Techniques de respiration',
        'Gestion du stress quotidien',
        'Optimisation du sommeil',
        'Activités récréatives'
      ],
      monitoringMetrics: [
        'Qualité du sommeil',
        'Fréquence cardiaque au repos',
        'Variabilité cardiaque',
        'Niveau de fatigue perçu',
        'Motivation d\'entraînement'
      ]
    };
  }

  private calculateGMaxingScore(template: WorkoutTemplate, params: any): number {
    let score = 0.5; // Base score

    // G-Maxing principles implementation
    score += template.gMaxingPrinciples.length * 0.05;

    // Compound movement emphasis
    const compoundRatio = template.exerciseSlots.primary / 
      (template.exerciseSlots.primary + template.exerciseSlots.secondary + template.exerciseSlots.accessory);
    score += compoundRatio * 0.2;

    // Progression scheme sophistication
    const progressionBonus = {
      'linear': 0.1,
      'undulating': 0.15,
      'block': 0.2,
      'conjugate': 0.25
    };
    score += progressionBonus[template.progressionScheme as keyof typeof progressionBonus] || 0;

    // Recovery optimization
    if (template.structure.cooldown >= 10) score += 0.05;

    // Time efficiency
    const efficiency = template.exerciseSlots.primary / (template.duration / 60);
    score += Math.min(efficiency * 0.1, 0.1);

    return Math.min(score, 1.0);
  }

  private estimateResults(template: WorkoutTemplate, params: any): any {
    const durationMultiplier = params.duration / 12; // normalized to 12 weeks
    const experienceMultiplier = {
      'beginner': 1.5,
      'intermediate': 1.0,
      'advanced': 0.7,
      'expert': 0.5
    }[params.experience] || 1.0;

    return {
      strengthGain: Math.round(15 * durationMultiplier * experienceMultiplier),
      muscleGain: Math.round(2.5 * durationMultiplier * experienceMultiplier * 100) / 100,
      fatLoss: params.goals.includes('fat-loss') ? 
        Math.round(3 * durationMultiplier * 100) / 100 : 0,
      enduranceImprovement: Math.round(10 * durationMultiplier * experienceMultiplier)
    };
  }

  // Utility methods
  private generateProtocolId(): string {
    return 'gmax-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateProtocolName(template: WorkoutTemplate, params: any): string {
    const goalString = params.goals.join(' & ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    return `G-Maxing ${goalString} - Protocole Personnalisé`;
  }

  private generateProtocolDescription(template: WorkoutTemplate, params: any): string {
    return `Protocole G-Maxing personnalisé basé sur la méthodologie d'Engel Garcia Gomez. ` +
           `Conçu pour ${params.goals.join(', ')} avec ${params.frequency} séances par semaine ` +
           `sur ${params.duration} semaines. Score G-Maxing: ${this.calculateGMaxingScore(template, params).toFixed(2)}`;
  }

  private estimateCalories(exercises: ProgrammedExercise[], bodyWeight: number): number {
    return exercises.reduce((total, ex) => {
      const baseCalories = ex.exercise.category === 'compound' ? 8 : 5;
      return total + (baseCalories * ex.sets * bodyWeight * 0.001);
    }, 0);
  }

  private calculateIntensityScore(exercises: ProgrammedExercise[], templateIntensity: string): number {
    const intensityMap = { 'low': 0.4, 'moderate': 0.6, 'high': 0.8, 'very-high': 1.0 };
    return intensityMap[templateIntensity] || 0.6;
  }

  private calculateBMR(weight: number, age: number): number {
    // Mifflin-St Jeor equation (simplified)
    return 10 * weight + 6.25 * 175 - 5 * age + 5; // Assuming height of 175cm
  }

  private getActivityMultiplier(frequency: number): number {
    if (frequency <= 2) return 1.375;
    if (frequency <= 4) return 1.55;
    return 1.725;
  }
}

// Export singleton instance
export const gMaxingProtocolGenerator = new GMaxingProtocolGenerator();
export default GMaxingProtocolGenerator;