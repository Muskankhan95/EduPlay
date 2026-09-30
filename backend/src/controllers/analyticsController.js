import { db } from '../db/jsonDb.js';

export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const list = await db.getAll('analytics');
    const data = list[0] || {};
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getWeeklyActivity = async (req, res, next) => {
  try {
    const list = await db.getAll('analytics');
    const data = list[0] || {};
    res.json({
      success: true,
      weeklyActivity: data.weeklyActivity || [],
    });
  } catch (err) {
    next(err);
  }
};

export const getSkillBreakdown = async (req, res, next) => {
  try {
    const list = await db.getAll('analytics');
    const data = list[0] || {};
    res.json({
      success: true,
      skillBreakdown: data.skillBreakdown || [],
    });
  } catch (err) {
    next(err);
  }
};

export const getAccuracyHistory = async (req, res, next) => {
  try {
    const list = await db.getAll('analytics');
    const data = list[0] || {};
    res.json({
      success: true,
      accuracyHistory: data.accuracyHistory || [],
    });
  } catch (err) {
    next(err);
  }
};
