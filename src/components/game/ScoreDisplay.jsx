import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScoreDisplay = ({ score = 0 }) => {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
        Score
      </span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={score}
          initial={{ scale: 0.8, y: -4 }}
          animate={{ scale: 1, y: 0 }}
          className="text-base sm:text-lg font-black font-mono text-white leading-none tracking-tight"
        >
          {score.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
