import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import { Sparkles, Star, Users, Zap, BookOpen, ArrowRight } from 'lucide-react';

export const RecommendedCourses = () => {
  const { courses } = useLearning();
  const navigate = useNavigate();

  // Pick 3 recommended courses (excluding the one in ContinueLearning)
  const recommended = courses.slice(1, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Recommended For You</h3>
            <p className="text-xs text-slate-500 font-medium">Curated based on your Full-Stack learning path</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/app/explore')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
        >
          <span>View All Courses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommended.map((course) => {
          const progressPercent = Math.round((course.completedLessons / course.totalLessons) * 100);

          return (
            <div
              key={course.id}
              onClick={() => navigate(`/app/courses/${course.id}`)}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Course Banner Image */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-2xs">
                    {course.category}
                  </span>

                  {/* Rating */}
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-white text-xs font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{course.rating}</span>
                    <span className="text-slate-300 text-[10px]">({course.ratingCount})</span>
                  </div>

                  <span className="absolute bottom-2.5 right-3 text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-600/90 text-white backdrop-blur-xs">
                    {course.difficulty}
                  </span>
                </div>

                {/* Course Content */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {course.totalLessons} Lessons
                    </span>
                    <span className="flex items-center gap-1 font-extrabold text-indigo-600">
                      <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      +{course.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Progress or Start Button */}
              <div className="p-4 pt-0">
                {course.completedLessons > 0 ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Progress</span>
                      <span className="text-indigo-600">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full py-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <span>Explore Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
