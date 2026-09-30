import { db } from '../db/jsonDb.js';

export const getLearningPaths = async (req, res, next) => {
  try {
    const paths = await db.getAll('learningPaths');
    res.json({
      success: true,
      learningPaths: paths,
    });
  } catch (err) {
    next(err);
  }
};
