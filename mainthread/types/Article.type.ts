export interface Article {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  coverImage: string;
  
  categoryId: string;
  tags: string[];
  authorId: string;
  status: 'draft' | 'review' | 'published';
  publishAt: string;
  updatedAt: string;
  views: number;
  sourceType?: 'original' | 'syndicated';
  sourceRef?: string;
}

export interface ArticleTableViews{
  id: string;
  title: string;
  subtitle: string;
  status: 'draft' | 'review' | 'published';
  authorName: string;
  categoryName: string;
  publishAt: string;
  views: number;
  coverImage: string;
  slug: string;
}
