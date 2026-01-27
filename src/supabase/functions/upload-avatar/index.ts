import { serve } from 'https://deno.land/std/http/server.ts'
import { jsonResponse } from '../_shared/response.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

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

        // Get the authorization header
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return jsonResponse({ success: false, error: 'Missing authorization header' }, 401)
        }

        // Verify the user token
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await admin.auth.getUser(token)
        
        if (authError || !user) {
            return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
        }

        const formData = await req.formData()
        const file = formData.get('avatar') as File
        
        if (!file) {
            return jsonResponse({ success: false, error: 'No file provided' }, 400)
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return jsonResponse({ 
                success: false, 
                error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WEBP' 
            }, 400)
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return jsonResponse({ 
                success: false, 
                error: 'File too large. Maximum size is 5MB' 
            }, 400)
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/avatar.${fileExt}`

        // Delete old avatar if exists
        await admin.storage.from('avatars').remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.gif`, `${user.id}/avatar.webp`])

        // Upload new avatar
        const { error: uploadError } = await admin.storage
            .from('avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return jsonResponse({ success: false, error: uploadError.message }, 500)
        }

        // Get public URL
        const { data: publicUrl } = admin.storage
            .from('avatars')
            .getPublicUrl(fileName)

        // Update user metadata with avatar URL
        const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
            user_metadata: {
                ...user.user_metadata,
                avatar_url: publicUrl.publicUrl
            }
        })

        if (updateError) {
            console.error('Update user error:', updateError)
            return jsonResponse({ success: false, error: updateError.message }, 500)
        }

        // Also update the profiles table if it has an avatar_url column
        await admin
            .from('profiles')
            .update({ avatar_url: publicUrl.publicUrl })
            .eq('id', user.id)

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Avatar uploaded successfully',
                data: {
                    avatarUrl: publicUrl.publicUrl
                }
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (err) {
        console.error('EDGE FUNCTION ERROR:', err)
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Internal server error'
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )
    }
})
