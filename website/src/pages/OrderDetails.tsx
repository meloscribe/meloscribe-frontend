import { useEffect, useState } from 'react';
import { ArrowLeft, Download, Loader2, Music, ShieldCheck, FileText, Archive, Mail, AlertCircle } from 'lucide-react';

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
}

const translations = {
  en: {
    title: 'Your Music Bundle',
    subtitle: 'Access your sheet music and practice tools. Bookmark this page if you want to access it later.',
    invalidHash: 'Invalid or expired order link.',
    orderNotFound: 'Order details could not be found. Please contact support.',
    downloadLimitReached: 'You have reached the maximum download limit of 20 downloads for this package. Contact support for reset.',
    downloading: 'Preparing download...',
    downloadSuccess: 'Download started successfully!',
    loadingInfo: 'Loading order details...',
    downloadsUsed: 'Downloads used',
    maxDownloads: 'of 20 downloads max',
    downloadPdf: 'Download Piano PDF',
    downloadPdfDesc: 'Sheet music optimized for print and tablet readers.',
    downloadZip: 'Download Assets (.zip)',
    downloadZipDesc: 'Includes MIDIs (Normal/Slow) and HD Video Tutorials.',
    secureSsl: 'Secure SSL Connection',
    merchantOfRecord: 'Payments processed by Paddle',
    backHome: 'Back to Home'
  },
  de: {
    title: 'Dein Lernpaket',
    subtitle: 'Greife auf deine Klaviernoten und Übungsdateien zu. Speichere diesen Link, um später wiederzukommen.',
    invalidHash: 'Ungültiger oder abgelaufener Bestell-Link.',
    orderNotFound: 'Bestell-Details wurden nicht gefunden. Bitte kontaktiere den Support.',
    downloadLimitReached: 'Du hast das maximale Download-Limit von 20 Klicks erreicht. Kontaktiere den Support für eine Freischaltung.',
    downloading: 'Bereite Download vor...',
    downloadSuccess: 'Download erfolgreich gestartet!',
    loadingInfo: 'Lade Bestell-Details...',
    downloadsUsed: 'Downloads verbraucht',
    maxDownloads: 'von maximal 20 Downloads',
    downloadPdf: 'Klaviernoten PDF laden',
    downloadPdfDesc: 'Noten optimiert zum Ausdrucken und für Tablets.',
    downloadZip: 'Lernpaket laden (.zip)',
    downloadZipDesc: 'Enthält MIDIs (Normal/Langsam) und HD-Video-Tutorials.',
    secureSsl: 'Sichere SSL-Verbindung',
    merchantOfRecord: 'Zahlungsabwickler: Paddle',
    backHome: 'Zurück zur Startseite'
  }
};

export default function OrderDetails({ onBack, language, showToast, hash }: OrderDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingType, setDownloadingType] = useState<'pdf' | 'zip' | null>(null);

  const isDe = language === 'de';
  const t = translations[isDe ? 'de' : 'en'];

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

  const handleDownload = async (type: 'pdf' | 'zip') => {
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
          
          // Increment download count in UI state
          setOrderInfo(prev => prev ? { ...prev, download_count: prev.download_count + 1 } : null);
        } else {
          showToast(isDe ? 'Fehler beim Herunterladen' : 'Error triggering download');
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error || (isDe ? 'Download fehlgeschlagen' : 'Download failed');
        showToast(errMsg);
        if (res.status === 403) {
          // Sync UI count to 20 if limit hit
          setOrderInfo(prev => prev ? { ...prev, download_count: 20 } : null);
        }
      }
    } catch (err) {
      console.error('Download request failed:', err);
      showToast(isDe ? 'Netzwerkfehler beim Download' : 'Network error during download');
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
            {isDe ? 'Fehler' : 'Access Denied'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{error}</p>
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

  const isLimitReached = orderInfo ? orderInfo.download_count >= 20 : false;
  const downloadPct = orderInfo ? Math.min((orderInfo.download_count / 20) * 100, 100) : 0;

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
                <span className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-neon-pink" />
                  {orderInfo?.email}
                </span>
              </div>
            </div>

            {/* Limit Progress */}
            <div className="w-full sm:w-48">
              <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                <span>{t.downloadsUsed}</span>
                <span className={isLimitReached ? 'text-neon-pink font-bold' : ''}>
                  {orderInfo?.download_count} / 20
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
              <span className="text-[10px] text-gray-500 dark:text-gray-500 block mt-1 text-right">
                {t.maxDownloads}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Download PDF Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-dark-600/40 dark:bg-dark-900/30 gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {isDe ? 'Noten (PDF) herunterladen' : 'Download Sheet PDF'}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">{t.downloadPdfDesc}</p>
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
                <span>{isDe ? 'PDF laden' : 'Download PDF'}</span>
              </button>
            </div>

            {/* Download ZIP Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-dark-600/40 dark:bg-dark-900/30 gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="p-2 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex-shrink-0 mt-0.5">
                  <Archive className="w-5 h-5 text-neon-pink" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {isDe ? 'MIDIs & Videos (.zip) herunterladen' : 'Download MIDI & Video Package (.zip)'}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">{t.downloadZipDesc}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('zip')}
                disabled={isLimitReached || downloadingType !== null}
                className="w-full sm:w-auto relative group overflow-hidden px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 border border-neon-pink bg-gradient-to-r from-neon-cyan/15 to-neon-pink/15 hover:from-neon-cyan/25 hover:to-neon-pink/25 hover:border-neon-pink hover:shadow-neon-pink-subtle disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadingType === 'zip' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-neon-pink group-hover:translate-y-0.5 transition-transform" />
                )}
                <span>{isDe ? 'ZIP laden' : 'Download ZIP'}</span>
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
