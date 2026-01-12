import express from 'express';

import publicController from '../../modules/public/public.controllers';

const router = express.Router();

router.use('/', publicController);


export default router;