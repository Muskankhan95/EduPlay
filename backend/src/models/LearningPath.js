import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    status: { type: String, default: 'locked' },
    xp: { type: Number, default: 0 },
    icon: { type: String, default: '📌' },
  },
  { _id: false }
);

const learningPathSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: '',
    },
    totalXP: {
      type: Number,
      default: 0,
    },
    estimatedWeeks: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'General',
    },
    color: {
      type: String,
      default: 'from-blue-600 to-indigo-600',
    },
    nodes: {
      type: [nodeSchema],
      default: [],
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

export const LearningPath = mongoose.model('LearningPath', learningPathSchema);
export default LearningPath;
