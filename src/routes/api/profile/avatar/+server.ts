import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDataFromEnv } from '$lib/db/client';

export const POST: RequestHandler = async ({ request, locals }) => {
    const { supabaseUrl, supabaseKey } = getDataFromEnv();
    const user = locals.user;
    const accessToken = locals.accessToken;

    if (!user || !accessToken) {
        throw error(401, 'No autorizado');
    }

    try {
        const formData = await request.formData();
        const file = formData.get('avatar') as File;

        if (!file) {
            return json({ success: false, error: 'No se proporcionó archivo' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return json({ 
                success: false, 
                error: 'Tipo de archivo no permitido. Use JPEG, PNG, GIF o WEBP.' 
            }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return json({ 
                success: false, 
                error: 'El archivo es muy grande. Máximo 5MB.' 
            }, { status: 400 });
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // Get file buffer
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const uploadResponse = await fetch(
            `${supabaseUrl}/storage/v1/object/avatars/${fileName}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'apikey': supabaseKey,
                    'Content-Type': file.type,
                    'x-upsert': 'true'
                },
                body: fileBuffer
            }
        );

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            console.error('Upload error:', errorData);
            return json({ 
                success: false, 
                error: 'Error al subir el archivo al almacenamiento' 
            }, { status: 500 });
        }

        // Construct public URL
        const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;

        // Update user metadata
        const updateResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'apikey': supabaseKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: { avatar_url: avatarUrl }
            })
        });

        if (!updateResponse.ok) {
            console.error('Failed to update user metadata');
        }

        // Update profile table
        const supabase = locals.supabase;
        if (supabase) {
            await supabase
                .from('profiles')
                .update({ avatar_url: avatarUrl })
                .eq('id', user.id);
        }

        return json({
            success: true,
            data: { avatarUrl }
        });

    } catch (err) {
        console.error('Avatar upload error:', err);
        return json({ 
            success: false, 
            error: 'Error interno del servidor' 
        }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ locals }) => {
    const { supabaseUrl, supabaseKey } = getDataFromEnv();
    const user = locals.user;
    const accessToken = locals.accessToken;

    if (!user || !accessToken) {
        throw error(401, 'No autorizado');
    }

    try {
        // Get current avatar URL to extract filename
        const currentAvatarUrl = user.user_metadata?.avatar_url;
        
        if (currentAvatarUrl) {
            // Extract the file path from the URL
            const urlParts = currentAvatarUrl.split('/avatars/');
            if (urlParts.length > 1) {
                const filePath = urlParts[1];
                
                // Delete from Supabase Storage
                await fetch(
                    `${supabaseUrl}/storage/v1/object/avatars/${filePath}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'apikey': supabaseKey
                        }
                    }
                );
            }
        }

        // Update user metadata to remove avatar_url
        await fetch(`${supabaseUrl}/auth/v1/user`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'apikey': supabaseKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: { avatar_url: null }
            })
        });

        // Update profile table
        const supabase = locals.supabase;
        if (supabase) {
            await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', user.id);
        }

        return json({ success: true });

    } catch (err) {
        console.error('Avatar delete error:', err);
        return json({ 
            success: false, 
            error: 'Error al eliminar la foto' 
        }, { status: 500 });
    }
};
