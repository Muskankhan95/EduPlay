import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { CourseCard } from '../components/courses/CourseCard';
import {
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Layers
} from 'lucide-react';

export const CoursesPage = () => {
  const { courses } = useLearning();
  const location = useLocation();

  // If URL is /app/my-courses, default to showing in-progress/enrolled
  const isMyCoursesPage = location.pathname.includes('my-courses');

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Python', 'Web Development', 'Algorithms', 'AI & Data', 'Security', 'Game Dev'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // If on "My Courses" tab, only show courses with progress > 0
      if (isMyCoursesPage && course.completedLessons === 0) {
        return false;
      }

      // Search match
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Difficulty match
      const matchesDifficulty =
        difficultyFilter === 'All' || course.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

      // Category match
      const matchesCategory =
        categoryFilter === 'All' || course.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [courses, isMyCoursesPage, searchQuery, difficultyFilter, categoryFilter]);

  const enrolledCount = courses.filter((c) => c.completedLessons > 0).length;

  return (
    <div className="space-y-7 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              {isMyCoursesPage ? 'My Active Courses' : 'Explore Courses & Challenges'}
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              {isMyCoursesPage ? `${enrolledCount} Enrolled` : `${courses.length} Available`}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isMyCoursesPage
              ? 'Pick up right where you left off and earn completion badges.'
              : 'Interactive hands-on tracks in Python, Web, AI, Algorithms and Cybersecurity.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-soft-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by keyword, topic or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Difficulty Filter Tabs: All, Beginner, Intermediate, Advanced */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 self-start md:self-auto overflow-x-auto max-w-full">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Track:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No matching courses found</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search query or reset the difficulty and track filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDifficultyFilter('All');
              setCategoryFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
