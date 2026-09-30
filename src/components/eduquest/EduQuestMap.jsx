import React from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  Lock,
  CheckCircle2,
  Play,
  Zap,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

export const EduQuestMap = ({
  worlds = [],
  currentWorld,
  onSelectWorld,
  worldLevels = [],
  completedLevels = [],
  isLevelUnlocked,
  onSelectLevel,
  onClose,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider">
          <Map className="w-3.5 h-3.5" />
          <span>EduQuest Expedition Map</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
          Choose Your Realm & Quest
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Traverse topic-based worlds, uncover ancient programming relics, and solve educational mysteries.
        </p>
      </div>

      {/* World Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {worlds.map((world) => {
          const isSelected = world.id === currentWorld?.id;

          return (
            <button
              key={world.id}
              onClick={() => onSelectWorld(world.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] scale-[1.02]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60 text-slate-400'
              }`}
            >
              <div className="text-2xl mb-2">{world.icon}</div>
              <div>
                <h4
                  className={`text-sm font-bold font-display ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {world.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {world.totalLevels} Quests
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected World Overview Hero */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Active World
          </span>
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <span>{currentWorld?.icon}</span>
            <span>{currentWorld?.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            {currentWorld?.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-300">
            Topic: Python Mastery
          </div>
        </div>
      </div>

      {/* Vertical Quest Path Map */}
      <div className="relative py-4 max-w-xl mx-auto space-y-6">
        {/* Continuous neon connector line */}
        <div className="absolute top-10 bottom-10 left-8 sm:left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-slate-800 pointer-events-none" />

        {worldLevels.map((lvl, index) => {
          const isCompleted = completedLevels.includes(lvl.id);
          const unlocked = isLevelUnlocked(lvl);
          const isCurrentActive = unlocked && !isCompleted;

          return (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative z-10 flex items-center gap-4 sm:gap-6 pl-2 sm:pl-0"
            >
              {/* Central Path Node Circle */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0 transition-transform shadow-lg ${
                  isCompleted
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 border-2 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : unlocked
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 border-2 border-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-pulse-subtle'
                    : 'bg-slate-900 border-2 border-slate-800 text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                ) : unlocked ? (
                  <span>🔓</span>
                ) : (
                  <Lock className="w-6 h-6 text-slate-600" />
                )}
              </div>

              {/* Level Info Card */}
              <div
                onClick={() => unlocked && onSelectLevel(lvl.id)}
                className={`flex-1 p-5 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  unlocked
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer group'
                    : 'bg-slate-950/70 border-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Level {lvl.levelNumber}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">
                      {lvl.topic}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors font-display">
                    {lvl.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {lvl.mission || lvl.lore}
                  </p>

                  {!unlocked && (
                    <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1 pt-1">
                      <Lock className="w-3 h-3" />
                      <span>Complete prerequisite module in course to unlock</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1 font-mono justify-end">
                      <Zap className="w-3.5 h-3.5 fill-amber-400" />
                      +{lvl.xpReward} XP
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      {lvl.difficulty}
                    </span>
                  </div>

                  {unlocked ? (
                    <button
                      type="button"
                      className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-md ${
                        isCompleted
                          ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30 hover:bg-slate-700'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/25 group-hover:scale-105'
                      }`}
                    >
                      <span>{isCompleted ? 'Replay' : 'Enter Quest'}</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-600">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EduQuestMap;
