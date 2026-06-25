import { useState } from 'react';
import { X, ExternalLink, Loader2, ShieldCheck, Download, Music, Tv, FileText } from 'lucide-react';

interface KofiModalProps {
  isOpen: boolean;
  onClose: () => void;
  kofiId: string;
  songTitle: string;
  songArtist: string;
}

export default function KofiModal({ isOpen, onClose, kofiId, songTitle, songArtist }: KofiModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const checkoutUrl = `https://ko-fi.com/s/${kofiId}`;

  if (!isOpen) return null;

  const handleRedirect = () => {
    setIsRedirecting(true);
    // Use anchor click — cannot be blocked by popup blockers
    const a = document.createElement('a');
    a.href = checkoutUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Auto-close modal after short delay
    setTimeout(() => {
      onClose();
      setIsRedirecting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-dark-900/95 border border-dark-600/50 rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Glow Orb in Modal */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-cyan/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-neon-pink/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dark-600/50 relative z-10">
          <div>
            <span className="text-xs font-semibold text-neon-cyan tracking-wider uppercase">Secure Download Gate</span>
            <h3 className="text-xl font-display font-semibold text-white mt-0.5">
              Unlock Sheet Music
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-dark-700/50 border border-dark-500/50 text-gray-400 hover:text-white hover:border-neon-pink/50 hover:shadow-neon-pink-subtle transition-all duration-300 focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Product summary */}
        <div className="p-6 overflow-y-auto space-y-6 relative z-10">
          {/* Song Overview Card */}
          <div className="flex items-center gap-4 bg-dark-800/60 border border-dark-500/40 p-4 rounded-xl">
            <div className="w-16 h-16 rounded-lg bg-dark-950 flex-shrink-0 relative overflow-hidden border border-dark-500/30 flex items-center justify-center">
              {/* Cover Art Image or Fallback */}
              <img 
                src={`/covers/${songTitle.replace(" (All Parts)", "").replace(" (Part 1)", "").replace(" (Part 2)", "")}.jpg`}
                alt={songTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to music icon if image fails
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Music className="w-6 h-6 text-neon-cyan absolute" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-display font-semibold text-white truncate">{songTitle}</h4>
              <p className="text-gray-400 text-sm truncate">{songArtist}</p>
            </div>
          </div>

          {/* Included Features Checklist */}
          <div>
            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">What's included in this package:</h5>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-neon-cyan" />
                </div>
                <div>
                  <span className="font-semibold text-white">Complete Sheet Music (PDF)</span>
                  <p className="text-gray-500 text-xs mt-0.5">High-quality, printable sheet music arrangement.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Music className="w-3.5 h-3.5 text-neon-pink" />
                </div>
                <div>
                  <span className="font-semibold text-white">MIDI Files (Original + Slow versions)</span>
                  <p className="text-gray-500 text-xs mt-0.5">Compatible with any DAW, Synthesia, or digital piano.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Tv className="w-3.5 h-3.5 text-neon-cyan" />
                </div>
                <div>
                  <span className="font-semibold text-white">2K HD Video Tutorials</span>
                  <p className="text-gray-500 text-xs mt-0.5">Includes full-speed and practice-speed Synthesia visualizers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            {/* Redirect / Download Button */}
            <button
              onClick={handleRedirect}
              disabled={isRedirecting}
              className="w-full relative group overflow-hidden px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 border border-neon-cyan bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 hover:from-neon-cyan/30 hover:to-neon-pink/30 hover:border-neon-cyan hover:shadow-neon-cyan focus:outline-none flex items-center justify-center gap-3 disabled:opacity-85 cursor-pointer"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span>Opening secure checkout...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform" />
                  <span>Sicheren Checkout öffnen</span>
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </>
              )}
            </button>
            <p className="text-gray-500 text-[11px] mt-3">
              Der Bezahlvorgang wird sicher über Ko-fi abgewickelt. Noten & MIDIs stehen sofort nach Kauf bereit.
            </p>
          </div>
        </div>

        {/* Footer Info Banner */}
        <div className="px-6 py-4 border-t border-dark-600/50 bg-dark-900/85 backdrop-blur-md flex items-center justify-between text-xs text-gray-500 relative z-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-neon-cyan" /> Secure 256-bit SSL Connection
          </span>
          <span>Powered by Ko-fi</span>
        </div>
      </div>
    </div>
  );
}
