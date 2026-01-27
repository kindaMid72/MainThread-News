"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
// middlewares
const articles_middlewares_1 = __importDefault(require("./articles.middlewares"));
// services
const articles_services_1 = require("./articles.services");
// logs
const log_admin_action_1 = __importDefault(require("../../logging/log.admin.action"));
// utils
const extracIdFromToken_1 = __importDefault(require("../../utils/authTools/extracIdFromToken"));
const router = express_1.default.Router();
// multer setup
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.use(articles_middlewares_1.default);
router.post('/create-new-article', async (req, res) => {
    try {
        // req: none
        // res: article id
        // response: {id: string}: ArticleQuery
        const response = await (0, articles_services_1.createArticleService)(req.headers.authorization);
        const articleId = response.id;
        // read logs
        (0, log_admin_action_1.default)({
            adminId: await (0, extracIdFromToken_1.default)(req.headers.authorization),
            action: 'create new article',
            entityId: articleId,
            entityType: 'article',
            metadata: {
                articleId: articleId
            }
        });
        res.status(201).json({ id: articleId });
    }
    catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
});
router.get('/get-articles-on-given-page', async (req, res) => {
    try {
        // implement pagination back and forward with cursor implementation
        // req: 
        // - cursor: crypted object or null
        // - limit: number
        // - direction: 'forward' or 'backward'
        // - category: all or specific category
        // - status: all or specific status
        // response: {articles: ArticleQuery[]}: ArticleQuery, cursor: crypted object, hasPrev: boolean, hasNext: boolean
        // check input
        const reqParams = {
            cursor: req.query.cursor || null,
            limit: Number(req.query.limit) || 5,
            direction: req.query.direction || null,
            category: req.query.category || null,
            status: req.query.status || null,
            asc: req.query.asc === 'true',
            search: req.query.search || '',
        };
        // call service, return [ArticleQuery], cursor(encoded): string
        const getArticlesServiceResponse = await (0, articles_services_1.getArticlesService)(reqParams);
        // return response
        res.status(200).json({ articles: getArticlesServiceResponse.articles, cursor: getArticlesServiceResponse.cursor, hasPrev: getArticlesServiceResponse.hasPrev, hasNext: getArticlesServiceResponse.hasNext });
    }
    catch (error) {
        console.error('Error getting articles:', error);
        res.status(500).json({ error: 'Failed to get articles' });
    }
});
router.get('/get-article-by-id/:id', async (req, res) => {
    try {
        // req: 
        // - id: string
        // response: ArticleQuery
        // check input
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Missing article id' });
        }
        // call service, return ArticleQuery
        const getArticleServiceResponse = await (0, articles_services_1.getArticleService)(id);
        // return response
        res.status(200).json(getArticleServiceResponse);
    }
    catch (error) {
        console.error('Error getting article:', error);
        res.status(500).json({ error: 'Failed to get article' });
    }
});
router.put('/update-article-by-id/:id', async (req, res) => {
    try {
        // req:
        // - id: string
        // - updates: Partial<ArticleQuery>
        // - tag_ids?: string[]
        const { id, tag_ids, ...updates } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Missing article id' });
        }
        // create log
        await (0, articles_services_1.updateArticleService)(id, updates, tag_ids);
        (0, log_admin_action_1.default)({
            adminId: await (0, extracIdFromToken_1.default)(req.headers.authorization),
            action: 'update article',
            entityId: id,
            entityType: 'article',
            metadata: {
                articleId: id
            }
        });
        res.status(200).json({ message: 'Article updated successfully' });
    }
    catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
});
router.delete('/delete-article-by-id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Missing article id' });
        }
        await (0, articles_services_1.deleteArticleService)(id);
        // create log
        (0, log_admin_action_1.default)({
            adminId: await (0, extracIdFromToken_1.default)(req.headers.authorization),
            action: 'delete article',
            entityId: id,
            entityType: 'article',
            metadata: {
                articleId: id
            }
        });
        res.status(200).json({ message: 'Article deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});
router.post('/upload-image/:articleId', upload.single('file'), async (req, res) => {
    try {
        // TODO: config image and its metadata
        const image = req.file;
        const articleId = req.params.articleId;
        if (!image) {
            return res.status(400).json({ error: 'Missing image,buffer' });
        }
        const imageUrl = await (0, articles_services_1.uploadImageService)(image, articleId);
        // create log
        (0, log_admin_action_1.default)({
            adminId: await (0, extracIdFromToken_1.default)(req.headers.authorization),
            action: 'upload image',
            entityId: imageUrl,
            entityType: 'image',
            metadata: {
                imageUrl: imageUrl,
                articleId: articleId
            }
        });
        res.status(200).json({ imageUrl });
    }
    catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
exports.default = router;
