import { ArrowLeft, BookOpen, ShieldAlert } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
  language: string;
}

export default function Terms({ onBack, language }: TermsProps) {
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
          <span>{language === 'de' ? 'Zurück' : language === 'fr' ? 'Retour' : 'Back'}</span>
        </button>

        {/* Title */}
        <div className="border-b border-gray-200 dark:border-dark-600/50 pb-8 mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient neon-text-cyan">
              {language === 'de' ? 'Nutzungsbedingungen' : language === 'fr' ? 'Conditions d\'Utilisation' : 'Terms of Service'}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {language === 'de' ? 'Zuletzt aktualisiert: 25. Juni 2026' : 'Last Updated: June 25, 2026'}
          </p>
        </div>

        {/* Legal Text Card */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BookOpen className="w-24 h-24 text-neon-cyan" />
          </div>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? '1. Geltungsbereich und Allgemeines' : '1. Scope and General'}
              </h2>
              <p className="text-sm">
                {language === 'de' 
                  ? 'Diese Nutzungsbedingungen regeln die Nutzung der Website meloscribe.dev und den Erwerb von digitalen Produkten (wie Klavierarrangements, Notenblätter und MIDI-Dateien). Betreiber der Website ist Tobias Baumann, Wolfgelts 10, 88353 Kißlegg, Deutschland.' 
                  : 'These Terms of Service govern the use of the website meloscribe.dev and the purchase of digital products (such as piano arrangements, sheet music, and MIDI files). The website operator is Tobias Baumann, Wolfgelts 10, 88353 Kißlegg, Germany.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '2. Zahlungsabwicklung (Paddle)' : '2. Payment Processing (Paddle)'}
              </h2>
              <p className="text-sm">
                {language === 'de'
                  ? 'Unsere Bestellabwicklung wird durch unseren Händler (Merchant of Record) Paddle durchgeführt. Paddle ist das verantwortliche Unternehmen für die Zahlungsabwicklung und Abrechnung aller Käufe. Mit der Durchführung einer Zahlung stimmst du den Nutzungsbedingungen und Datenschutzrichtlinien von Paddle zu.'
                  : 'Our order process is conducted by our Merchant of Record, Paddle. Paddle is the responsible merchant for billing and customer service for all purchases. By making a payment, you agree to the terms and privacy policy of Paddle.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? '3. Digitale Produkte und Nutzungsrechte' : '3. Digital Products and Usage Rights'}
              </h2>
              <p className="text-sm">
                {language === 'de'
                  ? 'Alle bereitgestellten Produkte sind rein digitale Downloads (ZIP-Archive mit PDF-Noten, MIDI-Dateien und Tutorial-Videos). Nach erfolgreicher Zahlung erhältst du einen Download-Link. Wir gewähren dir eine nicht-exklusive, nicht-übertragbare Lizenz zur persönlichen, nicht-kommerziellen Nutzung der Noten und Musikdateien. Das Teilen, Hochladen oder Weiterverkaufen der Dateien ist ausdrücklich untersagt.'
                  : 'All products provided are purely digital downloads (ZIP archives containing PDF sheet music, MIDI files, and tutorial videos). After successful payment, you will receive a download link. We grant you a non-exclusive, non-transferable license for personal, non-commercial use of the sheet music and files. Sharing, uploading, or reselling the files is strictly prohibited.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '4. Urheberrecht und Eigentum' : '4. Copyright and Intellectual Property'}
              </h2>
              <p className="text-sm">
                {language === 'de'
                  ? 'Sämtliche Klavierarrangements und Design-Assets auf meloscribe.dev sind urheberrechtlich geschützt. Die Rechte an den Arrangements liegen bei meloscribe. Das Eigentum an den zugrundeliegenden Songs verbleibt bei den jeweiligen Rechteinhabern.'
                  : 'All piano arrangements and design assets on meloscribe.dev are protected by copyright. The rights to the arrangements belong to meloscribe. Ownership of the underlying musical works remains with the respective copyright holders.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? '5. Gewährleistung' : '5. Limitation of Liability'}
              </h2>
              <p className="text-sm">
                {language === 'de'
                  ? 'Wir sind bestrebt, die Richtigkeit und Qualität unserer Klaviernoten zu gewährleisten. Da es sich um digitale Güter handelt, erfolgt die Bereitstellung ohne Mängelgewähr. Haftung für Schäden, die aus der Nutzung der Website oder fehlerhafter Downloads entstehen, wird soweit gesetzlich zulässig ausgeschlossen.'
                  : 'We strive to maintain high accuracy and quality of our piano arrangements. Since these are digital goods, they are provided "as is". To the fullest extent permitted by law, liability for any damages arising out of the use of the website or downloads is excluded.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
