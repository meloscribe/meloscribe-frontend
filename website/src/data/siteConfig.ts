import songsData from './songs.json';

export interface SocialPlatformConfig {
  name: string;
  handle: string;
  url: string;
  followers: number;
}

export const socialPlatforms: SocialPlatformConfig[] = [
  { name: 'TikTok', handle: '@meloscribe', url: 'https://tiktok.com/@meloscribe', followers: 42000 },
  { name: 'YouTube', handle: '@meloscribe', url: 'https://youtube.com/@meloscribe', followers: 5400 },
  { name: 'Instagram', handle: '@meloscribe', url: 'https://instagram.com/@meloscribe', followers: 3200 },
  { name: 'Pinterest', handle: '@meloscribe', url: 'https://pinterest.com/@meloscribe', followers: 1200 },
  { name: 'Facebook', handle: '@meloscribe', url: 'https://facebook.com/meloscribe', followers: 400 },
  { name: 'Threads', handle: '@meloscribe', url: 'https://threads.net/@meloscribe', followers: 800 }
];

export const kofiUrl = 'https://ko-fi.com/meloscribe';

export const totalFollowers = socialPlatforms.reduce((sum, p) => sum + p.followers, 0);

export function formatFollowersCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(0) + 'K+';
  }
  return count.toString();
}

export const formattedTotalFollowers = formatFollowersCount(totalFollowers);

// Sheets: automatically counted from songs.json (hidden entries excluded)
export const totalSheets = (songsData as Array<{ hidden?: boolean }>)
  .filter(s => !s.hidden).length;

export function formatSheetsCount(count: number): string {
  return count.toString();
}

export const formattedTotalSheets = formatSheetsCount(totalSheets);

// Downloads: manually updated — Ko-fi has no public purchases API.
// Update this number periodically from your Ko-fi dashboard.
export const totalDownloads = 500;

export function formatDownloadsCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(0) + 'K+';
  }
  return count.toString();
}

export const formattedTotalDownloads = formatDownloadsCount(totalDownloads);
