import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const { id } = params;
    const accessToken = (locals as any).accessToken;

    if (!accessToken) {
        throw error(401, 'No tienes autorización');
    }

    const { data: usersResponse } = await locals.supabase.functions.invoke('list-users');
    if (!usersResponse || !usersResponse.data) {
        throw error(500, 'Error al obtener usuarios');
    }

    const { data: users, success } = usersResponse;
    if (!success || !users) {
        throw error(500, 'Error al obtener usuarios');
    }

    const user = users.find(u => u.id === id);

    if (!user) {
        throw error(404, 'Usuario no encontrado');
    }

    return {
        user
    };
};

export const actions = {
    update: async ({ request, params, locals }) => {
        const { id } = params;
        const formData = await request.formData();

        const role = formData.get('role')?.toString();

        if (!role) {
            return { error: 'El rol es requerido' };
        }

        if (!['admin', 'user'].includes(role)) {
            return { error: 'Rol inválido' };
        }

        try {
            const { data: response } = await locals.supabase.functions.invoke('update-user-role', {
                body: JSON.stringify({ userId: id, role })
            });

            if (!response.success) {
                // const errorData = await response.text();
                // console.error('Error response:', errorData);
                return { error: 'Error al actualizar el usuario' };
            }


            throw redirect(303, '/admin/users');
        } catch (err) {
            if (err instanceof Response && err.status === 303) {
                throw err; // Re-throw redirect
            }
            console.error('Exception updating user role:', err);
            return { error: 'Error interno del servidor' };
        }
    }
};