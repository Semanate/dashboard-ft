import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/db/client';

export const load = async ({ cookies }) => {
    const accessToken = cookies.get("sb-access-token");
    if (!accessToken) {
        throw redirect(303, '/login');
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);

    return { user };
};

