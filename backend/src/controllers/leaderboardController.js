import { db } from '../db/jsonDb.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const currentUserId = (req.user && req.user.id) || 'usr_101';
    const { league = 'Diamond' } = req.query;

    let list = await db.getAll('leaderboard');
    if (league) {
      list = list.filter(item => !item.league || item.league.toLowerCase() === league.toLowerCase());
    }

    // Sort descending by XP
    list.sort((a, b) => b.xp - a.xp);

    const formatted = list.map((item, index) => ({
      ...item,
      rank: index + 1,
      isCurrentUser: item.userId === currentUserId,
    }));

    res.json({
      success: true,
      league,
      leaderboard: formatted,
    });
  } catch (err) {
    next(err);
  }
};
