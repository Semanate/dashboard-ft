import { fetchAdminUsers, updateUserRole } from '$lib/api/admin/users.js';

import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const user = locals.user;
    if (!user) {
        throw redirect(303, '/login');
    }
    // const accessToken = await locals.supabase.auth.getSession().then(session => session.data.session?.access_token);
    // console.log("Access Token:", accessToken.access_token);

    // if (!accessToken) {
    //     throw new Error('No session')
    // }

    // const res = await fetchAdminUsers(accessToken);
    // const { data: users, success, error } = await res;
    // console.log("Fetch users result:", error);
    // if (!success) {
    //     throw new Error('Failed to fetch users');
    // }

    console.log("Admin user loaded:", await locals.supabase.session.getUser());
    return { user, users: [] };
};

export const actions = {
    updateRole: async ({ request, locals }) => {
        const formData = await request.formData();
        const accessToken = (locals as any).accessToken;

        if (!accessToken) {
            return { error: 'No tienes autorización' };
        }

        const userId = formData.get('userId')?.toString();
        const role = formData.get('role')?.toString();

        if (!userId || !role) {
            return { error: 'ID de usuario y rol son requeridos' };
        }

        if (!['admin', 'user'].includes(role)) {
            return { error: 'Rol inválido' };
        }

        try {
            // Usar fetch directamente para llamar a la función edge
            const response = await updateUserRole(accessToken, userId, role);
            if (!response.success) {
                // const errorData = await response.text();
                // console.error('Error response:', errorData);
                return { error: 'Error al actualizar el usuario' };
            }

            return { success: true };
        } catch (err) {
            console.error('Exception updating user role:', err);
            return { error: 'Error interno del servidor' };
        }
    }
};

