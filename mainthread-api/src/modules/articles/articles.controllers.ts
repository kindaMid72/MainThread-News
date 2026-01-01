import express from 'express';

// middlewares
import articlesMiddlewares from './articles.middlewares';

// services
import { createArticleService } from './articles.services';

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




export default router;
