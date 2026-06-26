import { ArrowLeft, Coins, ShieldAlert } from 'lucide-react';

interface RefundsProps {
  onBack: () => void;
  language: string;
}

export default function Refunds({ onBack, language }: RefundsProps) {
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
              {language === 'de' ? 'Erstattungsrichtlinie' : language === 'fr' ? 'Politique de Remboursement' : 'Refund Policy'}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {language === 'de' ? 'Zuletzt aktualisiert: 25. Juni 2026' : 'Last Updated: June 25, 2026'}
          </p>
        </div>

        {/* Legal Text Card */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Coins className="w-24 h-24 text-neon-cyan" />
          </div>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? '1. Ausschluss des Widerrufsrechts' : '1. Exclusion of the Right of Withdrawal'}
              </h2>
              <p className="text-sm">
                {language === 'de' 
                  ? 'Aufgrund der Beschaffenheit digitaler Produkte (Downloads wie Klaviernoten und MIDI-Dateien) erlischt dein Widerrufsrecht gemäß § 356 Abs. 5 BGB, sobald der Download oder die Bereitstellung des digitalen Inhalts begonnen hat. Mit dem Kauf stimmst du ausdrücklich der sofortigen Ausführung des Vertrages zu und bestätigst deine Kenntnisnahme, dass du dadurch dein gesetzliches Widerrufsrecht verlierst.' 
                  : 'Due to the nature of digital products (downloads such as sheet music and MIDI files), your right of withdrawal expires under EU consumer laws once the download or delivery of the digital content has started. By completing a purchase, you agree to the immediate performance of the contract and acknowledge that you lose your right of withdrawal.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '2. Wann Rückerstattungen gewährt werden' : '2. Eligible Refund Conditions'}
              </h2>
              <p className="text-sm mb-3">
                {language === 'de'
                  ? 'Wir bieten Rückerstattungen in den folgenden Ausnahmefällen an:'
                  : 'We may issue a refund under the following exceptional circumstances:'}
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  {language === 'de'
                    ? 'Doppelter Kauf: Wenn du denselben Song versehentlich mehrfach erworben hast.'
                    : 'Duplicate purchase: If you accidentally purchased the same song multiple times.'}
                </li>
                <li>
                  {language === 'de'
                    ? 'Beschädigte oder falsche Dateien: Wenn die ZIP-Datei beschädigt ist oder das falsche Arrangement enthält und wir dir das korrekte Produkt nicht innerhalb von 48 Stunden bereitstellen können.'
                    : 'Damaged or incorrect files: If the ZIP file is corrupted or contains the wrong arrangement, and we cannot deliver a functional copy within 48 hours.'}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? '3. Beantragung einer Erstattung' : '3. How to Request a Refund'}
              </h2>
              <p className="text-sm">
                {language === 'de'
                   ? 'Um eine Rückerstattung zu beantragen, wende dich bitte unter Angabe deines Kaufbelegs und der Rechnungsnummer an info@meloscribe.dev. Unser Händler Paddle bearbeitet alle berechtigten Rückerstattungsanträge.'
                   : 'To request a refund, please contact us at info@meloscribe.dev with your proof of purchase and invoice number. Our billing partner Paddle handles the processing of all approved refund requests.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '4. Missbrauch von Erstattungen' : '4. Abuse Prevention'}
              </h2>
              <p className="text-sm">
                {language === 'de'
                  ? 'Wir behalten uns das Recht vor, Rückerstattungsanträge abzulehnen, wenn Anzeichen für Missbrauch vorliegen (z. B. wiederholtes Anfordern von Erstattungen nach erfolgreichem Download).'
                  : 'We reserve the right to decline refund requests if there is evidence of abuse (e.g. repeatedly requesting refunds after downloading the arrangements).'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
