import { db } from '../db/jsonDb.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    let courses = await db.getAll('courses');

    if (category && category !== 'All') {
      courses = courses.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      courses = courses.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }

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
    const course = await db.findById('courses', id);
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

    const course = await db.findById('courses', courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    let lessonFound = false;
    let updatedModules = course.modules || [];

    if (updatedModules.length > 0) {
      updatedModules = updatedModules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            lessonFound = true;
            return { ...lesson, completed: true, isCurrent: false };
          }
          return lesson;
        }),
      }));
    }

    const newCompletedCount = Math.min(course.totalLessons, (course.completedLessons || 0) + 1);
    const updatedCourse = await db.update('courses', courseId, {
      completedLessons: newCompletedCount,
      modules: updatedModules,
    });

    // Award XP to user
    const user = await db.findById('users', userId);
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

      updatedUser = await db.update('users', userId, {
        currentXP: newXP,
        level: newLevel,
        nextLevelXP: newNextXP,
        coursesCompleted: newCompletedCount === course.totalLessons ? (user.coursesCompleted || 0) + 1 : user.coursesCompleted,
      });

      if (leveledUp) {
        await db.insert('notifications', {
          userId,
          title: `Level Up! Reached Level ${newLevel} 🚀`,
          message: `Congratulations! You unlocked new skill paths and reached Level ${newLevel}!`,
          time: 'Just now',
          unread: true,
        });
      }
    }

    const { passwordHash: _, ...safeUser } = updatedUser || {};
    res.json({
      success: true,
      message: 'Lesson completed successfully',
      course: updatedCourse,
      xpAwarded: xpReward,
      user: updatedUser ? safeUser : null,
    });
  } catch (err) {
    next(err);
  }
};

export const enrollCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await db.findById('courses', id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const updated = await db.update('courses', id, {
      enrolledCount: (course.enrolledCount || 0) + 1,
    });

    res.json({
      success: true,
      message: `Enrolled in ${course.title}`,
      course: updated,
    });
  } catch (err) {
    next(err);
  }
};
