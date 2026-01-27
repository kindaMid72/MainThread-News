"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const subscribe_services_1 = require("./subscribe.services");
/**
 * 1. create subscribe (send confirm email)
 * 2. confirm subscribe (use token)
 * 3. unsubscribe (send unsubscribe email)
 */
router.post('/subscribe/confirm', async (req, res) => {
    try {
        const { token } = req.body;
        const result = await (0, subscribe_services_1.confirmSubscribeServices)(token);
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        console.log('error from subscribe confirm controller', error);
        return res.status(500).json({ error: 'Failed to confirm subscribe' });
    }
});
router.post('/subscribe/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await (0, subscribe_services_1.createSubscribeServices)(email);
        return res.status(result?.status).json({ message: result?.message });
    }
    catch (error) {
        console.log('error from subscribe controllers', error);
        return res.status(500).json({ error: 'Failed to init subscribe' });
    }
});
router.post('/unsubscribe/confirm', async (req, res) => {
    try {
        const { token } = req.body;
        const result = await (0, subscribe_services_1.confirmUnsubscribeServices)(token);
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        console.log('error from unsubscribe confirm controller', error);
        return res.status(500).json({ error: 'Failed to confirm unsubscribe' });
    }
});
// TODO: implement unsubscribe logic
router.post('/unsubscribe/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await (0, subscribe_services_1.unsubscribeServices)(email);
        return res.status(result?.status).json({ message: result?.message });
    }
    catch (error) {
        console.log('error from unsubscribe controllers', error);
        return res.status(500).json({ error: 'Failed to init unsubscribe' });
    }
});
exports.default = router;
