import { fetchAdminUsers } from '$lib/api/admin/users.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, cookies }) => {

    const user = locals.user;
    if (!user) {
        throw redirect(303, '/login');
    }
    const accessToken = locals.accessToken;
    
    if (!accessToken) {
        throw new Error('No session')
    }

    const res = fetchAdminUsers(accessToken);
    const { data: users, success } = await res;


    if (!success) {
        throw new Error('Failed to fetch users');
    }

    return { user, users: users || [] };
};

