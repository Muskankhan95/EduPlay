import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    icon: {
      type: String,
      default: '🏅',
    },
    color: {
      type: String,
      default: 'from-blue-500 to-indigo-600',
    },
    description: {
      type: String,
      default: '',
    },
    unlocked: {
      type: Boolean,
      default: false,
    },
    unlockedAt: {
      type: String,
      default: null,
    },
    rarity: {
      type: String,
      default: 'Common',
    },
    xp: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: null,
    },
    maxProgress: {
      type: Number,
      default: null,
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

export const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;
