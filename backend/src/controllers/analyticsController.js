import { Analytics } from '../models/index.js';

export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const data = (await Analytics.findOne()) || {};
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
    const data = (await Analytics.findOne()) || {};
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
    const data = (await Analytics.findOne()) || {};
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
    const data = (await Analytics.findOne()) || {};
    res.json({
      success: true,
      accuracyHistory: data.accuracyHistory || [],
    });
  } catch (err) {
    next(err);
  }
};
