import express from 'express';
import { getAllBadges, unlockBadge } from '../controllers/badgeController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBadges);
router.post('/:id/unlock', optionalAuthenticate, unlockBadge);

export default router;
