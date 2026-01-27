"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTagsService = getAllTagsService;
exports.addNewTagService = addNewTagService;
exports.updateTagService = updateTagService;
exports.deleteTagService = deleteTagService;
// repositories
const tags_repositories_1 = require("./tags.repositories");
// utils
const generateSlugConsistForGivenString_1 = __importDefault(require("../../utils/generator/generateSlugConsistForGivenString"));
async function getAllTagsService() {
    try {
        const cachedTags = await (0, tags_repositories_1.getAllTags)();
        if (cachedTags)
            return cachedTags;
        return await (0, tags_repositories_1.getAllTags)();
    }
    catch (error) {
        throw new Error(`Internal Server Error: ${error}`);
    }
}
async function addNewTagService({ name }) {
    try {
        const slug = (0, generateSlugConsistForGivenString_1.default)(name);
        return await (0, tags_repositories_1.addNewTag)({ name, slug });
    }
    catch (error) {
        throw new Error(`Internal Server Error: ${error}`);
    }
}
async function updateTagService({ id, name }) {
    try {
        const slug = (0, generateSlugConsistForGivenString_1.default)(name);
        return await (0, tags_repositories_1.updateTag)({ id, name, slug });
    }
    catch (error) {
        throw new Error(`Internal Server Error: ${error}`);
    }
}
async function deleteTagService({ id }) {
    try {
        return await (0, tags_repositories_1.deleteTag)({ id });
    }
    catch (error) {
        throw new Error(`Internal Server Error: ${error}`);
    }
}
