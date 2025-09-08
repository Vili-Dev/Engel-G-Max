import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
const cloudinaryConfig = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  secure: true,
};

// Validate required config
const requiredEnvVars = [
  'VITE_CLOUDINARY_CLOUD_NAME',
  'VITE_CLOUDINARY_API_KEY',
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required Cloudinary environment variables:', missingVars);
  console.error('Please check your .env file and ensure all Cloudinary config values are set.');
}

// Configure Cloudinary (only for server-side operations)
if (typeof process !== 'undefined' && process.env) {
  cloudinary.config(cloudinaryConfig);
}

// Export configuration for client-side use
export const cloudinaryClientConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  secure: true,
};

// Helper function to check if Cloudinary is properly configured
export const isCloudinaryConfigured = (): boolean => {
  return missingVars.length === 0;
};

// Helper function to generate Cloudinary URLs
export const generateCloudinaryUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
    fetch_format?: string;
  } = {}
): string => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not properly configured');
  }

  const baseUrl = `https://res.cloudinary.com/${cloudinaryClientConfig.cloudName}`;
  const transformations = [];

  // Add transformations
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.fetch_format) transformations.push(`f_${options.fetch_format}`);

  const transformationString = transformations.length > 0 
    ? `/${transformations.join(',')}/` 
    : '/';

  return `${baseUrl}/image/upload${transformationString}${publicId}`;
};

// Export the cloudinary instance for server-side operations
export default cloudinary;

// Cloudinary metadata
export const cloudinaryMetadata = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  isConfigured: isCloudinaryConfigured(),
  version: '2.7.0',
};