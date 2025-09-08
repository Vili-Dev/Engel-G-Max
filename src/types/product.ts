// Product and E-commerce type definitions for EngelGMax platform

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  
  // Pricing
  price: number;
  originalPrice?: number;
  currency: 'EUR' | 'USD' | 'GBP';
  salePrice?: number;
  saleEndDate?: Date;
  
  // Product details
  category: ProductCategory;
  subcategory?: string;
  tags: string[];
  sku?: string;
  
  // Media
  images: ProductImage[];
  videos?: ProductVideo[];
  downloadableFiles?: DownloadableFile[];
  
  // Product type and delivery
  type: ProductType;
  isDigital: boolean;
  isDownloadable: boolean;
  requiresShipping: boolean;
  
  // Availability
  status: ProductStatus;
  featured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  allowBackorder?: boolean;
  
  // SEO and marketing
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // G-Maxing specific
  gmaxingLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'all';
  targetGoals?: string[];
  duration?: number; // in weeks or days
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // Content details (for digital products)
  content?: ProductContent;
  
  // Reviews and ratings
  averageRating?: number;
  totalReviews?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Analytics
  viewCount?: number;
  purchaseCount?: number;
  
  // Related products
  relatedProducts?: string[];
  upsells?: string[];
  crossSells?: string[];
  
  // Variants (for products with options)
  variants?: ProductVariant[];
  
  // Subscription options (for recurring products)
  subscription?: SubscriptionOptions;
}

export type ProductType = 
  | 'protocol'
  | 'course'
  | 'ebook'
  | 'video_series'
  | 'coaching_session'
  | 'consultation'
  | 'meal_plan'
  | 'supplement_guide'
  | 'workout_plan'
  | 'assessment'
  | 'membership'
  | 'bundle'
  | 'physical_product';

export type ProductCategory = 
  | 'g_maxing_protocols'
  | 'training_programs'
  | 'nutrition_guides'
  | 'coaching_services'
  | 'educational_content'
  | 'assessments'
  | 'memberships'
  | 'bundles'
  | 'supplements'
  | 'equipment'
  | 'apparel';

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived';

export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  duration?: number; // in seconds
  type: 'intro' | 'demo' | 'testimonial' | 'educational';
  isPreview: boolean;
}

export interface DownloadableFile {
  id: string;
  name: string;
  url: string;
  fileSize: number; // in bytes
  fileType: string;
  description?: string;
  downloadLimit?: number;
  isPreview: boolean;
}

export interface ProductContent {
  // For digital products like courses, protocols
  modules?: ContentModule[];
  totalDuration?: number; // in minutes
  totalLessons?: number;
  
  // For downloadable content
  pdfPages?: number;
  videoHours?: number;
  audioHours?: number;
  
  // For protocols and programs
  workouts?: number;
  exercises?: number;
  mealPlans?: number;
  recipes?: number;
  
  // Access and completion
  accessDuration?: number; // in days, null for lifetime
  requiresSequentialAccess?: boolean;
  hasQuizzes?: boolean;
  hasCertificate?: boolean;
  
  // G-Maxing specific content metrics
  optimizationScore?: number;
  scientificReferences?: number;
  beforeAfterExamples?: number;
}

export interface ContentModule {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  duration?: number; // in minutes
  lessons: ContentLesson[];
  isLocked?: boolean;
  prerequisiteModules?: string[];
}

export interface ContentLesson {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  type: 'video' | 'text' | 'audio' | 'pdf' | 'quiz' | 'exercise' | 'download';
  duration?: number; // in minutes
  content?: string;
  resources?: LessonResource[];
  isPreview: boolean;
  isCompleted?: boolean;
}

export interface LessonResource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'link' | 'image';
  url: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity?: number;
  attributes: VariantAttribute[];
  image?: ProductImage;
}

export interface VariantAttribute {
  name: string; // e.g., 'Duration', 'Level', 'Format'
  value: string; // e.g., '4 weeks', 'Beginner', 'PDF'
}

export interface SubscriptionOptions {
  available: boolean;
  intervals: SubscriptionInterval[];
  trialPeriod?: number; // in days
  setupFee?: number;
  cancellationPolicy?: string;
}

export interface SubscriptionInterval {
  interval: 'week' | 'month' | 'quarter' | 'year';
  intervalCount: number; // e.g., 1 for monthly, 3 for quarterly
  price: number;
  discount?: number; // percentage discount from regular price
}

// Shopping Cart and Checkout
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  subscriptionInterval?: SubscriptionInterval;
  price: number; // calculated price including discounts
  originalPrice: number;
  totalPrice: number;
  addedAt: Date;
  
  // Customizations for services
  customizations?: CartItemCustomization[];
}

export interface CartItemCustomization {
  name: string;
  value: string;
  additionalCost?: number;
}

export interface ShoppingCart {
  id: string;
  userId?: string; // null for guest carts
  items: CartItem[];
  subtotal: number;
  taxes?: TaxBreakdown[];
  shipping?: ShippingOption;
  discounts?: AppliedDiscount[];
  total: number;
  currency: 'EUR' | 'USD' | 'GBP';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface TaxBreakdown {
  name: string; // e.g., 'VAT', 'Sales Tax'
  rate: number; // percentage
  amount: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: number;
  carrier?: string;
  trackingAvailable: boolean;
}

export interface AppliedDiscount {
  code?: string;
  type: 'coupon' | 'automatic' | 'loyalty' | 'bulk';
  name: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  amount: number; // actual discount amount
  appliedTo?: 'cart' | 'shipping' | 'specific_items';
  applicableItems?: string[]; // product IDs
}

// Orders
export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  
  // Order details
  items: OrderItem[];
  subtotal: number;
  taxes: TaxBreakdown[];
  shipping?: ShippingDetails;
  discounts: AppliedDiscount[];
  total: number;
  currency: 'EUR' | 'USD' | 'GBP';
  
  // Status and tracking
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  
  // Payment information
  paymentMethod: OrderPaymentMethod;
  transactionId?: string;
  
  // Customer information
  billingAddress: Address;
  shippingAddress?: Address;
  
  // Additional information
  notes?: string;
  internalNotes?: string;
  
  // Digital delivery
  downloadLinks?: DownloadLink[];
  accessGranted?: boolean;
  
  // Fulfillment tracking
  trackingNumbers?: TrackingInfo[];
  
  // Refunds and returns
  refunds?: RefundInfo[];
  returns?: ReturnInfo[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productType: ProductType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  
  // Product details at time of purchase
  variant?: ProductVariant;
  customizations?: CartItemCustomization[];
  
  // Digital content access
  downloadLinks?: DownloadLink[];
  accessExpiresAt?: Date;
  
  // Status for individual items
  status: OrderItemStatus;
  fulfilledAt?: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed';

export type PaymentStatus = 
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'partially_paid'
  | 'refunded'
  | 'partially_refunded'
  | 'failed'
  | 'cancelled';

export type FulfillmentStatus = 
  | 'pending'
  | 'processing'
  | 'fulfilled'
  | 'partially_fulfilled'
  | 'cancelled'
  | 'returned';

export type OrderItemStatus = 
  | 'pending'
  | 'processing'
  | 'fulfilled'
  | 'cancelled'
  | 'refunded'
  | 'returned';

export interface OrderPaymentMethod {
  type: 'card' | 'paypal' | 'bank_transfer' | 'crypto' | 'apple_pay' | 'google_pay';
  brand?: string; // e.g., 'visa', 'mastercard'
  last4?: string;
  country?: string;
}

export interface Address {
  name: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface ShippingDetails extends ShippingOption {
  address: Address;
  instructions?: string;
}

export interface DownloadLink {
  fileId: string;
  fileName: string;
  url: string;
  expiresAt?: Date;
  downloadCount: number;
  maxDownloads?: number;
  fileSize: number;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  status?: string;
  lastUpdated?: Date;
}

export interface RefundInfo {
  id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  processedAt?: Date;
  transactionId?: string;
  items?: RefundItem[];
}

export interface RefundItem {
  orderItemId: string;
  productName: string;
  quantity: number;
  amount: number;
  reason: string;
}

export interface ReturnInfo {
  id: string;
  reason: string;
  status: 'requested' | 'approved' | 'received' | 'processed' | 'rejected';
  requestedAt: Date;
  approvedAt?: Date;
  receivedAt?: Date;
  processedAt?: Date;
  trackingNumber?: string;
  refundAmount?: number;
  items: ReturnItem[];
}

export interface ReturnItem {
  orderItemId: string;
  productName: string;
  quantity: number;
  condition?: string;
  notes?: string;
}

// Product Reviews
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Review content
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  content: string;
  
  // Review details
  verified: boolean; // purchased product
  helpful: number; // helpful votes
  
  // Media attachments
  images?: ReviewImage[];
  videos?: ReviewVideo[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected' | 'reported';
  moderatedBy?: string;
  moderatedAt?: Date;
  
  // Response from business
  response?: ReviewResponse;
}

export interface ReviewImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
}

export interface ReviewVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
  duration?: number;
  caption?: string;
}

export interface ReviewResponse {
  content: string;
  respondedBy: string;
  respondedAt: Date;
}

// Coupons and Discounts
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  
  // Discount details
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number; // percentage or amount
  
  // Usage limits
  usageLimit?: number;
  usedCount: number;
  usageLimitPerCustomer?: number;
  
  // Validity
  startDate?: Date;
  endDate?: Date;
  
  // Restrictions
  minimumAmount?: number;
  maximumAmount?: number;
  applicableProducts?: string[];
  applicableCategories?: ProductCategory[];
  excludeProducts?: string[];
  excludeCategories?: ProductCategory[];
  
  // Status
  isActive: boolean;
  isPublic: boolean; // false for targeted coupons
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Inventory Management
export interface InventoryItem {
  productId: string;
  variantId?: string;
  sku: string;
  
  // Stock levels
  quantity: number;
  reserved: number; // in pending orders
  available: number; // quantity - reserved
  
  // Thresholds
  lowStockThreshold?: number;
  outOfStockThreshold?: number;
  
  // Restocking
  restockDate?: Date;
  restockQuantity?: number;
  
  // Tracking
  lastUpdated: Date;
  lastStockCheck?: Date;
  
  // Location (for multi-warehouse)
  location?: string;
  warehouse?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  variantId?: string;
  type: 'inbound' | 'outbound' | 'adjustment';
  reason: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  orderId?: string;
  notes?: string;
  createdAt: Date;
  createdBy: string;
}

// Analytics and Reports
export interface ProductAnalytics {
  productId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  
  // Sales metrics
  revenue: number;
  unitsSold: number;
  ordersCount: number;
  averageOrderValue: number;
  
  // Traffic metrics
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  
  // Customer metrics
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  
  // Product metrics
  averageRating: number;
  totalReviews: number;
  returnRate: number;
  refundRate: number;
  
  // Inventory metrics
  stockTurns: number;
  daysInInventory: number;
}

export interface SalesReport {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  
  // Overall metrics
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  
  // Product performance
  topProducts: Array<{
    productId: string;
    productName: string;
    revenue: number;
    unitsSold: number;
  }>;
  
  // Category performance
  categoryBreakdown: Array<{
    category: ProductCategory;
    revenue: number;
    percentage: number;
  }>;
  
  // Geographic breakdown
  countryBreakdown: Array<{
    country: string;
    revenue: number;
    orders: number;
  }>;
  
  // Trends
  dailyRevenue?: Array<{
    date: Date;
    revenue: number;
    orders: number;
  }>;
}