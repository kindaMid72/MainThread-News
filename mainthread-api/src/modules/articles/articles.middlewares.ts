import checkUserAccess from "../../middlewares/auth/checkUserAccess";
import express from "express";

export default async function articlesMiddlewares(req: express.Request, res: express.Response, next: express.NextFunction) {
    // admin superadmin only access, forbid the request if user is not admin or superadmin
    const userHasAccess: boolean = await checkUserAccess(req.headers.authorization as string);
    if (!userHasAccess) return res.status(401).json({ message: 'Unauthorized' }); // return 401 if user is not admin or superadmin, do not proceed
    next(); // next middlewares or pass to controllers
}