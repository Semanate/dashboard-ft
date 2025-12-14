import { supabase } from '$lib/db/client.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        
        const title = formData.get('title')?.toString();
        const content = formData.get('content')?.toString();
        const excerpt = formData.get('excerpt')?.toString();
        const author = formData.get('author')?.toString();
        const status = formData.get('status')?.toString() || 'draft';
        const featured_image = formData.get('featured_image')?.toString();
        const tags = formData.get('tags')?.toString()?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

        if (!title || !content || !author) {
            return {
                error: 'Título, contenido y autor son requeridos'
            };
        }

        // Generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        const newsData = {
            title,
            content,
            excerpt,
            author,
            status,
            featured_image,
            tags,
            slug,
            published_at: status === 'published' ? new Date().toISOString() : null
        };

        const { error } = await supabase
            .from('news')
            .insert([newsData])
            .select()
            .single();

        if (error) {
            return { error: error.message };
        }

        throw redirect(303, '/admin/news');
    }
};