import { fail, redirect } from '@sveltejs/kit';
import { createSupabaseClient } from '$lib/db/client';

export const load = async ({ cookies }) => {
    const accessToken = cookies.get('sb-access-token');
    return {
        hasSession: !!accessToken
    };
};

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const password = formData.get('password')?.toString();
        const confirmPassword = formData.get('confirm_password')?.toString();

        const refreshToken = cookies.get('sb-refresh-token');
        const accessToken = cookies.get('sb-access-token');

        if (!password || !confirmPassword) {
            return fail(400, { error: true, message: 'Todos los campos son obligatorios' });
        }

        if (password !== confirmPassword) {
            return fail(400, { error: true, message: 'Las contraseñas no coinciden' });
        }

        if (!refreshToken || !accessToken) {
            return fail(401, { error: true, message: 'Sesión no válida. Por favor solicita un nuevo enlace.' });
        }

        const supabase = createSupabaseClient();

        // Set session for the user context
        const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        if (sessionError) {
            return fail(401, { error: true, message: 'Sesión expirada.' });
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            return fail(500, { error: true, message: error.message });
        }

        throw redirect(303, '/login');
    }
};
