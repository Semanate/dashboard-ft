// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import { supabase } from '$lib/db/client';
import { isValidRole, canAccessRoute, ROLES, type Role } from '$lib/types/roles';

const PUBLIC_ROUTES = ['/login', '/register', '/', '/forgot-password', '/update-password', '/api/auth/set-session'];

export const handle: Handle = async ({ event, resolve }) => {
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

    // Obtener el perfil con el rol
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile) {
        throw redirect(303, '/login');
    }

    // Validar que el rol sea válido
    const userRole: Role = isValidRole(profile.role) ? profile.role : ROLES.USER;

    // Agregar el rol al usuario
    const userWithRole = { ...user, role: userRole };
    event.locals.user = userWithRole;
    event.locals.accessToken = accessToken;
    event.locals.supabase = supabase;

    // Verificar acceso a la ruta
    if (!canAccessRoute(userRole, pathName)) {
        // Redirigir según el rol
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
