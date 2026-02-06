/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';

let cachedClient: SupabaseClient | null = null;
let currentUrl: string = '';
let currentKey: string = '';

/**
 * Initializes the global Supabase client singleton.
 */
export function initSupabase(url: string, key: string): SupabaseClient {
    if (!cachedClient || currentUrl !== url || currentKey !== key) {
        currentUrl = url;
        currentKey = key;
        cachedClient = createClient(url, key);
    }
    return cachedClient;
}

/**
 * Gets the current environment configuration.
 * Only safe to call on server or after initialization.
 */
export function getDataFromEnv(): { supabaseUrl: string; supabaseKey: string } {
    return {
        supabaseUrl: currentUrl,
        supabaseKey: currentKey
    };
}

/**
 * Global Supabase singleton.
 * Be sure to initialize it on the client side during onMount
 * or manually on the server.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        if (!cachedClient) {
            if (browser) {
                console.warn('Accessing supabase before initialization in browser.');
            }
            return undefined;
        }
        const value = (cachedClient as any)[prop];
        return typeof value === 'function' ? value.bind(cachedClient) : value;
    }
});
