export interface CheckoutAttribution {
  traffic_source?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface StoredAttribution extends CheckoutAttribution {
  captured_at?: number;
}

const STORAGE_KEY = 'meloscribe_attribution_v1';
const ATTRIBUTION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days for returning buyers

const INTERNAL_HOSTS = new Set([
  'meloscribesheets.com',
  'www.meloscribesheets.com',
  'meloscribe.dev',
  'www.meloscribe.dev',
  'pulse.meloscribesheets.com',
  'api.meloscribe.dev',
  'localhost',
  '127.0.0.1',
]);

function safeClip(value: string | null | undefined, maxLen: number): string {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

function isInternalHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^www\./, '');
  if (!host) return true;
  if (INTERNAL_HOSTS.has(host) || INTERNAL_HOSTS.has(hostname.toLowerCase())) return true;
  return host.endsWith('.meloscribe.dev') || host.endsWith('.meloscribesheets.com');
}

function classifyPlatformFromHint(hint: string): string {
  const h = hint.toLowerCase();
  if (!h) return '';
  if (h.includes('tiktok') || h === 'tt' || h.includes('musical_ly') || h.includes('bytedance')) return 'TikTok';
  if (h.includes('instagram') || h === 'ig' || h.includes('l.instagram.com')) return 'Instagram';
  if (h.includes('facebook') || h === 'fb' || h.includes('fb.com') || h.includes('fbsbx')) return 'Facebook';
  if (h.includes('youtube') || h === 'yt' || h.includes('youtu.be')) return 'YouTube';
  if (h.includes('pinterest') || h === 'pin' || h.includes('pin.it')) return 'Pinterest';
  if (h.includes('threads')) return 'Threads';
  if (h.includes('google')) return 'Google';
  if (h.includes('bing.') || h.includes('duckduckgo') || h.includes('ecosia') || h.includes('search.yahoo')) return 'Search';
  if (h.includes('reddit')) return 'Reddit';
  if (h.includes('twitter') || h === 't.co' || h === 'x.com') return 'X';
  if (h.includes('linktr.ee') || h.includes('linktree')) return 'Linktree';
  if (h.includes('beacons.ai')) return 'Beacons';
  return '';
}

function detectTrafficSource(
  params: URLSearchParams | null,
  externalReferrerHost: string,
  userAgent: string,
  utmSource: string
): string {
  // 1. Explicit UTM source takes priority
  if (utmSource) {
    const mapped = classifyPlatformFromHint(utmSource);
    return mapped || safeClip(utmSource, 64);
  }

  // 2. Platform click IDs commonly appended by mobile apps / ads / shares
  if (params) {
    if (params.get('ttclid') || params.get('tt_medium')) return 'TikTok';
    if (params.get('igshid') || params.get('igsh')) return 'Instagram';
    if (params.get('fbclid')) return 'Facebook';
    if (params.get('epik')) return 'Pinterest';
    if (params.get('gclid') || params.get('srsltid')) return 'Google';
  }

  // 3. In-app WebView User-Agent signatures (Instagram/Facebook/TikTok often strip document.referrer)
  const ua = userAgent || '';
  if (/musical_ly|TikTok|BytedanceWebview|ByteLocale/i.test(ua)) return 'TikTok';
  if (/Instagram/i.test(ua)) return 'Instagram';
  if (/FBAN\/|FB_IAB|FBIOS|FB4A/i.test(ua)) return 'Facebook';
  if (/Pinterest/i.test(ua)) return 'Pinterest';
  if (/YouTube/i.test(ua)) return 'YouTube';
  if (/Barcelona|Threads/i.test(ua)) return 'Threads';

  // 4. External HTTP Referrer domain
  if (externalReferrerHost) {
    const mapped = classifyPlatformFromHint(externalReferrerHost);
    if (mapped) return mapped;
    const cleanHost = externalReferrerHost.toLowerCase().replace(/^www\./, '');
    return safeClip(cleanHost, 64);
  }

  return '';
}

function readStoredAttribution(): StoredAttribution | null {
  try {
    const rawSession = window.sessionStorage?.getItem(STORAGE_KEY);
    if (rawSession) {
      const parsed = JSON.parse(rawSession) as StoredAttribution;
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // Ignore storage access errors in strict privacy browsers
  }

  try {
    const rawLocal = window.localStorage?.getItem(STORAGE_KEY);
    if (rawLocal) {
      const parsed = JSON.parse(rawLocal) as StoredAttribution;
      if (parsed && typeof parsed === 'object') {
        const age = Date.now() - Number(parsed.captured_at || 0);
        if (!parsed.captured_at || age <= ATTRIBUTION_TTL_MS) {
          return parsed;
        }
      }
    }
  } catch {
    // Ignore storage access errors
  }

  return null;
}

function writeStoredAttribution(data: StoredAttribution): void {
  const payload = JSON.stringify({ ...data, captured_at: Date.now() });
  try {
    window.sessionStorage?.setItem(STORAGE_KEY, payload);
  } catch {
    // Ignore quota/privacy errors
  }
  try {
    window.localStorage?.setItem(STORAGE_KEY, payload);
  } catch {
    // Ignore quota/privacy errors
  }
}

export function captureAttribution(): void {
  try {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search || '');
    const utmSource = safeClip(params.get('utm_source'), 100);
    const utmMedium = safeClip(params.get('utm_medium'), 100);
    const utmCampaign = safeClip(params.get('utm_campaign'), 120);

    let externalReferrer = '';
    let externalReferrerHost = '';
    try {
      const rawRef = safeClip(document.referrer, 300);
      if (rawRef) {
        const refUrl = new URL(rawRef);
        if (!isInternalHost(refUrl.hostname)) {
          externalReferrer = safeClip(rawRef, 280);
          externalReferrerHost = refUrl.hostname;
        }
      }
    } catch {
      // Ignore malformed referrer URLs
    }

    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const detectedSource = detectTrafficSource(params, externalReferrerHost, ua, utmSource);
    const existing = readStoredAttribution();

    // Update stored attribution if we have a fresh external signal, or if nothing was stored yet
    const hasStrongSignal = Boolean(utmSource || detectedSource || externalReferrer);
    if (hasStrongSignal || !existing) {
      const next: StoredAttribution = {
        traffic_source: detectedSource || existing?.traffic_source || 'Direct',
        referrer: externalReferrer || existing?.referrer || '',
        utm_source: utmSource || existing?.utm_source || '',
        utm_medium: utmMedium || existing?.utm_medium || '',
        utm_campaign: utmCampaign || existing?.utm_campaign || '',
      };
      writeStoredAttribution(next);
    }
  } catch {
    // Never let attribution tracking interfere with page rendering
  }
}

export function getCheckoutAttribution(): CheckoutAttribution {
  try {
    if (typeof window === 'undefined') return {};
    captureAttribution();
    const stored = readStoredAttribution();
    if (!stored) return {};
    return {
      traffic_source: safeClip(stored.traffic_source, 64) || 'Direct',
      referrer: safeClip(stored.referrer, 250),
      utm_source: safeClip(stored.utm_source, 100),
      utm_medium: safeClip(stored.utm_medium, 100),
      utm_campaign: safeClip(stored.utm_campaign, 120),
    };
  } catch {
    return {};
  }
}
