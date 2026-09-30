import { QuizResult, User, Notification } from '../models/index.js';

export const completeQuiz = async (req, res, next) => {
  try {
    const payload = req.body;
    const userId = payload.userId || (req.user && req.user.id) || 'usr_101';

    const record = await QuizResult.create({
      id: `quiz_res_${Date.now()}`,
      userId,
      quizId: payload.quizId || 'target-blaster-1',
      score: payload.score || 0,
      accuracy: payload.accuracy || 0,
      xpEarned: payload.xpEarned || 0,
      timeTaken: payload.timeTaken || 0,
      correctAnswers: payload.correctAnswers || 0,
      wrongAnswers: payload.wrongAnswers || 0,
      maxCombo: payload.maxCombo || 1,
      completedAt: new Date().toISOString(),
      topicStats: payload.topicStats || {},
    });

    // Persist quiz accuracy and award completion XP when XP was not already awarded
    const user = await User.findOne({ id: userId });
    if (user) {
      const updates = {
        quizAccuracy: Math.round(((user.quizAccuracy || 90) + (payload.accuracy || 0)) / 2),
      };
      let leveledUp = false;

      if (!payload.xpAwardedIncrementally && payload.xpEarned > 0) {
        let newXP = (user.currentXP || 0) + payload.xpEarned;
        let newLevel = user.level || 1;
        let newNextXP = user.nextLevelXP || 4500;

        while (newXP >= newNextXP) {
          newLevel += 1;
          newNextXP = Math.floor(newNextXP * 1.35);
          leveledUp = true;
        }

        Object.assign(updates, {
          currentXP: newXP,
          level: newLevel,
          nextLevelXP: newNextXP,
        });

        if (leveledUp) {
          await Notification.create({
            id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            userId,
            title: `Level Up! Reached Level ${newLevel} 🚀`,
            message: `Congratulations! You unlocked new skill paths and reached Level ${newLevel}!`,
            time: 'Just now',
            unread: true,
          });
        }
      }

      await User.findOneAndUpdate({ id: userId }, { $set: updates }, { returnDocument: 'after' });
    }

    // Adaptive Recommendation Calculation
    const allResults = await QuizResult.find({ userId });
    const existingAdaptive = allResults.reduce((acc, curr) => {
      if (curr.topicStats) {
        Object.entries(curr.topicStats).forEach(([topic, stats]) => {
          if (!acc[topic]) acc[topic] = { correct: 0, total: 0, accuracy: 100 };
          acc[topic].correct += stats.correct || 0;
          acc[topic].total += stats.total || 0;
          acc[topic].accuracy = Math.round((acc[topic].correct / (acc[topic].total || 1)) * 100);
        });
      }
      return acc;
    }, {
      "Arrays": { correct: 9, total: 10, accuracy: 90 },
      "Stacks": { correct: 7, total: 8, accuracy: 88 },
      "Queues": { correct: 3, total: 6, accuracy: 50 },
      "Hash Tables": { correct: 5, total: 5, accuracy: 100 },
    });

    let weakestTopic = null;
    let lowestAcc = 100;
    Object.entries(existingAdaptive).forEach(([topic, stats]) => {
      if (stats.accuracy < lowestAcc && stats.total >= 1) {
        lowestAcc = stats.accuracy;
        weakestTopic = topic;
      }
    });

    const adaptiveRecommendation = weakestTopic && lowestAcc < 70
      ? {
          topic: weakestTopic,
          accuracy: lowestAcc,
          title: `🎯 ${weakestTopic} Target Challenge`,
          message: `Practice ${weakestTopic} concepts to boost your mastery from ${lowestAcc}% to 90%+!`,
        }
      : {
          topic: "Data Structures",
          accuracy: 88,
          title: "🎯 Speed Blaster Challenge",
          message: "Outstanding precision! Test your reflexes in Speed Round.",
        };

    res.json({
      status: 200,
      success: true,
      message: "Quiz results recorded successfully",
      data: record,
      adaptiveRecommendation,
    });
  } catch (err) {
    next(err);
  }
};

export const getAdaptiveRecommendations = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const results = await QuizResult.find({ userId });

    const topicBreakdown = {
      "Arrays": { accuracy: 90, total: 10 },
      "Stacks": { accuracy: 85, total: 8 },
      "Queues": { accuracy: 45, total: 6 },
      "Hash Tables": { accuracy: 92, total: 5 },
    };

    results.forEach(r => {
      if (r.topicStats) {
        Object.entries(r.topicStats).forEach(([topic, stats]) => {
          if (!topicBreakdown[topic]) {
            topicBreakdown[topic] = { accuracy: stats.accuracy || 100, total: stats.total || 1 };
          } else {
            topicBreakdown[topic].total += stats.total || 0;
            topicBreakdown[topic].accuracy = Math.round(
              (topicBreakdown[topic].accuracy + (stats.accuracy || 100)) / 2
            );
          }
        });
      }
    });

    let weakest = "Queues";
    let lowest = 100;
    Object.entries(topicBreakdown).forEach(([topic, stats]) => {
      const acc = stats.accuracy;
      if (acc < lowest) {
        lowest = acc;
        weakest = topic;
      }
    });

    res.json({
      success: true,
      topicBreakdown,
      recommendedChallenge: {
        topic: weakest,
        accuracy: lowest,
        title: `🎯 ${weakest} Target Challenge`,
        message: `Practice ${weakest} concepts to reinforce your foundational understanding.`,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getQuizHistory = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const userResults = await QuizResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      history: userResults,
    });
  } catch (err) {
    next(err);
  }
};
