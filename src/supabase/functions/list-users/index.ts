// supabase/functions/list-users/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
    }

    const jwt = authHeader.replace('Bearer ', '')

    // Cliente con JWT del usuario
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        {
            global: {
                headers: { Authorization: `Bearer ${jwt}` }
            }
        }
    )

    // Obtener usuario desde el token
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return new Response(
            JSON.stringify({ error: 'Invalid token' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
    }

    // Verificar rol desde profiles
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError || profile?.role !== 'admin') {
        return new Response(
            JSON.stringify({ error: 'Forbidden' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
    }

    // Cliente admin (service role)
    const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data, error: usersError } =
        await admin.auth.admin.listUsers()

    if (usersError) {
        return new Response(
            JSON.stringify({ error: usersError.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }

    // Traer roles
    const { data: profiles } = await admin
        .from('profiles')
        .select('id, role')

    const usersWithRoles = data.users.map((u) => {
        const profile = profiles?.find(p => p.id === u.id)

        return {
            id: u.id,
            email: u.email,
            name: u.user_metadata?.display_name ?? null,
            role: profile?.role ?? 'user',
            created_at: u.created_at
        }
    })

    return new Response(
        JSON.stringify({ data: usersWithRoles }),
        { headers: { 'Content-Type': 'application/json' } }
    )
})
