
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'admin' | 'editor' | 'writer';
  avatar?: string;
  active?: boolean;
}

export interface Analytics {
  totalViews: number;
  todayViews: number;
  totalArticles: number;
  publishedArticles: number;
}
