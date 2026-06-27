import { ArrowLeft, Lock } from 'lucide-react';

interface DatenschutzProps {
  onBack: () => void;
  language: string;
}

export default function Datenschutz({ onBack, language }: DatenschutzProps) {
  return (
    <div className="min-h-screen bg-neon-gradient text-gray-800 dark:text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-orb-pink w-96 h-96 -top-48 -left-48 opacity-30" />
        <div className="glow-orb glow-orb-cyan w-96 h-96 bottom-10 -right-48 opacity-40" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-neon-pink transition-colors mb-12 group focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'de' ? 'Zurück' : language === 'es' ? 'Volver' : language === 'fr' ? 'Retour' : 'Back'}</span>
        </button>

        {/* Title */}
        <div className="border-b border-gray-200 dark:border-dark-600/50 pb-8 mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient neon-text-pink">
              {language === 'de' ? 'Datenschutzerklärung' : language === 'es' ? 'Política de Privacidad' : language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {language === 'de' ? 'Stand: Juni 2026' : 'Last updated: June 2026'}
          </p>
        </div>

        {/* Legal Text Card */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lock className="w-24 h-24 text-neon-pink" />
          </div>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '1. Datenschutz auf einen Blick' : '1. Privacy at a Glance'}
              </h2>
              <p>
                {language === 'de'
                  ? 'Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.'
                  : 'The protection of your personal data is a key concern for us. We treat your personal data confidentially and in accordance with statutory data protection regulations and this Privacy Policy.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? '2. Verantwortliche Stelle' : '2. Data Controller'}
              </h2>
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">Tobias Baumann</p>
                <p>Wolfgelts 10</p>
                <p>88353 Kißlegg</p>
                <p>{language === 'de' ? 'Deutschland' : 'Germany'}</p>
                <p>E-Mail: <a href="mailto:info@meloscribe.dev" className="hover:text-neon-pink transition-colors"><strong>info@meloscribe.dev</strong></a></p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '3. Hosting & Server-Log-Files (Vercel)' : '3. Hosting & Server Log Files (Vercel)'}
              </h2>
              <p>
                {language === 'de' ? (
                  <>
                    Wir hosten unsere Website bei der <strong>Vercel Inc.</strong> (340 S Lemon Ave #4133, Walnut, CA 91789, USA). 
                    Zur Gewährleistung der Betriebssicherheit, Stabilität und technischen Fehlerdiagnose erfasst Vercel automatisch Server-Log-Dateien bei jedem Webseitenaufruf. 
                    Diese Log-Dateien enthalten unter anderem Ihre IP-Adresse, das Datum und die Uhrzeit der Anfrage, Ihren Browsertyp, das Betriebssystem sowie Referrer-URLs.
                    <br /><br />
                    Die Rechtsgrundlage für diese vorübergehende Datenerfassung ist <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (unser berechtigtes Interesse an der Gewährleistung einer sicheren und fehlerfreien Darstellung unserer Webseite).
                  </>
                ) : (
                  <>
                    We host our website on <strong>Vercel Inc.</strong> (340 S Lemon Ave #4133, Walnut, CA 91789, USA). 
                    To ensure service stability, operational safety, and error diagnostics, Vercel automatically collects server access logs. 
                    These logs contain details such as your IP address, request timestamps, browser type, operating system, and referrer URLs.
                    <br /><br />
                    The legal basis for this temporary data processing is <strong>Art. 6(1)(f) GDPR</strong> (our legitimate interest in maintaining a technically secure and functional web platform).
                  </>
                )}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? '4. Bezahlvorgang & Digitale Auslieferung (Paddle)' : '4. Checkout & Digital Delivery (Paddle)'}
              </h2>
              <p>
                {language === 'de' ? (
                  <>
                    Der Erwerb und Download von Klaviernoten, MIDI- und MP4-Dateien läuft über die Bezahl- und Shop-Plattform <strong>Paddle.com</strong> (Paddle.com Market Ltd).
                    Wenn Sie ein Sheet-Music-Paket erwerben, läuft im Hintergrund folgendes System ab:
                    <br /><br />
                    1. <strong>Der Klick:</strong> Durch Klick auf den „Buy"-Button öffnet sich das sichere Checkout-Overlay von Paddle für das gewählte Produkt.
                    <br />
                    2. <strong>Die Zahlung:</strong> Zur Bestellabwicklung geben Sie Ihre E-Mail-Adresse ein und zahlen per Kreditkarte oder anderen von Paddle unterstützten Methoden.
                    <br />
                    3. <strong>Der Download:</strong> Direkt nach erfolgreicher Zahlung werden Sie auf eine sichere Download-Seite weitergeleitet. Jede Datei (PDF, MIDI, MP4) wird als separater, temporärer 15-Minuten-Link ausgeliefert, der direkt aus dem Cloudflare R2-Speicher bezogen wird.
                    <br />
                    4. <strong>Die Sicherheits-E-Mail:</strong> Paddle sendet automatisch eine Kaufbestätigung mit der Zugangs-URL an Ihre angegebene Adresse, falls Sie die Download-Seite versehentlich schließen. Download-Links können bis zu 20× genutzt werden.
                    <br /><br />
                    Die Rechtsgrundlage ist <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Vertragserfüllung). Die Bindung an temporäre Download-Links dient dem Schutz digitaler Urheberrechte (<strong>Art. 6 Abs. 1 lit. f DSGVO</strong>).
                  </>
                ) : (
                  <>
                    The purchase and download of sheet music PDFs, MIDI, and MP4 files is processed via the checkout and billing platform <strong>Paddle.com</strong> (Paddle.com Market Ltd).
                    When you purchase a practice package, the following step-by-step workflow is initiated:
                    <br /><br />
                    1. <strong>The Click:</strong> Clicking the "Buy" button opens Paddle's secure checkout overlay for the selected product.
                    <br />
                    2. <strong>The Payment:</strong> You enter your email address and pay by credit card or another method supported by Paddle.
                    <br />
                    3. <strong>The Download:</strong> Immediately after a successful transaction, you are redirected to a secure download page. Each file (PDF, MIDI, MP4) is delivered as a separate, temporary 15-minute link served directly from Cloudflare R2 storage.
                    <br />
                    4. <strong>Backup Email:</strong> Paddle automatically sends a purchase confirmation containing your download URL to your inbox. Download links can be used up to 20 times.
                    <br /><br />
                    The legal basis is <strong>Art. 6(1)(b) GDPR</strong> (performance of a contract). The buyer-bound limitation of download links serves the protection of digital copyright (<strong>Art. 6(1)(f) GDPR</strong>).
                  </>
                )}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '5. Ihre Rechte' : '5. Your Rights'}
              </h2>
              <p>
                {language === 'de' ? (
                  <>
                    Sie haben nach der DSGVO jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO) Ihrer bei uns gespeicherten personenbezogenen Daten. 
                    Bitte wenden Sie sich bei Fragen hierzu an die oben genannte E-Mail-Adresse der verantwortlichen Stelle.
                  </>
                ) : (
                  <>
                    Under the GDPR, you have the right to access (Art. 15 GDPR), rectify (Art. 16 GDPR), erase (Art. 17 GDPR), and restrict the processing (Art. 18 GDPR) of your personal data stored by us. 
                    To exercise these rights, please contact the Data Controller at the email address listed above.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
