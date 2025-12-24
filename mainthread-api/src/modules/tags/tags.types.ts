export interface Tag {
    id?: string;
    name?: string;
    slug?: string;
    createdAt?: Date;
}

export interface TagQuery {
    id?: string;
    name?: string;
    slug?: string;
    created_at?: string;
}