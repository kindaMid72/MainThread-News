import express from "express";

// services
import { createAutomaticNews } from "./automatic_news.services";

// logs
import logAdminAction from "../../logging/log.admin.action";
// utils
import extractIdFromToken from "../../utils/authTools/extracIdFromToken";
const router = express.Router();

router.post("/create-automatic-news", async (req: express.Request, res: express.Response) => {
    try {
        const result = await createAutomaticNews();

        const adminId :string = await extractIdFromToken(req.headers.authorization);
        await logAdminAction({
            adminId: adminId,
            action: 'create-automatic-news',
            entityId: result.id,
            entityType: 'automatic_news',
            metadata: {
                article_id: result.id,
                creation_time: new Date().toISOString(),
                article_creation_type: 'automatic'
            }
        });

        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;