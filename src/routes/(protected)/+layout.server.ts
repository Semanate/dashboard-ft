import { redirect } from '@sveltejs/kit';
import type { Role } from '$lib/types/roles';
import { env } from '$env/dynamic/private';

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const { supabase } = locals;
    const userRole = (locals.user as { role?: Role }).role || 'user';

    const { data: rolePermissions } = await supabase
        .from('role_permissions')
        .select(`
            permissions (
                code
            )
        `)
        .eq('role', userRole);

    const userPermissions: string[] = (rolePermissions || [])
        .map((rp: { permissions: { code: string }[] | { code: string } | null }) => {
            if (Array.isArray(rp.permissions)) {
                return rp.permissions[0]?.code;
            }
            return rp.permissions?.code;
        })
        .filter((code): code is string => typeof code === 'string');

    console.log('📦 Layout Server - Passing data to client:');
    console.log('  - User ID:', locals.user.id);
    console.log('  - User Role:', (locals.user as any).role);
    console.log('  - Access Token present:', !!locals.accessToken);
    console.log('  - Refresh Token present:', !!locals.refreshToken);
    console.log('  - Supabase URL present:', !!env.SUPABASE_URL);

    return {
        user: locals.user as typeof locals.user & { role: Role },
        userPermissions,
        supabaseUrl: env.SUPABASE_URL,
        supabaseAnonKey: env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? env.SUPABASE_ANON_KEY ?? env.SUPABASE_KEY,
        accessToken: locals.accessToken,
        refreshToken: locals.refreshToken
    };
};