"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = getAllCategories;
exports.insertCategory = insertCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const createDbAccess_1 = __importDefault(require("../../config/database/createDbAccess"));
const createRedisAccess_1 = __importDefault(require("../../config/redis/createRedisAccess"));
const const_redis_1 = require("../../const/const.redis");
async function getAllCategories() {
    const db = await (0, createDbAccess_1.default)();
    try {
        // check if categories are cached
        const cachedCategories = await createRedisAccess_1.default.get(const_redis_1.REDIS_KEY.CATEGORIES);
        if (cachedCategories)
            return cachedCategories;
        const { data: categories, error: categoriesError } = await db
            .from('categories')
            .select('id, name, slug, description, is_active');
        if (categoriesError)
            throw new Error(`Error fetching categories: ${categoriesError}`);
        await createRedisAccess_1.default.set(const_redis_1.REDIS_KEY.CATEGORIES, categories);
        return categories;
    }
    catch (error) {
        throw new Error(`Error fetching categories: ${error}`);
    }
}
async function insertCategory(category) {
    const db = await (0, createDbAccess_1.default)();
    try {
        const { data: categoryData, error: categoryError } = await db
            .from('categories')
            .insert({
            name: category.name,
            slug: category.slug,
            description: category.description,
            is_active: category.isActive
        });
        if (categoryError)
            return false;
        // invalidate cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.CATEGORIES);
        return true;
    }
    catch (error) {
        return false;
    }
}
async function updateCategory({ id, name, slug, description, isActive }) {
    const db = await (0, createDbAccess_1.default)();
    try {
        const { data: categoryData, error: categoryError } = await db
            .from('categories')
            .update({
            name: name,
            slug: slug,
            description: description,
            is_active: isActive
        })
            .eq('id', id);
        if (categoryError)
            return false;
        // invalidate cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.CATEGORIES);
        return true;
    }
    catch (error) {
        return false;
    }
}
async function deleteCategory({ id }) {
    const db = await (0, createDbAccess_1.default)();
    try {
        const { data: categoryData, error: categoryError } = await db
            .from('categories')
            .delete()
            .eq('id', id);
        if (categoryError)
            throw new Error(`Error deleting category: ${categoryError}`);
        // invalidate cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.CATEGORIES);
        return true;
    }
    catch (error) {
        throw new Error(`Error deleting category: ${error}`);
    }
}
