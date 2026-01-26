import express from 'express';

const router = express.Router();

import { createSubscribeServices } from './subscribe.services';

/**
 * 1. create subscribe (send confirm email)
 * 2. confirm subscribe (use token)
 * 3. unsubscribe (send unsubscribe email)
 */

router.post('/subscribe/:email', async (req, res) => {
    try{
        const { email } = req.params;
        const result = await createSubscribeServices(email);
        return res.status(result?.status).json({message: result?.message});
    }catch(error){
        console.log('error from subscribe controllers', error);
        return res.status(500).json({ error: 'Failed to init subscribe' });
    }
})

router.post('/subscribe/confirm', (req, res) => {

})

// TODO: implement unsubscribe logic
router.post('/unsubscribe', (req, res) => {
    return res.status(200).json({ message: 'Unsubscribe email sent' });
})

router.post('/unsubscribe/confirm', (req, res) => {
    return res.status(200).json({ message: 'Unsubscribe confirmed' });
})

export default router;
