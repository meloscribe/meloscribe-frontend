import { useState } from 'react';
import { X, Loader2, ShieldCheck, Download, Music, Tv, FileText } from 'lucide-react';

interface PaddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  kofiId: string;
  songTitle: string;
  songArtist: string;
  language: string;
  isCondensed?: boolean;
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
    videoTitle: '2K HD Video Tutorials offline',
    videoDesc: 'Includes videos in original speed and reduced practice speed.',
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
    videoTitle: '2K HD Video-Tutorials offline',
    videoDesc: 'Enthält Videos in Originalgeschwindigkeit und reduzierter Übungsgeschwindigkeit.',
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
    videoTitle: 'Tutoriels Vidéo 2K HD hors ligne',
    videoDesc: 'Comprend des vidéos à vitesse originale et à vitesse d\'apprentissage réduite.',
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
    videoTitle: 'Tutoriales en video 2K HD sin conexión',
    videoDesc: 'Incluye videos a velocidad original y velocidad de práctica reducida.',
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
    videoTitle: 'Tutorial video 2K HD offline',
    videoDesc: 'Include video a velocità originale e velocità di pratica ridotta.',
    buttonPay: 'Pagamento sicuro con Paddle',
    buttonOpening: 'Apertura del pagamento sicuro...',
    errorLoad: 'Il sistema di pagamento non può essere caricato. Disattiva il blocco degli annunci e riprova.',
    encrypted: 'I pagamenti sono elaborati in modo sicuro da Paddle. Accesso immediato al download dopo l\'acquisto.',
    secureSsl: 'Connessione SSL sicura',
    merchantOfRecord: 'Commerciante registrato: Paddle',
  }
};

export default function PaddleModal({ isOpen, onClose, kofiId, songTitle, songArtist, language, isCondensed = false }: PaddleModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!isOpen) return null;

  const activeLang = (['en', 'de', 'fr', 'es', 'it'].includes(language) ? language : 'en') as keyof typeof translations;
  const t = translations[activeLang];

  const generateSecureHash = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleRedirect = () => {
    setIsRedirecting(true);
    
    const paddle = (window as any).Paddle;
    if (typeof paddle !== 'undefined') {
      const downloadHash = generateSecureHash();
      paddle.Checkout.open({
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
        },
        settings: {
          theme: 'dark',
          locale: activeLang,
          successUrl: `${window.location.origin}/success?checkout_id={checkout_id}`
        }
      });
      
      setTimeout(() => {
        onClose();
        setIsRedirecting(false);
      }, 1500);
    } else {
      alert(t.errorLoad);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white dark:bg-dark-900/95 border border-gray-200 dark:border-dark-600/50 rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
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

        {/* Modal Body / Product summary */}
        <div className="p-6 overflow-y-auto space-y-6 relative z-10">
          {/* Song Overview Card */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-200/80 dark:bg-dark-800/60 dark:border-dark-500/40 p-4 rounded-xl">
            <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-dark-950 flex-shrink-0 relative overflow-hidden border border-gray-200 dark:border-dark-500/30 flex items-center justify-center">
              {/* Cover Art Image or Fallback */}
              <img 
                src={`/covers/${songTitle.replace(" (All Parts)", "").replace(" (Part 1)", "").replace(" (Part 2)", "")}.jpg`}
                alt={songTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Music className="w-6 h-6 text-neon-cyan absolute" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white truncate">{songTitle}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{songArtist}</p>
            </div>
          </div>

          {/* Included Features Checklist */}
          <div>
            <h5 className="text-xs font-semibold text-gray-550 dark:text-gray-400 uppercase tracking-wider mb-3">{t.included}</h5>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-neon-cyan" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isCondensed 
                      ? (language === 'de' ? 'Viral Part Klaviernoten (PDF)' : 'Viral Part sheet music (PDF)') 
                      : t.pdfTitle}
                  </span>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                    {isCondensed 
                      ? (language === 'de' ? 'Präzise Klaviernoten des viralen Song-Ausschnitts (wie im Video).' : 'Precise piano sheets of the viral part of the song (as shown in the video).') 
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
                      ? (language === 'de' ? 'Viral Part MIDI-Dateien (Normal + Langsam)' : 'Viral Part MIDI Files (Normal + Slow)') 
                      : t.midiTitle}
                  </span>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                    {isCondensed 
                      ? (language === 'de' ? 'Lern-MIDIs des viralen Song-Teils für Synthesia oder deine DAW.' : 'Practice MIDIs of the viral section for Synthesia or your DAW.') 
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
                      ? (language === 'de' ? '2K HD Video-Tutorials (Viral Part)' : '2K HD Video Tutorials (Viral Part)') 
                      : t.videoTitle}
                  </span>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                    {isCondensed 
                      ? (language === 'de' ? 'Das virale Tutorial-Video offline in normalem & langsamem Tempo.' : 'The viral tutorial video offline in normal & slow speed.') 
                      : t.videoDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            {/* Redirect / Download Button */}
            <button
              onClick={handleRedirect}
              disabled={isRedirecting}
              className="w-full relative group overflow-hidden px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 border border-neon-cyan bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 hover:from-neon-cyan/30 hover:to-neon-pink/30 hover:border-neon-cyan hover:shadow-neon-cyan-subtle focus:outline-none flex items-center justify-center gap-3 disabled:opacity-85 cursor-pointer"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span>{t.buttonOpening}</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform" />
                  <span>{t.buttonPay}</span>
                </>
              )}
            </button>
            <p className="text-gray-500 dark:text-gray-500 text-[11px] mt-3">
              {t.encrypted}
            </p>
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
    </div>
  );
}
