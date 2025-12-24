import createDatabaseAccess from "../../config/database/createDbAccess";
import createUserInstance from "../../utils/supabase/createUserInstance";
import redis from "../../config/redis/createRedisAccess";

import { REDIS_KEY } from "../../const/const.redis";

export default async function checkUserAccess(authorization: string | undefined) { // authorization: Bearer <token>
    try {
        if(!authorization) return false;
        const dbAccess = await createDatabaseAccess();
        // Use getUser() for secure server-side validation
        const supabase = await createUserInstance(authorization);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        //console.log(user);

        if (userError || !user) return false;

        const userId = user.id;
        // check redis stash
        const cachedData: boolean | null = await redis.get(REDIS_KEY.USER_ID(userId));
        if (cachedData) return true;

        // Use .in() for array comparison
        const { data, error } = await dbAccess
            .from('users_access')
            .select('user_id')
            .eq('user_id', userId)
            .in('role', ['writer', 'admin', 'superadmin'])
            .single();
        //console.log(data); // FIXME: 

        if (error || !data) return false;

        // setup redis cache
        await redis.set(REDIS_KEY.USER_ID(userId), true);

        return true;
    } catch (error) {
        return false;
    }
}
