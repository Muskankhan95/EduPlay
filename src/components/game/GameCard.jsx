import React from 'react';
import { Play, Lock, Zap, Trophy, Sparkles, ArrowRight } from 'lucide-react';

export const GameCard = ({ game, onPlay }) => {
  const isUnlocked = game.unlocked;

  const difficultyColors = {
    easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    hard: "bg-purple-50 text-purple-700 border-purple-200",
    boss: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div
      onClick={() => isUnlocked && onPlay(game.id)}
      className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative group select-none ${
        isUnlocked
          ? 'bg-white border-slate-200/90 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 cursor-pointer'
          : 'bg-slate-50 border-slate-200/60 opacity-70 cursor-not-allowed'
      }`}
    >
      {/* Top Banner with tag & difficulty */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-slate-200 flex items-center justify-center text-3xl shadow-soft-sm group-hover:scale-110 transition-transform">
            {game.icon}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {game.tag && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {game.tag}
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                difficultyColors[game.difficultyLevel] || difficultyColors.medium
              }`}
            >
              {game.difficulty}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
          {game.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
          {game.shortDescription}
        </p>
      </div>

      {/* Center stats strip: XP & Best Score */}
      <div className="px-6 py-3 mx-6 my-1 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="font-extrabold text-slate-800">⭐ {game.xpReward} XP</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-semibold">
          <Trophy className="w-3.5 h-3.5 text-slate-400" />
          <span>Best: <strong className="text-slate-800 font-mono">{game.bestScore}</strong></span>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="p-6 pt-3">
        {isUnlocked ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(game.id);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>PLAY NOW</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div className="w-full py-3 rounded-2xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5">
            <Lock className="w-4 h-4" />
            <span>Locked</span>
          </div>
        )}
      </div>
    </div>
  );
};
