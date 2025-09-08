// User related type definitions for EngelGMax platform

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Profile information
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: UserLocation;
  
  // Preferences
  preferences: UserPreferences;
  
  // Fitness profile
  fitnessProfile: FitnessProfile;
  
  // Subscription and billing
  subscription?: UserSubscription;
  
  // Progress tracking
  progressTracking?: ProgressTracking;
  
  // Social connections
  socialConnections?: SocialConnections;
  
  // Metadata
  metadata?: {
    source?: 'web' | 'mobile' | 'referral';
    referralCode?: string;
    utm?: {
      source?: string;
      medium?: string;
      campaign?: string;
    };
  };
}

export type UserRole = 'customer' | 'admin' | 'coach' | 'premium' | 'vip';

export interface UserLocation {
  country?: string;
  city?: string;
  timezone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UserPreferences {
  language: 'fr' | 'en' | 'es';
  theme?: 'light' | 'dark' | 'auto';
  currency: 'EUR' | 'USD' | 'GBP';
  
  // Communication preferences
  newsletter: boolean;
  notifications: boolean;
  emailMarketing: boolean;
  smsMarketing?: boolean;
  
  // Content preferences
  contentTypes?: ContentType[];
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Privacy settings
  profileVisibility?: 'public' | 'private' | 'friends';
  shareProgress?: boolean;
  shareWorkouts?: boolean;
}

export interface FitnessProfile {
  // Goals and objectives
  goals: FitnessGoal[];
  primaryGoal?: FitnessGoal;
  targetWeight?: number;
  targetBodyFat?: number;
  
  // Experience and background
  experience: ExperienceLevel;
  fitnessBackground?: string;
  injuries?: string[];
  medicalConditions?: string[];
  
  // Physical metrics
  currentWeight?: number;
  height?: number;
  bodyFat?: number;
  muscleMass?: number;
  
  // Training preferences
  preferredWorkoutTypes?: WorkoutType[];
  equipment: Equipment[];
  workoutFrequency: number; // times per week
  timePerWorkout: number; // minutes
  preferredWorkoutTimes?: ('morning' | 'afternoon' | 'evening' | 'night')[];
  
  // Nutrition preferences
  dietaryRestrictions?: DietaryRestriction[];
  allergies?: string[];
  preferredCuisines?: string[];
  mealFrequency?: number; // meals per day
  
  // G-Maxing specific
  gmaxingLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  geneticOptimizationGoals?: GeneticOptimizationGoal[];
}

export type FitnessGoal = 
  | 'muscle_gain'
  | 'fat_loss' 
  | 'strength'
  | 'endurance'
  | 'flexibility'
  | 'athletic_performance'
  | 'general_health'
  | 'body_recomposition'
  | 'g_maxing'
  | 'genetic_optimization';

export type ExperienceLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'expert';

export type WorkoutType = 
  | 'strength_training'
  | 'cardio'
  | 'hiit'
  | 'yoga'
  | 'pilates'
  | 'calisthenics'
  | 'powerlifting'
  | 'bodybuilding'
  | 'crossfit'
  | 'martial_arts'
  | 'dance'
  | 'sports'
  | 'g_maxing_protocol';

export type Equipment = 
  | 'gym_access'
  | 'dumbbells'
  | 'barbell'
  | 'resistance_bands'
  | 'kettlebells'
  | 'pull_up_bar'
  | 'bench'
  | 'squat_rack'
  | 'cardio_machine'
  | 'no_equipment'
  | 'home_gym';

export type DietaryRestriction = 
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'keto'
  | 'paleo'
  | 'mediterranean'
  | 'low_carb'
  | 'low_fat'
  | 'gluten_free'
  | 'dairy_free'
  | 'halal'
  | 'kosher'
  | 'intermittent_fasting';

export type GeneticOptimizationGoal = 
  | 'maximize_muscle_fiber_recruitment'
  | 'optimize_hormone_production'
  | 'enhance_recovery_capacity'
  | 'improve_nutrient_utilization'
  | 'boost_metabolic_flexibility'
  | 'increase_bone_density'
  | 'optimize_sleep_quality'
  | 'enhance_cognitive_function';

export type ContentType = 
  | 'workout_plans'
  | 'nutrition_guides'
  | 'educational_content'
  | 'transformation_stories'
  | 'recipes'
  | 'supplements_info'
  | 'lifestyle_tips'
  | 'g_maxing_protocols';

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod?: PaymentMethod;
  billingAddress?: BillingAddress;
  
  // Trial information
  trialUsed?: boolean;
  trialEndDate?: Date;
  
  // Billing history
  lastBillingDate?: Date;
  nextBillingDate?: Date;
  billingAmount?: number;
  currency: 'EUR' | 'USD' | 'GBP';
}

export type SubscriptionPlan = 
  | 'free'
  | 'basic'
  | 'premium'
  | 'vip'
  | 'lifetime'
  | 'coach_access'
  | 'g_maxing_elite';

export type SubscriptionStatus = 
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'pending'
  | 'trial'
  | 'paused';

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'bank_transfer' | 'crypto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface BillingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface ProgressTracking {
  // Measurements
  weightHistory: WeightEntry[];
  bodyFatHistory?: BodyCompositionEntry[];
  measurements?: MeasurementEntry[];
  
  // Photos
  progressPhotos?: ProgressPhoto[];
  
  // Workout tracking
  workoutHistory?: WorkoutSession[];
  personalRecords?: PersonalRecord[];
  
  // Nutrition tracking
  nutritionLogs?: NutritionLog[];
  
  // Goals tracking
  goalsProgress?: GoalProgress[];
  
  // G-Maxing specific metrics
  gmaxingMetrics?: GMaxingMetrics;
}

export interface WeightEntry {
  date: Date;
  weight: number;
  bodyFat?: number;
  notes?: string;
}

export interface BodyCompositionEntry {
  date: Date;
  bodyFat: number;
  muscleMass?: number;
  boneMass?: number;
  waterPercentage?: number;
  visceralFat?: number;
  metabolicAge?: number;
}

export interface MeasurementEntry {
  date: Date;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
    neck?: number;
    shoulders?: number;
    calves?: number;
  };
  unit: 'cm' | 'inches';
}

export interface ProgressPhoto {
  id: string;
  date: Date;
  type: 'front' | 'side' | 'back' | 'other';
  imageUrl: string;
  thumbnailUrl?: string;
  notes?: string;
  isPrivate: boolean;
}

export interface WorkoutSession {
  id: string;
  date: Date;
  duration: number; // minutes
  workoutType: WorkoutType;
  exercises?: ExerciseLog[];
  notes?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  enjoyment: 1 | 2 | 3 | 4 | 5;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface SetLog {
  weight?: number;
  reps?: number;
  duration?: number; // seconds
  distance?: number; // meters
  rest?: number; // seconds
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: 'max_weight' | 'max_reps' | 'max_duration' | 'max_distance';
  value: number;
  unit: string;
  date: Date;
  notes?: string;
}

export interface NutritionLog {
  date: Date;
  meals: MealLog[];
  totalCalories?: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  water?: number; // liters
  notes?: string;
}

export interface MealLog {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodEntry[];
  time?: Date;
}

export interface FoodEntry {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface GoalProgress {
  goalId: string;
  goalType: FitnessGoal;
  startDate: Date;
  targetDate?: Date;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  targetValue?: number;
  achievedDate?: Date;
  status: 'pending' | 'achieved' | 'missed';
}

export interface GMaxingMetrics {
  // Genetic optimization scores
  overallScore?: number; // 0-100
  muscleOptimization?: number;
  metabolicOptimization?: number;
  recoveryOptimization?: number;
  hormonalOptimization?: number;
  
  // Tracking dates
  lastAssessment?: Date;
  nextRecommendedAssessment?: Date;
  
  // Progress trends
  trends?: {
    muscle: 'improving' | 'stable' | 'declining';
    metabolism: 'improving' | 'stable' | 'declining';
    recovery: 'improving' | 'stable' | 'declining';
    hormonal: 'improving' | 'stable' | 'declining';
  };
  
  // Personalized recommendations
  currentRecommendations?: GMaxingRecommendation[];
}

export interface GMaxingRecommendation {
  id: string;
  category: 'training' | 'nutrition' | 'recovery' | 'lifestyle' | 'supplementation';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedImpact: 1 | 2 | 3 | 4 | 5;
  timeframe: string; // e.g., "2-4 weeks"
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  createdDate: Date;
}

export interface SocialConnections {
  // Social media links
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  website?: string;
  
  // Platform connections
  friends?: string[]; // user IDs
  following?: string[]; // user IDs
  followers?: string[]; // user IDs
  
  // Community participation
  groupMemberships?: string[]; // group IDs
  coachingRelationships?: CoachingRelationship[];
  
  // Privacy settings
  allowFriendRequests?: boolean;
  showOnLeaderboards?: boolean;
  allowWorkoutSharing?: boolean;
}

export interface CoachingRelationship {
  coachId: string;
  coachName: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  type: 'one_time' | 'ongoing' | 'program_based';
  communicationChannels?: ('chat' | 'video' | 'email' | 'phone')[];
}

// User authentication states
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// User activity tracking
export interface UserActivity {
  userId: string;
  action: UserAction;
  timestamp: Date;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export type UserAction = 
  | 'login'
  | 'logout'
  | 'register'
  | 'profile_update'
  | 'workout_log'
  | 'progress_photo'
  | 'purchase'
  | 'subscription_change'
  | 'goal_set'
  | 'goal_achieved'
  | 'coach_session'
  | 'content_view'
  | 'social_interaction';

// User statistics for analytics
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersByRole: Record<UserRole, number>;
  usersBySubscription: Record<SubscriptionPlan, number>;
  averageSessionDuration: number;
  retentionRates: {
    day1: number;
    day7: number;
    day30: number;
  };
  topGoals: Array<{
    goal: FitnessGoal;
    count: number;
  }>;
}