import { Leaderboard } from '../models/index.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const currentUserId = (req.user && req.user.id) || 'usr_101';
    const { league = 'Diamond' } = req.query;

    const filter = {};
    if (league && league !== 'All') {
      filter.league = { $regex: new RegExp(`^${league}$`, 'i') };
    }

    const list = await Leaderboard.find(filter).sort({ xp: -1 });

    const formatted = list.map((item, index) => {
      const obj = item.toObject();
      return {
        ...obj,
        rank: index + 1,
        isCurrentUser: item.userId === currentUserId,
      };
    });

    res.json({
      success: true,
      league,
      leaderboard: formatted,
    });
  } catch (err) {
    next(err);
  }
};
