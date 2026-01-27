"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = logAdminAction;
const createDbAccess_1 = __importDefault(require("../config/database/createDbAccess"));
async function logAdminAction({ adminId, action, entityId, entityType, metadata }) {
    try {
        const dbAccess = await (0, createDbAccess_1.default)();
        await dbAccess.from('activity_logs').insert({
            user_id: adminId,
            action: action,
            entity_id: entityId,
            entity_type: entityType,
            metadata: metadata
        });
    }
    catch (error) {
        console.log('error occured in logAdminAction: ', error);
    }
}
