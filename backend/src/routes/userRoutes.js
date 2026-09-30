import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  addXP,
  incrementStreak,
  resetDemoData
} from '../controllers/userController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile/:id?', optionalAuthenticate, getProfile);
router.put('/profile', optionalAuthenticate, updateProfile);
router.put('/preferences', optionalAuthenticate, updatePreferences);
router.post('/add-xp', optionalAuthenticate, addXP);
router.post('/streak', optionalAuthenticate, incrementStreak);
router.post('/reset-demo', resetDemoData);

export default router;
