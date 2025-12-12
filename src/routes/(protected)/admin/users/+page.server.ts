import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {

    const user = locals.user;
    if (!user) {
        throw redirect(303, '/login');
    }
    const { data: users } = await locals.supabase
        .from('profiles')
        .select('id, role');
    console.log(users);
    return { user, users: users || [] };
};

