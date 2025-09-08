// G-Maxing Protocol and Training System type definitions for EngelGMax platform

export interface GMaxingProtocol {
  id: string;
  name: string;
  version: string;
  description: string;
  shortDescription?: string;
  
  // Protocol metadata
  type: ProtocolType;
  category: ProtocolCategory;
  level: ProtocolLevel;
  duration: ProtocolDuration;
  
  // Target and goals
  primaryGoal: FitnessGoal;
  secondaryGoals?: FitnessGoal[];
  targetDemographic: TargetDemographic;
  prerequisites?: string[];
  
  // Scientific foundation
  methodology: string;
  scientificBasis?: ScientificFoundation;
  researchReferences?: ScientificReference[];
  
  // Protocol structure
  phases?: ProtocolPhase[];
  workouts: WorkoutPlan[];
  nutritionPlan?: NutritionProtocol;
  supplementProtocol?: SupplementProtocol;
  recoveryProtocol?: RecoveryProtocol;
  
  // Equipment and requirements
  requiredEquipment: Equipment[];
  optionalEquipment?: Equipment[];
  spaceRequirements: SpaceRequirement;
  timeCommitment: TimeCommitment;
  
  // Customization and adaptability
  adaptationOptions?: AdaptationOption[];
  progressionRules?: ProgressionRule[];
  regressionOptions?: RegressionOption[];
  
  // Tracking and measurement
  trackingMetrics: TrackingMetric[];
  assessmentSchedule?: AssessmentSchedule;
  progressIndicators: ProgressIndicator[];
  
  // Media and resources
  instructionalVideos?: ProtocolVideo[];
  images?: ProtocolImage[];
  documents?: ProtocolDocument[];
  
  // Pricing and access
  price?: number;
  isPremium: boolean;
  accessLevel: AccessLevel;
  
  // Performance and optimization
  successRate?: number;
  averageResults?: ProtocolResults;
  userFeedback?: UserFeedbackSummary;
  
  // Status and versioning
  status: ProtocolStatus;
  isActive: boolean;
  isPublic: boolean;
  
  // Authorship and ownership
  createdBy: string;
  authoredBy?: string; // Engel Garcia Gomez
  reviewedBy?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  lastReviewDate?: Date;
  
  // SEO for individual protocols
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Integration
  compatibleProtocols?: string[];
  followUpProtocols?: string[];
}

export type ProtocolType = 
  | 'complete_transformation'
  | 'strength_focused'
  | 'hypertrophy_focused'
  | 'cutting_protocol'
  | 'bulking_protocol'
  | 'recomposition'
  | 'athletic_performance'
  | 'rehabilitation'
  | 'maintenance'
  | 'specialization';

export type ProtocolCategory = 
  | 'g_maxing_core'
  | 'beginner_foundation'
  | 'intermediate_progression'
  | 'advanced_optimization'
  | 'expert_specialization'
  | 'targeted_improvement'
  | 'seasonal_protocols'
  | 'injury_recovery';

export type ProtocolLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface ProtocolDuration {
  totalWeeks: number;
  totalDays: number;
  workoutsPerWeek: number;
  restDays: number;
  deloadWeeks?: number[];
  testingWeeks?: number[];
}

export interface TargetDemographic {
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: 'male' | 'female' | 'all';
  experienceLevel: ExperienceLevel[];
  fitnessGoals: FitnessGoal[];
  availableTime: {
    min: number; // minutes per session
    max: number;
  };
  equipment: Equipment[];
}

export interface ScientificFoundation {
  principlesBased: string[];
  researchSupport: ResearchSupport[];
  biomechanicalPrinciples: string[];
  physiologicalAdaptations: string[];
  psychologicalConsiderations?: string[];
}

export interface ResearchSupport {
  study: string;
  authors: string[];
  journal?: string;
  year: number;
  relevance: string;
  keyFindings: string[];
  doi?: string;
}

export interface ProtocolPhase {
  id: string;
  name: string;
  description: string;
  weekStart: number;
  weekEnd: number;
  primaryFocus: string;
  keyAdaptations: string[];
  
  // Phase-specific parameters
  volume?: VolumeParameters;
  intensity?: IntensityParameters;
  frequency?: FrequencyParameters;
  
  // Nutrition adjustments
  nutritionAdjustments?: NutritionAdjustment[];
  
  // Recovery modifications
  recoveryModifications?: RecoveryModification[];
  
  // Success criteria
  phaseGoals: string[];
  assessmentCriteria?: AssessmentCriterion[];
}

export interface VolumeParameters {
  setsPerWeek: {
    min: number;
    max: number;
  };
  repsPerSet: {
    min: number;
    max: number;
  };
  totalVolume: {
    metric: 'sets' | 'reps' | 'tonnage';
    target: number;
  };
}

export interface IntensityParameters {
  loadPercentage: {
    min: number; // % of 1RM
    max: number;
  };
  rpe: {
    min: number; // Rate of Perceived Exertion 1-10
    max: number;
  };
  tempoRequirements?: TempoRequirement[];
}

export interface FrequencyParameters {
  sessionsPerWeek: number;
  muscleGroupFrequency: {
    [muscleGroup: string]: number;
  };
  movementPatternFrequency: {
    [pattern: string]: number;
  };
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  week: number;
  day: number;
  phase?: string;
  
  // Workout structure
  warmup: Exercise[];
  mainWork: Exercise[];
  accessoryWork?: Exercise[];
  cooldown: Exercise[];
  
  // Workout parameters
  estimatedDuration: number; // minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  intensity: 1 | 2 | 3 | 4 | 5;
  
  // Focus areas
  primaryMuscleGroups: MuscleGroup[];
  secondaryMuscleGroups?: MuscleGroup[];
  movementPatterns: MovementPattern[];
  
  // Energy systems
  energySystemFocus: EnergySystem[];
  
  // Adaptations targeted
  primaryAdaptation: TrainingAdaptation;
  secondaryAdaptations?: TrainingAdaptation[];
  
  // Equipment needed
  requiredEquipment: Equipment[];
  alternativeEquipment?: EquipmentAlternative[];
  
  // Notes and coaching cues
  coachingNotes?: string;
  setupInstructions?: string;
  safetyConsiderations?: string[];
  
  // Customization options
  modifications?: WorkoutModification[];
  progressions?: WorkoutProgression[];
  regressions?: WorkoutRegression[];
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  movementPattern: MovementPattern;
  
  // Exercise parameters
  sets: ExerciseSet[];
  restPeriods: RestPeriod[];
  tempo?: TempoRequirement;
  
  // Instructions
  description: string;
  setupInstructions: string;
  executionCues: string[];
  commonMistakes?: string[];
  safetyNotes?: string[];
  
  // Media
  demonstrationVideo?: string;
  images?: string[];
  
  // Variations and alternatives
  variations?: ExerciseVariation[];
  alternatives?: ExerciseAlternative[];
  
  // Equipment
  primaryEquipment: Equipment;
  alternativeEquipment?: Equipment[];
  
  // Difficulty and scaling
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  scalingOptions?: ScalingOption[];
  
  // Biomechanical considerations
  rangeOfMotion?: RangeOfMotion;
  forceVector?: ForceVector;
  stabilityRequirement?: StabilityRequirement;
}

export interface ExerciseSet {
  setNumber: number;
  reps?: number | RepRange;
  weight?: number | WeightRange;
  duration?: number; // seconds
  distance?: number; // meters
  rpe?: number; // 1-10
  percentage?: number; // % of 1RM
  notes?: string;
  
  // Advanced parameters
  cluster?: ClusterSet;
  dropSet?: DropSet;
  restPause?: RestPause;
  tempo?: TempoRequirement;
}

export interface RepRange {
  min: number;
  max: number;
  target?: number;
}

export interface WeightRange {
  min: number;
  max: number;
  unit: 'kg' | 'lbs';
}

export interface ClusterSet {
  miniSets: number;
  repsPerMiniSet: number;
  restBetweenMiniSets: number; // seconds
}

export interface DropSet {
  drops: number;
  weightReduction: number; // percentage
  repsToFailure: boolean;
}

export interface RestPause {
  initialReps: number;
  restPause: number; // seconds
  additionalReps: number;
  cycles: number;
}

export interface TempoRequirement {
  eccentric: number; // seconds
  pause: number; // seconds
  concentric: number; // seconds
  rest: number; // seconds
  notation: string; // e.g., "3-1-2-1"
}

export interface RestPeriod {
  betweenSets: number; // seconds
  betweenExercises?: number;
  betweenBlocks?: number;
  notes?: string;
}

export type ExerciseCategory = 
  | 'compound'
  | 'isolation'
  | 'plyometric'
  | 'cardio'
  | 'flexibility'
  | 'stability'
  | 'corrective'
  | 'activation';

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'full_body';

export type MovementPattern = 
  | 'squat'
  | 'hinge'
  | 'push'
  | 'pull'
  | 'carry'
  | 'gait'
  | 'rotation'
  | 'anti_extension'
  | 'anti_flexion'
  | 'anti_rotation'
  | 'anti_lateral_flexion';

export type EnergySystem = 
  | 'phosphocreatine'
  | 'glycolytic'
  | 'aerobic'
  | 'mixed_modal';

export type TrainingAdaptation = 
  | 'strength'
  | 'hypertrophy'
  | 'power'
  | 'endurance'
  | 'flexibility'
  | 'stability'
  | 'coordination'
  | 'balance';

export interface EquipmentAlternative {
  original: Equipment;
  alternative: Equipment;
  modifications?: string;
}

export interface WorkoutModification {
  condition: string; // e.g., "if injured knee"
  modification: string;
  exerciseChanges?: ExerciseChange[];
}

export interface ExerciseChange {
  originalExercise: string;
  replacementExercise: string;
  parameterAdjustments?: ParameterAdjustment[];
}

export interface ParameterAdjustment {
  parameter: 'sets' | 'reps' | 'weight' | 'tempo' | 'rest';
  adjustment: string; // e.g., "reduce by 20%"
}

export interface WorkoutProgression {
  week: number;
  changes: ProgressionChange[];
  criteria: string; // when to apply progression
}

export interface ProgressionChange {
  type: 'volume' | 'intensity' | 'complexity' | 'frequency';
  adjustment: string;
  exercises?: string[]; // if specific to certain exercises
}

export interface WorkoutRegression {
  condition: string;
  changes: RegressionChange[];
}

export interface RegressionChange {
  type: 'volume' | 'intensity' | 'complexity';
  adjustment: string;
  exercises?: string[];
}

export interface ExerciseVariation {
  name: string;
  difficulty: 'easier' | 'same' | 'harder';
  equipment?: Equipment;
  description: string;
  whenToUse: string;
}

export interface ExerciseAlternative {
  exercise: Exercise;
  reason: string; // e.g., "if no barbell available"
  equivalency: number; // 0-100% how similar
}

export interface ScalingOption {
  direction: 'up' | 'down';
  method: string;
  description: string;
  when: string;
}

export interface RangeOfMotion {
  type: 'full' | 'partial' | 'lengthened' | 'shortened';
  specificRange?: {
    start: number; // degrees
    end: number;
  };
  notes?: string;
}

export type ForceVector = 
  | 'vertical'
  | 'horizontal'
  | 'diagonal'
  | 'rotational'
  | 'multi_planar';

export type StabilityRequirement = 'low' | 'moderate' | 'high' | 'extreme';

// Nutrition Protocol
export interface NutritionProtocol {
  id: string;
  name: string;
  description: string;
  
  // Caloric targets
  calorieTargets: CalorieTarget[];
  macroDistribution: MacroDistribution[];
  
  // Meal planning
  mealsPerDay: number;
  mealTiming?: MealTiming[];
  preWorkoutNutrition?: NutritionGuideline;
  postWorkoutNutrition?: NutritionGuideline;
  
  // Supplements
  recommendedSupplements?: SupplementRecommendation[];
  
  // Hydration
  hydrationGuidelines: HydrationGuideline;
  
  // Dietary restrictions
  accommodations?: DietaryAccommodation[];
  
  // Sample meal plans
  sampleMealPlans?: SampleMealPlan[];
  
  // Tracking
  trackingRequirements: NutritionTrackingRequirement[];
}

export interface CalorieTarget {
  phase: string;
  baseCalories: number;
  trainingDayAdjustment: number;
  restDayAdjustment: number;
  adjustmentMethod: 'percentage' | 'absolute';
}

export interface MacroDistribution {
  phase: string;
  protein: MacroTarget;
  carbohydrates: MacroTarget;
  fats: MacroTarget;
  fiber?: number; // grams
}

export interface MacroTarget {
  percentage?: number;
  gramsPerKg?: number;
  absoluteGrams?: number;
  range?: {
    min: number;
    max: number;
  };
}

export interface MealTiming {
  mealNumber: number;
  timeRelativeToWorkout?: string; // e.g., "2 hours before"
  absoluteTime?: string; // e.g., "7:00 AM"
  macroEmphasis?: {
    protein?: boolean;
    carbs?: boolean;
    fats?: boolean;
  };
}

export interface NutritionGuideline {
  timing: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fats?: number;
  specificFoods?: string[];
  avoidFoods?: string[];
  hydration?: number;
}

export interface SupplementRecommendation {
  supplement: string;
  dosage: string;
  timing: string;
  purpose: string;
  priority: 'essential' | 'beneficial' | 'optional';
  cost?: number;
  alternatives?: string[];
}

export interface HydrationGuideline {
  dailyTarget: number; // liters
  trainingDayBonus: number;
  electrolyteRequirements?: ElectrolyteRequirement[];
  timing?: HydrationTiming[];
}

export interface ElectrolyteRequirement {
  electrolyte: string;
  amount: number;
  unit: string;
  timing: string;
}

export interface HydrationTiming {
  time: string;
  amount: number; // ml
  type?: 'water' | 'electrolyte' | 'other';
}

export interface DietaryAccommodation {
  restriction: DietaryRestriction;
  modifications: string[];
  alternativeOptions: string[];
}

export interface SampleMealPlan {
  day: number;
  phase?: string;
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  meals: MealPlanMeal[];
}

export interface MealPlanMeal {
  meal: string; // breakfast, lunch, etc.
  time?: string;
  foods: MealPlanFood[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  instructions?: string;
}

export interface MealPlanFood {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  alternatives?: string[];
}

export interface NutritionTrackingRequirement {
  metric: string;
  frequency: 'daily' | 'weekly' | 'as_needed';
  method: string;
  target?: number;
  range?: {
    min: number;
    max: number;
  };
}

// Supplement Protocol
export interface SupplementProtocol {
  id: string;
  name: string;
  description: string;
  
  // Core supplements
  coreSupplements: CoreSupplement[];
  
  // Optional supplements
  optionalSupplements?: OptionalSupplement[];
  
  // Cycling protocols
  cyclingProtocols?: CyclingProtocol[];
  
  // Safety considerations
  contraindications?: string[];
  drugInteractions?: string[];
  
  // Cost analysis
  monthlyCost?: number;
  costBreakdown?: CostBreakdown[];
  
  // Timing and stacking
  timingProtocol: SupplementTiming[];
  stackingGuidelines?: StackingGuideline[];
}

export interface CoreSupplement {
  name: string;
  purpose: string;
  dosage: string;
  timing: string;
  duration?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  evidence: 'strong' | 'moderate' | 'limited' | 'theoretical';
  cost?: number;
}

export interface OptionalSupplement extends CoreSupplement {
  conditions: string[]; // when to consider
  alternatives?: string[];
}

export interface CyclingProtocol {
  supplement: string;
  onPeriod: string;
  offPeriod: string;
  reason: string;
  markers?: string[]; // what to monitor
}

export interface CostBreakdown {
  supplement: string;
  monthlyCost: number;
  costPerServing: number;
  servingsPerMonth: number;
}

export interface SupplementTiming {
  timepoint: string;
  supplements: string[];
  notes?: string;
}

export interface StackingGuideline {
  supplements: string[];
  interaction: 'synergistic' | 'neutral' | 'avoid';
  notes: string;
}

// Recovery Protocol
export interface RecoveryProtocol {
  id: string;
  name: string;
  description: string;
  
  // Sleep optimization
  sleepGuidelines: SleepGuideline;
  
  // Active recovery
  activeRecoveryMethods: ActiveRecoveryMethod[];
  
  // Stress management
  stressManagementTechniques: StressManagementTechnique[];
  
  // Recovery modalities
  recoveryModalities?: RecoveryModality[];
  
  // Monitoring
  recoveryMetrics: RecoveryMetric[];
  
  // Periodization
  recoveryPeriodization?: RecoveryPeriodization[];
}

export interface SleepGuideline {
  targetDuration: number; // hours
  targetBedtime: string;
  targetWakeTime: string;
  sleepHygieneTips: string[];
  environmentOptimization: string[];
  supplementSupport?: string[];
}

export interface ActiveRecoveryMethod {
  activity: string;
  duration: number; // minutes
  intensity: 'very_light' | 'light' | 'moderate';
  frequency: string;
  benefits: string[];
  instructions?: string;
}

export interface StressManagementTechnique {
  technique: string;
  duration: number;
  frequency: string;
  instructions: string;
  benefits: string[];
  whenToUse?: string;
}

export interface RecoveryModality {
  modality: string;
  description: string;
  protocol: string;
  frequency: string;
  duration?: number;
  cost?: string;
  evidence: 'strong' | 'moderate' | 'limited' | 'anecdotal';
  contraindications?: string[];
}

export interface RecoveryMetric {
  metric: string;
  method: string;
  frequency: string;
  target?: number | string;
  interpretation: string;
}

export interface RecoveryPeriodization {
  phase: string;
  emphasis: string[];
  modifications: string[];
  duration: string;
}

// Tracking and Assessment
export interface TrackingMetric {
  name: string;
  category: 'performance' | 'body_composition' | 'biometric' | 'subjective';
  unit: string;
  frequency: 'daily' | 'weekly' | 'bi_weekly' | 'monthly';
  method: string;
  importance: 'critical' | 'important' | 'nice_to_have';
  baseline?: number;
  target?: number | string;
}

export interface AssessmentSchedule {
  initialAssessment: AssessmentPoint;
  midpointAssessments?: AssessmentPoint[];
  finalAssessment: AssessmentPoint;
  ongoingMonitoring?: MonitoringPoint[];
}

export interface AssessmentPoint {
  timepoint: string; // e.g., "Week 0", "Week 6"
  assessments: Assessment[];
  purpose: string;
  actionItems?: string[];
}

export interface Assessment {
  name: string;
  type: AssessmentType;
  instructions: string;
  equipment?: Equipment[];
  expectedDuration: number; // minutes
  dataPoints: DataPoint[];
}

export type AssessmentType = 
  | 'anthropometric'
  | 'performance'
  | 'movement_screen'
  | 'biomarker'
  | 'psychological'
  | 'lifestyle';

export interface DataPoint {
  metric: string;
  unit?: string;
  method: string;
  notes?: string;
}

export interface MonitoringPoint {
  frequency: string;
  metrics: string[];
  method: string;
  alertThresholds?: AlertThreshold[];
}

export interface AlertThreshold {
  metric: string;
  threshold: number;
  direction: 'above' | 'below';
  action: string;
}

export interface ProgressIndicator {
  name: string;
  description: string;
  category: 'strength' | 'size' | 'composition' | 'performance' | 'health';
  measurement: string;
  frequency: string;
  target?: ProgressTarget;
  milestones?: Milestone[];
}

export interface ProgressTarget {
  value: number;
  unit: string;
  timeframe: string;
  confidence: 'low' | 'moderate' | 'high';
}

export interface Milestone {
  name: string;
  value: number;
  timeframe: string;
  significance: string;
}

// Protocol Results and Analytics
export interface ProtocolResults {
  protocolId: string;
  sampleSize: number;
  completionRate: number;
  adherenceRate: number;
  
  // Primary outcomes
  primaryOutcomes: OutcomeResult[];
  
  // Secondary outcomes  
  secondaryOutcomes?: OutcomeResult[];
  
  // Demographic breakdown
  demographicResults?: DemographicResult[];
  
  // Time to results
  timeToResults: TimeToResult[];
  
  // Satisfaction metrics
  satisfactionScore: number;
  recommendationRate: number;
  
  // Long-term follow-up
  sustainabilityRate?: number;
  longTermOutcomes?: LongTermOutcome[];
}

export interface OutcomeResult {
  metric: string;
  unit: string;
  
  // Statistical results
  meanChange: number;
  medianChange: number;
  standardDeviation: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  
  // Practical significance
  effectSize: number;
  clinicalSignificance: boolean;
  
  // Distribution
  responderRate: number; // % who achieved meaningful change
  nonResponderRate: number;
  excellentResponderRate?: number;
  
  // Baseline vs endpoint
  baselineMean: number;
  endpointMean: number;
  percentChange: number;
}

export interface DemographicResult {
  demographic: string;
  subgroup: string;
  sampleSize: number;
  outcomes: OutcomeResult[];
  specialConsiderations?: string[];
}

export interface TimeToResult {
  outcome: string;
  timepoints: {
    weeks: number;
    percentAchieved: number;
  }[];
  medianTime: number;
  fastestTime: number;
  slowestTime: number;
}

export interface LongTermOutcome {
  timepoint: string; // e.g., "6 months post", "1 year post"
  metric: string;
  retention: number; // % of original improvement retained
  sustainabilityFactors: string[];
}

export interface UserFeedbackSummary {
  totalResponses: number;
  averageRating: number;
  
  // Feedback categories
  difficultyRating: number;
  clarityRating: number;
  enjoymentRating: number;
  effectivenessRating: number;
  
  // Qualitative themes
  positiveThemes: string[];
  improvementAreas: string[];
  commonChallenges: string[];
  successFactors: string[];
  
  // Recommendation
  wouldRecommendPercentage: number;
  wouldRepeatPercentage: number;
}