/**
 * Script pour promouvoir un utilisateur existant au rôle d'administrateur
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

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
const db = getFirestore(app);

async function promoteToAdmin() {
  try {
    console.log('🔧 Promotion d\'un utilisateur en administrateur...');
    
    // CHANGEZ CETTE VALEUR PAR L'EMAIL OU UID DE L'UTILISATEUR À PROMOUVOIR
    const userEmailOrUID = 'votre-email@example.com'; // ← CHANGEZ ICI
    
    let userDoc = null;
    let userId = null;
    
    // Si c'est un UID (commence par une lettre et contient des caractères alphanumériques)
    if (userEmailOrUID.length > 20 && !userEmailOrUID.includes('@')) {
      userId = userEmailOrUID;
      userDoc = await getDoc(doc(db, 'users', userId));
    } else {
      // Sinon, c'est un email - il faut chercher l'utilisateur par email
      // Note: Cette méthode nécessite de connaître l'UID
      console.error('❌ Veuillez fournir l\'UID de l\'utilisateur (pas l\'email)');
      console.log('💡 Vous pouvez trouver l\'UID dans Firebase Console > Authentication > Users');
      return;
    }
    
    if (!userDoc.exists()) {
      console.error('❌ Utilisateur non trouvé avec l\'UID:', userId);
      return;
    }
    
    const userData = userDoc.data();
    console.log('👤 Utilisateur trouvé:', userData.email, '-', userData.displayName);
    
    if (userData.role === 'admin') {
      console.log('ℹ️ Cet utilisateur est déjà administrateur !');
      return;
    }
    
    // Mettre à jour le rôle
    await updateDoc(doc(db, 'users', userId), {
      role: 'admin',
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Utilisateur promu administrateur avec succès !');
    console.log('📧 Email:', userData.email);
    console.log('🆔 UID:', userId);
    console.log('👤 Nom:', userData.displayName);
    console.log('🔑 Nouveau rôle: admin');
    
  } catch (error) {
    console.error('❌ Erreur lors de la promotion:', error);
  }
}

// Exécuter le script
promoteToAdmin().then(() => {
  console.log('🏁 Script terminé');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});