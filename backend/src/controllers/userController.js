import { db } from '../db/jsonDb.js';
import { initialUsers } from '../db/seedData.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || (req.user && req.user.id) || 'usr_101';
    const user = await db.findById('users', userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { passwordHash: _, ...safeUser } = user;
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
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (role !== undefined) updates.role = role;
    if (avatar !== undefined) updates.avatar = avatar;

    const updated = await db.update('users', userId, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Also update leaderboard if name/avatar changed
    const leaderboardItem = await db.findOne('leaderboard', item => item.userId === userId);
    if (leaderboardItem) {
      await db.update('leaderboard', leaderboardItem.id, {
        name: updated.name,
        avatar: updated.avatar,
      });
    }

    const { passwordHash: _, ...safeUser } = updated;
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
    const current = await db.findById('users', userId);
    if (!current) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const newPreferences = {
      ...(current.preferences || {}),
      ...req.body,
    };

    const updated = await db.update('users', userId, { preferences: newPreferences });
    const { passwordHash: _, ...safeUser } = updated;

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

    const user = await db.findById('users', userId);
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

    const levelTitle = newLevel >= 10 ? 'Legendary Grandmaster' : newLevel >= 8 ? 'Code Magus' : newLevel >= 7 ? 'Code Conjurer' : 'Apprentice Coder';

    const updatedUser = await db.update('users', userId, {
      currentXP: newXP,
      level: newLevel,
      nextLevelXP: newNextXP,
      levelTitle,
    });

    if (leveledUp) {
      await db.insert('notifications', {
        userId,
        title: `Level Up! Reached Level ${newLevel} 🚀`,
        message: `Congratulations! You unlocked new skill paths and reached Level ${newLevel}!`,
        time: 'Just now',
        unread: true,
      });
    }

    // Update user in leaderboard
    const leaderItem = await db.findOne('leaderboard', item => item.userId === userId);
    if (leaderItem) {
      await db.update('leaderboard', leaderItem.id, { xp: newXP });
      // Re-sort leaderboard
      const allLeaderboard = await db.getAll('leaderboard');
      allLeaderboard.sort((a, b) => b.xp - a.xp);
      allLeaderboard.forEach((item, idx) => {
        item.rank = idx + 1;
      });
      await db.write('leaderboard', allLeaderboard);
    }

    const { passwordHash: _, ...safeUser } = updatedUser;

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
    const user = await db.findById('users', userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const newStreak = (user.dailyStreak || 0) + 1;
    const updated = await db.update('users', userId, { dailyStreak: newStreak });

    // Update leaderboard streak
    const leaderItem = await db.findOne('leaderboard', item => item.userId === userId);
    if (leaderItem) {
      await db.update('leaderboard', leaderItem.id, { streak: newStreak });
    }

    const { passwordHash: _, ...safeUser } = updated;
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
      await db.update('users', 'usr_101', defaultAlex);
    }
    res.json({
      success: true,
      message: 'Demo user data reset to factory state',
      user: defaultAlex,
    });
  } catch (err) {
    next(err);
  }
};
