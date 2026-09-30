import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    xp: {
      type: Number,
      default: 0,
      index: true,
    },
    streak: {
      type: Number,
      default: 0,
    },
    league: {
      type: String,
      default: 'Diamond',
      index: true,
    },
    badge: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;
