import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Blog = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author_id: string;
  author_name: string | null;
  created_at: string;
  updated_at: string;
};
