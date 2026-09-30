import React from 'react';
import { Skull, ShieldAlert, Swords, Zap, Crown } from 'lucide-react';

export const BossLevelView = ({
  bossName = "Python Loops Titan",
  bossHP = 1000,
  maxBossHP = 1000,
  currentQuestionNumber = 1,
  totalQuestions = 10,
}) => {
  const hpPercent = Math.max(0, Math.min(100, Math.round((bossHP / maxBossHP) * 100)));

  return (
    <div className="w-full bg-gradient-to-r from-purple-950 via-slate-900 to-rose-950 p-4 sm:p-5 rounded-3xl border border-rose-500/30 shadow-xl mb-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Boss Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 via-purple-600 to-amber-500 flex items-center justify-center text-3xl shadow-glow-primary animate-pulse-subtle border border-rose-400/40">
              👾
            </div>
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400 absolute -top-2 -right-1" />
          </div>

          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="px-2 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                👑 Module Boss
              </span>
              <span className="text-xs text-slate-400 font-semibold">Tier 1 Gatekeeper</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {bossName}
            </h3>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-rose-400 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5" /> Boss Health
            </span>
            <span className="font-mono text-white">
              {bossHP} / {maxBossHP} HP ({hpPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-rose-500/30 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 transition-all duration-500 shadow-md"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
