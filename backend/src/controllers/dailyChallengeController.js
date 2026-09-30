import { DailyChallenge, User, Notification } from '../models/index.js';

export const getDailyChallenge = async (req, res, next) => {
  try {
    const challenge = await DailyChallenge.findOne();
    res.json({ success: true, challenge });
  } catch (err) {
    next(err);
  }
};

export const submitDailyChallenge = async (req, res, next) => {
  try {
    const { optionId } = req.body;
    const userId = (req.user && req.user.id) || 'usr_101';

    const challenge = await DailyChallenge.findOne();
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'No active daily challenge found' });
    }

    const selectedOption = challenge.options.find(opt => opt.id === optionId);
    if (!selectedOption) {
      return res.status(400).json({ success: false, error: 'Invalid option selected' });
    }

    if (selectedOption.correct) {
      // Mark challenge completed
      await DailyChallenge.findOneAndUpdate(
        { _id: challenge._id },
        { $set: { completed: true } },
        { returnDocument: 'after' }
      );

      // Award XP & increment streak
      const user = await User.findOne({ id: userId });
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

        updatedUser = await User.findOneAndUpdate(
          { id: userId },
          {
            $set: {
              currentXP: newXP,
              dailyStreak: newStreak,
              level: newLevel,
              nextLevelXP: newNextXP,
            },
          },
          { returnDocument: 'after' }
        );

        await Notification.create({
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId,
          title: 'Daily Challenge Mastered! 🔥',
          message: `You earned +${challenge.xpReward} XP and your streak is now ${newStreak} days!`,
          time: 'Just now',
          unread: true,
        });
      }

      const safeUser = updatedUser ? (() => {
        const u = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
        const { passwordHash: _, ...rest } = u;
        return rest;
      })() : null;

      return res.json({
        success: true,
        explanation: challenge.explanation,
        xpAwarded: challenge.xpReward,
        user: safeUser,
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
