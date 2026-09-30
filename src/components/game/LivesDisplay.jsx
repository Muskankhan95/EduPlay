import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LivesDisplay = ({ lives = 3, maxLives = 3 }) => {
  return (
    <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
      <span className="text-[10px] font-mono font-black uppercase text-rose-300 mr-1 hidden sm:inline">
        SHIELDS:
      </span>
      {Array.from({ length: maxLives }).map((_, i) => {
        const isAlive = i < lives;
        return (
          <motion.span
            key={i}
            animate={{
              scale: isAlive ? [1, 1.15, 1] : 0.85,
            }}
            transition={{
              repeat: isAlive ? Infinity : 0,
              duration: 2 + i * 0.3,
              ease: 'easeInOut',
            }}
            className="select-none text-base sm:text-lg"
          >
            {isAlive ? '❤️' : '🖤'}
          </motion.span>
        );
      })}
    </div>
  );
};
