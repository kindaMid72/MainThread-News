"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscribeExist = checkSubscribeExist;
exports.getSubscribeId = getSubscribeId;
exports.createSubscribe = createSubscribe;
exports.createToken = createToken;
exports.getSubscriptionToken = getSubscriptionToken;
exports.confirmSubscriber = confirmSubscriber;
exports.unsubscribeSubscriber = unsubscribeSubscriber;
exports.deleteToken = deleteToken;
const createDbAccess_1 = __importDefault(require("../../config/database/createDbAccess"));
async function checkSubscribeExist(email) {
    const db = await (0, createDbAccess_1.default)();
    const { data, error } = await db.from('subscribers').select('*').eq('email', email).eq('status', 'active');
    if (error)
        throw error;
    return data.
        length > 0;
}
async function getSubscribeId(email) {
    const db = await (0, createDbAccess_1.default)();
    const { data, error } = await db.from('subscribers').select('id').eq('email', email).eq('status', 'active');
    if (error)
        throw error;
    return data[0]?.id;
}
async function createSubscribe(subscribe) {
    const db = await (0, createDbAccess_1.default)();
    const { data, error } = await db.from('subscribers').upsert(subscribe, { onConflict: 'email' }).select('id').single();
    if (error)
        throw error;
    return data?.id;
}
async function createToken(token) {
    const db = await (0, createDbAccess_1.default)();
    const { data, error } = await db.from('subscription_tokens').insert(token).select('token').single();
    if (error)
        throw error;
}
async function getSubscriptionToken(token) {
    const db = await (0, createDbAccess_1.default)();
    const { data, error } = await db.from('subscription_tokens').select('*').eq('token', token).maybeSingle();
    if (error)
        throw error;
    return data;
}
async function confirmSubscriber(subscriberId) {
    const db = await (0, createDbAccess_1.default)();
    const { error } = await db.from('subscribers').update({ status: 'active', confirmed_at: new Date().toISOString() }).eq('id', subscriberId);
    if (error)
        throw error;
}
async function unsubscribeSubscriber(subscriberId) {
    const db = await (0, createDbAccess_1.default)();
    const { error } = await db.from('subscribers').update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() }).eq('id', subscriberId);
    if (error)
        throw error;
}
async function deleteToken(token) {
    const db = await (0, createDbAccess_1.default)();
    const { error } = await db.from('subscription_tokens').delete().eq('token', token);
    if (error)
        throw error;
}
