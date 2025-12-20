export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Author';
    status: 'Active' | 'Inactive';
    avatarUrl?: string;
}
