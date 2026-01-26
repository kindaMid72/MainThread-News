export interface SubscribeQuery {
    id?: string;
    email?: string;
    status?: 'pending' | 'active' | 'unsubscribed' | 'bounced';
    source?: string;
    subscribed_at?: string | null;
    unsubscribed_at?: string | null;
    confirmed_at?: string | null;
    
}

export interface SubscribeTokenQuery{
    id?: string;
    subscriber_id?: string;
    token?: string;
    type?: 'confirmation' | 'unsubscription';
    expires_at?: string;
    used_at?: string;
    created_at?: string;
}