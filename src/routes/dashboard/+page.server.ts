import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/db/client';
import { ErrorCodes } from '$lib/constants/error.codes.js';
export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();
        const email = String(form.get('email'));
        const password = String(form.get('password'));
        const confirmPassword = String(form.get('confirm-password'));
        const acceptTerms = form.get('accept-terms') === 'on';

        if (!acceptTerms) {
            return fail(400, { error: 'Debes aceptar los términos y condiciones', field: 'accept-terms' });
        }

        if (!email || !password || !confirmPassword) {
            return fail(400, {
                ...ErrorCodes.MISSING_FIELDS, message: ErrorCodes.MISSING_FIELDS.message.replace('${message}', 'obligatorios')
            });
        }

        if (password !== confirmPassword) {
            return fail(400, { ...ErrorCodes.PASSWORD_MISMATCH, field: 'confirm-password' });
        }

        const { error } = await supabase.auth.signUp({
            email,
            password
        });

        console.log('Supabase signup error:', error);
        if (error) {
            return fail(400, { ...ErrorCodes.SUPABASE_SIGNUP_ERROR });
        }

        throw redirect(303, '/dashboard');
    }
};
