// Zod validation schemas for EngelGMax platform

import { z } from 'zod';

// Common validation patterns
export const emailSchema = z.string()
  .email('Veuillez saisir une adresse email valide')
  .min(5, 'L\'email doit contenir au moins 5 caractères')
  .max(254, 'L\'email ne peut pas dépasser 254 caractères');

export const passwordSchema = z.string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial');

export const phoneSchema = z.string()
  .regex(/^(\+33|0)[1-9](\d{8})$/, 'Veuillez saisir un numéro de téléphone français valide')
  .optional();

export const urlSchema = z.string()
  .url('Veuillez saisir une URL valide')
  .optional();

export const slugSchema = z.string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets');

// User schemas
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  displayName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(30, 'Le prénom ne peut pas dépasser 30 caractères')
    .optional(),
  lastName: z.string()
    .min(2, 'Le nom de famille doit contenir au moins 2 caractères')
    .max(30, 'Le nom de famille ne peut pas dépasser 30 caractères')
    .optional(),
  acceptTerms: z.boolean()
    .refine((val) => val === true, 'Vous devez accepter les conditions d\'utilisation'),
  acceptPrivacy: z.boolean()
    .refine((val) => val === true, 'Vous devez accepter la politique de confidentialité'),
  acceptNewsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const userProfileUpdateSchema = z.object({
  displayName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .optional(),
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(30, 'Le prénom ne peut pas dépasser 30 caractères')
    .optional(),
  lastName: z.string()
    .min(2, 'Le nom de famille doit contenir au moins 2 caractères')
    .max(30, 'Le nom de famille ne peut pas dépasser 30 caractères')
    .optional(),
  phoneNumber: phoneSchema,
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    timezone: z.string().optional(),
  }).optional(),
});

// Fitness profile schemas
export const fitnessProfileSchema = z.object({
  goals: z.array(z.enum([
    'muscle_gain',
    'fat_loss',
    'strength',
    'endurance',
    'flexibility',
    'athletic_performance',
    'general_health',
    'body_recomposition',
    'g_maxing',
    'genetic_optimization'
  ])).min(1, 'Veuillez sélectionner au moins un objectif'),
  
  experience: z.enum(['beginner', 'novice', 'intermediate', 'advanced', 'expert']),
  
  currentWeight: z.number()
    .min(30, 'Le poids doit être d\'au moins 30 kg')
    .max(300, 'Le poids ne peut pas dépasser 300 kg')
    .optional(),
    
  height: z.number()
    .min(100, 'La taille doit être d\'au moins 100 cm')
    .max(250, 'La taille ne peut pas dépasser 250 cm')
    .optional(),
    
  targetWeight: z.number()
    .min(30, 'Le poids cible doit être d\'au moins 30 kg')
    .max(300, 'Le poids cible ne peut pas dépasser 300 kg')
    .optional(),
    
  equipment: z.array(z.enum([
    'gym_access',
    'dumbbells',
    'barbell',
    'resistance_bands',
    'kettlebells',
    'pull_up_bar',
    'bench',
    'squat_rack',
    'cardio_machine',
    'no_equipment',
    'home_gym'
  ])).min(1, 'Veuillez sélectionner au moins un équipement'),
  
  workoutFrequency: z.number()
    .min(1, 'Vous devez vous entraîner au moins 1 fois par semaine')
    .max(7, 'Vous ne pouvez pas vous entraîner plus de 7 fois par semaine'),
    
  timePerWorkout: z.number()
    .min(15, 'L\'entraînement doit durer au moins 15 minutes')
    .max(180, 'L\'entraînement ne peut pas durer plus de 3 heures'),
    
  dietaryRestrictions: z.array(z.enum([
    'vegetarian',
    'vegan',
    'pescatarian',
    'keto',
    'paleo',
    'mediterranean',
    'low_carb',
    'low_fat',
    'gluten_free',
    'dairy_free',
    'halal',
    'kosher',
    'intermittent_fasting'
  ])).optional(),
  
  allergies: z.array(z.string()).optional(),
  
  injuries: z.array(z.string()).optional(),
  
  medicalConditions: z.array(z.string()).optional(),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string()
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  message: z.string()
    .min(20, 'Le message doit contenir au moins 20 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
  acceptPrivacy: z.boolean()
    .refine((val) => val === true, 'Vous devez accepter la politique de confidentialité'),
});

// Newsletter subscription schema
export const newsletterSubscriptionSchema = z.object({
  email: emailSchema,
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .optional(),
  interests: z.array(z.string()).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  acceptPrivacy: z.boolean()
    .refine((val) => val === true, 'Vous devez accepter la politique de confidentialité'),
});

// Product schemas
export const productCreateSchema = z.object({
  name: z.string()
    .min(3, 'Le nom du produit doit contenir au moins 3 caractères')
    .max(200, 'Le nom du produit ne peut pas dépasser 200 caractères'),
  slug: slugSchema,
  description: z.string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(5000, 'La description ne peut pas dépasser 5000 caractères'),
  shortDescription: z.string()
    .max(500, 'La description courte ne peut pas dépasser 500 caractères')
    .optional(),
  price: z.number()
    .min(0, 'Le prix ne peut pas être négatif')
    .max(10000, 'Le prix ne peut pas dépasser 10 000 €'),
  originalPrice: z.number()
    .min(0, 'Le prix original ne peut pas être négatif')
    .max(10000, 'Le prix original ne peut pas dépasser 10 000 €')
    .optional(),
  category: z.enum([
    'g_maxing_protocols',
    'training_programs',
    'nutrition_guides',
    'coaching_services',
    'educational_content',
    'assessments',
    'memberships',
    'bundles',
    'supplements',
    'equipment',
    'apparel'
  ]),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  gmaxingLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'all']).optional(),
  difficulty: z.number().min(1).max(5),
  duration: z.number().min(1).optional(),
  seoTitle: z.string().max(60, 'Le titre SEO ne peut pas dépasser 60 caractères').optional(),
  seoDescription: z.string().max(160, 'La description SEO ne peut pas dépasser 160 caractères').optional(),
  seoKeywords: z.array(z.string()).optional(),
});

// Blog post schemas
export const blogPostCreateSchema = z.object({
  title: z.string()
    .min(10, 'Le titre doit contenir au moins 10 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  slug: slugSchema,
  excerpt: z.string()
    .max(500, 'L\'extrait ne peut pas dépasser 500 caractères')
    .optional(),
  content: z.string()
    .min(100, 'Le contenu doit contenir au moins 100 caractères')
    .max(50000, 'Le contenu ne peut pas dépasser 50 000 caractères'),
  category: z.enum([
    'g_maxing_guide',
    'transformation_stories',
    'nutrition_tips',
    'workout_guides',
    'lifestyle',
    'science_research',
    'success_stories',
    'engel_updates',
    'expert_interviews',
    'product_updates',
    'community_highlights'
  ]),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  gmaxingLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  focusKeyword: z.string()
    .min(2, 'Le mot-clé principal doit contenir au moins 2 caractères')
    .max(100, 'Le mot-clé principal ne peut pas dépasser 100 caractères')
    .optional(),
  seoTitle: z.string().max(60, 'Le titre SEO ne peut pas dépasser 60 caractères').optional(),
  seoDescription: z.string().max(160, 'La description SEO ne peut pas dépasser 160 caractères').optional(),
  seoKeywords: z.array(z.string()).optional(),
});

// Comment schema
export const commentSchema = z.object({
  content: z.string()
    .min(10, 'Le commentaire doit contenir au moins 10 caractères')
    .max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
  authorName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  authorEmail: emailSchema,
  authorUrl: urlSchema,
  parentId: z.string().optional(),
});

// Order and checkout schemas
export const checkoutSchema = z.object({
  billingAddress: z.object({
    name: z.string().min(2, 'Le nom est requis'),
    company: z.string().optional(),
    line1: z.string().min(5, 'L\'adresse est requise'),
    line2: z.string().optional(),
    city: z.string().min(2, 'La ville est requise'),
    state: z.string().optional(),
    postalCode: z.string()
      .regex(/^[0-9]{5}$/, 'Le code postal doit contenir 5 chiffres'),
    country: z.string().min(2, 'Le pays est requis'),
    phone: phoneSchema,
  }),
  
  shippingAddress: z.object({
    name: z.string().min(2, 'Le nom est requis'),
    company: z.string().optional(),
    line1: z.string().min(5, 'L\'adresse est requise'),
    line2: z.string().optional(),
    city: z.string().min(2, 'La ville est requise'),
    state: z.string().optional(),
    postalCode: z.string()
      .regex(/^[0-9]{5}$/, 'Le code postal doit contenir 5 chiffres'),
    country: z.string().min(2, 'Le pays est requis'),
    phone: phoneSchema,
  }).optional(),
  
  useShippingAsBilling: z.boolean().optional(),
  
  paymentMethod: z.enum(['card', 'paypal', 'bank_transfer']),
  
  notes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional(),
  
  acceptTerms: z.boolean()
    .refine((val) => val === true, 'Vous devez accepter les conditions de vente'),
});

// Progress tracking schemas
export const weightEntrySchema = z.object({
  weight: z.number()
    .min(30, 'Le poids doit être d\'au moins 30 kg')
    .max(300, 'Le poids ne peut pas dépasser 300 kg'),
  bodyFat: z.number()
    .min(3, 'Le pourcentage de graisse corporelle doit être d\'au moins 3%')
    .max(50, 'Le pourcentage de graisse corporelle ne peut pas dépasser 50%')
    .optional(),
  date: z.date(),
  notes: z.string().max(200, 'Les notes ne peuvent pas dépasser 200 caractères').optional(),
});

export const measurementEntrySchema = z.object({
  date: z.date(),
  measurements: z.object({
    chest: z.number().min(50).max(200).optional(),
    waist: z.number().min(50).max(200).optional(),
    hips: z.number().min(50).max(200).optional(),
    thighs: z.number().min(30).max(100).optional(),
    arms: z.number().min(15).max(60).optional(),
    neck: z.number().min(25).max(60).optional(),
    shoulders: z.number().min(80).max(180).optional(),
    calves: z.number().min(20).max(60).optional(),
  }),
  unit: z.enum(['cm', 'inches']),
});

// Admin schemas
export const adminUserCreateSchema = z.object({
  email: emailSchema,
  displayName: z.string().min(2).max(50),
  role: z.enum(['admin', 'coach', 'customer', 'premium', 'vip']),
  password: passwordSchema,
  sendInviteEmail: z.boolean().optional(),
});

// File upload schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Un fichier est requis' }),
  folder: z.string().optional(),
  isPublic: z.boolean().optional(),
  alt: z.string().max(200, 'Le texte alternatif ne peut pas dépasser 200 caractères').optional(),
  caption: z.string().max(500, 'La légende ne peut pas dépasser 500 caractères').optional(),
});

// Search schema
export const searchSchema = z.object({
  query: z.string()
    .min(2, 'La recherche doit contenir au moins 2 caractères')
    .max(100, 'La recherche ne peut pas dépasser 100 caractères'),
  filters: z.object({
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    priceMin: z.number().min(0).optional(),
    priceMax: z.number().max(10000).optional(),
    difficulty: z.number().min(1).max(5).optional(),
    gmaxingLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  }).optional(),
  sortBy: z.enum(['relevance', 'date', 'price', 'popularity', 'rating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Report schemas
export const reportContentSchema = z.object({
  contentType: z.enum(['post', 'comment', 'user', 'product']),
  contentId: z.string().min(1, 'L\'ID du contenu est requis'),
  reason: z.enum([
    'spam',
    'inappropriate',
    'harassment',
    'misinformation',
    'copyright',
    'other'
  ]),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
});

// Export type inference helpers
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;
export type FitnessProfileInput = z.infer<typeof fitnessProfileSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type WeightEntryInput = z.infer<typeof weightEntrySchema>;
export type MeasurementEntryInput = z.infer<typeof measurementEntrySchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ReportContentInput = z.infer<typeof reportContentSchema>;