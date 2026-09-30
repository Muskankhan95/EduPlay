import React from 'react';
import {
  Map,
  Compass,
  Zap,
  Volume2,
  VolumeX,
  X,
  Clock,
  Sparkles,
  Shield,
  Search,
  Key,
} from 'lucide-react';

export const EduQuestHUD = ({
  worldName = 'Python World',
  worldIcon = '🐍',
  levelTitle = 'The Python Temple',
  mission = 'Find the Lost Python Key',
  lives = 3,
  maxLives = 3,
  xpEarned = 0,
  timeElapsed = 0,
  currentClueNumber = 1,
  totalClues = 4,
  soundMuted = false,
  onToggleSound,
  onOpenMap,
  onExit,
}) => {
  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-xl border-b border-emerald-500/20 px-4 sm:px-6 py-3 select-none z-30 sticky top-0 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Quest Brand, Level & Map button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Exit to Hub"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {worldIcon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-wide">
                    {levelTitle}
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                    {worldName}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{mission}</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">World Map</span>
          </button>
        </div>

        {/* Center: Lives, Clues Progress, XP & Timer */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          {/* Heart Shield Lives */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            {Array.from({ length: maxLives }).map((_, idx) => (
              <span
                key={idx}
                className={`text-sm sm:text-base transition-transform duration-300 ${
                  idx < lives ? 'scale-100' : 'opacity-25 grayscale scale-90'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>

          {/* Clues Deciphered Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Search className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>
              Clue {Math.min(currentClueNumber, totalClues)} / {totalClues}
            </span>
          </div>

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>+{xpEarned} XP</span>
          </div>

          {/* Exploratory Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Right: Sound Control */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default EduQuestHUD;
