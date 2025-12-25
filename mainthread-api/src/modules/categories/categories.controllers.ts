import express from 'express'

// middlewares
import categoriesMiddlewares from './categories.middlewares';

// services
import { getAllCategoriesService, addCategoryService, updateCategoryService, deleteCategoryService } from './categories.services';

// logging
import logAdminAction from '../../logging/log.admin.action';
import extractIdFromToken from '../../utils/authTools/extracIdFromToken';

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
        
        const adminId = await extractIdFromToken(req.headers.authorization as string);

        await logAdminAction({
            adminId: adminId as string,
            action: 'add category',
            entityId: name,
            entityType: 'category',
            metadata: { name }
        });
        return res.status(200).json({ message: 'Category added successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
} )

router.put('/update-category/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description, isActive} = req.body;
        // check input
        if(!id) return res.status(400).json({ message: 'Id is required' });
        if(!name) return res.status(400).json({ message: 'Name is required' });
        if(name.length < 3) return res.status(400).json({ message: 'Name must be at least 3 characters long' });
        const updatedCategory: Categories = {
            id,
            name,
            description,
            isActive
        };
        const updateResult : boolean = await updateCategoryService(updatedCategory);   
        if(!updateResult) return res.status(400).json({ message: 'Category already exists' });
        
        const adminId = await extractIdFromToken(req.headers.authorization as string);

        await logAdminAction({
            adminId: adminId as string,
            action: 'update category',
            entityId: id,
            entityType: 'category',
            metadata: { name }
        });
        return res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.delete('/delete-category/:id', async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({ message: 'Id is required' });
        const deleteResult : boolean = await deleteCategoryService({id});   
        if(!deleteResult) return res.status(400).json({ message: 'Category not found' });
        
        const adminId = await extractIdFromToken(req.headers.authorization as string);

        await logAdminAction({
            adminId: adminId as string,
            action: 'delete category',
            entityId: id,
            entityType: 'category',
            metadata: { id }
        });
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

export default router;