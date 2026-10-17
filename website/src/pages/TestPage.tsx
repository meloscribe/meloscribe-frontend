import { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, Compass, ExternalLink, CheckCircle, Copy, AlertTriangle, ShieldCheck, Play, Sparkles } from 'lucide-react';
import { Song } from '../data/songs';

interface TestPageProps {
  onBack: () => void;
  language: string;
  allSongs: Song[];
  onSelectSong: (song: Song) => void;
}

export default function TestPage({ onBack, language, allSongs, onSelectSong }: TestPageProps) {
  const [userAgent, setUserAgent] = useState('');
  const [isTikTok, setIsTikTok] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isiOS, setIsiOS] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showIosBanner, setShowIosBanner] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      setUserAgent(ua);
      const isTT = ua.includes('musical_ly') || ua.includes('ByteLocale') || ua.toLowerCase().includes('tiktok');
      const isIG = ua.includes('Instagram') || ua.includes('FB_IAB') || ua.includes('FBAV');
      const android = /android/i.test(ua);
      const ios = /iphone|ipad|ipod/i.test(ua);

      setIsTikTok(isTT);
      setIsInstagram(isIG);
      setIsAndroid(android);
      setIsiOS(ios);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const experienceSong = allSongs.find(s => s.title.toLowerCase() === 'experience') || allSongs[0];

  const androidIntentUrl = "intent://meloscribesheets.com/test#Intent;scheme=https;package=com.android.chrome;end";
  const chromeDirectUrl = "googlechrome://meloscribesheets.com/test";

  return (
    <div className="min-h-screen bg-neon-gradient text-gray-800 dark:text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Top iOS IAB Hint Banner (Preview & Live) */}
      {(isTikTok || isInstagram || isiOS) && showIosBanner && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto bg-dark-900/95 border-2 border-neon-cyan text-white p-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Compass className="w-4 h-4 text-neon-cyan" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-sm text-neon-cyan flex items-center gap-1.5">
                  TikTok In-App Browser detected
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Für <strong>1-Klick Apple Pay & PayPal</strong>: Oben rechts auf <strong>•••</strong> tippen und <strong>„Im Browser öffnen“</strong> wählen.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIosBanner(false)}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-dark-800"
            >
              ✕
            </button>
          </div>
          {/* Animated visual pointer to the top right of the screen where TikTok's 3 dots are */}
          <div className="mt-2.5 pt-2 border-t border-dark-700/60 flex items-center justify-between text-[11px] text-gray-400">
            <span>Optionen: oben rechts</span>
            <span className="text-neon-cyan font-mono animate-bounce font-semibold">••• (oben) ↗</span>
          </div>
        </div>
      )}

      {/* Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-orb-cyan w-96 h-96 -top-48 -left-48 opacity-40" />
        <div className="glow-orb glow-orb-pink w-96 h-96 bottom-10 -right-48 opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-neon-cyan transition-colors mb-8 group focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'de' ? 'Zurück zum Shop' : 'Back to Shop'}</span>
        </button>

        {/* Header */}
        <div className="border-b border-gray-200 dark:border-dark-600/50 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Isolated In-App Browser Test Environment
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            <span className="text-gradient neon-text-cyan">TikTok In-App Browser Diagnostics</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Diese Testseite ist isoliert vom Haupt-Shop. Hier kannst du das Verhalten im TikTok In-App Browser live testen.
          </p>
        </div>

        {/* Live Diagnostics Card */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-gray-200 dark:border-dark-600/50 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Smartphone className="w-5 h-5 text-neon-cyan" /> 1. Aktuelle Browser-Erkennung
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className={`p-3 rounded-xl border ${isTikTok ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan font-bold' : 'bg-gray-100 dark:bg-dark-700/40 border-gray-200 dark:border-dark-600/50 text-gray-500'}`}>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">TikTok Browser</p>
              <p className="text-sm mt-0.5">{isTikTok ? 'JA (Aktiv)' : 'Nein'}</p>
            </div>

            <div className={`p-3 rounded-xl border ${isInstagram ? 'bg-neon-pink/15 border-neon-pink text-neon-pink font-bold' : 'bg-gray-100 dark:bg-dark-700/40 border-gray-200 dark:border-dark-600/50 text-gray-500'}`}>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Instagram / FB</p>
              <p className="text-sm mt-0.5">{isInstagram ? 'JA (Aktiv)' : 'Nein'}</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-100 dark:bg-dark-700/40 border border-gray-200 dark:border-dark-600/50">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Betriebssystem</p>
              <p className="text-sm mt-0.5 font-bold text-gray-900 dark:text-white">
                {isAndroid ? 'Android' : isiOS ? 'Apple iOS' : 'Desktop / Sonstiges'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-100 dark:bg-dark-700/40 border border-gray-200 dark:border-dark-600/50">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Breite</p>
              <p className="text-sm mt-0.5 font-mono text-gray-900 dark:text-white">
                {typeof window !== 'undefined' ? `${window.innerWidth}px` : '-'}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-dark-900/60 p-3 rounded-xl border border-gray-200 dark:border-dark-700 font-mono text-[11px] text-gray-600 dark:text-gray-400 break-all">
            <span className="text-gray-400 block mb-1 uppercase text-[9px] tracking-wider font-sans font-bold">User-Agent String:</span>
            {userAgent || 'Lade User-Agent...'}
          </div>
        </div>

        {/* Android Chrome Breakout Tests */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-gray-200 dark:border-dark-600/50 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 space-y-5">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <ExternalLink className="w-5 h-5 text-neon-pink" /> 2. Android Chrome Breakout Tests
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Auf Android kann der TikTok-Webview über native Intent-Schemata verlassen werden, sodass der echte Chrome-Browser startet:
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={androidIntentUrl}
              className="flex-1 py-3 px-4 rounded-xl bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold text-xs flex items-center justify-center gap-2 hover:bg-neon-cyan/30 transition-all text-center"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test 1: Chrome Intent Link</span>
            </a>

            <a
              href={chromeDirectUrl}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-500 text-gray-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:border-neon-cyan transition-all text-center"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test 2: googlechrome:// Scheme</span>
            </a>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Hinweis: Auf iOS (iPhone) wird dieser Intent von Apple ignoriert; dort greift der Floating-Banner oben mit dem Hinweis auf die 3 Punkte (•••).
          </p>
        </div>

        {/* Live Experience Checkout Modal Test */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-neon-cyan/30 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <ShieldCheck className="w-5 h-5 text-neon-cyan" /> 3. Live Modal & Seitenzahl-Test
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Stripe 200 OK
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Öffne das Noten-Modal für <strong>{experienceSong ? experienceSong.title : 'Experience'}</strong>, um die neue dynamische Seitenzahl-Anzeige (5 Seiten PDF) und das Stripe/PayPal-Formular direkt im TikTok In-App Browser zu testen:
          </p>

          {experienceSong && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-600">
              {experienceSong.coverImage && (
                <img src={experienceSong.coverImage} alt={experienceSong.title} className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{experienceSong.title}</h3>
                <p className="text-xs text-gray-500 truncate">{experienceSong.artist}</p>
                <p className="text-xs font-semibold text-neon-cyan mt-1">
                  Seitenzahl im Katalog: {experienceSong.pdfPages ? `${experienceSong.pdfPages} Seiten` : 'wird geladen...'}
                  {experienceSong.easyPdfPages ? ` (Easy: ${experienceSong.easyPdfPages} Seiten)` : ''}
                </p>
              </div>

              <button
                onClick={() => onSelectSong(experienceSong)}
                className="btn-neon-solid text-xs py-2 px-4 whitespace-nowrap flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Modal öffnen
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-500 text-xs font-semibold flex items-center gap-2 hover:border-neon-cyan transition-all"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link kopiert!' : 'Diesen Testlink kopieren'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
