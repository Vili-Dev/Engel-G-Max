import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/firebase/auth';
import toast from 'react-hot-toast';

const TestAuthPage: React.FC = () => {
  const { user, signIn, signUp, signOut, isLoading } = useAuth();
  const [testEmail, setTestEmail] = useState('test@engelgmax.com');
  const [testPassword, setTestPassword] = useState('Test123456');
  const [testName, setTestName] = useState('Test User');
  const [loading, setLoading] = useState(false);

  const testSignUp = async () => {
    setLoading(true);
    try {
      console.log('🧪 Test inscription avec:', { email: testEmail, name: testName });
      await signUp(testEmail, testPassword, testName);
      toast.success('Inscription réussie !');
    } catch (error: any) {
      console.error('❌ Erreur test inscription:', error);
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      console.log('🧪 Test connexion avec:', { email: testEmail });
      await signIn(testEmail, testPassword);
      toast.success('Connexion réussie !');
    } catch (error: any) {
      console.error('❌ Erreur test connexion:', error);
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testSignOut = async () => {
    setLoading(true);
    try {
      console.log('🧪 Test déconnexion');
      await signOut();
      toast.success('Déconnexion réussie !');
    } catch (error: any) {
      console.error('❌ Erreur test déconnexion:', error);
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkFirebaseConfig = () => {
    console.log('🔍 Configuration Firebase:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    });
    
    const currentUser = AuthService.getCurrentUser();
    console.log('👤 Utilisateur Firebase actuel:', currentUser);
    
    toast('Vérifiez la console pour les détails de configuration', { 
      icon: '🔍',
      duration: 3000 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            🧪 Test d'Authentification Firebase
          </h1>

          {/* État de l'utilisateur */}
          <div className="mb-8 p-4 bg-white/5 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">État actuel</h2>
            <p className="text-gray-300">
              <strong>Connecté:</strong> {user ? 'Oui' : 'Non'}
            </p>
            {user && (
              <div className="mt-2 text-gray-300">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nom:</strong> {user.displayName}</p>
                <p><strong>UID:</strong> {user.uid}</p>
                <p><strong>Rôle:</strong> {user.role}</p>
                <p><strong>Email vérifié:</strong> {user.isEmailVerified ? 'Oui' : 'Non'}</p>
              </div>
            )}
            <p className="text-gray-400 mt-2">
              <strong>Chargement:</strong> {isLoading ? 'Oui' : 'Non'}
            </p>
          </div>

          {/* Formulaire de test */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-white mb-2">Email de test:</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Mot de passe:</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                placeholder="Mot de passe"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Nom complet:</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                placeholder="Nom complet"
              />
            </div>
          </div>

          {/* Boutons de test */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={testSignUp}
              disabled={loading || user !== null}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {loading ? '...' : '📝 Test Inscription'}
            </button>
            
            <button
              onClick={testSignIn}
              disabled={loading || user !== null}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {loading ? '...' : '🔑 Test Connexion'}
            </button>
            
            <button
              onClick={testSignOut}
              disabled={loading || user === null}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {loading ? '...' : '🚪 Test Déconnexion'}
            </button>
            
            <button
              onClick={checkFirebaseConfig}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              🔍 Vérifier Config
            </button>
          </div>

          {/* Instructions */}
          <div className="text-gray-300 text-sm">
            <h3 className="font-semibold mb-2">Instructions :</h3>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Vérifiez d'abord la configuration Firebase</li>
              <li>Testez l'inscription avec un nouvel email</li>
              <li>Vérifiez la console pour les logs détaillés</li>
              <li>Vérifiez Firestore pour voir si l'utilisateur est créé</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuthPage;