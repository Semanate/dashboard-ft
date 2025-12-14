import { supabase } from '$lib/db/client.js';

export const load = async () => {
    const { data: news, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading news:', error);
        return { news: [] };
    }

    return {
        news: news || []
    };
};

export const actions = {
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id);

        if (error) {
            return { error: error.message };
        }

        return { success: true };
    }
};