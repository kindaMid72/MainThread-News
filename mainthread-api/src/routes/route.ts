import express from 'express';

// import admin & public entry point
import publicRoute from './public/public.route';
import adminRoute from './admin/admin.route';

const router = express.Router();

// admin entry point
router.use('/admin', adminRoute);

// public entry point
router.use('/public', publicRoute);

export default router;
