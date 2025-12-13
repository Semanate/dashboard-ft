import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, cookies }) => {

    const user = locals.user;
    if (!user) {
        throw redirect(303, '/login');
    }
    const accessToken = locals.accessToken;
    // console.log(JSON.parse(atob(accessToken.split('.')[1])));

    // console.log('Access Token in admin users page:', JSON.parse(atob(accessToken.split('.')[1])));
    if (!accessToken) {
        throw new Error('No session')
    }

    console.log('Fetched users:', accessToken);
    const res = await fetch(
        'http://127.0.0.1:54321/functions/v1/list-users',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    const users = await res.json()

    if (!res.ok) {
        throw new Error(users.error || 'Failed to fetch users');
    }
    // const users = []
    return { user, users: users || [] };
};

