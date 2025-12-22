import express from "express";

const router = express.Router();
// imports
import { teamsMiddlewares } from "./teams.middlewares";
import { getAllUserService, inviteUserService, acceptInviteService } from "./teams.services";
// types
import { TeamMemberCreate } from "./teams.types";

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
        if (role !== 'admin' && role !== 'superadmin' && role !== 'writer') {
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

router.delete('/delete-user', (req, res) => {
    res.send('Delete User Page');
});

router.put('/update-user', (req, res) => {
    res.send('Update User Page');
});

export default router;
