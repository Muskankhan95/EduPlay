import { LearningPath } from '../models/index.js';

export const getLearningPaths = async (req, res, next) => {
  try {
    const paths = await LearningPath.find();
    res.json({
      success: true,
      learningPaths: paths,
    });
  } catch (err) {
    next(err);
  }
};
