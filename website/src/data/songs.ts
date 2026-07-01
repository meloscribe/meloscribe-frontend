import songsData from './songs.json';

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: 'Easy' | 'Original';
  price: string;
  paddleId: string;
  coverImage: string;
  gradient?: string;
  hidden?: boolean;
  audioPreviewUrl?: string;
  previewStart?: number;
  highlightStart?: number;
  trailerStart?: number;
  isCondensed?: boolean;
  condensed?: boolean;
  paymentsDisabled?: boolean;
}

export const songs = (songsData as Song[]).filter(s => s.id !== 'global_settings');

export const globalPaymentsDisabled = (songsData as any[]).find(s => s.id === 'global_settings')?.globalPaymentsDisabled ?? false;

