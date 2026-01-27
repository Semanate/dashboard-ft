import { serve } from 'https://deno.land/std/http/server.ts'
import { jsonResponse } from '../_shared/response.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Roles válidos en el sistema
const VALID_ROLES = ['admin', 'user', 'compliance_officer'] as const
type Role = typeof VALID_ROLES[number]

function isValidRole(role: string): role is Role {
    return VALID_ROLES.includes(role as Role)
}

serve(async (req) => {
    try {
        const body = await req.json()
        const { userId, role } = body

        if (!userId || !role) {
            return jsonResponse({ success: false, error: 'Missing params: userId and role are required' }, 400)
        }

        // Validar que el rol sea válido
        if (!isValidRole(role)) {
            return jsonResponse({ 
                success: false, 
                error: `Invalid role. Valid roles are: ${VALID_ROLES.join(', ')}` 
            }, 400)
        }

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

        // Verificar que el usuario existe
        const { data: existingUser, error: userError } = await admin.auth.admin.getUserById(userId)
        
        if (userError || !existingUser) {
            return jsonResponse({ success: false, error: 'User not found' }, 404)
        }

        const { error } = await admin
            .from('profiles')
            .update({ role })
            .eq('id', userId)

        if (error) {
            return jsonResponse({ success: false, error: error.message }, 500)
        }

        return jsonResponse({
            success: true,
            message: 'Role updated successfully',
            data: {
                userId,
                newRole: role
            }
        })
    } catch (err) {
        console.error('EDGE FUNCTION ERROR:', err)
        return jsonResponse({
            success: false,
            error: 'Internal server error'
        }, 500)
    }
})
