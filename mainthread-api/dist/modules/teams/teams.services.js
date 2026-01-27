"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserService = getAllUserService;
exports.inviteUserService = inviteUserService;
exports.acceptInviteService = acceptInviteService;
exports.updateUserService = updateUserService;
exports.deleteUserService = deleteUserService;
const teams_repositories_1 = require("./teams.repositories");
const generateRandomToken_1 = __importDefault(require("../../utils/generator/generateRandomToken"));
const emailerInstance_1 = __importDefault(require("../../config/emailer/emailerInstance"));
// utils
const hashSHA256_1 = __importDefault(require("../../utils/cryptoTools/hashSHA256"));
const generatePictureUrl_1 = __importDefault(require("../../utils/generator/generatePictureUrl"));
const extracIdFromToken_1 = __importDefault(require("../../utils/authTools/extracIdFromToken"));
// libs
const polyfill_1 = require("@js-temporal/polyfill");
async function getAllUserService() {
    // panggil repository
    const users = await (0, teams_repositories_1.getAllUser)();
    // jika error, lemparkan error untuk di-catch oleh controller
    if (users.error) {
        throw new Error(users.error.message);
    }
    // return data bersih
    return users.data;
}
async function inviteUserService({ email, role }) {
    /**
     * 1. check apakah email sudah terdaftar
     * 2. jika sudah terdaftar, lemparkan error
     * 3. jika belum terdaftar, buat token invite dengan expired in 1 day
     * 4. kirim email ke email yang didaftarkan dengan link untuk mengkonfirmasi berisi token invite
     * 5. jika berhasil, return data user yang baru dibuat
     */
    const isEmailExist = await (0, teams_repositories_1.checkIfEmailExist)(email);
    if (isEmailExist) { // PASS
        return false; // return false to notify caller that the email is already exist that kill the process
    }
    const token = await (0, generateRandomToken_1.default)();
    const token_hash = (0, hashSHA256_1.default)(token);
    const expiredAt = polyfill_1.Temporal.Now.zonedDateTimeISO().add({ days: 1 }).toString().split('[')[0]; // FIXME: something wrong with this
    // console.log(token, token_hash, expiredAt); // FIXME: ga masuk sini
    const insertToken = await (0, teams_repositories_1.insertInviteToken)({ token_hash, expiredAt, email, role });
    if (insertToken.error) {
        throw new Error(insertToken.error.message);
    }
    // send email with invite token
    const inviteLink = `${process.env.CLIENT_URL}/confirm-email?token=${token}`;
    await (async function () {
        const { data: sendInvite, error: sendInviteError } = await emailerInstance_1.default.emails.send({
            from: `MainThread.Writers <no-reply@${process.env.DOMAIN_NAME}>`,
            to: [email],
            subject: `Invite to join MainThread as ${role}`,
            html: `<strong>Click the link to confirm your email: ${inviteLink}</strong>`,
        });
        if (sendInviteError) {
            throw new Error(sendInviteError.message);
        }
    })();
    return true;
}
async function acceptInviteService({ token, password }) {
    // check if the token is valid
    const tokenHash = (0, hashSHA256_1.default)(token);
    const { data: userInfo, error: userInfoError } = await (0, teams_repositories_1.checkIfInviteTokenValidReturnUser)(tokenHash);
    if (userInfoError && userInfo !== null && userInfo !== undefined) {
        return false;
    }
    // token valid, then insert user to users_access table
    // user data
    const name = userInfo?.email?.split('@')[0] || 'User';
    const avatarUrl = (0, generatePictureUrl_1.default)(name);
    const role = userInfo?.role || 'writer';
    const email = userInfo?.email || '';
    const { data: insertedUser, error: insertedUserError } = await (0, teams_repositories_1.insertUser)({ name, avatarUrl, email, role, password });
    if (insertedUserError) {
        return false;
    }
    return true;
}
async function updateUserService({ requester, id, name, role, isActive }) {
    // get the requester role by extracting the id from requester (req.headers.authorization)
    const requesterId = await (0, extracIdFromToken_1.default)(requester); // auth.users.id
    const requesterRole = await (0, teams_repositories_1.getUserRoleById)({ userId: requesterId }); // public.users_access.role
    // get the target role & id (auth.users.id)
    const targetId = await (0, teams_repositories_1.getUserIdById)({ id });
    const targetRole = await (0, teams_repositories_1.getUserRoleById)({ userId: targetId });
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
        if (role === 'superadmin') { // prevent admin to change other user role to superadmin
            return false;
        }
    }
    // 2. if the requester role is superadmin
    if (requesterRole === 'superadmin') {
        const superAdminCount = await (0, teams_repositories_1.countActiveSuperAdmin)();
        console.log(superAdminCount);
        if (superAdminCount === 1 && targetId === requesterId && (isActive === false || role !== 'superadmin')) { // prevent the last superadmin to update it self that disable the last superadmin access
            return false;
        }
    }
    // do the update is all condition is valid, and user permitted to update the target user
    const updatedUser = await (0, teams_repositories_1.updateUser)({ id, role, name, isActive });
    // jika error, lemparkan error untuk di-catch oleh controller
    if (updatedUser.error) {
        throw new Error(updatedUser.error.message);
    }
    return true;
}
async function deleteUserService({ requester, id }) {
    const requesterId = await (0, extracIdFromToken_1.default)(requester); // auth.users.id
    const requesterRole = await (0, teams_repositories_1.getUserRoleById)({ userId: requesterId }); // public.users_access.role
    // get the target role & id (auth.users.id)
    const targetId = await (0, teams_repositories_1.getUserIdById)({ id });
    const targetRole = await (0, teams_repositories_1.getUserRoleById)({ userId: targetId });
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
        const superAdminCount = await (0, teams_repositories_1.countActiveSuperAdmin)();
        console.log(superAdminCount);
        if (superAdminCount === 1 && targetId === requesterId) { // prevent the last superadmin to update it self that disable the last superadmin access
            return false;
        }
    }
    // if the changes is
    const deletedUser = await (0, teams_repositories_1.deleteUser)({ id });
    // jika error, lemparkan error untuk di-catch oleh controller
    if (!deletedUser) {
        return false;
    }
    // return data bersih
    return true;
}
