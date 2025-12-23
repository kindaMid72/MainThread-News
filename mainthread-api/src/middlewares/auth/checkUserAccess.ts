import createDatabaseAccess from "../../config/database/createDbAccess";
import createUserInstance from "../../utils/supabase/createUserInstance";

export default async function checkUserAccess(authorization: string | undefined) { // authorization: Bearer <token>
    try {
        if(!authorization) return false;
        const dbAccess = await createDatabaseAccess();
        // Use getUser() for secure server-side validation
        const supabase = await createUserInstance(authorization);
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) return false;

        const userId = user.id;

        // Use .in() for array comparison
        const { data, error } = await dbAccess
            .from('users_access')
            .select('id')
            .eq('id', userId)
            .in('role', ['writer', 'admin', 'superadmin'])
            .single();

        if (error || !data) return false;

        return true;
    } catch (error) {
        return false;
    }
}
