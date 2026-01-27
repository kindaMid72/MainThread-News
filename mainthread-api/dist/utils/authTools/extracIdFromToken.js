"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = extractIdFromToken;
const createUserInstance_1 = __importDefault(require("../supabase/createUserInstance"));
async function extractIdFromToken(authorization) {
    const supabase = await (0, createUserInstance_1.default)(authorization);
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
        throw new Error(userError.message);
    }
    return user?.user?.id;
}
