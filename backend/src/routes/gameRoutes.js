import express from 'express';
import { getTargetBlasterData } from '../controllers/gameController.js';

const router = express.Router();

router.get('/target-blaster', getTargetBlasterData);

export default router;
