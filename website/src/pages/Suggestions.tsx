import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronUp, Music, Sparkles, Check, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchSuggestions, insertSuggestion, incrementVote, decrementVote, Suggestion } from '../lib/supabaseClient';
import songsData from '../data/songs.json';

interface SuggestionsProps {
  onBack: () => void;
  language: string;
  showToast: (message: string) => void;
  onSelectSong?: (song: any) => void;
}

export interface CompletedItem {
  id: string;
  title: string;
  artist: string;
  song?: any;
}

const CURATED_COMPLETED_TITLES = [
  'In This Shirt',
];

// Normalize strings for fuzzy matching
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents/diacritics
    .replace(/[^a-z0-9\s]/g, "") // remove punctuation, apostrophes, special chars
    .replace(/\s+/g, " ") // collapse consecutive whitespace
    .trim(); // remove trailing/leading whitespace
}

// Compute Levenshtein distance
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Compute similarity score
function getSimilarityScore(a: string, b: string): number {
  const normA = normalizeString(a);
  const normB = normalizeString(b);
  if (!normA && !normB) return 1.0;
  if (!normA || !normB) return 0.0;
  if (normA === normB) return 1.0;

  const distance = getLevenshteinDistance(normA, normB);
  const maxLength = Math.max(normA.length, normB.length);
  return (maxLength - distance) / maxLength;
}

// Check if two artists match with typo and substring tolerance
export function areArtistsMatching(artistA?: string, artistB?: string): boolean {
  if (!artistA || !artistB) return true;
  const normA = normalizeString(artistA);
  const normB = normalizeString(artistB);
  if (!normA || !normB) return true;
  if (normA === normB || normA.includes(normB) || normB.includes(normA)) return true;

  const maxLen = Math.max(normA.length, normB.length);
  const dist = getLevenshteinDistance(normA, normB);
  const sim = (maxLen - dist) / maxLen;
  return maxLen <= 5 ? dist <= 1 : (dist <= 2 || sim >= 0.75);
}

// Check if two song titles match with token-level stemming, typo, and stopword tolerance
export function areTitlesMatching(titleA: string, titleB: string, artistMatches = false): boolean {
  const normA = normalizeString(titleA);
  const normB = normalizeString(titleB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;

  const maxLen = Math.max(normA.length, normB.length);
  const dist = getLevenshteinDistance(normA, normB);
  const sim = (maxLen - dist) / maxLen;
  if (maxLen <= 5 ? dist <= 1 : (dist <= 2 || sim >= 0.82)) return true;

  const stopWords = new Set(['the', 'a', 'an', 'and', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'part', 'pt']);
  const wordsA = normA.split(' ').filter(w => w.length > 0 && !stopWords.has(w));
  const wordsB = normB.split(' ').filter(w => w.length > 0 && !stopWords.has(w));

  // If one title has 1 word and the other has multiple, reject unless character distance was <= 2
  if ((wordsA.length === 1 && wordsB.length > 1) || (wordsB.length === 1 && wordsA.length > 1)) {
    return false;
  }

  if (wordsA.length >= 2 && wordsB.length >= 2 && Math.abs(wordsA.length - wordsB.length) <= (artistMatches ? 1 : 0)) {
    const usedB = new Set<number>();
    let matchedCount = 0;

    for (const wA of wordsA) {
      for (let i = 0; i < wordsB.length; i++) {
        if (usedB.has(i)) continue;
        const wB = wordsB[i];
        const exact = wA === wB;
        const stemMatch = (wA.startsWith(wB) || wB.startsWith(wA)) && Math.min(wA.length, wB.length) >= 4;
        const minL = Math.min(wA.length, wB.length);
        const wordDist = getLevenshteinDistance(wA, wB);
        const typoMatch = (minL <= 4 && wordDist <= 1) || (minL > 4 && wordDist <= 2);

        if (exact || stemMatch || typoMatch) {
          usedB.add(i);
          matchedCount++;
          break;
        }
      }
    }

    const maxWords = Math.max(wordsA.length, wordsB.length);
    const minWords = Math.min(wordsA.length, wordsB.length);
    // For 2-word titles, both non-stop words must match (e.g. sweet & rain matches sweetest & rain)
    if (minWords === 2) {
      return matchedCount === 2;
    }
    // For 3+ words: if artist matches, allow 1 missing word, otherwise require minWords
    return artistMatches ? matchedCount >= maxWords - 1 : matchedCount >= minWords;
  }

  return false;
}

// Fuzzy matching against published catalog songs
export function findMatchingCatalogSong(inputTitle: string, inputArtist?: string): any | null {
  const normInputArtist = inputArtist ? normalizeString(inputArtist) : '';
  const isFullRequest = /\b(full|ganzer|ganze)\b/i.test(inputTitle);
  const isEasyRequest = /\b(easy|einfach|leichte)\b/i.test(inputTitle);
  const isReworkRequest = /\b(rework|re-work|v2)\b/i.test(inputTitle);

  for (const song of (songsData as any[])) {
    if (song.hidden || song.id === 'global_settings') continue;

    const artistMatches = areArtistsMatching(normInputArtist, song.artist);
    const titleMatches = areTitlesMatching(inputTitle, song.title, artistMatches);

    if (titleMatches && artistMatches) {
      if (isReworkRequest) continue;
      if (isFullRequest && song.format !== 'full_arrangement') continue;
      if (isEasyRequest && !song.hasEasy) continue;
      return song;
    }
  }
  return null;
}

export default function Suggestions({ onBack, language, showToast, onSelectSong }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [openSuggestions, setOpenSuggestions] = useState<Suggestion[]>([]);
  const [completedList, setCompletedList] = useState<CompletedItem[]>([]);
  const [matchedSongBanner, setMatchedSongBanner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});

  // Strip scrolling states & refs
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Input states
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  // Translations
  const translations = {
    en: {
      title: 'Community Requests',
      subtitle: 'Vote for your favorite tracks or suggest new ones. Arrangements are created based on community demand.',
      suggestHeading: "Don't see your song? Suggest it here...",
      inputTitle: 'Song Title *',
      inputArtist: 'Artist / Band *',
      btnSubmit: 'Submit Suggestion',
      leaderboard: 'Leaderboard',
      noSuggestions: 'No suggestions yet. Be the first to make a request!',
      backBtn: 'Back',
      voteRemoved: 'Removed vote for "{song}".',
      voteAdded: 'Added vote for "{song}"!',
      fillFields: 'Please fill in all required fields!',
      alreadyVoted: 'Match found! You have already voted for "{title}".',
      similarVoted: 'Close match found! Added your vote to the existing request: {title}.',
      suggestSuccess: 'Successfully suggested: "{song}"',
      suggestError: 'Error saving your request.',
      placeholderTitle: 'e.g. In The End',
      placeholderArtist: 'e.g. Linkin Park',
      requestsLabel: 'requests',
      loading: 'Loading suggestions...',
      alreadyPublished: 'This song is already available on meloscribe!',
      alreadyPublishedMsg: 'Great news! "{title}" is already available on meloscribe.',
      viewSheetMusic: 'View Sheet Music',
      completedStripTitle: 'Recently Arranged (Community Requests)',
      requestsTab: 'Requests',
      completedTab: 'Completed',
      availableInCatalog: 'Available in Catalog',
      noCompleted: 'No completed arrangements yet.',
    },
    de: {
      title: 'Community Wunschliste',
      subtitle: 'Stimme für deine Lieblingssongs ab oder schlage neue vor. Die am besten bewerteten Songs werden zuerst arrangiert.',
      suggestHeading: 'Siehst du deinen Song nicht? Schlage ihn vor...',
      inputTitle: 'Songtitel *',
      inputArtist: 'Künstler / Interpret *',
      btnSubmit: 'Vorschlag senden',
      leaderboard: 'Rangliste',
      noSuggestions: 'Noch keine Wünsche eingegangen. Sei der Erste!',
      backBtn: 'Zurück',
      voteRemoved: 'Stimme für "{song}" entfernt.',
      voteAdded: 'Stimme für "{song}" hinzugefügt!',
      fillFields: 'Bitte fülle alle Pflichtfelder aus!',
      alreadyVoted: 'Gleicher Song gefunden! Du hast für "{title}" bereits abgestimmt.',
      similarVoted: 'Ähnlicher Song gefunden! Stimme wurde hinzugefügt für: {title}.',
      suggestSuccess: 'Erfolgreich vorgeschlagen: "{song}"',
      suggestError: 'Fehler beim Speichern deiner Anfrage.',
      placeholderTitle: 'z.B. In The End',
      placeholderArtist: 'z.B. Linkin Park',
      requestsLabel: 'Anfragen',
      loading: 'Wünsche werden geladen...',
      alreadyPublished: 'Dieser Song ist bereits auf meloscribe verfügbar!',
      alreadyPublishedMsg: 'Gute Nachricht! "{title}" ist bereits auf meloscribe verfügbar.',
      viewSheetMusic: 'Noten ansehen',
      completedStripTitle: 'Kürzlich umgesetzt (Aus Community-Wünschen)',
      requestsTab: 'Offene Wünsche',
      completedTab: 'Bereits arrangiert',
      availableInCatalog: 'Im Noten-Katalog',
      noCompleted: 'Noch keine arrangierten Wünsche.',
    },
    fr: {
      title: 'Demandes de la Communauté',
      subtitle: 'Votez pour vos chansons préférées ou suggérez-en de nouvelles. Les arrangements sont créés selon la demande.',
      suggestHeading: 'Vous ne voyez pas votre chanson ? Suggérez-la...',
      inputTitle: 'Titre de la chanson *',
      inputArtist: 'Artiste / Groupe *',
      btnSubmit: 'Envoyer la demande',
      leaderboard: 'Classement',
      noSuggestions: 'Aucune demande pour le moment. Soyez le premier !',
      backBtn: 'Retour',
      voteRemoved: 'Vote pour "{song}" supprimé.',
      voteAdded: 'Vote pour "{song}" ajouté !',
      fillFields: 'Veuillez remplir tous les champs obligatoires !',
      alreadyVoted: 'Match trouvé ! Vous avez déjà voté pour "{title}".',
      similarVoted: 'Match proche trouvé ! Votre vote a été ajouté à la demande existante : {title}.',
      suggestSuccess: 'Suggéré avec succès : "{song}"',
      suggestError: 'Erreur lors de l\'enregistrement de votre demande.',
      placeholderTitle: 'par ex. In The End',
      placeholderArtist: 'par ex. Linkin Park',
      requestsLabel: 'demandes',
      loading: 'Chargement des demandes...',
      alreadyPublished: 'Cette chanson est déjà disponible sur meloscribe !',
      alreadyPublishedMsg: 'Bonne nouvelle ! "{title}" est déjà disponible sur meloscribe.',
      viewSheetMusic: 'Voir la partition',
      completedStripTitle: 'Récemment arrangés (Demandes de la communauté)',
      requestsTab: 'Demandes',
      completedTab: 'Terminées',
      availableInCatalog: 'Dans le catalogue',
      noCompleted: 'Aucune demande terminée pour le moment.',
    },
    es: {
      title: 'Lista de Peticiones',
      subtitle: 'Vota por tus canciones favoritas o sugiere otras nuevas. Las canciones más votadas se arreglarán primero.',
      suggestHeading: '¿No ves tu canción? Sugiérela aquí...',
      inputTitle: 'Título de la canción *',
      inputArtist: 'Artista / Grupo *',
      btnSubmit: 'Enviar sugerencia',
      leaderboard: 'Clasificación',
      noSuggestions: 'Aún no hay sugerencias. ¡Sé el primero!',
      backBtn: 'Atrás',
      voteRemoved: 'Voto para "{song}" eliminado.',
      voteAdded: '¡Voto para "{song}" añadido!',
      fillFields: '¡Por favor, complete todos los campos requeridos!',
      alreadyVoted: '¡Petición encontrada! Ya has votado por "{title}".',
      similarVoted: '¡Petición similar encontrada! Tu voto ha sido añadido a la petición existente: {title}.',
      suggestSuccess: 'Sugerido con éxito: "{song}"',
      suggestError: 'Error al guardar su solicitud.',
      placeholderTitle: 'p. ej. In The End',
      placeholderArtist: 'p. ej. Linkin Park',
      requestsLabel: 'peticiones',
      loading: 'Cargando peticiones...',
      alreadyPublished: '¡Esta canción ya está disponible en meloscribe!',
      alreadyPublishedMsg: '¡Buenas noticias! "{title}" ya está disponible en meloscribe.',
      viewSheetMusic: 'Ver partitura',
      completedStripTitle: 'Arreglados recientemente (Peticiones de la comunidad)',
      requestsTab: 'Peticiones',
      completedTab: 'Completadas',
      availableInCatalog: 'En el catálogo',
      noCompleted: 'Aún no hay peticiones completadas.',
    },
    it: {
      title: 'Richieste della Community',
      subtitle: 'Vota le tue canzoni preferite o suggeriscine di nuove. Le canzoni più votate saranno arrangiate per prime.',
      suggestHeading: 'Non vedi la tua canzone? Suggeriscila qui...',
      inputTitle: 'Titolo della canzone *',
      inputArtist: 'Artista / Gruppo *',
      btnSubmit: 'Invia suggerimento',
      leaderboard: 'Classifica',
      noSuggestions: 'Nessun suggerimento ancora. Sii il primo!',
      backBtn: 'Indietro',
      voteRemoved: 'Voto per "{song}" rimosso.',
      voteAdded: 'Voto per "{song}" aggiunto!',
      fillFields: 'Si prega di compilare tutti i campi obbligatori!',
      alreadyVoted: 'Richiesta duplicata rilevata! "{title}" è già nell\'elenco.',
      similarVoted: 'Esiste già una richiesta simile: Aggiunto il tuo voto alla richiesta esistente: {title}.',
      suggestSuccess: 'Suggerito con successo: "{song}"',
      suggestError: 'Errore durante il salvataggio della richiesta.',
      placeholderTitle: 'es. In The End',
      placeholderArtist: 'es. Linkin Park',
      requestsLabel: 'richieste',
      loading: 'Caricamento dei suggerimenti...',
      alreadyPublished: 'Questa canzone è già disponible su meloscribe!',
      alreadyPublishedMsg: 'Ottima notizia! "{title}" è già disponibile su meloscribe.',
      viewSheetMusic: 'Vedi spartito',
      completedStripTitle: 'Arrangiati di recente (Richieste della community)',
      requestsTab: 'Richieste',
      completedTab: 'Completate',
      availableInCatalog: 'Nel catalogo',
      noCompleted: 'Nessuna richiesta completata ancora.',
    }
  };

  const activeLang = ['de', 'en', 'fr', 'es', 'it'].includes(language) ? language : 'en';
  const t = translations[activeLang as keyof typeof translations];

  const loadData = async () => {
    setLoading(true);
    const data = await fetchSuggestions();
    
    const openList: Suggestion[] = [];
    const completedItems: CompletedItem[] = [];
    const seenTitles = new Set<string>();

    // 1. Process DB suggestions (only explicitly completed ones)
    data.forEach(sug => {
      if (sug.status === 'completed') {
        const catalogMatch = findMatchingCatalogSong(sug.title, sug.artist);
        const normKey = normalizeString(sug.title);
        if (!seenTitles.has(normKey)) {
          seenTitles.add(normKey);
          completedItems.push({
            id: sug.id,
            title: catalogMatch ? catalogMatch.title : sug.title,
            artist: catalogMatch ? catalogMatch.artist : sug.artist,
            song: catalogMatch,
          });
        }
      } else {
        openList.push(sug);
      }
    });

    // 2. Ensure rich social proof by adding curated catalog community arrangements
    for (const curTitle of CURATED_COMPLETED_TITLES) {
      const normKey = normalizeString(curTitle);
      if (!seenTitles.has(normKey)) {
        const catalogSong = (songsData as any[]).find(s => !s.hidden && normalizeString(s.title) === normKey);
        if (catalogSong) {
          seenTitles.add(normKey);
          completedItems.push({
            id: catalogSong.id,
            title: catalogSong.title,
            artist: catalogSong.artist,
            song: catalogSong,
          });
        }
      }
    }

    setOpenSuggestions(openList);
    setSuggestions(openList);
    setCompletedList(completedItems);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Load voted keys from localStorage
    const keys: Record<string, boolean> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('meloscribe_voted_')) {
        const id = key.replace('meloscribe_voted_', '');
        keys[id] = true;
      }
    }
    setVotedIds(keys);
  }, []);

  const updateScrollButtons = () => {
    const el = stripRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < maxScroll - 2);
  };

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons, { passive: true });

    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey || Math.abs(e.deltaY) < 1) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const isScrollingRight = e.deltaY > 0;
      const hasRoomRight = el.scrollLeft < maxScroll - 2;
      const hasRoomLeft = el.scrollLeft > 2;

      if ((isScrollingRight && hasRoomRight) || (!isScrollingRight && hasRoomLeft)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        updateScrollButtons();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
      el.removeEventListener('wheel', onWheel);
    };
  }, [completedList]);

  const scrollStrip = (direction: 'left' | 'right') => {
    if (stripRef.current) {
      const scrollAmount = 320;
      stripRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(updateScrollButtons, 350);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = stripRef.current;
    if (!el) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !stripRef.current) return;
    const el = stripRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
    updateScrollButtons();
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  };

  const handleUpvote = async (id: string, currentVotes: number, songTitle: string) => {
    if (votedIds[id]) {
      // Unvote logic
      const updater = (prev: Suggestion[]) =>
        prev.map(s => (s.id === id ? { ...s, votes: Math.max(0, s.votes - 1) } : s)).sort((a, b) => b.votes - a.votes);
      setSuggestions(updater);
      setOpenSuggestions(updater);
      setVotedIds(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      localStorage.removeItem(`meloscribe_voted_${id}`);

      try {
        await decrementVote(id, currentVotes);
        showToast(t.voteRemoved.replace('{song}', songTitle));
      } catch (err) {
        console.error(err);
      }
    } else {
      // Upvote logic
      const updater = (prev: Suggestion[]) =>
        prev.map(s => (s.id === id ? { ...s, votes: s.votes + 1 } : s)).sort((a, b) => b.votes - a.votes);
      setSuggestions(updater);
      setOpenSuggestions(updater);
      setVotedIds(prev => ({ ...prev, [id]: true }));
      localStorage.setItem(`meloscribe_voted_${id}`, 'true');

      try {
        await incrementVote(id, currentVotes);
        showToast(t.voteAdded.replace('{song}', songTitle));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) {
      showToast(t.fillFields);
      return;
    }

    setSubmitting(true);

    // 0. Check if already published on website with requested format (with Fuzzy Matching)
    const matchedCatalogSong = findMatchingCatalogSong(title, artist);

    if (matchedCatalogSong) {
      setSubmitting(false);
      setTitle('');
      setArtist('');
      setMatchedSongBanner(matchedCatalogSong);

      showToast(t.alreadyPublishedMsg.replace('{title}', matchedCatalogSong.title));

      if (onSelectSong) {
        onSelectSong(matchedCatalogSong);
      }
      return;
    }

    // 1. Fuzzy Check against existing suggestions for smart upvote
    let matchFound: Suggestion | null = null;
    for (const sug of openSuggestions) {
      const artistMatches = areArtistsMatching(artist, sug.artist);
      const titleMatches = areTitlesMatching(title, sug.title, artistMatches);

      if (titleMatches && artistMatches) {
        matchFound = sug;
        break;
      }
    }

    if (matchFound) {
      // Duplication Intercept: Increment existing vote count
      const existingId = matchFound.id;
      const currentVotes = matchFound.votes;
      const matchedTitle = matchFound.title;

      setTitle('');
      setArtist('');
      setSubmitting(false);

      if (votedIds[existingId]) {
        showToast(t.alreadyVoted.replace('{title}', matchedTitle));
        return;
      }

      // Perform upvote on existing
      await handleUpvote(existingId, currentVotes, matchedTitle);
      showToast(t.similarVoted.replace('{title}', matchedTitle));
      return;
    }

    // 2. Perform fresh insert
    try {
      const newSug = await insertSuggestion(title, artist);
      
      // Auto upvote for user
      localStorage.setItem(`meloscribe_voted_${newSug.id}`, 'true');
      setVotedIds(prev => ({ ...prev, [newSug.id]: true }));

      // Reload suggestions list
      await loadData();

      setTitle('');
      setArtist('');
      showToast(t.suggestSuccess.replace('{song}', newSug.title));
    } catch (err) {
      console.error(err);
      showToast(t.suggestError);
    }
    setSubmitting(false);
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[85vh]">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-neon-cyan mb-8 cursor-pointer transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        {/* Title & Description */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-top-3 duration-300">
            <span className="text-gradient neon-text-cyan">{t.title}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Suggestion Form Card */}
        <div className="glass-card mb-10 p-6 sm:p-8 relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-dark-500/50 dark:bg-dark-800/80 transition-all duration-500">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white">{t.suggestHeading}</h3>
          </div>

          {/* Interactive Match Notification Banner */}
          {matchedSongBanner && (
            <div className="mb-6 p-4 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan font-bold text-xs flex-shrink-0">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t.alreadyPublishedMsg.replace('{title}', matchedSongBanner.title)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {matchedSongBanner.artist}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectSong?.(matchedSongBanner)}
                className="btn-neon-solid text-xs px-4 py-1.5 flex items-center gap-1.5 flex-shrink-0 cursor-pointer w-full sm:w-auto justify-center"
              >
                <span>{t.viewSheetMusic}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.inputTitle}</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t.placeholderTitle}
                className="w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-dark-900/60 border border-gray-300 dark:border-dark-500/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan-subtle transition-all duration-300"
              />
            </div>
            
            <div className="w-full sm:flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.inputArtist}</label>
              <input
                type="text"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                placeholder={t.placeholderArtist}
                className="w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-dark-900/60 border border-gray-300 dark:border-dark-500/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan-subtle transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto btn-neon-solid flex items-center justify-center gap-2 px-6 py-2.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? '...' : t.btnSubmit}
            </button>
          </form>
        </div>

        {/* Horizontal Swipe-Strip for Completed/Arranged Community Songs */}
        {completedList.length > 0 && (
          <div className="mb-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t.completedStripTitle}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollStrip('left')}
                  disabled={!canScrollLeft}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-white/80 dark:bg-dark-800/80 border border-gray-300 dark:border-dark-600 hover:border-neon-cyan text-gray-600 dark:text-gray-300 hover:text-neon-cyan transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none shadow-sm"
                  title="Scroll left"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollStrip('right')}
                  disabled={!canScrollRight}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-white/80 dark:bg-dark-800/80 border border-gray-300 dark:border-dark-600 hover:border-neon-cyan text-gray-600 dark:text-gray-300 hover:text-neon-cyan transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none shadow-sm"
                  title="Scroll right"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div 
              ref={stripRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 px-0.5 cursor-grab active:cursor-grabbing select-none"
            >
              {completedList.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (hasDraggedRef.current) return;
                    if (item.song && onSelectSong) {
                      onSelectSong(item.song);
                    }
                  }}
                  className="inline-flex items-center gap-2 h-9 whitespace-nowrap px-4 rounded-full text-xs font-semibold bg-white/80 dark:bg-dark-800/80 hover:bg-white dark:hover:bg-dark-700 border border-neon-cyan/40 hover:border-neon-cyan text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm hover:shadow-neon-cyan-subtle flex-shrink-0 group"
                  title={`${item.title} - ${item.artist} (${t.viewSheetMusic})`}
                >
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-neon-cyan/20 text-neon-cyan font-bold text-[10px]">
                    ✓
                  </span>
                  <span className="tracking-tight group-hover:text-neon-cyan transition-colors">{item.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-neon-cyan transition-colors ml-0.5 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Table/List */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-dark-500/50 dark:bg-dark-800/80">
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200/50 dark:border-dark-600/50">
            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-neon-pink" />
              <span>{t.leaderboard}</span>
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {openSuggestions.length} {t.requestsLabel}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">{t.loading}</div>
          ) : openSuggestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t.noSuggestions}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {openSuggestions.map((sug, idx) => {
                const hasVoted = votedIds[sug.id];
                return (
                  <div
                    key={sug.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-dark-900/40 border border-gray-200/40 dark:border-dark-700/30 hover:border-neon-cyan/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Number */}
                      <span className="font-display font-bold text-base text-gray-400 dark:text-gray-500 w-6">
                        #{idx + 1}
                      </span>
                      
                      {/* Song Details */}
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white text-base sm:text-lg leading-tight">
                          {sug.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {sug.artist}
                        </p>
                      </div>
                    </div>

                    {/* Action: Upvote Arrow Button */}
                    <button
                      onClick={() => handleUpvote(sug.id, sug.votes, sug.title)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                        hasVoted 
                          ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-neon-cyan-subtle'
                          : 'bg-transparent border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/15 hover:border-neon-cyan hover:shadow-neon-cyan-subtle'
                      }`}
                      title={hasVoted ? 'Already voted' : 'Upvote song request'}
                    >
                      <ChevronUp className={`w-4 h-4 sm:w-5 h-5 ${!hasVoted ? 'animate-bounce' : ''}`} />
                      <span>{sug.votes}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
