import { redirect } from '@sveltejs/kit';
import { getSarlaftById } from '$lib/api/admin/sarlaft';

export const load = async ({ params, locals, cookies }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const { id } = params;

    const accessToken = cookies.get("sb-access-token");
    if (!accessToken) {
        throw redirect(303, '/login');
    }

    const res = await getSarlaftById(accessToken, id);

    if (!res.success || !res.data) {
        throw redirect(303, '/sarlaft');
    }

    return {
        sarlaft: res.data
    };
};
