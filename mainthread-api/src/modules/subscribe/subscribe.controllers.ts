import express from 'express';

const router = express.Router();

import { confirmSubscribeServices, confirmUnsubscribeServices, createSubscribeServices, unsubscribeServices } from './subscribe.services';

/**
 * 1. create subscribe (send confirm email)
 * 2. confirm subscribe (use token)
 * 3. unsubscribe (send unsubscribe email)
 */

router.post('/subscribe/confirm', async (req, res) => {
    try {
        const { token } = req.body;
        const result = await confirmSubscribeServices(token);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.log('error from subscribe confirm controller', error);
        return res.status(500).json({ error: 'Failed to confirm subscribe' });
    }
})

router.post('/subscribe/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await createSubscribeServices(email);
        return res.status(result?.status).json({ message: result?.message });
    } catch (error) {
        console.log('error from subscribe controllers', error);
        return res.status(500).json({ error: 'Failed to init subscribe' });
    }
})

router.post('/unsubscribe/confirm', async (req, res) => {
    try {
        const { token } = req.body;
        const result = await confirmUnsubscribeServices(token);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.log('error from unsubscribe confirm controller', error);
        return res.status(500).json({ error: 'Failed to confirm unsubscribe' });
    }
})

// TODO: implement unsubscribe logic
router.post('/unsubscribe/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await unsubscribeServices(email);
        return res.status(result?.status).json({ message: result?.message });
    } catch (error) {
        console.log('error from unsubscribe controllers', error);
        return res.status(500).json({ error: 'Failed to init unsubscribe' });
    }
})


export default router;
