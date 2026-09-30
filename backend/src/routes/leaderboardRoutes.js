import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getLeaderboard);

export default router;
