import React from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Target,
  Medal,
  TrendingUp
} from 'lucide-react';

export const StatCards = () => {
  const { user } = useLearning();

  const xpProgressPercent = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));

  const stats = [
    {
      title: "Current Level",
      value: `Level ${user.level}`,
      subtitle: user.levelTitle,
      icon: Award,
      color: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      badge: "+2 Tiers this mo",
    },
    {
      title: "Total Experience",
      value: `${user.currentXP.toLocaleString()} XP`,
      subtitle: `${user.nextLevelXP - user.currentXP} XP to Level ${user.level + 1}`,
      icon: Zap,
      color: "from-amber-500 to-yellow-500",
      textColor: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      hasProgress: true,
      progress: xpProgressPercent,
    },
    {
      title: "Daily Streak",
      value: `${user.dailyStreak} Days`,
      subtitle: "Personal Best: 24 days",
      icon: Flame,
      color: "from-rose-500 to-orange-500",
      textColor: "text-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      badge: "Active 🔥",
    },
    {
      title: "Courses Completed",
      value: `${user.coursesCompleted} Courses`,
      subtitle: "3 courses in progress",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      badge: "+1 this week",
    },
    {
      title: "Quiz Accuracy",
      value: `${user.quizAccuracy}%`,
      subtitle: "Across 85+ total quizzes",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      badge: "Top 5% 🎯",
    },
    {
      title: "Badges Earned",
      value: `${user.badgesEarned} / ${user.totalBadges}`,
      subtitle: "Next: 30-Day Legend",
      icon: Medal,
      color: "from-purple-500 to-violet-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      badge: "72% unlocked",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 mb-8">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-3xl bg-white border ${item.borderColor} shadow-soft-sm hover:shadow-soft transition-all duration-200 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-2xl ${item.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${item.textColor}`} />
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-slate-500 mb-0.5">{item.title}</div>
              <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                {item.value}
              </div>
            </div>

            <div className="mt-3">
              {item.hasProgress ? (
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-[11px] font-medium text-slate-400 truncate">
                  {item.subtitle}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
