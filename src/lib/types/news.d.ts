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
    published_at?: string;
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
}

export interface UpdateNewsData extends Partial<CreateNewsData> {
    id: number;
}

export type NewsStatus = 'draft' | 'published' | 'archived';