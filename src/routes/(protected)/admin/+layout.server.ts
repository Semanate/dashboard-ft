import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {

    if (!locals.user) {
        throw redirect(303, '/login');
    }

    if (locals.user.role !== 'admin') {
        throw redirect(303, '/dashboard');
    }

    return { user: locals.user };
};


