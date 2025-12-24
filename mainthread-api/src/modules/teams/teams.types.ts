export interface TeamMember {
    id?: string;
    name?: string;
    email?: string;
    role?: 'admin' | 'superadmin' | 'writer';
    avatarUrl?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface TeamMemberQuery {
    id?: string;
    user_id?: string;
    name?: string;
    email?: string;
    role?: 'admin' | 'superadmin' | 'writer';
    is_active?: boolean;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}
export interface TeamMemberCreate {
    id?: string;
    name?: string;
    email?: string;
    role?: 'admin' | 'superadmin' | 'writer';
    is_active?: boolean;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserInvite{
    id?: string;
    email?: string;
    role?: 'admin' | 'superadmin' | 'writer';
    token?: string;
    status?: 'pending' | 'accepted' | 'expired';
    expired_at?: string;
    created_at?: string;
}

export const REDIS_KEY = {
    USERS_ACCESS: 'users_access'
} as const;