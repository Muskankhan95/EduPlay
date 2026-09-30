import mongoose from 'mongoose';

const challengeOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    correct: { type: Boolean, default: false },
  },
  { _id: false }
);

const dailyChallengeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    difficulty: {
      type: String,
      default: 'Medium',
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    streakBonus: {
      type: String,
      default: '+1 Day',
    },
    estimatedMinutes: {
      type: Number,
      default: 5,
    },
    timeLeft: {
      type: String,
      default: '24h 00m',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
    problemSnippet: {
      type: String,
      default: '',
    },
    options: {
      type: [challengeOptionSchema],
      default: [],
    },
    explanation: {
      type: String,
      default: '',
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

export const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);
export default DailyChallenge;
