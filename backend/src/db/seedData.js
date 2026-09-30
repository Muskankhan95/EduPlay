import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/database.js';
import {
  User,
  Course,
  Badge,
  DailyChallenge,
  Leaderboard,
  LearningPath,
  Notification,
  QuizResult,
  TargetBlasterQuestion,
  Analytics,
} from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

async function readJsonFile(filename, fallback = []) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) || typeof parsed === 'object' ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
}

export const initialUsers = [
  {
    id: "usr_101",
    name: "Alex Morgan",
    email: "alex.morgan@eduplay.io",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "Full-Stack Apprentice",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    level: 7,
    levelTitle: "Code Conjurer",
    currentXP: 3420,
    nextLevelXP: 4500,
    dailyStreak: 14,
    streakFreeze: 2,
    coursesCompleted: 6,
    quizAccuracy: 94,
    badgesEarned: 18,
    totalBadges: 25,
    totalHoursLearned: 58.5,
    league: "Diamond League",
    leagueRank: 4,
    joinedDate: "October 2025",
    bio: "Passionate about building full-stack web applications and machine learning experiments. Learning 30 mins every day!",
    preferences: {
      dailyGoalMinutes: 30,
      soundEffects: true,
      confettiEffects: true,
      reminderTime: "20:00",
      theme: "light",
    },
  },
  {
    id: "usr_102",
    name: "Sarah Chen",
    email: "sarah.chen@eduplay.io",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "AI Enthusiast",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    level: 5,
    levelTitle: "Code Magician",
    currentXP: 2150,
    nextLevelXP: 3000,
    dailyStreak: 8,
    streakFreeze: 1,
    coursesCompleted: 3,
    quizAccuracy: 89,
    badgesEarned: 11,
    totalBadges: 25,
    totalHoursLearned: 34.0,
    league: "Gold League",
    leagueRank: 2,
    joinedDate: "January 2026",
    bio: "Exploring deep learning, computer vision, and Python.",
    preferences: {
      dailyGoalMinutes: 45,
      soundEffects: true,
      confettiEffects: true,
      reminderTime: "19:00",
      theme: "light",
    },
  }
];

export async function seedAll() {
  console.log('🌱 Starting MongoDB database seeding/migration...');

  // 1. Users
  const fileUsers = await readJsonFile('users.json', initialUsers);
  const usersToSeed = Array.isArray(fileUsers) && fileUsers.length > 0 ? fileUsers : initialUsers;
  for (const u of usersToSeed) {
    if (!u.id) continue;
    await User.findOneAndUpdate(
      { $or: [{ id: u.id }, { email: u.email.toLowerCase() }] },
      { ...u, email: u.email.toLowerCase() },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Users verified (${usersToSeed.length} records processed)`);

  // 2. Courses
  const fileCourses = await readJsonFile('courses.json', []);
  for (const c of fileCourses) {
    if (!c.id) continue;
    await Course.findOneAndUpdate(
      { id: c.id },
      c,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Courses verified (${fileCourses.length} records processed)`);

  // 3. Badges
  const fileBadges = await readJsonFile('badges.json', []);
  for (const b of fileBadges) {
    if (!b.id) continue;
    await Badge.findOneAndUpdate(
      { id: b.id },
      b,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Badges verified (${fileBadges.length} records processed)`);

  // 4. Daily Challenges
  const fileChallenges = await readJsonFile('dailyChallenges.json', []);
  for (const d of fileChallenges) {
    if (!d.id) continue;
    await DailyChallenge.findOneAndUpdate(
      { id: d.id },
      d,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Daily Challenges verified (${fileChallenges.length} records processed)`);

  // 5. Leaderboard
  const fileLeaderboard = await readJsonFile('leaderboard.json', []);
  for (const l of fileLeaderboard) {
    if (!l.userId) continue;
    await Leaderboard.findOneAndUpdate(
      { userId: l.userId },
      l,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Leaderboard verified (${fileLeaderboard.length} records processed)`);

  // 6. Learning Paths
  const filePaths = await readJsonFile('learningPaths.json', []);
  for (const p of filePaths) {
    if (!p.id) continue;
    await LearningPath.findOneAndUpdate(
      { id: p.id },
      p,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Learning Paths verified (${filePaths.length} records processed)`);

  // 7. Notifications
  const fileNotifs = await readJsonFile('notifications.json', []);
  for (const n of fileNotifs) {
    if (!n.id) continue;
    await Notification.findOneAndUpdate(
      { id: n.id },
      n,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Notifications verified (${fileNotifs.length} records processed)`);

  // 8. Quiz Results
  const fileQuizResults = await readJsonFile('quizResults.json', []);
  for (const q of fileQuizResults) {
    if (!q.id) continue;
    await QuizResult.findOneAndUpdate(
      { id: q.id },
      q,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Quiz Results verified (${fileQuizResults.length} records processed)`);

  // 9. Target Blaster Questions
  const fileQuestions = await readJsonFile('targetBlasterQuestions.json', []);
  for (const t of fileQuestions) {
    if (t.id === undefined) continue;
    await TargetBlasterQuestion.findOneAndUpdate(
      { id: t.id },
      t,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Target Blaster Questions verified (${fileQuestions.length} records processed)`);

  // 10. Analytics
  const fileAnalytics = await readJsonFile('analytics.json', []);
  const analyticsData = Array.isArray(fileAnalytics) ? fileAnalytics[0] : fileAnalytics;
  if (analyticsData) {
    const existingCount = await Analytics.countDocuments();
    if (existingCount === 0) {
      await Analytics.create(analyticsData);
    } else {
      await Analytics.findOneAndUpdate({}, analyticsData);
    }
  }
  console.log(`✅ Analytics verified`);

  console.log('🎉 MongoDB database seeding & migration completed successfully!');
}

// Run directly if called as a script (e.g. npm run seed)
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectExecution) {
  connectDB()
    .then(async () => {
      await seedAll();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding failed with error:', err);
      process.exit(1);
    });
}
