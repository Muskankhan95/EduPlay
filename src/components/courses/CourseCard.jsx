import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import {
  Star,
  Users,
  BookOpen,
  Zap,
  Play,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { setActiveLessonModal } = useLearning();

  const progressPercent = Math.round((course.completedLessons / course.totalLessons) * 100);
  const isStarted = course.completedLessons > 0;

  const handleAction = (e) => {
    e.stopPropagation();
    if (course.currentLesson) {
      setActiveLessonModal({
        course: course,
        lessonId: course.currentLesson.id,
      });
    } else {
      navigate(`/app/courses/${course.id}`);
    }
  };

  const difficultyColors = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
    Advanced: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div
      onClick={() => navigate(`/app/courses/${course.id}`)}
      className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Course Image & Badges */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

          {/* Badge Icon */}
          <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-lg shadow-sm">
            {course.badgeIcon}
          </div>

          {/* Difficulty Badge */}
          <span
            className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-md ${
              difficultyColors[course.difficulty] || "bg-slate-100 text-slate-700"
            }`}
          >
            {course.difficulty}
          </span>

          {/* Bottom stats inside banner */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{course.rating}</span>
              <span className="text-slate-300 text-[10px]">({course.ratingCount})</span>
            </div>

            <div className="flex items-center gap-1 text-slate-200">
              <Users className="w-3.5 h-3.5 text-slate-300" />
              <span>{course.enrolledCount.toLocaleString()} learners</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
            <span>{course.category}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {course.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
            <span className="flex items-center gap-1 font-semibold">
              <BookOpen className="w-4 h-4 text-slate-400" />
              {course.totalLessons} lessons
            </span>
            <span className="flex items-center gap-1 font-extrabold text-amber-600">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
              +{course.xpReward} XP available
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Action Button */}
      <div className="p-5 pt-0 space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-500">Progress</span>
            <span className={progressPercent > 0 ? "text-indigo-600" : "text-slate-400"}>
              {progressPercent}% ({course.completedLessons}/{course.totalLessons})
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {isStarted ? (
          <button
            onClick={handleAction}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Continue Lesson</span>
          </button>
        ) : (
          <button
            onClick={() => navigate(`/app/courses/${course.id}`)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
