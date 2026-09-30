import React from 'react';
import { Clock, Zap } from 'lucide-react';

export const TimerBar = ({ timeLeft = 15, totalTime = 15 }) => {
  const percentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  let colorClass = "from-emerald-500 to-teal-400";
  let badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-400/30";
  let bonusText = "+30 XP Fast";

  if (timeLeft <= 5) {
    colorClass = "from-rose-500 to-red-600 animate-pulse";
    badgeColor = "bg-rose-500/20 text-rose-300 border-rose-400/30";
    bonusText = "+10 XP";
  } else if (timeLeft <= 10) {
    colorClass = "from-amber-400 to-orange-500";
    badgeColor = "bg-amber-500/20 text-amber-300 border-amber-400/30";
    bonusText = "+20 XP";
  }

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
        <div className="flex items-center gap-1.5">
          <Clock className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
          <span className="font-mono text-sm font-black text-white">{timeLeft}s</span>
          <span className="text-[11px] text-slate-400 font-normal">remaining</span>
        </div>

        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${badgeColor}`}>
          <Zap className="w-3 h-3 fill-current" />
          <span>{bonusText}</span>
        </div>
      </div>

      <div className="w-full bg-slate-800/80 rounded-full h-2.5 p-0.5 border border-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-1000 ease-linear`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
