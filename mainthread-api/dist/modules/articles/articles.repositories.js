"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticleReturnId = createArticleReturnId;
exports.getArticlesFirstPage = getArticlesFirstPage;
exports.getArticlesNextPage = getArticlesNextPage;
exports.getArticlesPreviousPage = getArticlesPreviousPage;
exports.getArticleById = getArticleById;
exports.getArticleTagsById = getArticleTagsById;
exports.updateArticle = updateArticle;
exports.updateArticleTags = updateArticleTags;
exports.deleteArticle = deleteArticle;
exports.uploadImage = uploadImage;
const createDbAccess_1 = __importDefault(require("../../config/database/createDbAccess"));
const createRedisAccess_1 = __importDefault(require("../../config/redis/createRedisAccess"));
const const_redis_1 = require("../../const/const.redis");
// utils
const generateRandomToken_1 = __importDefault(require("../../utils/generator/generateRandomToken"));
async function createArticleReturnId({ authorId }) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const value = {
            title: '',
            slug: await (0, generateRandomToken_1.default)(),
            excerpt: null,
            content_html: '<p></p>',
            thumbnail_url: '',
            category_id: null,
            author_id: authorId,
            status: 'draft',
            source_type: 'manual',
            source_ref: '',
            view_count: 0,
            is_breaking: false,
            is_headline: false,
            published_at: null,
            updated_at: new Date().toISOString(),
        };
        const { data: article, error } = await db
            .from('articles')
            .insert(value)
            .select()
            .single();
        if (error) {
            console.error('Error creating article:', error);
            throw error;
        }
        return article.id;
    }
    catch (error) {
        console.error('Error creating article:', error);
        throw error;
    }
}
// pagination cursor
// - first page
async function getArticlesFirstPage({ limit, category, status, asc, search }) {
    try {
        const db = await (0, createDbAccess_1.default)();
        // TODO: implement pagination back and forward with cursor implementation
        const statusCondition = status === 'all' || !status ? '' : `status.eq.${status}`;
        const categoryCondition = category === 'all' || !category ? '' : `category_id.eq.${category}`;
        // query string
        let additionalCondition = [];
        let query = db
            .from('articles')
            .select()
            .limit(limit + 1)
            .order('created_at', { ascending: asc });
        if (statusCondition !== '') {
            additionalCondition.push(statusCondition);
        }
        if (categoryCondition !== '') {
            additionalCondition.push(categoryCondition);
        }
        if (search != '' && search != null) {
            query = query.or(`title.ilike.%${search}%`);
        }
        if (additionalCondition.length > 0) {
            query = query.or(additionalCondition.join(','));
        }
        const { data: articles, error } = await query;
        if (error) {
            console.error('Error getting articles:', error);
            throw error;
        }
        return articles;
    }
    catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}
// - next page
async function getArticlesNextPage({ cursor, limit, direction, category, status, asc, search }) {
    try {
        const db = await (0, createDbAccess_1.default)();
        // cursorNext: {id, createdAt}
        const cursorNext = cursor;
        // TODO: implement pagination back and forward with cursor implementation
        if (direction !== 'forward') {
            throw new Error('Invalid direction');
        }
        const statusCondition = status === 'all' || !status ? '' : `status.eq.${status}`;
        const categoryCondition = category === 'all' || !category ? '' : `category_id.eq.${category}`;
        // query string
        let additionalCondition = [];
        let query = db
            .from('articles')
            .select()
            .limit(limit + 1)
            .order('created_at', { ascending: asc });
        if (search != '' && search != null) {
            query = query.or(`title.ilike.%${search}%`);
        }
        // determine operator based on sort direction
        if (asc) {
            // Oldest first: next page means newer items (> cursor)
            query = query.gt('created_at', cursorNext.createdAt);
        }
        else {
            // Newest first: next page means older items (< cursor)
            query = query.lt('created_at', cursorNext.createdAt);
        }
        if (statusCondition !== '') {
            additionalCondition.push(statusCondition);
        }
        if (categoryCondition !== '') {
            additionalCondition.push(categoryCondition);
        }
        if (additionalCondition.length > 0) {
            query = query.or(additionalCondition.join(','));
        }
        const { data: articles, error } = await query;
        if (error) {
            console.error('Error getting articles:', error);
            throw error;
        }
        return articles;
    }
    catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}
// - previous page
async function getArticlesPreviousPage({ cursor, limit, direction, category, status, asc, search }) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const cursorPrev = cursor;
        if (direction !== 'backward') {
            throw new Error('Invalid direction');
        }
        const statusCondition = status === 'all' || !status ? '' : `status.eq.${status}`;
        const categoryCondition = category === 'all' || !category ? '' : `category_id.eq.${category}`;
        // query string
        let additionalCondition = [];
        let query = db
            .from('articles')
            .select()
            .limit(limit + 1)
            .order('created_at', { ascending: !asc }); // Always reverse sort to get nearest neighbors first
        // determine operator based on sort direction
        if (asc) {
            // Oldest first: prev page means older items (< cursor)
            query = query.lt('created_at', cursorPrev.createdAt);
        }
        else {
            // Newest first: prev page means newer items (> cursor)
            query = query.gt('created_at', cursorPrev.createdAt);
        }
        if (search != '' && search != null) {
            query = query.or(`title.ilike.%${search}%`);
        }
        if (statusCondition !== '') {
            additionalCondition.push(statusCondition);
        }
        if (categoryCondition !== '') {
            additionalCondition.push(categoryCondition);
        }
        if (additionalCondition.length > 0) {
            query = query.or(additionalCondition.join(','));
        }
        const { data: articles, error } = await query;
        if (error) {
            console.error('Error getting articles:', error);
            throw error;
        }
        // Always reverse the result because we fetched in reverse order
        articles.reverse();
        return articles;
    }
    catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}
async function getArticleById(id) {
    try {
        // check redis cache
        const cachedArticle = await createRedisAccess_1.default.get(const_redis_1.REDIS_KEY.ARTICLES(id));
        if (cachedArticle) {
            return cachedArticle;
        }
        const db = await (0, createDbAccess_1.default)();
        const { data: article, error } = await db
            .from('articles')
            .select()
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error getting article:', error);
            throw error;
        }
        // set cache
        await createRedisAccess_1.default.set(const_redis_1.REDIS_KEY.ARTICLES(id), article);
        return article;
    }
    catch (error) {
        console.error('Error getting article:', error);
        throw error;
    }
}
async function getArticleTagsById(id) {
    try {
        // check redis cache
        const cachedArticleTags = await createRedisAccess_1.default.get(const_redis_1.REDIS_KEY.ARTICLES_TAGS(id));
        if (cachedArticleTags) {
            return cachedArticleTags;
        }
        const db = await (0, createDbAccess_1.default)();
        const { data: articleTags, error } = await db
            .from('article_tags')
            .select('tag_id')
            .eq('article_id', id);
        if (error) {
            console.error('Error getting article tags:', error);
            throw error;
        }
        // set cache
        await createRedisAccess_1.default.set(const_redis_1.REDIS_KEY.ARTICLES_TAGS(id), articleTags);
        return articleTags;
    }
    catch (error) {
        console.error('Error getting article tags:', error);
        throw error;
    }
}
async function updateArticle(id, updates) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const { error } = await db
            .from('articles')
            .update({
            ...updates,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .eq('id', id);
        if (updates.slug) { // invalidate cache for slug
            await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.ARTICLES(updates.slug));
        }
        if (error) {
            console.error('Error updating article:', error);
            throw error;
        }
        // Invalidate cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.ARTICLES(id));
    }
    catch (error) {
        console.error('Error updating article:', error);
        throw error;
    }
}
async function updateArticleTags(articleId, tagIds) {
    try {
        const db = await (0, createDbAccess_1.default)();
        // 1. Delete existing tags for this article
        const { error: deleteError } = await db
            .from('article_tags')
            .delete()
            .eq('article_id', articleId);
        if (deleteError) {
            console.error('Error deleting old article tags:', deleteError);
            throw deleteError;
        }
        // 2. Insert new tags, if there are any to add, if its empty, do nothing
        if (tagIds.length > 0) {
            const newTags = tagIds.map(tagId => ({
                article_id: articleId,
                tag_id: tagId
            }));
            const { error: insertError } = await db
                .from('article_tags')
                .insert([
                ...newTags.map(tags => ({
                    article_id: articleId,
                    tag_id: tags.tag_id
                }))
            ]);
            if (insertError) {
                console.error('Error inserting new article tags:', insertError);
                throw insertError;
            }
        }
        // Invalidate cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.ARTICLES_TAGS(articleId));
    }
    catch (error) {
        console.error('Error updating article tags:', error);
        throw error;
    }
}
async function deleteArticle(id) {
    try {
        const db = await (0, createDbAccess_1.default)();
        // 1. Delete article tags (foreign key might handle this with CASCADE, but manual is safer/explicit)
        const { error: tagsError } = await db
            .from('article_tags')
            .delete()
            .eq('article_id', id);
        if (tagsError) {
            console.error('Error deleting article tags:', tagsError);
            throw tagsError;
        }
        // 2. Delete article
        const { data: deletedArticles, error: articleError } = await db
            .from('articles')
            .delete()
            .eq('id', id)
            .select();
        if (deletedArticles) { // invalidate public slug
            await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.ARTICLES(deletedArticles[0].slug));
        }
        if (articleError) {
            console.error('Error deleting article:', articleError);
            throw articleError;
        }
        // Invalidate cache
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.ARTICLES(id));
        await createRedisAccess_1.default.del(const_redis_1.REDIS_KEY.ARTICLES_TAGS(id));
    }
    catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
}
async function uploadImage(image, path, metadata) {
    // TODO: implement image upload, create an access url for that image, return the url    
    // 
    const TEN_YEARS = 10 * 365 * 24 * 60 * 60;
    try {
        const db = await (0, createDbAccess_1.default)();
        // upload image to supabase storage
        const { error } = await db.storage.from('images').upload(path, image, {
            contentType: metadata?.type || 'image/jpeg',
            upsert: false
        });
        if (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
        // create iamge url
        const { data: imageUrl, error: urlError } = await db.storage.from('images').createSignedUrl(path, TEN_YEARS);
        if (urlError) {
            console.error('Error creating image url:', urlError);
            throw urlError;
        }
        const finalUrl = imageUrl?.signedUrl;
        // insert image url & metadata to media_images
        const { data: insertedImage, error: insertError } = await db
            .from('media_images')
            .insert([
            {
                image_url: finalUrl,
                metadata: metadata,
                article_id: metadata.article_id
            }
        ])
            .select()
            .single();
        if (insertError) {
            console.error('Error inserting image:', insertError);
            throw insertError;
        }
        // return image url
        return finalUrl;
    }
    catch (error) {
        throw new Error('Error uploading image: ' + error);
    }
}
