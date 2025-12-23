import express from 'express'

// middlewares
import categoriesMiddlewares from './categories.middlewares';

// services
import { getAllCategoriesService, addCategoryService } from './categories.services';

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

router.post('/add-category', async (req, res) => {
    try {
        
        const { name, description, isActive } = req.body;
        // check input
        if(!name) return res.status(400).json({ message: 'Name is required' });
        if(name.length < 3) return res.status(400).json({ message: 'Name must be at least 3 characters long' });
        const newCategory: Categories = {
            name,
            description,
            isActive
        };
        const category : boolean = await addCategoryService(newCategory);   
        if(!category) return res.status(400).json({ message: 'Category already exists' });
        return res.status(200).json({ message: 'Category added successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
} )

router.put('update-category', async (req, res) => {
    try {
        
    } catch (error) {
        
    }
})

export default router;