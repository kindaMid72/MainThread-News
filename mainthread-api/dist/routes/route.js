"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import admin & public entry point
const subscribe_controllers_1 = __importDefault(require("../modules/subscribe/subscribe.controllers"));
const admin_route_1 = __importDefault(require("./admin/admin.route"));
const public_route_1 = __importDefault(require("./public/public.route"));
const router = express_1.default.Router();
// admin entry point
router.use('/admin', admin_route_1.default);
// public entry point
router.use('/public', public_route_1.default);
// subscribe entry point
router.use('/', subscribe_controllers_1.default);
exports.default = router;
