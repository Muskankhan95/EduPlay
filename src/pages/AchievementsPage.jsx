import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import {
  Award,
  Zap,
  Sparkles,
  Lock,
  CheckCircle2,
  Trophy,
  Filter,
  Flame
} from 'lucide-react';

export const AchievementsPage = () => {
  const { badges, user } = useLearning();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Streaks', 'Learning', 'Mastery', 'Special'];

  const filteredBadges = badges.filter((b) => {
    if (selectedCategory === 'All') return true;
    return b.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalBadges = badges.length;
  const totalBadgeXP = badges.filter((b) => b.unlocked).reduce((acc, curr) => acc + curr.xp, 0);

  const rarityBadgeStyles = {
    Common: "bg-slate-100 text-slate-700 border-slate-200",
    Rare: "bg-blue-50 text-blue-700 border-blue-200",
    Epic: "bg-purple-50 text-purple-700 border-purple-200",
    Legendary: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Badges & Milestones
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              {unlockedCount} of {totalBadges} Unlocked
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Prove your coding prowess by unlocking exclusive trophies, streaks, and speed achievements.
          </p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Unlocked Badges</div>
            <div className="text-xl font-black text-slate-900">
              {unlockedCount} <span className="text-xs font-semibold text-slate-400">/ {totalBadges} total</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Zap className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">XP from Badges</div>
            <div className="text-xl font-black text-amber-500">
              +{totalBadgeXP.toLocaleString()} XP
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Next Target</div>
            <div className="text-sm font-black text-slate-900">
              30-Day Legend (14/30)
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.unlocked;

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-slate-200 shadow-soft-sm hover:shadow-soft hover:-translate-y-1'
                  : 'bg-slate-50/70 border-slate-200/70 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                      isUnlocked
                        ? 'bg-indigo-50 border border-indigo-100 ring-2 ring-indigo-500/10'
                        : 'bg-slate-200/60 grayscale'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      rarityBadgeStyles[badge.rarity] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              {/* Bottom State */}
              <div>
                {isUnlocked ? (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-amber-600 font-extrabold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-500" /> +{badge.xp} XP
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-200/60 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                      <span>
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{
                          width: `${(badge.progress / badge.maxProgress) * 100}%`,
                        }}
                      />
                    </div>
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
