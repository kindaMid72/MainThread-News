import express from 'express'

// middlewares
import categoriesMiddlewares from './categories.middlewares';

// services
import { getAllCategoriesService } from './categories.services';

// types
import {
    Categories,
    CategoriesQuery
} from './categories.types';

const router = express.Router();

router.use(categoriesMiddlewares);

router.get('/get-all-categories', async (req, res) => {
    try {
        const categories : CategoriesQuery[] = await getAllCategoriesService();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
} )

export default router;