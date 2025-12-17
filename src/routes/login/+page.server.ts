import { ErrorCodes } from '$lib/constants/error.codes';
import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/db/client';


export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = String(form.get('email'));
        const password = String(form.get('password'));
        const rememberMe = form.get('remember-me') === 'on';


        if (!email || !password) {
            return fail(400, {
                ...ErrorCodes.MISSING_FIELDS, message: ErrorCodes.MISSING_FIELDS.message.replace('${message}', 'obligatorios')
            });
        }

        // if (rememberMe) {
        //     const { error } = await supabase.auth.setSession({
        //         refresh_token: ''
        //     });
        //     if (error) {
        //         return fail(400, { ...ErrorCodes.INVALID_CREDENTIALS });
        //     }

        //     throw redirect(303, '/dashboard');
        // }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Error during sign-in:', error);
            return fail(400, { ...ErrorCodes.INVALID_CREDENTIALS });
        }

        cookies.set("sb-access-token", data.session.access_token, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 60 * 60 * 24 * 7 // 7 días
        });

        cookies.set("sb-refresh-token", data.session.refresh_token, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 60 * 60 * 24 * 30 // 30 días
        });


        throw redirect(303, '/dashboard');
    }
};