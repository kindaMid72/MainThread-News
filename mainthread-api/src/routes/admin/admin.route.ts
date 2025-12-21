import express from 'express';

const router = express.Router();

// import controllers
import teamsControllers from '../../modules/teams/teams.controllers';

// this is all entry point for teams, restricted to super admin and admin

router.use('/teams', teamsControllers); // all entry point for teams

export default router; 
