// Types export barrel for EngelGMax platform

// User types
export * from './user';

// Product and e-commerce types
export * from './product';

// Blog and content types
export * from './blog';

// G-Maxing protocol types
export * from './protocol';

// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FilterParams {
  [key: string]: any;
}

export interface SearchParams {
  query: string;
  filters?: FilterParams;
  pagination?: PaginationParams;
}

export interface SortOption {
  value: string;
  label: string;
  direction: 'asc' | 'desc';
}

// Form and validation types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: ValidationRule[];
  defaultValue?: any;
  disabled?: boolean;
  help?: string;
}

export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FormError {
  field: string;
  message: string;
}

// Analytics and tracking types
export interface AnalyticsEvent {
  eventName: string;
  eventCategory: 'user' | 'product' | 'content' | 'marketing' | 'system';
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  pageUrl?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  url?: string;
  userAgent?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  userId?: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: Date;
  expiresAt?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'system' | 'marketing' | 'social' | 'transaction' | 'reminder';
}

// Toast notification types
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

// Media and file types
export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  tags?: string[];
  uploadedBy: string;
  uploadedAt: Date;
  folder?: string;
  isPublic: boolean;
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: Record<string, any>;
  robots?: string;
  alternateLanguages?: AlternateLanguage[];
}

export interface AlternateLanguage {
  hreflang: string;
  href: string;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  roles?: string[]; // Required user roles
  permissions?: string[]; // Required permissions
}

export interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

// Theme and styling types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  density: 'compact' | 'comfortable' | 'spacious';
  animations: boolean;
  glassmorphism: boolean;
}

// Internationalization types
export interface Translation {
  [key: string]: string | Translation;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  rtl?: boolean;
}

export interface Locale {
  language: Language;
  country?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: string;
  numberFormat?: {
    decimal: string;
    thousands: string;
    precision: number;
  };
}

// Error handling types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  userId?: string;
  url?: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  eventId?: string;
}

// Configuration types
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  cdnUrl?: string;
  
  // Feature flags
  features: {
    [key: string]: boolean;
  };
  
  // Third-party service configurations
  services: {
    firebase: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId?: string;
    };
    stripe: {
      publishableKey: string;
      webhookSecret?: string;
    };
    analytics: {
      googleAnalyticsId?: string;
      hotjarId?: string;
    };
    email: {
      sendgridApiKey?: string;
      fromEmail: string;
      fromName: string;
    };
  };
  
  // App settings
  settings: {
    defaultLanguage: string;
    supportedLanguages: string[];
    defaultCurrency: string;
    supportedCurrencies: string[];
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
}

// Webhook types
export interface WebhookPayload {
  id: string;
  event: string;
  data: any;
  timestamp: Date;
  signature?: string;
  source: 'stripe' | 'firebase' | 'sendgrid' | 'custom';
}

export interface WebhookResponse {
  received: boolean;
  processed: boolean;
  error?: string;
  timestamp: Date;
}

// Export commonly used utility types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export type SortDirection = 'asc' | 'desc';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export type Position = 'top' | 'bottom' | 'left' | 'right' | 'center';

export type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type NonNullable<T> = T extends null | undefined ? never : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// React component prop types
export type PropsWithClassName<T = {}> = T & {
  className?: string;
};

export type PropsWithChildren<T = {}> = T & {
  children?: React.ReactNode;
};

export type PropsWithRef<T = {}> = T & {
  ref?: React.Ref<any>;
};

export type ComponentProps<T = {}> = PropsWithClassName<PropsWithChildren<T>>;

export type EventHandler<T = Event> = (event: T) => void;

export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Database entity base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface SoftDeleteEntity extends BaseEntity {
  deletedAt?: Date;
  deletedBy?: string;
  isDeleted: boolean;
}

export interface VersionedEntity extends BaseEntity {
  version: number;
  previousVersionId?: string;
}

export interface PublishableEntity extends BaseEntity {
  published: boolean;
  publishedAt?: Date;
  publishedBy?: string;
  status: 'draft' | 'review' | 'published' | 'archived';
}