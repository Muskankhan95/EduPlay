import { TargetBlasterQuestion } from '../models/index.js';

export const getTargetBlasterData = async (req, res, next) => {
  try {
    const questions = await TargetBlasterQuestion.find().sort({ id: 1 });
    res.json({
      success: true,
      config: {
        defaultTimerSeconds: 20,
        maxLives: 3,
        scorePerCorrect: 20,
        completionXP: 100,
        perfectComboBonusXP: 25,
      },
      questions,
    });
  } catch (err) {
    next(err);
  }
};
