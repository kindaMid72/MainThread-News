// supabase for client

// Impor `createBrowserClient` dari `@supabase/ssr` untuk client-side di Next.js App Router.
// Ini akan memastikan sesi dikelola melalui cookies.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() { // dont convert to async
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
export async function getUserSession() {
    return await createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ).auth.getSession();
}

export async function getAuthHeader() {
    const supabase = await createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ).auth.getSession();
    return `Bearer ${supabase.data.session?.access_token}`;
}
export default createClient;