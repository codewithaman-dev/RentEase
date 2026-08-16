import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yxxurltnffzeqfmjmpdy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_6W8RE7pLhO_4JjBsbexiSg_Q5unPDUG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
