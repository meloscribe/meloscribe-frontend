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
                {language === 'de' ? '4. Bezahlvorgang & Digitale Auslieferung (Stripe)' : '4. Checkout & Digital Delivery (Stripe)'}
              </h2>
              <p>
                {language === 'de' ? (
                  <>
                    Die Bezahlung von Klaviernoten, MIDI- und MP4-Dateien erfolgt über den Zahlungsdienstleister <strong>Stripe</strong> (Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland).
                    Wenn Sie ein Sheet-Music-Paket erwerben, läuft im Hintergrund folgendes System ab:
                    <br /><br />
                    1. <strong>Der Klick:</strong> Durch Klick auf den Kauf-Button öffnet sich das sichere Stripe-Checkout-Fenster.
                    <br />
                    2. <strong>Die Zahlung:</strong> Zur Bestellabwicklung geben Sie Ihre E-Mail-Adresse an und zahlen sicher per Kreditkarte, Apple Pay, Google Pay, PayPal, iDEAL oder weiteren unterstützten Methoden. Stripe verarbeitet Ihre Zahlungsdaten auf PCI-DSS-zertifizierten Servern; wir selbst speichern keine vollständigen Kartendaten.
                    <br />
                    3. <strong>Der Download:</strong> Direkt nach erfolgreicher Zahlung werden Sie auf eine sichere Download-Seite weitergeleitet. Jede Datei (PDF, MIDI, MP4) wird als separater, temporärer Link ausgeliefert, der geschützt aus dem Cloudflare R2-Speicher bezogen wird.
                    <br />
                    4. <strong>Die Sicherheits-E-Mail:</strong> Sie erhalten automatisch eine Kaufbestätigung mit der Bestellnummer und dem Download-Zugang an Ihre angegebene Adresse.
                    <br /><br />
                    Die Rechtsgrundlage ist <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Vertragserfüllung) sowie <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (unser berechtigtes Interesse an einer effizienten und sicheren Zahlungsabwicklung).
                  </>
                ) : (
                  <>
                    The purchase and download of sheet music PDFs, MIDI, and MP4 files is processed via the payment platform <strong>Stripe</strong> (Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Ireland).
                    When you purchase a practice package, the following step-by-step workflow is initiated:
                    <br /><br />
                    1. <strong>The Click:</strong> Clicking the purchase button opens Stripe's secure checkout window for the selected product.
                    <br />
                    2. <strong>The Payment:</strong> You enter your email address and pay securely by credit card, Apple Pay, Google Pay, PayPal, iDEAL, or other supported methods. Stripe processes your details on PCI-DSS certified systems; we never store full credit card details.
                    <br />
                    3. <strong>The Download:</strong> Immediately after a successful transaction, you are redirected to a secure download page. Each file (PDF, MIDI, MP4) is delivered as a separate, secure temporary link served directly from Cloudflare R2 storage.
                    <br />
                    4. <strong>Backup Email:</strong> An automated purchase confirmation containing your order reference and download link is sent to your inbox.
                    <br /><br />
                    The legal basis is <strong>Art. 6(1)(b) GDPR</strong> (performance of a contract) and <strong>Art. 6(1)(f) GDPR</strong> (our legitimate interest in secure payment processing).
                  </>
                )}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '5. Transaktionaler E-Mail-Versand (Resend)' : language === 'es' ? '5. Envío de correos electrónicos (Resend)' : language === 'fr' ? '5. Envoi d\'e-mails transactionnels (Resend)' : '5. Transactional Email Delivery (Resend)'}
              </h2>
              <p>
                {language === 'de' ? (
                  <>
                    Für den zuverlässigen Versand von Bestellbestätigungen, Rechnungsdaten, Download-Zugängen sowie Anmeldebestätigungen (Double-Opt-In) nutzen wir den Dienst <strong>Resend</strong> (Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA). 
                    Hierbei wird Ihre E-Mail-Adresse sowie der Inhalt der Benachrichtigung an die Server von Resend in den USA übermittelt.
                    <br /><br />
                    Die Rechtsgrundlage für die Verarbeitung ist <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Vertragserfüllung zur Auslieferung gekaufter Produkte) bzw. <strong>Art. 6 Abs. 1 lit. a DSGVO</strong> (Einwilligung bei Newsletter-Anmeldung). 
                    Die Datenübertragung in die USA ist durch die Standardvertragsklauseln (SCCs) der EU-Kommission sowie das EU-U.S. Data Privacy Framework (DPF) datenschutzrechtlich abgesichert.
                  </>
                ) : language === 'es' ? (
                  <>
                    Para el envío de confirmaciones de compra, enlaces de descarga y notificaciones de suscripción, utilizamos <strong>Resend</strong> (Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, EE. UU.). 
                    Su dirección de correo electrónico y los datos del pedido se transmiten a los servidores de Resend.
                    <br /><br />
                    La base legal es el <strong>art. 6, ap. 1, letra b del RGPD</strong> (ejecución contractual) y el <strong>art. 6, ap. 1, letra a del RGPD</strong> (consentimiento). La transferencia a EE. UU. está respaldada por las Cláusulas Contractuales Tipo (SCC) de la UE y el marco de privacidad de datos UE-EE. UU. (DPF).
                  </>
                ) : language === 'fr' ? (
                  <>
                    Pour l'envoi de confirmations de commande, de liens de téléchargement et d'e-mails d'inscription, nous utilisons <strong>Resend</strong> (Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, États-Unis). 
                    Votre adresse e-mail et les données de commande sont transmises aux serveurs de Resend.
                    <br /><br />
                    La base juridique est l'<strong>art. 6, par. 1, point b du RGPD</strong> (exécution d'un contrat) et l'<strong>art. 6, par. 1, point a du RGPD</strong> (consentement). Le transfert vers les États-Unis est encadré par les clauses contractuelles types (CCT) de la Commission européenne et le cadre de protection des données UE-États-Unis (DPF).
                  </>
                ) : (
                  <>
                    To send purchase confirmations, order delivery links, and double opt-in subscription emails, we use <strong>Resend</strong> (Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA). 
                    Your email address and transaction data are processed via Resend's infrastructure in the United States.
                    <br /><br />
                    The legal basis is <strong>Art. 6(1)(b) GDPR</strong> (performance of a contract) and <strong>Art. 6(1)(a) GDPR</strong> (consent). Data transfers to the United States are secured through Standard Contractual Clauses (SCCs) and the EU-U.S. Data Privacy Framework (DPF).
                  </>
                )}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? '6. Content Delivery Network & Cloud-Speicher (Cloudflare)' : language === 'es' ? '6. Red de entrega de contenido y almacenamiento (Cloudflare)' : language === 'fr' ? '6. Réseau de diffusion de contenu et stockage (Cloudflare)' : '6. Content Delivery Network & Cloud Storage (Cloudflare)'}
              </h2>
              <p>
                {language === 'de' ? (
                  <>
                    Wir nutzen Dienste der <strong>Cloudflare, Inc.</strong> (101 Townsend St., San Francisco, CA 94107, USA). Cloudflare fungiert als Sicherheits-Reverse-Proxy, Web Application Firewall (WAF) und globales Content Delivery Network (CDN) sowie als Objektspeicher (Cloudflare R2) für die Bereitstellung digitaler Notendateien.
                    <br /><br />
                    Beim Zugriff auf unsere Webseite und beim Abruf von Dateien werden Anfragen über das globale Servernetz von Cloudflare geroutet. Hierbei können IP-Adressen und Telemetriedaten zur Gefahrenabwehr vorübergehend verarbeitet werden.
                    <br /><br />
                    Die Rechtsgrundlage ist <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (unser berechtigtes Interesse an Ausfallsicherheit, Schutz vor DDoS-Angriffen und schneller weltweiter Auslieferung) sowie <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Vertragserfüllung). Die Datenübermittlung in Drittstaaten ist durch Standardvertragsklauseln der EU-Kommission abgesichert.
                  </>
                ) : language === 'es' ? (
                  <>
                    Utilizamos servicios de <strong>Cloudflare, Inc.</strong> (101 Townsend St., San Francisco, CA 94107, EE. UU.) como red de distribución de contenidos (CDN), cortafuegos de aplicaciones web y almacenamiento seguro en la nube (Cloudflare R2) para descargas digitales.
                    <br /><br />
                    La base legal es el <strong>art. 6, ap. 1, letra f del RGPD</strong> (interés legítimo en seguridad y rendimiento) y el <strong>art. 6, ap. 1, letra b del RGPD</strong>. Las transferencias a EE. UU. se amparan en las Cláusulas Contractuales Tipo de la UE.
                  </>
                ) : language === 'fr' ? (
                  <>
                    Nous utilisons les services de <strong>Cloudflare, Inc.</strong> (101 Townsend St., San Francisco, CA 94107, États-Unis) pour la sécurité réseau, la distribution de contenu (CDN) et l'hébergement sécurisé des partitions numériques (Cloudflare R2).
                    <br /><br />
                    La base juridique est l'<strong>art. 6, par. 1, point f du RGPD</strong> (intérêt légitime pour la sécurité et la disponibilité) et l'<strong>art. 6, par. 1, point b du RGPD</strong>. Les transferts vers les États-Unis sont couverts par les clauses contractuelles types de l'UE.
                  </>
                ) : (
                  <>
                    We use the services of <strong>Cloudflare, Inc.</strong> (101 Townsend St., San Francisco, CA 94107, USA) for security, Web Application Firewall (WAF), global Content Delivery Network (CDN), and Cloudflare R2 object storage for digital sheet music assets.
                    <br /><br />
                    Requests are routed through Cloudflare's worldwide network to protect against cyber attacks and ensure high delivery speeds. The legal basis is <strong>Art. 6(1)(f) GDPR</strong> (legitimate interest in high availability and platform security) and <strong>Art. 6(1)(b) GDPR</strong> (contract performance). Transfers to the USA are safeguarded by Standard Contractual Clauses.
                  </>
                )}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? '7. Ihre Rechte' : language === 'es' ? '7. Sus Derechos' : language === 'fr' ? '7. Vos Droits' : '7. Your Rights'}
              </h2>
              <p>
                {language === 'de' ? (
                  <>
                    Sie haben nach der DSGVO jederzeit das Recht auf unentgeltliche Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO) Ihrer bei uns gespeicherten personenbezogenen Daten. 
                    Bitte wenden Sie sich bei Fragen hierzu an <a href="mailto:info@meloscribe.dev" className="text-neon-pink hover:underline"><strong>info@meloscribe.dev</strong></a>.
                  </>
                ) : language === 'es' ? (
                  <>
                    Según el RGPD, tiene derecho de acceso (art. 15), rectificación (art. 16), supresión (art. 17), limitación del tratamiento (art. 18), portabilidad (art. 20) y oposición (art. 21) de sus datos personales. Para ejercer estos derechos, contáctenos en <a href="mailto:info@meloscribe.dev" className="text-neon-pink hover:underline"><strong>info@meloscribe.dev</strong></a>.
                  </>
                ) : language === 'fr' ? (
                  <>
                    Conformément au RGPD, vous disposez d'un droit d'accès (art. 15), de rectification (art. 16), d'effacement (art. 17), de limitation du traitement (art. 18), de portabilité (art. 20) et d'opposition (art. 21) concernant vos données personnelles. Pour exercer ces droits, contactez-nous à <a href="mailto:info@meloscribe.dev" className="text-neon-pink hover:underline"><strong>info@meloscribe.dev</strong></a>.
                  </>
                ) : (
                  <>
                    Under the GDPR, you have the right to access (Art. 15 GDPR), rectify (Art. 16 GDPR), erase (Art. 17 GDPR), restrict processing (Art. 18 GDPR), data portability (Art. 20 GDPR), and object (Art. 21 GDPR) to the processing of your personal data. To exercise these rights, please contact us at <a href="mailto:info@meloscribe.dev" className="text-neon-pink hover:underline"><strong>info@meloscribe.dev</strong></a>.
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
