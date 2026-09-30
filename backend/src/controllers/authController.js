import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/jsonDb.js';
import { config } from '../config/index.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, learningGoal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required',
      });
    }

    const existingUser = await db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: learningGoal ? `${learningGoal} Pioneer` : 'Apprentice Coder',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      level: 1,
      levelTitle: 'Novice Builder',
      currentXP: 100, // Starter bonus
      nextLevelXP: 500,
      dailyStreak: 1,
      streakFreeze: 1,
      coursesCompleted: 0,
      quizAccuracy: 100,
      badgesEarned: 1,
      totalBadges: 25,
      totalHoursLearned: 0.5,
      league: 'Bronze League',
      leagueRank: 12,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      bio: `Aspiring developer eager to master ${learningGoal || 'software engineering'}.`,
      preferences: {
        dailyGoalMinutes: 30,
        soundEffects: true,
        confettiEffects: true,
        reminderTime: '20:00',
        theme: 'light',
      },
    };

    await db.insert('users', newUser);

    // Give starter badge
    const starterBadge = await db.findById('badges', 'b-1');
    if (starterBadge) {
      await db.update('badges', 'b-1', { unlocked: true, unlockedAt: 'Just now' });
    }

    const token = generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully! +100 Starter XP awarded.',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const user = await db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const demoLogin = async (req, res, next) => {
  try {
    const user = await db.findById('users', 'usr_101');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Demo user not found',
      });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Logged in as Demo User (Alex Morgan, Lv. 7)',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    const user = await db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account registered with this email address',
      });
    }

    // In a production email scenario, we would send a tokenized link
    res.json({
      success: true,
      message: `Password reset instructions sent to ${email}`,
      resetToken: `rst_${Date.now()}`,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const user = await db.findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { passwordHash: _, ...safeUser } = user;
    res.json({
      success: true,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
