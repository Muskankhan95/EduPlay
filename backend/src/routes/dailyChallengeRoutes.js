import express from 'express';
import { getDailyChallenge, submitDailyChallenge } from '../controllers/dailyChallengeController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDailyChallenge);
router.post('/submit', optionalAuthenticate, submitDailyChallenge);

export default router;
