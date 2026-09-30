import mongoose from 'mongoose';
import { Badge, Notification } from '../models/index.js';

export const getAllBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find();
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
    let badge = await Badge.findOne({ id });
    if (!badge && mongoose.Types.ObjectId.isValid(id)) {
      badge = await Badge.findById(id);
    }

    if (!badge) {
      return res.status(404).json({ success: false, error: 'Badge not found' });
    }

    const updated = await Badge.findOneAndUpdate(
      { _id: badge._id },
      {
        $set: {
          unlocked: true,
          unlockedAt: 'Just now',
        },
      },
      { returnDocument: 'after' }
    );

    const userId = (req.user && req.user.id) || 'usr_101';
    await Notification.create({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
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
