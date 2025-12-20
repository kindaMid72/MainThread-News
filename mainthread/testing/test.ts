import { createBrowserClient } from "@supabase/ssr";

export function createClient() { // dont convert to async
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
// create user here
export default async function test() {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email: 'someaccount@gmail.com',
            password: 'somepass',
        });

        if (error) {
            console.error('Error creating user:', error);
        } else {
            console.log('User created successfully:', data.user);
        }

    } catch (err) {
        console.error("Script error:", err);
    }
};
