"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainPageContent = getMainPageContent;
exports.getCategoriesArticles = getCategoriesArticles;
exports.getArticleContent = getArticleContent;
exports.getAllArticles = getAllArticles;
exports.searchArticles = searchArticles;
exports.checkUserExist = checkUserExist;
exports.storeResetPasswordToken = storeResetPasswordToken;
exports.verifyResetToken = verifyResetToken;
exports.invalidateToken = invalidateToken;
exports.updateUserPassword = updateUserPassword;
const createDbAccess_1 = __importDefault(require("../../config/database/createDbAccess"));
const createRedisAccess_1 = __importDefault(require("../../config/redis/createRedisAccess"));
//const 
const const_redis_1 = require("../../const/const.redis");
async function getMainPageContent() {
    try {
        /**
         1. latest news (right top): fetch 5 latest published articles,
        - view all: open all article
        2. headline(middle top): show latest headline (just one)
        3. breaking news(left top): fetch 2 breaking news
        4. categories: fetch 5 for each category
        */
        // create db access
        const db = await (0, createDbAccess_1.default)();
        let { data: latestNews, error: latestNewsError } = await db.from('articles').select('id, title, slug, excerpt, thumbnail_url, category_id, author_id, status, source_type, source_ref, view_count, is_breaking, is_headline, published_at, updated_at, created_at').order('published_at', { ascending: false }).eq('status', 'published').limit(5);
        let { data: headline, error: headlineError } = await db.from('articles').select('id, title, slug, content_html, excerpt, thumbnail_url, category_id, author_id, status, source_type, source_ref, view_count, is_breaking, is_headline, published_at, updated_at, created_at').order('published_at', { ascending: false }).eq('is_headline', true).eq('status', 'published').limit(1);
        let { data: breakingNews, error: breakingNewsError } = await db.from('articles').select('id, title, slug, excerpt, thumbnail_url, category_id, author_id, status, source_type, source_ref, view_count, is_breaking, is_headline, published_at, updated_at, created_at').order('published_at', { ascending: false }).eq('is_breaking', true).eq('status', 'published').limit(2);
        let { data: categories, error: categoriesError } = await db.from('categories').select('id, name, slug').order('created_at', { ascending: false }).eq('is_active', true).limit(5);
        // get user
        // assign article to user
        if (headline) {
            const { data: users, error: usersError } = await db.from('users_access').select('user_id, name').eq('user_id', headline[0].author_id);
            if (users && users.length > 0) {
                headline.forEach((article) => {
                    article.author_id = users.find((user) => user.user_id === article.author_id)?.name;
                });
            }
            else {
                headline.forEach((article) => {
                    article.author_id = 'Unknown';
                });
            }
        }
        if (latestNewsError || headlineError || breakingNewsError || categoriesError) {
            console.log('error from public repository getMainPageContent: ', latestNewsError, headlineError, breakingNewsError, categoriesError);
            throw latestNewsError || headlineError || breakingNewsError || categoriesError;
        }
        // TODO: implement redis cache for this function and assign key to it
        return {
            latestNews: latestNews,
            headline: headline,
            breakingNews: breakingNews,
            categories: categories
        };
    }
    catch (error) {
        throw error;
    }
}
async function getCategoriesArticles(categoryId) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const { data: articles, error: articlesError } = await db.from('articles').select('*').order('published_at', { ascending: false }).eq('category_id', categoryId).eq('status', 'published').limit(5);
        if (articlesError) {
            console.log('error from public repository getCategoriesArticles: ', articlesError);
            throw articlesError;
        }
        return articles;
    }
    catch (error) {
        throw error;
    }
}
async function getArticleContent(slug) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const redisKey = const_redis_1.REDIS_KEY.ARTICLES(slug);
        const cachedArticle = await createRedisAccess_1.default.get(redisKey);
        if (cachedArticle) {
            // increment views
            const { data: viewCount, error: viewCountError } = await db.from('articles').select('view_count').eq('slug', slug).single();
            if (viewCount) {
                const { data: views, error: viewsError } = await db.from('articles').update({ view_count: viewCount.view_count + 1 }).eq('slug', slug).select('*');
            }
            return cachedArticle;
        }
        let { data: article, error: articleError } = await db.from('articles').select('*').eq('slug', slug).eq('status', 'published').single();
        // increment views
        const { data: views, error: viewsError } = await db.from('articles').update({ view_count: article.view_count + 1 }).eq('slug', slug).select('*');
        // get name of author
        const { data: users, error: usersError } = await db.from('users_access').select('user_id, name').eq('user_id', article.author_id);
        article.author_id = users?.find((user) => user.user_id === article.author_id)?.name;
        if (articleError) {
            console.log('error from public repository getArticleContent: ', articleError);
            throw articleError;
        }
        // set redis
        const newArticleKey = const_redis_1.REDIS_KEY.ARTICLES(article.slug);
        await createRedisAccess_1.default.set(newArticleKey, article);
        return article;
    }
    catch (error) {
        throw error;
    }
}
async function getAllArticles(page, limit, category_slug) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        if (category_slug) {
            // get id based on category name
            const { data: category_id, error: categoryError } = await db.from('categories').select('id').eq('slug', category_slug).single();
            if (categoryError) {
                console.log('error from public repository getAllArticles: ', categoryError);
                throw categoryError;
            }
            const { data: articles, count, error } = await db
                .from('articles')
                .select('*', { count: 'exact' })
                .eq('status', 'published')
                .eq('category_id', category_id.id)
                .order('published_at', { ascending: false })
                .range(from, to);
            // get name of the author
            if (articles) {
                const { data: users, error: usersError } = await db.from('users_access').select('user_id, name').in('user_id', articles.map(a => a.author_id));
                articles.forEach(article => {
                    article.author_id = users?.find((user) => user.user_id === article.author_id)?.name;
                });
            }
            if (error) {
                console.log('error from public repository getAllArticles: ', error);
                throw error;
            }
            return { articles, count };
        }
        const { data: articles, count, error } = await db
            .from('articles')
            .select('*', { count: 'exact' })
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .range(from, to);
        if (error) {
            console.log('error from public repository getAllArticles: ', error);
            throw error;
        }
        // map author names if possible, but for list view speed might be key. 
        // Let's map it for better UX as we have the code pattern.
        if (articles && articles.length > 0) {
            const { data: users } = await db.from('users_access').select('user_id, name').in('user_id', articles.map(a => a.author_id));
            articles.forEach(article => {
                article.author_id = users?.find(u => u.user_id === article.author_id)?.name || article.author_id;
            });
        }
        return { articles, count };
    }
    catch (error) {
        throw error;
    }
}
async function searchArticles({ query, page, limit }) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        let { data: articles, error: articlesError } = await db.from('articles').select('id, title, published_at, slug, author_id, thumbnail_url').eq('status', 'published').ilike('title', `%${query}%`).range(from, to);
        // get name of author
        if (articles) {
            const { data: users, error: usersError } = await db.from('users_access').select('user_id, name').in('user_id', articles?.map(a => a.author_id));
            articles?.forEach(article => {
                article.author_id = users?.find((user) => user.user_id === article.author_id)?.name;
            });
        }
        if (articlesError) {
            console.log('error from public repository searchArticles: ', articlesError);
            throw articlesError;
        }
        return articles;
    }
    catch (error) {
        throw error;
    }
}
async function checkUserExist(email) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const { data: user, error: userError } = await db.from('users_access').select('id, role, email').eq('email', email).single();
        if (userError) {
            console.log('error from public repository checkUserExist: ', userError);
            throw userError;
        }
        return user;
    }
    catch (error) {
        throw error;
    }
}
async function storeResetPasswordToken({ email, token_hash, expiredAt, role }) {
    try {
        // store token in tabel user_invites
        const db = await (0, createDbAccess_1.default)();
        const { data, error } = await db.from('user_invites').insert({
            email: email,
            role: role,
            status: 'pending',
            token_hash: token_hash,
            expires_at: expiredAt
        });
        if (error) {
            console.log('error from public repository storeResetPasswordToken: ', error);
            throw error;
        }
        return data;
    }
    catch (error) {
        throw error;
    }
}
async function verifyResetToken(token_hash) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const { data, error } = await db.from('user_invites')
            .select('email')
            .eq('token_hash', token_hash)
            .eq('status', 'pending')
            .gt('expires_at', new Date().toISOString())
            .single();
        if (error) {
            console.log('error from public repository verifyResetToken: ', error);
            throw error;
        }
        return data;
    }
    catch (error) {
        throw error;
    }
}
async function invalidateToken(token_hash) {
    try {
        const db = await (0, createDbAccess_1.default)();
        const { error } = await db.from('user_invites')
            .update({ status: 'expired' })
            .eq('token_hash', token_hash);
        if (error) {
            console.log('error from public repository invalidateToken: ', error);
            throw error;
        }
    }
    catch (error) {
        throw error;
    }
}
async function updateUserPassword(email, password) {
    try {
        const db = await (0, createDbAccess_1.default)();
        // 1. Get user_id from users_access
        const { data: user, error: userError } = await db.from('users_access')
            .select('user_id')
            .eq('email', email)
            .single();
        if (userError || !user) {
            console.log('error from public repository updateUserPassword (get user): ', userError);
            throw new Error("User not found");
        }
        // 2. Update auth user password
        const { error: updateError } = await db.auth.admin.updateUserById(user.user_id, { password: password });
        if (updateError) {
            console.log('error from public repository updateUserPassword (update auth): ', updateError);
            throw updateError;
        }
    }
    catch (error) {
        throw error;
    }
}
