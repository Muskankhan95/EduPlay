import React from 'react';
import { motion } from 'framer-motion';

export const GameProgress = ({ currentQuestionNumber = 1, totalQuestions = 10 }) => {
  const percent = Math.round((currentQuestionNumber / totalQuestions) * 100);

  return (
    <div className="w-full space-y-1.5 max-w-xl mx-auto">
      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
        <span>Progress: {percent}%</span>
        <span>{currentQuestionNumber} of {totalQuestions} Targets</span>
      </div>

      <div className="w-full bg-slate-900 rounded-full h-2.5 p-0.5 border border-white/10 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400 shadow-[0_0_12px_#6366f1]"
        />
      </div>
    </div>
  );
};
