import express from "express";

// services
import { createAutomaticNews } from "./automatic_news.services";

const router = express.Router();

router.post("/create-automatic-news", async (req: express.Request, res: express.Response) => {
    try {
        const result = await createAutomaticNews();
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;