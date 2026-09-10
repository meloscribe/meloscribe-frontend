import songsData from './songs.json';

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: 'Easy' | 'Original' | 'Original / Easy';
  hasEasy?: boolean;
  hasOriginal?: boolean;
  price: string;
  stripePriceId: string;
  easyPrice?: string;
  easyStripePriceId?: string;
  easyKofiId?: string;
  easyId?: string;
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
  format?: 'full_arrangement';
  videoPreviewUrl?: string;
  theme?: string;
  pinned?: boolean;
  arrangemeUrl?: string;
  isArrangeMe?: boolean;
}

export const songs = (songsData as Song[]).filter(s => s.id !== 'global_settings');

export const globalPaymentsDisabled = (songsData as any[]).find(s => s.id === 'global_settings')?.globalPaymentsDisabled ?? false;

