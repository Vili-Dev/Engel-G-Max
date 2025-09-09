import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  AuthError,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile } from '@/types/user';

// Authentication service class
export class AuthService {
  
  // Sign up with email and password
  static async signUp(
    email: string, 
    password: string, 
    displayName: string,
    additionalData?: Partial<UserProfile>
  ): Promise<{ user: User; profile: UserProfile }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role: 'customer',
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          language: 'fr',
          currency: 'EUR',
          newsletter: true,
          notifications: true,
          emailMarketing: false,
        },
        fitnessProfile: {
          goals: [],
          experience: 'beginner',
          equipment: [],
          workoutFrequency: 3,
          timePerWorkout: 60,
        },
        ...additionalData,
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Send email verification
      await sendEmailVerification(user);

      return { user, profile: userProfile };
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<{ user: User; profile: UserProfile }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Get user profile from Firestore
      const profile = await this.getUserProfile(user.uid);
      
      // Update last login
      await this.updateLastLogin(user.uid);

      return { user, profile };
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Send password reset email
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Update user password
  static async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      
      // Update profile timestamp
      await this.updateProfileTimestamp(user.uid);
    } catch (error) {
      console.error('Password update error:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string, 
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const userDocRef = doc(db, 'users', userId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userDocRef, updateData);

      // Return updated profile
      return await this.getUserProfile(userId);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Get user profile from Firestore
  static async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const data = userDoc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      } as UserProfile;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Check if user is admin
  static async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile.role === 'admin';
    } catch {
      return false;
    }
  }

  // Update last login timestamp
  private static async updateLastLogin(userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }

  // Update profile timestamp
  private static async updateProfileTimestamp(userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Update profile timestamp error:', error);
    }
  }

  // Handle authentication errors
  private static handleAuthError(error: AuthError): Error {
    const errorMessages: Record<string, string> = {
      'auth/user-disabled': 'Ce compte a été désactivé. Contactez le support.',
      'auth/user-not-found': 'Aucun compte trouvé avec cette adresse email.',
      'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
      'auth/invalid-email': 'Adresse email invalide.',
      'auth/operation-not-allowed': 'Opération non autorisée.',
      'auth/requires-recent-login': 'Veuillez vous reconnecter pour effectuer cette action.',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
      'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre connexion internet.',
    };

    const message = errorMessages[error.code] || 'Une erreur est survenue lors de l\'authentification.';
    
    return new Error(message);
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Verify email address
  static async verifyEmail(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      await sendEmailVerification(user);
    } catch (error) {
      console.error('Email verification error:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }
}

export default AuthService;