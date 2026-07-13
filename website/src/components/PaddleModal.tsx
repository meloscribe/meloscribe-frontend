import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ShieldCheck, Download, Music, Tv, FileText, Play, Sparkles, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface PaddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  stripePriceId: string;
  songTitle: string;
  songArtist: string;
  language: string;
  format?: 'viral_part' | 'full_arrangement';
  difficulty?: 'Easy' | 'Original';
  videoPreviewUrl?: string;
  price?: string | number;
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
    videoSegment: 'Preview Clip (Note: This is only a 60-second preview clip – the full purchase contains the complete arrangement)',
    
    // New translations
    viralPartTitle: 'Viral Part',
    fullArrangementTitle: 'Full Arrangement',
    viralPartDesc: 'Focused entirely on the main hook & chorus. Master the most popular section instantly without the long intro or outro.',
    fullArrangementDesc: 'This learning package contains the complete arrangement of the song from start to finish.',
    packageIncludes: 'Package Includes:',
    packageIncludesDesc: 'Piano Sheets (PDF) + MIDI Files (Normal/Slow) + HD Video Tutorials',
    freeDownloadTitle: 'Free Download',
    freeDownloadDesc: 'Choose the format you want to download immediately for free.',
    paySecurely: 'Pay Securely',
    redirectingStripe: 'Opening secure checkout...',
    checkoutSubtext: 'All files will be available for instant download immediately after payment.',
    easyTitle: 'Simplified Version (Easy)',
    easyDesc: 'Specially arranged for beginners – easy to learn, yet sounds excellent.',
    pdfCondensedTitle: 'Sheet music (PDF)',
    pdfCondensedDesc: 'Precise piano sheets of the song section as shown in the video.',
    midiCondensedTitle: 'MIDI Files (Normal + Slow)',
    midiCondensedDesc: 'Practice MIDIs of the song section for Synthesia or your DAW.',
    videoCondensedTitle: '2K HD Video Tutorials',
    videoCondensedDesc: 'The tutorial video offline in normal & slow speed.',
    
    // Free download button labels
    pdfFreeLabel: 'Sheet PDF',
    videoOriginalLabel: 'Video (Original Speed)',
    videoSlowLabel: 'Video (Slow Practice)',
    midiOriginalLabel: 'MIDI (Original Speed)',
    midiSlowLabel: 'MIDI (Slow Practice)',
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
    videoSegment: 'Ausschnitt-Vorschau (Hinweis: Dies ist nur ein 60-Sekunden-Ausschnitt – die Vollversion enthält das komplette Arrangement)',
    
    // New translations
    viralPartTitle: 'Viraler Part',
    fullArrangementTitle: 'Vollständiges Arrangement',
    viralPartDesc: 'Voller Fokus auf die wichtigste Passage (Hook & Refrain). Lerne die beliebteste Sektion sofort, ohne langes Intro oder Outro.',
    fullArrangementDesc: 'Dieses Lernpaket beinhaltet das vollständige Arrangement des Songs von Anfang bis Ende.',
    packageIncludes: 'Inbegriffen im Paket:',
    packageIncludesDesc: 'Klaviernoten (PDF) + MIDI-Dateien (Normal/Langsam) + HD-Video-Tutorials',
    freeDownloadTitle: 'Kostenloser Download',
    freeDownloadDesc: 'Wähle das gewünschte Format zum sofortigen, kostenlosen Herunterladen.',
    paySecurely: 'Jetzt sicher bezahlen',
    redirectingStripe: 'Öffne sicheren Checkout...',
    checkoutSubtext: 'Alle Dateien stehen direkt nach der Zahlung zum sofortigen Download bereit.',
    easyTitle: 'Vereinfachte Version (Easy)',
    easyDesc: 'Speziell für Anfänger arrangiert – leicht zu lernen, klingt trotzdem hervorragend.',
    pdfCondensedTitle: 'Klaviernoten (PDF)',
    pdfCondensedDesc: 'Präzise Klaviernoten des Song-Ausschnitts wie im Video.',
    midiCondensedTitle: 'MIDI-Dateien (Normal + Langsam)',
    midiCondensedDesc: 'Lern-MIDIs des Song-Teils für Synthesia oder deine DAW.',
    videoCondensedTitle: '2K HD Video-Tutorials',
    videoCondensedDesc: 'Das Tutorial-Video offline in normalem & langsamem Tempo.',
    
    // Free download button labels
    pdfFreeLabel: 'Klaviernoten (PDF)',
    videoOriginalLabel: 'Video (Originaltempo)',
    videoSlowLabel: 'Video (Langsam)',
    midiOriginalLabel: 'MIDI (Originaltempo)',
    midiSlowLabel: 'MIDI (Langsam)',
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
    videoSegment: 'Aperçu (Note : Ceci est seulement un extrait de 60 secondes – l\'arrangement complet est inclus après l\'achat)',
    
    // New translations
    viralPartTitle: 'Partie Virale',
    fullArrangementTitle: 'Arrangement Complet',
    viralPartDesc: 'Entièrement concentré sur le hook et le refrain principaux. Maîtrisez instantanément la section la plus populaire sans longue introduction ni conclusion.',
    fullArrangementDesc: 'Ce pack d\'apprentissage contient l\'arrangement complet de la chanson du début à la fin.',
    packageIncludes: 'Inclus dans le pack :',
    packageIncludesDesc: 'Partitions de piano (PDF) + Fichiers MIDI (Normal/Lent) + Tutoriels vidéo HD',
    freeDownloadTitle: 'Téléchargement Gratuit',
    freeDownloadDesc: 'Choisissez le format que vous souhaitez télécharger immédiatement et gratuitement.',
    paySecurely: 'Payer en toute sécurité',
    redirectingStripe: 'Redirection vers le paiement sécurisé...',
    checkoutSubtext: 'Tous les fichiers seront disponibles en téléchargement instantané immédiatement après le paiement.',
    easyTitle: 'Version Simplifiée (Easy)',
    easyDesc: 'Spécialement arrangé pour les débutants – facile à apprendre, tout en restant excellent.',
    pdfCondensedTitle: 'Partitions de piano (PDF)',
    pdfCondensedDesc: 'Partitions de piano précises de la section de la chanson comme indiqué dans la vidéo.',
    midiCondensedTitle: 'Fichiers MIDI (Normal + Lent)',
    midiCondensedDesc: 'Fichiers MIDI d\'entraînement pour Synthesia ou votre DAW.',
    videoCondensedTitle: 'Tutoriels Vidéo 2K HD',
    videoCondensedDesc: 'La vidéo du tutoriel hors ligne en vitesse normale et lente.',
    
    // Free download button labels
    pdfFreeLabel: 'Partition PDF',
    videoOriginalLabel: 'Vidéo (Vitesse Normale)',
    videoSlowLabel: 'Vidéo (Lente)',
    midiOriginalLabel: 'MIDI (Vitesse Normale)',
    midiSlowLabel: 'MIDI (Lent)',
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
    videoSegment: 'Vista previa (Nota: Esto es solo un fragmento de 60 segundos – la compra incluye el arreglo completo)',
    
    // New translations
    viralPartTitle: 'Parte Viral',
    fullArrangementTitle: 'Arreglo Completo',
    viralPartDesc: 'Centrado completamente en el hook y estribillo principal. Domina la sección más popular al instante sin largas introducciones ni finales.',
    fullArrangementDesc: 'Este paquete de aprendizaje contiene el arreglo completo de la canción de principio a fin.',
    packageIncludes: 'Incluido en el paquete:',
    packageIncludesDesc: 'Partituras de piano (PDF) + Archivos MIDI (Normal/Lento) + Tutoriales en video HD',
    freeDownloadTitle: 'Descarga Gratuita',
    freeDownloadDesc: 'Elige el formato que deseas descargar inmediatamente de forma gratuita.',
    paySecurely: 'Pagar de forma segura',
    redirectingStripe: 'Redirigiendo al pago seguro...',
    checkoutSubtext: 'Todos los archivos estarán disponibles para descarga instantánea inmediatamente después del pago.',
    easyTitle: 'Versión Simplificada (Easy)',
    easyDesc: 'Especialmente organizado para principiantes: fácil de aprender, pero suena excelente.',
    pdfCondensedTitle: 'Partituras de piano (PDF)',
    pdfCondensedDesc: 'Partituras de piano precisas de la sección de la canción como se muestra en el video.',
    midiCondensedTitle: 'Archivos MIDI (Normal + Lento)',
    midiCondensedDesc: 'MIDIs de práctica de la sección de la canción para Synthesia o tu DAW.',
    videoCondensedTitle: 'Tutoriales en Video 2K HD',
    videoCondensedDesc: 'El video tutorial sin conexión en velocidad normal y lenta.',
    
    // Free download button labels
    pdfFreeLabel: 'Partitura PDF',
    videoOriginalLabel: 'Video (Velocidad Normal)',
    videoSlowLabel: 'Video (Lento)',
    midiOriginalLabel: 'MIDI (Velocidad Normal)',
    midiSlowLabel: 'MIDI (Lento)',
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
    videoSegment: 'Anteprima (Nota: Questo è solo un estratto di 60 secondi – l\'acquisto include l\'arrangiamento completo)',
    
    // New translations
    viralPartTitle: 'Parte Virale',
    fullArrangementTitle: 'Arrangiamento Completo',
    viralPartDesc: 'Incentrato interamente sul gancio e sul ritornello principale. Impara subito la sezione più popolare senza lunghe introduzioni o finali.',
    fullArrangementDesc: 'Questo pacchetto di apprendimento contiene l\'arrangiamento completo della canzone dall\'inizio alla fine.',
    packageIncludes: 'Incluso nel pacchetto:',
    packageIncludesDesc: 'Spartiti per pianoforte (PDF) + File MIDI (Normale/Lento) + Video tutorial HD',
    freeDownloadTitle: 'Download Gratuito',
    freeDownloadDesc: 'Scegli il formato che desideri scaricare immediatamente gratuitamente.',
    paySecurely: 'Paga in sicurezza',
    redirectingStripe: 'Reindirizzamento al pagamento sicuro...',
    checkoutSubtext: 'Tutti i file saranno disponibili per il download istantaneo subito dopo il pagamento.',
    easyTitle: 'Versione Semplificata (Easy)',
    easyDesc: 'Ideato appositamente per i principianti: facile da imparare, ma con un suono eccellente.',
    pdfCondensedTitle: 'Spartiti per pianoforte (PDF)',
    pdfCondensedDesc: 'Spartiti accurati della sezione della canzone come mostrato nel video.',
    midiCondensedTitle: 'File MIDI (Normale + Lento)',
    midiCondensedDesc: 'MIDI per esercitarsi con la sezione del brano per Synthesia o DAW.',
    videoCondensedTitle: 'Video Tutorial 2K HD',
    videoCondensedDesc: 'Il video tutorial offline a velocità normale e rallentata.',
    
    // Free download button labels
    pdfFreeLabel: 'Spartito PDF',
    videoOriginalLabel: 'Video (Velocità Normale)',
    videoSlowLabel: 'Video (Lento)',
    midiOriginalLabel: 'MIDI (Velocità Normale)',
    midiSlowLabel: 'MIDI (Lento)',
  }
};

export default function PaddleModal({ isOpen, onClose, songId, stripePriceId, songTitle, songArtist, language, format = 'full_arrangement', difficulty = 'Original', videoPreviewUrl, price }: PaddleModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  const priceStr = String(price || '').trim().toLowerCase();
  const isFree = !priceStr || priceStr === '0' || priceStr.startsWith('0') || priceStr.includes('free') || priceStr.includes('0 €') || priceStr.includes('0$');

  const handleFreeDownload = async (type: string) => {
    setDownloadingType(type);
    try {
      const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8787'
        : 'https://api.meloscribe.dev';
      const targetUrl = `${apiBaseUrl}/api/public/download?song_id=${encodeURIComponent(songId)}&type=${encodeURIComponent(type)}`;
      const res = await fetch(targetUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.download_url) {
          const link = document.createElement('a');
          link.href = data.download_url;
          link.download = '';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert('Download link not received.');
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to request download link.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error requesting download link.');
    } finally {
      setDownloadingType(null);
    }
  };

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const activeLang = (['en', 'de', 'fr', 'es', 'it'].includes(language) ? language : 'en') as keyof typeof translations;
  const t = translations[activeLang];

  const handleStripeCheckout = async () => {
    setIsRedirecting(true);
    try {
      const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8787'
        : 'https://api.meloscribe.dev';
        
      const res = await fetch(`${apiBaseUrl}/api/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          songId: songId,
          format: format,
          difficulty: difficulty,
          language: language
        })
      });
      
      if (!res.ok) {
        throw new Error(await res.text() || 'Failed to create checkout session');
      }
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from backend');
      }
    } catch (e: any) {
      console.error("[Stripe Redirect Error]:", e);
      alert(language === 'de' 
        ? "Fehler beim Weiterleiten zu Stripe: " + e.message
        : "Failed to redirect to Stripe: " + e.message
      );
    }
    setIsRedirecting(false);
  };

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
        .modal-backdrop-blur {
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
        }
      ` }} />
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 modal-backdrop-blur transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl md:max-w-4xl bg-white dark:bg-dark-900/95 border border-gray-200 dark:border-dark-600/50 rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[92vh]">
        
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
        <div className="p-4 md:p-6 overflow-y-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 flex-1">
          
          {/* Mobile compact song header */}
          <div className="md:hidden flex items-center justify-between bg-gray-50 border border-gray-200/80 dark:bg-dark-800/60 dark:border-dark-500/40 p-3 rounded-xl w-full">
            <div className="flex items-center gap-3">
              <img 
                src={`/covers/${songTitle.replace(" (All Parts)", "").replace(" (Part 1)", "").replace(" (Part 2)", "")}.jpg`}
                alt={songTitle}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-dark-500/30"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{songTitle}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{songArtist}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              isCondensed 
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
            }`}>
              {isCondensed ? t.viralPartTitle : t.fullArrangementTitle}
            </span>
          </div>

          {/* Left Column: Song Details & Included features — hidden on mobile */}
          <div className="hidden md:flex md:col-span-5 space-y-4 md:space-y-6 flex-col justify-start">
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
                ✨
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {isCondensed ? t.viralPartTitle : t.fullArrangementTitle}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {isCondensed ? t.viralPartDesc : t.fullArrangementDesc}
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
                        {t.easyTitle}
                      </span>
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                        {t.easyDesc}
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
                      {isCondensed ? t.pdfCondensedTitle : t.pdfTitle}
                    </span>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                      {isCondensed ? t.pdfCondensedDesc : t.pdfDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Music className="w-3.5 h-3.5 text-neon-pink" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {isCondensed ? t.midiCondensedTitle : t.midiTitle}
                    </span>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                      {isCondensed ? t.midiCondensedDesc : t.midiDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Tv className="w-3.5 h-3.5 text-neon-cyan" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {isCondensed ? t.videoCondensedTitle : t.videoTitle}
                    </span>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                      {isCondensed ? t.videoCondensedDesc : t.videoDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Secure Checkout Action */}
          <div className="md:col-span-7 md:border-l border-gray-200 dark:border-dark-600/50 md:pl-8 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-5 md:gap-6 py-4 md:py-8">
              {isFree ? (
                <>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {t.freeDownloadTitle}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.freeDownloadDesc}
                    </p>
                  </div>

                  <div className="w-full space-y-3">
                    <button
                      onClick={() => handleFreeDownload('pdf')}
                      disabled={!!downloadingType}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold bg-gray-50 dark:bg-dark-800/40 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-600/50 hover:bg-neon-cyan/15 hover:border-neon-cyan transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neon-cyan" />
                        {t.pdfFreeLabel}
                      </span>
                      {downloadingType === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-gray-400" />}
                    </button>

                    <button
                      onClick={() => handleFreeDownload('video')}
                      disabled={!!downloadingType}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold bg-gray-50 dark:bg-dark-800/40 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-600/50 hover:bg-neon-cyan/15 hover:border-neon-cyan transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-neon-cyan" />
                        {t.videoOriginalLabel}
                      </span>
                      {downloadingType === 'video' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-gray-400" />}
                    </button>

                    <button
                      onClick={() => handleFreeDownload('video_slow')}
                      disabled={!!downloadingType}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold bg-gray-50 dark:bg-dark-800/40 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-600/50 hover:bg-neon-cyan/15 hover:border-neon-cyan transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-neon-cyan/80" />
                        {t.videoSlowLabel}
                      </span>
                      {downloadingType === 'video_slow' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-gray-400" />}
                    </button>

                    <button
                      onClick={() => handleFreeDownload('midi')}
                      disabled={!!downloadingType}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold bg-gray-50 dark:bg-dark-800/40 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-600/50 hover:bg-neon-pink/15 hover:border-neon-pink transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-neon-pink" />
                        {t.midiOriginalLabel}
                      </span>
                      {downloadingType === 'midi' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-gray-400" />}
                    </button>

                    <button
                      onClick={() => handleFreeDownload('midi_slow')}
                      disabled={!!downloadingType}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold bg-gray-50 dark:bg-dark-800/40 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-600/50 hover:bg-neon-pink/15 hover:border-neon-pink transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-neon-pink/80" />
                        {t.midiSlowLabel}
                      </span>
                      {downloadingType === 'midi_slow' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile Only: Compact Package Summary */}
                  <div className="md:hidden w-full text-center bg-gray-50 dark:bg-dark-800/40 border border-gray-200 dark:border-dark-600/50 p-3 rounded-xl text-sm leading-relaxed">
                    <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 uppercase tracking-wider">
                      {t.packageIncludes}
                    </p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                      {t.packageIncludesDesc}
                    </p>
                    <div className={`p-2.5 rounded-xl text-xs font-semibold text-left ${
                      isCondensed 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/15' 
                        : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/15'
                    }`}>
                      <p className="font-bold mb-1">
                        {isCondensed ? `✨ ${t.viralPartTitle}` : `✨ ${t.fullArrangementTitle}`}
                      </p>
                      <p className="text-[11px] font-normal leading-relaxed opacity-95">
                        {isCondensed ? t.viralPartDesc : t.fullArrangementDesc}
                      </p>
                    </div>
                  </div>

                  {/* Action Subtext */}
                  <div className="text-center w-full px-2 my-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.checkoutSubtext}
                    </p>
                  </div>

                  <button
                    onClick={handleStripeCheckout}
                    disabled={isRedirecting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-neon-cyan to-neon-pink text-white shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(255,45,146,0.5)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                  >
                    {isRedirecting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t.redirectingStripe}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>{t.paySecurely}</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info Banner */}
        <div className="hidden md:flex px-6 py-4 border-t border-gray-200 dark:border-dark-600/50 bg-gray-50 dark:bg-dark-900/85 backdrop-blur-md items-center justify-between text-xs text-gray-500 dark:text-gray-500 relative z-10">
          <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
            <ShieldCheck className="w-4 h-4 text-neon-cyan" /> {t.secureSsl}
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            {language === 'de' ? 'Zahlungsabwicklung durch Stripe' : 'Payments secured by Stripe'}
          </span>
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
              controlsList="nodownload nofullscreen"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onDurationChange={(e) => setDuration(e.currentTarget.duration)}
              onLoadStart={() => setLoadingVideo(true)}
              onWaiting={() => setLoadingVideo(true)}
              onPlaying={() => setLoadingVideo(false)}
              onCanPlay={() => setLoadingVideo(false)}
              onError={() => {
                // Video not available - clear URL to hide player and close lightbox
                console.warn(`[PaddleModal] Video preview not available for "${songTitle}"`);
                setVideoUrl(null);
                setShowLightbox(false);
                setLoadingVideo(false);
              }}
              onClick={togglePlay}
              className={`w-full h-full object-contain transition-opacity duration-100 ${controlsVisible ? 'cursor-pointer' : 'cursor-none'}`}
              style={{
                opacity: duration > 0 && (duration - currentTime) <= 1 
                  ? Math.max(0, duration - currentTime) 
                  : 1
              }}
            />

            {/* Premium Loader overlay for video buffering/loading */}
            {loadingVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px] z-20 pointer-events-none animate-fadeIn">
                <Loader2 className="w-9 h-9 text-neon-cyan animate-spin" />
              </div>
            )}

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
