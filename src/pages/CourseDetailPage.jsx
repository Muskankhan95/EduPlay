import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Zap,
  Play,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Code2,
  Share2,
  Award
} from 'lucide-react';

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, setActiveLessonModal } = useLearning();

  const course = courses.find((c) => c.id === courseId) || courses[0];

  const [expandedModules, setExpandedModules] = useState({
    'mod-1': true,
    'mod-4': true,
  });

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const progressPercent = Math.round((course.completedLessons / course.totalLessons) * 100);

  const handleLaunchLesson = (lessonId) => {
    setActiveLessonModal({
      course,
      lessonId: lessonId || course.currentLesson?.id || 'py-l-22',
    });
  };

  // Default mock modules if course modules are empty
  const modulesList = course.modules && course.modules.length > 0 ? course.modules : [
    {
      id: 'm-default-1',
      title: 'Module 1: Core Fundamentals & Principles',
      lessons: [
        { id: 'def-l-1', title: 'Introduction & Environment Setup', duration: '10 min', type: 'theory', completed: true, xp: 30 },
        { id: 'def-l-2', title: 'Basic Syntax & Data Structures', duration: '14 min', type: 'interactive', completed: true, xp: 45 },
        { id: 'def-l-3', title: 'Quiz: Fundamentals Mastery', duration: '12 min', type: 'quiz', completed: true, xp: 50 },
      ]
    },
    {
      id: 'm-default-2',
      title: 'Module 2: Practical Implementation & Labs',
      lessons: [
        { id: 'def-l-4', title: 'Advanced Patterns & Architecture', duration: '18 min', type: 'interactive', completed: false, isCurrent: true, xp: 60 },
        { id: 'def-l-5', title: 'Simulation Lab: Real-World Scenario', duration: '25 min', type: 'simulation', completed: false, xp: 80 },
        { id: 'def-l-6', title: 'Final Assessment & Project Evaluation', duration: '30 min', type: 'quiz', completed: false, xp: 120 },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Back button */}
      <button
        onClick={() => navigate('/app/courses')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses</span>
      </button>

      {/* Hero Course Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                {course.difficulty}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold ml-2">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">({course.ratingCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {course.description}
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <strong>{course.totalLessons}</strong> Lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <strong>{course.estimatedHours}h</strong> Total Study Time
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Zap className="w-4 h-4 fill-amber-400" />
                +{course.xpReward} XP Reward
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <strong>{course.enrolledCount.toLocaleString()}</strong> Enrolled Students
              </span>
            </div>

            {/* Instructor Quick Profile */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/40"
              />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Course Instructor</p>
                <h4 className="text-sm font-bold text-white">{course.instructor.name}</h4>
                <p className="text-xs text-slate-400">{course.instructor.title}</p>
              </div>
            </div>
          </div>

          {/* Action Card / Progress Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-300">Your Progress</span>
                <span className="text-amber-400 text-sm font-black">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-900/60 rounded-full h-3 p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-700 shadow-glow-gold"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2 font-medium">
                <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
                <span>{course.totalLessons - course.completedLessons} remaining</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleLaunchLesson()}
                className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{progressPercent > 0 ? 'Resume Next Lesson' : 'Start Course'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Earns verified course certificate upon completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus / Modules Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Course Syllabus & Curriculum</h2>
            <p className="text-xs text-slate-500">
              Interactive lessons, quizzes, and simulations built with hands-on practice
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {modulesList.length} Modules
          </span>
        </div>

        <div className="space-y-3">
          {modulesList.map((module, modIdx) => {
            const isExpanded = expandedModules[module.id] ?? true;
            const completedCount = module.lessons.filter((l) => l.completed).length;
            const isAllCompleted = completedCount === module.lessons.length;

            return (
              <div
                key={module.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-soft-sm overflow-hidden"
              >
                {/* Module Accordion Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black ${
                        isAllCompleted
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                      }`}
                    >
                      {isAllCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : `M${modIdx + 1}`}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{module.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {completedCount} of {module.lessons.length} completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </div>
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="px-5 pb-5 divide-y divide-slate-100 border-t border-slate-100">
                    {module.lessons.map((lesson) => {
                      const isInteractive = lesson.type === 'interactive';
                      const isQuiz = lesson.type === 'quiz';
                      const isSim = lesson.type === 'simulation';

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => handleLaunchLesson(lesson.id)}
                          className={`py-3.5 flex items-center justify-between rounded-xl px-2.5 transition-all group cursor-pointer ${
                            lesson.isCurrent
                              ? 'bg-indigo-50/80 border border-indigo-200'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {lesson.completed ? (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            ) : lesson.isCurrent ? (
                              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <h4
                                  className={`text-xs sm:text-sm font-bold ${
                                    lesson.isCurrent
                                      ? 'text-indigo-600'
                                      : lesson.completed
                                      ? 'text-slate-800'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  {lesson.title}
                                </h4>
                                {lesson.isCurrent && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span>{lesson.duration}</span>
                                <span>•</span>
                                <span className="capitalize">{lesson.type}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-amber-500" /> +{lesson.xp} XP
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLaunchLesson(lesson.id);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 group-hover:border-indigo-300 group-hover:text-indigo-600 text-slate-600 text-xs font-bold transition-all"
                            >
                              {lesson.completed ? 'Review' : 'Play'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
