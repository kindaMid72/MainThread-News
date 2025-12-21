import { getAllUser, updateUser } from "./teams.repositories";
import { TeamMember, TeamMemberQuery } from "./teams.types";

export async function getAllUserService() {
    // panggil repository
    const users = await getAllUser();

    // jika error, lemparkan error untuk di-catch oleh controller
    if (users.error) {
        throw new Error(users.error.message);
    }

    // return data bersih
    return users.data;
}

export async function updateUserService(member: TeamMember) {
    // panggil repository
    const updatedUser = await updateUser(member);

    // jika error, lemparkan error untuk di-catch oleh controller
    if (updatedUser.error) {
        throw new Error(updatedUser.error.message);
    }

    // return data bersih
    return updatedUser.data;
}
