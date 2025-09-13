/**
 * Interface de modération des commentaires - Admin
 * Permet d'approuver, rejeter et gérer les commentaires des protocoles
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CalendarDaysIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserIcon,
  FlagIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { Comment, CommentStatus, CommentModerationStats, ModerationFilters } from '../../types/comment';
import { protocolsData } from '../../data/protocols';

interface CommentModerationProps {
  onCommentUpdate?: (comment: Comment) => void;
}

const CommentModeration: React.FC<CommentModerationProps> = ({ onCommentUpdate }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentModerationStats | null>(null);
  const [filters, setFilters] = useState<ModerationFilters>({ status: 'pending' });
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock data pour les commentaires
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        content: 'Excellent protocole ! J\'ai vu des résultats impressionnants après 3 semaines. La transformation faciale est vraiment visible, merci Engel !',
        author: {
          id: 'user1',
          name: 'Alexandre Martin',
          email: 'alex.martin@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Alexandre+Martin&background=0ea5e9&color=fff'
        },
        protocolId: '1',
        protocolName: 'Looxmax',
        status: 'pending',
        rating: 5,
        createdAt: new Date('2024-03-25T10:30:00'),
        updatedAt: new Date('2024-03-25T10:30:00'),
        likes: 12,
        dislikes: 0,
        reports: []
      },
      {
        id: '2',
        content: 'Le protocole Natty Plus est parfait pour les débutants. Instructions très claires et résultats au rendez-vous. Je recommande vivement !',
        author: {
          id: 'user2',
          name: 'Sophie Dubois',
          email: 'sophie.dubois@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Sophie+Dubois&background=ec4899&color=fff'
        },
        protocolId: '2',
        protocolName: 'Natty Plus',
        status: 'approved',
        rating: 4,
        createdAt: new Date('2024-03-24T15:45:00'),
        updatedAt: new Date('2024-03-24T16:00:00'),
        approvedAt: new Date('2024-03-24T16:00:00'),
        approvedBy: 'admin',
        likes: 8,
        dislikes: 1,
        reports: []
      },
      {
        id: '3',
        content: 'Arnaque totale !!! N\'achetez pas ce protocole, c\'est du vol. Aucun résultat après 2 mois.',
        author: {
          id: 'user3',
          name: 'Utilisateur Suspect',
          email: 'fake@email.com'
        },
        protocolId: '1',
        protocolName: 'Looxmax',
        status: 'pending',
        rating: 1,
        createdAt: new Date('2024-03-25T08:20:00'),
        updatedAt: new Date('2024-03-25T08:20:00'),
        likes: 0,
        dislikes: 15,
        reports: [
          {
            id: 'report1',
            reporterId: 'user4',
            reason: 'spam',
            description: 'Commentaire suspicieux, semble être du spam négatif',
            createdAt: new Date('2024-03-25T09:00:00')
          }
        ]
      },
      {
        id: '4',
        content: 'Protocole productivité au top ! Ma concentration s\'est grandement améliorée. Les nootropiques recommandés sont efficaces.',
        author: {
          id: 'user5',
          name: 'Thomas Leroy',
          email: 'thomas.leroy@startup.com',
          avatar: 'https://ui-avatars.com/api/?name=Thomas+Leroy&background=16a34a&color=fff'
        },
        protocolId: '4',
        protocolName: 'Productivité',
        status: 'pending',
        rating: 5,
        createdAt: new Date('2024-03-25T12:15:00'),
        updatedAt: new Date('2024-03-25T12:15:00'),
        likes: 5,
        dislikes: 0,
        reports: []
      },
      {
        id: '5',
        content: 'Contenu de très bonne qualité mais un peu cher pour ce que c\'est. Le suivi personnalisé vaut le coup cependant.',
        author: {
          id: 'user6',
          name: 'Marie Petit',
          email: 'marie.petit@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Marie+Petit&background=dc2626&color=fff'
        },
        protocolId: '5',
        protocolName: 'Accompagnement Personnalisé',
        status: 'rejected',
        rating: 3,
        createdAt: new Date('2024-03-23T14:30:00'),
        updatedAt: new Date('2024-03-23T15:00:00'),
        rejectionReason: 'Commentaire trop négatif sur les prix',
        likes: 2,
        dislikes: 3,
        reports: []
      }
    ];

    const mockStats: CommentModerationStats = {
      total: mockComments.length,
      pending: mockComments.filter(c => c.status === 'pending').length,
      approved: mockComments.filter(c => c.status === 'approved').length,
      rejected: mockComments.filter(c => c.status === 'rejected').length,
      spam: mockComments.filter(c => c.status === 'spam').length,
      todaySubmitted: 3,
      thisWeekSubmitted: 8
    };

    setTimeout(() => {
      setComments(mockComments);
      setStats(mockStats);
      setLoading(false);
    }, 800);
  }, []);

  const filteredComments = comments.filter(comment => {
    const matchesStatus = filters.status === 'all' || comment.status === filters.status;
    const matchesProtocol = !filters.protocolId || comment.protocolId === filters.protocolId;
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReports = filters.hasReports === undefined || 
                          (filters.hasReports ? comment.reports.length > 0 : comment.reports.length === 0);
    
    return matchesStatus && matchesProtocol && matchesSearch && matchesReports;
  });

  const handleCommentAction = async (commentId: string, action: 'approve' | 'reject' | 'spam' | 'delete', reason?: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const updated: Comment = {
          ...comment,
          status: action === 'approve' ? 'approved' : action === 'delete' ? comment.status : action as CommentStatus,
          updatedAt: new Date(),
          ...(action === 'approve' && { approvedAt: new Date(), approvedBy: 'admin' }),
          ...(action === 'reject' && { rejectionReason: reason })
        };
        onCommentUpdate?.(updated);
        return updated;
      }
      return comment;
    });

    setComments(action === 'delete' ? updatedComments.filter(c => c.id !== commentId) : updatedComments);
    
    // Mettre à jour les stats
    if (stats) {
      setStats({
        ...stats,
        pending: updatedComments.filter(c => c.status === 'pending').length,
        approved: updatedComments.filter(c => c.status === 'approved').length,
        rejected: updatedComments.filter(c => c.status === 'rejected').length,
        spam: updatedComments.filter(c => c.status === 'spam').length
      });
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    for (const commentId of selectedComments) {
      await handleCommentAction(commentId, action);
    }
    setSelectedComments([]);
    setShowBulkActions(false);
  };

  const getStatusColor = (status: CommentStatus): string => {
    const colors = {
      pending: 'text-yellow-400 bg-yellow-500/10',
      approved: 'text-green-400 bg-green-500/10',
      rejected: 'text-red-400 bg-red-500/10',
      spam: 'text-gray-400 bg-gray-500/10'
    };
    return colors[status];
  };

  const getStatusIcon = (status: CommentStatus) => {
    const icons = {
      pending: ClockIcon,
      approved: CheckCircleIcon,
      rejected: XCircleIcon,
      spam: ExclamationTriangleIcon
    };
    return icons[status];
  };

  const renderStatsCards = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">En attente</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approuvés</p>
              <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejetés</p>
              <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cette semaine</p>
              <p className="text-2xl font-bold text-white">{stats.thisWeekSubmitted}</p>
            </div>
            <CalendarDaysIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-engel"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Modération des Commentaires</h2>
          <p className="text-gray-400">Gérez les commentaires sur vos protocoles</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="glass-btn-secondary px-4 py-2 flex items-center space-x-2">
            <ChartBarIcon className="h-4 w-4" />
            <span>Statistiques</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {renderStatsCards()}

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtres
          </h3>
          <button 
            onClick={() => setFilters({ status: 'all' })}
            className="text-sm text-gray-400 hover:text-white"
          >
            Réinitialiser
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Statut</label>
            <select 
              value={filters.status || 'all'}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as CommentStatus | 'all' })}
              className="glass-input w-full px-3 py-2"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
              <option value="rejected">Rejetés</option>
              <option value="spam">Spam</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Protocole</label>
            <select 
              value={filters.protocolId || ''}
              onChange={(e) => setFilters({ ...filters, protocolId: e.target.value || undefined })}
              className="glass-input w-full px-3 py-2"
            >
              <option value="">Tous les protocoles</option>
              {protocolsData.map(protocol => (
                <option key={protocol.id} value={protocol.id}>{protocol.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recherche</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-3 py-2"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center space-x-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={filters.hasReports || false}
                onChange={(e) => setFilters({ ...filters, hasReports: e.target.checked })}
                className="rounded border-gray-600 bg-gray-700"
              />
              <span>Commentaires signalés</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedComments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-4 bg-blue-500/10 border-blue-500/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedComments.length} commentaire(s) sélectionné(s)
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="glass-btn-primary px-3 py-1 text-sm flex items-center space-x-1"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Approuver</span>
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="glass-btn-secondary px-3 py-1 text-sm flex items-center space-x-1"
                >
                  <XCircleIcon className="h-4 w-4" />
                  <span>Rejeter</span>
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="glass-btn-secondary px-3 py-1 text-sm text-red-400 border-red-500/30 hover:bg-red-500/10 flex items-center space-x-1"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Commentaires ({filteredComments.length})
          </h3>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredComments.map((comment) => {
            const StatusIcon = getStatusIcon(comment.status);
            const isSelected = selectedComments.includes(comment.id);
            
            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 hover:bg-white/5 transition-colors ${isSelected ? 'bg-blue-500/10' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedComments([...selectedComments, comment.id]);
                      } else {
                        setSelectedComments(selectedComments.filter(id => id !== comment.id));
                      }
                    }}
                    className="mt-1 rounded border-gray-600 bg-gray-700"
                  />
                  
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {comment.author.avatar ? (
                      <img 
                        src={comment.author.avatar} 
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-white">{comment.author.name}</h4>
                        <span className="text-sm text-gray-400">{comment.author.email}</span>
                        <div className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(comment.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{comment.status}</span>
                        </div>
                        {comment.reports.length > 0 && (
                          <div className="flex items-center space-x-1 text-red-400">
                            <FlagIcon className="h-4 w-4" />
                            <span className="text-xs">{comment.reports.length} signalement(s)</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{comment.createdAt.toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-engel">{comment.protocolName}</span>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    {comment.rating && (
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-4 w-4 ${i < comment.rating! ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                          />
                        ))}
                        <span className="text-sm text-gray-400 ml-2">{comment.rating}/5</span>
                      </div>
                    )}
                    
                    {/* Comment Content */}
                    <p className="text-gray-300 mb-4">{comment.content}</p>
                    
                    {/* Engagement */}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                      <span>👍 {comment.likes}</span>
                      <span>👎 {comment.dislikes}</span>
                    </div>
                    
                    {/* Rejection Reason */}
                    {comment.status === 'rejected' && comment.rejectionReason && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-300">
                          <strong>Raison du rejet :</strong> {comment.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 mt-4">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'approve')}
                        className="glass-btn-primary px-3 py-1 text-sm flex items-center space-x-1"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Approuver</span>
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'reject', 'Commentaire inapproprié')}
                        className="glass-btn-secondary px-3 py-1 text-sm flex items-center space-x-1"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        <span>Rejeter</span>
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'spam')}
                        className="glass-btn-secondary px-3 py-1 text-sm text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10 flex items-center space-x-1"
                      >
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <span>Spam</span>
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleCommentAction(comment.id, 'delete')}
                    className="glass-btn-secondary px-3 py-1 text-sm text-red-400 border-red-500/30 hover:bg-red-500/10 flex items-center space-x-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Supprimer</span>
                  </button>
                  
                  <button className="glass-btn-secondary px-3 py-1 text-sm flex items-center space-x-1">
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    <span>Voir</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {filteredComments.length === 0 && (
          <div className="p-12 text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Aucun commentaire</h3>
            <p className="text-gray-400">
              {filters.status === 'all' 
                ? 'Aucun commentaire ne correspond à vos critères de recherche.'
                : `Aucun commentaire ${filters.status} trouvé.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentModeration;