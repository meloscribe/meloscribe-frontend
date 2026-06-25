import songsData from './songs.json';

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: 'Easy' | 'Original';
  price: string;
  kofiId: string;
  coverImage: string;
  gradient?: string;
  hidden?: boolean;
  audioPreviewUrl?: string;
  previewStart?: number;
  highlightStart?: number;
  trailerStart?: number;
  isCondensed?: boolean;
  condensed?: boolean;
}

export const songs = songsData as Song[];
