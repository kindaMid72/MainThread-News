import express from 'express';

// middlewares
import articlesMiddlewares from './articles.middlewares';

// services


const router = express.Router();

router.use(articlesMiddlewares);
