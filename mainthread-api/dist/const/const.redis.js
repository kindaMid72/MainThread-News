"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_KEY = void 0;
exports.REDIS_KEY = {
    USERS_ACCESS: 'users_access',
    ADMIN_ID: (userId) => `admin_id:${userId}`,
    USER_ID: (userId) => `user_id:${userId}`,
    CATEGORIES: 'categories',
    TAGS: 'tags',
    ARTICLES: (articleId) => `article:${articleId}`,
    ARTICLES_TAGS: (articleId) => `article_tags:${articleId}`,
};
