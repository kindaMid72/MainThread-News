export interface ArticleQuery {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content_html?: string;
    thumbnail_url?: string;
    category_id?: string;
    author_id?: string;
    status?: 'archived' | 'draft' | 'review' | 'published';     
    source_type?: 'original' | 'syndicated';
    source_ref?: string;
    views_count?: number;
    is_breaking?: boolean;
    is_headline?: boolean;
    publish_at?: string;
    updated_at?: string;
    created_at?: string;
}

export interface Article{
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    contentHtml?: string;
    thumbnailUrl?: string;
    categoryId?: string;
    authorId?: string;
    status?: 'archived' | 'draft' | 'review' | 'published';
    sourceType?: 'original' | 'syndicated';
    sourceRef?: string;
    viewsCount?: number;
    isBreaking?: boolean;
    isHeadline?: boolean;
    publishAt?: string;
    updatedAt?: string;
    created_at?: string;
}