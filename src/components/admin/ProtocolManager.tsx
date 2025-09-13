/**
 * Gestionnaire de Protocoles - Interface Admin
 * Permet la création, modification et suppression des protocoles de supplémentation
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  TagIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { SupplementProtocol, ProtocolCategory, TargetAudience, DifficultyLevel, CreateProtocolRequest } from '../../types/supplementProtocol';
import ProtocolEditor from './ProtocolEditor';
import { protocolsData } from '../../data/protocols';

interface ProtocolManagerProps {
  onProtocolCreate?: (protocol: SupplementProtocol) => void;
  onProtocolUpdate?: (protocol: SupplementProtocol) => void;
  onProtocolDelete?: (protocolId: string) => void;
}

const ProtocolManager: React.FC<ProtocolManagerProps> = ({
  onProtocolCreate,
  onProtocolUpdate,
  onProtocolDelete
}) => {
  const [protocols, setProtocols] = useState<SupplementProtocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<SupplementProtocol | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('table');
  const [filterCategory, setFilterCategory] = useState<ProtocolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Chargement des données centralisées depuis le fichier partagé
  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setProtocols(protocolsData);
    }, 500);
  }, []);

  const filteredProtocols = protocols.filter(protocol => {
    const matchesCategory = filterCategory === 'all' || protocol.category === filterCategory;
    const matchesSearch = protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateProtocol = () => {
    setIsCreating(true);
    setSelectedProtocol(null);
  };

  const handleEditProtocol = (protocol: SupplementProtocol) => {
    setSelectedProtocol(protocol);
    setIsEditing(true);
  };

  const handleDeleteProtocol = async (protocolId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce protocole ?')) {
      setProtocols(prev => prev.filter(p => p.id !== protocolId));
      onProtocolDelete?.(protocolId);
    }
  };

  const getCategoryColor = (category: ProtocolCategory): string => {
    const colors = {
      looxmax: 'bg-pink-500/20 text-pink-300',
      performance: 'bg-blue-500/20 text-blue-300',
      productivity: 'bg-green-500/20 text-green-300',
      advanced: 'bg-purple-500/20 text-purple-300',
      coaching: 'bg-yellow-500/20 text-yellow-300'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300';
  };

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    const colors = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-red-400'
    };
    return colors[difficulty];
  };

  const renderProtocolTable = () => (
    <div className="glass-card p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 font-medium py-3">Protocole</th>
              <th className="text-left text-gray-400 font-medium py-3">Catégorie</th>
              <th className="text-left text-gray-400 font-medium py-3">Prix</th>
              <th className="text-left text-gray-400 font-medium py-3">Statut</th>
              <th className="text-left text-gray-400 font-medium py-3">Performance</th>
              <th className="text-right text-gray-400 font-medium py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProtocols.map((protocol) => (
              <motion.tr 
                key={protocol.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    {protocol.featuredImage ? (
                      <img 
                        src={protocol.featuredImage} 
                        alt={protocol.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                        <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="text-white font-medium flex items-center space-x-2">
                        <span>{protocol.name}</span>
                        {protocol.featured && (
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">{protocol.shortDescription.slice(0, 60)}...</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs ${getDifficultyColor(protocol.difficulty)}`}>
                          {protocol.difficulty}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{protocol.duration}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(protocol.category)}`}>
                    {protocol.category}
                  </span>
                </td>
                <td className="py-4">
                  <div className="text-white font-semibold">{protocol.price}€</div>
                  {protocol.estimatedBudget && (
                    <div className="text-xs text-gray-400">
                      Budget: {protocol.estimatedBudget.min}-{protocol.estimatedBudget.max}€
                    </div>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    {protocol.status === 'published' ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                    ) : protocol.status === 'draft' ? (
                      <ClockIcon className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-white text-sm capitalize">{protocol.status}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{protocol.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CurrencyEuroIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{protocol.purchaseCount}</span>
                    </div>
                    {protocol.rating && (
                      <div className="flex items-center space-x-1 text-sm">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-300">{protocol.rating}</span>
                        <span className="text-gray-500">({protocol.reviewCount})</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => handleEditProtocol(protocol)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <PencilIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    <button 
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Statistiques"
                    >
                      <ChartBarIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProtocol(protocol.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isCreating || isEditing) {
    return (
      <ProtocolEditor
        protocol={selectedProtocol}
        onSave={(protocol) => {
          if (isCreating) {
            const newProtocol: SupplementProtocol = {
              ...protocol,
              id: Date.now().toString(),
              viewCount: 0,
              purchaseCount: 0,
              reviewCount: 0,
              authorId: 'admin',
              authorName: 'Engel Garcia Gomez',
              createdAt: new Date(),
              updatedAt: new Date()
            };
            setProtocols(prev => [...prev, newProtocol]);
            onProtocolCreate?.(newProtocol);
          } else {
            setProtocols(prev => prev.map(p => p.id === protocol.id ? { ...protocol, updatedAt: new Date() } : p));
            onProtocolUpdate?.(protocol as SupplementProtocol);
          }
          setIsCreating(false);
          setIsEditing(false);
          setSelectedProtocol(null);
        }}
        onCancel={() => {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedProtocol(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion des Protocoles</h2>
          <p className="text-gray-400">Créez et gérez vos protocoles de supplémentation</p>
        </div>
        <button 
          onClick={handleCreateProtocol}
          className="glass-btn-primary px-4 py-2 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nouveau Protocole</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Protocoles</p>
              <p className="text-2xl font-bold text-white">{protocols.length}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Publiés</p>
              <p className="text-2xl font-bold text-white">
                {protocols.filter(p => p.status === 'published').length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenus Total</p>
              <p className="text-2xl font-bold text-white">
                {protocols.reduce((acc, p) => acc + (p.purchaseCount * p.price), 0).toLocaleString()}€
              </p>
            </div>
            <CurrencyEuroIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ventes Total</p>
              <p className="text-2xl font-bold text-white">
                {protocols.reduce((acc, p) => acc + p.purchaseCount, 0)}
              </p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as ProtocolCategory | 'all')}
                className="glass-input px-3 py-2"
              >
                <option value="all">Toutes catégories</option>
                <option value="looxmax">Looxmax</option>
                <option value="performance">Performance</option>
                <option value="productivity">Productivité</option>
                <option value="advanced">Avancé</option>
                <option value="coaching">Coaching</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Rechercher un protocole..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input px-4 py-2"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Protocols Table */}
      {renderProtocolTable()}
    </div>
  );
};


export default ProtocolManager;