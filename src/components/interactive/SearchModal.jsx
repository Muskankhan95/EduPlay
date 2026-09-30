import React, { useState, useMemo } from 'react';
import { useLearning } from '../../context/LearningContext';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Map, Award, ArrowRight } from 'lucide-react';

export const SearchModal = () => {
  const { searchModalOpen, setSearchModalOpen, courses } = useLearning();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matches = [];
    courses.forEach(course => {
      if (
        course.title.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'course',
          id: course.id,
          title: course.title,
          subtitle: `${course.category} • ${course.difficulty} • ${course.xpReward} XP`,
          link: `/app/courses/${course.id}`,
          icon: course.badgeIcon,
        });
      }

      if (course.currentLesson?.title?.toLowerCase().includes(q)) {
        matches.push({
          type: 'lesson',
          id: course.currentLesson.id,
          title: course.currentLesson.title,
          subtitle: `Lesson in ${course.title}`,
          link: `/app/courses/${course.id}`,
          icon: '📖',
        });
      }
    });

    // Check general topics
    const staticTopics = [
      { type: 'path', title: 'Full-Stack Web Architect Path', subtitle: 'Curated 12-week learning roadmap', link: '/app/learning-path', icon: '🗺️' },
      { type: 'path', title: 'Python Data Science Specialist', subtitle: 'Automation, analytics & backend', link: '/app/learning-path', icon: '🐍' },
      { type: 'practice', title: 'Daily Logic Challenge', subtitle: 'Earn +100 XP and protect streak', link: '/app/practice', icon: '🔥' },
      { type: 'leaderboard', title: 'Diamond League Leaderboard', subtitle: 'Weekly standings and rankings', link: '/app/leaderboard', icon: '🏆' },
    ];

    staticTopics.forEach(topic => {
      if (topic.title.toLowerCase().includes(q) || topic.subtitle.toLowerCase().includes(q)) {
        matches.push(topic);
      }
    });

    return matches.slice(0, 6);
  }, [query, courses]);

  if (!searchModalOpen) return null;

  const handleSelect = (link) => {
    setSearchModalOpen(false);
    setQuery('');
    navigate(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Search courses, lessons, topics, paths (e.g. Python, loops, algorithms)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none bg-transparent"
          />
          <button
            onClick={() => {
              setSearchModalOpen(false);
              setQuery('');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              <p className="mb-2 font-medium">Quick suggestions:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Python', 'React', 'Loops', 'Algorithms', 'Leaderboard', 'Learning Path'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No matching courses or topics found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.link)}
                  className="w-full text-left p-3.5 rounded-2xl hover:bg-indigo-50/70 flex items-center justify-between group transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
