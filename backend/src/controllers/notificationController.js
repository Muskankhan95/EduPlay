import { db } from '../db/jsonDb.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const all = await db.getAll('notifications');
    const userNotifs = all.filter(n => !n.userId || n.userId === userId);
    res.json({
      success: true,
      notifications: userNotifs,
      unreadCount: userNotifs.filter(n => n.unread).length,
    });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await db.findById('notifications', id);
    if (!notif) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    const updated = await db.update('notifications', id, { unread: false });
    res.json({ success: true, notification: updated });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    const userId = (req.user && req.user.id) || 'usr_101';
    const all = await db.getAll('notifications');
    const updated = all.map(n => {
      if (!n.userId || n.userId === userId) {
        return { ...n, unread: false };
      }
      return n;
    });

    await db.write('notifications', updated);
    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (err) {
    next(err);
  }
};
