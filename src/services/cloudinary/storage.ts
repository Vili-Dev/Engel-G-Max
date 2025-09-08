import { cloudinaryClientConfig, generateCloudinaryUrl, isCloudinaryConfigured } from './config';

// Storage service class for Cloudinary
export class CloudinaryStorageService {
  
  // Upload a file using upload widget or direct upload
  static async uploadFile(
    file: File,
    folder: string = '',
    options: {
      tags?: string[];
      metadata?: { [key: string]: string };
      transformation?: { [key: string]: any };
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<{ url: string; publicId: string; metadata: any }> {
    try {
      if (!isCloudinaryConfigured()) {
        throw new Error('Cloudinary is not properly configured');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_preset'); // You'll need to create this in Cloudinary
      
      if (folder) {
        formData.append('folder', folder);
      }
      
      if (options.tags) {
        formData.append('tags', options.tags.join(','));
      }
      
      if (options.metadata) {
        formData.append('context', Object.entries(options.metadata)
          .map(([key, value]) => `${key}=${value}`)
          .join('|')
        );
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryClientConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        metadata: {
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          created_at: result.created_at,
          ...result.context,
        },
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw this.handleCloudinaryError(error);
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(
    files: Array<{ file: File; folder?: string; tags?: string[] }>,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<Array<{ url: string; publicId: string; metadata: any }>> {
    try {
      const uploadPromises = files.map((fileData, index) => 
        this.uploadFile(
          fileData.file,
          fileData.folder || '',
          {
            tags: fileData.tags,
            onProgress: onProgress ? (progress) => onProgress(index, progress) : undefined
          }
        )
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  // Get optimized image URL
  static getOptimizedImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string | number;
      format?: string;
      crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'auto';
    } = {}
  ): string {
    return generateCloudinaryUrl(publicId, {
      ...options,
      fetch_format: 'auto', // Automatic format selection
      quality: options.quality || 'auto', // Automatic quality optimization
    });
  }

  // Get responsive image URLs
  static getResponsiveImageUrls(
    publicId: string,
    breakpoints: number[] = [320, 640, 768, 1024, 1280, 1536]
  ): Array<{ width: number; url: string }> {
    return breakpoints.map(width => ({
      width,
      url: generateCloudinaryUrl(publicId, {
        width,
        crop: 'scale',
        quality: 'auto',
        fetch_format: 'auto',
      }),
    }));
  }

  // Delete a file (requires server-side implementation)
  static async deleteFile(publicId: string): Promise<void> {
    try {
      // Note: This requires server-side implementation with your API secret
      // For now, we'll just log the action
      console.warn('Delete operation requires server-side implementation');
      console.log('File to delete:', publicId);
      
      // You would typically call your backend API here:
      // const response = await fetch('/api/cloudinary/delete', {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ publicId }),
      // });
      
      throw new Error('Delete operation must be implemented on the server side');
    } catch (error) {
      console.error('Delete error:', error);
      throw this.handleCloudinaryError(error);
    }
  }

  // Generate upload signature (requires server-side implementation)
  static async generateUploadSignature(params: { [key: string]: any }): Promise<{
    signature: string;
    timestamp: number;
  }> {
    try {
      // This requires server-side implementation with your API secret
      console.warn('Upload signature generation requires server-side implementation');
      
      // You would typically call your backend API here:
      // const response = await fetch('/api/cloudinary/signature', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(params),
      // });
      
      throw new Error('Upload signature generation must be implemented on the server side');
    } catch (error) {
      console.error('Signature generation error:', error);
      throw this.handleCloudinaryError(error);
    }
  }

  // Resize and optimize image (client-side using Canvas API)
  static async resizeImage(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              resolve(file); // Fallback to original file
            }
          },
          file.type,
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Validate file type and size
  static validateFile(
    file: File,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: number = 10 * 1024 * 1024 // 10MB default (Cloudinary free tier limit)
  ): { valid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
      };
    }
    
    if (file.size > maxSizeBytes) {
      const maxSizeMB = maxSizeBytes / (1024 * 1024);
      return {
        valid: false,
        error: `Fichier trop volumineux. Taille maximale: ${maxSizeMB}MB`
      };
    }
    
    return { valid: true };
  }

  // Generate unique folder path
  static generateFolderPath(
    category: string,
    userId?: string,
    subCategory?: string
  ): string {
    const pathParts = [category];
    
    if (userId) {
      pathParts.push(userId);
    }
    
    if (subCategory) {
      pathParts.push(subCategory);
    }
    
    return pathParts.join('/');
  }

  // Handle Cloudinary errors
  private static handleCloudinaryError(error: any): Error {
    const errorMessages: Record<string, string> = {
      'Invalid upload preset': 'Preset de téléchargement invalide.',
      'File too large': 'Fichier trop volumineux.',
      'Invalid image file': 'Fichier image invalide.',
      'Upload failed': 'Échec du téléchargement.',
      'Network error': 'Erreur de réseau lors du téléchargement.',
    };

    const message = errorMessages[error.message] || error.message || 'Erreur lors de l\'opération sur le fichier.';
    
    return new Error(message);
  }
}

export default CloudinaryStorageService;

// Predefined folder paths
export const CLOUDINARY_FOLDERS = {
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
  
  // Social media content
  SOCIAL: 'social',
} as const;

// File type constants
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENTS: ['application/pdf', 'text/plain', 'application/msword'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/quicktime'],
  ALL: ['*/*'],
} as const;

// Common image transformations
export const IMAGE_TRANSFORMATIONS = {
  THUMBNAIL: { width: 150, height: 150, crop: 'thumb' as const },
  AVATAR: { width: 200, height: 200, crop: 'fill' as const },
  CARD: { width: 400, height: 300, crop: 'fill' as const },
  HERO: { width: 1200, height: 600, crop: 'fill' as const },
  BLOG: { width: 800, height: 450, crop: 'fill' as const },
} as const;