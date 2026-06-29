import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronUp, Music, Sparkles } from 'lucide-react';
import { fetchSuggestions, insertSuggestion, incrementVote, decrementVote, Suggestion } from '../lib/supabaseClient';

interface SuggestionsProps {
  onBack: () => void;
  language: string;
  showToast: (message: string) => void;
}

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

export default function Suggestions({ onBack, language, showToast }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});

  // Input states
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  // Translations
  const isDe = language === 'de';
  const isFr = language === 'fr';

  const t = {
    title: isDe ? 'Community Wunschliste' : isFr ? 'Demandes de la Communauté' : 'Community Requests',
    subtitle: isDe ? 'Stimme für deine Lieblingssongs ab oder schlage neue vor. Die am besten bewerteten Songs werden zuerst arrangiert.' : isFr ? 'Votez pour vos chansons préférées ou suggérez-en de nouvelles. Les arrangements sont créés selon la demande.' : 'Vote for your favorite tracks or suggest new ones. Arrangements are created based on community demand.',
    suggestHeading: isDe ? 'Siehst du deinen Song nicht? Schlage ihn vor...' : isFr ? 'Vous ne voyez pas votre chanson ? Suggérez-la...' : "Don't see your song? Suggest it here...",
    inputTitle: isDe ? 'Songtitel *' : isFr ? 'Titre de la chanson *' : 'Song Title *',
    inputArtist: isDe ? 'Künstler / Interpret *' : isFr ? 'Artiste / Groupe *' : 'Artist / Band *',
    btnSubmit: isDe ? 'Vorschlag senden' : isFr ? 'Envoyer la demande' : 'Submit Suggestion',
    leaderboard: isDe ? 'Rangliste' : isFr ? 'Classement' : 'Leaderboard',
    noSuggestions: isDe ? 'Noch keine Wünsche eingegangen. Sei der Erste!' : isFr ? 'Aucune demande pour le moment. Soyez le premier !' : 'No suggestions yet. Be the first to make a request!',
    backBtn: isDe ? 'Zurück' : isFr ? 'Retour' : 'Back',
  };

  const loadData = async () => {
    setLoading(true);
    const data = await fetchSuggestions();
    setSuggestions(data);
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

  const handleUpvote = async (id: string, currentVotes: number, songTitle: string) => {
    if (votedIds[id]) {
      // Unvote logic
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, votes: Math.max(0, s.votes - 1) } : s).sort((a, b) => b.votes - a.votes));
      setVotedIds(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      localStorage.removeItem(`meloscribe_voted_${id}`);

      try {
        await decrementVote(id, currentVotes);
        showToast(isDe ? `Stimme für "${songTitle}" entfernt.` : `Removed vote for "${songTitle}".`);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Upvote logic
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s).sort((a, b) => b.votes - a.votes));
      setVotedIds(prev => ({ ...prev, [id]: true }));
      localStorage.setItem(`meloscribe_voted_${id}`, 'true');

      try {
        await incrementVote(id, currentVotes);
        showToast(isDe ? `Stimme für "${songTitle}" hinzugefügt!` : `Added vote for "${songTitle}"!`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) {
      showToast(isDe ? 'Bitte fülle alle Pflichtfelder aus!' : 'Please fill in all required fields!');
      return;
    }

    setSubmitting(true);

    const normInputTitle = normalizeString(title);
    const normInputArtist = normalizeString(artist);

    // 1. Check for duplicates in current list using fuzzy scoring
    let matchFound: Suggestion | null = null;

    for (const sug of suggestions) {
      const simTitle = getSimilarityScore(title, sug.title);
      const simArtist = getSimilarityScore(artist, sug.artist);

      const distTitle = getLevenshteinDistance(normInputTitle, normalizeString(sug.title));
      const distArtist = getLevenshteinDistance(normInputArtist, normalizeString(sug.artist));

      // Similarity score >= 85% OR character distance <= 2
      const titleMatches = simTitle >= 0.85 || distTitle <= 2;
      const artistMatches = simArtist >= 0.85 || distArtist <= 2;

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
        showToast(isDe 
          ? `Gleicher Song gefunden! Du hast für "${matchedTitle}" bereits abgestimmt.` 
          : `Match found! You have already voted for "${matchedTitle}".`
        );
        return;
      }

      // Perform upvote on existing
      await handleUpvote(existingId, currentVotes, matchedTitle);
      showToast(isDe 
        ? `Ähnlicher Song gefunden! Stimme wurde hinzugefügt für: ${matchedTitle}.` 
        : `Close match found! Added your vote to the existing request: ${matchedTitle}.`
      );
      return;
    }

    // 2. Perform fresh insert
    try {
      const newSug = await insertSuggestion(title, artist);
      
      // Auto upvote for user
      localStorage.setItem(`meloscribe_voted_${newSug.id}`, 'true');
      setVotedIds(prev => ({ ...prev, [newSug.id]: true }));

      // Reload suggestions list
      const updatedList = await fetchSuggestions();
      setSuggestions(updatedList);

      setTitle('');
      setArtist('');
      showToast(isDe ? `Erfolgreich vorgeschlagen: "${newSug.title}"` : `Successfully suggested: "${newSug.title}"`);
    } catch (err) {
      console.error(err);
      showToast(isDe ? 'Fehler beim Speichern deiner Anfrage.' : 'Error saving your request.');
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

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.inputTitle}</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. In The End"
                className="w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-dark-900/60 border border-gray-300 dark:border-dark-500/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan-subtle transition-all duration-300"
              />
            </div>
            
            <div className="w-full sm:flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.inputArtist}</label>
              <input
                type="text"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                placeholder="e.g. Linkin Park"
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

        {/* Leaderboard Table/List */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-dark-500/50 dark:bg-dark-800/80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50 dark:border-dark-600/50">
            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-neon-pink" />
              <span>{t.leaderboard}</span>
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{suggestions.length} requests</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading suggestions...</div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">{t.noSuggestions}</div>
          ) : (
            <div className="flex flex-col gap-4">
              {suggestions.map((sug, idx) => {
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

                    {/* Upvote Arrow Button */}
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
