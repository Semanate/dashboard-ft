import { env } from '$env/dynamic/private';
import { initSupabase } from './client';

/**
 * Server-only initialization logic.
 * Importing this file on the server will automatically seed the global supabase client.
 */
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey =
    env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    env.SUPABASE_ANON_KEY ??
    env.SUPABASE_KEY;

if (supabaseUrl && supabaseKey) {
    initSupabase(supabaseUrl, supabaseKey);
} else {
    console.error('SERVER-INIT: Missing Supabase environment variables.');
}
