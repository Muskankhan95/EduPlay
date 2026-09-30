import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String, default: '' },
    type: { type: String, default: 'theory' },
    completed: { type: Boolean, default: false },
    isCurrent: { type: Boolean, default: false },
    xp: { type: Number, default: 0 },
  },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    lessons: { type: [lessonSchema], default: [] },
  },
  { _id: false }
);

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  { _id: false }
);

const currentLessonSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    title: { type: String, default: '' },
    module: { type: String, default: '' },
    duration: { type: String, default: '' },
    type: { type: String, default: 'interactive' },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
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
    slug: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
      index: true,
    },
    difficulty: {
      type: String,
      default: 'Beginner',
      index: true,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    xpReward: {
      type: Number,
      default: 0,
    },
    estimatedHours: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
    badgeIcon: {
      type: String,
      default: '🎓',
    },
    instructor: {
      type: instructorSchema,
      default: () => ({}),
    },
    description: {
      type: String,
      default: '',
    },
    currentLesson: {
      type: currentLessonSchema,
      default: () => ({}),
    },
    modules: {
      type: [moduleSchema],
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

export const Course = mongoose.model('Course', courseSchema);
export default Course;
