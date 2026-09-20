import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ShieldCheck, Download, Music, Tv, FileText, Play, Sparkles, Pause, Volume2, VolumeX, Maximize, Minimize, ArrowLeft, ArrowUpRight, Info, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, StripePaymentElement, StripeExpressCheckoutElement } from '@stripe/stripe-js';

interface PaddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  stripePriceId: string;
  songTitle: string;
  songArtist: string;
  language: string;
  difficulty?: 'Easy' | 'Original' | 'Original / Easy';
  initialDifficulty?: 'Easy' | 'Original';
  hasEasy?: boolean;
  easyStripePriceId?: string;
  easyPrice?: string | number;
  easySongId?: string;
  videoPreviewUrl?: string;
  price?: string | number;
  coverImage?: string;
  isArrangeMe?: boolean;
  arrangemeUrl?: string;
}

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaild.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlock.com': 'outlook.com',
  'yaoo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'protonmai.com': 'protonmail.com',
};

function getDomainSuggestion(email: string): string | null {
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return null;
  const [user, domain] = parts;
  if (!domain || !user) return null;
  
  if (COMMON_DOMAIN_TYPOS[domain] && COMMON_DOMAIN_TYPOS[domain] !== domain) {
    return `${user}@${COMMON_DOMAIN_TYPOS[domain]}`;
  }
  return null;
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
    videoTitle: '2K HD Practice Videos',
    videoDesc: 'Includes the original performance and a slowed-down version with a metronome track for easy practicing.',
    buttonPay: 'Secure Payment with Stripe',
    buttonOpening: 'Opening secure checkout...',
    errorLoad: 'The payment system could not be loaded. Please disable your adblocker and try again.',
    encrypted: 'Payments are securely processed by Stripe. Instant download access after checkout.',
    secureSsl: 'Secure SSL Connection',
    merchantOfRecord: 'Payments processed by Stripe',
    videoSegment: 'Preview Clip (Note: This is only a 60-second preview clip – the full purchase contains the complete arrangement)',
    
    // New translations
    fullArrangementTitle: 'Full Arrangement',
    fullArrangementDesc: 'This learning package contains the complete arrangement of the song from start to finish.',
    packageIncludes: 'Package Includes:',
    packageIncludesDesc: 'Piano Sheets (PDF) + MIDI Files (Normal/Slow) + HD Video Tutorials',
    fairTradeTitle: 'Free Sheet Music Pack',
    fairTradeDesc: "Get the full arrangement (PDF + 2x MIDI + Practice Videos). We'll send the download link straight to your inbox and keep you posted on new releases.",
    fairTradeSubmit: 'Send Download Link',
    fairTradeNotice: 'Unsubscribe anytime with 1 click. No spam, ever.',
    freeDownloadTitle: 'Free Sheet Music Pack',
    freeDownloadDesc: "Get the full arrangement (PDF + 2x MIDI + Practice Videos). We'll send the download link straight to your inbox and keep you posted on new releases.",
    freeDownloadEmailPlaceholder: 'Enter your email...',
    freeDownloadSubmit: 'Send Download Link',
    freeDownloadNotice: 'Unsubscribe anytime with 1 click. No spam, ever.',
    freeDownloadSending: 'Sending download link...',
    freeDownloadSuccessTitle: 'Check your inbox!',
    freeDownloadSuccessDesc: 'We sent your confirmation and download link to {email}. Please check your inbox (and spam folder) to access your files.',
    freeDownloadConsent: 'I agree to receive the download link and occasional piano arrangement updates. You can unsubscribe anytime with one click.',
    freeDownloadTypoSuggestion: 'Did you mean {suggestion}?',
    freeDownloadInvalidEmail: 'Please enter a valid email address.',
    freeDownloadConsentRequired: 'Please agree to receive the download link to continue.',
    freeDownloadDone: 'Done',
    paySecurely: 'Pay Securely',
    redirectingStripe: 'Opening secure checkout...',
    checkoutSubtext: 'All files will be available for instant download immediately after payment.',
    easyTitle: 'Simplified Version (Easy)',
    easyDesc: 'Specially arranged for beginners – easy to learn, yet sounds excellent.',
    pdfCondensedTitle: 'Sheet music (PDF)',
    pdfCondensedDesc: 'Precise piano sheets of the song section as shown in the video.',
    midiCondensedTitle: 'MIDI Files (Normal + Slow)',
    midiCondensedDesc: 'Practice MIDIs of the song section for Synthesia or your DAW.',
    videoCondensedTitle: '2K HD Video Tutorials',
    videoCondensedDesc: 'The tutorial video offline in normal & slow speed.',
    
    // Button & Version Labels
    buyOriginalVersion: 'Buy Original Version',
    buyEasyVersion: 'Buy Easy Version',
    versionOriginal: 'Original',
    versionEasy: 'Easy',
    selectDifficulty: 'Select Difficulty:',

    // Free download button labels
    pdfFreeLabel: 'Sheet PDF',
    videoOriginalLabel: 'Video (Original Speed)',
    videoSlowLabel: 'Video (Slow Practice)',
    midiOriginalLabel: 'MIDI (Original Speed)',
    midiSlowLabel: 'MIDI (Slow Practice)',
    backToSelection: 'Back to selection',
    loadingCheckout: 'Loading secure checkout...',
    orCardKlarna: 'or',
    orPayWithCard: 'or pay with card',
    contactInformation: 'Contact Information',
    paymentMethod: 'Payment Method',
    payNow: 'Pay {price}',
    processingPayment: 'Processing payment...',
    pciCompliant: 'Instant download after purchase',
    loadingExpress: 'Loading Express Checkout...',
    payWithCard: 'Credit or Debit Card',
    cardBrands: 'Visa, Mastercard, Amex',
    invalidEmail: 'Please enter a valid email address for sheet music delivery.',
    paymentFailed: 'Payment failed. Please check your details.',
    paymentProcessingError: 'Payment processing error.',
    failedToLoadCheckout: 'Failed to load checkout.',
    retry: 'Retry',
    emailPlaceholder: 'name@example.com',
    paymentsSecuredByStripe: 'Payments secured by Stripe',
    failedToRedirectStripe: 'Failed to redirect to Stripe: ',
    payWithPaypal: 'Pay with PayPal',
    optionalForPaypal: '(optional with PayPal)',
    emailPlaceholderPaypal: 'name@example.com (handled by PayPal)',
    tiktokDownloadNotice: 'Downloads do not work directly in the TikTok browser: Tap "..." in the top right corner and choose "Open in browser" (Chrome / Safari).',
    inAppDownloadNotice: 'If downloads do not start in the in-app browser: Tap "..." in the top right corner and choose "Open in browser" (Chrome / Safari).',
    tapHere: 'Tap here (...) and open browser',
    getOnArrangeMe: 'Get on Sheet Music Direct',
    getOnArrangeMeDesc: 'Purchase and download the official sheet music (PDF) directly via Sheet Music Direct / Sheet Music Plus.',
    packageIncludesArrangeMe: 'Official Piano Sheet Music (PDF)',
  },
  de: {
    checkoutGate: 'Sicherer Checkout',
    title: 'Noten & Lernpakete freischalten',
    included: 'In diesem Lernpaket enthalten:',
    pdfTitle: 'Vollständige Noten (PDF)',
    pdfDesc: 'Präzise transkribierte Klaviernoten zum Ausdrucken oder für Tablets.',
    midiTitle: 'High-Quality MIDI-Dateien (Normal + Langsam)',
    midiDesc: 'Lade die MIDIs in Synthesia, deine DAW oder dein Digitalpiano.',
    videoTitle: '2K HD Übungsvideos',
    videoDesc: 'Enthält die Originalversion und eine verlangsamte Version mit Metronom-Spur zum einfachen Üben.',
    buttonPay: 'Sicher bezahlen mit Stripe',
    buttonOpening: 'Öffne sicheren Checkout...',
    errorLoad: 'Das Zahlungssystem konnte nicht geladen werden. Bitte deaktiviere deinen Werbeblocker und versuche es erneut.',
    encrypted: 'Zahlungsabwicklung erfolgt verschlüsselt über Stripe. Sofortiger Download-Zugriff nach Kaufabschluss.',
    secureSsl: 'Sichere SSL-Verbindung',
    merchantOfRecord: 'Zahlungsabwicklung durch Stripe',
    videoSegment: 'Ausschnitt-Vorschau (Hinweis: Dies ist nur ein 60-Sekunden-Ausschnitt – die Vollversion enthält das komplette Arrangement)',
    
    // New translations
    fullArrangementTitle: 'Vollständiges Arrangement',
    fullArrangementDesc: 'Dieses Lernpaket beinhaltet das vollständige Arrangement des Songs von Anfang bis Ende.',
    packageIncludes: 'Inbegriffen im Paket:',
    packageIncludesDesc: 'Klaviernoten (PDF) + MIDI-Dateien (Normal/Langsam) + HD-Video-Tutorials',
    fairTradeTitle: 'Kostenloses Notenpaket',
    fairTradeDesc: 'Hol dir das komplette Arrangement (PDF + 2x MIDI + Übe-Videos). Wir senden den Download-Link direkt in dein Postfach und halten dich über neue Releases auf dem Laufenden.',
    fairTradeSubmit: 'Download-Link senden',
    fairTradeNotice: 'Jederzeit mit 1 Klick abmelden. Kein Spam, garantiert.',
    freeDownloadTitle: 'Kostenloses Notenpaket',
    freeDownloadDesc: 'Hol dir das komplette Arrangement (PDF + 2x MIDI + Übe-Videos). Wir senden den Download-Link direkt in dein Postfach und halten dich über neue Releases auf dem Laufenden.',
    freeDownloadEmailPlaceholder: 'E-Mail-Adresse eingeben...',
    freeDownloadSubmit: 'Download-Link senden',
    freeDownloadNotice: 'Jederzeit mit 1 Klick abmelden. Kein Spam, garantiert.',
    freeDownloadSending: 'Download-Link wird gesendet...',
    freeDownloadSuccessTitle: 'Prüfe dein Postfach!',
    freeDownloadSuccessDesc: 'Wir haben deinen Bestätigungs- und Download-Link an {email} gesendet. Bitte prüfe deinen Posteingang (und Spam-Ordner), um auf deine Dateien zuzugreifen.',
    freeDownloadConsent: 'Ich stimme zu, den Download-Link und gelegentliche Updates zu neuen Klavier-Arrangements zu erhalten. Eine Abmeldung ist jederzeit mit einem Klick möglich.',
    freeDownloadTypoSuggestion: 'Meintest du {suggestion}?',
    freeDownloadInvalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    freeDownloadConsentRequired: 'Bitte stimme dem Erhalt des Download-Links zu, um fortzufahren.',
    freeDownloadDone: 'Fertig',
    paySecurely: 'Jetzt sicher bezahlen',
    redirectingStripe: 'Öffne sicheren Checkout...',
    checkoutSubtext: 'Alle Dateien stehen direkt nach der Zahlung zum sofortigen Download bereit.',
    easyTitle: 'Vereinfachte Version (Easy)',
    easyDesc: 'Speziell für Anfänger arrangiert – leicht zu lernen, klingt trotzdem hervorragend.',
    pdfCondensedTitle: 'Klaviernoten (PDF)',
    pdfCondensedDesc: 'Präzise Klaviernoten des Song-Ausschnitts wie im Video.',
    midiCondensedTitle: 'MIDI-Dateien (Normal + Langsam)',
    midiCondensedDesc: 'Lern-MIDIs des Song-Teils für Synthesia oder deine DAW.',
    videoCondensedTitle: '2K HD Video-Tutorials',
    videoCondensedDesc: 'Das Tutorial-Video offline in normalem & langsamem Tempo.',
    
    // Button & Version Labels
    buyOriginalVersion: 'Originalversion kaufen',
    buyEasyVersion: 'Easy-Version kaufen',
    versionOriginal: 'Original',
    versionEasy: 'Easy',
    selectDifficulty: 'Schwierigkeit wählen:',

    // Free download button labels
    pdfFreeLabel: 'Klaviernoten (PDF)',
    videoOriginalLabel: 'Video (Originaltempo)',
    videoSlowLabel: 'Video (Langsam)',
    midiOriginalLabel: 'MIDI (Originaltempo)',
    midiSlowLabel: 'MIDI (Langsam)',
    backToSelection: 'Zurück zur Auswahl',
    loadingCheckout: 'Sicherer Checkout wird geladen...',
    orCardKlarna: 'oder',
    orPayWithCard: 'oder mit Karte bezahlen',
    contactInformation: 'Kontaktinformationen',
    paymentMethod: 'Zahlungsmethode',
    payNow: 'Jetzt {price} bezahlen',
    processingPayment: 'Zahlung wird verarbeitet...',
    pciCompliant: 'Sofortiger Download nach Kauf',
    loadingExpress: 'Express Checkout wird geladen...',
    payWithCard: 'Kreditkarte / Debitkarte',
    cardBrands: 'Visa, Mastercard, Amex',
    invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse für den Download-Link an.',
    paymentFailed: 'Zahlung fehlgeschlagen. Bitte prüfe deine Angaben.',
    paymentProcessingError: 'Fehler bei der Zahlungsabwicklung.',
    failedToLoadCheckout: 'Fehler beim Laden des Checkouts.',
    retry: 'Erneut versuchen',
    emailPlaceholder: 'name@beispiel.de',
    paymentsSecuredByStripe: 'Zahlungsabwicklung durch Stripe',
    failedToRedirectStripe: 'Fehler beim Weiterleiten zu Stripe: ',
    payWithPaypal: 'Mit PayPal bezahlen',
    optionalForPaypal: '(optional bei PayPal)',
    emailPlaceholderPaypal: 'name@beispiel.de (wird von PayPal übernommen)',
    tiktokDownloadNotice: 'Downloads funktionieren im TikTok-Browser nicht direkt: Tippe oben rechts auf „...“ und wähle „Im Browser öffnen“ (Chrome / Safari).',
    inAppDownloadNotice: 'Falls der Download im App-Browser nicht startet: Tippe oben rechts auf „...“ und wähle „Im Browser öffnen“ (Chrome / Safari).',
    tapHere: 'Hier tippen (...) und im Browser öffnen',
    getOnArrangeMe: 'Auf Sheet Music Direct kaufen',
    getOnArrangeMeDesc: 'Erwirb und lade die offiziellen Noten (PDF) direkt über Sheet Music Direct / Sheet Music Plus herunter.',
    packageIncludesArrangeMe: 'Offizielle Klaviernoten (PDF)',
  },
  fr: {
    checkoutGate: 'Paiement Sécurisé',
    title: 'Débloquer les partitions et ressources',
    included: 'Inclus dans ce pack d\'apprentissage :',
    pdfTitle: 'Partitions complètes (PDF)',
    pdfDesc: 'Partitions de piano précisément transcrites pour impression ou tablettes.',
    midiTitle: 'Fichiers MIDI haute qualité (Normal + Lent)',
    midiDesc: 'Chargez les fichiers MIDI dans Synthesia, votre DAW ou votre piano numérique.',
    videoTitle: 'Vidéos de pratique 2K HD',
    videoDesc: 'Comprend la performance originale et une version ralentie avec une piste de métronome pour s\'entraîner facilement.',
    buttonPay: 'Paiement sécurisé avec Stripe',
    buttonOpening: 'Ouverture du paiement sécurisé...',
    errorLoad: 'Le système de paiement n\'a pas pu être chargé. Veuillez désactiver votre bloqueur de publicité et réessayer.',
    encrypted: 'Les paiements sont traités de manière sécurisée par Stripe. Accès instantané au téléchargement après l\'achat.',
    secureSsl: 'Connexion SSL sécurisée',
    merchantOfRecord: 'Paiements traités par Stripe',
    videoSegment: 'Aperçu (Note : Ceci est seulement un extrait de 60 secondes – l\'arrangement complet est inclus après l\'achat)',
    
    // New translations
    fullArrangementTitle: 'Arrangement Complet',
    fullArrangementDesc: 'Ce pack d\'apprentissage contient l\'arrangement complet de la chanson du début à la fin.',
    packageIncludes: 'Inclus dans le pack :',
    packageIncludesDesc: 'Partitions de piano (PDF) + Fichiers MIDI (Normal/Lent) + Tutoriels vidéo HD',
    fairTradeTitle: 'Pack de Partitions Gratuites',
    fairTradeDesc: "Obtenez l'arrangement complet (PDF + 2x MIDI + Vidéos d'entraînement). Nous vous envoyons le lien de téléchargement directement par e-mail et vous tenons informé des nouveautés.",
    fairTradeSubmit: 'Envoyer le lien de téléchargement',
    fairTradeNotice: 'Désinscription en 1 clic à tout moment. Garanti sans spam.',
    freeDownloadTitle: 'Pack de Partitions Gratuites',
    freeDownloadDesc: "Obtenez l'arrangement complet (PDF + 2x MIDI + Vidéos d'entraînement). Nous vous envoyons le lien de téléchargement directement par e-mail et vous tenons informé des nouveautés.",
    freeDownloadEmailPlaceholder: 'Entrez votre e-mail...',
    freeDownloadSubmit: 'Envoyer le lien de téléchargement',
    freeDownloadNotice: 'Désinscription en 1 clic à tout moment. Garanti sans spam.',
    freeDownloadSending: 'Envoi du lien en cours...',
    freeDownloadSuccessTitle: 'Vérifiez votre boîte de réception !',
    freeDownloadSuccessDesc: 'Nous avons envoyé votre confirmation et lien de téléchargement à {email}. Veuillez vérifier votre boîte de réception (et vos spams) pour accéder à vos fichiers.',
    freeDownloadConsent: 'J\'accepte de recevoir le lien de téléchargement et des informations occasionnelles sur les arrangements de piano. Vous pouvez vous désabonner à tout moment en un clic.',
    freeDownloadTypoSuggestion: 'Vouliez-vous dire {suggestion} ?',
    freeDownloadInvalidEmail: 'Veuillez saisir une adresse e-mail valide.',
    freeDownloadConsentRequired: 'Veuillez accepter de recevoir le lien de téléchargement pour continuer.',
    freeDownloadDone: 'Terminé',
    paySecurely: 'Payer en toute sécurité',
    redirectingStripe: 'Redirection vers le paiement sécurisé...',
    checkoutSubtext: 'Tous les fichiers seront disponibles en téléchargement instantané immédiatement après le paiement.',
    easyTitle: 'Version Simplifiée (Easy)',
    easyDesc: 'Spécialement arrangé pour les débutants – facile à apprendre, tout en restant excellent.',
    pdfCondensedTitle: 'Partitions de piano (PDF)',
    pdfCondensedDesc: 'Partitions de piano précises de la section de la chanson comme indiqué dans la vidéo.',
    midiCondensedTitle: 'Fichiers MIDI (Normal + Lent)',
    midiCondensedDesc: 'Fichiers MIDI d\'entraînement pour Synthesia ou votre DAW.',
    videoCondensedTitle: 'Tutoriels Vidéo 2K HD',
    videoCondensedDesc: 'La vidéo du tutoriel hors ligne en vitesse normale et lente.',
    
    // Button & Version Labels
    buyOriginalVersion: 'Acheter la version originale',
    buyEasyVersion: 'Acheter la version facile (Easy)',
    versionOriginal: 'Originale',
    versionEasy: 'Facile (Easy)',
    selectDifficulty: 'Choisir la difficulté :',

    // Free download button labels
    pdfFreeLabel: 'Partition PDF',
    videoOriginalLabel: 'Vidéo (Vitesse Normale)',
    videoSlowLabel: 'Vidéo (Lente)',
    midiOriginalLabel: 'MIDI (Vitesse Normale)',
    midiSlowLabel: 'MIDI (Lent)',
    backToSelection: 'Retour à la sélection',
    loadingCheckout: 'Chargement du paiement sécurisé...',
    orCardKlarna: 'ou',
    orPayWithCard: 'ou payer par carte',
    contactInformation: 'Coordonnées',
    paymentMethod: 'Moyen de paiement',
    payNow: 'Payer {price}',
    processingPayment: 'Traitement du paiement...',
    pciCompliant: 'Téléchargement instantané après l\'achat',
    loadingExpress: 'Chargement du paiement express...',
    payWithCard: 'Carte bancaire',
    cardBrands: 'Visa, Mastercard, Amex',
    invalidEmail: 'Veuillez saisir une adresse e-mail valide pour la livraison des partitions.',
    paymentFailed: 'Le paiement a échoué. Veuillez vérifier vos informations.',
    paymentProcessingError: 'Erreur lors du traitement du paiement.',
    failedToLoadCheckout: 'Échec du chargement du paiement.',
    retry: 'Réessayer',
    emailPlaceholder: 'nom@exemple.fr',
    paymentsSecuredByStripe: 'Paiements sécurisés par Stripe',
    failedToRedirectStripe: 'Échec de la redirection vers Stripe : ',
    payWithPaypal: 'Payer avec PayPal',
    optionalForPaypal: '(facultatif avec PayPal)',
    emailPlaceholderPaypal: 'nom@exemple.fr (géré par PayPal)',
    tiktokDownloadNotice: 'Les téléchargements ne fonctionnent pas directement dans le navigateur TikTok : appuyez sur « ... » en haut à droite et choisissez « Ouvrir dans le navigateur » (Safari / Chrome).',
    inAppDownloadNotice: 'Si le téléchargement ne démarre pas : appuyez sur « ... » en haut à droite et choisissez « Ouvrir dans le navigateur » (Safari / Chrome).',
    tapHere: 'Appuyez ici (...) et ouvrez dans le navigateur',
    getOnArrangeMe: 'Acheter sur Sheet Music Direct',
    getOnArrangeMeDesc: 'Achetez et téléchargez la partition officielle (PDF) directement sur Sheet Music Direct / Sheet Music Plus.',
    packageIncludesArrangeMe: 'Partition de piano officielle (PDF)',
  },
  es: {
    checkoutGate: 'Pago Seguro',
    title: 'Desbloquear partituras y recursos',
    included: 'Incluido en este paquete de aprendizaje:',
    pdfTitle: 'Partituras completas (PDF)',
    pdfDesc: 'Partituras de piano transcritas con precisión para imprimir o usar en tabletas.',
    midiTitle: 'Archivos MIDI de alta calidad (Normal + Lento)',
    midiDesc: 'Carga los MIDIs en Synthesia, tu DAW o tu piano digital.',
    videoTitle: 'Videos de práctica 2K HD',
    videoDesc: 'Incluye la interpretación original y una versión más lenta con pista de metrónomo para practicar fácilmente.',
    buttonPay: 'Pago seguro con Stripe',
    buttonOpening: 'Abriendo pago seguro...',
    errorLoad: 'No se pudo cargar el sistema de pago. Desactiva tu bloqueador de anuncios e inténtalo de nuevo.',
    encrypted: 'Los pagos se procesan de forma segura a través de Stripe. Acceso de descarga instantánea tras la compra.',
    secureSsl: 'Conexión SSL segura',
    merchantOfRecord: 'Pagos procesados por Stripe',
    videoSegment: 'Vista previa (Nota: Esto es solo un fragmento de 60 segundos – la compra incluye el arreglo completo)',
    
    // New translations
    fullArrangementTitle: 'Arreglo Completo',
    fullArrangementDesc: 'Este paquete de aprendizaje contiene el arreglo completo de la canción de principio a fin.',
    packageIncludes: 'Incluido en el paquete:',
    packageIncludesDesc: 'Partituras de piano (PDF) + Archivos MIDI (Normal/Lento) + Tutoriales en video HD',
    fairTradeTitle: 'Pack de Partituras Gratis',
    fairTradeDesc: 'Consigue el arreglo completo (PDF + 2x MIDI + Vídeos de práctica). Te enviamos el enlace de descarga directo a tu correo y te avisamos de nuevos lanzamientos.',
    fairTradeSubmit: 'Enviar enlace de descarga',
    fairTradeNotice: 'Cancela tu suscripción con 1 clic en cualquier momento. Cero spam.',
    freeDownloadTitle: 'Pack de Partituras Gratis',
    freeDownloadDesc: 'Consigue el arreglo completo (PDF + 2x MIDI + Vídeos de práctica). Te enviamos el enlace de descarga directo a tu correo y te avisamos de nuevos lanzamientos.',
    freeDownloadEmailPlaceholder: 'Introduce tu correo...',
    freeDownloadSubmit: 'Enviar enlace de descarga',
    freeDownloadNotice: 'Cancela tu suscripción con 1 clic en cualquier momento. Cero spam.',
    freeDownloadSending: 'Enviando enlace de descarga...',
    freeDownloadSuccessTitle: '¡Revisa tu bandeja de entrada!',
    freeDownloadSuccessDesc: 'Hemos enviado tu confirmación y enlace de descarga a {email}. Revisa tu bandeja de entrada (y la carpeta de spam) para acceder a tus archivos.',
    freeDownloadConsent: 'Acepto recibir el enlace de descarga y actualizaciones ocasionales sobre arreglos de piano. Puedes darte de baja en cualquier momento con un solo clic.',
    freeDownloadTypoSuggestion: '¿Quisiste decir {suggestion}?',
    freeDownloadInvalidEmail: 'Por favor ingresa un correo electrónico válido.',
    freeDownloadConsentRequired: 'Por favor acepta recibir el enlace de descarga para continuar.',
    freeDownloadDone: 'Listo',
    paySecurely: 'Pagar de forma segura',
    redirectingStripe: 'Redirigiendo al pago seguro...',
    checkoutSubtext: 'Todos los archivos estarán disponibles para descarga instantánea inmediatamente después del pago.',
    easyTitle: 'Versión Simplificada (Easy)',
    easyDesc: 'Especialmente organizado para principiantes: fácil de aprender, pero suena excelente.',
    pdfCondensedTitle: 'Partituras de piano (PDF)',
    pdfCondensedDesc: 'Partituras de piano precisas de la sección de la canción como se muestra en el video.',
    midiCondensedTitle: 'Archivos MIDI (Normal + Lento)',
    midiCondensedDesc: 'MIDIs de práctica de la sección de la canción para Synthesia o tu DAW.',
    videoCondensedTitle: 'Tutoriales en Video 2K HD',
    videoCondensedDesc: 'El video tutorial sin conexión en velocidad normal y lenta.',
    
    // Button & Version Labels
    buyOriginalVersion: 'Comprar versión original',
    buyEasyVersion: 'Comprar versión fácil (Easy)',
    versionOriginal: 'Original',
    versionEasy: 'Fácil (Easy)',
    selectDifficulty: 'Seleccionar dificultad:',

    // Free download button labels
    pdfFreeLabel: 'Partitura PDF',
    videoOriginalLabel: 'Video (Velocidad Normal)',
    videoSlowLabel: 'Video (Lento)',
    midiOriginalLabel: 'MIDI (Velocidad Normal)',
    midiSlowLabel: 'MIDI (Lento)',
    backToSelection: 'Volver a la selección',
    loadingCheckout: 'Cargando pago seguro...',
    orCardKlarna: 'o',
    orPayWithCard: 'o pagar con tarjeta',
    contactInformation: 'Información de contacto',
    paymentMethod: 'Método de pago',
    payNow: 'Pagar {price}',
    processingPayment: 'Procesando el pago...',
    pciCompliant: 'Descarga instantánea tras la compra',
    loadingExpress: 'Cargando pago exprés...',
    payWithCard: 'Tarjeta de crédito o débito',
    cardBrands: 'Visa, Mastercard, Amex',
    invalidEmail: 'Por favor ingresa un correo electrónico válido para la entrega de las partituras.',
    paymentFailed: 'El pago falló. Por favor verifica tus datos.',
    paymentProcessingError: 'Error en el procesamiento del pago.',
    failedToLoadCheckout: 'Error al cargar el pago.',
    retry: 'Reintentar',
    emailPlaceholder: 'nombre@ejemplo.es',
    paymentsSecuredByStripe: 'Pagos asegurados por Stripe',
    failedToRedirectStripe: 'Error al redirigir a Stripe: ',
    payWithPaypal: 'Pagar con PayPal',
    optionalForPaypal: '(opcional con PayPal)',
    emailPlaceholderPaypal: 'nombre@ejemplo.es (gestionado por PayPal)',
    tiktokDownloadNotice: 'Las descargas no funcionan directamente en el navegador de TikTok: toca "..." en la esquina superior derecha y selecciona "Abrir en el navegador" (Safari / Chrome).',
    inAppDownloadNotice: 'Si la descarga no se inicia: toca "..." en la esquina superior derecha y selecciona "Abrir en el navegador" (Safari / Chrome).',
    tapHere: 'Toca aquí (...) y abre en el navegador',
    getOnArrangeMe: 'Comprar en Sheet Music Direct',
    getOnArrangeMeDesc: 'Compra y descarga la partitura oficial (PDF) directamente a través de Sheet Music Direct / Sheet Music Plus.',
    packageIncludesArrangeMe: 'Partitura de piano oficial (PDF)',
  },
  it: {
    checkoutGate: 'Pagamento Sicuro',
    title: 'Sblocca gli spartiti e le risorse',
    included: 'Incluso in questo pacchetto di apprendimento:',
    pdfTitle: 'Spartiti completi (PDF)',
    pdfDesc: 'Spartiti per pianoforte trascritti con precisione per la stampa o tablet.',
    midiTitle: 'File MIDI di alta qualità (Normale + Lento)',
    midiDesc: 'Carica i MIDI in Synthesia, nella tua DAW o sul tuo pianoforte digitale.',
    videoTitle: 'Video di pratica 2K HD',
    videoDesc: 'Include l\'esecuzione originale e una versione rallentata con traccia metronomo per esercitarsi facilmente.',
    buttonPay: 'Pagamento sicuro con Stripe',
    buttonOpening: 'Apertura del pagamento sicuro...',
    errorLoad: 'Il sistema di pagamento non può essere caricato. Disattiva il blocco degli annunci e riprova.',
    encrypted: 'I pagamenti sono elaborati in modo sicuro da Stripe. Accesso immediato al download dopo l\'acquisto.',
    secureSsl: 'Connessione SSL sicura',
    merchantOfRecord: 'Pagamenti elaborati da Stripe',
    videoSegment: 'Anteprima (Nota: Questo è solo un estratto di 60 secondi – l\'acquisto include l\'arrangiamento completo)',
    
    // New translations
    fullArrangementTitle: 'Arrangiamento Completo',
    fullArrangementDesc: 'Questo pacchetto di apprendimento contiene l\'arrangiamento completo della canzone dall\'inizio alla fine.',
    packageIncludes: 'Incluso nel pacchetto:',
    packageIncludesDesc: 'Spartiti per pianoforte (PDF) + File MIDI (Normale/Lento) + Video tutorial HD',
    fairTradeTitle: 'Pacchetto Spartiti Gratuiti',
    fairTradeDesc: "Ottieni l'arrangiamento completo (PDF + 2x MIDI + Video di pratica). Inviamo il link di download direttamente nella tua casella e ti aggiorniamo sulle nuove uscite.",
    fairTradeSubmit: 'Invia link di download',
    fairTradeNotice: 'Disiscriviti in qualsiasi momento con 1 clic. Zero spam.',
    freeDownloadTitle: 'Pacchetto Spartiti Gratuiti',
    freeDownloadDesc: "Ottieni l'arrangiamento completo (PDF + 2x MIDI + Video di pratica). Inviamo il link di download direttamente nella tua casella e ti aggiorniamo sulle nuove uscite.",
    freeDownloadEmailPlaceholder: 'Inserisci la tua email...',
    freeDownloadSubmit: 'Invia link di download',
    freeDownloadNotice: 'Disiscriviti in qualsiasi momento con 1 clic. Zero spam.',
    freeDownloadSending: 'Invio link in corso...',
    freeDownloadSuccessTitle: 'Controlla la tua casella di posta!',
    freeDownloadSuccessDesc: 'Abbiamo inviato la conferma e il link di download a {email}. Controlla la tua casella di posta (e la cartella spam) per accedere ai tuoi file.',
    freeDownloadConsent: 'Accetto di ricevere il link di download e aggiornamenti occasionali sugli arrangiamenti per pianoforte. Puoi disiscriverti in qualsiasi momento con un clic.',
    freeDownloadTypoSuggestion: 'Intendevi {suggestion}?',
    freeDownloadInvalidEmail: 'Inserisci un indirizzo email valido.',
    freeDownloadConsentRequired: 'Accetta di ricevere il link di download per continuare.',
    freeDownloadDone: 'Fatto',
    paySecurely: 'Paga in sicurezza',
    redirectingStripe: 'Reindirizzamento al pagamento sicuro...',
    checkoutSubtext: 'Tutti i file saranno disponibili per il download istantaneo subito dopo il pagamento.',
    easyTitle: 'Versione Semplificata (Easy)',
    easyDesc: 'Ideato appositamente per i principianti: facile da imparare, ma con un suono eccellente.',
    pdfCondensedTitle: 'Spartiti per pianoforte (PDF)',
    pdfCondensedDesc: 'Spartiti accurati della sezione della canzone come mostrato nel video.',
    midiCondensedTitle: 'File MIDI (Normale + Lento)',
    midiCondensedDesc: 'MIDI per esercitarsi con la sezione del brano per Synthesia o DAW.',
    videoCondensedTitle: 'Video Tutorial 2K HD',
    videoCondensedDesc: 'Il video tutorial offline a velocità normale e rallentata.',
    
    // Button & Version Labels
    buyOriginalVersion: 'Acquista versione originale',
    buyEasyVersion: 'Acquista versione facile (Easy)',
    versionOriginal: 'Originale',
    versionEasy: 'Facile (Easy)',
    selectDifficulty: 'Seleziona difficoltà:',

    // Free download button labels
    pdfFreeLabel: 'Spartito PDF',
    videoOriginalLabel: 'Video (Velocità Normale)',
    videoSlowLabel: 'Video (Lento)',
    midiOriginalLabel: 'MIDI (Velocità Normale)',
    midiSlowLabel: 'MIDI (Lento)',
    backToSelection: 'Torna alla selezione',
    loadingCheckout: 'Caricamento del pagamento sicuro...',
    orCardKlarna: 'o',
    orPayWithCard: 'o paga con carta',
    contactInformation: 'Informazioni di contatto',
    paymentMethod: 'Metodo di pagamento',
    payNow: 'Paga {price}',
    processingPayment: 'Elaborazione del pagamento...',
    pciCompliant: 'Download immediato dopo l\'acquisto',
    loadingExpress: 'Caricamento pagamento rapido...',
    payWithCard: 'Carta di credito o debito',
    cardBrands: 'Visa, Mastercard, Amex',
    invalidEmail: 'Inserisci un indirizzo email valido per la consegna degli spartiti.',
    paymentFailed: 'Pagamento non riuscito. Controlla i tuoi dati.',
    paymentProcessingError: 'Errore durante l\'elaborazione del pagamento.',
    failedToLoadCheckout: 'Impossibile caricare il pagamento.',
    retry: 'Riprova',
    emailPlaceholder: 'nome@esempio.it',
    paymentsSecuredByStripe: 'Pagamenti protetti da Stripe',
    failedToRedirectStripe: 'Impossibile reindirizzare a Stripe: ',
    payWithPaypal: 'Paga con PayPal',
    optionalForPaypal: '(facoltativo con PayPal)',
    emailPlaceholderPaypal: 'nome@esempio.it (gestito da PayPal)',
    tiktokDownloadNotice: 'I download non funzionano direttamente nel browser TikTok: tocca "..." in alto a destra e seleziona "Apri nel browser" (Safari / Chrome).',
    inAppDownloadNotice: 'Se il download non si avvia: tocca "..." in alto a destra e seleziona "Apri nel browser" (Safari / Chrome).',
    tapHere: 'Tocca qui (...) e apri nel browser',
    getOnArrangeMe: 'Acquista su Sheet Music Direct',
    getOnArrangeMeDesc: 'Acquista e scarica lo spartito ufficiale (PDF) direttamente tramite Sheet Music Direct / Sheet Music Plus.',
    packageIncludesArrangeMe: 'Spartito per pianoforte ufficiale (PDF)',
  }
};

export default function PaddleModal({ 
  isOpen, 
  onClose, 
  songId, 
  stripePriceId, 
  songTitle, 
  songArtist, 
  language, 
  difficulty = 'Original',
  initialDifficulty,
  hasEasy,
  easyStripePriceId,
  easyPrice,
  easySongId,
  videoPreviewUrl, 
  price, 
  coverImage,
  isArrangeMe = false,
  arrangemeUrl
}: PaddleModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [showTiktokModal, setShowTiktokModal] = useState(false);

  const [checkoutStep, setCheckoutStep] = useState<'details' | 'embedded'>('details');
  const [isEmbeddedLoading, setIsEmbeddedLoading] = useState(false);
  const [embeddedError, setEmbeddedError] = useState<string | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentFormError, setPaymentFormError] = useState<string | null>(null);
  const [expressAvailable, setExpressAvailable] = useState(false);
  const [hasStripeExpress, setHasStripeExpress] = useState(false);
  const [stripeHasPayPalExpress, setStripeHasPayPalExpress] = useState(false);
  const [expressReady, setExpressReady] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Free song email-gating states
  const [freeEmail, setFreeEmail] = useState('');
  const [freeEmailConsent, setFreeEmailConsent] = useState(true);
  const [freeEmailLoading, setFreeEmailLoading] = useState(false);
  const [freeEmailSubmitted, setFreeEmailSubmitted] = useState(false);
  const [freeEmailError, setFreeEmailError] = useState<string | null>(null);
  const [typoSuggestion, setTypoSuggestion] = useState<string | null>(null);

  const stripeRef = useRef<Stripe | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);
  const expressCheckoutRef = useRef<StripeExpressCheckoutElement | null>(null);
  const paymentElementRef = useRef<StripePaymentElement | null>(null);
  const currentClientSecretRef = useRef<string | null>(null);
  const sessionCacheRef = useRef<Record<string, { clientSecret: string; publishableKey: string }>>({});
  const prefetchPromiseRef = useRef<Record<string, Promise<{ clientSecret: string; publishableKey: string }>>>({});

  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.endsWith('.ngrok-free.app') ||
    new URLSearchParams(window.location.search).has('embedded')
  );

  const getApiBaseUrl = () => {
    if (typeof window === 'undefined') return 'http://localhost:8787';
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.') || h.startsWith('172.')) {
      return `http://${h}:8787`;
    }
    return 'https://api.meloscribe.dev';
  };

  const cleanupEmbeddedCheckout = () => {
    if (expressCheckoutRef.current) {
      try {
        expressCheckoutRef.current.destroy();
      } catch (e) {
        console.warn("Failed to destroy expressCheckout instance", e);
      }
      expressCheckoutRef.current = null;
    }
    if (paymentElementRef.current) {
      try {
        paymentElementRef.current.destroy();
      } catch (e) {
        console.warn("Failed to destroy paymentElement instance", e);
      }
      paymentElementRef.current = null;
    }
    elementsRef.current = null;
    stripeRef.current = null;
    currentClientSecretRef.current = null;
    setCheckoutStep('details');
    setIsEmbeddedLoading(false);
    setEmbeddedError(null);
    setPaymentFormError(null);
    setIsSubmittingPayment(false);
    setExpressAvailable(false);
    setHasStripeExpress(false);
    setStripeHasPayPalExpress(false);
    setExpressReady(false);
    setSelectedPaymentMethod(null);
  };

  useEffect(() => {
    if (!isOpen) {
      cleanupEmbeddedCheckout();
      setFreeEmail('');
      setFreeEmailConsent(true);
      setFreeEmailLoading(false);
      setFreeEmailSubmitted(false);
      setFreeEmailError(null);
      setTypoSuggestion(null);
    }
  }, [isOpen]);

  const handleModalClose = () => {
    cleanupEmbeddedCheckout();
    onClose();
  };

  const hasDualVersions = Boolean(hasEasy || difficulty === 'Original / Easy');

  const [selectedDifficulty, setSelectedDifficulty] = useState<'Original' | 'Easy'>(() => {
    if (initialDifficulty) return initialDifficulty;
    if (difficulty === 'Easy') return 'Easy';
    return 'Original';
  });

  useEffect(() => {
    if (initialDifficulty) {
      setSelectedDifficulty(initialDifficulty);
    } else if (difficulty === 'Easy') {
      setSelectedDifficulty('Easy');
    } else {
      setSelectedDifficulty('Original');
    }
  }, [isOpen, songId, initialDifficulty, difficulty]);

  const isSelectedEasy = selectedDifficulty === 'Easy';
  const currentPrice = isSelectedEasy ? (easyPrice || price) : price;
  const currentPriceId = isSelectedEasy ? (easyStripePriceId || stripePriceId) : stripePriceId;
  const currentSongId = songId;

  const cleanBaseTitle = songTitle
    .replace(" (Easy Version)", "")
    .replace(" (Easy)", "")
    .replace(" (All Parts)", "")
    .replace(" (Part 1)", "")
    .replace(" (Part 2)", "")
    .trim();

  const displayTitle = hasDualVersions
    ? `${cleanBaseTitle}${isSelectedEasy ? ' (Easy)' : ''}`
    : songTitle;

  const cleanOriginalWide = coverImage 
    ? coverImage.replace('_clean.jpg', '_wide.jpg')
    : `/covers/${cleanBaseTitle}_wide.jpg`;
  const standardCoverWithTitle = `/covers/${cleanBaseTitle}.jpg`;
  const cleanOriginalSquare = coverImage || `/covers/${cleanBaseTitle}_clean.jpg`;

  // Always use the same widescreen cover with full title & keyboard for both Original and Easy
  const primaryWideCover = cleanOriginalWide;
  const wideCoverSrc = primaryWideCover.startsWith('http') ? primaryWideCover : encodeURI(primaryWideCover);
  const fallbackWideCover = encodeURI(standardCoverWithTitle);
  const fallbackCleanCover = cleanOriginalSquare.startsWith('http') ? cleanOriginalSquare : encodeURI(cleanOriginalSquare);
  const coverSrc = wideCoverSrc;

  const priceStr = String(currentPrice || '').trim().toLowerCase();
  const isFree = !priceStr || priceStr === '0' || priceStr.startsWith('0') || priceStr.includes('free') || priceStr.includes('0 €') || priceStr.includes('0$');

  const handleFreeEmailSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const emailToSubmit = (typoSuggestion && typoSuggestion === freeEmail ? typoSuggestion : freeEmail).trim().toLowerCase();
    
    if (!emailToSubmit) {
      setFreeEmailError(t.freeDownloadInvalidEmail);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToSubmit)) {
      setFreeEmailError(t.freeDownloadInvalidEmail);
      return;
    }

    setFreeEmailLoading(true);
    setFreeEmailError(null);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/api/notify/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToSubmit,
          song_id: currentSongId,
          song_title: displayTitle,
          difficulty: selectedDifficulty,
          locale: language || 'en'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFreeEmailSubmitted(true);
      } else {
        setFreeEmailError(data.error || t.freeDownloadInvalidEmail);
      }
    } catch (err) {
      console.error(err);
      setFreeEmailError('Network error. Please try again.');
    } finally {
      setFreeEmailLoading(false);
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [controlsVisible, setControlsVisible] = useState(true);
  const mouseMoveTimeout = useRef<number | null>(null);

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (mouseMoveTimeout.current) {
      window.clearTimeout(mouseMoveTimeout.current);
    }
    mouseMoveTimeout.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 2000);
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      setShowLightbox(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mouseMoveTimeout.current) {
        window.clearTimeout(mouseMoveTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (showLightbox) {
        videoRef.current.play().catch(err => {
          console.warn("[Player] Autoplay failed:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [showLightbox]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalHtmlOverflowX = document.documentElement.style.overflowX;
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyOverflowX = document.body.style.overflowX;

      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
      window.scrollTo(0, window.scrollY);

      const preventHorizontalScroll = () => {
        if (window.scrollX !== 0) {
          window.scrollTo(0, window.scrollY);
        }
      };
      window.addEventListener('scroll', preventHorizontalScroll, { passive: true });

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.overflowX = originalHtmlOverflowX;
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.overflowX = originalBodyOverflowX;
        window.removeEventListener('scroll', preventHorizontalScroll);
      };
    } else {
      window.scrollTo(0, window.scrollY);
    }
  }, [isOpen]);

  useEffect(() => {
    window.scrollTo(0, window.scrollY);
  }, [checkoutStep]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleSeek = (val: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOpen && songTitle) {
      setLoadingVideo(true);
      if (videoPreviewUrl && !hasDualVersions) {
        setVideoUrl(videoPreviewUrl);
        setLoadingVideo(false);
      } else {
        const cleanTitle = songTitle.replace(" (Easy Version)", "").replace(" (Easy)", "").trim();
        const suffix = isSelectedEasy ? " Easy" : "";
        const apiBaseUrl = getApiBaseUrl();
           
        setVideoUrl(`${apiBaseUrl}/api/public/video-stream?song_name=${encodeURIComponent(cleanTitle + suffix)}`);
        setLoadingVideo(false);
      }
    }
  }, [isOpen, songTitle, videoPreviewUrl, isSelectedEasy, hasDualVersions]);

  const normalizeLang = (raw: string | null | undefined): keyof typeof translations => {
    if (!raw && typeof navigator !== 'undefined') {
      raw = navigator.language || (navigator.languages && navigator.languages[0]);
    }
    const clean = (raw || 'en').toLowerCase().split('-')[0].split('_')[0];
    return (['en', 'de', 'fr', 'es', 'it'].includes(clean) ? clean : 'en') as keyof typeof translations;
  };

  const activeLang = normalizeLang(language);
  const t = translations[activeLang];

  const handleStripeCheckoutRedirect = async () => {
    setIsRedirecting(true);
    try {
      const apiBaseUrl = getApiBaseUrl();
        
      const res = await fetch(`${apiBaseUrl}/api/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          songId: currentSongId,
          format: 'full_arrangement',
          difficulty: selectedDifficulty,
          priceId: currentPriceId,
          language: language
        })
      });
      
      if (!res.ok) {
        throw new Error(await res.text() || 'Failed to create checkout session');
      }
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from backend');
      }
    } catch (e: any) {
      console.error("[Stripe Redirect Error]:", e);
      alert((t.failedToRedirectStripe || "Failed to redirect to Stripe: ") + e.message);
    }
    setIsRedirecting(false);
  };

  const prefetchCheckoutSession = async (diff: string, sId: string, pId?: string) => {
    const cacheKey = `${sId}_${diff}_${pId || ''}_${language}`;
    if (sessionCacheRef.current[cacheKey]) {
      return sessionCacheRef.current[cacheKey];
    }
    if (prefetchPromiseRef.current[cacheKey]) {
      return prefetchPromiseRef.current[cacheKey];
    }

    const apiBaseUrl = getApiBaseUrl();

    const promise = (async () => {
      const res = await fetch(`${apiBaseUrl}/api/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId: sId,
          format: 'full_arrangement',
          difficulty: diff,
          priceId: pId,
          language: language,
          embedded: true
        })
      });
      if (!res.ok) {
        throw new Error(await res.text() || 'Failed to create checkout session');
      }
      const data = await res.json();
      sessionCacheRef.current[cacheKey] = data;
      if (data.publishableKey) {
        loadStripe(data.publishableKey).catch(() => {});
      }
      return data;
    })();

    prefetchPromiseRef.current[cacheKey] = promise;
    return promise;
  };


  const handleBuyClick = async () => {
    setCheckoutStep('embedded');
    setIsEmbeddedLoading(true);
    setEmbeddedError(null);
    setPaymentFormError(null);
    setExpressAvailable(false);

    try {
      const cacheKey = `${currentSongId}_${selectedDifficulty}_${currentPriceId || ''}_${language}`;
      let data = sessionCacheRef.current[cacheKey];
      if (!data) {
        if (prefetchPromiseRef.current[cacheKey]) {
          data = await prefetchPromiseRef.current[cacheKey];
        } else {
          data = await prefetchCheckoutSession(selectedDifficulty, currentSongId, currentPriceId);
        }
      }

      if (!data || !data.clientSecret || !data.publishableKey) {
        throw new Error('Invalid response from payment server');
      }
      currentClientSecretRef.current = data.clientSecret;

      const stripe = await loadStripe(data.publishableKey);
      if (!stripe) {
        throw new Error('Could not initialize Stripe SDK');
      }
      stripeRef.current = stripe;

      if (expressCheckoutRef.current) {
        try { expressCheckoutRef.current.destroy(); } catch (_) {}
        expressCheckoutRef.current = null;
      }
      if (paymentElementRef.current) {
        try { paymentElementRef.current.destroy(); } catch (_) {}
        paymentElementRef.current = null;
      }

      const stripeLocale = activeLang as any;

      const elements = stripe.elements({
        clientSecret: data.clientSecret,
        locale: stripeLocale,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#00F5FF',
            colorBackground: '#111111',
            colorText: '#FFFFFF',
            colorDanger: '#FF4D4D',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            borderRadius: '10px',
            colorTextSecondary: '#94A3B8',
            colorIcon: '#94A3B8',
            spacingUnit: '4px',
            gridRowSpacing: '12px',
            gridColumnSpacing: '12px',
          },
          rules: {
            '.Tab, .AccordionItem': {
              backgroundColor: '#161616',
              border: '1px solid #262626',
              borderRadius: '10px',
              color: '#94A3B8',
              transition: 'all 0.2s ease',
            },
            '.Tab:hover, .AccordionItem:hover': {
              backgroundColor: '#1C1C1C',
              borderColor: 'rgba(0, 245, 255, 0.4)',
              color: '#FFFFFF',
            },
            '.Tab--selected, .AccordionItem--selected': {
              backgroundColor: '#161616',
              borderColor: '#00F5FF',
              boxShadow: '0 0 12px rgba(0, 245, 255, 0.2)',
              color: '#00F5FF',
            },
            '.Input': {
              backgroundColor: '#161616',
              border: '1px solid #262626',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              boxShadow: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            },
            '.Input:focus': {
              borderColor: '#00F5FF',
              boxShadow: '0 0 10px rgba(0, 245, 255, 0.25)',
              outline: 'none',
            },
            '.Label': {
              color: '#94A3B8',
              fontWeight: '500',
              fontSize: '12px',
              marginBottom: '6px',
            },
            '.Dropdown': {
              backgroundColor: '#161616',
              borderColor: '#262626',
              color: '#FFFFFF',
            },
            '.CheckboxInput': {
              backgroundColor: '#161616',
              borderColor: '#333333',
            }
          }
        }
      });
      elementsRef.current = elements;

      const expressCheckout = elements.create('expressCheckout', {
        buttonHeight: 46,
        layout: {
          maxColumns: 2,
          maxRows: 0,
          overflow: 'never',
        },
        emailRequired: true,
        paymentMethods: {
          link: 'never',
          klarna: 'never',
          amazonPay: 'never',
          applePay: 'auto',
          googlePay: 'auto',
          paypal: 'auto',
        },
        buttonTheme: {
          applePay: 'black',
          googlePay: 'black',
          paypal: 'gold',
        },
      });
      expressCheckoutRef.current = expressCheckout;

      expressCheckout.on('ready', ({ availablePaymentMethods }) => {
        const hasWallets = Boolean(
          availablePaymentMethods &&
          (availablePaymentMethods.applePay || availablePaymentMethods.googlePay)
        );
        const hasPayPal = Boolean(availablePaymentMethods && availablePaymentMethods.paypal);
        const hasAnyExpress = Boolean(
          availablePaymentMethods &&
          (availablePaymentMethods.applePay || availablePaymentMethods.googlePay || availablePaymentMethods.paypal)
        );
        setHasStripeExpress(hasWallets);
        setStripeHasPayPalExpress(hasPayPal);
        setExpressReady(true);
        setExpressAvailable(hasAnyExpress);
      });

      expressCheckout.on('confirm', async (event: any) => {
        setIsSubmittingPayment(true);
        setPaymentFormError(null);
        try {
          const { error: submitError } = await elements.submit();
          if (submitError) {
            setPaymentFormError(submitError.message || t.paymentFailed);
            setIsSubmittingPayment(false);
            return;
          }
          const origin = window.location.origin;
          const confirmParams: any = {
            return_url: `${origin}/success`,
          };
          if (event && event.billingDetails && event.billingDetails.email) {
            confirmParams.receipt_email = event.billingDetails.email;
            confirmParams.payment_method_data = {
              billing_details: {
                email: event.billingDetails.email,
              },
            };
          }
          const { error } = await stripe.confirmPayment({
            elements,
            clientSecret: data.clientSecret,
            confirmParams,
          });
          if (error) {
            setPaymentFormError(error.message || t.paymentFailed);
            setIsSubmittingPayment(false);
          }
        } catch (err: any) {
          console.error("[Express Confirm Error]:", err);
          setPaymentFormError(err.message || t.paymentProcessingError);
          setIsSubmittingPayment(false);
        }
      });

      const paymentElement = elements.create('payment', {
        layout: {
          type: 'accordion',
          defaultCollapsed: true,
          radios: 'always',
          spacedAccordionItems: true,
        },
        paymentMethodOrder: ['paypal', 'card', 'ideal', 'eps'],
        wallets: {
          link: 'never',
          applePay: 'never',
          googlePay: 'never',
        },
      });
      paymentElementRef.current = paymentElement;

      paymentElement.on('change', (event: any) => {
        if (event && event.value && event.value.type) {
          setSelectedPaymentMethod(event.value.type);
          if (event.value.type === 'paypal') {
            setPaymentFormError(null);
          }
        }
      });

      paymentElement.on('ready', () => {
        try {
          paymentElement.collapse();
        } catch (_) {}
        setIsEmbeddedLoading(false);
        setTimeout(() => {
          try {
            paymentElement.collapse();
          } catch (_) {}
        }, 50);
      });

      requestAnimationFrame(() => {
        const expressMount = document.getElementById('stripe-express-checkout');
        if (expressMount) {
          expressCheckout.mount('#stripe-express-checkout');
        }
        const paymentMount = document.getElementById('stripe-payment-element');
        if (paymentMount) {
          paymentElement.mount('#stripe-payment-element');
        }
      });
    } catch (e: any) {
      console.error("[Embedded Checkout Error]:", e);
      setEmbeddedError(e.message || t.failedToLoadCheckout);
      setIsEmbeddedLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!stripeRef.current || !elementsRef.current) return;

    const email = customerEmail.trim();
    const isEmailValid = Boolean(email && email.includes('@') && email.includes('.'));
    const isPaypal = selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'paypal_express';

    // A valid email address is strictly required upfront for Card payments if not provided.
    // For PayPal, the verified buyer email is automatically returned by PayPal.
    if (!isPaypal && !isEmailValid) {
      setPaymentFormError(t.invalidEmail);
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentFormError(null);

    try {
      const origin = window.location.origin;
      const confirmParams: any = {
        return_url: `${origin}/success`,
      };

      if (isEmailValid) {
        confirmParams.receipt_email = email;
        confirmParams.payment_method_data = {
          billing_details: {
            email: email,
          },
        };
      }

      const { error } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams,
      });

      if (error) {
        console.error("[Stripe Confirm Error]:", error);
        setPaymentFormError(error.message || t.paymentFailed);
        setIsSubmittingPayment(false);
      }
    } catch (err: any) {
      console.error("[Payment Error]:", err);
      setPaymentFormError(err.message || t.paymentProcessingError);
      setIsSubmittingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden max-w-[100vw] animate-in fade-in duration-300">
      <style dangerouslySetInnerHTML={{ __html: `
        .paddle-frame,
        .paddle-frame-inline,
        #paddle-checkout-frame iframe {
          position: relative !important;
          left: auto !important;
          top: auto !important;
          width: calc(100% + 24px) !important;
          margin-right: -24px !important;
          height: 650px !important;
          border: none !important;
          background: transparent !important;
          overflow: hidden !important;
          scrollbar-width: none !important;
        }
        #paddle-checkout-frame {
          width: 100% !important;
          overflow: hidden !important;
          scrollbar-width: none !important;
        }
        #paddle-checkout-frame iframe::-webkit-scrollbar,
        #paddle-checkout-frame::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        #stripe-express-checkout {
          width: 100% !important;
          max-width: 100% !important;
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          min-height: 46px;
        }
        #stripe-express-checkout iframe,
        #stripe-express-checkout * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        #stripe-express-checkout::-webkit-scrollbar,
        #stripe-express-checkout *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        #stripe-payment-element {
          width: 100% !important;
          max-width: 100% !important;
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          min-height: 180px;
        }
        #stripe-payment-element iframe,
        #stripe-payment-element * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        #stripe-payment-element::-webkit-scrollbar,
        #stripe-payment-element *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .modal-backdrop-blur {
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          transform: translateZ(0) !important;
        }
        .custom-modal-scroll {
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: contain !important;
          transform: translateZ(0) !important;
        }
        @keyframes screamPlayPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 245, 255, 0.7), 0 0 15px rgba(0, 245, 255, 0.4);
          }
          70% {
            transform: scale(1.08);
            box-shadow: 0 0 0 12px rgba(0, 245, 255, 0), 0 0 25px rgba(0, 245, 255, 0.8);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 245, 255, 0), 0 0 15px rgba(0, 245, 255, 0.4);
          }
        }
        .screaming-play-btn {
          animation: screamPlayPulse 1.6s infinite cubic-bezier(0.66, 0, 0, 1);
        }
      ` }} />
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 modal-backdrop-blur transition-opacity duration-300 pointer-events-auto"
        onClick={handleModalClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-xl ${checkoutStep === 'embedded' ? 'md:max-w-5xl' : 'md:max-w-4xl'} mx-auto bg-white dark:bg-dark-900/95 border border-gray-200 dark:border-dark-600/50 rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[92vh]`}>
        
        {/* Glow Orb in Modal */}
        <div className="hidden md:block absolute -top-24 -left-24 w-48 h-48 bg-neon-cyan/20 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden md:block absolute -bottom-24 -right-24 w-48 h-48 bg-neon-pink/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-dark-600/50 relative z-10">
          <div>
            <span className="text-xs font-semibold text-neon-cyan tracking-wider uppercase">{t.checkoutGate}</span>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mt-0.5">
              {t.title}
            </h3>
          </div>
          <button 
            onClick={handleModalClose}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-500/50 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:border-neon-pink/50 dark:hover:shadow-neon-pink-subtle transition-all duration-300 focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Grid Layout */}
        <div className="p-4 md:p-6 overflow-y-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 flex-1 custom-modal-scroll">
          
          {/* Mobile compact song header (only visible when in details mode) */}
          {checkoutStep !== 'embedded' && (
            <div className="md:hidden flex items-center justify-between bg-gray-50 border border-gray-200/80 dark:bg-dark-800/60 dark:border-dark-500/40 p-3 rounded-xl w-full">
              <div 
                onClick={() => videoUrl && setShowLightbox(true)}
                className={`flex items-center gap-3 ${videoUrl ? 'cursor-pointer' : ''}`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-dark-500/30">
                  <img 
                    src={coverSrc}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const step = parseInt(e.currentTarget.dataset.step || '0', 10);
                      if (step === 0) {
                        e.currentTarget.dataset.step = '1';
                        e.currentTarget.src = fallbackWideCover;
                      } else if (step === 1) {
                        e.currentTarget.dataset.step = '2';
                        e.currentTarget.src = fallbackCleanCover;
                      }
                    }}
                  />
                  {videoUrl && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-neon-cyan fill-current ml-0.5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayTitle}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{songArtist}</p>
                </div>
              </div>
            </div>
          )}

          {/* Left Column: Song Details & Included features — hidden on mobile */}
          <div className="hidden md:flex md:col-span-5 space-y-4 md:space-y-6 flex-col justify-start">
            {/* Song Overview Card */}
            <div className="flex flex-col gap-4 bg-gray-50 border border-gray-200/80 dark:bg-dark-800/60 dark:border-dark-500/40 p-4 rounded-xl">
              <div 
                onClick={() => videoUrl && setShowLightbox(true)}
                className={`w-full aspect-video rounded-xl bg-gradient-to-br from-dark-950 via-dark-900 to-purple-950/60 flex-shrink-0 relative overflow-hidden border border-gray-200 dark:border-dark-500/30 flex flex-col items-center justify-center ${videoUrl ? 'cursor-pointer group/thumb' : ''}`}
              >
                {/* 16:9 Widescreen Cover Thumbnail with Song Title */}
                <img
                  key={`${songTitle}-${selectedDifficulty}`}
                  src={wideCoverSrc}
                  alt={displayTitle}
                  style={{ display: 'block' }}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                  onError={(e) => {
                    const step = parseInt(e.currentTarget.dataset.step || '0', 10);
                    if (step === 0) {
                      e.currentTarget.dataset.step = '1';
                      e.currentTarget.src = fallbackWideCover;
                    } else if (step === 1) {
                      e.currentTarget.dataset.step = '2';
                      e.currentTarget.src = fallbackCleanCover;
                    }
                  }}
                />

                {/* Subtle dark tint so neon cyan play button & badge pop, while title remains 100% visible & sharp */}
                <div className="absolute inset-0 bg-black/25 group-hover/thumb:bg-black/15 transition-colors duration-300 pointer-events-none" />

                {videoUrl && (
                  <div className="relative z-10 flex flex-col items-center justify-center gap-2.5">
                    <div className="w-14 h-14 rounded-full bg-neon-cyan flex items-center justify-center text-dark-950 screaming-play-btn transition-transform duration-300 group-hover/thumb:scale-110 shadow-[0_0_25px_rgba(0,245,255,0.5)]">
                      <Play className="w-6 h-6 fill-current ml-1 text-dark-950" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 border border-neon-cyan/40 text-neon-cyan text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
                      Watch Video Preview
                    </span>
                  </div>
                )}
              </div>
              
              <div className="min-w-0">
                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white truncate">{displayTitle}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{songArtist}</p>
              </div>
            </div>

            {/* Included Features Checklist */}
            <div>
              <h5 className="text-xs font-semibold text-gray-550 dark:text-gray-400 uppercase tracking-wider mb-3">{t.included}</h5>
              <div className="space-y-3">
                {isSelectedEasy && (
                  <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {t.easyTitle}
                      </span>
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                        {t.easyDesc}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-neon-cyan" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {t.pdfTitle}
                    </span>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                      {t.pdfDesc}
                    </p>
                  </div>
                </div>

                {!isArrangeMe && (
                  <>
                    <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Music className="w-3.5 h-3.5 text-neon-pink" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {t.midiTitle}
                        </span>
                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                          {t.midiDesc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Tv className="w-3.5 h-3.5 text-neon-cyan" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {t.videoTitle}
                        </span>
                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                          {t.videoDesc}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Secure Checkout Action */}
          <div className={`md:col-span-7 md:border-l border-gray-200 dark:border-dark-600/50 md:pl-8 flex flex-col ${checkoutStep === 'embedded' ? 'justify-start' : 'justify-center'}`}>
            {checkoutStep === 'embedded' ? (
              <div className="w-full flex flex-col py-1">
                {/* Embedded Top Navigation Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-dark-600/50">
                  <button
                    type="button"
                    onClick={cleanupEmbeddedCheckout}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-neon-cyan dark:text-gray-400 dark:hover:text-neon-cyan transition-colors cursor-pointer py-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t.backToSelection}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-600/60 text-gray-700 dark:text-gray-300 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" />
                      <span>{isSelectedEasy ? t.versionEasy : t.versionOriginal} • {currentPrice}</span>
                    </span>
                  </div>
                </div>

                {/* Stripe Mount Container */}
                <div className="relative w-full mt-3 rounded-2xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-600/60 p-4 md:p-5 shadow-2xl transition-all duration-300">
                  {isEmbeddedLoading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-14 bg-gray-50/95 dark:bg-dark-800/95 backdrop-blur-sm z-20">
                      <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.loadingCheckout}</p>
                    </div>
                  )}

                  {embeddedError ? (
                    <div className="p-6 text-center space-y-3">
                      <p className="text-sm text-red-400 font-medium">{embeddedError}</p>
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleBuyClick}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 transition-all cursor-pointer"
                        >
                          {t.retry}
                        </button>
                        <button
                          type="button"
                          onClick={cleanupEmbeddedCheckout}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-dark-700 text-gray-300 hover:bg-dark-600 transition-all cursor-pointer"
                        >
                          {t.backToSelection}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`${isEmbeddedLoading ? 'hidden' : 'block'} space-y-3`}>
                      {/* Express Checkout Area (Apple Pay, Google Pay, PayPal) */}
                      <div className={`w-full transition-all duration-300 ${expressAvailable ? 'block mb-3' : 'h-0 overflow-hidden invisible pointer-events-none'}`}>
                        <div
                          id="stripe-express-checkout"
                          className="w-full overflow-hidden"
                          style={{ overflow: 'hidden' }}
                        />

                        {/* Divider between Express and regular tabs */}
                        {expressAvailable && (
                          <div className="flex items-center my-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                            <div className="flex-1 border-b border-gray-200 dark:border-white/10" />
                            <span className="px-3">{t.orCardKlarna}</span>
                            <div className="flex-1 border-b border-gray-200 dark:border-white/10" />
                          </div>
                        )}
                      </div>

                      {/* Contact Information (Email) */}
                      <div>
                        <label className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                          <span>{t.contactInformation}</span>
                          {(selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'paypal_express') && (
                            <span className="text-[11px] font-normal text-neon-cyan/90 normal-case tracking-normal">
                              {t.optionalForPaypal}
                            </span>
                          )}
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder={selectedPaymentMethod === 'paypal' ? (t.emailPlaceholderPaypal || t.emailPlaceholder) : t.emailPlaceholder}
                          className="w-full bg-[#161616] border border-[#262626] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all shadow-inner"
                        />
                      </div>

                      {/* Regular Payment Element (Card, Link, Klarna, iDEAL, EPS) */}
                      <div>
                        <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                          {t.paymentMethod}
                        </span>
                        <div id="stripe-payment-element" className="overflow-hidden" style={{ overflow: 'hidden' }} />
                      </div>

                      {/* Error Message if submit fails */}
                      {paymentFormError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
                          {paymentFormError}
                        </div>
                      )}

                      {/* Custom Glowing Gradient Pay Button */}
                      <button
                        type="button"
                        onClick={handleConfirmPayment}
                        disabled={isSubmittingPayment}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-neon-cyan to-neon-pink text-white shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(255,45,146,0.5)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                      >
                        {isSubmittingPayment ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{t.processingPayment}</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-5 h-5" />
                            <span>
                              {selectedPaymentMethod === 'paypal'
                                ? `${t.payWithPaypal} • ${currentPrice}`
                                : t.payNow.replace('{price}', String(currentPrice))}
                            </span>
                          </>
                        )}
                      </button>

                      {/* Trust Guarantee / PCI Compliance Footer */}
                      <div className="pt-2 text-[11px] text-gray-400 text-center">
                        <span>{t.pciCompliant}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-3 md:gap-6 py-1 md:py-8">
                {/* Version Selector for Dual Version Songs */}
                {hasDualVersions && (
                  <div className="w-full">
                    <span className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wider">
                      {t.selectDifficulty}
                    </span>
                    <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-dark-800/90 rounded-xl border border-gray-200 dark:border-dark-600/60 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setSelectedDifficulty('Original')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          !isSelectedEasy
                            ? 'bg-white dark:bg-dark-700 text-neon-pink shadow-sm border border-gray-200 dark:border-neon-pink/40'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-neon-pink" />
                        <span>{t.versionOriginal}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedDifficulty('Easy')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelectedEasy
                            ? 'bg-white dark:bg-dark-700 text-neon-cyan shadow-sm border border-gray-200 dark:border-neon-cyan/40'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                        <span>{t.versionEasy}</span>
                      </button>
                    </div>
                  </div>
                )}

                {isFree ? (
                  freeEmailSubmitted ? (
                    <div className="w-full flex flex-col items-center text-center py-6 px-2 animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {t.freeDownloadSuccessTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mb-6">
                        {t.freeDownloadSuccessDesc.replace('{email}', freeEmail)}
                      </p>

                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="w-full py-3 px-6 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-600/60 transition-all cursor-pointer text-sm"
                      >
                        {t.freeDownloadDone}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFreeEmailSubmit} className="w-full space-y-4">
                      {/* Eyebrow with Song Title as Visual Anchor & Headline */}
                      <div className="text-center">
                        <span className="inline-block text-[11px] font-bold tracking-widest text-neon-cyan uppercase drop-shadow-[0_0_8px_rgba(0,245,255,0.4)] mb-1">
                          {displayTitle}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {t.freeDownloadTitle}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                          {t.freeDownloadDesc}
                        </p>
                      </div>

                      {/* Email input without bureaucratic label */}
                      <div className="space-y-1.5 text-left">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={freeEmail}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFreeEmail(val);
                              setFreeEmailError(null);
                              const suggestion = getDomainSuggestion(val);
                              setTypoSuggestion(suggestion);
                            }}
                            placeholder={t.freeDownloadEmailPlaceholder}
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white dark:bg-dark-800/90 border border-gray-200 dark:border-dark-600/70 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 text-sm transition-all shadow-inner"
                          />
                        </div>

                        {/* Typo suggestion banner */}
                        {typoSuggestion && (
                          <div className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg p-2.5 flex items-center justify-between gap-2 mt-1.5 animate-in fade-in duration-200">
                            <span>
                              {t.freeDownloadTypoSuggestion.replace('{suggestion}', typoSuggestion)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setFreeEmail(typoSuggestion);
                                setTypoSuggestion(null);
                              }}
                              className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold rounded text-[11px] transition-colors cursor-pointer shrink-0"
                            >
                              Yes, fix it
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Error message */}
                      {freeEmailError && (
                        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl p-3 text-xs flex items-center gap-2 text-left animate-in fade-in duration-200">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>{freeEmailError}</span>
                        </div>
                      )}

                      {/* Submit Button with Ultra High Contrast */}
                      <button
                        type="submit"
                        disabled={freeEmailLoading || !freeEmail.trim()}
                        className="w-full py-3.5 px-6 rounded-xl font-extrabold tracking-wide bg-[#00f5d4] hover:bg-[#00e0c2] text-black flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(0,245,212,0.35)] hover:shadow-[0_0_28px_rgba(0,245,212,0.55)] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
                      >
                        {freeEmailLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                            <span className="text-black font-extrabold">{t.freeDownloadSending}</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 text-black stroke-[2.5]" />
                            <span className="text-black font-extrabold">{t.freeDownloadSubmit}</span>
                          </>
                        )}
                      </button>

                      {/* Subtle Micro-Disclaimer */}
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center pt-1.5 leading-snug">
                        {t.freeDownloadNotice}
                      </p>
                    </form>
                  )
                ) : isArrangeMe ? (
                  <>
                    {/* Mobile Only: Compact Package Summary for ArrangeMe */}
                    <div className="md:hidden w-full text-center bg-gray-50 dark:bg-dark-800/40 border border-purple-500/30 p-3 rounded-xl text-sm leading-relaxed">
                      <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 uppercase tracking-wider">
                        {t.packageIncludes}
                      </p>
                      <p className="text-[11px] text-purple-400 font-medium leading-relaxed">
                        {t.packageIncludesArrangeMe}
                      </p>
                    </div>

                    {/* Action Subtext */}
                    <div className="text-center w-full px-2 my-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.getOnArrangeMeDesc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (arrangemeUrl) {
                          window.open(arrangemeUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
                    >
                      <span>{t.getOnArrangeMe}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Mobile Only: Compact Package Summary */}
                    <div className="md:hidden w-full text-center bg-gray-50 dark:bg-dark-800/40 border border-gray-200 dark:border-dark-600/50 p-3 rounded-xl text-sm leading-relaxed">
                      <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 uppercase tracking-wider">
                        {t.packageIncludes}
                      </p>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t.packageIncludesDesc}
                      </p>
                    </div>

                    {/* Action Subtext */}
                    <div className="text-center w-full px-2 my-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.checkoutSubtext}
                      </p>
                    </div>

                    <button
                      onClick={handleBuyClick}
                      disabled={isRedirecting || isEmbeddedLoading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-neon-cyan to-neon-pink text-white shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(255,45,146,0.5)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                      {isRedirecting || isEmbeddedLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{t.redirectingStripe}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          <span>
                            {isSelectedEasy ? t.buyEasyVersion : t.buyOriginalVersion}
                            {currentPrice ? ` • ${currentPrice}` : ''}
                          </span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info Banner */}
        <div className="hidden md:flex px-6 py-4 border-t border-gray-200 dark:border-dark-600/50 bg-gray-50 dark:bg-dark-900/85 backdrop-blur-md items-center justify-between text-xs text-gray-500 dark:text-gray-500 relative z-10">
          <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
            <ShieldCheck className="w-4 h-4 text-neon-cyan" /> {t.secureSsl}
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            {t.paymentsSecuredByStripe}
          </span>
        </div>
      </div>

      {/* Lightbox Pop-up (Eagerly preloaded, shown/hidden with CSS opacity to keep buffer warm) */}
      {videoUrl && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl transition-all duration-300 ${
          showLightbox ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={handleClose}
          />
          <div 
            ref={videoContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setControlsVisible(false)}
            className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 z-10 group/player flex items-center justify-center transition-transform duration-300"
            style={{ transform: showLightbox ? 'scale(1)' : 'scale(0.95)' }}
          >
            {/* Video element: only streams when lightbox is active to avoid choking modal network/cover image */}
            <video 
              ref={videoRef}
              src={showLightbox ? (videoUrl || undefined) : undefined}
              poster={wideCoverSrc}
              playsInline
              preload={showLightbox ? "auto" : "none"}
              controlsList="nodownload nofullscreen"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onDurationChange={(e) => setDuration(e.currentTarget.duration)}
              onLoadStart={() => setLoadingVideo(true)}
              onWaiting={() => setLoadingVideo(true)}
              onPlaying={() => setLoadingVideo(false)}
              onCanPlay={() => setLoadingVideo(false)}
              onError={() => {
                // Video not available - clear URL to hide player and close lightbox
                console.warn(`[PaddleModal] Video preview not available for "${songTitle}"`);
                setVideoUrl(null);
                setShowLightbox(false);
                setLoadingVideo(false);
              }}
              onClick={togglePlay}
              className={`w-full h-full object-contain transition-opacity duration-100 ${controlsVisible ? 'cursor-pointer' : 'cursor-none'}`}
              style={{
                opacity: duration > 0 && (duration - currentTime) <= 1 
                  ? Math.max(0, duration - currentTime) 
                  : 1
              }}
            />

            {/* Premium Loader overlay for video buffering/loading */}
            {loadingVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px] z-20 pointer-events-none animate-fadeIn">
                <Loader2 className="w-9 h-9 text-neon-cyan animate-spin" />
              </div>
            )}

            {/* Floating Top-Right Close Button */}
            <button 
              onClick={handleClose}
              className={`absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-black/85 backdrop-blur-md transition-opacity duration-300 cursor-pointer ${
                controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Close preview"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Floating Top-Left Song Details banner */}
            <div className={`absolute top-4 left-4 z-30 pointer-events-none flex flex-col bg-black/60 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl transition-opacity duration-300 ${
              controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <span className="text-[9px] font-semibold text-neon-cyan tracking-wider uppercase">Video Preview</span>
              <h4 className="text-xs font-semibold text-white mt-0.5">{songTitle}</h4>
            </div>

            {/* Big Center Play/Pause button overlay */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full bg-dark-900/70 border border-dark-600/30 flex items-center justify-center text-white backdrop-blur-sm transform hover:scale-105 transition-all">
                  <Play className="w-8 h-8 fill-current ml-1 text-neon-cyan" />
                </div>
              </div>
            )}

            {/* Custom Themed Controller Bar */}
            <div 
              className={`absolute bottom-4 left-4 right-4 bg-dark-900/85 border border-dark-600/50 backdrop-blur-md px-4 py-3 rounded-xl flex flex-col gap-2 transition-opacity duration-300 z-20 ${
                controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Timeline row */}
              <div className="relative w-full group/slider h-2 flex items-center cursor-pointer select-none">
                <input 
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Track background */}
                <div className="w-full h-1 bg-gray-700/60 rounded-full group-hover/slider:h-1.5 transition-all" />
                {/* Neon gradient fill */}
                <div 
                  className="absolute left-0 h-1 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full group-hover/slider:h-1.5 transition-all pointer-events-none" 
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
                {/* Thumb indicator */}
                <div 
                  className="absolute w-3.5 h-3.5 bg-white rounded-full border-2 border-neon-pink shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none"
                  style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 7px)` }}
                />
              </div>

              {/* Buttons row */}
              <div className="flex items-center justify-between mt-1 select-none">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button 
                    onClick={togglePlay} 
                    className="text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none hover:scale-105"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  {/* Time Counter */}
                  <span className="text-xs font-mono text-gray-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Volume Mute toggle & Slider */}
                  <div className="flex items-center gap-1.5 group/volume">
                    <button 
                      onClick={toggleMute} 
                      className="text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none hover:scale-105"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input 
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setVolume(val);
                        if (videoRef.current) {
                          videoRef.current.volume = val;
                          videoRef.current.muted = val === 0;
                          setIsMuted(val === 0);
                        }
                      }}
                      className="w-0 group-hover/volume:w-16 focus-within/volume:w-16 h-1 bg-gray-500 rounded-full appearance-none cursor-pointer transition-all duration-300 accent-neon-cyan opacity-0 group-hover/volume:opacity-100 outline-none"
                    />
                  </div>

                  {/* Fullscreen toggle */}
                  <button 
                    onClick={toggleFullscreen} 
                    className="text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none hover:scale-105"
                    aria-label="Toggle fullscreen"
                  >
                    {isFullscreen ? <Minimize className="w-4.5 h-4.5" /> : <Maximize className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TikTok Helper Overlay - only arrow top-right, no popup box */}
      {showTiktokModal && (
        <div 
          onClick={() => setShowTiktokModal(false)}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-end p-4 cursor-pointer"
        >
          {/* Pointer Arrow pointing to top right */}
          <div className="mr-3 sm:mr-6 mt-2 flex flex-col items-end text-amber-400 animate-bounce pointer-events-none">
            <span className="text-5xl font-bold leading-none">↗</span>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/25 px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-300 shadow-xl mt-1">
              {t.tapHere || 'Tap here (...) and open browser'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
