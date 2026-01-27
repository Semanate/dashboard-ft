import { redirect } from '@sveltejs/kit';
import { ROLES } from '$lib/types/roles';

export const load = async ({ locals }) => {

    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // Solo admin puede acceder a las rutas de administración
    if (locals.user.role !== ROLES.ADMIN) {
        // Redirigir según el rol
        if (locals.user.role === ROLES.COMPLIANCE_OFFICER) {
            throw redirect(303, '/sarlaft');
        }
        throw redirect(303, '/dashboard');
    }

    return { user: locals.user };
};


