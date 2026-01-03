import express from 'express';

// middlewares
import articlesMiddlewares from './articles.middlewares';

// services
import {
    createArticleService,
    deleteArticleService,
    getArticleService,
    getArticlesService,
    updateArticleService,
    uploadImageService
} from './articles.services';

// logs
import createLog from '../../logging/log.admin.action';

// utils
import extractIdFromToken from '../../utils/authTools/extracIdFromToken';
import { ArticleQuery, ArticleTag } from './articles.types';

const router = express.Router();

router.use(articlesMiddlewares);

router.post('/create-new-article', async (req, res) => {
    try{
        // req: none
        // res: article id
        // response: {id: string}: ArticleQuery
        const response: ArticleQuery = await createArticleService(req.headers.authorization as string);
        const articleId = response.id;
        // read logs
        createLog({
            adminId : await extractIdFromToken(req.headers.authorization as string) as string,
            action : 'create new article',
            entityId : articleId as string,
            entityType : 'article',
            metadata : {
                articleId : articleId as string
            }
        });
        res.status(201).json({ id:articleId });
    }catch(error){
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
})

router.get('/get-articles-on-given-page', async (req, res) => {
    try{
        // req interface
        interface GetArticlesOnGivenPageRequest {
            cursor: string | null;
            limit: number;
            direction: 'forward' | 'backward';
            category: string | null;
            status: string | null;
            asc: boolean | null;
            search: string;
        }

        // implement pagination back and forward with cursor implementation
        // req: 
        // - cursor: crypted object or null
        // - limit: number
        // - direction: 'forward' or 'backward'
        // - category: all or specific category
        // - status: all or specific status

        // response: {articles: ArticleQuery[]}: ArticleQuery, cursor: crypted object, hasPrev: boolean, hasNext: boolean

        // check input
        const reqParams : GetArticlesOnGivenPageRequest = {
            cursor: req.query.cursor as string || null,
            limit: Number(req.query.limit) as number || 5,
            direction: req.query.direction as 'forward' | 'backward' || null,
            category: req.query.category as string || null,
            status: req.query.status as string || null,
            asc: req.query.asc === 'true',
            search: req.query.search as string || '',
        };

        // call service, return [ArticleQuery], cursor(encoded): string
        const getArticlesServiceResponse = await getArticlesService(reqParams);

        // return response
        res.status(200).json({ articles: getArticlesServiceResponse.articles, cursor: getArticlesServiceResponse.cursor, hasPrev: getArticlesServiceResponse.hasPrev, hasNext: getArticlesServiceResponse.hasNext });
    }catch(error){
        console.error('Error getting articles:', error);
        res.status(500).json({ error: 'Failed to get articles' });
    }
})

router.get('/get-article-by-id/:id', async (req, res) => {
    try{
        // req: 
        // - id: string

        // response: ArticleQuery

        // check input
        const id = req.params.id;
        if(!id){
            return res.status(400).json({ error: 'Missing article id' });
        }

        // call service, return ArticleQuery
        const getArticleServiceResponse: {article: ArticleQuery, articleTags: ArticleTag[] } = await getArticleService(id);

        // return response
        res.status(200).json(getArticleServiceResponse);
    }catch(error){
        console.error('Error getting article:', error);
        res.status(500).json({ error: 'Failed to get article' });
    }
})

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
        await updateArticleService(id, updates, tag_ids);
        
        createLog({
            adminId: await extractIdFromToken(req.headers.authorization as string) as string,
            action: 'update article',
            entityId: id as string,
            entityType: 'article',
            metadata: {
                articleId: id as string
            }
        });


        res.status(200).json({ message: 'Article updated successfully' });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
})

router.delete('/delete-article-by-id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Missing article id' });
        }

        await deleteArticleService(id);

        // create log
        createLog({
            adminId: await extractIdFromToken(req.headers.authorization as string) as string,
            action: 'delete article',
            entityId: id as string,
            entityType: 'article',
            metadata: {
                articleId: id as string
            }
        });

        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
})

router.post('/upload-image', async (req, res) => {
    try {

        // TODO: config image and its metadata
        const image = req.body.file;
        
        if (!image) {
            return res.status(400).json({ error: 'Missing image,buffer' });
        }

        const imageUrl = await uploadImageService(image);

        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
})


export default router;
