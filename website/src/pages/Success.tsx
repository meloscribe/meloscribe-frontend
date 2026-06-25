import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Download, Loader2, Mail, Sparkles } from 'lucide-react';

interface SuccessProps {
  onBack: () => void;
  language: string;
  showToast: (message: string) => void;
}

export default function Success({ onBack, language, showToast }: SuccessProps) {
  const [loading, setLoading] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDe = language === 'de';
  const isFr = language === 'fr';

  // Get checkout_id from URL params
  const queryParams = new URLSearchParams(window.location.search);
  const checkoutId = queryParams.get('checkout_id') || queryParams.get('checkout') || 'demo_checkout_123';

  const API_BASE = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'https://wooing-encrust-ladle.ngrok-free.dev'
      : 'https://api.meloscribe.dev');

  useEffect(() => {
    let intervalId: number;
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 1.5s = 45s max polling

    const checkHash = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/order/hash-by-checkout?checkout_id=${checkoutId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.download_hash) {
            clearInterval(intervalId);
            window.history.pushState(null, '', `/order/${data.download_hash}`);
            window.dispatchEvent(new PopStateEvent('popstate'));
            return;
          }
        }
      } catch (err) {
        console.warn('Polling hash failed:', err);
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        setError(isDe ? 'Verifizierung dauerte zu lange. Bitte prüfe deine E-Mails.' : 'Verification timed out. Please check your email for the link.');
        setLoading(false);
      }
    };

    if (checkoutId === 'demo_checkout_123' || checkoutId.startsWith('demo_')) {
      setTimeout(() => {
        window.history.pushState(null, '', `/order/demo_hash_${checkoutId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 1500);
      return;
    }

    intervalId = window.setInterval(checkHash, 1500);
    checkHash();

    return () => clearInterval(intervalId);
  }, [checkoutId, isDe]);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto text-center">
        {/* Success Icon */}
        <div className="inline-flex p-3 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6 relative">
          <div className="absolute inset-0 bg-neon-cyan/10 rounded-full blur-xl animate-pulse" />
          <CheckCircle2 className="w-12 h-12 text-neon-cyan relative z-10" />
        </div>

        {/* Heading */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          <span className="text-gradient neon-text-cyan">
            {isDe ? 'Zahlung erfolgreich!' : isFr ? 'Paiement Réussi !' : 'Payment Successful!'}
          </span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-10">
          {isDe 
            ? 'Vielen Dank für deine Unterstützung! Dein Lernpaket mit Noten (PDF), MIDIs und Videos ist jetzt bereit.' 
            : isFr 
            ? 'Merci pour votre soutien ! Votre pack d\'apprentissage avec partitions (PDF), MIDIs et vidéos est prêt.' 
            : 'Thank you for your support! Your learning package containing sheet music (PDF), MIDIs, and practice videos is now ready.'}
        </p>

        {/* Download Action Card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-dark-500/50 dark:bg-dark-800/80 mb-8 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-neon-cyan/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-neon-pink/10 rounded-full blur-2xl pointer-events-none" />

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {isDe ? 'Verifiziere Kauf & generiere sicheren Link...' : 'Verifying transaction & constructing secure link...'}
              </span>
            </div>
          ) : error ? (
            <div className="py-6">
              <span className="text-sm text-neon-pink font-semibold">{error}</span>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div>
                <span className="text-[11px] font-semibold text-neon-cyan uppercase tracking-wider">Secure Cloudflare R2 Download</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {isDe ? 'Dein Paket steht bereit' : 'Your package is ready'}
                </h3>
              </div>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full relative group overflow-hidden px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 border border-neon-cyan bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 hover:from-neon-cyan/30 hover:to-neon-pink/30 hover:border-neon-cyan hover:shadow-neon-cyan focus:outline-none flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Download className="w-5 h-5 text-neon-cyan group-hover:translate-y-0.5 transition-transform" />
                  <span>{isDe ? 'Notenpaket herunterladen (.zip)' : 'Download Sheet Package (.zip)'}</span>
                </a>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200/50 dark:border-dark-600/50">
                <Mail className="w-4 h-4 text-neon-pink" />
                <span>
                  {isDe 
                    ? 'Der Link wurde dir zur Sicherheit auch per E-Mail zugeschickt.' 
                    : 'We also sent a backup copy of the link to your inbox.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-neon-cyan mx-auto cursor-pointer transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isDe ? 'Zurück zur Startseite' : 'Back to Home'}</span>
        </button>
      </div>
    </section>
  );
}
