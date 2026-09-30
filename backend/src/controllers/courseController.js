import mongoose from 'mongoose';
import { Course, User, Notification } from '../models/index.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = { $regex: new RegExp(`^${difficulty}$`, 'i') };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter);

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let course = await Course.findOne({ id });
    if (!course && mongoose.Types.ObjectId.isValid(id)) {
      course = await Course.findById(id);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const { xpReward = 60 } = req.body;
    const userId = (req.user && req.user.id) || 'usr_101';

    let course = await Course.findOne({ id: courseId });
    if (!course && mongoose.Types.ObjectId.isValid(courseId)) {
      course = await Course.findById(courseId);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    let lessonFound = false;
    const courseObj = course.toObject();
    let updatedModules = courseObj.modules || [];

    if (updatedModules.length > 0) {
      updatedModules = updatedModules.map(module => ({
        ...module,
        lessons: (module.lessons || []).map(lesson => {
          if (lesson.id === lessonId) {
            lessonFound = true;
            return { ...lesson, completed: true, isCurrent: false };
          }
          return lesson;
        }),
      }));
    }

    const newCompletedCount = Math.min(course.totalLessons || 0, (course.completedLessons || 0) + 1);

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: course._id },
      {
        $set: {
          completedLessons: newCompletedCount,
          modules: updatedModules,
        },
      },
      { returnDocument: 'after' }
    );

    // Award XP to user
    const user = await User.findOne({ id: userId });
    let updatedUser = user;
    if (user) {
      let newXP = (user.currentXP || 0) + xpReward;
      let newLevel = user.level || 1;
      let newNextXP = user.nextLevelXP || 4500;
      let leveledUp = false;

      while (newXP >= newNextXP) {
        newLevel += 1;
        newNextXP = Math.floor(newNextXP * 1.35);
        leveledUp = true;
      }

      updatedUser = await User.findOneAndUpdate(
        { id: userId },
        {
          $set: {
            currentXP: newXP,
            level: newLevel,
            nextLevelXP: newNextXP,
            coursesCompleted:
              newCompletedCount === course.totalLessons
                ? (user.coursesCompleted || 0) + 1
                : user.coursesCompleted,
          },
        },
        { returnDocument: 'after' }
      );

      if (leveledUp) {
        await Notification.create({
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId,
          title: `Level Up! Reached Level ${newLevel} 🚀`,
          message: `Congratulations! You unlocked new skill paths and reached Level ${newLevel}!`,
          time: 'Just now',
          unread: true,
        });
      }
    }

    const safeUser = updatedUser ? (() => {
      const u = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
      const { passwordHash: _, ...rest } = u;
      return rest;
    })() : null;

    res.json({
      success: true,
      message: 'Lesson completed successfully',
      course: updatedCourse,
      xpAwarded: xpReward,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const enrollCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    let course = await Course.findOne({ id });
    if (!course && mongoose.Types.ObjectId.isValid(id)) {
      course = await Course.findById(id);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const updated = await Course.findOneAndUpdate(
      { _id: course._id },
      { $inc: { enrolledCount: 1 } },
      { returnDocument: 'after' }
    );

    res.json({
      success: true,
      message: `Enrolled in ${course.title}`,
      course: updated,
    });
  } catch (err) {
    next(err);
  }
};
