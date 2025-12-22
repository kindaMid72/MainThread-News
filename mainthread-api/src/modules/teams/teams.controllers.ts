import express from "express";

const router = express.Router();
// imports
import { teamsMiddlewares } from "./teams.middlewares";
import { getAllUserService, inviteUserService, acceptInviteService, updateUserService, deleteUserService } from "./teams.services";
// types
import { TeamMember, TeamMemberCreate } from "./teams.types";

// apply middleware to all routes in this router
router.use(teamsMiddlewares);

router.get('/get-all-users', async (req, res) => {
    try {
        const users = await getAllUserService();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/invite-new-user', async (req, res) => {
    try{
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
        const sendInvite : boolean = await inviteUserService({ email, role });

        if (!sendInvite) {
            return res.status(400).json({ message: 'Failed to send invite' });
        }

        return res.status(200).json({ message: 'Invite sent successfully' });

    }catch(error){
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: error });
    }
});

router.post('/accept-invite-new-user', async (req, res) => {
    try{
        // req: password, token
        const { password, token }: { password: string, token: string } = req.body;
        // check password & token
        if (!password || !token) {
            return res.status(400).json({ message: 'Password and token are required' });
        }
        
        // call services, return true if success false if failed
        const acceptInvite : boolean = await acceptInviteService({ password, token });

        if (!acceptInvite) {
            return res.status(400).json({ message: 'Failed to accept invite' });
        }

        return res.status(200).json({ message: 'Invite accepted successfully' });

    }catch(error){
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
});
router.put('/update-user', async (req, res) => {
    try{
        // req: id, name, role, isActive
        const { id, name, role, isActive }: TeamMember = req.body;
        // check id & name & role & isActive
        if (!id || !name || !role) {
            return res.status(400).json({ message: 'Id, name, role are required' });
        }
        // call services, return true if success false if failed
        const requester = req.headers.authorization;
        const updateUser : boolean = await updateUserService({ requester, id, name, role, isActive });

        if (!updateUser) {
            return res.status(400).json({ message: 'Failed to update user' });
        }

        return res.status(200).json({ message: 'User updated successfully' });
    }catch(error){
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
});

router.delete('/delete-user/:id', async (req, res) => {
    try{
        // req: id
        const { id }: TeamMember = req.params;
        // check id
        if (!id || id.trim() === '') {
            return res.status(400).json({ message: 'Id is required' });
        }
        // call services, return true if success false if failed
        const requester = req.headers.authorization;
        const deleteUser : boolean = await deleteUserService({ requester, id });

        if (!deleteUser) {
            return res.status(400).json({ message: 'Failed to delete user' });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    }catch(error){
        console.log('error occured in teams.controllers: ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
});


export default router;
