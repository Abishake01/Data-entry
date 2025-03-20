// lib/supabase.ts (or wherever your Supabase client is initialized)
import { createClient } from '@supabase/supabase-js';

// Check for environment variables during build time
if (typeof window === 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are missing!');
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing or invalid!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);