import songsData from './songs.json';

export interface SocialPlatformConfig {
  name: string;
  handle: string;
  url: string;
  followers: number;
}

export const socialPlatforms: SocialPlatformConfig[] = [
  { name: 'TikTok', handle: '@meloscribe', url: 'https://tiktok.com/@meloscribe', followers: 42 },
  { name: 'YouTube', handle: '@meloscribe', url: 'https://youtube.com/@meloscribe', followers: 15 },
  { name: 'Instagram', handle: '@meloscribe', url: 'https://instagram.com/@meloscribe', followers: 18 },
  { name: 'Pinterest', handle: '@meloscribe', url: 'https://pinterest.com/@meloscribe', followers: 0 },
  { name: 'Facebook', handle: '@meloscribe', url: 'https://facebook.com/meloscribe', followers: 0 },
  { name: 'Threads', handle: '@meloscribe', url: 'https://threads.net/@meloscribe', followers: 0 }
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
  return count.toString() + '+';
}

export const formattedTotalFollowers = formatFollowersCount(totalFollowers);

// Sheets: automatically counted from songs.json (hidden entries excluded)
export const totalSheets = (songsData as Array<{ hidden?: boolean }>)
  .filter(s => !s.hidden).length;

export function formatSheetsCount(count: number): string {
  return count.toString();
}

export const formattedTotalSheets = formatSheetsCount(totalSheets);

// Customers: actual purchases from Paddle/Ko-fi
export const totalCustomers = 14;

export function formatCustomersCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(0) + 'K+';
  }
  return count.toString();
}

export const formattedTotalCustomers = formatCustomersCount(totalCustomers);

