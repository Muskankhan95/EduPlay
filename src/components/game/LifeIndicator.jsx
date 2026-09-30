import React from 'react';
import { Heart } from 'lucide-react';

export const LifeIndicator = ({ lives = 3, maxLives = 3 }) => {
  return (
    <div className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 mr-1 hidden sm:inline">
        Lives:
      </span>
      {Array.from({ length: maxLives }).map((_, idx) => {
        const isAlive = idx < lives;
        return (
          <span
            key={idx}
            className={`transition-all duration-300 transform ${
              isAlive
                ? 'scale-100 text-rose-500 animate-pulse-subtle'
                : 'scale-90 text-slate-600 opacity-60 grayscale'
            }`}
            title={isAlive ? "Active Life" : "Lost Life"}
          >
            {isAlive ? (
              <span className="text-base sm:text-lg select-none">❤️</span>
            ) : (
              <span className="text-base sm:text-lg select-none">🖤</span>
            )}
          </span>
        );
      })}
    </div>
  );
};
