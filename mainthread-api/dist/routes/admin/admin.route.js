"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import controllers
const teams_controllers_1 = __importDefault(require("../../modules/teams/teams.controllers"));
const categories_controllers_1 = __importDefault(require("../../modules/categories/categories.controllers"));
const tags_controllers_1 = __importDefault(require("../../modules/tags/tags.controllers"));
const articles_controllers_1 = __importDefault(require("../../modules/articles/articles.controllers"));
// this is all entry point for teams, restricted to super admin and admin
router.use('/teams', teams_controllers_1.default); // all entry point for teams
router.use('/categories', categories_controllers_1.default); // all entry point for categories
router.use('/tags', tags_controllers_1.default); // all entry point for tags
router.use('/articles', articles_controllers_1.default);
exports.default = router;
