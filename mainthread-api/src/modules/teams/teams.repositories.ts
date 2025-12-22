// import database connection
import createDatabaseAccess from "../../config/database/createDbAccess";
// import types
import { TeamMember, TeamMemberQuery, TeamMemberCreate, UserInvite } from "./teams.types";

// libs
import bcrypt from 'bcrypt';

export async function getAllUser() {
    // create db access
    const dbAccess = await createDatabaseAccess();
    // query users_access table & return all data
    const { data, error }: any = await dbAccess
        .from('users_access')
        .select('id, name, email, role, avatar_url, is_active');

    const member: TeamMember[] = data?.map((item: TeamMemberQuery) => {
        return {
            id: item.id,
            name: item.name,
            email: item.email,
            role: item.role,
            avatarUrl: item.avatar_url,
            isActive: item.is_active,
        };
    });

    if (error) return { error };
    return { data: member };
}

export async function updateUser({id, name, role, isActive}: TeamMember) {
    const dbAccess = await createDatabaseAccess();
    const { data, error }: any = await dbAccess
    .from('users_access')
    .update({
        name: name,
        role: role,
        is_active: isActive,
    })
    .eq('id', id);
    
    if (error) return { error };
    return { data };
}
export async function deleteUser({id}: TeamMember) : Promise<boolean> {
    const dbAccess = await createDatabaseAccess();
    // get auth.users.id
    const {data: deletedUserId, error: deletedUserIdError }: any = await dbAccess
        .from('users_access')
        .select('user_id')
        .eq('id', id)
        .single();
    if(deletedUserIdError) throw Error(deletedUserIdError);
    // delete from users_access
    const {data: deletedUser, error: deletedUserError }: any = await dbAccess
        .from('users_access')
        .delete()
        .eq('id', id)
    // delete from auth.users
    if(deletedUserError) throw Error(deletedUserError);
    const { error: authError }: any = await dbAccess.auth.admin.deleteUser(deletedUserId.user_id);
    if (authError) throw Error(authError);

    return true;
}

export async function insertInviteToken({token_hash, expiredAt, email, role} : {token_hash: string, expiredAt: string, email: UserInvite['email'], role: UserInvite['role']}) { // expiredAt = date string
    const dbAccess = await createDatabaseAccess();
    const status: UserInvite['status'] = 'pending';
    const { data, error }: any = await dbAccess
        .from('user_invites')
        .insert({
            email: email,
            role: role,
            status: status,
            token_hash: token_hash,
            expires_at: expiredAt,
        });

    if (error) return { error };
    return { data };
}

export async function checkIfEmailExist(email: string) : Promise<boolean>  {
    const dbAccess = await createDatabaseAccess();
    const { data, error }: any = await dbAccess
        .from('users_access')
        .select('id')
        .eq('email', email)
        .single();

    if (error || !data) return false;
    return true;
}

export async function checkIfInviteTokenValidReturnUser(tokenHash: string): Promise<{data: UserInvite | null, error: any}> {
    const dbAccess = await createDatabaseAccess();
    const { data, error }: any = await dbAccess
        .from('user_invites')
        .select('email, role')
        .eq('token_hash', tokenHash)
        .eq('status', 'pending' as UserInvite['status'])
        .gte('expires_at', new Date().toISOString())
        .single();
    // if token valid, mark token as expired
    const { data: updateData, error: updateError }: any = await dbAccess
        .from('user_invites')
        .update({
            status: 'expired' as UserInvite['status'],
        })
        .eq('token_hash', tokenHash);
    if (updateError) return {data: null, error: updateError};
    if (error || !data) return {data: null, error};
    return {data, error: null};
}

export async function insertUser({name, avatarUrl, email, role, password}: {name: string, avatarUrl: string, email: string, role: string, password: string}): Promise<{data: UserInvite | null, error: any}> {
    const dbAccess = await createDatabaseAccess();

    // insert user in user_access
    const { data, error }: any = await dbAccess.auth.admin.createUser({
        email: email,
        password: password
    })
    if (error) return {data: null, error }

    const userId: string = data.user.id;
    // insert user in user_access
    const { data: insertUserAccess, error: insertUserAccessError }: any = await dbAccess
        .from('users_access')
        .insert({
            user_id: userId,
            name: name,
            email: email,
            role: role,
            avatar_url: avatarUrl,
            is_active: true,
        })

    if (insertUserAccessError) return {data: null, error: insertUserAccessError };
    return {data: insertUserAccess, error: null};
}

export async function getUserRoleById({userId}: {userId: string}): Promise<string> {
    const dbAccess = await createDatabaseAccess();
    const { data, error }: any = await dbAccess
        .from('users_access')
        .select('role')
        .eq('user_id', userId)
        .single();
    
    if (error || !data) return ''
    return data.role;
}
export async function getUserIdById({id} : {id: string}): Promise<string> {
    const dbAccess = await createDatabaseAccess();
    const { data, error }: any = await dbAccess
        .from('users_access')
        .select('user_id')
        .eq('id', id)
        .single();
    
    if (error || !data) return '';
    return data.user_id;
}

export async function countActiveSuperAdmin(): Promise<number> {
    const dbAccess = await createDatabaseAccess();
    const { count, error }: any = await dbAccess
        .from('users_access')
        .select('id', { count: 'exact' })
        .eq('role', 'superadmin')
        .eq('is_active', true)
    
    if (error || !count) return 0;
    return count;
}