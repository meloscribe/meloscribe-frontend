import { ArrowUpRight, Music, Mail, ExternalLink } from 'lucide-react';
import { MeloLogo } from '../components/MeloLogo';

interface DomainMovedProps {
  language: string;
}

export default function DomainMoved({ language }: DomainMovedProps) {
  const isDe = language === 'de';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Neon Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-orb-cyan w-[500px] h-[500px] -top-32 -left-32 opacity-30 blur-[100px]" />
        <div className="glow-orb glow-orb-pink w-[500px] h-[500px] -bottom-32 -right-32 opacity-25 blur-[120px]" />
      </div>

      {/* Header with Logo */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MeloLogo className="w-8 h-8 text-neon-cyan" />
          <span className="font-display font-bold text-xl tracking-tight">meloscribe</span>
        </div>
        <a
          href="mailto:info@meloscribe.dev"
          className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
        >
          <Mail className="w-4 h-4 text-neon-cyan" />
          <span>info@meloscribe.dev</span>
        </a>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-auto text-center py-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs sm:text-sm font-medium mb-8">
          <Music className="w-4 h-4 animate-pulse" />
          <span>{isDe ? 'Neue offizielle Domain' : 'New Official Domain'}</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span>{isDe ? 'Wir sind umgezogen nach ' : 'We have moved to '}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-purple-400 to-neon-pink mt-2">
            meloscribesheets.com
          </span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed font-sans">
          {isDe
            ? 'Unser gesamter Notenkatalog, alle interaktiven Lernpakete und Videos befinden sich ab sofort unter unserer neuen Adresse.'
            : 'Our entire piano sheet music catalog, interactive learning packages, and video tutorials are now permanently hosted at our new home.'}
        </p>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.meloscribesheets.com"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-semibold text-base text-black bg-gradient-to-r from-neon-cyan to-neon-pink hover:opacity-95 shadow-lg shadow-neon-cyan/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{isDe ? 'Zu meloscribesheets.com' : 'Visit meloscribesheets.com'}</span>
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center text-xs text-gray-500 pt-8 border-t border-dark-600/30">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} meloscribe &bull; Tobias Baumann, Wolfgelts 10, 88353 Kißlegg, Germany
        </p>
        <p className="text-gray-600">
          Official store:{' '}
          <a
            href="https://www.meloscribesheets.com"
            className="text-neon-cyan hover:underline inline-flex items-center gap-1"
          >
            https://www.meloscribesheets.com <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </footer>
    </div>
  );
}
