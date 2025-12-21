import createDatabaseAccess from "../../config/database/createDbAccess";
import createUserInstance from "../../utils/supabase/createUserInstance";

export default async function checkAdminAccess(authorization: string | undefined) { // authorization: Bearer <token>
    try {
        if(!authorization) return false;
        const dbAccess = await createDatabaseAccess();
        // Use getUser() for secure server-side validation
        const supabase = await createUserInstance(authorization);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        //console.log(user);

        if (userError || !user) return false;

        const userId = user.id;

        // Use .in() for array comparison
        const { data, error } = await dbAccess
            .from('users_access')
            .select('user_id')
            .eq('user_id', userId)
            .in('role', ['admin', 'superadmin'])
            .single();
        //console.log(data); // FIXME: 

        if (error || !data) return false;

        return true;
    } catch (error) {
        return false;
    }
}
