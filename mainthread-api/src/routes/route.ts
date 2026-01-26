import express from 'express';

// import admin & public entry point
import subscribeRoute from '../modules/subscribe/subscribe.controllers';
import adminRoute from './admin/admin.route';
import publicRoute from './public/public.route';

const router = express.Router();

// admin entry point
router.use('/admin', adminRoute);

// public entry point
router.use('/public', publicRoute);

// subscribe entry point
router.use('/', subscribeRoute);

export default router;
