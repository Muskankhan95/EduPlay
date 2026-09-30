import React from 'react';
import { gameMapNodes } from '../../data/gameData';
import {
  CheckCircle2,
  Lock,
  Play,
  Star,
  Crown,
  Sparkles,
  ArrowDown,
  Zap
} from 'lucide-react';

export const GameMap = ({ onSelectLevel }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider">
              🗺️ Quest Map
            </span>
            <span className="text-xs text-slate-400 font-semibold">Module 4 of 6</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Python Mastery Pathway
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 3 Cleared
          </span>
          <span className="flex items-center gap-1.5 text-indigo-600">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" /> Current Node
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> 3 Locked
          </span>
        </div>
      </div>

      {/* Visual Zig-Zag / Vertical Path */}
      <div className="relative max-w-xl mx-auto py-2">
        {/* Winding road connecting line */}
        <div className="absolute left-1/2 top-4 bottom-12 w-1.5 bg-slate-200 -translate-x-1/2 rounded-full z-0" />

        <div className="space-y-6 relative z-10">
          {/* Start Point */}
          <div className="flex justify-center mb-2">
            <span className="px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-black uppercase tracking-widest shadow-md">
              START
            </span>
          </div>

          {gameMapNodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isCurrent = node.status === 'current';
            const isBoss = node.type === 'boss';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                onClick={() => !isLocked && onSelectLevel(node.id, isBoss ? 'boss-level' : 'quiz-challenge')}
                className={`flex items-center gap-4 p-4 sm:p-5 rounded-3xl border-2 transition-all duration-300 select-none ${
                  isCurrent
                    ? 'bg-indigo-50/90 border-indigo-500 ring-4 ring-indigo-500/20 shadow-glow-primary hover:scale-[1.02] cursor-pointer'
                    : isBoss
                    ? 'bg-gradient-to-r from-purple-900/10 via-rose-900/10 to-amber-900/10 border-amber-400 hover:border-amber-500 shadow-md hover:scale-[1.02] cursor-pointer'
                    : isCompleted
                    ? 'bg-white border-emerald-300 hover:border-emerald-400 shadow-soft-sm hover:scale-[1.01] cursor-pointer'
                    : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Node Status Avatar */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 relative transition-transform ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-glow-primary animate-pulse'
                      : isBoss
                      ? 'bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-glow-gold'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-white stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  ) : isBoss ? (
                    <Crown className="w-7 h-7 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400" />
                  )}

                  {/* Level Number badge */}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center border border-white">
                    {node.levelNumber}
                  </span>
                </div>

                {/* Node Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{node.icon}</span>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                        {node.name}
                      </h4>
                    </div>

                    {isCurrent && (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                    {node.description}
                  </p>

                  {/* Stars & XP */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < node.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="font-extrabold text-indigo-600 flex items-center gap-0.5 text-xs">
                      <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> +{node.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
