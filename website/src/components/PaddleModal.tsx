import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ShieldCheck, Download, Music, Tv, FileText, Play, Sparkles, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface PaddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  kofiId: string;
  songTitle: string;
  songArtist: string;
  language: string;
  format?: 'viral_part' | 'full_arrangement';
  difficulty?: 'Easy' | 'Original';
  videoPreviewUrl?: string;
}

const translations = {
  en: {
    checkoutGate: 'Secure Checkout Gate',
    title: 'Unlock Sheet Music & Practice Assets',
    included: 'Included in this learning bundle:',
    pdfTitle: 'Complete sheet music (PDF)',
    pdfDesc: 'Accurately transcribed piano sheets for printing or tablets.',
    midiTitle: 'High-Quality MIDI Files (Normal + Slow)',
    midiDesc: 'Load the MIDIs into Synthesia, your DAW, or your digital piano.',
    videoTitle: '2K HD Practice Videos',
    videoDesc: 'Includes the original performance and a slowed-down version with a metronome track for easy practicing.',
    buttonPay: 'Secure Payment with Paddle',
    buttonOpening: 'Opening secure checkout...',
    errorLoad: 'The payment system could not be loaded. Please disable your adblocker and try again.',
    encrypted: 'Payments are securely processed by Paddle. Instant download access after checkout.',
    secureSsl: 'Secure SSL Connection',
    merchantOfRecord: 'Merchant of Record: Paddle',
  },
  de: {
    checkoutGate: 'Sicherer Checkout',
    title: 'Noten & Lernpakete freischalten',
    included: 'In diesem Lernpaket enthalten:',
    pdfTitle: 'Vollständige Noten (PDF)',
    pdfDesc: 'Präzise transkribierte Klaviernoten zum Ausdrucken oder für Tablets.',
    midiTitle: 'High-Quality MIDI-Dateien (Normal + Langsam)',
    midiDesc: 'Lade die MIDIs in Synthesia, deine DAW oder dein Digitalpiano.',
    videoTitle: '2K HD Übungsvideos',
    videoDesc: 'Enthält die Originalversion und eine verlangsamte Version mit Metronom-Spur zum einfachen Üben.',
    buttonPay: 'Sicher bezahlen mit Paddle',
    buttonOpening: 'Öffne sicheren Checkout...',
    errorLoad: 'Das Zahlungssystem konnte nicht geladen werden. Bitte deaktiviere deinen Werbeblocker und versuche es erneut.',
    encrypted: 'Zahlungsabwicklung erfolgt verschlüsselt über Paddle. Sofortiger Download-Zugriff nach Kaufabschluss.',
    secureSsl: 'Sichere SSL-Verbindung',
    merchantOfRecord: 'Zahlungsabwickler: Paddle',
  },
  fr: {
    checkoutGate: 'Paiement Sécurisé',
    title: 'Débloquer les partitions et ressources',
    included: 'Inclus dans ce pack d\'apprentissage :',
    pdfTitle: 'Partitions complètes (PDF)',
    pdfDesc: 'Partitions de piano précisément transcrites pour impression ou tablettes.',
    midiTitle: 'Fichiers MIDI haute qualité (Normal + Lent)',
    midiDesc: 'Chargez les fichiers MIDI dans Synthesia, votre DAW ou votre piano numérique.',
    videoTitle: 'Vidéos de pratique 2K HD',
    videoDesc: 'Comprend la performance originale et une version ralentie avec une piste de métronome pour s\'entraîner facilement.',
    buttonPay: 'Paiement sécurisé avec Paddle',
    buttonOpening: 'Ouverture du paiement sécurisé...',
    errorLoad: 'Le système de paiement n\'a pas pu être chargé. Veuillez désactiver votre bloqueur de publicité et réessayer.',
    encrypted: 'Les paiements sont traités de manière sécurisée par Paddle. Accès instantané au téléchargement après l\'achat.',
    secureSsl: 'Connexion SSL sécurisée',
    merchantOfRecord: 'Commerçant officiel : Paddle',
  },
  es: {
    checkoutGate: 'Pago Seguro',
    title: 'Desbloquear partituras y recursos',
    included: 'Incluido en este paquete de aprendizaje:',
    pdfTitle: 'Partituras completas (PDF)',
    pdfDesc: 'Partituras de piano transcritas con precisión para imprimir o usar en tabletas.',
    midiTitle: 'Archivos MIDI de alta calidad (Normal + Lento)',
    midiDesc: 'Carga los MIDIs en Synthesia, tu DAW o tu piano digital.',
    videoTitle: 'Videos de práctica 2K HD',
    videoDesc: 'Incluye la interpretación original y una versión más lenta con pista de metrónomo para practicar fácilmente.',
    buttonPay: 'Pago seguro con Paddle',
    buttonOpening: 'Abriendo pago seguro...',
    errorLoad: 'No se pudo cargar el sistema de pago. Desactiva tu bloqueador de anuncios e inténtalo de nuevo.',
    encrypted: 'Los pagos se procesan de forma segura a través de Paddle. Acceso de descarga instantánea tras la compra.',
    secureSsl: 'Conexión SSL segura',
    merchantOfRecord: 'Comerciante registrado: Paddle',
  },
  it: {
    checkoutGate: 'Pagamento Sicuro',
    title: 'Sblocca gli spartiti e le risorse',
    included: 'Incluso in questo pacchetto di apprendimento:',
    pdfTitle: 'Spartiti completi (PDF)',
    pdfDesc: 'Spartiti per pianoforte trascritti con precisione per la stampa o tablet.',
    midiTitle: 'File MIDI di alta qualità (Normale + Lento)',
    midiDesc: 'Carica i MIDI in Synthesia, nella tua DAW o sul tuo pianoforte digitale.',
    videoTitle: 'Video di pratica 2K HD',
    videoDesc: 'Include l\'esecuzione originale e una versione rallentata con traccia metronomo per esercitarsi facilmente.',
    buttonPay: 'Pagamento sicuro con Paddle',
    buttonOpening: 'Apertura del pagamento sicuro...',
    errorLoad: 'Il sistema di pagamento non può essere caricato. Disattiva il blocco degli annunci e riprova.',
    encrypted: 'I pagamenti sono elaborati in modo sicuro da Paddle. Accesso immediato al download dopo l\'acquisto.',
    secureSsl: 'Connessione SSL sicura',
    merchantOfRecord: 'Commerciante registrato: Paddle',
  }
};

export default function PaddleModal({ isOpen, onClose, kofiId, songTitle, songArtist, language, format = 'full_arrangement', difficulty = 'Original', videoPreviewUrl }: PaddleModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isCheckoutLoaded, setIsCheckoutLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [controlsVisible, setControlsVisible] = useState(true);
  const mouseMoveTimeout = useRef<number | null>(null);

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (mouseMoveTimeout.current) {
      window.clearTimeout(mouseMoveTimeout.current);
    }
    mouseMoveTimeout.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 2000);
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      setShowLightbox(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mouseMoveTimeout.current) {
        window.clearTimeout(mouseMoveTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (showLightbox) {
        videoRef.current.play().catch(err => {
          console.warn("[Player] Autoplay failed:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [showLightbox]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleSeek = (val: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOpen && songTitle) {
      setLoadingVideo(true);
      if (videoPreviewUrl) {
        setVideoUrl(videoPreviewUrl);
        setLoadingVideo(false);
      } else {
        const cleanTitle = songTitle.replace(" (Easy Version)", "").replace(" (Easy)", "").trim();
        const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:8787'
          : 'https://api.meloscribe.dev';
           
        setVideoUrl(`${apiBaseUrl}/api/public/video-stream?song_name=${encodeURIComponent(cleanTitle)}`);
        setLoadingVideo(false);
      }
    }
  }, [isOpen, songTitle, videoPreviewUrl]);

  useEffect(() => {
    if (!isOpen) {
      setIsCheckoutLoaded(false);
    }
  }, [isOpen, kofiId]);

  const activeLang = (['en', 'de', 'fr', 'es', 'it'].includes(language) ? language : 'en') as keyof typeof translations;
  const t = translations[activeLang];

  const generateSecureHash = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    if (isOpen && kofiId && kofiId.startsWith("pri_")) {
      const timer = setTimeout(() => {
        const paddle = (window as any).Paddle;
        if (typeof paddle !== 'undefined') {
          console.log("[Paddle] Loading inline checkout for price:", kofiId);
          
          const isDark = document.body.classList.contains('dark') || 
                         document.documentElement.classList.contains('dark') ||
                         document.body.classList.contains('dark-mode');
          const currentTheme = isDark ? 'dark' : 'light';
          
          const downloadHash = generateSecureHash();

          paddle.Update({
            eventCallback: function(data: any) {
              console.log("[Paddle Event]:", data.name, data);
              if (data.name === 'checkout.loaded' || data.name === 'checkout.rendered') {
                setIsCheckoutLoaded(true);
                if (window.innerWidth < 768) {
                  setTimeout(() => {
                    const frame = document.getElementById('paddle-checkout-frame');
                    if (frame) {
                      frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 200);
                }
              }
              if (data.name === 'checkout.completed') {
                console.log("[Paddle Completed]:", data);
                const transactionId = data.data?.transaction_id || data.data?.id || '';
                if (transactionId) {
                  window.location.href = `/success?checkout_id=${transactionId}`;
                }
              }
              if (data.name === 'checkout.error' || data.name === 'checkout.warning') {
                const errMsg = data.data?.error?.message || data.error?.message || JSON.stringify(data);
                alert("[Paddle Error]: " + errMsg);
              }
            }
          });
          
          paddle.Checkout.open({
            settings: {
              displayMode: 'inline',
              frameTarget: 'paddle-checkout-frame',
              frameInitialHeight: '480',
              theme: currentTheme,
              locale: activeLang,
              successUrl: `${window.location.origin}/success?checkout_id={checkout_id}`
            },
            items: [
              {
                priceId: kofiId,
                quantity: 1
              }
            ],
            customData: {
              song_title: songTitle,
              song_artist: songArtist,
              download_hash: downloadHash
            }
          });
        }
      }, 400);
      return () => {
        clearTimeout(timer);
        const paddle = (window as any).Paddle;
        if (typeof paddle !== 'undefined' && paddle.Checkout) {
          try {
            paddle.Checkout.close();
            console.log("[Paddle] Cleaned up inline checkout");
          } catch (e) {
            console.warn("[Paddle] Error closing checkout:", e);
          }
        }
      };
    }
  }, [isOpen, kofiId, activeLang, songTitle, songArtist]);

  const isCondensed = format === 'viral_part';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <style dangerouslySetInnerHTML={{ __html: `
        .paddle-frame,
        .paddle-frame-inline,
        #paddle-checkout-frame iframe {
          position: relative !important;
          left: auto !important;
          top: auto !important;
          width: calc(100% + 24px) !important;
          margin-right: -24px !important;
          height: 650px !important;
          border: none !important;
          background: transparent !important;
          overflow: hidden !important;
          scrollbar-width: none !important;
        }
        #paddle-checkout-frame {
          width: 100% !important;
          overflow: hidden !important;
          scrollbar-width: none !important;
        }
        #paddle-checkout-frame iframe::-webkit-scrollbar,
        #paddle-checkout-frame::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      ` }} />
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl md:max-w-4xl bg-white dark:bg-dark-900/95 border border-gray-200 dark:border-dark-600/50 rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] md:max-h-[95vh]">
        
        {/* Glow Orb in Modal */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-cyan/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-neon-pink/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-dark-600/50 relative z-10">
          <div>
            <span className="text-xs font-semibold text-neon-cyan tracking-wider uppercase">{t.checkoutGate}</span>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mt-0.5">
              {t.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-500/50 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:border-neon-pink/50 dark:hover:shadow-neon-pink-subtle transition-all duration-300 focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Grid Layout */}
        <div className="p-6 overflow-y-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 flex-1">
          {/* Left Column: Song Details & Included features */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-start">
            {/* Song Overview Card */}
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-200/80 dark:bg-dark-800/60 dark:border-dark-500/40 p-4 rounded-xl">
              <div 
                onClick={() => videoUrl && setShowLightbox(true)}
                className={`w-16 h-16 rounded-lg bg-gray-100 dark:bg-dark-950 flex-shrink-0 relative overflow-hidden border border-gray-200 dark:border-dark-500/30 flex items-center justify-center ${videoUrl ? 'cursor-pointer group/thumb' : ''}`}
              >
                <img 
                  src={`/covers/${songTitle.replace(" (All Parts)", "").replace(" (Part 1)", "").replace(" (Part 2)", "")}.jpg`}
                  alt={songTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {videoUrl && (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center transition-all duration-300 hover:bg-black/55">
                    <Play className="w-7 h-7 text-neon-cyan fill-neon-cyan/20 animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white truncate">{songTitle}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{songArtist}</p>
              </div>
            </div>

            {/* Format Info Banner */}
            <div className={`p-3.5 rounded-xl border text-sm flex items-start gap-2.5 ${
              isCondensed 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 dark:bg-amber-500/5 dark:border-amber-500/10' 
                : 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan dark:bg-neon-cyan/5 dark:border-neon-cyan/10'
            }`}>
              <div className="mt-0.5 text-base flex-shrink-0">
                {isCondensed ? '🎬' : '✨'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {isCondensed 
                    ? (language === 'de' ? 'Viral Part' : 'Viral Part')
                    : (language === 'de' ? 'Vollständiges Arrangement' : 'Full Arrangement')}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {isCondensed
                    ? (language === 'de' 
                        ? 'Dieses Lernpaket beinhaltet NUR den viralen Teil des Songs wie im Video gezeigt. Es enthält NICHT den kompletten Song.' 
                        : 'This learning package contains ONLY the viral section of the song as shown in the video. It does NOT contain the full song.')
                    : (language === 'de'
                        ? 'Dieses Lernpaket beinhaltet das vollständige Arrangement des Songs von Anfang bis Ende. (Hinweis: Das Vorschauvideo zeigt nur einen kurzen Ausschnitt des Arrangements.)'
                        : 'This learning package contains the complete arrangement of the song from start to finish. (Note: The preview video shows only a short section of the arrangement.)')}
                </p>
              </div>
            </div>

            {/* Included Features Checklist */}
            <div>
              <h5 className="text-xs font-semibold text-gray-550 dark:text-gray-400 uppercase tracking-wider mb-3">{t.included}</h5>
              <div className="space-y-3">
                {difficulty === 'Easy' && (
                  <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {language === 'de' ? 'Vereinfachte Version (Easy)' : 'Simplified Version (Easy)'}
                      </span>
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                        {language === 'de' 
                          ? 'Speziell für Anfänger arrangiert – leicht zu lernen, klingt trotzdem hervorragend.' 
                          : 'Specially arranged for beginners – easy to learn, yet sounds excellent.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-neon-cyan" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {isCondensed 
                        ? (language === 'de' ? 'Klaviernoten (PDF)' : 'Sheet music (PDF)') 
                        : t.pdfTitle}
                    </span>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                      {isCondensed 
                        ? (language === 'de' ? 'Präzise Klaviernoten des Song-Ausschnitts wie im Video.' : 'Precise piano sheets of the song section as shown in the video.') 
                        : t.pdfDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Music className="w-3.5 h-3.5 text-neon-pink" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {isCondensed 
                        ? (language === 'de' ? 'MIDI-Dateien (Normal + Langsam)' : 'MIDI Files (Normal + Slow)') 
                        : t.midiTitle}
                    </span>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                      {isCondensed 
                        ? (language === 'de' ? 'Lern-MIDIs des Song-Teils für Synthesia oder deine DAW.' : 'Practice MIDIs of the song section for Synthesia or your DAW.') 
                        : t.midiDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Tv className="w-3.5 h-3.5 text-neon-cyan" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {isCondensed 
                        ? (language === 'de' ? '2K HD Video-Tutorials' : '2K HD Video Tutorials') 
                        : t.videoTitle}
                    </span>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                      {isCondensed 
                        ? (language === 'de' ? 'Das Tutorial-Video offline in normalem & langsamem Tempo.' : 'The tutorial video offline in normal & slow speed.') 
                        : t.videoDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Separator on mobile only */}
          <div className="border-t border-gray-200 dark:border-dark-600/50 my-2 md:hidden" />

          {/* Right Column: Inline Paddle Checkout Frame */}
          <div className="md:col-span-7 border-t md:border-t-0 md:border-l border-gray-200 dark:border-dark-600/50 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center min-h-[480px]">
            <div className="relative min-h-[480px]">
              {/* Loading Spinner - hidden once loaded */}
              {!isCheckoutLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-dark-900/95 z-20 rounded-xl">
                  <Loader2 className="w-8 h-8 animate-spin text-neon-cyan mb-2" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.buttonOpening}</span>
                </div>
              )}
              
              <div 
                id="paddle-checkout-frame" 
                className={`paddle-checkout-frame w-full min-h-[480px] bg-transparent transition-opacity duration-300 ${isCheckoutLoaded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
              >
                {/* Paddle renders inline checkout frame here */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info Banner */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-600/50 bg-gray-50 dark:bg-dark-900/85 backdrop-blur-md flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 relative z-10">
          <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
            <ShieldCheck className="w-4 h-4 text-neon-cyan" /> {t.secureSsl}
          </span>
          <span className="text-gray-500 dark:text-gray-500">{t.merchantOfRecord}</span>
        </div>
      </div>

      {/* Lightbox Pop-up (Eagerly preloaded, shown/hidden with CSS opacity to keep buffer warm) */}
      {videoUrl && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl transition-all duration-300 ${
          showLightbox ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={handleClose}
          />
          <div 
            ref={videoContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setControlsVisible(false)}
            className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 z-10 group/player flex items-center justify-center transition-transform duration-300"
            style={{ transform: showLightbox ? 'scale(1)' : 'scale(0.95)' }}
          >
            {/* Eagerly preloaded video element */}
            <video 
              ref={videoRef}
              src={videoUrl}
              playsInline
              preload="auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onDurationChange={(e) => setDuration(e.currentTarget.duration)}
              onClick={togglePlay}
              className={`w-full h-full object-contain ${controlsVisible ? 'cursor-pointer' : 'cursor-none'}`}
            />

            {/* Floating Top-Right Close Button */}
            <button 
              onClick={handleClose}
              className={`absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-black/85 backdrop-blur-md transition-opacity duration-300 cursor-pointer ${
                controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Close preview"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Floating Top-Left Song Details banner */}
            <div className={`absolute top-4 left-4 z-30 pointer-events-none flex flex-col bg-black/60 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl transition-opacity duration-300 ${
              controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <span className="text-[9px] font-semibold text-neon-cyan tracking-wider uppercase">Video Preview</span>
              <h4 className="text-xs font-semibold text-white mt-0.5">{songTitle}</h4>
            </div>

            {/* Big Center Play/Pause button overlay */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full bg-dark-900/70 border border-dark-600/30 flex items-center justify-center text-white backdrop-blur-sm transform hover:scale-105 transition-all">
                  <Play className="w-8 h-8 fill-current ml-1 text-neon-cyan" />
                </div>
              </div>
            )}

            {/* Custom Themed Controller Bar */}
            <div 
              className={`absolute bottom-4 left-4 right-4 bg-dark-900/85 border border-dark-600/50 backdrop-blur-md px-4 py-3 rounded-xl flex flex-col gap-2 transition-opacity duration-300 z-20 ${
                controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Timeline row */}
              <div className="relative w-full group/slider h-2 flex items-center cursor-pointer select-none">
                <input 
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Track background */}
                <div className="w-full h-1 bg-gray-700/60 rounded-full group-hover/slider:h-1.5 transition-all" />
                {/* Neon gradient fill */}
                <div 
                  className="absolute left-0 h-1 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full group-hover/slider:h-1.5 transition-all pointer-events-none" 
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
                {/* Thumb indicator */}
                <div 
                  className="absolute w-3.5 h-3.5 bg-white rounded-full border-2 border-neon-pink shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none"
                  style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 7px)` }}
                />
              </div>

              {/* Buttons row */}
              <div className="flex items-center justify-between mt-1 select-none">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button 
                    onClick={togglePlay} 
                    className="text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none hover:scale-105"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  {/* Time Counter */}
                  <span className="text-xs font-mono text-gray-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Volume Mute toggle & Slider */}
                  <div className="flex items-center gap-1.5 group/volume">
                    <button 
                      onClick={toggleMute} 
                      className="text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none hover:scale-105"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input 
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setVolume(val);
                        if (videoRef.current) {
                          videoRef.current.volume = val;
                          videoRef.current.muted = val === 0;
                          setIsMuted(val === 0);
                        }
                      }}
                      className="w-0 group-hover/volume:w-16 focus-within/volume:w-16 h-1 bg-gray-500 rounded-full appearance-none cursor-pointer transition-all duration-300 accent-neon-cyan opacity-0 group-hover/volume:opacity-100 outline-none"
                    />
                  </div>

                  {/* Fullscreen toggle */}
                  <button 
                    onClick={toggleFullscreen} 
                    className="text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none hover:scale-105"
                    aria-label="Toggle fullscreen"
                  >
                    {isFullscreen ? <Minimize className="w-4.5 h-4.5" /> : <Maximize className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
