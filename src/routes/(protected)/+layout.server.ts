import { redirect } from '@sveltejs/kit';
import type { Role } from '$lib/types/roles';

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

    console.log('User Permissions:', userPermissions);
    return {
        user: locals.user as typeof locals.user & { role: Role },
        userPermissions
    };
};