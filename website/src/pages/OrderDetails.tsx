import { useEffect, useState } from 'react';
import { ArrowLeft, Download, Loader2, Music, ShieldCheck, FileText, Archive, Mail, AlertCircle, Info, Tv } from 'lucide-react';

interface OrderDetailsProps {
  onBack: () => void;
  language: string;
  showToast: (message: string) => void;
  hash: string;
}

interface OrderInfo {
  song_name: string;
  email: string;
  download_count: number;
  created_at?: string;
}

const translations = {
  en: {
    title: 'Your Music Bundle',
    subtitle: 'Access your sheet music and practice tools. Bookmark this page if you want to access it later.',
    invalidHash: 'Invalid or expired order link.',
    orderNotFound: 'Order details could not be found. Please contact support.',
    downloadLimitReached: 'You have reached the maximum download limit of 50 downloads for this package. Contact support for reset.',
    downloading: 'Preparing download...',
    downloadSuccess: 'Download started successfully!',
    loadingInfo: 'Loading order details...',
    downloadsUsed: 'Downloads used',
    purchasedOn: 'Purchased on',
    maxDownloads: 'of 50 downloads max',
    downloadPdf: 'Download Piano PDF',
    downloadPdfDesc: 'Sheet music optimized for print and tablet readers.',
    secureSsl: 'Secure SSL Connection',
    merchantOfRecord: 'Payments processed by Paddle',
    backHome: 'Back to Home',
    emailSubject: 'Reset Download Limit',
    supportLinkText: 'Email support',
    supportText: 'For security reasons, downloads are capped at 50 to prevent unauthorized link sharing.',
    limitWarningText: 'Limit reached? No stress. Message me at info@meloscribe.dev and I will get you unlocked.',
    emailBtnText: 'Email support',
    downloadPdfLabel: 'Download Sheet PDF',
    pdfTooltipText: 'The piano sheet music as a high-resolution PDF. Perfect for printing or tablet readers.',
    pdfBtnText: 'Download PDF',
    originalVideoLabel: 'Video Tutorial (Original Speed)',
    originalVideoTooltip: 'The 2K HD Keysight visualization video at full speed for offline reference.',
    originalVideoDesc: 'Tutorial video at full speed (2K HD MP4).',
    videoBtnText: 'Download Video',
    slowVideoLabel: 'Video Tutorial (Slow Practice Speed)',
    slowVideoTooltip: 'The Keysight visualization video at slow speed (with metronome) for easy offline practice.',
    slowVideoDesc: 'Tutorial video in slow tempo (2K HD MP4).',
    originalMidiLabel: 'MIDI (Original Speed)',
    originalMidiTooltip: 'The piano MIDI file at original speed. Load it into Synthesia, your DAW, or digital keyboard.',
    originalMidiDesc: 'Piano MIDI file in full speed.',
    midiBtnText: 'Download MIDI',
    slowMidiLabel: 'MIDI (Slow Practice Speed)',
    slowMidiTooltip: 'The piano MIDI file slowed down by 30% for easier practice of complex sections.',
    slowMidiDesc: 'Piano MIDI file at reduced speed.',
    errDownload: 'Error triggering download',
    errFailed: 'Download failed',
    errNetwork: 'Network error during download',
    accessDenied: 'Access Denied'
  },
  de: {
    title: 'Dein Lernpaket',
    subtitle: 'Greife auf deine Klaviernoten und Übungsdateien zu. Speichere diesen Link, um später wiederzukommen.',
    invalidHash: 'Ungültiger oder abgelaufener Bestell-Link.',
    orderNotFound: 'Bestell-Details wurden nicht gefunden. Bitte kontaktiere den Support.',
    downloadLimitReached: 'Du hast das maximale Download-Limit von 50 Klicks erreicht. Kontaktiere den Support für eine Freischaltung.',
    downloading: 'Bereite Download vor...',
    downloadSuccess: 'Download erfolgreich gestartet!',
    loadingInfo: 'Lade Bestell-Details...',
    downloadsUsed: 'Downloads verbraucht',
    purchasedOn: 'Gekauft am',
    maxDownloads: 'von maximal 50 Downloads',
    downloadPdf: 'Klaviernoten PDF laden',
    downloadPdfDesc: 'Noten optimiert zum Ausdrucken und für Tablets.',
    secureSsl: 'Sichere SSL-Verbindung',
    merchantOfRecord: 'Zahlungsabwickler: Paddle',
    backHome: 'Zurück zur Startseite',
    emailSubject: 'Freischaltung Download-Limit',
    supportLinkText: 'Support anschreiben',
    supportText: 'Aus Sicherheitsgründen gibt es maximal 50 Downloads, damit Links nicht missbräuchlich geteilt werden.',
    limitWarningText: 'Limit erreicht? Kein Stress. Schreib mir kurz an info@meloscribe.dev und ich schalte dich wieder frei.',
    emailBtnText: 'Support mailen',
    downloadPdfLabel: 'Noten (PDF) herunterladen',
    pdfTooltipText: 'Die Klaviernoten als hochauflösendes PDF. Perfekt zum Ausdrucken oder für den Tablet-Reader.',
    pdfBtnText: 'PDF laden',
    originalVideoLabel: 'Video-Tutorial (Originalgeschwindigkeit)',
    originalVideoTooltip: 'Das 2K HD Keysight Visualisierungsvideo in Originalgeschwindigkeit zum Mitspielen offline.',
    originalVideoDesc: 'Lernvideo in Originalgeschwindigkeit (2K HD MP4).',
    videoBtnText: 'Video laden',
    slowVideoLabel: 'Video-Tutorial (Verlangsamt zum Üben)',
    slowVideoTooltip: 'Das Keysight Visualisierungsvideo offline im langsamen Übungstempo (mit Metronom) zum einfachen Nachspielen.',
    slowVideoDesc: 'Lernvideo im langsamen Tempo (2K HD MP4).',
    originalMidiLabel: 'MIDI (Originalgeschwindigkeit)',
    originalMidiTooltip: 'Die Klavier-MIDI-Datei im originalen Tempo. Lade sie in Synthesia, deine DAW oder dein Keyboard.',
    originalMidiDesc: 'Klavier-MIDI-Datei im Originaltempo.',
    midiBtnText: 'MIDI laden',
    slowMidiLabel: 'MIDI (Verlangsamt zum Üben)',
    slowMidiTooltip: 'Die Klavier-MIDI-Datei um 30% verlangsamt zum einfacheren Lernen schwieriger Stellen.',
    slowMidiDesc: 'Klavier-MIDI-Datei im reduzierten Übungstempo.',
    errDownload: 'Fehler beim Herunterladen',
    errFailed: 'Download fehlgeschlagen',
    errNetwork: 'Netzwerkfehler beim Download',
    accessDenied: 'Fehler'
  },
  fr: {
    title: 'Votre Pack Musical',
    subtitle: 'Accédez à vos partitions et outils de pratique. Enregistrez cette page si vous souhaitez y accéder plus tard.',
    invalidHash: 'Lien de commande invalide ou expiré.',
    orderNotFound: 'Les détails de la commande n\'ont pas pu être trouvés. Veuillez contacter le support.',
    downloadLimitReached: 'Vous avez atteint la limite maximale de 50 téléchargements pour ce pack. Contactez le support pour la réinitialiser.',
    downloading: 'Préparation du téléchargement...',
    downloadSuccess: 'Téléchargement démarré avec succès !',
    loadingInfo: 'Chargement des détails de la commande...',
    downloadsUsed: 'Téléchargements utilisés',
    purchasedOn: 'Acheté le',
    maxDownloads: 'sur 50 téléchargements max',
    downloadPdf: 'Télécharger le PDF du Piano',
    downloadPdfDesc: 'Partition optimisée pour l\'impression et les tablettes.',
    secureSsl: 'Connexion SSL Sécurisée',
    merchantOfRecord: 'Paiements traités par Paddle',
    backHome: 'Retour à l\'accueil',
    emailSubject: 'Réinitialiser la limite de téléchargement',
    supportLinkText: 'Contacter le support',
    supportText: 'Pour des raisons de sécurité, les téléchargements sont limités à 50 afin d\'empêcher le partage non autorisé.',
    limitWarningText: 'Limite atteinte ? Pas de stress. Écrivez-moi à info@meloscribe.dev et je vous débloquerai.',
    emailBtnText: 'Envoyer un e-mail',
    downloadPdfLabel: 'Télécharger les partitions (PDF)',
    pdfTooltipText: 'Les partitions de piano au format PDF haute résolution. Parfait pour l\'impression ou les tablettes.',
    pdfBtnText: 'Télécharger le PDF',
    originalVideoLabel: 'Tutoriel vidéo (Vitesse originale)',
    originalVideoTooltip: 'La vidéo de visualisation Keysight en 2K HD à pleine vitesse pour référence hors ligne.',
    originalVideoDesc: 'Vidéo tutoriel à pleine vitesse (2K HD MP4).',
    videoBtnText: 'Télécharger la vidéo',
    slowVideoLabel: 'Tutoriel vidéo (Vitesse lente)',
    slowVideoTooltip: 'La vidéo de visualisation Keysight hors ligne à vitesse lente (avec métronome) pour une pratique facile.',
    slowVideoDesc: 'Vidéo tutoriel à vitesse lente (2K HD MP4).',
    originalMidiLabel: 'MIDI (Vitesse originale)',
    originalMidiTooltip: 'Le fichier MIDI pour piano à vitesse originale. Chargez-le dans Synthesia, votre DAW ou votre clavier.',
    originalMidiDesc: 'Fichier MIDI pour piano à pleine vitesse.',
    midiBtnText: 'Télécharger le MIDI',
    slowMidiLabel: 'MIDI (Vitesse lente)',
    slowMidiTooltip: 'Le fichier MIDI pour piano ralenti de 30% pour une pratique plus facile des sections complexes.',
    slowMidiDesc: 'Fichier MIDI pour piano à vitesse réduite.',
    errDownload: 'Erreur lors du téléchargement',
    errFailed: 'Téléchargement échoué',
    errNetwork: 'Erreur réseau lors du téléchargement',
    accessDenied: 'Accès refusé'
  },
  es: {
    title: 'Tu Paquete de Música',
    subtitle: 'Accede a tus partituras y herramientas de práctica. Guarda esta página si quieres acceder a ella más tarde.',
    invalidHash: 'Enlace de pedido no válido o caducado.',
    orderNotFound: 'No se pudieron encontrar los detalles del pedido. Por favor, póngase en contacto con el soporte.',
    downloadLimitReached: 'Ha alcanzado el límite máximo de 50 descargas para este paquete. Póngase en contacto con el soporte para restablecerlo.',
    downloading: 'Preparando descarga...',
    downloadSuccess: '¡Descarga iniciada con éxito!',
    loadingInfo: 'Cargando detalles del pedido...',
    downloadsUsed: 'Descargas utilizadas',
    purchasedOn: 'Comprado el',
    maxDownloads: 'de 50 descargas máx.',
    downloadPdf: 'Descargar PDF de Piano',
    downloadPdfDesc: 'Partitura optimizada para impresión y tabletas.',
    secureSsl: 'Conexión SSL Segura',
    merchantOfRecord: 'Pagos procesados por Paddle',
    backHome: 'Volver al inicio',
    emailSubject: 'Restablecer límite de descarga',
    supportLinkText: 'Contactar al soporte',
    supportText: 'Por razones de seguridad, las descargas están limitadas a 50 para evitar el uso compartido no autorizado.',
    limitWarningText: '¿Límite alcanzado? Sin estrés. Escríbeme a info@meloscribe.dev y te desbloquearé.',
    emailBtnText: 'Enviar correo',
    downloadPdfLabel: 'Descargar partitura (PDF)',
    pdfTooltipText: 'La partitura de piano como PDF de alta resolución. Perfecto para imprimir o lectores de tabletas.',
    pdfBtnText: 'Descargar PDF',
    originalVideoLabel: 'Video tutorial (Velocidad original)',
    originalVideoTooltip: 'El video de visualización de Keysight 2K HD a velocidad completa para referencia sin conexión.',
    originalVideoDesc: 'Video tutorial a velocidad completa (2K HD MP4).',
    videoBtnText: 'Descargar video',
    slowVideoLabel: 'Video tutorial (Velocidad de práctica lenta)',
    slowVideoTooltip: 'El video de visualización de Keysight sin conexión a velocidad lenta (con metrónomo) para practicar fácilmente.',
    slowVideoDesc: 'Video tutorial en ritmo lento (2K HD MP4).',
    originalMidiLabel: 'MIDI (Velocidad original)',
    originalMidiTooltip: 'El archivo MIDI de piano a velocidad original. Cárgalo en Synthesia, tu DAW o teclado digital.',
    originalMidiDesc: 'Archivo MIDI de piano a velocidad completa.',
    midiBtnText: 'Descargar MIDI',
    slowMidiLabel: 'MIDI (Velocidad de práctica lenta)',
    slowMidiTooltip: 'El archivo MIDI de piano ralentizado en un 30% para practicar fácilmente secciones complejas.',
    slowMidiDesc: 'Archivo MIDI de piano a velocidad reducida.',
    errDownload: 'Error al iniciar la descarga',
    errFailed: 'Descarga fallida',
    errNetwork: 'Error de red durante la descarga',
    accessDenied: 'Acceso denegado'
  },
  it: {
    title: 'Il tuo Pacchetto Musicale',
    subtitle: 'Accedi ai tuoi spartiti e strumenti di pratica. Salva questa pagina se desideri accedervi in seguito.',
    invalidHash: 'Link d\'ordine non valido o scaduto.',
    orderNotFound: 'Impossibile trovare i dettagli dell\'ordine. Si prega di contattare il supporto.',
    downloadLimitReached: 'Hai raggiunto il limite massimo di 50 download per questo pacchetto. Contatta il supporto per il ripristino.',
    downloading: 'Preparazione del download...',
    downloadSuccess: 'Download avviato con successo!',
    loadingInfo: 'Caricamento dei dettagli dell\'ordine...',
    downloadsUsed: 'Download utilizzati',
    purchasedOn: 'Acquistato il',
    maxDownloads: 'su 50 download max',
    downloadPdf: 'Scarica PDF Pianoforte',
    downloadPdfDesc: 'Spartito ottimizzato per la stampa e i tablet.',
    secureSsl: 'Connessione SSL Sicura',
    merchantOfRecord: 'Pagamenti elaborati da Paddle',
    backHome: 'Torna alla home',
    emailSubject: 'Ripristina limite di download',
    supportLinkText: 'Contatta il supporto',
    supportText: 'Per motivi di sicurezza, i download sono limitati a 50 per impedire la condivisione non autorizzata.',
    limitWarningText: 'Limite raggiunto? Niente stress. Scrivimi a info@meloscribe.dev e ti sbloccherò.',
    emailBtnText: 'Invia email',
    downloadPdfLabel: 'Scarica spartito (PDF)',
    pdfTooltipText: 'Lo spartito per pianoforte in PDF ad alta risoluzione. Perfetto per la stampa o tablet.',
    pdfBtnText: 'Scarica PDF',
    originalVideoLabel: 'Video tutorial (Velocità originale)',
    originalVideoTooltip: 'Il video di visualizzazione Keysight 2K HD a piena velocità per riferimento offline.',
    originalVideoDesc: 'Video tutorial a piena velocità (2K HD MP4).',
    videoBtnText: 'Scarica video',
    slowVideoLabel: 'Video tutorial (Velocità rallentata)',
    slowVideoTooltip: 'Il video di visualizzazione Keysight offline a velocità rallentata (con metronomo) per un facile studio.',
    slowVideoDesc: 'Video tutorial a tempo rallentato (2K HD MP4).',
    originalMidiLabel: 'MIDI (Velocità originale)',
    originalMidiTooltip: 'Il file MIDI per pianoforte a velocità originale. Caricalo in Synthesia, nella tua DAW o tastiera.',
    originalMidiDesc: 'File MIDI per pianoforte a piena velocità.',
    midiBtnText: 'Scarica MIDI',
    slowMidiLabel: 'MIDI (Velocità rallentata)',
    slowMidiTooltip: 'Il file MIDI per pianoforte rallentato del 30% per studiare facilmente le sezioni complesse.',
    slowMidiDesc: 'File MIDI per pianoforte a velocità ridotta.',
    errDownload: 'Errore durante il download',
    errFailed: 'Download fallito',
    errNetwork: 'Errore di rete durante il download',
    accessDenied: 'Accesso negato'
  }
};

export default function OrderDetails({ onBack, language, showToast, hash }: OrderDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingType, setDownloadingType] = useState<'pdf' | 'zip' | 'midi' | 'midi_slow' | 'video' | 'video_slow' | null>(null);

  const activeLang = ['de', 'en', 'fr', 'es', 'it'].includes(language) ? language : 'en';
  const t = translations[activeLang as keyof typeof translations];

  const formatOrderDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      let locale = 'en-US';
      if (language === 'de') locale = 'de-DE';
      else if (language === 'fr') locale = 'fr-FR';
      else if (language === 'es') locale = 'es-ES';
      else if (language === 'it') locale = 'it-IT';
      
      return d.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + (locale === 'de-DE' ? ' Uhr' : '');
    } catch (e) {
      return dateStr;
    }
  };

  const API_BASE = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'https://wooing-encrust-ladle.ngrok-free.dev'
      : 'https://api.meloscribe.dev');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/order/details?hash=${hash}`);
        if (res.ok) {
          const data = await res.json();
          setOrderInfo(data);
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || t.orderNotFound);
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
        setError(t.orderNotFound);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [hash, API_BASE, t.orderNotFound]);

  const handleDownload = async (type: 'pdf' | 'zip' | 'midi' | 'midi_slow' | 'video' | 'video_slow') => {
    if (!orderInfo || downloadingType) return;
    
    setDownloadingType(type);
    showToast(t.downloading);

    try {
      const res = await fetch(`${API_BASE}/api/download/request?hash=${hash}&type=${type}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.download_url) {
          // Trigger file download
          const link = document.createElement('a');
          link.href = data.download_url;
          link.setAttribute('download', '');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          showToast(t.downloadSuccess);
          
          // Update download count from response or increment fallback
          if (data.download_count !== undefined) {
            setOrderInfo(prev => prev ? { ...prev, download_count: data.download_count } : null);
          } else {
            setOrderInfo(prev => prev ? { ...prev, download_count: prev.download_count + 1 } : null);
          }
        } else {
          showToast(t.errDownload);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error || t.errFailed;
        showToast(errMsg);
        if (res.status === 403) {
          // Sync UI count to 50 if limit hit
          setOrderInfo(prev => prev ? { ...prev, download_count: 50 } : null);
        }
      }
    } catch (err) {
      console.error('Download request failed:', err);
      showToast(t.errNetwork);
    } finally {
      setDownloadingType(null);
    }
  };

  if (loading) {
    return (
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {t.loadingInfo}
          </span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center glass-card p-8 rounded-2xl border border-neon-pink/20 dark:border-neon-pink/30 bg-white/70 dark:bg-dark-800/80 backdrop-blur-md">
          <div className="inline-flex p-3 rounded-full bg-neon-pink/10 border border-neon-pink/20 mb-4">
            <AlertCircle className="w-8 h-8 text-neon-pink" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t.accessDenied}
          </h2>
          <p className="text-gray-550 dark:text-gray-400 text-sm mb-6">{error}</p>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-neon-cyan hover:text-neon-cyan/80 mx-auto cursor-pointer transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backHome}</span>
          </button>
        </div>
      </section>
    );
  }

  const isLimitReached = orderInfo ? orderInfo.download_count >= 50 : false;
  const downloadPct = orderInfo ? Math.min((orderInfo.download_count / 50) * 100, 100) : 0;

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header Block */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-4 relative">
            <div className="absolute inset-0 bg-neon-cyan/10 rounded-full blur-xl animate-pulse" />
            <Music className="w-8 h-8 text-neon-cyan relative z-10" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            {t.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-dark-500/50 dark:bg-dark-800/80 mb-6 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-neon-cyan/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-neon-pink/10 rounded-full blur-2xl pointer-events-none" />

          {/* Details Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/50 dark:border-dark-600/50 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-150 dark:bg-dark-900 flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-dark-600/50 overflow-hidden">
                <img 
                  src={`/covers/${orderInfo?.song_name.replace(" (All Parts)", "").replace(" (Part 1)", "").replace(" (Part 2)", "")}.jpg`}
                  alt={orderInfo?.song_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Music className="w-5 h-5 text-neon-cyan absolute" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                  {orderInfo?.song_name}
                </h3>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-550 dark:text-gray-400">
                    <Mail className="w-3.5 h-3.5 text-neon-pink" />
                    {orderInfo?.email}
                  </span>
                  {orderInfo?.created_at && (
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      {t.purchasedOn} {formatOrderDate(orderInfo.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

          {/* Limit Progress */}
          <div className="w-full sm:w-56">
              <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                <span>{t.downloadsUsed}</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {orderInfo?.download_count} / 50
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-dark-950 rounded-full overflow-hidden border border-gray-300/30 dark:border-dark-600/20">
                <div 
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                    isLimitReached 
                      ? 'from-neon-pink to-neon-pink' 
                      : 'from-neon-cyan to-neon-pink'
                  }`}
                  style={{ width: `${downloadPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <a 
                  href={`mailto:info@meloscribe.dev?subject=${encodeURIComponent(t.emailSubject)} - Order #${hash}`}
                  className="text-[10px] text-neon-cyan hover:underline hover:text-neon-cyan/80 transition-colors font-medium cursor-pointer"
                >
                  {t.supportLinkText}
                </a>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-500">
                    {t.maxDownloads}
                  </span>
                  <span className="group relative inline-block cursor-help text-gray-400 hover:text-neon-cyan transition-colors">
                    <Info className="w-3.5 h-3.5" />
                    <span className="absolute bottom-full right-0 mb-2 w-56 p-2 bg-dark-900/95 border border-dark-600 text-gray-300 text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl z-50 text-center font-normal backdrop-blur-md">
                      {t.supportText}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Limit Reached Warning Box */}
          {isLimitReached && (
            <div className="mt-2 mb-6 p-4 rounded-xl border border-neon-pink/20 bg-neon-pink/5 text-xs text-neon-pink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
              <span className="leading-relaxed">
                {t.limitWarningText}
              </span>
              <a 
                href={`mailto:info@meloscribe.dev?subject=${encodeURIComponent(t.emailSubject)} - Order #${hash}`}
                className="px-3.5 py-1.5 bg-neon-pink hover:bg-neon-pink/90 text-white font-bold rounded-lg text-xs transition-all shrink-0 cursor-pointer text-center w-full sm:w-auto"
              >
                {t.emailBtnText}
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Download PDF Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-dark-600/40 dark:bg-dark-900/30 gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    {t.downloadPdfLabel}
                    <span className="group relative inline-block cursor-help">
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-neon-cyan transition-colors" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-dark-900/95 border border-dark-600 text-gray-300 text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl z-50 text-center font-normal backdrop-blur-md">
                        {t.pdfTooltipText}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark-900" />
                      </span>
                    </span>
                  </h4>
                  <p className="text-gray-550 dark:text-gray-500 text-xs mt-0.5">{t.downloadPdfDesc}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('pdf')}
                disabled={isLimitReached || downloadingType !== null}
                className="w-full sm:w-auto relative group overflow-hidden px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 border border-neon-cyan bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 hover:from-neon-cyan/30 hover:to-neon-pink/30 hover:border-neon-cyan hover:shadow-neon-cyan-subtle disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadingType === 'pdf' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-neon-cyan group-hover:translate-y-0.5 transition-transform" />
                )}
                <span>{t.pdfBtnText}</span>
              </button>
            </div>

            {/* Download Video (Original) */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-dark-600/40 dark:bg-dark-900/30 gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex-shrink-0 mt-0.5">
                  <Tv className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                    {t.originalVideoLabel}
                    <span className="group relative inline-block cursor-help">
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-neon-cyan transition-colors" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-dark-900/95 border border-dark-600 text-gray-300 text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl z-50 text-center font-normal backdrop-blur-md">
                        {t.originalVideoTooltip}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark-900" />
                      </span>
                    </span>
                  </h4>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                    {t.originalVideoDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('video')}
                disabled={isLimitReached || downloadingType !== null}
                className="w-full sm:w-auto relative group overflow-hidden px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 border border-neon-cyan bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 hover:from-neon-cyan/30 hover:to-neon-pink/30 hover:border-neon-cyan hover:shadow-neon-cyan-subtle disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadingType === 'video' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-neon-cyan group-hover:translate-y-0.5 transition-transform" />
                )}
                <span>{t.videoBtnText}</span>
              </button>
            </div>

            {/* Download Video (Slow) */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-dark-600/40 dark:bg-dark-900/30 gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex-shrink-0 mt-0.5">
                  <Tv className="w-5 h-5 text-neon-cyan opacity-80" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                    {t.slowVideoLabel}
                    <span className="group relative inline-block cursor-help">
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-neon-cyan transition-colors" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-dark-900/95 border border-dark-600 text-gray-300 text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl z-50 text-center font-normal backdrop-blur-md">
                        {t.slowVideoTooltip}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark-900" />
                      </span>
                    </span>
                  </h4>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                    {t.slowVideoDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('video_slow')}
                disabled={isLimitReached || downloadingType !== null}
                className="w-full sm:w-auto relative group overflow-hidden px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 border border-neon-cyan/60 bg-gradient-to-r from-neon-cyan/10 to-neon-pink/10 hover:from-neon-cyan/20 hover:to-neon-pink/20 hover:border-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadingType === 'video_slow' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-neon-cyan group-hover:translate-y-0.5 transition-transform" />
                )}
                <span>{t.videoBtnText}</span>
              </button>
            </div>

            {/* Download MIDI (Original) */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-dark-600/40 dark:bg-dark-900/30 gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="p-2 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex-shrink-0 mt-0.5">
                  <Music className="w-5 h-5 text-neon-pink" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    {t.originalMidiLabel}
                    <span className="group relative inline-block cursor-help">
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-neon-pink transition-colors" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-dark-900/95 border border-dark-600 text-gray-300 text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl z-50 text-center font-normal backdrop-blur-md">
                        {t.originalMidiTooltip}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark-900" />
                      </span>
                    </span>
                  </h4>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                    {t.originalMidiDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('midi')}
                disabled={isLimitReached || downloadingType !== null}
                className="w-full sm:w-auto relative group overflow-hidden px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 border border-neon-pink bg-gradient-to-r from-neon-cyan/15 to-neon-pink/15 hover:from-neon-cyan/25 hover:to-neon-pink/25 hover:border-neon-pink hover:shadow-neon-pink-subtle disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadingType === 'midi' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-neon-pink group-hover:translate-y-0.5 transition-transform" />
                )}
                <span>{t.midiBtnText}</span>
              </button>
            </div>

            {/* Download MIDI (Slow) */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-dark-600/40 dark:bg-dark-900/30 gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="p-2 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex-shrink-0 mt-0.5">
                  <Music className="w-5 h-5 text-neon-pink opacity-80" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                    {t.slowMidiLabel}
                    <span className="group relative inline-block cursor-help">
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-neon-pink transition-colors" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-dark-900/95 border border-dark-600 text-gray-300 text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl z-50 text-center font-normal backdrop-blur-md">
                        {t.slowMidiTooltip}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark-900" />
                      </span>
                    </span>
                  </h4>
                  <p className="text-gray-550 dark:text-gray-500 text-xs mt-0.5">
                    {t.slowMidiDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('midi_slow')}
                disabled={isLimitReached || downloadingType !== null}
                className="w-full sm:w-auto relative group overflow-hidden px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 border border-neon-pink/60 bg-gradient-to-r from-neon-cyan/10 to-neon-pink/10 hover:from-neon-cyan/20 hover:to-neon-pink/20 hover:border-neon-pink disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadingType === 'midi_slow' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-neon-pink group-hover:translate-y-0.5 transition-transform" />
                )}
                <span>{t.midiBtnText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="flex items-center justify-between px-6 text-[11px] text-gray-500 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" /> {t.secureSsl}
          </span>
          <span>{t.merchantOfRecord}</span>
        </div>

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-550 dark:text-gray-400 hover:text-neon-cyan mx-auto mt-10 cursor-pointer transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backHome}</span>
        </button>
      </div>
    </section>
  );
}
