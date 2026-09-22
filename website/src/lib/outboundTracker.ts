export interface OutboundClickLog {
  id: string;
  target: string;
  source: 'studio_page' | 'download_page' | string;
  timestamp: string;
}

const LOCAL_STORAGE_KEY = 'meloscribe_outbound_events';

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.') || h.startsWith('172.')) {
      return `http://${h}:8787`;
    }
  }
  return import.meta.env.VITE_API_URL || 'https://api.meloscribe.dev';
};

/**
 * Dispatches an outbound recommendation click asynchronously and non-blockingly.
 * Uses neutral endpoint naming to prevent client-side adblock / Brave Shields false positives.
 */
export function onOutboundClick(target: string, source: 'studio_page' | 'download_page' | string): void {
  const timestamp = new Date().toISOString();
  const clickId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Instant local persistence for offline reliability
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const clicks: OutboundClickLog[] = raw ? JSON.parse(raw) : [];
    clicks.unshift({
      id: clickId,
      target,
      source,
      timestamp,
    });
    if (clicks.length > 500) clicks.length = 500;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clicks));
  } catch (err) {
    console.warn('[OutboundEvents] LocalStorage write failed:', err);
  }

  // 2. Non-blocking beacon or fetch keepalive to neutral backend route
  try {
    const url = `${getApiBase()}/api/events/outbound`;
    const payload = JSON.stringify({ target, source, partnerId: target });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Non-blocking fail-safe
    });
  } catch (_) {
    // Non-blocking
  }
}

/**
 * Retrieves locally cached outbound clicks.
 */
export function getLocalOutboundClicks(): OutboundClickLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
