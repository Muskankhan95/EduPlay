import React from 'react';
import { useLearning } from '../context/LearningContext';
import { StatCards } from '../components/dashboard/StatCards';
import { ContinueLearningCard } from '../components/dashboard/ContinueLearningCard';
import { DailyChallengeCard } from '../components/dashboard/DailyChallengeCard';
import { WeeklyActivityChart } from '../components/dashboard/WeeklyActivityChart';
import { RecommendedCourses } from '../components/dashboard/RecommendedCourses';
import { RecentAchievements } from '../components/dashboard/RecentAchievements';
import { Sparkles, Trophy, Flame, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useLearning();
  const navigate = useNavigate();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Welcome Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              {getGreeting()}, {user.name.split(' ')[0]} 👋
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Day {user.dailyStreak} Streak Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Ready to level up your engineering skills today? You're only <strong>{user.nextLevelXP - user.currentXP} XP</strong> away from Level {user.level + 1}!
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/app/play')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>🎮</span>
            <span>Play & Learn</span>
          </button>

          <button
            onClick={() => navigate('/app/practice')}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-soft-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Practice Arena</span>
          </button>

          <button
            onClick={() => navigate('/app/learning-path')}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>My Learning Path</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Level, XP, Progress Bar, Streak, Completed Courses, Accuracy, Badges) */}
      <StatCards />

      {/* Primary Action Row: Continue Learning Card (65% Python) & Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContinueLearningCard />
        </div>
        <div className="lg:col-span-1">
          <DailyChallengeCard />
        </div>
      </div>

      {/* Featured Quest Banner: EduQuest Treasure Hunt */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-7 border border-emerald-500/30 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                NEW ADVENTURE QUEST
              </span>
              <span className="text-xs text-emerald-300 font-semibold font-mono">Python World 🐍</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
              The Python Temple: Find the Lost Python Key 🗝️
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore ancient ruins, decipher multi-step coding clues, inspect mysterious relics, and unlock the sacred sanctuary.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1 font-mono justify-end">
                <Zap className="w-3.5 h-3.5 fill-amber-400" /> +150 XP
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">Badge: Temple Raider</span>
            </div>
            <button
              onClick={() => navigate('/app/quest')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>ENTER EDUQUEST</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Weekly Activity Chart + Diamond League Rank widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyActivityChart />
        </div>

        {/* Mini Diamond League Widget */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Diamond League</h3>
                  <p className="text-xs text-slate-500 font-medium">Weekly division standings</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Promotion Zone
              </span>
            </div>

            <div className="space-y-2.5 mb-4">
              {[
                { rank: 1, name: "Liam Chen", xp: "5,420 XP", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100", medal: "🥇" },
                { rank: 2, name: "Zara Patel", xp: "4,890 XP", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100", medal: "🥈" },
                { rank: 3, name: "Mateo Rossi", xp: "4,310 XP", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100", medal: "🥉" },
                { rank: 4, name: "Alex Morgan (You)", xp: "3,420 XP", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", isYou: true },
              ].map((item) => (
                <div
                  key={item.rank}
                  className={`p-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold ${
                    item.isYou
                      ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center font-black text-slate-500 text-xs">
                      {item.medal || `#${item.rank}`}
                    </span>
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <span className={item.isYou ? 'font-black text-indigo-700' : 'text-slate-800'}>
                      {item.name}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-600">{item.xp}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/app/leaderboard')}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-600 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            View Full Diamond League Standings →
          </button>
        </div>
      </div>

      {/* Recommended For You Section */}
      <RecommendedCourses />

      {/* Recent Achievements Section */}
      <RecentAchievements />
    </div>
  );
};
