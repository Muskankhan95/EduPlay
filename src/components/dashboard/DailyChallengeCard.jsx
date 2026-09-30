import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import { Flame, Zap, Clock, ArrowRight, CheckCircle2, Trophy, Play } from 'lucide-react';

export const DailyChallengeCard = () => {
  const { dailyChallenge } = useLearning();
  const navigate = useNavigate();

  const progress = 3;
  const target = 5;
  const progressPercent = Math.round((progress / target) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-amber-200/90 p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between">
      {/* Decorative gradient aura */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                DAILY QUEST
              </span>
              <h4 className="text-base font-black text-slate-900 leading-tight">
                🔥 DAILY CHALLENGE
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>08h 34m</span>
          </div>
        </div>

        <p className="text-slate-800 text-sm font-bold mb-1">
          "Answer 5 Python questions."
        </p>
        <p className="text-slate-500 text-xs mb-4">
          Test loops and iterations across any game mode to protect your streak.
        </p>

        {/* Progress Bar (Section 11) */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Progress:</span>
            <span className="font-mono text-indigo-600 font-extrabold">{progress} / {target}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 shadow-glow-gold"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reward Pill */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-200">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Reward: ⭐ +100 XP
          </span>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Streak Shield
          </span>
        </div>
      </div>

      <div>
        {dailyChallenge.completed ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✅ Challenge Complete!</span>
            </div>
            <Trophy className="w-4 h-4 text-emerald-600" />
          </div>
        ) : (
          <button
            onClick={() => navigate('/app/game/quiz-challenge')}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md shadow-amber-400/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>PLAY</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
