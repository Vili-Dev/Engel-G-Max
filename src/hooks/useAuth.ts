import { useState, useEffect, createContext, useContext } from 'react';
import { 
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '@/services/firebase/config';
import { AuthService } from '@/services/firebase/auth';
import { UserProfile, AuthState } from '@/types/user';
import toast from 'react-hot-toast';

// Auth Context
const AuthContext = createContext<AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userProfile = await AuthService.getUserProfile(firebaseUser.uid);
          
          setAuthState({
            user: userProfile,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });

          // Track login event
          if (window.gtag && import.meta.env.PROD) {
            window.gtag('event', 'login', {
              method: 'email',
              event_category: 'engel_garcia_gomez',
              user_id: firebaseUser.uid,
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: 'Erreur lors de la récupération du profil utilisateur',
          });
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await AuthService.signIn(email, password);
      
      toast.success(`Bienvenue ${result.profile.displayName} !`, {
        duration: 4000,
        icon: '👋',
      });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la connexion';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      toast.error(errorMessage, {
        duration: 6000,
      });
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await AuthService.signUp(email, password, displayName);
      
      toast.success(
        `Compte créé avec succès ! Vérifiez vos emails pour confirmer votre adresse.`,
        {
          duration: 8000,
          icon: '🎉',
        }
      );

      // Track sign up event
      if (window.gtag && import.meta.env.PROD) {
        window.gtag('event', 'sign_up', {
          method: 'email',
          event_category: 'engel_garcia_gomez',
          event_label: 'user_registration',
        });
      }
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la création du compte';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      toast.error(errorMessage, {
        duration: 6000,
      });
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      
      toast.success('Déconnexion réussie', {
        duration: 3000,
        icon: '👋',
      });

      // Track logout event
      if (window.gtag && import.meta.env.PROD) {
        window.gtag('event', 'logout', {
          event_category: 'engel_garcia_gomez',
        });
      }
      
    } catch (error: any) {
      toast.error('Erreur lors de la déconnexion', {
        duration: 4000,
      });
      
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await AuthService.sendPasswordReset(email);
      
      toast.success(
        'Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.',
        {
          duration: 6000,
          icon: '📧',
        }
      );
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de l\'envoi de l\'email';
      toast.error(errorMessage, {
        duration: 6000,
      });
      
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user?.uid) {
        throw new Error('Utilisateur non authentifié');
      }

      const updatedProfile = await AuthService.updateUserProfile(
        authState.user.uid, 
        updates
      );

      setAuthState(prev => ({
        ...prev,
        user: updatedProfile,
      }));

      toast.success('Profil mis à jour avec succès !', {
        duration: 4000,
        icon: '✅',
      });

      // Track profile update event
      if (window.gtag && import.meta.env.PROD) {
        window.gtag('event', 'profile_update', {
          event_category: 'user',
          event_label: 'profile_modification',
        });
      }
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la mise à jour du profil';
      toast.error(errorMessage, {
        duration: 6000,
      });
      
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
  };
};