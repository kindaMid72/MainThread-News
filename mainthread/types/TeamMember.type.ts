export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'superadmin' | 'writer';
    status: 'Active' | 'Inactive';
    avatarUrl?: string;
}
