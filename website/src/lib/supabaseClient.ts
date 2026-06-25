import { createClient } from '@supabase/supabase-js';

export interface Suggestion {
  id: string;
  title: string;
  artist: string;
  votes: number;
  created_at: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Determine if we should run in mock mode
const isMockMode = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('your-supabase-url') || 
  supabaseAnonKey.includes('your-placeholder-anon-key');

// Initialize the Supabase client safely if possible
export const supabase = !isMockMode 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (isMockMode) {
  console.warn('[Supabase Client] Running in mock/localStorage fallback mode. Real database interactions are disabled because credentials are placeholders or missing.');
}

// LocalStorage key for mock storage
const MOCK_STORAGE_KEY = 'meloscribe_mock_suggestions';

// No seed data — leaderboard starts empty until real suggestions are submitted
const DEFAULT_MOCK_SUGGESTIONS: Suggestion[] = [];

// Old hardcoded seed IDs to purge from localStorage on migration
const SEED_IDS_TO_PURGE = ['mock-uuid-1', 'mock-uuid-2', 'mock-uuid-3', 'mock-uuid-4', 'mock-uuid-5'];

function getMockSuggestions(): Suggestion[] {
  const stored = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    const parsed: Suggestion[] = JSON.parse(stored);
    // Purge old hardcoded seed entries on migration
    const filtered = parsed.filter(s => !SEED_IDS_TO_PURGE.includes(s.id));
    if (filtered.length !== parsed.length) {
      // Persiste the cleaned list
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch (e) {
    return [];
  }
}

function saveMockSuggestions(list: Suggestion[]) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(list));
}

/**
 * Fetch top active suggestions, sorted by votes descending.
 */
export async function fetchSuggestions(): Promise<Suggestion[]> {
  if (isMockMode || !supabase) {
    const list = getMockSuggestions();
    return list.sort((a, b) => b.votes - a.votes);
  }

  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('votes', { ascending: false });

    if (error) {
      console.error('[Supabase fetch error] Falling back to mock data:', error.message);
      return getMockSuggestions().sort((a, b) => b.votes - a.votes);
    }

    return (data || []) as Suggestion[];
  } catch (e) {
    console.error('[Supabase fetch exception] Falling back to mock data:', e);
    return getMockSuggestions().sort((a, b) => b.votes - a.votes);
  }
}

/**
 * Insert a new song suggestion row.
 */
export async function insertSuggestion(title: string, artist: string): Promise<Suggestion> {
  const cleanTitle = title.trim();
  const cleanArtist = artist.trim();

  if (isMockMode || !supabase) {
    const list = getMockSuggestions();
    const newSug: Suggestion = {
      id: `mock-uuid-${Date.now()}`,
      title: cleanTitle,
      artist: cleanArtist,
      votes: 1,
      created_at: new Date().toISOString(),
    };
    list.push(newSug);
    saveMockSuggestions(list);
    return newSug;
  }

  try {
    const { data, error } = await supabase
      .from('suggestions')
      .insert([{ title: cleanTitle, artist: cleanArtist, votes: 1 }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Suggestion;
  } catch (e: any) {
    console.error('[Supabase insert error] Performing mock insert:', e.message || e);
    // Fallback locally
    const list = getMockSuggestions();
    const newSug: Suggestion = {
      id: `mock-uuid-${Date.now()}`,
      title: cleanTitle,
      artist: cleanArtist,
      votes: 1,
      created_at: new Date().toISOString(),
    };
    list.push(newSug);
    saveMockSuggestions(list);
    return newSug;
  }
}

/**
 * Increment an existing song's vote count.
 */
export async function incrementVote(id: string, currentVotes: number): Promise<Suggestion> {
  if (isMockMode || !supabase || id.startsWith('mock-uuid-')) {
    const list = getMockSuggestions();
    const updated = list.map(s => {
      if (s.id === id) {
        return { ...s, votes: s.votes + 1 };
      }
      return s;
    });
    saveMockSuggestions(updated);
    const found = updated.find(s => s.id === id);
    if (!found) {
      throw new Error(`Mock suggestion with ID ${id} not found.`);
    }
    return found;
  }

  try {
    const { data, error } = await supabase
      .from('suggestions')
      .update({ votes: currentVotes + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Suggestion;
  } catch (e: any) {
    console.error('[Supabase upvote error] Performing mock upvote:', e.message || e);
    // Fallback locally
    const list = getMockSuggestions();
    const updated = list.map(s => {
      if (s.id === id) {
        return { ...s, votes: s.votes + 1 };
      }
      return s;
    });
    saveMockSuggestions(updated);
    const found = updated.find(s => s.id === id);
    if (!found) {
      throw new Error(`Mock suggestion with ID ${id} not found.`);
    }
    return found;
  }
}
