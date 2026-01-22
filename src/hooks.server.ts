// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import { supabase } from '$lib/db/client';

const PUBLIC_ROUTES = ['/login', '/register', '/'];

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = supabase;
    const pathName = event.url.pathname;
    if (PUBLIC_ROUTES.includes(pathName)) {
        return resolve(event);
    }

    const accessToken = event.cookies.get('sb-access-token');

    if (!accessToken) {
        event.locals.user = null;
        throw redirect(303, '/login');
    }


    const {
        data: { user },
        error
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
        event.locals.user = null;
        throw redirect(303, '/login');
    }

    event.locals.user = user;
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile) {
        throw redirect(303, '/login');
    }
    event.locals.user.role = profile.role;
    event.locals.accessToken = accessToken;
    event.locals.supabase = supabase;

    return resolve(event);
};
