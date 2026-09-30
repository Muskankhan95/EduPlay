import express from 'express';
import {
  getAnalyticsOverview,
  getWeeklyActivity,
  getSkillBreakdown,
  getAccuracyHistory
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getAnalyticsOverview);
router.get('/weekly', getWeeklyActivity);
router.get('/skills', getSkillBreakdown);
router.get('/accuracy', getAccuracyHistory);

export default router;
