import express from 'express';
import {
  completeQuiz,
  getAdaptiveRecommendations,
  getQuizHistory
} from '../controllers/quizController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/complete', optionalAuthenticate, completeQuiz);
router.get('/adaptive-recommendations', optionalAuthenticate, getAdaptiveRecommendations);
router.get('/history', optionalAuthenticate, getQuizHistory);

export default router;
