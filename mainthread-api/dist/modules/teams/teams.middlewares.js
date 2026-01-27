"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamsMiddlewares = teamsMiddlewares;
const checkAdminAccess_1 = __importDefault(require("../../middlewares/auth/checkAdminAccess"));
async function teamsMiddlewares(req, res, next) {
    // admin superadmin only access, forbid the request if user is not admin or superadmin
    const userHasAccess = await (0, checkAdminAccess_1.default)(req.headers.authorization);
    if (!userHasAccess)
        return res.status(401).json({ message: 'Unauthorized' }); // return 401 if user is not admin or superadmin, do not proceed
    next(); // next middlewares or pass to controllers
}
