import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export const StreakIndicator = ({ streak = 0 }) => {
  const isHeatingUp = streak >= 3;
  const isOnFire = streak >= 5;

  return (
    <div
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
        isOnFire
          ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-rose-500/20 border-amber-400/50 text-amber-300 shadow-glow-gold'
          : isHeatingUp
          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
          : 'bg-slate-900/60 border-white/10 text-slate-300'
      }`}
    >
      <Flame
        className={`w-4 h-4 transition-transform ${
          isOnFire
            ? 'fill-amber-400 text-amber-400 animate-bounce scale-110'
            : isHeatingUp
            ? 'fill-amber-400 text-amber-400 scale-105'
            : 'text-slate-400'
        }`}
      />
      <span className="text-xs sm:text-sm font-black font-mono">
        {streak}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/90 hidden sm:inline">
        Streak
      </span>

      {isOnFire && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-[9px] uppercase tracking-wider whitespace-nowrap shadow-md animate-pulse">
          On Fire! 🔥
        </span>
      )}
    </div>
  );
};
