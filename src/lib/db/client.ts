/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

let cachedClient: SupabaseClient | null = null;

export function getDataFromEnv(): { supabaseUrl: string; supabaseKey: string } {
    const supabaseUrl = env.SUPABASE_URL ?? '';
    const supabaseKey =
        env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
        env.SUPABASE_ANON_KEY ??
        env.SUPABASE_KEY ??
        '';

    return { supabaseUrl: supabaseUrl, supabaseKey: supabaseKey };
}


function createSupabaseClient(): SupabaseClient {
    const supabaseUrl = env.SUPABASE_URL ?? '';
    const supabaseKey =
        env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
        env.SUPABASE_ANON_KEY ??
        env.SUPABASE_KEY ??
        '';

    // console.log("Supabase URL:", supabaseUrl ? "Loaded" : "Missing");
    // console.log("Supabase Key:", supabaseKey ? "Loaded" : "Missing");
    if (!supabaseUrl) {
        throw new Error('Missing Supabase URL. Set SUPABASE_URL or SUPABASE_URL.');
    }
    if (!supabaseKey) {
        throw new Error(
            'Missing Supabase key. Set SUPABASE_PUBLISHABLE_DEFAULT_KEY, SUPABASE_ANON_KEY, or SUPABASE_KEY.'
        );
    }

    return createClient(supabaseUrl, supabaseKey,);
}

export function getSupabaseClient(): SupabaseClient {
    if (!cachedClient) cachedClient = createSupabaseClient();
    return cachedClient;
}

// Preserve the existing API (import { supabase } ...) without
// instantiating the client at module-evaluation time (which breaks Docker builds).
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const client = getSupabaseClient();
        const value = (client as any)[prop];
        return typeof value === 'function' ? value.bind(client) : value;
    }
});
