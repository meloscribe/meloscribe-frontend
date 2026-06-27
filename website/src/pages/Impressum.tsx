import { ArrowLeft, Mail, ShieldAlert } from 'lucide-react';

interface ImpressumProps {
  onBack: () => void;
  language: string;
}

export default function Impressum({ onBack, language }: ImpressumProps) {
  return (
    <div className="min-h-screen bg-neon-gradient text-gray-800 dark:text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-orb-cyan w-96 h-96 -top-48 -left-48 opacity-40" />
        <div className="glow-orb glow-orb-pink w-96 h-96 bottom-10 -right-48 opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-neon-cyan transition-colors mb-12 group focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'de' ? 'Zurück' : language === 'es' ? 'Volver' : language === 'fr' ? 'Retour' : 'Back'}</span>
        </button>

        {/* Title */}
        <div className="border-b border-gray-200 dark:border-dark-600/50 pb-8 mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient neon-text-cyan">
              {language === 'de' ? 'Impressum' : language === 'es' ? 'Aviso Legal' : language === 'fr' ? 'Mentions Légales' : 'Imprint / Legal Notice'}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {language === 'de' ? 'Angaben gemäß § 5 TMG' : 'Information provided according to Sec. 5 German Telemedia Act (TMG)'}
          </p>
        </div>

        {/* Legal Text Card */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldAlert className="w-24 h-24 text-neon-cyan" />
          </div>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            {/* PLACEHOLDER COMMENT: Legal details can be edited below */}
            {/* ========================================================================= */}
            {/* LEGAL DETAILS PLACEHOLDER - EDIT THIS SECTION WITH REAL OWNER DATA */}
            {/* ========================================================================= */}
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? 'Betreiber der Website' : 'Website Operator'}
              </h2>
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">Tobias Baumann</p>
                <p>Wolfgelts 10</p>
                <p>88353 Kißlegg</p>
                <p>{language === 'de' ? 'Deutschland' : 'Germany'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? 'Kontakt' : 'Contact Information'}
              </h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neon-cyan" />
                  <span>Email: <a href="mailto:info@meloscribe.dev" className="hover:text-neon-cyan transition-colors"><strong>info@meloscribe.dev</strong></a></span>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? 'Haftungsausschluss' : 'Disclaimer'}
              </h2>
              <div className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  {language === 'de' 
                    ? 'Haftung für Inhalte: Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.' 
                    : 'Liability for Contents: The contents of our pages were created with great care. However, we cannot assume any liability for the correctness, completeness and up-to-dateness of the contents.'}
                </p>
                <p>
                  {language === 'de'
                    ? 'Haftung für Links: Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.'
                    : 'Liability for Links: Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents.'}
                </p>
              </div>
            </div>
            {/* ========================================================================= */}
          </div>
        </div>
      </div>
    </div>
  );
}
