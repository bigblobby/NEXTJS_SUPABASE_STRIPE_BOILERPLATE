import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/supabase/types_db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export function createClient(){
  return createBrowserClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!
  );
}