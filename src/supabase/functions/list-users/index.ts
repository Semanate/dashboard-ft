import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { jsonResponse } from '../_shared/response.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async () => {
  try {

    const admin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    )

    /* ============================
       1. OBTENER USUARIOS AUTH
       ============================ */

    const { data: authData, error: authError } =
      await admin.auth.admin.listUsers({ perPage: 1000 })

    if (authError) {
      console.error('AUTH ERROR:', authError)
      return jsonResponse({
        success: false,
        data: null,
        error: authError.message
      }, 500)
    }

    const authUsers = authData?.users ?? []

    /* ============================
       2. OBTENER ROLES (profiles)
       ============================ */

    const { data: profiles, error: profileError } =
      await admin.from('profiles').select('id, role')

    if (profileError) {
      console.error('PROFILE ERROR:', profileError)
      return jsonResponse({
        success: false,
        data: null,
        error: profileError.message
      }, 500)
    }

    /* ============================
       3. UNIR AUTH + PROFILES
       ============================ */

    const users = authUsers.map(user => {
      const profile = profiles?.find(p => p.id === user.id)

      return {
        id: user.id,
        email: user.email,
        role: profile?.role ?? 'user',
        created_at: user.created_at
      }
    })

    /* ============================
       4. RESPUESTA FINAL
       ============================ */

    return jsonResponse({
      success: true,
      data: users,
      meta: {
        total: users.length
      },
      message: 'Users fetched successfully'
    })

  } catch (err) {
    console.error('EDGE FUNCTION ERROR:', err)

    return jsonResponse({
      success: false,
      data: null,
      error: err?.message ?? String(err)
    }, 500)
  }
})
