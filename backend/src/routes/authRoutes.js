import express from 'express';
import { register, login, demoLogin, forgotPassword, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/forgot-password', forgotPassword);
router.get('/me', authenticate, getMe);

export default router;
