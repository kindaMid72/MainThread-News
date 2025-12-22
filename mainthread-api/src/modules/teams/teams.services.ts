import { getAllUser, updateUser, checkIfEmailExist, insertInviteToken, checkIfInviteTokenValidReturnUser, insertUser } from "./teams.repositories";
import { TeamMember, TeamMemberQuery, TeamMemberCreate, UserInvite } from "./teams.types";
import generateRandomToken from "../../utils/generator/generateRandomToken";
import Emailer from "../../config/emailer/emailerInstance";

// utils
import hashSHA256 from "../../utils/authTools/hashSHA256";
import generatePictureUrl from "../../utils/generator/generatePictureUrl";

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
