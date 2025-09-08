// DEPRECATED: Firebase Storage has been replaced by Cloudinary
// This file is kept for reference and migration purposes
// Use CloudinaryStorageService from '../cloudinary' instead

// Import Cloudinary service as replacement
import { CloudinaryStorageService } from '../cloudinary';

// DEPRECATED: Use CloudinaryStorageService instead
// This class is kept for reference and backward compatibility
export class StorageService {
  
  // Redirect all methods to Cloudinary service
  static async uploadFile(...args: any[]) {
    console.warn('StorageService.uploadFile is deprecated. Use CloudinaryStorageService.uploadFile instead.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  static async uploadMultipleFiles(...args: any[]) {
    console.warn('StorageService.uploadMultipleFiles is deprecated. Use CloudinaryStorageService.uploadMultipleFiles instead.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  static async getFileURL(...args: any[]) {
    console.warn('StorageService.getFileURL is deprecated. Use CloudinaryStorageService.getOptimizedImageUrl instead.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  static async deleteFile(...args: any[]) {
    console.warn('StorageService.deleteFile is deprecated. Use CloudinaryStorageService.deleteFile instead.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  static async deleteMultipleFiles(...args: any[]) {
    console.warn('StorageService.deleteMultipleFiles is deprecated. Use CloudinaryStorageService instead.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  static async listFiles(...args: any[]) {
    console.warn('StorageService.listFiles is deprecated. Cloudinary uses a different approach for file management.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  static async getFileMetadata(...args: any[]) {
    console.warn('StorageService.getFileMetadata is deprecated. Metadata is returned with upload results in Cloudinary.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  static async updateFileMetadata(...args: any[]) {
    console.warn('StorageService.updateFileMetadata is deprecated. Use Cloudinary tags and context instead.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  static async fileExists(...args: any[]) {
    console.warn('StorageService.fileExists is deprecated. Cloudinary handles this differently.');
    throw new Error('Firebase Storage has been replaced by Cloudinary. Please update your code to use CloudinaryStorageService.');
  }
  
  // Keep utility methods that don't depend on Firebase Storage
  static generateFilePath(
    directory: string,
    fileName: string,
    userId?: string
  ): string {
    console.warn('StorageService.generateFilePath is deprecated. Use CloudinaryStorageService.generateFolderPath instead.');
    return CloudinaryStorageService.generateFolderPath(directory, userId);
  }

  static async resizeImage(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<File> {
    console.warn('StorageService.resizeImage is deprecated. Use CloudinaryStorageService.resizeImage instead.');
    return CloudinaryStorageService.resizeImage(file, maxWidth, maxHeight, quality);
  }

  static validateFile(
    file: File,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: number = 10 * 1024 * 1024 // 10MB for Cloudinary
  ): { valid: boolean; error?: string } {
    console.warn('StorageService.validateFile is deprecated. Use CloudinaryStorageService.validateFile instead.');
    return CloudinaryStorageService.validateFile(file, allowedTypes, maxSizeBytes);
  }
}

export default StorageService;

// DEPRECATED: Use CLOUDINARY_FOLDERS instead
export const STORAGE_PATHS = {
  // Public assets
  PRODUCTS: 'products',
  BLOG: 'blog',
  TESTIMONIALS: 'testimonials',
  SITE_ASSETS: 'site-assets',
  
  // User-specific content
  USER_PROFILES: (userId: string) => `users/${userId}/profile`,
  USER_PROGRESS: (userId: string) => `users/${userId}/progress`,
  USER_DOCUMENTS: (userId: string) => `users/${userId}/documents`,
  
  // Generated content
  PROTOCOLS: (userId: string) => `protocols/${userId}`,
  REPORTS: 'reports',
  EXPORTS: 'exports',
  
  // Temporary uploads
  TEMP: (userId: string) => `temp/${userId}`,
  
  // Email assets
  EMAIL_ASSETS: 'email-assets',
  
  // Social media cache
  SOCIAL: 'social',
} as const;

// File type constants (kept for compatibility)
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENTS: ['application/pdf', 'text/plain', 'application/msword'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/quicktime'],
  ALL: ['*/*'],
} as const;