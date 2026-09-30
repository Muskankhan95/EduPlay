import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { gameModes, dailyGameChallenge } from '../data/gameData';
import { GameCard } from '../components/game/GameCard';
import { GameMap } from '../components/game/GameMap';
import {
  Gamepad2,
  Sparkles,
  Flame,
  Zap,
  Play,
  Trophy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';

export const PlayAndLearnPage = () => {
  const navigate = useNavigate();
  const { user } = useLearning();

  const handleLaunchGame = (modeId) => {
    navigate(`/app/game/${modeId}`);
  };

  const handleSelectMapLevel = (levelId, defaultMode) => {
    navigate(`/app/game/${defaultMode}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Play & Learn Game Hub
            </h1>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Gamepad2 className="w-3.5 h-3.5" />
              {gameModes.length} Game Modes
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Choose your challenge mode, protect your daily streak, and conquer the module boss!
          </p>
        </div>

        {/* User Game Profile Pill */}
        <div className="flex items-center gap-3 p-2 px-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{user.dailyStreak} Day Streak</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1 text-xs font-extrabold text-indigo-600">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{user.currentXP.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Daily Challenge Card (Section 11) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border border-indigo-900/50 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                DAILY CHALLENGE
              </span>
              <span className="text-xs text-indigo-200 font-semibold">Resets in 8h 14m</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {dailyGameChallenge.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {dailyGameChallenge.description}
            </p>

            {/* Progress bar (3 / 5 questions) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Challenge Progress</span>
                <span className="text-amber-400">
                  {dailyGameChallenge.currentProgress} / {dailyGameChallenge.targetProgress} Questions (60%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 p-0.5 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-glow-gold transition-all duration-500"
                  style={{ width: `${(dailyGameChallenge.currentProgress / dailyGameChallenge.targetProgress) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-amber-300 self-start md:self-auto">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Reward: ⭐ +{dailyGameChallenge.xpReward} XP</span>
            </div>

            <button
              onClick={() => handleLaunchGame('quiz-challenge')}
              className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>PLAY CHALLENGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Game Modes Grid (6 Game Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Select Your Game Mode
              </h2>
              <p className="text-xs text-slate-500">
                From fast-paced speed blitzes to boss battles and memory matching
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={handleLaunchGame}
            />
          ))}
        </div>
      </div>

      {/* 2. Visual Game-Style Learning Map */}
      <GameMap onSelectLevel={handleSelectMapLevel} />
    </div>
  );
};
