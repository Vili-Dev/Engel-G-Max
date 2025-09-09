import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
// Note: Firebase Storage import removed - using Cloudinary instead
// import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - Use environment variables only
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate required config
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// Validate Firebase configuration
const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  console.error('🚨 Firebase configuration incomplete! Missing environment variables:', missingVars);
  throw new Error('Firebase configuration is incomplete. Please check your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
// Note: Firebase Storage removed - using Cloudinary instead
// export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics (only in production)
export const analytics = typeof window !== 'undefined' && 
  import.meta.env.PROD && 
  import.meta.env.VITE_FIREBASE_MEASUREMENT_ID 
    ? getAnalytics(app) 
    : null;

// Connect to emulators in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  const connectToEmulators = () => {
    try {
      // Check if emulators are already connected
      if (!(auth as any)._delegate._config?.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      
      if (!(db as any)._delegate._databaseId?.host?.includes('localhost')) {
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
      
      // Note: Firebase Storage emulator removed - using Cloudinary instead
      // if (!(storage as any)._delegate._host?.includes('localhost')) {
      //   connectStorageEmulator(storage, 'localhost', 9199);
      // }
      
      if (!(functions as any)._delegate._region?.includes('localhost')) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      
      console.log('🔧 Connected to Firebase emulators for development');
    } catch (error) {
      console.warn('Firebase emulators connection failed:', error);
    }
  };
  
  // Connect with a small delay to ensure Firebase is initialized
  setTimeout(connectToEmulators, 100);
}

// Export the app instance
export default app;

// Helper function to check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return missingVars.length === 0;
};

// Helper function to get current environment
export const getFirebaseEnvironment = () => {
  if (import.meta.env.DEV) return 'development';
  if (import.meta.env.PROD) return 'production';
  return 'unknown';
};

// Firebase app metadata
export const firebaseMetadata = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  environment: getFirebaseEnvironment(),
  isConfigured: isFirebaseConfigured(),
  hasAnalytics: !!analytics,
  version: '10.7.1',
};