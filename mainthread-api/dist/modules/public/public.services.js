"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainPageContentService = getMainPageContentService;
exports.getArticleContentService = getArticleContentService;
exports.getCategoryArticlesService = getCategoryArticlesService;
exports.getAllArticlesService = getAllArticlesService;
exports.getAllCategoriesService = getAllCategoriesService;
exports.searchArticlesService = searchArticlesService;
exports.forgotPasswordService = forgotPasswordService;
exports.resetPasswordService = resetPasswordService;
// imports
const polyfill_1 = require("@js-temporal/polyfill");
const hashSHA256_1 = __importDefault(require("../../utils/cryptoTools/hashSHA256"));
const generateRandomToken_1 = __importDefault(require("../../utils/generator/generateRandomToken"));
const public_repositories_1 = require("./public.repositories");
// repositories
const public_repositories_2 = require("./public.repositories");
// emailer
const emailerInstance_1 = __importDefault(require("../../config/emailer/emailerInstance"));
async function getMainPageContentService() {
    try {
        /**
         1. latest news (right top): fetch 5 latest published articles,
         - view all: open all article
         2. headline(middle top): show latest headline (just one)
         3. breaking news(left top): fetch 2 breaking news
         4. categories: fetch 5 for each category
         */
        let { latestNews, headline, breakingNews, categories } = await (0, public_repositories_2.getMainPageContent)();
        // TODO: config author id name (change to author_id to its name), edit select to exclude content_html
        // FIXME: fix date format (why its acting that way)
        // fetch categories articles
        if (categories.length > 0) {
            const categoriesArticles = await Promise.all(categories.map((category) => (0, public_repositories_2.getCategoriesArticles)(category.id)));
            categories.forEach((category, index) => {
                category.articles = categoriesArticles[index];
            });
        }
        return {
            latestNews,
            headline,
            breakingNews,
            categories
        };
    }
    catch (error) {
        console.log('error from public service getMainPageContent: ', error);
    }
}
async function getArticleContentService(slug) {
    try {
        const article = await (0, public_repositories_2.getArticleContent)(slug);
        return article;
    }
    catch (error) {
        console.log('error from public service getArticleContent: ', error);
    }
}
async function getCategoryArticlesService(categoryId) {
    try {
        const articles = await (0, public_repositories_2.getCategoriesArticles)(categoryId);
        return articles;
    }
    catch (error) {
        console.log('error from public service getCategoryArticlesService: ', error);
        throw error;
    }
}
async function getAllArticlesService(page, limit) {
    try {
        const { articles, count } = await (0, public_repositories_2.getAllArticles)(page, limit);
        return { articles, count };
    }
    catch (error) {
        console.log('error from public service getAllArticlesService: ', error);
        throw error;
    }
}
async function getAllCategoriesService(page, limit, category_slug) {
    try {
        if (category_slug) {
            const { articles, count } = await (0, public_repositories_2.getAllArticles)(page, limit, category_slug);
            return { articles, count };
        }
        const { articles, count } = await (0, public_repositories_2.getAllArticles)(page, limit);
        return { articles, count };
    }
    catch (error) {
        console.log('error from public service getAllCategoriesService: ', error);
        throw error;
    }
}
async function searchArticlesService({ query, page, limit }) {
    try {
        const articles = await (0, public_repositories_2.searchArticles)({ query, page, limit });
        return articles;
    }
    catch (error) {
        console.log('error from public service searchArticlesService: ', error);
        throw error;
    }
}
async function forgotPasswordService({ email }) {
    try {
        // check if user exist
        const user = await (0, public_repositories_1.checkUserExist)(email);
        if (!user) {
            throw new Error("User not found");
        }
        // create token and store it with a expire date
        const token = await (0, generateRandomToken_1.default)();
        const token_hash = (0, hashSHA256_1.default)(token);
        const expiredAt = polyfill_1.Temporal.Now.zonedDateTimeISO().add({ hours: 1 }).toString().split('[')[0];
        await (0, public_repositories_1.storeResetPasswordToken)({
            email: user.email,
            token_hash: token_hash,
            expiredAt: expiredAt,
            role: user.role
        });
        // send email with reset password link containt token
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
        await (async function () {
            const { data: sendInvite, error: sendInviteError } = await emailerInstance_1.default.emails.send({
                from: `MainThread.Writers <no-reply@${process.env.DOMAIN_NAME}>`,
                to: [email],
                subject: `Reset Your Password`,
                html: `<p>You requested a password reset.</p><p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour.</p>`,
            });
            if (sendInviteError) {
                throw new Error(sendInviteError.message);
            }
        })();
        // return success
        return true;
    }
    catch (error) {
        console.log('error from public service forgotPasswordService: ', error);
        throw error;
    }
}
async function resetPasswordService({ token, password }) {
    try {
        const token_hash = (0, hashSHA256_1.default)(token);
        // 1. Verify token
        const inviteData = await (0, public_repositories_1.verifyResetToken)(token_hash);
        if (!inviteData || !inviteData.email) {
            throw new Error("Invalid or expired token");
        }
        // 2. Update password
        await (0, public_repositories_1.updateUserPassword)(inviteData.email, password);
        // 3. Invalidate token
        await (0, public_repositories_1.invalidateToken)(token_hash);
        return { message: "Password reset successfully" };
    }
    catch (error) {
        console.log('error from public service resetPasswordService: ', error);
        throw error;
    }
}
