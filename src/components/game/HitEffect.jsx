import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const HitEffect = ({ hit }) => {
  if (!hit || !hit.active) return null;

  const isCorrect = hit.isCorrect;
  const particleCount = 12;

  return (
    <AnimatePresence>
      <div
        className="fixed pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2"
        style={{ left: hit.x, top: hit.y }}
      >
        {/* Shockwave expanding ring */}
        <motion.div
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`w-24 h-24 rounded-full border-2 ${
            isCorrect
              ? 'border-emerald-400 shadow-[0_0_25px_#10b981]'
              : 'border-rose-500 shadow-[0_0_25px_#f43f5e]'
          }`}
        />

        {/* Center Flash */}
        <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 m-auto w-12 h-12 rounded-full blur-xs ${
            isCorrect ? 'bg-emerald-300' : 'bg-rose-400'
          }`}
        />

        {/* Radiating Particles */}
        {Array.from({ length: particleCount }).map((_, i) => {
          const angle = (i / particleCount) * (Math.PI * 2);
          const distance = 40 + Math.random() * 30;
          const targetX = Math.cos(angle) * distance;
          const targetY = Math.sin(angle) * distance;

          return (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: targetX,
                y: targetY,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                isCorrect ? 'bg-amber-300 shadow-[0_0_8px_#fcd34d]' : 'bg-rose-400'
              }`}
            />
          );
        })}
      </div>
    </AnimatePresence>
  );
};
