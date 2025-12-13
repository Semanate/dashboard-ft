import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { jsonResponse } from '../_shared/response.ts'

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

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        {
            global: {
                headers: { Authorization: `Bearer ${jwt}` }
            }
        }
    )

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

    const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

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
