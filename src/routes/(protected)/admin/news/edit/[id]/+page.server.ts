import { supabase } from '$lib/db/client.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const { id } = params;

    const { data: newsItem, error: fetchError } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !newsItem) {
        throw error(404, 'Noticia no encontrada');
    }

    return {
        newsItem
    };
};

export const actions = {
    default: async ({ request, params }) => {
        const { id } = params;
        const formData = await request.formData();

        const title = formData.get('title')?.toString();
        const content = formData.get('content')?.toString();
        const excerpt = formData.get('excerpt')?.toString();
        const author = formData.get('author')?.toString();
        const status = formData.get('status')?.toString() || 'draft';
        const featured_image = formData.get('featured_image')?.toString();
        const tags = formData.get('tags')?.toString()?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

        let expiration_date: string | null = formData.get('expiration_date')?.toString() || null;
        if (expiration_date) {
            expiration_date = new Date(`${expiration_date}T23:59:59`).toISOString();
        }

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
            published_at: status === 'published' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
            expiration_date
        };

        const { error: updateError } = await supabase
            .from('news')
            .update(newsData)
            .eq('id', id);

        if (updateError) {
            return { error: updateError.message };
        }

        throw redirect(303, '/admin/news');
    }
};