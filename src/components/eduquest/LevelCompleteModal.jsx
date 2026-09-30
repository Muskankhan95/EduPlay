import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Zap,
  Clock,
  Compass,
  Award,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Map,
} from 'lucide-react';

export const LevelCompleteModal = ({
  level,
  score = 0,
  xpEarned = 150,
  timeElapsed = 0,
  hintsUsed = 0,
  accuracy = 100,
  adaptiveResult = null,
  onReviewClues,
  onContinueMap,
  onExitHub,
}) => {
  if (!level) return null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const finalTreasure = level.finalTreasure;
  const badge = level.badge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-amber-500/50 p-6 sm:p-10 shadow-[0_0_60px_rgba(245,158,11,0.25)] text-center my-8 overflow-hidden"
      >
        {/* Ambient treasure glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Trophy & Title */}
          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.15 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-5xl shadow-[0_0_40px_rgba(245,158,11,0.5)] mb-2"
            >
              {finalTreasure?.icon || '🏆'}
            </motion.div>

            <span className="text-xs font-black uppercase tracking-widest text-amber-400 block font-mono">
              LEVEL COMPLETED • TREASURE CLAIMED
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              {level.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              You uncovered the secrets of the ancient sanctuary and claimed{' '}
              <strong className="text-amber-400">{finalTreasure?.name || 'The Sacred Relic'}</strong>!
            </p>
          </div>

          {/* Stats Quad Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total XP</span>
              <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center gap-0.5 mt-0.5 font-display">
                <Zap className="w-4 h-4 fill-amber-400" />
                +{xpEarned}
              </div>
              <span className="text-[10px] text-amber-300 font-mono">Level Progress</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 font-display">
                {accuracy}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Precision</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Time Taken</span>
              <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-0.5 font-display">
                {formatTime(timeElapsed)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Exploration</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Hints Used</span>
              <div className="text-xl sm:text-2xl font-black text-purple-400 mt-0.5 font-display">
                {hintsUsed}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {hintsUsed === 0 ? 'Master Sleuth' : 'Guided'}
              </span>
            </div>
          </div>

          {/* Badge Unlocked Card */}
          {badge && (
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl shadow-md shrink-0">
                {badge.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                  New Badge Unlocked!
                </span>
                <h4 className="text-sm font-bold text-white">{badge.name}</h4>
                <p className="text-xs text-slate-400">{badge.description}</p>
              </div>
            </div>
          )}

          {/* Adaptive Learning Recommendation */}
          {adaptiveResult && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-left space-y-1">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Adaptive Quest Recommendation</span>
              </div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {adaptiveResult.title}
              </h4>
              <p className="text-xs text-slate-300">{adaptiveResult.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={onReviewClues}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Review Discovered Lore</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onContinueMap}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Quest Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExitHub}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Hub
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelCompleteModal;
