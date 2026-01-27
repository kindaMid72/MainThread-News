"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const public_controllers_1 = __importDefault(require("../../modules/public/public.controllers"));
const router = express_1.default.Router();
router.use('/', public_controllers_1.default);
exports.default = router;
