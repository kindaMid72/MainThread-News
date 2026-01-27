"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticleService = createArticleService;
exports.getArticlesService = getArticlesService;
exports.getArticleService = getArticleService;
exports.updateArticleService = updateArticleService;
exports.deleteArticleService = deleteArticleService;
exports.uploadImageService = uploadImageService;
const articles_repositories_1 = require("./articles.repositories");
// utils
const extracIdFromToken_1 = __importDefault(require("../../utils/authTools/extracIdFromToken"));
const codeSHA256_1 = require("../../utils/cryptoTools/codeSHA256");
async function createArticleService(authorization) {
    const authorId = await (0, extracIdFromToken_1.default)(authorization);
    if (!authorId) {
        throw new Error('Extract Id From Token Failed');
    }
    // console.log(authorId); // token exist
    const articleId = await (0, articles_repositories_1.createArticleReturnId)({ authorId });
    return { id: articleId };
}
async function getArticlesService({ cursor, limit, direction, category, status, asc, search }) {
    // given cursor(needs to be decoded), limit, direction, category, status
    // return articles, {nextCursor, prevCursor, hasPrev, hasNext}(encoded)
    // determine if the request is first page, next page, or previous page
    search = search?.trim();
    // console.log(cursor, limit, direction, category, status, asc);
    if (!cursor) {
        // first page
        let queryResult = await (0, articles_repositories_1.getArticlesFirstPage)({ limit: limit, category: category, status: status, asc: asc, search: search });
        // assign hasNext and hasPrev based on queryResult
        const hasNext = queryResult.length >= (limit || 0);
        const hasPrev = false;
        if (hasNext) {
            queryResult.pop();
        }
        // create next cursor and prev cursor
        const nextCursor = hasNext ? { id: queryResult[queryResult.length - 1].id, createdAt: queryResult[queryResult.length - 1].created_at } : null;
        const prevCursor = null;
        const newCursor = {
            nextCursor,
            prevCursor,
            hasPrev,
            hasNext
        };
        const cursorEncoded = (0, codeSHA256_1.encodeObjectToBase64)(newCursor);
        return { articles: queryResult, cursor: cursorEncoded, hasNext, hasPrev };
    }
    else if (direction === 'forward') {
        // next page
        const cursorDecoded = (0, codeSHA256_1.decodeBase64ToObject)(cursor);
        const queryResult = await (0, articles_repositories_1.getArticlesNextPage)({ cursor: cursorDecoded.nextCursor, limit: limit, direction: direction, category: category, status: status, asc: asc });
        // assign hasNext and hasPrev based on queryResult
        const hasNext = queryResult.length === limit + 1;
        const hasPrev = true;
        const nextCursor = hasNext ? { id: queryResult[queryResult.length - 1].id, createdAt: queryResult[queryResult.length - 2].created_at } : null;
        const prevCursor = { id: queryResult[0].id, createdAt: queryResult[0].created_at };
        if (hasNext) {
            queryResult.pop();
        }
        // create next cursor and prev cursor
        const newCursor = {
            nextCursor,
            prevCursor,
            hasPrev,
            hasNext
        };
        const cursorEncoded = (0, codeSHA256_1.encodeObjectToBase64)(newCursor);
        return { articles: queryResult, cursor: cursorEncoded, hasNext, hasPrev };
    }
    else if (direction === 'backward') {
        // previous page
        const cursorDecoded = (0, codeSHA256_1.decodeBase64ToObject)(cursor);
        const queryResult = await (0, articles_repositories_1.getArticlesPreviousPage)({ cursor: cursorDecoded.prevCursor, limit: limit, direction: direction, category: category, status: status, asc: asc });
        // assign hasNext and hasPrev based on queryResult
        const hasNext = true;
        const hasPrev = queryResult.length === limit + 1;
        if (hasPrev) {
            queryResult.shift();
        }
        // create next cursor and prev cursor
        const nextCursor = hasNext ? { id: queryResult[queryResult.length - 1].id, createdAt: queryResult[queryResult.length - 1].created_at } : null;
        const prevCursor = hasPrev ? { id: queryResult[0].id, createdAt: queryResult[0].created_at } : null;
        const newCursor = {
            nextCursor,
            prevCursor,
            hasPrev,
            hasNext
        };
        const cursorEncoded = (0, codeSHA256_1.encodeObjectToBase64)(newCursor);
        return { articles: queryResult, cursor: cursorEncoded, hasNext, hasPrev };
    }
    else {
        throw new Error('Invalid direction');
    }
}
async function getArticleService(id) {
    // get article by id
    const article = await (0, articles_repositories_1.getArticleById)(id);
    // get article & tags relation by id, return related tags id
    const articleTags = await (0, articles_repositories_1.getArticleTagsById)(id);
    return { article, articleTags };
}
async function updateArticleService(id, updates, tagIds) {
    // update article
    if (Object.keys(updates).length > 0) { // check if there any field to update, well there should be some
        await (0, articles_repositories_1.updateArticle)(id, updates);
    }
    // update tags if provided, perform update on article_tags table
    if (tagIds) { // check if there any tag to update
        await (0, articles_repositories_1.updateArticleTags)(id, tagIds);
    }
}
async function deleteArticleService(id) {
    await (0, articles_repositories_1.deleteArticle)(id);
}
async function uploadImageService(image, articleId) {
    try {
        const imageBuffer = image.buffer;
        const currentTime = new Date().toISOString();
        // property
        const path = 'images/thumbnail/' + currentTime + '-' + image.originalname;
        // create metadata
        const medatata = {
            name: image.originalname,
            size: image.size,
            type: image.mimetype,
            path: path,
            article_id: articleId
        };
        const imageUrl = await (0, articles_repositories_1.uploadImage)(imageBuffer, path, medatata);
        return imageUrl;
    }
    catch (error) {
        throw new Error('upload file failed');
    }
}
