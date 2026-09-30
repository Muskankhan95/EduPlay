import mongoose from 'mongoose';

const weeklyActivitySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    hours: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    lessons: { type: Number, default: 0 },
  },
  { _id: false }
);

const skillBreakdownSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    score: { type: Number, default: 0 },
    fullMark: { type: Number, default: 100 },
  },
  { _id: false }
);

const accuracyHistorySchema = new mongoose.Schema(
  {
    week: { type: String, required: true },
    accuracy: { type: Number, default: 0 },
    quizzes: { type: Number, default: 0 },
  },
  { _id: false }
);

const analyticsSchema = new mongoose.Schema(
  {
    weeklyActivity: {
      type: [weeklyActivitySchema],
      default: [],
    },
    skillBreakdown: {
      type: [skillBreakdownSchema],
      default: [],
    },
    accuracyHistory: {
      type: [accuracyHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
