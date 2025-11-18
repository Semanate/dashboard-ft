import { fail, redirect } from '@sveltejs/kit';
// import { supabase } from '$lib/supabase/client';

export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();
        const email = String(form.get('email'));
        const password = String(form.get('password'));

        console.log('Register action called with:', { email, password });
        // const { error } = await supabase.auth.signUp({
        //   email,
        //   password
        // });

        // if (error) {
        //   return fail(400, { error: error.message });
        // }

        // throw redirect(303, '/dashboard');
    }
};
