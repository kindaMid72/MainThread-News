// import database connection
import createDatabaseAccess from "../../config/database/createDbAccess";
// import types
import { TeamMember, TeamMemberQuery } from "./teams.types";

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

export async function updateUser(member: TeamMember) {
    const dbAccess = await createDatabaseAccess();
    const { data, error }: any = await dbAccess
        .from('users_access')
        .update({
            name: member.name,
            role: member.role,
            avatar_url: member.avatarUrl,
            is_active: member.isActive,
        })
        .eq('id', member.id);

    if (error) return { error };
    return { data };
}