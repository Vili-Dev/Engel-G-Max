// Supplement Protocol Management for Engel G-Max platform

export interface SupplementProtocol {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  
  // Pricing and Stripe integration
  price: number;
  currency: 'EUR';
  stripeProductId?: string;
  stripePriceId?: string;
  
  // Protocol details
  category: ProtocolCategory;
  targetAudience: TargetAudience[];
  difficulty: DifficultyLevel;
  duration: string; // "8 semaines", "6-12 semaines"
  
  // Budget estimation
  estimatedBudget?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Content and instructions
  content: string; // Rich text content with full protocol
  includes: ProtocolInclude[];
  requirements?: string[];
  
  // Media
  featuredImage?: string;
  gallery?: ProtocolImage[];
  videos?: ProtocolVideo[];
  
  // SEO and marketing
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  tags: string[];
  
  // Status and visibility
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  
  // Analytics and engagement
  viewCount: number;
  purchaseCount: number;
  rating?: number;
  reviewCount: number;
  
  // Author and timestamps
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export type ProtocolCategory = 
  | 'looxmax' // Amélioration apparence faciale
  | 'performance' // SARMs, peptides pour physique
  | 'productivity' // Nootropiques
  | 'advanced' // Protocoles avancés avec peptides
  | 'coaching'; // Accompagnement personnalisé

export type TargetAudience = 
  | 'beginners'
  | 'intermediate' 
  | 'advanced'
  | 'entrepreneurs'
  | 'students'
  | 'athletes'
  | 'busy_professionals';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ProtocolInclude {
  id: string;
  type: 'supplement' | 'guide' | 'consultation' | 'support' | 'tool' | 'app';
  name: string;
  description: string;
  icon?: string;
  quantity?: string; // "2 appels vidéo", "Plan diète personnalisé"
}

export interface ProtocolImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  caption?: string;
  type: 'before_after' | 'product' | 'result' | 'instruction';
}

export interface ProtocolVideo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  description?: string;
  duration?: number; // in seconds
  platform: 'youtube' | 'vimeo' | 'self_hosted';
  embedCode?: string;
  type: 'explanation' | 'testimonial' | 'instruction';
}

// Protocol reviews and testimonials
export interface ProtocolReview {
  id: string;
  protocolId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  rating: number; // 1-5 stars
  title?: string;
  comment: string;
  
  // Verification
  verified: boolean; // Verified purchaser
  
  // Before/after photos
  beforeAfterImages?: {
    before: string;
    after: string;
    description?: string;
  }[];
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationReason?: string;
  
  // Engagement
  helpfulCount: number;
  reportCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// Protocol analytics
export interface ProtocolAnalytics {
  protocolId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  
  // Traffic metrics
  views: number;
  uniqueViews: number;
  averageTimeOnPage: number;
  bounceRate: number;
  
  // Conversion metrics
  conversionRate: number;
  sales: number;
  revenue: number;
  refunds: number;
  
  // Engagement
  likes: number;
  shares: number;
  comments: number;
  
  // Traffic sources
  trafficSources: {
    direct: number;
    search: number;
    social: number;
    referral: number;
    email: number;
  };
}

// Bundle system for multi-protocol discounts
export interface ProtocolBundle {
  id: string;
  name: string;
  description: string;
  protocolIds: string[];
  
  // Pricing
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  
  // Stripe integration
  stripeProductId?: string;
  stripePriceId?: string;
  
  // Status
  status: 'active' | 'inactive';
  featured: boolean;
  
  // Analytics
  purchaseCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// Admin forms for CRUD operations
export interface CreateProtocolRequest {
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  category: ProtocolCategory;
  targetAudience: TargetAudience[];
  difficulty: DifficultyLevel;
  duration?: string;
  content: string;
  includes: Omit<ProtocolInclude, 'id'>[];
  requirements?: string[];
  tags?: string[];
  estimatedBudget?: {
    min: number;
    max: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
}

export interface UpdateProtocolRequest extends Partial<CreateProtocolRequest> {
  id: string;
}

// Search and filtering
export interface ProtocolFilters {
  category?: ProtocolCategory[];
  difficulty?: DifficultyLevel[];
  priceRange?: {
    min: number;
    max: number;
  };
  targetAudience?: TargetAudience[];
  tags?: string[];
  status?: ('draft' | 'published' | 'archived')[];
  featured?: boolean;
  sortBy?: 'name' | 'price' | 'created' | 'updated' | 'popularity' | 'rating';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProtocolSearchResult {
  protocols: SupplementProtocol[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: ProtocolFilters;
}

// Comments system for protocol discussions
export interface ProtocolComment {
  id: string;
  protocolId: string;
  parentId?: string; // for nested replies
  
  // Author
  userId?: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  isVerifiedPurchaser?: boolean;
  
  // Content
  content: string;
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationReason?: string;
  
  // Engagement
  likeCount: number;
  reportCount: number;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Nested replies
  replies?: ProtocolComment[];
}

// Video management for protocol explanations
export interface ProtocolVideoComment {
  id: string;
  videoId: string;
  userId?: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  
  content: string;
  timestamp?: number; // Video timestamp in seconds
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Date;
  
  // Engagement
  likeCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}