import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ehltpjrakksbhdsoofqa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_edtF3gro9YkCaFdDn4qUpg_-X4DiIfi';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
