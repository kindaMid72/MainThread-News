import express from 'express';

// middlewares
import articlesMiddlewares from './articles.middlewares';

// services
import { createArticleService, getArticlesService } from './articles.services';

// logs
import createLog from '../../logging/log.admin.action';

// utils
import extractIdFromToken from '../../utils/authTools/extracIdFromToken';
import { ArticleQuery } from './articles.types';

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

        // TODO: implement pagination back and forward with cursor implementation
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




export default router;
