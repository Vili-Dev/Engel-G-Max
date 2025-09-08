import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  QueryConstraint,
  DocumentSnapshot,
  Query,
  WriteBatch,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';

// Generic Firestore service class
export class FirestoreService {
  
  // Create a new document
  static async createDocument<T extends DocumentData>(
    collectionPath: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, collectionPath), docData);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionPath}:`, error);
      throw error;
    }
  }

  // Get a document by ID
  static async getDocument<T>(
    collectionPath: string, 
    documentId: string
  ): Promise<T | null> {
    try {
      const docSnapshot = await getDoc(doc(db, collectionPath, documentId));
      
      if (!docSnapshot.exists()) {
        return null;
      }

      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as T;
    } catch (error) {
      console.error(`Error getting document from ${collectionPath}/${documentId}:`, error);
      throw error;
    }
  }

  // Update a document
  static async updateDocument<T extends DocumentData>(
    collectionPath: string,
    documentId: string,
    updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionPath, documentId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error(`Error updating document ${collectionPath}/${documentId}:`, error);
      throw error;
    }
  }

  // Delete a document
  static async deleteDocument(
    collectionPath: string,
    documentId: string
  ): Promise<void> {
    try {
      await deleteDoc(doc(db, collectionPath, documentId));
    } catch (error) {
      console.error(`Error deleting document ${collectionPath}/${documentId}:`, error);
      throw error;
    }
  }

  // Get multiple documents with optional filters and pagination
  static async getDocuments<T>(
    collectionPath: string,
    filters: QueryConstraint[] = [],
    limitCount?: number,
    lastDocument?: DocumentSnapshot
  ): Promise<{ documents: T[]; lastDoc: DocumentSnapshot | null }> {
    try {
      let q: Query = collection(db, collectionPath);

      // Apply filters
      if (filters.length > 0) {
        q = query(q, ...filters);
      }

      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      // Apply pagination
      if (lastDocument) {
        q = query(q, startAfter(lastDocument));
      }

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      let lastDoc: DocumentSnapshot | null = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        documents.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as T);
        lastDoc = doc;
      });

      return { documents, lastDoc: querySnapshot.empty ? null : lastDoc };
    } catch (error) {
      console.error(`Error getting documents from ${collectionPath}:`, error);
      throw error;
    }
  }

  // Search documents by text fields
  static async searchDocuments<T>(
    collectionPath: string,
    searchTerm: string,
    searchFields: string[] = ['searchTerms'],
    filters: QueryConstraint[] = [],
    limitCount: number = 20
  ): Promise<T[]> {
    try {
      const searchQueries = searchFields.map(field => {
        return query(
          collection(db, collectionPath),
          where(field, 'array-contains-any', searchTerm.toLowerCase().split(' ')),
          ...filters,
          limit(limitCount)
        );
      });

      const results: T[] = [];
      const seenIds = new Set<string>();

      for (const searchQuery of searchQueries) {
        const querySnapshot = await getDocs(searchQuery);
        
        querySnapshot.forEach((doc) => {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);
            const data = doc.data();
            results.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
            } as T);
          }
        });
      }

      return results;
    } catch (error) {
      console.error(`Error searching documents in ${collectionPath}:`, error);
      throw error;
    }
  }

  // Batch operations
  static async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    id?: string;
    data?: any;
  }>): Promise<void> {
    try {
      const batch: WriteBatch = writeBatch(db);

      operations.forEach(operation => {
        switch (operation.type) {
          case 'create':
            if (!operation.data) throw new Error('Data required for create operation');
            const createRef = operation.id 
              ? doc(db, operation.collection, operation.id)
              : doc(collection(db, operation.collection));
            batch.set(createRef, {
              ...operation.data,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            break;

          case 'update':
            if (!operation.id || !operation.data) {
              throw new Error('ID and data required for update operation');
            }
            const updateRef = doc(db, operation.collection, operation.id);
            batch.update(updateRef, {
              ...operation.data,
              updatedAt: serverTimestamp(),
            });
            break;

          case 'delete':
            if (!operation.id) throw new Error('ID required for delete operation');
            const deleteRef = doc(db, operation.collection, operation.id);
            batch.delete(deleteRef);
            break;
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error in batch write:', error);
      throw error;
    }
  }

  // Increment a numeric field
  static async incrementField(
    collectionPath: string,
    documentId: string,
    fieldName: string,
    incrementBy: number = 1
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionPath, documentId);
      await updateDoc(docRef, {
        [fieldName]: increment(incrementBy),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error incrementing field ${fieldName}:`, error);
      throw error;
    }
  }

  // Add item to array field
  static async addToArray(
    collectionPath: string,
    documentId: string,
    fieldName: string,
    value: any
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionPath, documentId);
      await updateDoc(docRef, {
        [fieldName]: arrayUnion(value),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error adding to array field ${fieldName}:`, error);
      throw error;
    }
  }

  // Remove item from array field
  static async removeFromArray(
    collectionPath: string,
    documentId: string,
    fieldName: string,
    value: any
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionPath, documentId);
      await updateDoc(docRef, {
        [fieldName]: arrayRemove(value),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error removing from array field ${fieldName}:`, error);
      throw error;
    }
  }

  // Get documents count (approximate)
  static async getCollectionCount(
    collectionPath: string,
    filters: QueryConstraint[] = []
  ): Promise<number> {
    try {
      let q: Query = collection(db, collectionPath);
      
      if (filters.length > 0) {
        q = query(q, ...filters);
      }

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error(`Error getting collection count for ${collectionPath}:`, error);
      throw error;
    }
  }

  // Check if document exists
  static async documentExists(
    collectionPath: string,
    documentId: string
  ): Promise<boolean> {
    try {
      const docSnapshot = await getDoc(doc(db, collectionPath, documentId));
      return docSnapshot.exists();
    } catch (error) {
      console.error(`Error checking document existence ${collectionPath}/${documentId}:`, error);
      return false;
    }
  }
}

export default FirestoreService;

// Predefined query builders for common patterns
export const QueryBuilder = {
  // Build filter for active/published items
  isActive: () => where('active', '==', true),
  isPublished: () => where('published', '==', true),
  
  // Build date range filters  
  dateRange: (field: string, startDate: Date, endDate: Date) => [
    where(field, '>=', startDate),
    where(field, '<=', endDate),
  ],
  
  // Build category filter
  byCategory: (category: string) => where('category', '==', category),
  
  // Build ordering
  orderByDate: (field: string = 'createdAt', direction: 'asc' | 'desc' = 'desc') => 
    orderBy(field, direction),
  
  // Build text search
  textContains: (field: string, searchTerm: string) => 
    where(field, 'array-contains-any', searchTerm.toLowerCase().split(' ')),
  
  // Build user filter
  byUser: (userId: string) => where('userId', '==', userId),
  
  // Build email filter
  byEmail: (email: string) => where('email', '==', email),
  
  // Build status filter
  byStatus: (status: string) => where('status', '==', status),
};

// Collection paths constants
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BLOG_POSTS: 'blogPosts',
  BLOG_CATEGORIES: 'blogCategories',
  BLOG_TAGS: 'blogTags',
  ORDERS: 'orders',
  PROTOCOL_ORDERS: 'protocolOrders',
  PROTOCOLS: 'protocols',
  TESTIMONIALS: 'testimonials',
  NEWSLETTER_SUBSCRIBERS: 'newsletterSubscribers',
  NEWSLETTER_CAMPAIGNS: 'newsletterCampaigns',
  CONTACT_SUBMISSIONS: 'contactSubmissions',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  EXERCISES: 'exercises',
  NUTRITION: 'nutrition',
  FAQS: 'faqs',
  EMAIL_TEMPLATES: 'emailTemplates',
} as const;