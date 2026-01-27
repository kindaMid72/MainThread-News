"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkAdminAccess;
const createDbAccess_1 = __importDefault(require("../../config/database/createDbAccess"));
const createUserInstance_1 = __importDefault(require("../../utils/supabase/createUserInstance"));
const createRedisAccess_1 = __importDefault(require("../../config/redis/createRedisAccess"));
const const_redis_1 = require("../../const/const.redis");
async function checkAdminAccess(authorization) {
    try {
        if (!authorization)
            return false;
        const dbAccess = await (0, createDbAccess_1.default)();
        // Use getUser() for secure server-side validation
        const supabase = await (0, createUserInstance_1.default)(authorization);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        //console.log(user);
        if (userError || !user)
            return false;
        const userId = user.id;
        // check redis stash
        const cachedData = await createRedisAccess_1.default.get(const_redis_1.REDIS_KEY.ADMIN_ID(userId));
        if (cachedData)
            return true;
        // Use .in() for array comparison
        const { data, error } = await dbAccess
            .from('users_access')
            .select('user_id')
            .eq('user_id', userId)
            .in('role', ['admin', 'superadmin'])
            .single();
        //console.log(data); // FIXME: 
        if (error || !data)
            return false;
        // setup redis cache
        await createRedisAccess_1.default.set(const_redis_1.REDIS_KEY.ADMIN_ID(userId), true);
        return true;
    }
    catch (error) {
        return false;
    }
}
