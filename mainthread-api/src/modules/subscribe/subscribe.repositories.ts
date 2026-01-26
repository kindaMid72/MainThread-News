
import createDatabaseAccess from "../../config/database/createDbAccess";
import { SubscribeQuery, SubscribeTokenQuery } from "./subscribe.type";

export async function checkSubscribeExist(email: string): Promise<boolean> {
    const db = await createDatabaseAccess();
    const { data, error } = await db.from('subscribers').select('*').eq('email', email).eq('status', 'active');
    if(error) throw error;
    return data.length > 0;
}

export async function createSubscribe(subscribe: SubscribeQuery): Promise<string> {
    const db = await createDatabaseAccess();
    const {data, error} = await db.from('subscribers').upsert(subscribe, {onConflict: 'email'}).select('id').single();
    if(error) throw error;
    return data?.id;
}

export async function createToken(token: SubscribeTokenQuery): Promise<void> {
    const db = await createDatabaseAccess();
    const { data, error } = await db.from('subscription_tokens').insert(token).select('token').single();
    if(error) throw error;
}