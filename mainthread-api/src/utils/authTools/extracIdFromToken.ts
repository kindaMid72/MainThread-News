import createUserInstance from "../supabase/createUserInstance";

export default async function extractIdFromToken(authorization: string): Promise<string | null> {
    const supabase = await createUserInstance(authorization);
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
        throw new Error(userError.message);
    }
    return user?.user?.id;
}