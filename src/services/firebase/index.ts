// Firebase services export barrel
export { default as app, auth, db, functions, analytics } from './config';
export { AuthService } from './auth';
export { FirestoreService, QueryBuilder, COLLECTIONS } from './firestore';

// Note: Firebase Storage has been replaced by Cloudinary
// Use CloudinaryStorageService from '../cloudinary' instead

// Re-export Firebase types for convenience
export type {
  User,
  AuthError,
  UserCredential,
} from 'firebase/auth';

export type {
  DocumentSnapshot,
  QuerySnapshot,
  DocumentData,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';

// Note: Firebase Storage types removed - use Cloudinary types instead
// import { CloudinaryUploadResult, CloudinaryUploadOptions, ImageTransformation } from '../cloudinary';