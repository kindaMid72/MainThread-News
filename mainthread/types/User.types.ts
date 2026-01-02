export interface User{
    id?: string;
    userId?: string;
    name?: string;
    role?: string;
    email?: string;
    avatarUrl?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserQuery{
    id?: string;
    user_id?: string;
    name?: string;
    role?: string;
    email?: string;
    avatar_url?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}