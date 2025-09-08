// Cloudinary services export barrel
export { default as cloudinary, cloudinaryClientConfig, generateCloudinaryUrl, isCloudinaryConfigured, cloudinaryMetadata } from './config';
export { CloudinaryStorageService, CLOUDINARY_FOLDERS, FILE_TYPES, IMAGE_TRANSFORMATIONS } from './storage';

// Re-export common types for convenience
export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  metadata: any;
};

export type CloudinaryUploadOptions = {
  tags?: string[];
  metadata?: { [key: string]: string };
  transformation?: { [key: string]: any };
  onProgress?: (progress: number) => void;
};

export type ImageTransformation = {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'auto';
};