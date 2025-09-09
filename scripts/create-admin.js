/**
 * Script pour créer le premier administrateur
 * À exécuter une seule fois pour définir le premier admin
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSVKcvnD-aQcBtULwgiLZisbajVuwyGGs",
  authDomain: "engel-gmax-production.firebaseapp.com",
  projectId: "engel-gmax-production",
  storageBucket: "engel-gmax-production.firebasestorage.app",
  messagingSenderId: "1059287255995",
  appId: "1:1059287255995:web:fb7d75c6ba7a2f96a3d29e",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createFirstAdmin() {
  try {
    console.log('🔧 Création du premier administrateur...');
    
    // CHANGEZ CES VALEURS PAR VOS INFORMATIONS
    const adminEmail = 'admin@engelgmax.com';  // ← CHANGEZ ICI
    const adminPassword = 'AdminPassword123!';  // ← CHANGEZ ICI  
    const adminName = 'Engel Garcia Gomez';     // ← CHANGEZ ICI
    
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    // Mettre à jour le profil
    await updateProfile(user, { displayName: adminName });
    
    // Créer le profil administrateur dans Firestore
    const adminProfile = {
      uid: user.uid,
      email: user.email,
      displayName: adminName,
      role: 'admin', // ← C'est ici que le rôle admin est défini
      isEmailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      preferences: {
        language: 'fr',
        currency: 'EUR',
        newsletter: true,
        notifications: true,
        emailMarketing: false,
      },
      fitnessProfile: {
        goals: ['g_maxing'],
        experience: 'expert',
        equipment: ['gym_access'],
        workoutFrequency: 5,
        timePerWorkout: 90,
      }
    };
    
    // Sauvegarder dans Firestore
    await setDoc(doc(db, 'users', user.uid), adminProfile);
    
    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', adminEmail);
    console.log('🆔 UID:', user.uid);
    console.log('👤 Nom:', adminName);
    console.log('🔑 Rôle: admin');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Cet email est déjà utilisé. Voulez-vous juste mettre à jour le rôle ?');
    }
  }
}

// Exécuter le script
createFirstAdmin().then(() => {
  console.log('🏁 Script terminé');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});