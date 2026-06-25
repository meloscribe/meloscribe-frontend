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
                <p>E-Mail: <strong>ventoba.sm@gmail.com</strong></p>
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
                {language === 'de' ? '4. Bezahlvorgang & Digitale Auslieferung (Ko-fi)' : '4. Checkout & Digital Delivery (Ko-fi)'}
              </h2>
              <p>
                {language === 'de' ? (
                  <>
                    Der Erwerb und Download von Klaviernoten-PDFs läuft über die Bezahl- und Shop-Plattform <strong>Ko-fi</strong> (Ko-fi Labs). 
                    Wenn Sie ein Sheet erwerben, läuft im Hintergrund folgendes System ab:
                    <br /><br />
                    1. <strong>Der Klick:</strong> Durch Klick auf den Download-Button öffnet sich die sichere Checkout-Schnittstelle von Ko-fi für das gewählte Produkt.
                    <br />
                    2. <strong>Die Zahlung:</strong> Zur Bestellabwicklung geben Sie Ihre E-Mail-Adresse ein und zahlen per PayPal oder Kreditkarte.
                    <br />
                    3. <strong>Der Sofort-Download:</strong> Direkt nach erfolgreicher Zahlung springt das Zahlungsfenster um und bietet einen „Download Files“-Button an. Das PDF-Dokument kann direkt gespeichert werden, ohne unsere Seite zu verlassen.
                    <br />
                    4. <strong>Die Sicherheits-E-Mail:</strong> Ko-fi sendet automatisch eine Bestätigungs-E-Mail mit einem personalisierten, temporären Download-Link an Ihre angegebene Adresse, falls das Fenster versehentlich geschlossen wird.
                    <br /><br />
                    Die Rechtsgrundlage für die Verarbeitung dieser Bestell- und Kontaktdaten ist <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Vertragserfüllung zur Bereitstellung der digitalen Ware). 
                    Die Bindung personalisierter, temporärer Download-Links dient dem Schutz digitaler Urheberrechte vor unbefugter Weiterverbreitung, was unser berechtigtes Interesse nach <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> darstellt.
                  </>
                ) : (
                  <>
                    The purchase and download of sheet music PDFs is processed via the checkout and shop platform <strong>Ko-fi</strong> (Ko-fi Labs). 
                    When you purchase a sheet, the following step-by-step workflow is initiated:
                    <br /><br />
                    1. <strong>The Click:</strong> Clicking the download button opens Ko-fi's secure checkout interface for that specific product.
                    <br />
                    2. <strong>The Payment:</strong> You enter your email address to complete the purchase and pay via PayPal or credit card.
                    <br />
                    3. <strong>Immediate Download:</strong> Instantly after a successful transaction, the checkout window shows a "Download Files" button so you can save your PDF right away without leaving our site.
                    <br />
                    4. <strong>Backup Email:</strong> Ko-fi automatically sends a confirmation email containing a personalized, temporary, buyer-bound download link to your inbox.
                    <br /><br />
                    The legal basis for processing your order and email details is <strong>Art. 6(1)(b) GDPR</strong> (performance of a contract to deliver the digital good). 
                    The buyer-bound limitation of download links serves the protection of digital copyright against unauthorized distribution, which constitutes our legitimate interest according to <strong>Art. 6(1)(f) GDPR</strong>.
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
