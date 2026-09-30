import React from 'react';
import { LivesDisplay } from './LivesDisplay';
import { ComboCounter } from './ComboCounter';
import { GameTimer } from './GameTimer';
import { ScoreDisplay } from './ScoreDisplay';
import { Zap, Volume2, VolumeX, X, Target, Crosshair } from 'lucide-react';

export const GameHUD = ({
  lives = 3,
  maxLives = 3,
  xp = 0,
  combo = 1,
  score = 0,
  timeRemaining = 20,
  soundMuted = false,
  onToggleSound,
  onExit,
  difficulty = 'easy',
  onSelectDifficulty,
}) => {
  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-6 py-3 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Exit */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Exit Game"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_#06b6d4]">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black tracking-wider text-white font-mono uppercase flex items-center gap-1.5">
                  <span>TARGET BLASTER</span>
                  <span className="text-cyan-400 text-xs font-bold">🎯</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Difficulty pill selectors */}
          {onSelectDifficulty && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[10px] font-black uppercase font-mono">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => onSelectDifficulty(d)}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    difficulty === d
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Lives, XP, Combo, Timer */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          {/* Lives Display */}
          <LivesDisplay lives={lives} maxLives={maxLives} />

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-black text-xs sm:text-sm font-mono shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse-subtle" />
            <span>⭐ {xp.toLocaleString()} XP</span>
          </div>

          {/* Combo Multiplier */}
          <ComboCounter combo={combo} />

          {/* 20s Question Timer */}
          <GameTimer timeRemaining={timeRemaining} maxTime={20} />
        </div>

        {/* Right: Score & Audio Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <ScoreDisplay score={score} />

          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title={soundMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
