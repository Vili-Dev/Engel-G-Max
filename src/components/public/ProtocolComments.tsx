/**
 * Composant de commentaires pour les protocoles
 * Permet aux utilisateurs de voir et poster des commentaires/avis
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  StarIcon,
  UserIcon,
  HeartIcon,
  FlagIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Comment, CreateCommentRequest } from '../../types/comment';

interface ProtocolCommentsProps {
  protocolId: string;
  protocolName: string;
  allowComments?: boolean;
}

const ProtocolComments: React.FC<ProtocolCommentsProps> = ({ 
  protocolId, 
  protocolName, 
  allowComments = true 
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState<number>(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  // Mock data pour les commentaires approuvés
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        content: 'Excellent protocole ! J\'ai vu des résultats impressionnants après 3 semaines. La transformation faciale est vraiment visible, merci Engel !',
        author: {
          id: 'user1',
          name: 'Alexandre M.',
          email: 'alex.martin@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Alexandre+Martin&background=0ea5e9&color=fff'
        },
        protocolId,
        protocolName,
        status: 'approved',
        rating: 5,
        createdAt: new Date('2024-03-20T10:30:00'),
        updatedAt: new Date('2024-03-20T11:00:00'),
        approvedAt: new Date('2024-03-20T11:00:00'),
        likes: 12,
        dislikes: 0,
        reports: []
      },
      {
        id: '2',
        content: 'Très bon protocole, instructions claires et résultats visibles. Je recommande pour les débutants comme moi.',
        author: {
          id: 'user2',
          name: 'Sophie D.',
          email: 'sophie.dubois@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Sophie+Dubois&background=ec4899&color=fff'
        },
        protocolId,
        protocolName,
        status: 'approved',
        rating: 4,
        createdAt: new Date('2024-03-18T15:45:00'),
        updatedAt: new Date('2024-03-18T16:00:00'),
        approvedAt: new Date('2024-03-18T16:00:00'),
        likes: 8,
        dislikes: 1,
        reports: []
      },
      {
        id: '3',
        content: 'Protocole efficace mais il faut être patient. Les résultats arrivent progressivement, ne vous découragez pas !',
        author: {
          id: 'user3',
          name: 'Thomas L.',
          email: 'thomas.leroy@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Thomas+Leroy&background=16a34a&color=fff'
        },
        protocolId,
        protocolName,
        status: 'approved',
        rating: 4,
        createdAt: new Date('2024-03-15T12:15:00'),
        updatedAt: new Date('2024-03-15T12:15:00'),
        approvedAt: new Date('2024-03-15T12:30:00'),
        likes: 5,
        dislikes: 0,
        reports: []
      }
    ];

    // Filtrer les commentaires pour ce protocole et qui sont approuvés
    const protocolComments = mockComments.filter(
      c => c.protocolId === protocolId && c.status === 'approved'
    );

    setTimeout(() => {
      setComments(protocolComments);
      setLoading(false);
    }, 800);
  }, [protocolId]);

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const averageRating = comments.length > 0 
    ? comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.length 
    : 0;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim() || !userEmail.trim()) return;

    setSubmitting(true);

    // Simuler l'envoi du commentaire
    const commentRequest: CreateCommentRequest = {
      content: newComment,
      protocolId,
      rating: newRating > 0 ? newRating : undefined
    };

    // Ici on enverrait la requête à l'API
    setTimeout(() => {
      setSubmitting(false);
      setNewComment('');
      setNewRating(0);
      setShowCommentForm(false);
      
      // Afficher un message de succès
      alert('Commentaire soumis ! Il sera visible après modération.');
    }, 1000);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleReportComment = (commentId: string) => {
    // Ici on ouvrirait une modal de signalement
    alert('Signalement envoyé. Merci pour votre contribution.');
  };

  const renderRatingStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
            disabled={!interactive}
          >
            <StarIcon 
              className={`h-5 w-5 ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : interactive 
                    ? 'text-gray-500 hover:text-yellow-300' 
                    : 'text-gray-600'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 mr-3" />
            Avis & Commentaires
          </h3>
          {comments.length > 0 && (
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                {renderRatingStars(averageRating)}
                <span className="text-yellow-400 font-medium">
                  {averageRating.toFixed(1)} / 5
                </span>
                <span className="text-gray-400">
                  ({comments.length} avis)
                </span>
              </div>
            </div>
          )}
        </div>
        
        {allowComments && (
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="glass-btn-primary px-4 py-2 flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            <span>Laisser un avis</span>
          </button>
        )}
      </div>

      {/* Comment Form */}
      <AnimatePresence>
        {showCommentForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmitComment}
            className="glass-card p-6 mb-8 bg-blue-500/10 border-blue-500/30"
          >
            <h4 className="text-lg font-semibold text-white mb-4">Laisser un avis</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nom *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Votre nom"
                  className="glass-input w-full px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="glass-input w-full px-4 py-2"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Note</label>
              {renderRatingStars(newRating, true, setNewRating)}
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Commentaire *</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce protocole..."
                rows={4}
                className="glass-input w-full px-4 py-3 resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Votre commentaire sera vérifié avant publication.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="glass-btn-secondary px-4 py-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim() || !userName.trim() || !userEmail.trim()}
                  className="glass-btn-primary px-4 py-2 flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <PaperAirplaneIcon className="h-4 w-4" />
                  )}
                  <span>{submitting ? 'Envoi...' : 'Publier'}</span>
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Sort Options */}
      {comments.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-400">
            {comments.length} commentaire{comments.length > 1 ? 's' : ''}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'rating')}
            className="glass-input px-3 py-1 text-sm"
          >
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="rating">Mieux notés</option>
          </select>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex space-x-4 p-4 hover:bg-white/5 rounded-xl transition-colors"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {comment.author.avatar ? (
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h5 className="font-medium text-white">{comment.author.name}</h5>
                  {comment.rating && renderRatingStars(comment.rating)}
                </div>
                <span className="text-sm text-gray-400">
                  {comment.createdAt.toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <p className="text-gray-300 mb-4 leading-relaxed">
                {comment.content}
              </p>
              
              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="flex items-center space-x-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                  <HeartIcon className="h-4 w-4" />
                  <span>{comment.likes}</span>
                </button>
                
                <button
                  onClick={() => handleReportComment(comment.id)}
                  className="flex items-center space-x-1 text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FlagIcon className="h-4 w-4" />
                  <span>Signaler</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {comments.length === 0 && (
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-white mb-2">
            Aucun commentaire pour l'instant
          </h4>
          <p className="text-gray-400 mb-6">
            Soyez le premier à partager votre expérience avec ce protocole !
          </p>
          {allowComments && (
            <button
              onClick={() => setShowCommentForm(true)}
              className="glass-btn-primary px-6 py-3"
            >
              Laisser le premier avis
            </button>
          )}
        </div>
      )}

      {/* Moderation Notice */}
      {allowComments && (
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Modération des commentaires</p>
              <p>
                Tous les commentaires sont vérifiés avant publication pour maintenir 
                la qualité des échanges. Merci de rester respectueux et constructif.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolComments;