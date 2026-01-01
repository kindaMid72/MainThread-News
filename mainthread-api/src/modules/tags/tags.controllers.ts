import express from 'express';

import tagsMiddlewares from './tags.middlewares';

import { getAllTagsService, addNewTagService, updateTagService, deleteTagService } from './tags.services';

// utils 
import extractIdFromToken from '../../utils/authTools/extracIdFromToken';

// logging
import logAdminAction from '../../logging/log.admin.action';

const router = express.Router();

router.use(tagsMiddlewares);

router.get('/get-all-tags', async (req, res) => {
    try {
        const tags = await getAllTagsService();
        return res.status(200).json(tags);
    } catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
})

router.post('/add-new-tag', async (req, res) => {
    try {
        const { name } = req.body;
        // check name
        if (!name) return res.status(400).json({ message: 'Name is required' });
        const tag = await addNewTagService({ name });
        if (!tag) return res.status(400).json({ message: 'tag already exists' });
        const adminId = await extractIdFromToken(req.headers.authorization as string);

        await logAdminAction({
            adminId: adminId as string,
            action: 'add tag',
            entityId: name,
            entityType: 'tag',
            metadata: { name }
        });
        return res.status(200).json({message: 'Tag added successfully'});
        
    } catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
})

router.put('/update-tag', async (req, res) => {
    try {
        const { id, name } = req.body;
        // check name
        if (!name) return res.status(400).json({ message: 'Name is required' });
        const tag: boolean = await updateTagService({ id, name });
        if (!tag) return res.status(400).json({ message: 'tag not found or already exist' });

        // logging
        const adminId = await extractIdFromToken(req.headers.authorization as string);

        await logAdminAction({
            adminId: adminId as string,
            action: 'update tag',
            entityId: name,
            entityType: 'tag',
            metadata: { name }
        });

        return res.status(200).json(tag);
    } catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
})

router.delete('/delete-tag/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // check id
        if (!id) return res.status(400).json({ message: 'Id is required' });
        const tag: boolean = await deleteTagService({ id });
        if (!tag) return res.status(400).json({ message: 'tag not found' });

        // logging
        const adminId = await extractIdFromToken(req.headers.authorization as string);

        await logAdminAction({
            adminId: adminId as string,
            action: 'delete tag',
            entityId: id,
            entityType: 'tag',
            metadata: { id }
        });

        return res.status(200).json(tag);
    } catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
})

export default router;