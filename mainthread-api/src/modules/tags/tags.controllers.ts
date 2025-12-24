import express from 'express';

import tagsMiddlewares from './tags.middlewares';

import { getAllTagsService, addNewTagService } from './tags.services';

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
        return res.status(200).json(tag);
    } catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
})





export default router;