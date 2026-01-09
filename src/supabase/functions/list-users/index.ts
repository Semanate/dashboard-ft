import { serve } from 'https://deno.land/std/http/server.ts'
import { jsonResponse } from '../_shared/response.ts'
import { createAdminClient, createUserClient } from '../_shared/supabase.ts'

serve(async (req) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
        return jsonResponse({
            success: false,
            data: null,
            error: 'Unauthorized'
        }, 401)
    }

    const jwt = authHeader.replace('Bearer ', '')

    const supabase = createUserClient(jwt)

    const { data: { user }, error: userError } =
        await supabase.auth.getUser()

    if (userError || !user) {
        return jsonResponse({
            success: false,
            data: null,
            error: 'Invalid token'
        }, 401)
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return jsonResponse({
            success: false,
            data: null,
            error: 'Forbidden'
        }, 403)
    }

    console.log("Authorized admin user:", user.id, profile.role);
    const admin = createAdminClient()

    const { data, error } = await admin.auth.admin.listUsers()
    if (error || !data?.users) {
        return jsonResponse({
            success: false,
            data: null,
            error: error?.message ?? 'Failed to fetch users'
        }, 500)
    }

    const { data: profiles } = await admin
        .from('profiles')
        .select('id, role')

    const usersWithRoles = data.users.map(u => {
        const profile = profiles?.find(p => p.id === u.id)

        return {
            id: u.id,
            email: u.email,
            name: u.user_metadata?.display_name ?? null,
            role: profile?.role ?? 'user',
            created_at: u.created_at
        }
    })

    return jsonResponse({
        success: true,
        data: usersWithRoles,
        meta: {
            total: usersWithRoles.length
        },
        message: 'Users fetched successfully'
    })
})
