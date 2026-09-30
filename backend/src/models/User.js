import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema(
  {
    dailyGoalMinutes: { type: Number, default: 30 },
    soundEffects: { type: Boolean, default: true },
    confettiEffects: { type: Boolean, default: true },
    reminderTime: { type: String, default: '20:00' },
    theme: { type: String, default: 'light' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      default: 'Apprentice Coder',
    },
    avatar: {
      type: String,
      default: '',
    },
    level: {
      type: Number,
      default: 1,
    },
    levelTitle: {
      type: String,
      default: 'Novice Builder',
    },
    currentXP: {
      type: Number,
      default: 100,
    },
    nextLevelXP: {
      type: Number,
      default: 500,
    },
    dailyStreak: {
      type: Number,
      default: 1,
    },
    streakFreeze: {
      type: Number,
      default: 1,
    },
    coursesCompleted: {
      type: Number,
      default: 0,
    },
    quizAccuracy: {
      type: Number,
      default: 100,
    },
    badgesEarned: {
      type: Number,
      default: 1,
    },
    totalBadges: {
      type: Number,
      default: 25,
    },
    totalHoursLearned: {
      type: Number,
      default: 0.5,
    },
    league: {
      type: String,
      default: 'Bronze League',
    },
    leagueRank: {
      type: Number,
      default: 12,
    },
    joinedDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
    bio: {
      type: String,
      default: '',
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.id || ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.id || ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User = mongoose.model('User', userSchema);
export default User;
