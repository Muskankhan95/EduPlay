import React from 'react';
import { LifeIndicator } from './LifeIndicator';
import { StreakIndicator } from './StreakIndicator';
import { Zap, X, Award, Sparkles } from 'lucide-react';

export const GameHeader = ({
  level = 7,
  xp = 0,
  lives = 3,
  maxLives = 3,
  streak = 0,
  score = 0,
  currentQuestionNumber = 1,
  totalQuestions = 10,
  onExit,
  gameTitle = "Play & Learn",
}) => {
  const progressPercent = Math.round((currentQuestionNumber / totalQuestions) * 100);

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Top Stat Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          {/* Left: Level & XP */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Exit Game"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 font-black text-xs uppercase tracking-wide flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                LVL {level}
              </span>

              <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-black text-xs font-mono shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse-subtle" />
                <span>{xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* Center: Game Title (desktop only) */}
          <div className="hidden md:block text-center">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              {gameTitle}
            </span>
          </div>

          {/* Right: Lives, Streak & Score */}
          <div className="flex items-center gap-2 sm:gap-3">
            <StreakIndicator streak={streak} />
            <LifeIndicator lives={lives} maxLives={maxLives} />

            <div className="hidden sm:flex flex-col items-end pl-2 border-l border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
              <span className="text-sm font-black font-mono text-white leading-none">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Question Step Counter */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-0.5">
            <span>Progress: {progressPercent}%</span>
            <span>Question {currentQuestionNumber} of {totalQuestions}</span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-2 p-0.5 border border-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 transition-all duration-500 ease-out shadow-glow-primary"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
