export interface ArticleQuery {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content_html?: string;
    thumbnail_url?: string;
    category_id?: string | null;
    author_id?: string;
    status?: 'archived' | 'draft' | 'review' | 'published';     
    source_type?: 'auto' | 'manual';
    source_ref?: string;
    view_count?: number;
    is_breaking?: boolean;
    is_headline?: boolean;
    published_at?: string | null;
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
    sourceType?: 'auto' | 'manual';
    sourceRef?: string;
    viewCount?: number;
    isBreaking?: boolean;
    isHeadline?: boolean;
    publishedAt?: string;
    updatedAt?: string;
    createdAt?: string;
}
export interface ArticleTableViews{
  id?: string;
  title?: string;
  sourceType?: 'auto' | 'manual';
  status?: 'archived' | 'draft' | 'review' | 'published';
  authorName?: string;
  categoryName?: string;
  publishAt?: string;
  views?: number;
  coverImage?: string;
  slug?: string;
}
