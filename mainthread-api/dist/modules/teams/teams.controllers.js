"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// imports
const teams_middlewares_1 = require("./teams.middlewares");
const teams_services_1 = require("./teams.services");
// utils
const extracIdFromToken_1 = __importDefault(require("../../utils/authTools/extracIdFromToken"));
// logs
const log_admin_action_1 = __importDefault(require("../../logging/log.admin.action"));
// apply middleware to all routes in this router
router.use(teams_middlewares_1.teamsMiddlewares);
router.get('/get-all-users', async (req, res) => {
    try {
        const users = await (0, teams_services_1.getAllUserService)();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/invite-new-user', async (req, res) => {
    try {
        const { email, role } = req.body;
        // check email & role
        if (!email || !role) {
            return res.status(400).json({ message: 'Email and role are required' });
        }
        // check if the role match the enum
        if (role !== 'admin' && role !== 'writer') {
            return res.status(400).json({ message: 'Invalid role' });
        }
        // check if the email is valid
        if (!email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        // call services, return true if success false if failed
        const sendInvite = await (0, teams_services_1.inviteUserService)({ email, role });
        if (!sendInvite) {
            return res.status(400).json({ message: 'Failed to send invite' });
        }
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'invite new user',
            entityType: 'team',
            entityId: '',
            metadata: { email, role },
        });
        return res.status(200).json({ message: 'Invite sent successfully' });
    }
    catch (error) {
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/accept-invite-new-user', async (req, res) => {
    try {
        // req: password, token
        const { password, token } = req.body;
        // check password & token
        if (!password || !token) {
            return res.status(400).json({ message: 'Password and token are required' });
        }
        // call services, return true if success false if failed
        const acceptInvite = await (0, teams_services_1.acceptInviteService)({ password, token });
        if (!acceptInvite) {
            return res.status(400).json({ message: 'Failed to accept invite' });
        }
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'accept invite',
            entityType: 'team',
            entityId: '',
            metadata: { password, token },
        });
        return res.status(200).json({ message: 'Invite accepted successfully' });
    }
    catch (error) {
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
});
router.put('/update-user', async (req, res) => {
    try {
        // req: id, name, role, isActive
        const { id, name, role, isActive } = req.body;
        // check id & name & role & isActive
        if (!id || !name || !role) {
            return res.status(400).json({ message: 'Id, name, role are required' });
        }
        // call services, return true if success false if failed
        const requester = req.headers.authorization;
        const updateUser = await (0, teams_services_1.updateUserService)({ requester, id, name, role, isActive });
        if (!updateUser) {
            return res.status(400).json({ message: 'Failed to update user' });
        }
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'update user',
            entityType: 'team',
            entityId: id,
            metadata: { id, name, role, isActive },
        });
        return res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
});
router.delete('/delete-user/:id', async (req, res) => {
    try {
        // req: id
        const { id } = req.params;
        // check id
        if (!id || id.trim() === '') {
            return res.status(400).json({ message: 'Id is required' });
        }
        // call services, return true if success false if failed
        const requester = req.headers.authorization;
        const deleteUser = await (0, teams_services_1.deleteUserService)({ requester, id });
        if (!deleteUser) {
            return res.status(400).json({ message: 'Failed to delete user' });
        }
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'delete user',
            entityType: 'team',
            entityId: id,
            metadata: { id },
        });
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
});
exports.default = router;
