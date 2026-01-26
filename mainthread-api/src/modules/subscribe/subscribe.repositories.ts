
import createDatabaseAccess from "../../config/database/createDbAccess";
import { SubscribeQuery, SubscribeTokenQuery } from "./subscribe.type";

export async function checkSubscribeExist(email: string): Promise<boolean> {
    const db = await createDatabaseAccess();
    const { data, error } = await db.from('subscribers').select('*').eq('email', email).eq('status', 'active');
    if (error) throw error;
    return data.
        length > 0;
}
export async function getSubscribeId(email: string): Promise<string> {
    const db = await createDatabaseAccess();
    const { data, error } = await db.from('subscribers').select('id').eq('email', email).eq('status', 'active');
    if (error) throw error;
    return data[0]?.id;
}

export async function createSubscribe(subscribe: SubscribeQuery): Promise<string> {
    const db = await createDatabaseAccess();
    const { data, error } = await db.from('subscribers').upsert(subscribe, { onConflict: 'email' }).select('id').single();
    if (error) throw error;
    return data?.id;
}

export async function createToken(token: SubscribeTokenQuery): Promise<void> {
    const db = await createDatabaseAccess();
    const { data, error } = await db.from('subscription_tokens').insert(token).select('token').single();
    if (error) throw error;
}

export async function getSubscriptionToken(token: string): Promise<SubscribeTokenQuery | null> {
    const db = await createDatabaseAccess();
    const { data, error } = await db.from('subscription_tokens').select('*').eq('token', token).maybeSingle();
    if (error) throw error;
    return data;
}

export async function confirmSubscriber(subscriberId: string): Promise<void> {
    const db = await createDatabaseAccess();
    const { error } = await db.from('subscribers').update({ status: 'active', confirmed_at: new Date().toISOString() }).eq('id', subscriberId);
    if (error) throw error;
}

export async function unsubscribeSubscriber(subscriberId: string): Promise<void> {
    const db = await createDatabaseAccess();
    const { error } = await db.from('subscribers').update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() }).eq('id', subscriberId);
    if (error) throw error;
}

export async function deleteToken(token: string): Promise<void> {
    const db = await createDatabaseAccess();
    const { error } = await db.from('subscription_tokens').delete().eq('token', token);
    if (error) throw error;
}