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
            {language === 'de' 
              ? 'Angaben gemäß § 5 DDG' 
              : language === 'es' 
              ? 'Información conforme al art. 5 de la Ley de Servicios Digitales alemana (DDG)' 
              : language === 'fr' 
              ? 'Informations conformément à l\'art. 5 de la loi allemande sur les services numériques (DDG)' 
              : 'Information provided according to Sec. 5 German Digital Services Act (DDG)'}
          </p>
        </div>

        {/* Legal Text Card */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldAlert className="w-24 h-24 text-neon-cyan" />
          </div>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? 'Betreiber der Website' : language === 'es' ? 'Operador del Sitio Web' : language === 'fr' ? 'Exploitant du Site' : 'Website Operator'}
              </h2>
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">Tobias Baumann</p>
                <p>Wolfgelts 10</p>
                <p>88353 Kißlegg</p>
                <p>{language === 'de' ? 'Deutschland' : language === 'es' ? 'Alemania' : language === 'fr' ? 'Allemagne' : 'Germany'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? 'Kontakt' : language === 'es' ? 'Contacto' : language === 'fr' ? 'Contact' : 'Contact Information'}
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
                {language === 'de' ? 'Umsatzsteuer' : language === 'es' ? 'Impuesto sobre el valor añadido' : language === 'fr' ? 'Taxe sur la valeur ajoutée' : 'VAT / Tax Information'}
              </h2>
              <p className="text-sm">
                {language === 'de'
                  ? 'Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: Entfällt (Kleinunternehmerregelung gemäß § 19 UStG).'
                  : language === 'es'
                  ? 'NIF-IVA según art. 27 a UStG: No aplicable (régimen de pequeñas empresas según art. 19 UStG de la legislación alemana).'
                  : language === 'fr'
                  ? 'Numéro de TVA intracommunautaire selon l\'art. 27 a UStG: Non applicable (régime des petites entreprises selon l\'art. 19 UStG de la législation allemande).'
                  : 'VAT identification number according to Sec. 27 a German VAT Act: Not applicable (small business regulation according to Sec. 19 German VAT Act).'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? 'Redaktionell verantwortlich' : language === 'es' ? 'Responsable editorial' : language === 'fr' ? 'Responsable éditorial' : 'Editorial Responsibility'}
              </h2>
              <p className="text-sm">
                {language === 'de' ? (
                  <>Verantwortlich für redaktionelle Inhalte gemäß § 18 Abs. 2 MStV: Tobias Baumann, Wolfgelts 10, 88353 Kißlegg, Deutschland.</>
                ) : (
                  <>Responsible for editorial content according to Sec. 18 (2) German State Media Treaty (MStV): Tobias Baumann, Wolfgelts 10, 88353 Kißlegg, Germany.</>
                )}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-cyan pl-3">
                {language === 'de' ? 'Verbraucherstreitbeilegung' : language === 'es' ? 'Resolución de litigios de consumo' : language === 'fr' ? 'Règlement des litiges de consommation' : 'Consumer Dispute Resolution'}
              </h2>
              <p className="text-sm">
                {language === 'de'
                  ? 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
                  : language === 'es'
                  ? 'La Comisión Europea ofrece una plataforma para la resolución de litigios en línea (OS): https://ec.europa.eu/consumers/odr/. No estamos obligados ni dispuestos a participar en procedimientos de resolución de conflictos ante una junta arbitral de consumo.'
                  : language === 'fr'
                  ? 'La Commission européenne fournit une plateforme de règlement des litiges en ligne (OS): https://ec.europa.eu/consumers/odr/. Nous ne sommes ni disposés ni obligés de participer à des procédures de règlement des litiges devant un conseil d\'arbitrage des consommateurs.'
                  : 'The European Commission provides a platform for online dispute resolution (ODR): https://ec.europa.eu/consumers/odr/. We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 border-l-2 border-neon-pink pl-3">
                {language === 'de' ? 'Haftungsausschluss' : language === 'es' ? 'Descargo de responsabilidad' : language === 'fr' ? 'Clause de non-responsabilité' : 'Disclaimer'}
              </h2>
              <div className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  {language === 'de' 
                    ? 'Haftung für Inhalte: Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.' 
                    : language === 'es'
                    ? 'Responsabilidad por los contenidos: Los contenidos de nuestras páginas se han elaborado con el máximo esmero. Sin embargo, no podemos garantizar la exactitud, exhaustividad ni actualidad de los mismos.'
                    : language === 'fr'
                    ? 'Responsabilité pour les contenus: Le contenu de nos pages a été créé avec le plus grand soin. Cependant, nous ne pouvons garantir l\'exactitude, l\'exhaustivité ou l\'actualité des contenus.'
                    : 'Liability for Contents: The contents of our pages were created with great care. However, we cannot assume any liability for the correctness, completeness and up-to-dateness of the contents.'}
                </p>
                <p>
                  {language === 'de'
                    ? 'Haftung für Links: Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.'
                    : language === 'es'
                    ? 'Responsabilidad por enlaces: Nuestra oferta contiene enlaces a sitios web externos de terceros sobre cuyos contenidos no tenemos ninguna influencia. Por tanto, no podemos asumir responsabilidad por dichos contenidos externos.'
                    : language === 'fr'
                    ? 'Responsabilité des liens: Notre offre contient des liens vers des sites web externes de tiers sur les contenus desquels nous n\'avons aucune influence. C\'est pourquoi nous déclinons toute responsabilité quant à ces contenus tiers.'
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
