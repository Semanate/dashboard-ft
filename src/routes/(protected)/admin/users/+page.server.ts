import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {

    const user = locals.user;
    console.log("Loaded User:", user);
    if (!user) {
        throw redirect(303, '/login');
    }
    return { user };
};

