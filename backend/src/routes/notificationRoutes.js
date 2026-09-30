import express from 'express';
import {
  getNotifications,
  markRead,
  markAllRead
} from '../controllers/notificationController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getNotifications);
router.put('/:id/read', optionalAuthenticate, markRead);
router.put('/read-all', optionalAuthenticate, markAllRead);

export default router;
