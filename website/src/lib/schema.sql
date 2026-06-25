-- SQL Schema for Supabase suggestions table

CREATE TABLE IF NOT EXISTS public.suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  votes INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Setup Public Access Policies
-- These policies allow public users to query, suggest new songs, and upvote existing ones.
CREATE POLICY "Allow public select" ON public.suggestions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.suggestions FOR UPDATE USING (true);
