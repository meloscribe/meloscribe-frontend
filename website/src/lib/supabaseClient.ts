export interface Suggestion {
  id: string;
  title: string;
  artist: string;
  votes: number;
  created_at: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'https://wooing-encrust-ladle.ngrok-free.dev'
    : 'https://api.meloscribe.dev');

/**
 * Fetch top active suggestions from backend database, sorted by votes.
 */
export async function fetchSuggestions(): Promise<Suggestion[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/suggestions`);
    if (!res.ok) throw new Error('Failed to fetch suggestions');
    return await res.json();
  } catch (err) {
    console.error('[fetchSuggestions] error:', err);
    return [];
  }
}

/**
 * Insert a new song suggestion row in the backend.
 */
export async function insertSuggestion(title: string, artist: string): Promise<Suggestion> {
  const res = await fetch(`${API_BASE}/api/public/suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, artist }),
  });
  if (!res.ok) throw new Error('Failed to create suggestion');
  return await res.json();
}

/**
 * Increment an existing song's vote count in the backend.
 */
export async function incrementVote(id: string, currentVotes: number): Promise<Suggestion> {
  const res = await fetch(`${API_BASE}/api/public/suggestions/${id}/vote`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to increment vote');
  const data = await res.json();
  return {
    id,
    title: '',
    artist: '',
    votes: data.votes,
    created_at: '',
  };
}

/**
 * Decrement an existing song's vote count in the backend.
 */
export async function decrementVote(id: string, currentVotes: number): Promise<Suggestion> {
  const res = await fetch(`${API_BASE}/api/public/suggestions/${id}/unvote`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to decrement vote');
  const data = await res.json();
  return {
    id,
    title: '',
    artist: '',
    votes: data.votes,
    created_at: '',
  };
}
