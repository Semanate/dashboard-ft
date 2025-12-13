import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { jsonResponse } from '../_shared/response.ts'

serve(async (req) => {
    if (req.method !== 'PATCH') {
        return jsonResponse({ success: false, error: 'Method not allowed' }, 405)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
        return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const jwt = authHeader.replace('Bearer ', '')

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        {
            global: { headers: { Authorization: `Bearer ${jwt}` } }
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return jsonResponse({ success: false, error: 'Invalid token' }, 401)
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return jsonResponse({ success: false, error: 'Forbidden' }, 403)
    }

    const body = await req.json()
    const { userId, role } = body

    if (!userId || !role) {
        return jsonResponse({ success: false, error: 'Missing params' }, 400)
    }

    const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error } = await admin
        .from('profiles')
        .update({ role })
        .eq('id', userId)

    if (error) {
        return jsonResponse({ success: false, error: error.message }, 500)
    }

    return jsonResponse({
        success: true,
        message: 'Role updated successfully'
    })
})
