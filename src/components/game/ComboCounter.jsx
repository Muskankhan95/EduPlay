import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

export const ComboCounter = ({ combo = 1 }) => {
  const isMax = combo >= 5;
  const isHeating = combo >= 3;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={combo}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-colors select-none ${
          isMax
            ? 'bg-gradient-to-r from-amber-500/30 via-orange-500/40 to-rose-500/30 border-amber-400 text-amber-300 shadow-[0_0_15px_#f59e0b]'
            : isHeating
            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            : 'bg-slate-900/60 border-white/10 text-slate-300'
        }`}
      >
        <Flame
          className={`w-4 h-4 transition-transform ${
            isMax
              ? 'fill-amber-400 text-amber-400 animate-bounce'
              : isHeating
              ? 'fill-amber-400 text-amber-400 scale-105'
              : 'text-slate-400'
          }`}
        />
        <span className="font-mono text-xs sm:text-sm font-black tracking-tight">
          ×{combo}
        </span>
        <span className="text-[10px] uppercase font-bold text-amber-200/80 hidden sm:inline">
          {isMax ? 'MAX' : 'COMBO'}
        </span>
      </motion.div>
    </AnimatePresence>
  );
};
