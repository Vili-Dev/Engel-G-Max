// Blog and Content Management type definitions for EngelGMax platform

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  
  // SEO optimization (critical for "Engel Garcia Gomez" SEO)
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  focusKeyword?: string; // Primary keyword like "Engel Garcia Gomez"
  
  // Author information
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorBio?: string;
  
  // Content classification
  category: BlogCategory;
  subcategory?: string;
  tags: string[];
  
  // Media
  featuredImage?: BlogImage;
  gallery?: BlogImage[];
  videos?: BlogVideo[];
  
  // Publishing
  status: PostStatus;
  published: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  
  // Content metrics
  readingTime?: number; // in minutes
  wordCount?: number;
  
  // Engagement
  viewCount?: number;
  likeCount?: number;
  shareCount?: number;
  commentCount?: number;
  
  // SEO and social
  metaTitle?: string;
  metaDescription?: string;
  socialTitle?: string;
  socialDescription?: string;
  socialImage?: string;
  
  // Content organization
  featured: boolean;
  sticky: boolean; // Pin to top
  allowComments: boolean;
  
  // G-Maxing specific
  gmaxingLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  targetAudience?: TargetAudience[];
  scientificReferences?: ScientificReference[];
  
  // Related content
  relatedPosts?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Content structure for long-form posts
  tableOfContents?: TableOfContentsItem[];
  
  // A/B testing
  variants?: PostVariant[];
  
  // Newsletter integration
  includedInNewsletter?: boolean;
  newsletterSentAt?: Date;
}

export type PostStatus = 'draft' | 'review' | 'published' | 'archived' | 'scheduled';

export type BlogCategory = 
  | 'g_maxing_guide'
  | 'transformation_stories'
  | 'nutrition_tips'
  | 'workout_guides'
  | 'lifestyle'
  | 'science_research'
  | 'success_stories'
  | 'engel_updates'
  | 'expert_interviews'
  | 'product_updates'
  | 'community_highlights';

export type TargetAudience = 
  | 'beginners'
  | 'intermediate'
  | 'advanced'
  | 'men'
  | 'women'
  | 'athletes'
  | 'busy_professionals'
  | 'students'
  | 'seniors'
  | 'parents';

export interface BlogImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  photographer?: string;
  source?: string;
}

export interface BlogVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  duration?: number;
  platform?: 'youtube' | 'vimeo' | 'self_hosted';
  embedCode?: string;
}

export interface ScientificReference {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  doi?: string;
  url?: string;
  pubmedId?: string;
  summary?: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6; // H1-H6
  anchor: string;
  children?: TableOfContentsItem[];
}

export interface PostVariant {
  id: string;
  name: string;
  title?: string;
  excerpt?: string;
  featuredImage?: BlogImage;
  trafficSplit: number; // percentage
  conversionRate?: number;
  isActive: boolean;
}

// Blog Categories Management
export interface BlogCategoryInfo {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  
  // Display
  featured: boolean;
  sortOrder: number;
  
  // Content
  postCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Blog Tags Management
export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  
  // Usage
  postCount: number;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Comments System
export interface BlogComment {
  id: string;
  postId: string;
  parentId?: string; // for nested comments
  
  // Author
  userId?: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  authorAvatar?: string;
  isAuthorVerified?: boolean;
  
  // Content
  content: string;
  
  // Status and moderation
  status: CommentStatus;
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationReason?: string;
  
  // Engagement
  likeCount?: number;
  reportCount?: number;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Nested replies
  replies?: BlogComment[];
}

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam' | 'trash';

// Newsletter Integration
export interface NewsletterPost {
  id: string;
  postId?: string; // linked blog post
  
  // Content
  subject: string;
  content: string;
  preheader?: string;
  
  // Design
  template: string;
  customStyles?: string;
  
  // Targeting
  segments?: string[];
  tags?: string[];
  
  // Scheduling
  status: NewsletterStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  
  // Performance
  sentCount?: number;
  openCount?: number;
  clickCount?: number;
  unsubscribeCount?: number;
  bounceCount?: number;
  
  // A/B Testing
  isAbTest?: boolean;
  abTestVariants?: NewsletterVariant[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type NewsletterStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';

export interface NewsletterVariant {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  content?: string;
  trafficSplit: number;
  
  // Performance
  sentCount: number;
  openCount: number;
  clickCount: number;
  conversionCount?: number;
}

// Content Templates
export interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  type: TemplateType;
  
  // Template content
  titleTemplate?: string;
  contentTemplate: string;
  excerptTemplate?: string;
  
  // SEO templates
  seoTitleTemplate?: string;
  seoDescriptionTemplate?: string;
  
  // Variables for personalization
  variables: TemplateVariable[];
  
  // Usage
  usageCount: number;
  
  // Access control
  isPublic: boolean;
  createdBy: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateType = 
  | 'blog_post'
  | 'product_description'
  | 'email_campaign'
  | 'social_media'
  | 'landing_page';

export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'image';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // for select type
  placeholder?: string;
  description?: string;
}

// Content Analytics
export interface BlogAnalytics {
  postId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  
  // Traffic metrics
  pageViews: number;
  uniqueViews: number;
  avgTimeOnPage: number;
  bounceRate: number;
  exitRate: number;
  
  // Engagement metrics
  likes: number;
  shares: number;
  comments: number;
  socialShares: {
    facebook: number;
    twitter: number;
    linkedin: number;
    instagram: number;
    other: number;
  };
  
  // Conversion metrics
  clickThroughRate?: number;
  conversionRate?: number;
  goalCompletions?: number;
  
  // SEO metrics
  organicTraffic: number;
  searchKeywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    position: number;
  }>;
  
  // Traffic sources
  trafficSources: {
    direct: number;
    search: number;
    social: number;
    referral: number;
    email: number;
  };
  
  // Geographic data
  topCountries: Array<{
    country: string;
    views: number;
    percentage: number;
  }>;
  
  // Device breakdown
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

// Editorial Calendar
export interface EditorialCalendar {
  id: string;
  date: Date;
  posts: CalendarPost[];
  events?: CalendarEvent[];
  notes?: string;
}

export interface CalendarPost {
  id: string;
  postId?: string; // if already created
  title: string;
  status: PostStatus;
  category: BlogCategory;
  assignedTo?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  estimatedReadingTime?: number;
  targetKeywords?: string[];
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'deadline' | 'meeting' | 'launch' | 'campaign' | 'holiday' | 'other';
  description?: string;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
  attendees?: string[];
  color?: string;
}

// Content Workflow
export interface ContentWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  isActive: boolean;
  
  // Assignment
  defaultAssignees?: {
    [stepId: string]: string;
  };
  
  // Templates
  notificationTemplates?: {
    [stepId: string]: string;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  type: 'review' | 'approval' | 'task' | 'notification';
  order: number;
  
  // Requirements
  requiredRole?: string;
  requiredPermission?: string;
  autoAdvance?: boolean;
  
  // Actions
  actions?: WorkflowAction[];
  
  // Conditions
  conditions?: WorkflowCondition[];
}

export interface WorkflowAction {
  type: 'assign' | 'notify' | 'publish' | 'archive' | 'tag' | 'categorize';
  parameters: Record<string, any>;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
}

// Content Assignment and Collaboration
export interface ContentAssignment {
  id: string;
  postId: string;
  assigneeId: string;
  assignerId: string;
  
  // Assignment details
  role: 'writer' | 'editor' | 'reviewer' | 'photographer' | 'designer';
  task: string;
  description?: string;
  
  // Timeline
  assignedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  
  // Status
  status: AssignmentStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Communication
  notes?: string;
  feedback?: string;
  
  // Files and resources
  attachments?: AssignmentAttachment[];
}

export type AssignmentStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';

export interface AssignmentAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

// SEO Analysis and Optimization
export interface SEOAnalysis {
  postId: string;
  analyzedAt: Date;
  
  // Keyword analysis
  focusKeyword: string;
  keywordDensity: number;
  keywordInTitle: boolean;
  keywordInHeadings: boolean;
  keywordInUrl: boolean;
  keywordInMetaDescription: boolean;
  
  // Content analysis
  wordCount: number;
  readabilityScore: number;
  readingLevel: string;
  sentenceLength: number;
  paragraphLength: number;
  
  // Technical SEO
  hasMetaTitle: boolean;
  metaTitleLength: number;
  hasMetaDescription: boolean;
  metaDescriptionLength: number;
  hasAltTags: boolean;
  hasInternalLinks: number;
  hasExternalLinks: number;
  
  // Social optimization
  hasOpenGraphTags: boolean;
  hasTwitterCards: boolean;
  hasSocialImage: boolean;
  
  // Performance
  pageSizeKb: number;
  loadTimeMs: number;
  isMobileFriendly: boolean;
  
  // Overall scores
  overallScore: number; // 0-100
  technicalScore: number;
  contentScore: number;
  userExperienceScore: number;
  
  // Recommendations
  recommendations: SEORecommendation[];
}

export interface SEORecommendation {
  type: 'error' | 'warning' | 'suggestion';
  category: 'keywords' | 'content' | 'technical' | 'social' | 'performance';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  
  // Fix instructions
  howToFix?: string;
  resources?: string[];
}

// Content Performance Reports
export interface ContentPerformanceReport {
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  
  // Overall metrics
  totalPosts: number;
  totalViews: number;
  totalEngagement: number;
  averageReadingTime: number;
  
  // Top performing content
  topPosts: Array<{
    postId: string;
    title: string;
    views: number;
    engagement: number;
    conversionRate?: number;
  }>;
  
  // Category performance
  categoryPerformance: Array<{
    category: BlogCategory;
    postCount: number;
    totalViews: number;
    avgEngagement: number;
  }>;
  
  // Keyword performance
  topKeywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    position: number;
    posts: number;
  }>;
  
  // Author performance
  authorPerformance: Array<{
    authorId: string;
    authorName: string;
    postCount: number;
    totalViews: number;
    avgEngagement: number;
  }>;
  
  // Growth metrics
  viewsGrowth: number; // percentage
  engagementGrowth: number;
  subscriberGrowth: number;
}