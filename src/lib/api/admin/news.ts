/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ApiResponse } from '$lib/types/api';
import { supabase } from '$lib/db/client';

export interface NewsItem {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    author: string;
    status: 'draft' | 'published' | 'archived';
    featured_image?: string;
    tags?: string[];
    slug?: string;
    published_at?: string | null;
    expiration_date?: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateNewsData {
    title: string;
    content: string;
    excerpt?: string;
    author: string;
    status?: 'draft' | 'published' | 'archived';
    featured_image?: string;
    tags?: string[];
    expiration_date?: string | null;
}

export interface UpdateNewsData extends Partial<CreateNewsData> {
    id: number;
}

export async function fetchNews(): Promise<ApiResponse<NewsItem[] | []>> {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return { data: [], error: error.message, success: false };
        }

        return { data: data, success: true };
    } catch (error) {
        return { error: 'Error al obtener las noticias', data: [], success: false };
    }
}

export async function fetchNewsById(id: number): Promise<ApiResponse<NewsItem>> {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return { error: error.message, data: null, success: false };
        }

        if (!data) {
            return { error: 'Noticia no encontrada', data: null, success: false };
        }

        return { data, success: true };
    } catch (error) {
        return { error: 'Error al obtener la noticia', data: null, success: false };
    }
}

export async function createNews(newsData: CreateNewsData): Promise<ApiResponse<NewsItem>> {
    try {
        // Generate slug from title
        const slug = newsData.title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        const dataToInsert = {
            ...newsData,
            slug,
            published_at: newsData.status === 'published' ? new Date().toISOString() : null
        };

        const { data, error } = await supabase
            .from('news')
            .insert([dataToInsert])
            .select()
            .single();

        if (error) {
            return { error: error.message, data: null, success: false };
        }

        return { data, success: true };
    } catch (error) {
        return { error: 'Error al crear la noticia', data: null, success: false };
    }
}

export async function updateNews(updateData: UpdateNewsData): Promise<ApiResponse<NewsItem>> {
    try {
        const { id, ...newsData } = updateData;

        // Generate new slug if title changed
        const dataToUpdate: Partial<NewsItem> = { ...newsData };
        if (newsData.title) {
            dataToUpdate.slug = newsData.title.toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }

        // Update published_at if status changed to published
        if (newsData.status === 'published') {
            dataToUpdate.published_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('news')
            .update(dataToUpdate)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { error: error.message, data: null, success: false };
        }

        return { data, success: true };
    } catch (error) {
        return { error: 'Error al actualizar la noticia', data: null, success: false };
    }
}

export async function deleteNews(id: number): Promise<ApiResponse<void>> {
    try {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id);

        if (error) {
            return { error: error.message, data: undefined, success: false };
        }

        return { data: undefined, success: true };
    } catch (error) {
        return { error: 'Error al eliminar la noticia', data: undefined, success: false };
    }
}

// Public API for fetching published news
export async function fetchPublishedNews(): Promise<ApiResponse<NewsItem[]>> {
    try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('status', 'published')
            .gte('expiration_date', now)
            .order('published_at', { ascending: false });

        if (error) {
            return { error: error.message, data: [], success: false };
        }

        return { data: data || [], success: true };
    } catch (error) {
        return { error: 'Error al obtener las noticias', data: [], success: false };
    }
}