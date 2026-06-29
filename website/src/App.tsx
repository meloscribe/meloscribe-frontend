import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Music, ShoppingBag, Play, Youtube, Globe, ChevronDown, Instagram, Sun, Moon, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { songs, Song, globalPaymentsDisabled } from './data/songs';
import { socialPlatforms as configPlatforms, formattedTotalFollowers, formattedTotalSheets, formattedTotalCustomers, formatCustomersCount } from './data/siteConfig';
import PaddleModal from './components/PaddleModal';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Terms from './pages/Terms';
import Refunds from './pages/Refunds';
import Suggestions from './pages/Suggestions';
import Success from './pages/Success';
import OrderDetails from './pages/OrderDetails';

// Format auto-detection helper
const getSongFormat = (song: Song): 'viral_part' | 'full_arrangement' => {
  if (song.format === 'viral_part') return 'viral_part';
  if (song.format === 'full_arrangement') return 'full_arrangement';
  const p = song.price || '';
  if (p.includes('3')) return 'viral_part';
  return 'full_arrangement';
};

// Translations
const translations = {
  en: {
    brand: 'meloscribe',
    tagline: 'Play the Songs',
    taglineHighlight: 'You Love.',
    subtitle: 'Accurate piano sheets and arrangements for pop and cinematic soundtracks. No guesswork, no endless searching. ',
    subtitleHighlight: 'Grab your sheets and start playing.',
    badgeText: 'New sheets added weekly',
    browseSheets: 'Browse Sheets',
    followUs: 'Follow Us',
    scrollToExplore: 'Scroll',
    popularArrangements: 'Popular Arrangements',
    popularDesc: 'Discover our most downloaded piano sheets',
    downloadSheets: 'Buy Sheets',
    currentlyDisabled: 'Currently Disabled',
    viewAll: 'View All Arrangements',
    joinCommunity: 'Join the Community',
    communityDesc: 'Follow us for tutorials, new releases, and behind-the-scenes',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    instagram: 'Instagram',
    pinterest: 'Pinterest',
    facebook: 'Facebook',
    threads: 'Threads',
    statsFollowers: 'Total Followers',
    statsSheets: 'Sheet Arrangements',
    statsCustomers: 'Customers',
    copyright: 'All rights reserved.',
    imprint: 'Imprint',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    refunds: 'Refund Policy',
  },
  de: {
    brand: 'meloscribe',
    tagline: 'Spiele die Lieder',
    taglineHighlight: 'die du liebst.',
    subtitle: 'Präzise Klaviernoten und Arrangements für Pop und Filmsoundtracks. Kein Rätselraten, kein endloses Suchen. ',
    subtitleHighlight: 'Noten greifen und losspielen.',
    badgeText: 'Jede Woche neue Noten',
    browseSheets: 'Noten durchsuchen',
    followUs: 'Folgen',
    scrollToExplore: 'Scrollen',
    popularArrangements: 'Beliebte Arrangements',
    popularDesc: 'Entdecke unsere meist heruntergeladenen Klaviernoten',
    downloadSheets: 'Noten kaufen',
    currentlyDisabled: 'Derzeit deaktiviert',
    viewAll: 'Alle Arrangements ansehen',
    joinCommunity: 'Werde Teil der Community',
    communityDesc: 'Folge uns für Tutorials, Neuerscheinungen und Hinter den Kulissen',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    instagram: 'Instagram',
    pinterest: 'Pinterest',
    facebook: 'Facebook',
    threads: 'Threads',
    statsFollowers: 'Follower insgesamt',
    statsSheets: 'Noten Arrangements',
    statsCustomers: 'Kunden',
    copyright: 'Alle Rechte vorbehalten.',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    refunds: 'Erstattungsrichtlinie',
  },
  fr: {
    brand: 'meloscribe',
    tagline: 'Jouez les morceaux',
    taglineHighlight: 'que vous aimez.',
    subtitle: 'Partitions et arrangements de piano précis pour les bandes sonores pop et cinématographiques. Pas de devinettes, pas de recherche sans fin. ',
    subtitleHighlight: 'Prenez vos partitions et commencez à jouer.',
    badgeText: 'Nouvelles partitions chaque semaine',
    browseSheets: 'Parcourir les partitions',
    followUs: 'Suivez-nous',
    scrollToExplore: 'Défiler',
    popularArrangements: 'Arrangements populaires',
    popularDesc: 'Découvrez nos partitions les plus téléchargées',
    downloadSheets: 'Acheter',
    currentlyDisabled: 'Actuellement désactivé',
    viewAll: 'Voir tous les arrangements',
    joinCommunity: 'Reignez la communauté',
    communityDesc: 'Suivez-nous pour des tutoriels, de nouvelles sorties et les coulisses',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    instagram: 'Instagram',
    pinterest: 'Pinterest',
    facebook: 'Facebook',
    threads: 'Threads',
    statsFollowers: 'Total des abonnés',
    statsSheets: 'Arrangements',
    statsCustomers: 'Clients',
    copyright: 'Tous droits réservés.',
    imprint: 'Mentions légales',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d\'utilisation',
    refunds: 'Politique de remboursement',
  },
  es: {
    brand: 'meloscribe',
    tagline: 'Toca las canciones',
    taglineHighlight: 'que amas.',
    subtitle: 'Partituras y arreglos de piano precisos para bandas sonoras de pop y cine. Sin adivinanzas, sin búsquedas interminables. ',
    subtitleHighlight: 'Consigue tus partituras y empieza a jugar.',
    badgeText: 'Nuevas partituras añadidas semanalmente',
    browseSheets: 'Explorar partituras',
    followUs: 'Síguenos',
    scrollToExplore: 'Desplazarse',
    popularArrangements: 'Arreglos populares',
    popularDesc: 'Descubre nuestras partituras de piano más descargadas',
    downloadSheets: 'Comprar',
    currentlyDisabled: 'Actualmente desactivado',
    viewAll: 'Ver todos los arreglos',
    joinCommunity: 'Únete a la comunidad',
    communityDesc: 'Síguenos para tutoriales, nuevos lanzamientos y detrás de escena',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    instagram: 'Instagram',
    pinterest: 'Pinterest',
    facebook: 'Facebook',
    threads: 'Threads',
    statsFollowers: 'Seguidores totales',
    statsSheets: 'Arreglos de partituras',
    statsCustomers: 'Clientes',
    copyright: 'Todos los derechos reservados.',
    imprint: 'Aviso legal',
    privacy: 'Política de privacidad',
    terms: 'Condiciones de servicio',
    refunds: 'Política de reembolso',
  },
  it: {
    brand: 'meloscribe',
    tagline: 'Suona le canzoni',
    taglineHighlight: 'che ami.',
    subtitle: 'Spartiti e arrangiamenti per pianoforte precisi per colonne sonore pop e cinematografiche. Nessuna congettura, nessuna ricerca infinita. ',
    subtitleHighlight: 'Prendi i tuoi spartiti e inizia a suonare.',
    badgeText: 'Nuovi spartiti aggiunti ogni settimana',
    browseSheets: 'Sfoglia gli spartiti',
    followUs: 'Seguici',
    scrollToExplore: 'Scorri',
    popularArrangements: 'Arrangamenti popolari',
    popularDesc: 'Scopri i nostri spartiti per pianoforte più scaricati',
    downloadSheets: 'Acquista',
    currentlyDisabled: 'Attualmente disabilitato',
    viewAll: 'Visualizza tutti gli arrangiamenti',
    joinCommunity: 'Unisciti alla comunità',
    communityDesc: 'Seguici per tutorial, nuove uscite e dietro le quinte',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    instagram: 'Instagram',
    pinterest: 'Pinterest',
    facebook: 'Facebook',
    threads: 'Threads',
    statsFollowers: 'Follower totali',
    statsSheets: 'Arrangamenti spartiti',
    statsCustomers: 'Clienti',
    copyright: 'Tutti i diritti riservati.',
    imprint: 'Note legali',
    privacy: 'Informativa sulla privacy',
    terms: 'Termini di servizio',
    refunds: 'Politica di rimborso',
  },
};

// Smart Search Helpers
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents/diacritics
    .replace(/[^a-z0-9\s]/g, ""); // remove punctuation
}

function getLevenshteinDistance(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function smartSearchMatch(title: string, artist: string, query: string): boolean {
  if (!query.trim()) return true;
  
  const normTitle = normalizeString(title);
  const normArtist = normalizeString(artist);
  const normQuery = normalizeString(query);
  
  const combined = normTitle + " " + normArtist;
  const collapsedCombined = combined.replace(/\s+/g, "");
  const collapsedQuery = normQuery.replace(/\s+/g, "");
  
  // 1. Spacing / substring check
  if (combined.includes(normQuery) || collapsedCombined.includes(collapsedQuery)) return true;
  
  // 2. Full collapsed Levenshtein check (handles spaces omitted + typo)
  const fullDistance = getLevenshteinDistance(collapsedQuery, collapsedCombined.substring(0, collapsedQuery.length));
  const maxFullDistance = collapsedQuery.length <= 6 ? 1 : 2;
  if (fullDistance <= maxFullDistance) return true;
  
  // 3. Token-by-token fuzzy matching with prefix comparison
  const queryTokens = normQuery.split(/\s+/).filter(Boolean);
  const songTokens = [...normTitle.split(/\s+/), ...normArtist.split(/\s+/)].filter(Boolean);
  
  return queryTokens.every(qToken => {
    if (normTitle.includes(qToken) || normArtist.includes(qToken)) return true;
    
    return songTokens.some(sToken => {
      const sPrefix = sToken.substring(0, qToken.length);
      const maxDistance = qToken.length <= 4 ? 1 : (qToken.length <= 8 ? 2 : 3);
      return getLevenshteinDistance(qToken, sPrefix) <= maxDistance;
    });
  });
}

type Language = keyof typeof translations;

// Custom SVG Icons
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.468l-2.04.569c-1.104-3.96-3.806-5.937-8.277-6.072-3.097.08-5.403 1.076-6.86 2.964-1.337 1.729-2.032 4.21-2.067 7.376.033 3.167.73 5.648 2.067 7.377 1.458 1.888 3.765 2.883 6.861 2.965 2.583-.066 4.484-.67 5.81-1.843 1.48-1.307 2.22-3.246 2.205-5.77-.014-1.24-.264-2.304-.741-3.164-.475-.856-1.148-1.507-2.021-1.95-.874-.446-1.843-.67-2.906-.67-.752 0-1.434.091-2.046.273-.61.18-1.133.417-1.57.71-.438.295-.79.635-1.06 1.02-.27.385-.43.78-.48 1.188l-.072.54.007.038c.18 1.025.625 1.773 1.336 2.24.71.468 1.603.703 2.68.703 1.02 0 1.83-.18 2.43-.541.596-.36.99-.76 1.18-1.2l-1.96-.87c-.18.325-.45.574-.81.748-.36.174-.81.261-1.35.261-.61 0-1.1-.14-1.47-.42-.36-.28-.59-.69-.68-1.23v-.01c.08-.49.33-.93.75-1.33.42-.4 1.04-.6 1.86-.6.58 0 1.1.1 1.55.3.45.2.82.47 1.11.82.29.35.51.75.66 1.21.15.46.22.94.22 1.45 0 .67-.12 1.29-.35 1.86-.23.57-.57 1.07-1.01 1.49-.44.42-.98.75-1.61.98-.63.23-1.34.34-2.13.34-1.18 0-2.18-.24-3-.71-.82-.48-1.46-1.12-1.92-1.94-.46-.82-.69-1.75-.69-2.79 0-.88.15-1.71.46-2.5.31-.79.75-1.49 1.34-2.1.58-.61 1.29-1.1 2.11-1.46.82-.36 1.74-.54 2.75-.54 1.07 0 2.06.18 2.96.54.9.36 1.67.87 2.33 1.53.65.66 1.15 1.44 1.5 2.34.35.9.53 1.88.53 2.94v.03c.02 2.72-.73 4.86-2.25 6.42-1.52 1.56-3.71 2.38-6.56 2.47l-.02.05z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.492 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const getPlatformIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'tiktok': return TikTokIcon;
    case 'youtube': return Youtube;
    case 'instagram': return Instagram;
    case 'pinterest': return PinterestIcon;
    case 'facebook': return FacebookIcon;
    case 'threads': return ThreadsIcon;
    default: return Music;
  }
};

function LanguageDropdown({ language, setLanguage }: { language: Language; setLanguage: (lang: Language) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 dark:bg-dark-700/50 dark:border-dark-500/50 dark:text-gray-300 dark:hover:text-white dark:hover:border-dark-400 transition-all duration-300"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{language.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} hidden sm:inline`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-white border border-gray-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200 dark:bg-dark-800 dark:border-dark-600">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors ${
                language === lang.code ? 'text-neon-cyan bg-gray-100 dark:bg-dark-700/50' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'https://wooing-encrust-ladle.ngrok-free.dev'
    : 'https://api.meloscribe.dev');

function App() {
  const { i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguageState] = useState<Language>(() => {
    const current = (i18n.resolvedLanguage || i18n.language) as Language;
    return ['en', 'de', 'fr', 'es', 'it'].includes(current) ? current : 'en';
  });
  const [liveCustomers, setLiveCustomers] = useState<string>(formattedTotalCustomers);
  const [liveFollowers, setLiveFollowers] = useState<string>(formattedTotalFollowers);
  const t = translations[language];

  // Audio Preview States & Refs
  const [isMuted, setIsMuted] = useState(true);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const playMuteSound = (muted: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (muted) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn("Failed to play UI sound", e);
    }
  };

  // Stop currently playing audio preview
  const stopAudio = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (audioRef.current) {
      const audio = audioRef.current;
      const start = performance.now();
      const startVol = audio.volume;
      fadeIntervalRef.current = window.setInterval(() => {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / 200, 1);
        audio.volume = startVol * (1 - progress);
        if (progress >= 1) {
          clearInterval(fadeIntervalRef.current!);
          fadeIntervalRef.current = null;
          audio.pause();
          audio.src = '';
          setPlayingSongId(null);
        }
      }, 16);
    } else {
      setPlayingSongId(null);
    }
  };

  // Play audio preview with 300ms fade-in
  const playAudio = (song: Song) => {
    if (isMuted) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioUrl = song.audioPreviewUrl || `/audio-previews/${song.title}.mp3`;
    const isCondensed = getSongFormat(song) === 'viral_part';
    const previewStart = song.previewStart ?? song.highlightStart ?? song.trailerStart ?? (isCondensed ? 15 : 0);

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.currentTime = previewStart;
    audio.volume = 0;

    audio.play()
      .then(() => {
        setPlayingSongId(song.id);
        const start = performance.now();
        fadeIntervalRef.current = window.setInterval(() => {
          const elapsed = performance.now() - start;
          const progress = Math.min(elapsed / 300, 1);
          audio.volume = progress * 0.35;
          if (progress >= 1) {
            clearInterval(fadeIntervalRef.current!);
            fadeIntervalRef.current = null;
          }
        }, 16);
      })
      .catch((err) => {
        console.warn('Audio preview autoplay failed or file missing:', err);
      });
  };

  // Card Mouse Hover handlers with 1s debounce
  const handleCardMouseEnter = (song: Song) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = window.setTimeout(() => {
      playAudio(song);
    }, 250);
  };

  const handleCardMouseLeave = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    stopAudio();
  };

  // Mute effect
  useEffect(() => {
    if (isMuted) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setPlayingSongId(null);
    }
  }, [isMuted]);

  // Wrapper function to change language in i18n and state
  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  // Sync language state with i18n resolved language
  useEffect(() => {
    const current = (i18n.resolvedLanguage || i18n.language) as Language;
    if (current && ['en', 'de', 'fr', 'es', 'it'].includes(current) && current !== language) {
      setLanguageState(current);
    }
  }, [i18n.resolvedLanguage, i18n.language]);

  // Fetch live customers and followers from the backend on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/public/stats`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.customers === 'number') {
            setLiveCustomers(formatCustomersCount(data.customers));
          }
          if (data && typeof data.followers === 'number') {
            setLiveFollowers(formatFollowersCount(data.followers));
          }
        }
      } catch (err) {
        console.warn('Backend public stats unreachable, using fallback siteConfig stats.', err);
      }
    };
    fetchStats();

    // Preload audio files to ensure instant playback on hover
    try {
      songsData.forEach(song => {
        const url = song.audioPreviewUrl || `/audio-previews/${song.title}.mp3`;
        if (url) {
          const audio = new Audio();
          audio.src = url;
          audio.preload = 'auto';
        }
      });
    } catch (e) {
      console.warn('Preloading audio failed:', e);
    }

    // Scrollbar scrolling state logic to hide thumb when inactive
    let scrollTimeout: number;
    const handleScrollActive = () => {
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 1000);
    };

    window.addEventListener('scroll', handleScrollActive, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollActive);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Initialize Paddle SDK
  useEffect(() => {
    const paddle = (window as any).Paddle;
    if (typeof paddle !== 'undefined') {
      // Use sandbox env for development and testing
      paddle.Environment.set('sandbox');
      paddle.Initialize({
        token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN || 'pt_sandbox_kJw0HdqYxRtf9s9D1Pj5wN7b5B5'
      });
    }
  }, []);

  // Dark/Light Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default to dark mode
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Routing State
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Ko-fi Modal State
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isKofiModalOpen, setIsKofiModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState<'All' | 'Viral Part' | 'Full Arrangement'>('All');

  // Toast notifications state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filteredSongs = songs.filter((song) => {
    if (song.hidden) return false;
    
    const matchesSearch = smartSearchMatch(song.title, song.artist, searchQuery);
      
    const matchesDifficulty = 
      difficultyFilter === 'All' || 
      song.difficulty === difficultyFilter;

    const isSongCondensed = getSongFormat(song) === 'viral_part';
    const matchesFormat = 
      formatFilter === 'All' ||
      (formatFilter === 'Viral Part' && isSongCondensed) ||
      (formatFilter === 'Full Arrangement' && !isSongCondensed);
      
    return matchesSearch && matchesDifficulty && matchesFormat;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync state with back/forward history buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setTransitioning(true);
    setTimeout(() => {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0 });
      setTimeout(() => {
        setTransitioning(false);
      }, 50);
    }, 200);
  };

  const handleDownloadClick = (song: Song) => {
    setSelectedSong(song);
    setIsKofiModalOpen(true);
  };

  return (

    <div className="min-h-screen bg-neon-gradient overflow-x-hidden">
      {/* Ambient Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb glow-orb-cyan w-96 h-96 -top-48 -left-48" />
        <div className="glow-orb glow-orb-pink w-96 h-96 top-1/3 -right-48" />
        <div className="glow-orb glow-orb-cyan w-72 h-72 bottom-20 left-1/4 opacity-20" />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-white/85 border-gray-200/60 dark:bg-dark-900/90 dark:border-dark-600/50'
          : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Nav links */}
            <div className="flex items-center gap-2 sm:gap-8">
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                className="flex items-center gap-1.5 sm:gap-2 group"
              >
                <Music className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan logo-music-note" />
                <span className="font-display text-lg sm:text-2xl font-bold tracking-tight">
                  <span className="text-gradient">{t.brand}</span>
                </span>
              </a>

              <nav className="flex items-center gap-2.5 sm:gap-6">
                <a 
                  href="/sheets" 
                  onClick={(e) => { e.preventDefault(); navigate('/sheets'); }}
                  className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                    currentPath === '/sheets'
                      ? 'text-neon-cyan'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Sheets
                </a>
                <a 
                  href="/suggestions" 
                  onClick={(e) => { e.preventDefault(); navigate('/suggestions'); }}
                  className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                    currentPath === '/suggestions'
                      ? 'text-neon-cyan'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Suggestions
                </a>
              </nav>
            </div>

            {/* Right side - Theme + Language + Ko-fi support link */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Audio Preview Mute Toggle */}
              <button
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  playMuteSound(newMuted);
                }}
                className={`flex items-center justify-center p-1.5 sm:p-2 rounded-lg border transition-all duration-300 ${
                  !isMuted 
                    ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-neon-cyan-subtle' 
                    : 'bg-gray-100 border-gray-300 text-gray-600 dark:bg-dark-700/50 dark:border-dark-500/50 dark:text-gray-300 hover:text-neon-cyan hover:border-neon-cyan'
                }`}
                title={isMuted ? 'Unmute Audio Preview' : 'Mute Audio Preview'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 dark:bg-dark-700/50 dark:border-dark-500/50 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan hover:border-neon-cyan dark:hover:border-neon-cyan transition-all duration-300"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Language Dropdown */}
              <LanguageDropdown language={language} setLanguage={setLanguage} />

            </div>
          </div>
        </div>
      </header>

      {/* Conditionally render page content */}
      <main 
        style={{ 
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className={`transform ${transitioning ? 'opacity-0 translate-y-12 scale-96 blur-md [transform:rotateX(4deg)]' : 'opacity-100 translate-y-0 scale-100 blur-0 [transform:rotateX(0deg)]'}`}
      >
      {currentPath === '/' ? (
        <>
          {/* Hero */}
          <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 dark:bg-dark-700/50 dark:border-dark-500/50 mb-8 animate-float">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{t.badgeText}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                <span className="text-gray-900 dark:text-white">{t.tagline}</span>
                <br />
                <span className="text-gradient neon-text-cyan">{t.taglineHighlight}</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
                {t.subtitle}
                <br className="hidden sm:block" />
                <span className="text-neon-pink">{t.subtitleHighlight}</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <a 
                  href="/sheets" 
                  onClick={(e) => { e.preventDefault(); navigate('/sheets'); }}
                  className="btn-neon-solid min-w-[200px] flex items-center justify-center gap-2 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2"><Play className="w-5 h-5" />{t.browseSheets}</span>
                </a>
                <a 
                  href="#socials" 
                  onClick={(e) => {
                    if (currentPath !== '/') {
                      e.preventDefault();
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('socials')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className="btn-neon min-w-[200px] flex items-center justify-center gap-2"
                >
                  <Music className="w-5 h-5" />{t.followUs}
                </a>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
              <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-widest">{t.scrollToExplore}</span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-1">
                <div className="w-1.5 h-3 bg-neon-cyan rounded-full animate-bounce" />
              </div>
            </div>
          </section>

          {/* Sheet Music Grid (only first row = 3 songs) */}
          <section id="sheets" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-gray-900 dark:text-white">{t.popularArrangements}</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">{t.popularDesc}</p>
              </div>

              {/* Dynamic Song Grid mapping first 3 items from songs.ts */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                {songs.filter(song => !song.hidden).slice(0, 3).map((song) => {
                  const isPaymentsDisabled = globalPaymentsDisabled || song.paymentsDisabled;
                  return (
                    <div
                      key={song.id}
                      className={`sheet-card ${song.difficulty === 'Original' ? 'sheet-card-alt' : ''}`}
                      onMouseEnter={() => handleCardMouseEnter(song)}
                      onMouseLeave={handleCardMouseLeave}
                    >
                      {/* Header visual - image or gradient background */}
                      <div 
                        onClick={() => !isPaymentsDisabled && handleDownloadClick(song)}
                        className={`relative w-full aspect-[3/4] overflow-hidden select-none ${isPaymentsDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {song.coverImage ? (
                          <img 
                            src={song.coverImage} 
                            alt={song.title} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div 
                            className="w-full h-full relative overflow-hidden bg-dark-950 dark:bg-dark-950" 
                            style={{
                              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(0, 245, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 45, 146, 0.08) 0%, transparent 50%)'
                            }}
                          >
                            {/* Ambient dark grid mesh */}
                            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        
                        {/* Audio Visualizer Overlay */}
                        <div className={`audio-visualizer-overlay ${playingSongId === song.id ? 'active' : ''}`}>
                          <div className="visualizer-bar" />
                          <div className="visualizer-bar" />
                          <div className="visualizer-bar" />
                          <div className="visualizer-bar" />
                        </div>
  
                        {/* Badges Container */}
                        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between">
                          {/* Difficulty Badge */}
                          <span className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/90 dark:bg-dark-900/80 backdrop-blur-sm text-[9px] sm:text-xs font-semibold border flex-shrink-0 ${
                            song.difficulty === 'Easy'
                              ? 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/5'
                              : 'text-purple-400 border-purple-500/40 bg-purple-500/5'
                          }`}>
                            {song.difficulty}
                          </span>

                          {/* Price Badge */}
                          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neon-cyan/15 dark:bg-neon-cyan/20 backdrop-blur-sm text-[9px] sm:text-xs font-bold text-neon-cyan border border-neon-cyan/45 shadow-neon-cyan-subtle flex-shrink-0">
                            {song.price}
                          </span>
                        </div>
                      </div>

                      {/* Product Info (Title, Artist, Format) */}
                      <div className="p-3 pb-0 select-text flex flex-col gap-0.5">
                        <h4 className="font-display font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                          {song.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          <span className="truncate">{song.artist}</span>
                          <span>•</span>
                          <span className="whitespace-nowrap font-medium text-neon-pink/80 dark:text-neon-pink/70">
                            {getSongFormat(song) === 'viral_part' ? 'Viral Part' : 'Full Arrangement'}
                          </span>
                        </div>
                      </div>
  
                      <div className="p-2 sm:p-4 bg-white/40 dark:bg-dark-900/40 border-t border-gray-100 dark:border-dark-700/50">
                        <button
                          onClick={() => !isPaymentsDisabled && handleDownloadClick(song)}
                          disabled={isPaymentsDisabled}
                          className={`kofi-download-btn w-full flex items-center justify-center gap-1 sm:gap-2 py-2 px-2.5 sm:py-2.5 sm:px-4 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm ${
                            isPaymentsDisabled
                              ? 'bg-gray-105/30 dark:bg-dark-800/30 border-gray-200 dark:border-dark-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                              : 'bg-gray-100/60 dark:bg-dark-600/50 border border-gray-300 dark:border-dark-500/50 text-gray-800 dark:text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/45 dark:hover:bg-dark-500/50 dark:hover:border-neon-cyan/45 cursor-pointer'
                          }`}
                        >
                          <ShoppingBag className={`w-3.5 h-3.5 sm:w-4 h-4 ${isPaymentsDisabled ? 'text-gray-400 dark:text-gray-500' : 'text-neon-pink dark:text-neon-pink/80'}`} />
                          {isPaymentsDisabled ? t.currentlyDisabled : t.downloadSheets}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-12">
                <button 
                  onClick={() => navigate('/sheets')}
                  className="btn-neon px-8 py-3 inline-block cursor-pointer bg-transparent"
                >
                  {t.viewAll}
                </button>
              </div>
            </div>
          </section>

          {/* Social CTA */}
          <section id="socials" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-gray-900 dark:text-white">{t.joinCommunity}</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">{t.communityDesc}</p>
              </div>

              {/* Social Grid - Dynamically mapping all 6 configured platforms */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {configPlatforms.map((platform) => {
                  const Icon = getPlatformIcon(platform.name);
                  return (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-btn social-btn-${platform.name.toLowerCase()} w-full`}
                    >
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{platform.name}</span>
                        <span className="text-gray-400 text-xs">{platform.handle}</span>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Stats Section with dynamic Total Followers calculation */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 pt-16 border-t border-gray-200 dark:border-dark-600/50">
                <div className="text-center">
                  <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {liveFollowers}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{t.statsFollowers}</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-2">{formattedTotalSheets}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{t.statsSheets}</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-2">{liveCustomers}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{t.statsCustomers}</div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : currentPath === '/sheets' ? (
        /* Render All Sheets Catalog Page */
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[75vh]">
          <div className="max-w-7xl mx-auto">
            {/* Title & Description */}
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-top-3 duration-300">
                <span className="text-gradient neon-text-cyan">
                  {language === 'de' ? 'Alle Arrangements' : language === 'fr' ? 'Tous les Arrangements' : 'All Arrangements'}
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                {language === 'de' ? 'Entdecke unseren gesamten Katalog an Premium-Klaviernoten und Lernpaketen.' : 'Explore our full catalog of premium piano sheets and learning packages.'}
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-12 bg-white/70 border border-gray-200 dark:bg-dark-800/40 dark:border-dark-600/40 p-4 rounded-xl backdrop-blur-md">
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder={language === 'de' ? 'Suche nach Liedern oder Künstlern...' : 'Search songs or artists...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 dark:bg-dark-800 dark:border-dark-600 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/40 focus:border-neon-cyan dark:focus:border-neon-cyan transition-[border-color,box-shadow] duration-300"
                />
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filters Container */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
                {/* Difficulty Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{language === 'de' ? 'Schwierigkeit:' : 'Difficulty:'}</span>
                  <div className="flex bg-white dark:bg-dark-900/60 p-1 rounded-lg border border-gray-200 dark:border-dark-500/50">
                    {['All', 'Original', 'Easy'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficultyFilter(diff)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-300 cursor-pointer ${
                          difficultyFilter === diff
                            ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Format:</span>
                  <div className="flex bg-white dark:bg-dark-900/60 p-1 rounded-lg border border-gray-200 dark:border-dark-500/50">
                    {['All', 'Viral Part', 'Full Arrangement'].map((form) => (
                      <button
                        key={form}
                        onClick={() => setFormatFilter(form as any)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                          formatFilter === form
                            ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent'
                        }`}
                      >
                        {form === 'All' ? 'All' : form === 'Viral Part' ? 'Viral Part' : 'Full Arrangement'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Song Cards Grid */}
            {filteredSongs.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                {filteredSongs.map((song) => {
                  const isPaymentsDisabled = globalPaymentsDisabled || song.paymentsDisabled;
                  return (
                    <div
                      key={song.id}
                      className={`sheet-card ${song.difficulty === 'Original' ? 'sheet-card-alt' : ''}`}
                      onMouseEnter={() => handleCardMouseEnter(song)}
                      onMouseLeave={handleCardMouseLeave}
                    >
                      {/* Header visual - image or gradient background */}
                      <div 
                        onClick={() => !isPaymentsDisabled && handleDownloadClick(song)}
                        className={`relative w-full aspect-[3/4] overflow-hidden select-none ${isPaymentsDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {song.coverImage ? (
                          <img 
                            src={song.coverImage} 
                            alt={song.title} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div 
                            className="w-full h-full relative overflow-hidden bg-dark-950 dark:bg-dark-950" 
                            style={{
                              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(0, 245, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 45, 146, 0.08) 0%, transparent 50%)'
                            }}
                          >
                            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
  
                        {/* Audio Visualizer Overlay */}
                        <div className={`audio-visualizer-overlay ${playingSongId === song.id ? 'active' : ''}`}>
                          <div className="visualizer-bar" />
                          <div className="visualizer-bar" />
                          <div className="visualizer-bar" />
                          <div className="visualizer-bar" />
                        </div>
  
                        {/* Badges Container */}
                        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between">
                          {/* Difficulty Badge */}
                          <span className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/90 dark:bg-dark-900/80 backdrop-blur-sm text-[9px] sm:text-xs font-semibold border flex-shrink-0 ${
                            song.difficulty === 'Easy'
                              ? 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/5'
                              : 'text-purple-400 border-purple-500/40 bg-purple-500/5'
                          }`}>
                            {song.difficulty}
                          </span>

                          {/* Price Badge */}
                          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neon-cyan/15 dark:bg-neon-cyan/20 backdrop-blur-sm text-[9px] sm:text-xs font-bold text-neon-cyan border border-neon-cyan/45 shadow-neon-cyan-subtle flex-shrink-0">
                            {song.price}
                          </span>
                        </div>
                      </div>

                      {/* Product Info (Title, Artist, Format) */}
                      <div className="p-3 pb-0 select-text flex flex-col gap-0.5">
                        <h4 className="font-display font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                          {song.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          <span className="truncate">{song.artist}</span>
                          <span>•</span>
                          <span className="whitespace-nowrap font-medium text-neon-pink/80 dark:text-neon-pink/70">
                            {getSongFormat(song) === 'viral_part' ? 'Viral Part' : 'Full Arrangement'}
                          </span>
                        </div>
                      </div>
  
                      <div className="p-2 sm:p-4 bg-white/40 dark:bg-dark-900/40 border-t border-gray-100 dark:border-dark-700/50">
                        <button
                          onClick={() => !isPaymentsDisabled && handleDownloadClick(song)}
                          disabled={isPaymentsDisabled}
                          className={`kofi-download-btn w-full flex items-center justify-center gap-1 sm:gap-2 py-2 px-2.5 sm:py-2.5 sm:px-4 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm ${
                            isPaymentsDisabled
                              ? 'bg-gray-105/30 dark:bg-dark-800/30 border-gray-200 dark:border-dark-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                              : 'bg-gray-100/60 dark:bg-dark-600/50 border border-gray-300 dark:border-dark-500/50 text-gray-800 dark:text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/45 dark:hover:bg-dark-500/50 dark:hover:border-neon-cyan/45 cursor-pointer'
                          }`}
                        >
                          <ShoppingBag className={`w-3.5 h-3.5 sm:w-4 h-4 ${isPaymentsDisabled ? 'text-gray-400 dark:text-gray-500' : 'text-neon-pink dark:text-neon-pink/80'}`} />
                          {isPaymentsDisabled ? t.currentlyDisabled : t.downloadSheets}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="max-w-2xl mx-auto mt-16 p-6 sm:p-8 rounded-2xl border border-gray-200/80 bg-white/40 dark:border-dark-600/30 dark:bg-dark-800/20 text-center backdrop-blur-md">
                <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'de' 
                    ? 'Suchst du ein Stück aus meinen Videos, das noch nicht hier ist?' 
                    : 'Looking for a piece from my videos that isn\'t here yet?'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed max-w-lg mx-auto">
                  {language === 'de'
                    ? 'Ich migriere derzeit meinen gesamten Katalog auf diese neue Plattform. Wenn der gewünschte Song fehlt, klicke einfach auf den Button unten und schlage ihn mir vor. Ich werde den Upload priorisieren!'
                    : 'I am currently migrating my entire catalog to this new platform. If the song you want is missing, just click the button below to suggest it, and I will prioritize uploading it for you!'}
                </p>
                <button 
                  onClick={() => navigate('/suggestions')}
                  className="btn-neon px-6 py-2.5 inline-flex items-center gap-2 cursor-pointer bg-transparent text-sm"
                >
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                  <span>{language === 'de' ? 'Song vorschlagen' : 'Suggest Song'}</span>
                </button>
              </div>
            </>
            ) : (
              <div className="max-w-2xl mx-auto py-12 p-6 sm:p-8 rounded-2xl border border-dark-600/30 bg-dark-800/20 text-center backdrop-blur-md animate-in fade-in duration-300">
                <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'de' 
                    ? 'Suchst du ein Stück aus meinen Videos, das noch nicht hier ist?' 
                    : 'Looking for a piece from my videos that isn\'t here yet?'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed max-w-lg mx-auto">
                  {language === 'de'
                    ? 'Ich migriere derzeit meinen gesamten Katalog auf diese neue Plattform. Wenn der gewünschte Song fehlt, klicke einfach auf den Button unten und schlage ihn mir vor. Ich werde den Upload priorisieren!'
                    : 'I am currently migrating my entire catalog to this new platform. If the song you want is missing, just click the button below to suggest it, and I will prioritize uploading it for you!'}
                </p>
                <button 
                  onClick={() => navigate('/suggestions')}
                  className="btn-neon px-6 py-2.5 inline-flex items-center gap-2 cursor-pointer bg-transparent text-sm"
                >
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                  <span>{language === 'de' ? 'Song vorschlagen' : 'Suggest Song'}</span>
                </button>
              </div>
            )}
          </div>
        </section>
      ) : currentPath === '/imprint' ? (
        <Impressum onBack={() => navigate('/')} language={language} />
      ) : currentPath === '/privacy' ? (
        <Datenschutz onBack={() => navigate('/')} language={language} />
      ) : currentPath === '/terms' ? (
        <Terms onBack={() => navigate('/')} language={language} />
      ) : currentPath === '/refunds' ? (
        <Refunds onBack={() => navigate('/')} language={language} />
      ) : currentPath === '/suggestions' ? (
        <Suggestions onBack={() => navigate('/')} language={language} showToast={showToast} />
      ) : currentPath === '/success' ? (
        <Success onBack={() => navigate('/')} language={language} showToast={showToast} />
      ) : currentPath.startsWith('/order/') ? (
        <OrderDetails onBack={() => navigate('/')} language={language} showToast={showToast} hash={currentPath.substring('/order/'.length)} />
      ) : null}
      </main>


      {/* Footer */}
      <footer className="relative border-t border-gray-200 dark:border-dark-600/50 bg-white/80 dark:bg-dark-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col gap-8">
            {/* Top row - Logo + Socials */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                className="flex items-center gap-2"
              >
                <Music className="w-5 h-5 text-neon-cyan" />
                <span className="font-display text-xl font-bold text-gradient">{t.brand}</span>
              </a>
            </div>

            {/* Bottom row - Copyright + Legal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-dark-700">
              <p className="text-gray-500 dark:text-gray-500 text-sm text-center sm:text-left">
                &copy; {new Date().getFullYear()} {t.brand}. {t.copyright}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
                <a 
                  href="/suggestions" 
                  onClick={(e) => { e.preventDefault(); navigate('/suggestions'); }}
                  className="link-underline text-gray-500 dark:text-gray-400 hover:text-neon-cyan transition-colors text-sm"
                >
                  Suggestions
                </a>
                <a 
                  href="/imprint" 
                  onClick={(e) => { e.preventDefault(); navigate('/imprint'); }}
                  className="link-underline text-gray-500 dark:text-gray-400 hover:text-neon-cyan transition-colors text-sm"
                >
                  {t.imprint}
                </a>
                <a 
                  href="/privacy" 
                  onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}
                  className="link-underline text-gray-500 dark:text-gray-400 hover:text-neon-cyan transition-colors text-sm"
                >
                  {t.privacy}
                </a>
                <a 
                  href="/terms" 
                  onClick={(e) => { e.preventDefault(); navigate('/terms'); }}
                  className="link-underline text-gray-500 dark:text-gray-400 hover:text-neon-cyan transition-colors text-sm"
                >
                  {t.terms}
                </a>
                <a 
                  href="/refunds" 
                  onClick={(e) => { e.preventDefault(); navigate('/refunds'); }}
                  className="link-underline text-gray-500 dark:text-gray-400 hover:text-neon-cyan transition-colors text-sm"
                >
                  {t.refunds}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Paddle Payment Overlay Modal */}
      {selectedSong && (
        <PaddleModal 
          isOpen={isKofiModalOpen}
          onClose={() => setIsKofiModalOpen(false)}
          kofiId={selectedSong.kofiId}
          songTitle={selectedSong.title}
          songArtist={selectedSong.artist}
          language={language}
          format={getSongFormat(selectedSong)}
          difficulty={selectedSong.difficulty}
        />
      )}

      {/* Elegant Cyberpunk Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300 border border-neon-cyan/40 bg-white/80 dark:bg-dark-900/90 text-gray-800 dark:text-white px-5 py-3 rounded-xl shadow-neon-cyan-subtle flex items-center gap-3 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
