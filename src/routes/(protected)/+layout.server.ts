import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // const { data: profile, error } = await locals.supabase
    //     .from('profiles')
    //     .select('role')
    //     .single();

    // if (error || !profile) {
    //     throw redirect(303, '/login');
    // }
    // const user = { ...locals.user, role: profile.role };

    return { user: locals.user };
};


