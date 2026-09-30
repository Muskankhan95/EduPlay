import mongoose from 'mongoose';

const targetBlasterQuestionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      default: 'easy',
    },
    topic: {
      type: String,
      default: 'General',
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

export const TargetBlasterQuestion = mongoose.model('TargetBlasterQuestion', targetBlasterQuestionSchema);
export default TargetBlasterQuestion;
