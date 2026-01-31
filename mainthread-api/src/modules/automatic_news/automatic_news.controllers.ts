import express from "express";

// services
import {createAutomaticNews} from "./automatic_news.services";

const router = express.Router();

router.post("/create-daily-news", async (req: express.Request, res: express.Response) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
        const result = await createAutomaticNews({ title, content });
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;