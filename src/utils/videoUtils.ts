/**
 * Utilitaires pour la gestion des vidéos YouTube et Vimeo
 */

import { VideoPlatform, VideoEmbed } from '../types/video';

export class VideoUtils {
  /**
   * Parse une URL YouTube et extrait l'ID de la vidéo
   */
  static parseYouTubeUrl(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/user\/[^\/]+#[^\/]*\/[^\/]*\/[^\/]*\/([^&\n?#]+)/,
      /youtube\.com\/ytscreeningroom\?v=([^&\n?#]+)/,
      /youtube\.com\/sandalsResorts#[^\/]*\/[^\/]*\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Parse une URL Vimeo et extrait l'ID de la vidéo
   */
  static parseVimeoUrl(url: string): string | null {
    const patterns = [
      /vimeo\.com\/([0-9]+)/,
      /vimeo\.com\/video\/([0-9]+)/,
      /player\.vimeo\.com\/video\/([0-9]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Détermine la plateforme vidéo à partir d'une URL
   */
  static detectPlatform(url: string): VideoPlatform | null {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    if (url.includes('vimeo.com')) {
      return 'vimeo';
    }
    // Pour les vidéos directes (MP4, etc.)
    if (url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i)) {
      return 'direct';
    }
    return null;
  }

  /**
   * Valide une URL vidéo
   */
  static isValidVideoUrl(url: string): boolean {
    const platform = this.detectPlatform(url);
    if (!platform) return false;

    switch (platform) {
      case 'youtube':
        return this.parseYouTubeUrl(url) !== null;
      case 'vimeo':
        return this.parseVimeoUrl(url) !== null;
      case 'direct':
        return true; // Assumons que les URLs directes sont valides
      default:
        return false;
    }
  }

  /**
   * Génère l'URL de la miniature
   */
  static getVideoThumbnail(platform: VideoPlatform, videoId: string): string {
    switch (platform) {
      case 'youtube':
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      case 'vimeo':
        // Pour Vimeo, nous aurions besoin d'une requête API pour obtenir la miniature
        // Ici nous retournons une miniature par défaut
        return `https://vumbnail.com/${videoId}.jpg`;
      case 'direct':
        return '/images/video-placeholder.jpg'; // Miniature par défaut
      default:
        return '/images/video-placeholder.jpg';
    }
  }

  /**
   * Génère l'URL d'embed pour une vidéo
   */
  static generateEmbedUrl(platform: VideoPlatform, videoId: string, options: VideoEmbed = {}): string {
    const {
      autoplay = false,
      controls = true,
      privacy = true,
      startTime,
      endTime
    } = options;

    switch (platform) {
      case 'youtube': {
        const baseUrl = privacy 
          ? 'https://www.youtube-nocookie.com/embed/'
          : 'https://www.youtube.com/embed/';
        
        const params = new URLSearchParams();
        if (autoplay) params.set('autoplay', '1');
        if (!controls) params.set('controls', '0');
        if (startTime) params.set('start', startTime.toString());
        if (endTime) params.set('end', endTime.toString());
        params.set('rel', '0'); // Ne pas afficher les vidéos suggérées
        params.set('modestbranding', '1'); // Masquer le logo YouTube

        const queryString = params.toString();
        return `${baseUrl}${videoId}${queryString ? `?${queryString}` : ''}`;
      }

      case 'vimeo': {
        const baseUrl = 'https://player.vimeo.com/video/';
        const params = new URLSearchParams();
        
        if (autoplay) params.set('autoplay', '1');
        if (!controls) params.set('controls', '0');
        params.set('title', '0'); // Masquer le titre
        params.set('byline', '0'); // Masquer l'auteur
        params.set('portrait', '0'); // Masquer l'avatar

        const queryString = params.toString();
        return `${baseUrl}${videoId}${queryString ? `?${queryString}` : ''}`;
      }

      case 'direct':
        return videoId; // Pour les vidéos directes, l'ID est l'URL

      default:
        return '';
    }
  }

  /**
   * Génère le code HTML d'embed complet
   */
  static generateEmbedCode(
    platform: VideoPlatform, 
    videoId: string, 
    options: VideoEmbed = {}
  ): string {
    const {
      width = '100%',
      height = '400',
      responsive = true
    } = options;

    const embedUrl = this.generateEmbedUrl(platform, videoId, options);

    if (platform === 'direct') {
      return `
        <video 
          width="${width}" 
          height="${height}" 
          controls
          ${options.autoplay ? 'autoplay' : ''}
          style="max-width: 100%;"
        >
          <source src="${embedUrl}" type="video/mp4">
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      `;
    }

    const iframeStyle = responsive 
      ? 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;'
      : `width: ${width}; height: ${height}px;`;

    const containerStyle = responsive 
      ? 'position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;'
      : '';

    const iframe = `
      <iframe 
        src="${embedUrl}"
        style="${iframeStyle}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;

    return responsive 
      ? `<div style="${containerStyle}">${iframe}</div>`
      : iframe;
  }

  /**
   * Extrait les informations d'une URL vidéo
   */
  static parseVideoUrl(url: string): { platform: VideoPlatform; videoId: string } | null {
    const platform = this.detectPlatform(url);
    if (!platform) return null;

    let videoId: string | null = null;

    switch (platform) {
      case 'youtube':
        videoId = this.parseYouTubeUrl(url);
        break;
      case 'vimeo':
        videoId = this.parseVimeoUrl(url);
        break;
      case 'direct':
        videoId = url; // Pour les vidéos directes, l'URL est l'ID
        break;
    }

    if (!videoId) return null;

    return { platform, videoId };
  }

  /**
   * Formate la durée en format lisible
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
    }
    return `${minutes}min ${secs.toString().padStart(2, '0')}s`;
  }

  /**
   * Convertit une durée en format HH:MM:SS vers les secondes
   */
  static parseDuration(duration: string): number {
    const parts = duration.split(':').map(Number);
    
    if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // SS
      return parts[0];
    }

    return 0;
  }

  /**
   * Génère un aperçu des informations vidéo pour l'admin
   */
  static generateVideoPreview(url: string): {
    isValid: boolean;
    platform?: VideoPlatform;
    videoId?: string;
    embedUrl?: string;
    thumbnailUrl?: string;
    error?: string;
  } {
    if (!url.trim()) {
      return { isValid: false, error: 'URL vide' };
    }

    const parsed = this.parseVideoUrl(url);
    
    if (!parsed) {
      return { 
        isValid: false, 
        error: 'URL non reconnue. Formats supportés : YouTube, Vimeo, vidéos directes' 
      };
    }

    const { platform, videoId } = parsed;
    
    return {
      isValid: true,
      platform,
      videoId,
      embedUrl: this.generateEmbedUrl(platform, videoId),
      thumbnailUrl: this.getVideoThumbnail(platform, videoId)
    };
  }
}

export default VideoUtils;