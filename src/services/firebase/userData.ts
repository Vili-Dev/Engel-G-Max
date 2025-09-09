import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  addDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface UserCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  addedAt: Date;
}

export interface UserWishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  addedAt: Date;
}

export interface UserPurchaseHistory {
  orderId: string;
  items: UserCartItem[];
  total: number;
  purchaseDate: Date;
  status: string;
  paymentMethod?: string;
}

export interface UserProtocol {
  id: string;
  name: string;
  type: string;
  content: any;
  createdAt: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export interface UserAnalyticsSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  pageViews: number;
  actions: string[];
  deviceInfo?: {
    userAgent: string;
    screenSize: string;
    platform: string;
  };
}

export interface UserAppData {
  cart: UserCartItem[];
  wishlist: UserWishlistItem[];
  purchaseHistory: UserPurchaseHistory[];
  protocols: UserProtocol[];
  analyticsData?: {
    currentSession?: UserAnalyticsSession;
    lastVisit?: Date;
    totalSessions?: number;
  };
  preferences: {
    theme?: 'light' | 'dark' | 'auto';
    language?: 'fr' | 'en' | 'es';
    notifications?: boolean;
  };
  updatedAt: Date;
}

export class UserDataService {
  
  static async getUserData(userId: string): Promise<UserAppData | null> {
    try {
      const userDataDoc = await getDoc(doc(db, 'userData', userId));
      
      if (!userDataDoc.exists()) {
        // Return default structure if no data exists
        return this.getDefaultUserData();
      }

      const data = userDataDoc.data();
      
      // Convert Timestamp fields back to Dates
      return {
        ...data,
        cart: data.cart?.map((item: any) => ({
          ...item,
          addedAt: item.addedAt?.toDate() || new Date(),
        })) || [],
        wishlist: data.wishlist?.map((item: any) => ({
          ...item,
          addedAt: item.addedAt?.toDate() || new Date(),
        })) || [],
        purchaseHistory: data.purchaseHistory?.map((purchase: any) => ({
          ...purchase,
          purchaseDate: purchase.purchaseDate?.toDate() || new Date(),
          items: purchase.items?.map((item: any) => ({
            ...item,
            addedAt: item.addedAt?.toDate() || new Date(),
          })) || [],
        })) || [],
        protocols: data.protocols?.map((protocol: any) => ({
          ...protocol,
          createdAt: protocol.createdAt?.toDate() || new Date(),
          updatedAt: protocol.updatedAt?.toDate(),
        })) || [],
        analyticsData: data.analyticsData ? {
          ...data.analyticsData,
          currentSession: data.analyticsData.currentSession ? {
            ...data.analyticsData.currentSession,
            startTime: data.analyticsData.currentSession.startTime?.toDate() || new Date(),
            endTime: data.analyticsData.currentSession.endTime?.toDate(),
          } : undefined,
          lastVisit: data.analyticsData.lastVisit?.toDate(),
        } : undefined,
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserAppData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  static async saveUserData(userId: string, userData: Partial<UserAppData>): Promise<void> {
    try {
      const userDataRef = doc(db, 'userData', userId);
      
      // Convert Date fields to Timestamps for Firestore
      const dataToSave = {
        ...userData,
        cart: userData.cart?.map(item => ({
          ...item,
          addedAt: Timestamp.fromDate(item.addedAt),
        })),
        wishlist: userData.wishlist?.map(item => ({
          ...item,
          addedAt: Timestamp.fromDate(item.addedAt),
        })),
        purchaseHistory: userData.purchaseHistory?.map(purchase => ({
          ...purchase,
          purchaseDate: Timestamp.fromDate(purchase.purchaseDate),
          items: purchase.items?.map(item => ({
            ...item,
            addedAt: Timestamp.fromDate(item.addedAt),
          })),
        })),
        protocols: userData.protocols?.map(protocol => ({
          ...protocol,
          createdAt: Timestamp.fromDate(protocol.createdAt),
          updatedAt: protocol.updatedAt ? Timestamp.fromDate(protocol.updatedAt) : null,
        })),
        analyticsData: userData.analyticsData ? {
          ...userData.analyticsData,
          currentSession: userData.analyticsData.currentSession ? {
            ...userData.analyticsData.currentSession,
            startTime: Timestamp.fromDate(userData.analyticsData.currentSession.startTime),
            endTime: userData.analyticsData.currentSession.endTime ? 
              Timestamp.fromDate(userData.analyticsData.currentSession.endTime) : null,
          } : undefined,
          lastVisit: userData.analyticsData.lastVisit ? 
            Timestamp.fromDate(userData.analyticsData.lastVisit) : null,
        } : undefined,
        updatedAt: serverTimestamp(),
      };

      await setDoc(userDataRef, dataToSave, { merge: true });
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Erreur lors de la sauvegarde des données utilisateur');
    }
  }

  static async updateUserCart(userId: string, cart: UserCartItem[]): Promise<void> {
    try {
      await this.saveUserData(userId, { cart });
    } catch (error) {
      console.error('Error updating user cart:', error);
      throw new Error('Erreur lors de la mise à jour du panier');
    }
  }

  static async updateUserWishlist(userId: string, wishlist: UserWishlistItem[]): Promise<void> {
    try {
      await this.saveUserData(userId, { wishlist });
    } catch (error) {
      console.error('Error updating user wishlist:', error);
      throw new Error('Erreur lors de la mise à jour de la liste de souhaits');
    }
  }

  static async addToPurchaseHistory(userId: string, purchase: UserPurchaseHistory): Promise<void> {
    try {
      const currentData = await this.getUserData(userId);
      const purchaseHistory = currentData?.purchaseHistory || [];
      purchaseHistory.push(purchase);
      
      await this.saveUserData(userId, { purchaseHistory });
    } catch (error) {
      console.error('Error adding to purchase history:', error);
      throw new Error('Erreur lors de l\'ajout à l\'historique des achats');
    }
  }

  static async updateUserProtocols(userId: string, protocols: UserProtocol[]): Promise<void> {
    try {
      await this.saveUserData(userId, { protocols });
    } catch (error) {
      console.error('Error updating user protocols:', error);
      throw new Error('Erreur lors de la mise à jour des protocoles');
    }
  }

  static async saveUserAnalytics(userId: string, analyticsData: UserAppData['analyticsData']): Promise<void> {
    try {
      await this.saveUserData(userId, { analyticsData });
    } catch (error) {
      console.error('Error saving user analytics:', error);
      // Don't throw error for analytics - it's not critical
      console.warn('Analytics data could not be saved');
    }
  }

  static async migrateFromLocalStorage(userId: string): Promise<void> {
    try {
      console.log('🔄 Starting localStorage migration for user:', userId);

      // Check if migration already done
      const existingData = await this.getUserData(userId);
      if (existingData && existingData.cart.length > 0) {
        console.log('✅ Migration already completed');
        return;
      }

      const migrationData: Partial<UserAppData> = {};

      // Migrate cart
      const savedCart = localStorage.getItem(`gmax-cart-${userId}`);
      if (savedCart) {
        try {
          migrationData.cart = JSON.parse(savedCart);
          localStorage.removeItem(`gmax-cart-${userId}`);
          console.log('✅ Migrated cart data');
        } catch (e) {
          console.warn('⚠️ Could not migrate cart data:', e);
        }
      }

      // Migrate wishlist
      const savedWishlist = localStorage.getItem(`gmax-wishlist-${userId}`);
      if (savedWishlist) {
        try {
          migrationData.wishlist = JSON.parse(savedWishlist);
          localStorage.removeItem(`gmax-wishlist-${userId}`);
          console.log('✅ Migrated wishlist data');
        } catch (e) {
          console.warn('⚠️ Could not migrate wishlist data:', e);
        }
      }

      // Migrate purchase history
      const savedHistory = localStorage.getItem(`gmax-history-${userId}`);
      if (savedHistory) {
        try {
          migrationData.purchaseHistory = JSON.parse(savedHistory);
          localStorage.removeItem(`gmax-history-${userId}`);
          console.log('✅ Migrated purchase history');
        } catch (e) {
          console.warn('⚠️ Could not migrate purchase history:', e);
        }
      }

      // Migrate protocols (note: localStorage key uses different field)
      const savedProtocols = localStorage.getItem(`gmax-protocols-${userId}`) || 
                            localStorage.getItem(`gmax-protocols-${userId.replace('-', '')}`);
      if (savedProtocols) {
        try {
          migrationData.protocols = JSON.parse(savedProtocols);
          localStorage.removeItem(`gmax-protocols-${userId}`);
          localStorage.removeItem(`gmax-protocols-${userId.replace('-', '')}`);
          console.log('✅ Migrated protocols data');
        } catch (e) {
          console.warn('⚠️ Could not migrate protocols data:', e);
        }
      }

      // Migrate analytics data
      const savedAnalytics = localStorage.getItem(`gmax-analytics-${userId}`);
      if (savedAnalytics) {
        try {
          migrationData.analyticsData = JSON.parse(savedAnalytics);
          localStorage.removeItem(`gmax-analytics-${userId}`);
          console.log('✅ Migrated analytics data');
        } catch (e) {
          console.warn('⚠️ Could not migrate analytics data:', e);
        }
      }

      // Save migrated data if any exists
      if (Object.keys(migrationData).length > 0) {
        await this.saveUserData(userId, migrationData);
        console.log('🎉 Migration completed successfully');
      } else {
        console.log('ℹ️ No localStorage data found to migrate');
      }

    } catch (error) {
      console.error('❌ Migration failed:', error);
      // Don't throw error - migration failure shouldn't block the app
    }
  }

  private static getDefaultUserData(): UserAppData {
    return {
      cart: [],
      wishlist: [],
      purchaseHistory: [],
      protocols: [],
      preferences: {
        theme: 'light',
        language: 'fr',
        notifications: true,
      },
      updatedAt: new Date(),
    };
  }

  static async clearUserData(userId: string): Promise<void> {
    try {
      await this.saveUserData(userId, this.getDefaultUserData());
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw new Error('Erreur lors de la suppression des données utilisateur');
    }
  }
}

export default UserDataService;