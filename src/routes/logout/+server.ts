import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });
    cookies.delete('session', { path: '/' });

    throw redirect(303, '/login');
}
