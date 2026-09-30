import { User, Leaderboard, Notification } from '../models/index.js';
import { initialUsers } from '../db/seedData.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || (req.user && req.user.id) || 'usr_101';
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const userObj = user.toObject();
    const { passwordHash: _, ...safeUser } = userObj;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const { name, bio, role, avatar } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;
    if (role !== undefined) updates.role = role;
    if (avatar !== undefined) updates.avatar = avatar;

    const updated = await User.findOneAndUpdate(
      { id: userId },
      { $set: updates },
      { returnDocument: 'after' }
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Also update leaderboard if name/avatar changed
    if (updates.name || updates.avatar) {
      const leaderUpdates = {};
      if (updates.name) leaderUpdates.name = updates.name;
      if (updates.avatar) leaderUpdates.avatar = updates.avatar;
      await Leaderboard.findOneAndUpdate({ userId }, { $set: leaderUpdates });
    }

    const userObj = updated.toObject();
    const { passwordHash: _, ...safeUser } = userObj;
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const current = await User.findOne({ id: userId });
    if (!current) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const currentPrefs = current.preferences ? current.preferences.toObject?.() || current.preferences : {};
    const newPreferences = {
      ...currentPrefs,
      ...req.body,
    };

    const updated = await User.findOneAndUpdate(
      { id: userId },
      { $set: { preferences: newPreferences } },
      { returnDocument: 'after' }
    );
    const userObj = updated.toObject();
    const { passwordHash: _, ...safeUser } = userObj;

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: safeUser.preferences,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const addXP = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const { amount, reason } = req.body;

    const xpToAdd = Number(amount) || 0;
    if (xpToAdd <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive amount of XP required' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let newXP = (user.currentXP || 0) + xpToAdd;
    let newLevel = user.level || 1;
    let newNextXP = user.nextLevelXP || 4500;
    let leveledUp = false;

    while (newXP >= newNextXP) {
      newLevel += 1;
      newNextXP = Math.floor(newNextXP * 1.35);
      leveledUp = true;
    }

    const levelTitle =
      newLevel >= 10
        ? 'Legendary Grandmaster'
        : newLevel >= 8
        ? 'Code Magus'
        : newLevel >= 7
        ? 'Code Conjurer'
        : 'Apprentice Coder';

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          currentXP: newXP,
          level: newLevel,
          nextLevelXP: newNextXP,
          levelTitle,
        },
      },
      { returnDocument: 'after' }
    );

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

    // Update user in leaderboard
    const leaderItem = await Leaderboard.findOne({ userId });
    if (leaderItem) {
      leaderItem.xp = newXP;
      await leaderItem.save();

      // Re-sort leaderboard ranks
      const allLeaderboard = await Leaderboard.find().sort({ xp: -1 });
      for (let i = 0; i < allLeaderboard.length; i++) {
        allLeaderboard[i].rank = i + 1;
        await allLeaderboard[i].save();
      }
    }

    const userObj = updatedUser.toObject();
    const { passwordHash: _, ...safeUser } = userObj;

    res.json({
      success: true,
      xpAdded: xpToAdd,
      reason: reason || 'Activity Completed',
      leveledUp,
      newLevel,
      levelTitle,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const incrementStreak = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const newStreak = (user.dailyStreak || 0) + 1;
    const updated = await User.findOneAndUpdate(
      { id: userId },
      { $set: { dailyStreak: newStreak } },
      { returnDocument: 'after' }
    );

    // Update leaderboard streak
    await Leaderboard.findOneAndUpdate({ userId }, { $set: { streak: newStreak } });

    const userObj = updated.toObject();
    const { passwordHash: _, ...safeUser } = userObj;
    res.json({
      success: true,
      dailyStreak: newStreak,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const resetDemoData = async (req, res, next) => {
  try {
    const defaultAlex = initialUsers.find(u => u.id === 'usr_101');
    if (defaultAlex) {
      await User.findOneAndUpdate(
        { id: 'usr_101' },
        { $set: defaultAlex },
        { returnDocument: 'after' }
      );
    }
    const updated = await User.findOne({ id: 'usr_101' });
    const userObj = updated ? updated.toObject() : defaultAlex;
    const { passwordHash: _, ...safeUser } = userObj;

    res.json({
      success: true,
      message: 'Demo user data reset to factory state',
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
