import { getAllUser,getUserRoleById, updateUser, checkIfEmailExist, countActiveSuperAdmin, getUserIdById, insertInviteToken, checkIfInviteTokenValidReturnUser, insertUser, deleteUser } from "./teams.repositories";
import { TeamMember, TeamMemberQuery, TeamMemberCreate, UserInvite } from "./teams.types";
import generateRandomToken from "../../utils/generator/generateRandomToken";
import Emailer from "../../config/emailer/emailerInstance";

// utils
import hashSHA256 from "../../utils/authTools/hashSHA256";
import generatePictureUrl from "../../utils/generator/generatePictureUrl";
import extractIdFromToken from "../../utils/authTools/extracIdFromToken";

// libs
import { Temporal } from "@js-temporal/polyfill";




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

export async function inviteUserService({email, role} : {email: TeamMemberCreate['email'], role: TeamMemberCreate['role']}) : Promise<boolean> {
    /**
     * 1. check apakah email sudah terdaftar
     * 2. jika sudah terdaftar, lemparkan error
     * 3. jika belum terdaftar, buat token invite dengan expired in 1 day
     * 4. kirim email ke email yang didaftarkan dengan link untuk mengkonfirmasi berisi token invite
     * 5. jika berhasil, return data user yang baru dibuat
     */
    const isEmailExist = await checkIfEmailExist(email as string);
    if (isEmailExist) { // PASS
        return false; // return false to notify caller that the email is already exist that kill the process
    }

    const token: string = await generateRandomToken();
    const token_hash: string = hashSHA256(token);
    const expiredAt: string = Temporal.Now.zonedDateTimeISO().add({ days: 1 }).toString().split('[')[0]; // FIXME: something wrong with this
    // console.log(token, token_hash, expiredAt); // FIXME: ga masuk sini

    const insertToken = await insertInviteToken({token_hash, expiredAt, email, role});
    if (insertToken.error) {
        throw new Error(insertToken.error.message);
    }

    // send email with invite token

    const inviteLink = `${process.env.CLIENT_URL}/confirm-email?token=${token}`;

    await (async function () {
        const { data: sendInvite, error: sendInviteError } = await Emailer.emails.send({
            from: `MainThread.Writers <no-reply@${process.env.DOMAIN_NAME}>`,
            to: [email as string],
            subject: `Invite to join MainThread as ${role}`,
            html: `<strong>Click the link to confirm your email: ${inviteLink}</strong>`,
        });

        if (sendInviteError) {
            throw new Error(sendInviteError.message);
        }
    })();

    return true;
}

export async function acceptInviteService({token, password}: {token: string, password: string}) {
    // check if the token is valid
    const tokenHash = hashSHA256(token);
    const {data: userInfo, error: userInfoError} = await checkIfInviteTokenValidReturnUser(tokenHash);
    if (userInfoError && userInfo !== null && userInfo !== undefined) {
        return false;
    }
    // token valid, then insert user to users_access table
    // user data
    const name = userInfo?.email?.split('@')[0] || 'User';
    const avatarUrl = generatePictureUrl(name);
    const role = userInfo?.role || 'writer';
    const email = userInfo?.email || '';
    const {data: insertedUser, error: insertedUserError} = await insertUser({name, avatarUrl, email, role, password});
    if (insertedUserError) {
        return false;
    }
    return true;
}

export async function updateUserService({requester, id, name, role, isActive}: any) : Promise<boolean> {
    // get the requester role by extracting the id from requester (req.headers.authorization)
    const requesterId = await extractIdFromToken(requester); // auth.users.id
    const requesterRole : string = await getUserRoleById({userId: requesterId as string}); // public.users_access.role

    // get the target role & id (auth.users.id)
    const targetId = await getUserIdById({id});
    const targetRole : string = await getUserRoleById({userId: targetId as string});

    // check if the changes if valid
    /**
     * 1. admin can change any user but not superadmin
     * 2. superadmin can change any user but if the target is superadmin and the new isActive is false and there only 1 superadmin, then throw error
     */

    // 1. if the reqeuster role is admin, make user its not update superadmin
    if (requesterRole === 'admin') {
        if (targetRole === 'superadmin') { // prevent admin to update superadmin
            return false;
        }
        if(role === 'superadmin') { // prevent admin to change other user role to superadmin
            return false;
        }
    }

    // 2. if the requester role is superadmin
    if (requesterRole === 'superadmin') {
        const superAdminCount: number = await countActiveSuperAdmin();
        console.log(superAdminCount);
        if (superAdminCount === 1 && targetId === requesterId && (isActive === false || role !== 'superadmin')) { // prevent the last superadmin to update it self that disable the last superadmin access
            return false;
        }
    }

    // do the update is all condition is valid, and user permitted to update the target user
    const updatedUser = await updateUser({ id, role, name, isActive});

    // jika error, lemparkan error untuk di-catch oleh controller
    if (updatedUser.error) {
        throw new Error(updatedUser.error.message);
    }
    return true;
}

export async function deleteUserService({requester, id} : any) : Promise<boolean>{

    const requesterId = await extractIdFromToken(requester); // auth.users.id
    const requesterRole : string = await getUserRoleById({userId: requesterId as string}); // public.users_access.role

    // get the target role & id (auth.users.id)
    const targetId = await getUserIdById({id});
    const targetRole : string = await getUserRoleById({userId: targetId as string});

    // check if the changes if valid
    /**
     * 1. admin can change any user but not superadmin
     * 2. superadmin can change any user but if the target is superadmin and the new isActive is false and there only 1 superadmin, then throw error
     */

    // 1. if the reqeuster role is admin, make user its not update superadmin
    if (requesterRole === 'admin') {
        if (targetRole === 'superadmin') { // prevent admin to update superadmin
            return false;
        }
    }

    // 2. if the requester role is superadmin
    if (requesterRole === 'superadmin') {
        const superAdminCount: number = await countActiveSuperAdmin();
        console.log(superAdminCount);
        if (superAdminCount === 1 && targetId === requesterId) { // prevent the last superadmin to update it self that disable the last superadmin access
            return false;
        }
    }
    
    // if the changes is
    const deletedUser: boolean = await deleteUser({id});

    // jika error, lemparkan error untuk di-catch oleh controller
    if (!deletedUser) {
        return false;
    }

    // return data bersih
    return true;    
}
