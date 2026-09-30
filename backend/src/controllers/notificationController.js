import mongoose from 'mongoose';
import { Notification } from '../models/index.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const notifications = await Notification.find({
      $or: [{ userId }, { userId: { $exists: false } }, { userId: null }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
      unreadCount: notifications.filter(n => n.unread).length,
    });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    let notif = await Notification.findOne({ id });
    if (!notif && mongoose.Types.ObjectId.isValid(id)) {
      notif = await Notification.findById(id);
    }

    if (!notif) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    const updated = await Notification.findOneAndUpdate(
      { _id: notif._id },
      { $set: { unread: false } },
      { returnDocument: 'after' }
    );

    res.json({ success: true, notification: updated });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    await Notification.updateMany(
      { $or: [{ userId }, { userId: { $exists: false } }, { userId: null }] },
      { $set: { unread: false } }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (err) {
    next(err);
  }
};
