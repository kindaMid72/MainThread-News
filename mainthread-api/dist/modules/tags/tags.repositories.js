"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTags = getAllTags;
exports.addNewTag = addNewTag;
exports.updateTag = updateTag;
exports.deleteTag = deleteTag;
const createDbAccess_1 = __importDefault(require("../../config/database/createDbAccess"));
const createRedisAccess_1 = __importDefault(require("../../config/redis/createRedisAccess"));
// const
const const_redis_1 = require("../../const/const.redis");
async function getAllTags() {
    try {
        const db = await (0, createDbAccess_1.default)();
        // check cache first
        const cachedTags = await createRedisAccess_1.default.get(const_redis_1.REDIS_KEY.TAGS);
        if (cachedTags)
            return cachedTags;
        const { data: tags, error: tagsError } = await db.from('tags').select('id, name, slug');
        if (tagsError)
            throw new Error(tagsError.message);
        await createRedisAccess_1.default.set(const_redis_1.REDIS_KEY.TAGS, tags);
        return tags;
    }
    catch (error) {
        throw error;
    }
}
async function addNewTag({ name, slug }) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const { error: tagError } = await db.from('tags').insert({ name, slug });
        if (tagError)
            return false;
        // clear cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.TAGS);
        return true;
    }
    catch (error) {
        throw error;
    }
}
async function updateTag({ id, name, slug }) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const { error: tagError } = await db.from('tags').update({ name, slug }).eq('id', id);
        if (tagError)
            return false;
        // clear cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.TAGS);
        return true;
    }
    catch (error) {
        throw error;
    }
}
async function deleteTag({ id }) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const { error: tagError } = await db.from('tags').delete().eq('id', id);
        if (tagError)
            return false;
        // clear cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.TAGS);
        return true;
    }
    catch (error) {
        throw error;
    }
}
