"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeObjectToBase64 = encodeObjectToBase64;
exports.decodeBase64ToObject = decodeBase64ToObject;
function encodeObjectToBase64(target) {
    return Buffer.from(JSON.stringify(target)).toString('base64');
}
function decodeBase64ToObject(target) {
    return JSON.parse(Buffer.from(target, 'base64').toString('utf-8'));
}
exports.default = {
    encodeObjectToBase64,
    decodeBase64ToObject
};
