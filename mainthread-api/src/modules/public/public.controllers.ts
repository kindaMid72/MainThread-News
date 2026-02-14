import express from "express";

// types
import { ArticleQuery } from "./public.types";

// utils

// services
import { forgotPasswordService, getAllArticlesService, getAllCategoriesService, getArticleContentService, getCategoryArticlesService, getMainPageContentService, incrementViewsService, resetPasswordService, searchArticlesService } from "./public.services";

const router = express.Router();

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
        const { latestNews, headline, breakingNews, categories } = await getMainPageContentService() as { latestNews: ArticleQuery[], headline: ArticleQuery[], breakingNews: ArticleQuery[], categories: any[] };

        // return response
        return res.status(200).json({
            latestNews,
            headline,
            breakingNews,
            categories
        });

    } catch (error) {
        console.log('error from public controller /get-main-page-content: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/get-article-content/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const article = await getArticleContentService(slug);

        return res.status(200).json(article);
    } catch (error) {
        console.log('error from public controller /get-article-content: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get('/get-category-articles/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const articles = await getCategoryArticlesService(categoryId);
        return res.status(200).json(articles);
    } catch (error) {
        console.log('error from public controller /get-category-articles: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/get-all-articles', async (req, res) => { // TODO: implement pagination with cursor (this on still use page and limit)
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await getAllArticlesService(page, limit);
        return res.status(200).json(result);
    } catch (error) {
        console.log('error from public controller /get-all-articles: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/get-all-categories/:categorySlug', async (req, res) => {
    try {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const category_slug = req.params.categorySlug as string;
        console.log('category_slug: ', category_slug);

        const categories = await getAllCategoriesService(page, limit, category_slug);
        return res.status(200).json(categories);
    } catch (error) {
        console.log('error from public controller /get-all-categories: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/search', async (req, res) => {
    try {
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const articles = await searchArticlesService({query, page, limit});
        return res.status(200).json(articles);
    } catch (error) {
        console.log('error from public controller /search: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post('/forgot-password/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await forgotPasswordService({email});
        return res.status(200).json(result);
    } catch (error) {
        console.log('error from public controller /forgot-password: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }
        const result = await resetPasswordService({ token, password });
        return res.status(200).json(result);
    } catch (error) {
        console.log('error from public controller /reset-password: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/increment-views/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await incrementViewsService(slug);
        return res.status(200).json(result);
    } catch (error) {
        console.log('error from public controller /increment-views: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

export default router;
