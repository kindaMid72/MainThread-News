import express from 'express';

const router = express.Router();

// import controllers
import teamsControllers from '../../modules/teams/teams.controllers';
import categoriesControllers from '../../modules/categories/categories.controllers';
import tagsControllers from '../../modules/tags/tags.controllers';
import articlesControllers from '../../modules/articles/articles.controllers';

// this is all entry point for teams, restricted to super admin and admin

router.use('/teams', teamsControllers); // all entry point for teams
router.use('/categories', categoriesControllers); // all entry point for categories
router.use('/tags', tagsControllers); // all entry point for tags
router.use('/articles', articlesControllers);

export default router; 