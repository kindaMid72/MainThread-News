export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'superadmin' | 'writer';
    avatarUrl?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface TeamMemberQuery {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'superadmin' | 'writer';
    is_active: boolean;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}