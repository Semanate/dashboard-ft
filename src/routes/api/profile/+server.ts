import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDataFromEnv } from '$lib/db/client';

export const PATCH: RequestHandler = async ({ request, locals }) => {
    // const { supabaseUrl, supabaseKey } = getDataFromEnv();
    const user = locals.user;
    const accessToken = locals.accessToken;
    const supabase = locals.supabase;

    if (!user || !accessToken) {
        throw error(401, 'No autorizado');
    }

    try {
        const body = await request.json();
        const { display_name, phone } = body;

        // Update user metadata
        const { data, error } = await supabase.auth.updateUser({
            data: {
                display_name: display_name || null,
                phone: phone || null
            },
        })

        if (error) {
            console.error('Update user error:', error);
            return json({
                success: false,
                error: 'Error al actualizar la información'
            }, { status: 500 });
        }
        console.log('User update data:', data);

        // Update profile table
        if (supabase) {
            await supabase
                .from('profiles')
                .update({
                    display_name: display_name || null,
                    phone: phone || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);
        }

        return json({ success: true });

    } catch (err) {
        console.error('Profile update error:', err);
        return json({
            success: false,
            error: 'Error interno del servidor'
        }, { status: 500 });
    }
};

export const GET: RequestHandler = async ({ locals }) => {
    const user = locals.user;

    if (!user) {
        throw error(401, 'No autorizado');
    }

    try {
        const supabase = locals.supabase;

        if (!supabase) {
            return json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    display_name: user.user_metadata?.display_name,
                    avatar_url: user.user_metadata?.avatar_url,
                    phone: user.phone,
                    created_at: user.created_at
                }
            });
        }

        const { data: profile, error: dbError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (dbError) {
            console.error('Profile fetch error:', dbError);
        }

        return json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
                display_name: profile?.display_name || user.user_metadata?.display_name,
                avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
                phone: profile?.phone || user.phone,
                created_at: user.created_at,
                ...profile
            }
        });

    } catch (err) {
        console.error('Profile get error:', err);
        return json({
            success: false,
            error: 'Error interno del servidor'
        }, { status: 500 });
    }
};
