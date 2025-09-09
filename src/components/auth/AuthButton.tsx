import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const AuthButton: React.FC = () => {
  const { isAuthenticated, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse w-20 h-8 bg-white/20 rounded"></div>
      </div>
    );
  }

  // Affichage si l'utilisateur est connecté
  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-green-400 text-sm font-medium">Connecté</span>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all duration-300"
        >
          <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
          <span className="text-sm">Se déconnecter</span>
        </button>
      </div>
    );
  }

  // Affichage si l'utilisateur n'est pas connecté
  return (
    <div className="flex items-center space-x-3">
      <Link to="/login">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <UserIcon className="w-4 h-4 mr-2" />
          Se connecter
        </Button>
      </Link>
      
      <Link to="/register">
        <Button
          size="sm"
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          S'inscrire
          <ArrowRightEndOnRectangleIcon className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
};

export default AuthButton;