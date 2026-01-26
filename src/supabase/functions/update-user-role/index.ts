import { serve } from 'https://deno.land/std/http/server.ts'
import { jsonResponse } from '../_shared/response.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
    try {
        const body = await req.json()
        const { userId, role } = body

        if (!userId || !role) {
            return jsonResponse({ success: false, error: 'Missing params' }, 400)
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
    } catch (err) {
        console.error('EDGE FUNCTION ERROR:', err)
        return jsonResponse({
            success: false,
            error: 'Internal server error'
        }, 500)
    }
})
