export interface Categories {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
}

export interface CategoriesQuery {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
    created_at?: string;
}