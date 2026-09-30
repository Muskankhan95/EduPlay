import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Award, Sparkles, ArrowRight, Zap } from 'lucide-react';

export const LevelUpModal = () => {
  const { levelUpModal, setLevelUpModal, user } = useLearning();

  if (!levelUpModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center overflow-hidden border border-indigo-100 animate-scaleUp">
        {/* Background gradient decorative glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />

        {/* Level badge icon */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-glow-primary animate-bounce mb-5">
          <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center bg-indigo-700/40">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <span className="absolute -bottom-1 bg-amber-400 text-slate-900 text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
            Lv. {levelUpModal.level}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          LEVEL UP CELEBRATION!
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Rank {levelUpModal.level} Unlocked!
        </h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          You earned enough XP to ascend to <span className="font-bold text-indigo-600">"{levelUpModal.title}"</span>. Advanced simulator challenges and diamond leagues are now open to you!
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 text-left flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current XP</div>
            <div className="text-lg font-black text-indigo-600 flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              {user.currentXP.toLocaleString()} XP
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Next Tier</div>
            <div className="text-sm font-bold text-slate-700">
              Level {levelUpModal.level + 1} ({user.nextLevelXP.toLocaleString()} XP)
            </div>
          </div>
        </div>

        <button
          onClick={() => setLevelUpModal(null)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Claim Rewards & Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
