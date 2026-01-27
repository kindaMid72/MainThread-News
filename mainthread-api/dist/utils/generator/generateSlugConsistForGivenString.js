"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uniqueSlug;
const crypto_1 = __importDefault(require("crypto"));
function uniqueSlug(input) {
    // same string = same slug
    // different string = different slug
    // btw, konz
    const base = input
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    const hash = crypto_1.default
        .createHash('sha1')
        .update(input)
        .digest('hex')
        .slice(0, 8);
    return `${base}-${hash}`;
}
