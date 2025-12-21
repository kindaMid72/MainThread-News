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