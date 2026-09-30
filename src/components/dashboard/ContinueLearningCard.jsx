import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import { Play, Sparkles, Clock, Zap, ArrowRight, BookOpen } from 'lucide-react';

export const ContinueLearningCard = () => {
  const { setActiveLessonModal, courses } = useLearning();
  const navigate = useNavigate();

  // Python course from context
  const pythonCourse = courses.find((c) => c.id === 'py-101') || {
    id: 'py-101',
    title: 'Python Programming',
    currentLesson: {
      title: 'Loops and Iterations',
      module: 'Module 4: Control Flow & Iterations',
      duration: '15 min',
    },
    completedLessons: 21,
    totalLessons: 32,
  };

  const progressPercent = 65; // As explicitly specified: 65%

  const handleContinue = () => {
    setActiveLessonModal({
      course: pythonCourse,
      lessonId: 'py-l-22',
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-7 shadow-soft-lg border border-indigo-700/50">
      {/* Decorative background glow circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Information */}
        <div className="space-y-3.5 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              Resume Learning
            </span>
            <span className="text-xs text-indigo-200 font-medium">
              Course: <span className="font-bold text-white">Python Programming</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 block mb-1">
              Current Lesson
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Loops and Iterations
            </h3>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1">
              Module 4: Control Flow & Iterations • Master while loops, break/continue & range()
            </p>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-indigo-200">Overall Course Progress</span>
              <span className="text-amber-400 font-extrabold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-indigo-950/60 rounded-full h-3 p-0.5 border border-indigo-700/40">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-700 shadow-glow-gold"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-indigo-300 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> ~15 min
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> +60 XP Available
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> 21 of 32 lessons completed
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA Button & Quick Links */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 items-stretch md:items-end justify-center">
          <button
            onClick={handleContinue}
            className="px-7 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-400/25 hover:shadow-amber-400/35 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-950/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-slate-950 text-slate-950 ml-0.5" />
            </div>
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/app/courses/py-101')}
            className="px-4 py-2 text-xs font-bold text-indigo-200 hover:text-white transition-colors text-center md:text-right"
          >
            View Full Course Syllabus →
          </button>
        </div>
      </div>
    </div>
  );
};
