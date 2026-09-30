import { db } from '../db/jsonDb.js';

export const getAllBadges = async (req, res, next) => {
  try {
    const badges = await db.getAll('badges');
    res.json({
      success: true,
      count: badges.length,
      badges,
    });
  } catch (err) {
    next(err);
  }
};

export const unlockBadge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const badge = await db.findById('badges', id);
    if (!badge) {
      return res.status(404).json({ success: false, error: 'Badge not found' });
    }

    const updated = await db.update('badges', id, {
      unlocked: true,
      unlockedAt: 'Just now',
    });

    const userId = (req.user && req.user.id) || 'usr_101';
    await db.insert('notifications', {
      userId,
      title: `New Badge Unlocked: ${badge.name} ${badge.icon}`,
      message: `You earned '${badge.name}' and +${badge.xp} XP!`,
      time: 'Just now',
      unread: true,
    });

    res.json({
      success: true,
      message: `Unlocked badge ${badge.name}`,
      badge: updated,
    });
  } catch (err) {
    next(err);
  }
};
