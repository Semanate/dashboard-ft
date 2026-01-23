/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const user = locals.user;
    if (!user) {
        throw redirect(303, '/login');
    }

    const { data: usersReponse } = await locals.supabase.functions.invoke('list-users');

    if (!usersReponse) {
        return { user, users: [] };
    }

    const { data, success } = usersReponse;

    if (!success) {
        return { user, users: [] };
    }
    return { user, users: data ?? [] };
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
            const response = await locals.supabase.functions.invoke('update-user-role', {
                body: JSON.stringify({ userId, role })
            });

            console.log('Response from update-user-role:', response);
            if (!response.success) {
                return { error: 'Error al actualizar el usuario' };
            }

            return { success: true };
        } catch (err) {
            console.error('Exception updating user role:', err);
            return { error: 'Error interno del servidor' };
        }
    }
};

