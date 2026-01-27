"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = getAllUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.insertInviteToken = insertInviteToken;
exports.checkIfEmailExist = checkIfEmailExist;
exports.checkIfInviteTokenValidReturnUser = checkIfInviteTokenValidReturnUser;
exports.insertUser = insertUser;
exports.getUserRoleById = getUserRoleById;
exports.getUserIdById = getUserIdById;
exports.countActiveSuperAdmin = countActiveSuperAdmin;
const createDbAccess_1 = __importDefault(require("../../config/database/createDbAccess"));
const createRedisAccess_1 = __importDefault(require("../../config/redis/createRedisAccess"));
const const_redis_1 = require("../../const/const.redis");
async function getAllUser() {
    // create db access
    const dbAccess = await (0, createDbAccess_1.default)();
    // query users_access table & return all data
    // redis cache
    let member = [];
    const cacheKey = const_redis_1.REDIS_KEY.USERS_ACCESS;
    const cachedData = await createRedisAccess_1.default.get(cacheKey);
    if (cachedData) {
        member = cachedData;
        return { data: member };
    }
    const { data, error } = await dbAccess
        .from('users_access')
        .select('id, user_id, name, email, role, avatar_url, is_active');
    member = data?.map((item) => {
        return {
            id: item.id,
            userId: item.user_id,
            name: item.name,
            email: item.email,
            role: item.role,
            avatarUrl: item.avatar_url,
            isActive: item.is_active,
        };
    });
    if (error)
        return { error };
    // set redis cache
    await createRedisAccess_1.default.set(cacheKey, JSON.stringify(member));
    return { data: member };
}
async function updateUser({ id, name, role, isActive }) {
    const dbAccess = await (0, createDbAccess_1.default)();
    const { data, error } = await dbAccess
        .from('users_access')
        .update({
        name: name,
        role: role,
        is_active: isActive,
    })
        .eq('id', id);
    // invalidate redis cache
    await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.USERS_ACCESS);
    await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.USER_ID(id));
    await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.ADMIN_ID(id));
    if (error)
        return { error };
    return { data };
}
async function deleteUser({ id }) {
    const dbAccess = await (0, createDbAccess_1.default)();
    // get auth.users.id
    const { data: deletedUserId, error: deletedUserIdError } = await dbAccess
        .from('users_access')
        .select('user_id')
        .eq('id', id)
        .single();
    if (deletedUserIdError)
        throw Error(deletedUserIdError);
    // delete from users_access
    const { data: deletedUser, error: deletedUserError } = await dbAccess
        .from('users_access')
        .delete()
        .eq('id', id);
    // delete from auth.users
    if (deletedUserError)
        throw Error(deletedUserError);
    // invalidate redis cache
    await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.USERS_ACCESS);
    await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.USER_ID(id));
    await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.ADMIN_ID(id));
    const { error: authError } = await dbAccess.auth.admin.deleteUser(deletedUserId.user_id);
    if (authError)
        throw Error(authError);
    return true;
}
async function insertInviteToken({ token_hash, expiredAt, email, role }) {
    const dbAccess = await (0, createDbAccess_1.default)();
    const status = 'pending';
    const { data, error } = await dbAccess
        .from('user_invites')
        .insert({
        email: email,
        role: role,
        status: status,
        token_hash: token_hash,
        expires_at: expiredAt,
    });
    if (error)
        return { error };
    return { data };
}
async function checkIfEmailExist(email) {
    const dbAccess = await (0, createDbAccess_1.default)();
    const { data, error } = await dbAccess
        .from('users_access')
        .select('id')
        .eq('email', email)
        .single();
    if (error || !data)
        return false;
    return true;
}
async function checkIfInviteTokenValidReturnUser(tokenHash) {
    const dbAccess = await (0, createDbAccess_1.default)();
    const { data, error } = await dbAccess
        .from('user_invites')
        .select('email, role')
        .eq('token_hash', tokenHash)
        .eq('status', 'pending')
        .gte('expires_at', new Date().toISOString())
        .single();
    // if token valid, mark token as expired
    const { data: updateData, error: updateError } = await dbAccess
        .from('user_invites')
        .update({
        status: 'expired',
    })
        .eq('token_hash', tokenHash);
    if (updateError)
        return { data: null, error: updateError };
    if (error || !data)
        return { data: null, error };
    return { data, error: null };
}
async function insertUser({ name, avatarUrl, email, role, password }) {
    const dbAccess = await (0, createDbAccess_1.default)();
    // insert user in user_access
    const { data, error } = await dbAccess.auth.admin.createUser({
        email: email,
        password: password
    });
    if (error)
        return { data: null, error };
    const userId = data.user.id;
    // insert user in user_access
    const { data: insertUserAccess, error: insertUserAccessError } = await dbAccess
        .from('users_access')
        .insert({
        user_id: userId,
        name: name,
        email: email,
        role: role,
        avatar_url: avatarUrl,
        is_active: true,
    });
    // invalidate redis cache
    await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.USERS_ACCESS);
    if (insertUserAccessError)
        return { data: null, error: insertUserAccessError };
    return { data: insertUserAccess, error: null };
}
async function getUserRoleById({ userId }) {
    const dbAccess = await (0, createDbAccess_1.default)();
    const { data, error } = await dbAccess
        .from('users_access')
        .select('role')
        .eq('user_id', userId)
        .single();
    if (error || !data)
        return '';
    return data.role;
}
async function getUserIdById({ id }) {
    const dbAccess = await (0, createDbAccess_1.default)();
    const { data, error } = await dbAccess
        .from('users_access')
        .select('user_id')
        .eq('id', id)
        .single();
    if (error || !data)
        return '';
    return data.user_id;
}
async function countActiveSuperAdmin() {
    const dbAccess = await (0, createDbAccess_1.default)();
    const { count, error } = await dbAccess
        .from('users_access')
        .select('id', { count: 'exact' })
        .eq('role', 'superadmin')
        .eq('is_active', true);
    if (error || !count)
        return 0;
    return count;
}
