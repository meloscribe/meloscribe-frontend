export interface LearningTool {
  id: string;
  name: string;
  image: string;
  psychologicalLabel: string;
  tagline: string;
  oneLiner: string;
  url: string;
  cta: string;
  badgeColor: 'magenta' | 'cyan' | 'violet';
  trackingId: string;
  bullets: string[];
}

export interface HardwareGear {
  id: string;
  title: string;
  image: string;
  badge: string;
  recommendation: string;
  description: string;
  url: string;
  cta: string;
  trackingId: string;
  bullets: string[];
}

export const affiliateLearningTools: LearningTool[] = [
  {
    id: 'pianoforall',
    name: 'Pianoforall',
    image: '/images/studio/pianoforall.jpg',
    psychologicalLabel: 'Playing by Ear & Chords',
    tagline: 'Bypass traditional notation. Master chords and accompaniment.',
    oneLiner: 'Bypass traditional sight-reading and learn to accompany songs by ear from day one.',
    url: 'https://6128dhhk3iqgp7idv4pn65ub1c.hop.clickbank.net',
    cta: 'Explore Pianoforall →',
    badgeColor: 'magenta',
    trackingId: 'pianoforall',
    bullets: [
      'Lifetime access, zero monthly subscriptions',
      'Rapid chord shapes & rhythm patterns',
      'Master pop, rock, and soundtrack accompaniment',
    ],
  },
  {
    id: 'flowkey',
    name: 'flowkey',
    image: '/images/studio/flowkey.jpg',
    psychologicalLabel: 'Interactive Practice & Flow',
    tagline: 'Interactive practice with visual overhead hands.',
    oneLiner: 'Interactive song practice with real overhead pianist hands and live acoustic note listening.',
    url: 'https://flowkey.com', // In review - update with affiliate link once approved
    cta: 'Try flowkey for Free →',
    badgeColor: 'cyan',
    trackingId: 'flowkey',
    bullets: [
      'Overhead pianist hands & scrolling notation',
      'Wait-mode listens until you play correctly',
      'Isolate hands and loop difficult bars',
    ],
  },
  {
    id: 'skoove',
    name: 'Skoove',
    image: '/images/studio/skoove.jpg',
    psychologicalLabel: 'AI Feedback & Fundamentals',
    tagline: 'Structured piano academy with AI timing feedback.',
    oneLiner: 'Structured classical curriculum combining music theory with real-time AI technique feedback.',
    url: 'https://www.skoove.com/#a_aid=meloscribe',
    cta: 'Explore Skoove →',
    badgeColor: 'violet',
    trackingId: 'skoove',
    bullets: [
      'Understand the theory behind the music',
      'Real-time AI acoustic timing & note feedback',
      'Build two-handed sight-reading and technique',
    ],
  },
];

export const affiliateHardwareGear: HardwareGear[] = [
  {
    id: 'starter-piano',
    title: 'The Starter Digital Piano',
    image: '/images/studio/digital-piano.jpg',
    badge: '88 Hammer-Action Keys',
    recommendation: 'Roland FP-10 / Yamaha P-145',
    description: 'Fully weighted hammer-action keys provide authentic acoustic piano touch, finger strength, and dynamic expression.',
    url: 'https://www.thomann.de/intl/digital_pianos.html', // In review - update with affiliate link once approved
    cta: 'View on Thomann →',
    trackingId: 'thomann-piano',
    bullets: [
      '88 progressive hammer-action keys',
      'Essential acoustic touch & resistance',
      'Built-in USB MIDI for learning apps',
    ],
  },
  {
    id: 'studio-headphones',
    title: 'Closed-Back Studio Headphones',
    image: '/images/studio/headphones.jpg',
    badge: 'Zero Latency & True Stereo',
    recommendation: 'Beyerdynamic DT 770 PRO / Audio-Technica ATH-M50x',
    description: 'Crystal-clear acoustic resonance and zero latency for immersive late-night practice without disturbing others.',
    url: 'https://www.thomann.de/intl/studio_headphones.html', // In review - update with affiliate link once approved
    cta: 'View on Thomann →',
    trackingId: 'thomann-headphones',
    bullets: [
      'Zero-latency direct piano monitoring',
      'Deep stereo soundstage without disturbing others',
      'Ultra-comfortable velour or leatherette ear pads',
    ],
  },
  {
    id: 'essential-accessories',
    title: 'Essential Hardware Accessories',
    image: '/images/studio/accessories.jpg',
    badge: 'Heavy-Duty Pedal & Z-Stand',
    recommendation: 'Solid Metal Damper Pedal & Rock-Solid Frame',
    description: 'Rock-solid foundation for proper posture, stable playing, and authentic foot damper pedal technique.',
    url: 'https://www.thomann.de/intl/keyboard_accessories.html', // In review - update with affiliate link once approved
    cta: 'View on Thomann →',
    trackingId: 'thomann-accessories',
    bullets: [
      'Heavy chrome pedal that never slips',
      'Wobble-free adjustable Z-frame stand',
      'Universal 1/4" polarity-switched jack',
    ],
  },
];

export const affiliateTransparencyNotice = {
  title: 'Transparency Notice',
  text: 'Some links on this page are affiliate links. If you purchase through them, Meloscribe earns a small commission at no additional cost to you. Only gear and tools genuinely vetted for pianists are recommended.',
};
