// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import '$lib/db/server'; // Initialize global supabase on server
import { supabase } from '$lib/db/client';
import { isValidRole, canAccessRoute, ROLES, type Role } from '$lib/types/roles';

const PUBLIC_ROUTES = ['/login', '/register', '/', '/forgot-password', '/update-password', '/api/auth/set-session'];

export const handle: Handle = async ({ event, resolve }) => {
    const pathName = event.url.pathname;
    if (PUBLIC_ROUTES.includes(pathName)) {
        return resolve(event);
    }

    const accessToken = event.cookies.get('sb-access-token');
    const refreshToken = event.cookies.get('sb-refresh-token');

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

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile) {
        throw redirect(303, '/login');
    }

    const userRole: Role = isValidRole(profile.role) ? profile.role : ROLES.USER;

    const userWithRole = { ...user, role: userRole };
    event.locals.user = userWithRole;
    event.locals.accessToken = accessToken;
    event.locals.refreshToken = refreshToken ?? null;
    event.locals.supabase = supabase;


    if (!canAccessRoute(userRole, pathName)) {
        if (userRole === ROLES.ADMIN) {
            throw redirect(303, '/admin');
        } else if (userRole === ROLES.COMPLIANCE_OFFICER) {
            throw redirect(303, '/sarlaft');
        } else {
            throw redirect(303, '/dashboard');
        }
    }

    return resolve(event);
};
