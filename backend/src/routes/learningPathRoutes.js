import express from 'express';
import { getLearningPaths } from '../controllers/learningPathController.js';

const router = express.Router();

router.get('/', getLearningPaths);

export default router;
