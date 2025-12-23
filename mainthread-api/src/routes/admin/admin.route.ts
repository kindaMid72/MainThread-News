import express from 'express';

const router = express.Router();

// import controllers
import teamsControllers from '../../modules/teams/teams.controllers';
import categoriesControllers from '../../modules/categories/categories.controllers';

// this is all entry point for teams, restricted to super admin and admin

router.use('/teams', teamsControllers); // all entry point for teams
router.use('/categories', categoriesControllers); // all entry point for categories

export default router; 
