"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscribeServices = createSubscribeServices;
exports.confirmSubscribeServices = confirmSubscribeServices;
exports.unsubscribeServices = unsubscribeServices;
exports.confirmUnsubscribeServices = confirmUnsubscribeServices;
// repositories
const subscribe_repositories_1 = require("./subscribe.repositories");
// utils
const generateRandomToken_1 = __importDefault(require("../../utils/generator/generateRandomToken"));
// emailer
const emailerInstance_1 = __importDefault(require("../../config/emailer/emailerInstance"));
// types
async function createSubscribeServices(email) {
    // confirm is already exist
    const adreadySubscribe = await (0, subscribe_repositories_1.checkSubscribeExist)(email);
    if (adreadySubscribe) {
        return {
            status: 400,
            message: 'email already subscribed',
        };
    }
    // create token
    const token = await (0, generateRandomToken_1.default)();
    // create subscribe with status pending
    const subscribeId = await (0, subscribe_repositories_1.createSubscribe)({ email, status: 'pending', source: 'web', subscribed_at: new Date().toISOString(), confirmed_at: null, unsubscribed_at: null });
    // store token in token in database with an expiry date
    const expiryDate = new Date();
    const url = `${process.env.CLIENT_URL}/confirm-subscribe?token=${token}`;
    expiryDate.setDate(expiryDate.getDate() + 1);
    await (0, subscribe_repositories_1.createToken)({ token, subscriber_id: subscribeId, expires_at: expiryDate.toISOString(), type: 'confirmation' });
    // send email
    await (async function () {
        const { data: sendSubscribe, error: sendSubscribeError } = await emailerInstance_1.default.emails.send({
            from: `MainThread.Writers <no-reply@${process.env.DOMAIN_NAME}>`,
            to: [email],
            subject: `Subscribe to mainThread`,
            html: `<strong>Click the link to confirm your subscription: ${url}</strong>`,
        });
        if (sendSubscribeError) {
            throw new Error(sendSubscribeError.message);
        }
    })();
    return {
        status: 201,
        message: 'Subscribe created successfully',
    };
}
async function confirmSubscribeServices(token) {
    const tokenData = await (0, subscribe_repositories_1.getSubscriptionToken)(token);
    if (!tokenData) {
        return {
            status: 400,
            message: 'Invalid token',
        };
    }
    if (new Date(tokenData.expires_at) < new Date()) {
        return {
            status: 400,
            message: 'Token expired',
        };
    }
    await (0, subscribe_repositories_1.confirmSubscriber)(tokenData.subscriber_id);
    await (0, subscribe_repositories_1.deleteToken)(token);
    return {
        status: 200,
        message: 'Subscribe confirmed successfully',
    };
}
async function unsubscribeServices(email) {
    // check if user is subscribed
    const subscribeId = await (0, subscribe_repositories_1.getSubscribeId)(email);
    if (!subscribeId) {
        return {
            status: 400,
            message: 'email not subscribed yet',
        };
    }
    // create token and store it in database
    const token = await (0, generateRandomToken_1.default)();
    const expiryDate = new Date();
    const url = `${process.env.CLIENT_URL}/confirm-unsubscribe?token=${token}`;
    expiryDate.setDate(expiryDate.getDate() + 1);
    await (0, subscribe_repositories_1.createToken)({ token, subscriber_id: subscribeId, expires_at: expiryDate.toISOString(), type: 'unsubscription' });
    // send email
    await (async function () {
        const { data: sendSubscribe, error: sendSubscribeError } = await emailerInstance_1.default.emails.send({
            from: `MainThread.Writers <no-reply@${process.env.DOMAIN_NAME}>`,
            to: [email],
            subject: `Unsubscribe to mainThread`,
            html: `<strong>Click the link to confirm unsubscribe: ${url}</strong>`,
        });
        if (sendSubscribeError) {
            throw new Error(sendSubscribeError.message);
        }
    })();
    return {
        status: 200,
        message: 'Unsubscribe confirmed successfully',
    };
}
async function confirmUnsubscribeServices(token) {
    const tokenData = await (0, subscribe_repositories_1.getSubscriptionToken)(token);
    if (!tokenData) {
        return {
            status: 400,
            message: 'Invalid token',
        };
    }
    if (new Date(tokenData.expires_at) < new Date()) {
        return {
            status: 400,
            message: 'Token expired',
        };
    }
    await (0, subscribe_repositories_1.unsubscribeSubscriber)(tokenData.subscriber_id);
    await (0, subscribe_repositories_1.deleteToken)(token);
    return {
        status: 200,
        message: 'Unsubscribe confirmed successfully',
    };
}
