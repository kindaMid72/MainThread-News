"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// utils
// services
const public_services_1 = require("./public.services");
const router = express_1.default.Router();
router.get("/get-main-page-content", async (req, res) => {
    try {
        /**
         1. latest news (right top): fetch 5 latest published articles,
         - view all: open all article
         2. headline(middle top): show latest headline (just one)
         3. breaking news(left top): fetch 2 breaking news
         4. categories: fetch 5 for each category
         */
        // call services
        const { latestNews, headline, breakingNews, categories } = await (0, public_services_1.getMainPageContentService)();
        // return response
        return res.status(200).json({
            latestNews,
            headline,
            breakingNews,
            categories
        });
    }
    catch (error) {
        console.log('error from public controller /get-main-page-content: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/get-article-content/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const article = await (0, public_services_1.getArticleContentService)(slug);
        return res.status(200).json(article);
    }
    catch (error) {
        console.log('error from public controller /get-article-content: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/get-category-articles/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const articles = await (0, public_services_1.getCategoryArticlesService)(categoryId);
        return res.status(200).json(articles);
    }
    catch (error) {
        console.log('error from public controller /get-category-articles: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/get-all-articles', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const result = await (0, public_services_1.getAllArticlesService)(page, limit);
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('error from public controller /get-all-articles: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/get-all-categories/:categorySlug', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const category_slug = req.params.categorySlug;
        console.log('category_slug: ', category_slug);
        const categories = await (0, public_services_1.getAllCategoriesService)(page, limit, category_slug);
        return res.status(200).json(categories);
    }
    catch (error) {
        console.log('error from public controller /get-all-categories: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const articles = await (0, public_services_1.searchArticlesService)({ query, page, limit });
        return res.status(200).json(articles);
    }
    catch (error) {
        console.log('error from public controller /search: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.post('/forgot-password/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await (0, public_services_1.forgotPasswordService)({ email });
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('error from public controller /forgot-password: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }
        const result = await (0, public_services_1.resetPasswordService)({ token, password });
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('error from public controller /reset-password: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = router;
