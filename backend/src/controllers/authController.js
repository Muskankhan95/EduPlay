import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Badge } from '../models/index.js';
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

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}`;
    const newUser = await User.create({
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: learningGoal ? `${learningGoal} Pioneer` : 'Apprentice Coder',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
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
    });

    // Give starter badge
    await Badge.findOneAndUpdate(
      { id: 'b-1' },
      { unlocked: true, unlockedAt: 'Just now' },
      { returnDocument: 'after' }
    );

    const userObj = newUser.toObject();
    const token = generateToken(userObj);
    const { passwordHash: _, ...safeUser } = userObj;

    res.status(201).json({
      success: true,
      message: 'Account created successfully! +100 Starter XP awarded.',
      token,
      user: safeUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }
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

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
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

    const userObj = user.toObject();
    const token = generateToken(userObj);
    const { passwordHash: _, ...safeUser } = userObj;

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
    const user = await User.findOne({ id: 'usr_101' });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Demo user not found',
      });
    }

    const userObj = user.toObject();
    const token = generateToken(userObj);
    const { passwordHash: _, ...safeUser } = userObj;

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

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account registered with this email address',
      });
    }

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
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const userObj = user.toObject();
    const { passwordHash: _, ...safeUser } = userObj;
    res.json({
      success: true,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
