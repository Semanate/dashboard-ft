import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/db/client';
import { ErrorCodes } from '$lib/constants/error.codes.js';
export const actions = {
    register: async ({ request }) => {
        const form = await request.formData();
        const email = String(form.get('email'));
        const password = String(form.get('password'));
        const confirmPassword = String(form.get('confirm-password'));
        const fullName = String(form.get('full-name'));
        const phone = String(form.get('phone'));
 
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
            password,
            phone,
            options: {
                data: {
                    display_name: fullName,
                    // role: 'user'
                }
            }
        });

        if (error
        ) {
            return fail(400, { ...ErrorCodes.SUPABASE_SIGNUP_ERROR });
        }

        throw redirect(303, '/dashboard');
    }
};
