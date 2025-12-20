export interface NewUser {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    password: string;
    created_at: string; 
}