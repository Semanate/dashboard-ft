import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { jsonResponse } from '../_shared/response.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Roles válidos en el sistema
const VALID_ROLES = ['admin', 'user', 'compliance_officer'] as const
type Role = typeof VALID_ROLES[number]

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  user: 'Usuario',
  compliance_officer: 'Oficial de Cumplimiento'
}

function getRoleLabel(role: string): string {
  return ROLE_LABELS[role as Role] ?? role
}

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

    const users = authUsers.map(user => {
      const profile = profiles?.find(p => p.id === user.id)
      const role = profile?.role ?? 'user'

      return {
        id: user.id,
        email: user.email,
        role: role,
        roleLabel: getRoleLabel(role),
        created_at: user.created_at,
        user_metadata: user.user_metadata
      }
    })


    return jsonResponse({
      success: true,
      data: users,
      meta: {
        total: users.length,
        validRoles: VALID_ROLES,
        roleLabels: ROLE_LABELS
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
