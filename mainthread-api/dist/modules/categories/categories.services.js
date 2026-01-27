"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategoriesService = getAllCategoriesService;
exports.addCategoryService = addCategoryService;
exports.updateCategoryService = updateCategoryService;
exports.deleteCategoryService = deleteCategoryService;
// repositories
const categories_repositories_1 = require("./categories.repositories");
// utils
const generateSlugConsistForGivenString_1 = __importDefault(require("../../utils/generator/generateSlugConsistForGivenString"));
async function getAllCategoriesService() {
    try {
        const categories = await (0, categories_repositories_1.getAllCategories)();
        return categories;
    }
    catch (error) {
        throw new Error(`Error fetching categories: ${error}`);
    }
}
async function addCategoryService({ name, description, isActive }) {
    try {
        const newCategory = {
            name,
            description,
            isActive
        };
        const newSlug = (0, generateSlugConsistForGivenString_1.default)(newCategory.name);
        const newEntry = {
            name: newCategory.name,
            description: newCategory.description,
            slug: newSlug,
            isActive: newCategory.isActive
        };
        // check if there any category with the same name, if there is none, insert new value
        const insertedCategory = await (0, categories_repositories_1.insertCategory)(newEntry); // return false if unique constraint violation
        if (!insertedCategory)
            return false;
        return true;
    }
    catch (error) {
        throw new Error(`Error adding category: ${error}`);
    }
}
async function updateCategoryService({ id, name, description, isActive }) {
    try {
        // create slug
        const slug = (0, generateSlugConsistForGivenString_1.default)(name);
        const updatedCategory = {
            id,
            name,
            slug,
            description,
            isActive
        };
        const updateResult = await (0, categories_repositories_1.updateCategory)(updatedCategory);
        if (!updateResult)
            return false;
        return true;
    }
    catch (error) {
        throw new Error(`Error updating category: ${error}`);
    }
}
async function deleteCategoryService({ id }) {
    try {
        const deleteResult = await (0, categories_repositories_1.deleteCategory)({ id });
        if (!deleteResult)
            return false;
        return true;
    }
    catch (error) {
        throw new Error(`Error deleting category: ${error}`);
    }
}
