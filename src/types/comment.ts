/**
 * Types TypeScript pour le système de commentaires et modération
 */

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  protocolId: string;
  protocolName: string;
  status: CommentStatus;
  rating?: number; // Note de 1 à 5 pour les protocoles
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  isReply?: boolean;
  parentCommentId?: string;
  likes: number;
  dislikes: number;
  reports: CommentReport[];
}

export interface CommentReport {
  id: string;
  reporterId: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'fake' | 'other';
  description?: string;
  createdAt: Date;
}

export interface CommentModerationAction {
  id: string;
  commentId: string;
  action: 'approve' | 'reject' | 'mark_spam' | 'delete';
  moderatorId: string;
  moderatorName: string;
  reason?: string;
  createdAt: Date;
}

export interface CommentModerationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  spam: number;
  todaySubmitted: number;
  thisWeekSubmitted: number;
}

export interface CreateCommentRequest {
  content: string;
  protocolId: string;
  rating?: number;
  parentCommentId?: string;
}

export interface ModerationFilters {
  status?: CommentStatus | 'all';
  protocolId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  rating?: number;
  hasReports?: boolean;
}