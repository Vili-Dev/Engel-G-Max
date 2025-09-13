/**
 * Types TypeScript pour la gestion vidéo (YouTube/Vimeo)
 */

export type VideoPlatform = 'youtube' | 'vimeo' | 'direct';

export interface VideoContent {
  id: string;
  title: string;
  description?: string;
  platform: VideoPlatform;
  videoId: string; // ID YouTube/Vimeo ou URL directe
  url: string; // URL complète de la vidéo
  thumbnail?: string;
  duration?: number; // en secondes
  views?: number;
  isPrivate?: boolean;
  embedCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProtocolVideo extends VideoContent {
  protocolId: string;
  protocolName: string;
  videoType: 'introduction' | 'tutorial' | 'testimonial' | 'demonstration' | 'supplement';
  order: number; // Ordre d'affichage dans le protocole
  isRequired?: boolean; // Si la vidéo est obligatoire à regarder
  watchTime?: number; // Temps de visionnage minimum requis
}

export interface VideoPlaylist {
  id: string;
  name: string;
  description?: string;
  protocolId: string;
  videos: ProtocolVideo[];
  totalDuration: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoStats {
  videoId: string;
  views: number;
  averageWatchTime: number;
  completionRate: number; // Pourcentage de visionnage complet
  likes?: number;
  dislikes?: number;
  comments?: number;
  lastUpdated: Date;
}

export interface VideoEmbed {
  platform: VideoPlatform;
  videoId: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
  controls?: boolean;
  privacy?: boolean; // YouTube privacy-enhanced mode
  responsive?: boolean;
  startTime?: number; // Temps de début en secondes
  endTime?: number; // Temps de fin en secondes
}

export interface CreateVideoRequest {
  title: string;
  description?: string;
  platform: VideoPlatform;
  videoId: string;
  protocolId?: string;
  videoType?: ProtocolVideo['videoType'];
  order?: number;
  isRequired?: boolean;
}

export interface VideoFilters {
  platform?: VideoPlatform | 'all';
  protocolId?: string;
  videoType?: ProtocolVideo['videoType'] | 'all';
  isPrivate?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Utilitaires pour extraire les IDs des URLs
export interface VideoUrlParser {
  parseYouTubeUrl: (url: string) => string | null;
  parseVimeoUrl: (url: string) => string | null;
  isValidVideoUrl: (url: string) => boolean;
  getVideoThumbnail: (platform: VideoPlatform, videoId: string) => string;
  generateEmbedUrl: (platform: VideoPlatform, videoId: string, options?: VideoEmbed) => string;
}