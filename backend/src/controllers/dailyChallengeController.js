import { db } from '../db/jsonDb.js';

export const getDailyChallenge = async (req, res, next) => {
  try {
    const challenges = await db.getAll('dailyChallenges');
    const challenge = challenges[0] || null;
    res.json({ success: true, challenge });
  } catch (err) {
    next(err);
  }
};

export const submitDailyChallenge = async (req, res, next) => {
  try {
    const { optionId } = req.body;
    const userId = (req.user && req.user.id) || 'usr_101';

    const challenges = await db.getAll('dailyChallenges');
    const challenge = challenges[0];
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'No active daily challenge found' });
    }

    const selectedOption = challenge.options.find(opt => opt.id === optionId);
    if (!selectedOption) {
      return res.status(400).json({ success: false, error: 'Invalid option selected' });
    }

    if (selectedOption.correct) {
      // Mark challenge completed
      await db.update('dailyChallenges', challenge.id, { completed: true });

      // Award XP & increment streak
      const user = await db.findById('users', userId);
      let updatedUser = user;
      if (user) {
        const newXP = (user.currentXP || 0) + (challenge.xpReward || 100);
        const newStreak = (user.dailyStreak || 0) + 1;

        let newLevel = user.level || 1;
        let newNextXP = user.nextLevelXP || 4500;
        let leveledUp = false;

        while (newXP >= newNextXP) {
          newLevel += 1;
          newNextXP = Math.floor(newNextXP * 1.35);
          leveledUp = true;
        }

        updatedUser = await db.update('users', userId, {
          currentXP: newXP,
          dailyStreak: newStreak,
          level: newLevel,
          nextLevelXP: newNextXP,
        });

        await db.insert('notifications', {
          userId,
          title: 'Daily Challenge Mastered! 🔥',
          message: `You earned +${challenge.xpReward} XP and your streak is now ${newStreak} days!`,
          time: 'Just now',
          unread: true,
        });
      }

      const { passwordHash: _, ...safeUser } = updatedUser || {};
      return res.json({
        success: true,
        explanation: challenge.explanation,
        xpAwarded: challenge.xpReward,
        user: updatedUser ? safeUser : null,
      });
    } else {
      return res.json({
        success: false,
        explanation: "That's not quite right. Look closely at how the while loop counter increments.",
      });
    }
  } catch (err) {
    next(err);
  }
};
