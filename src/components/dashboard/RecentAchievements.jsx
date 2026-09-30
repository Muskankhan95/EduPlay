import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import { Award, Zap, ArrowRight, Sparkles } from 'lucide-react';

export const RecentAchievements = () => {
  const { badges } = useLearning();
  const navigate = useNavigate();

  // Filter unlocked badges and take the top 4
  const unlockedBadges = badges.filter((b) => b.unlocked).slice(0, 4);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Recent Achievements</h3>
              <p className="text-xs text-slate-500 font-medium">Your latest trophies & milestones</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/achievements')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All (18)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-indigo-200 hover:shadow-soft-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/20 border border-indigo-200/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {badge.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                  {badge.rarity}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-0.5 line-clamp-1">
                {badge.name}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                {badge.description}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200/60">
                <span className="text-amber-600 font-bold flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-amber-500" /> +{badge.xp} XP
                </span>
                <span>{badge.unlockedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
