/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from '@sveltejs/kit';
import { isValidRole } from '$lib/types/roles';

export const load = async ({ locals }) => {
    const user = locals.user;
    if (!user) {
        throw redirect(303, '/login');
    }

    const { data: usersReponse } = await locals.supabase.functions.invoke('list-users', { headers: { Authorization: `Bearer ${locals.accessToken}` } });

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

        // Validar que el rol sea válido usando la función del sistema de roles
        if (!isValidRole(role)) {
            return { error: 'Rol inválido. Los roles permitidos son: admin, user, compliance_officer' };
        }

        try {
            const response = await locals.supabase.functions.invoke('update-user-role', {
                body: JSON.stringify({ userId, role })
            });

            console.log('Response from update-user-role:', response);
            if (response.error) {
                return { error: response.error.message || 'Error al actualizar el usuario' };
            }

            return { success: true };
        } catch (err) {
            console.error('Exception updating user role:', err);
            return { error: 'Error interno del servidor' };
        }
    }
};

