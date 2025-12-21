import express from "express";

const router = express.Router();
// imports
import { teamsMiddlewares } from "./teams.middlewares";
import { getAllUserService } from "./teams.services";

// apply middleware to all routes in this router
router.use(teamsMiddlewares);

router.get('/get-all-users', async (req, res) => {
    try {
        console.log(req.headers.authorization);
        const users = await getAllUserService();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/invite-new-user', (req, res) => {
    res.send('Invite New User Page');
});

router.post('/confirm-new-user', (req, res) => {
    res.send('Confirm New User Page');
});

router.delete('/delete-user', (req, res) => {
    res.send('Delete User Page');
});

router.put('/update-user', (req, res) => {
    res.send('Update User Page');
});

export default router;
