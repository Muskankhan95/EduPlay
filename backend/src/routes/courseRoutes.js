import express from 'express';
import {
  getAllCourses,
  getCourseById,
  completeLesson,
  enrollCourse
} from '../controllers/courseController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/:courseId/lessons/:lessonId/complete', optionalAuthenticate, completeLesson);
router.post('/:id/enroll', optionalAuthenticate, enrollCourse);

export default router;
