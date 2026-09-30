import React from 'react';
import { Zap, HeartCrack, Sparkles } from 'lucide-react';

export const XPAnimation = ({ notification }) => {
  if (!notification) return null;

  const isCorrect = notification.type === 'correct';

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
      <div
        className={`px-5 py-2.5 rounded-2xl shadow-2xl border flex items-center gap-2 backdrop-blur-md ${
          isCorrect
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-glow-gold'
            : 'bg-rose-600 text-white border-rose-500 font-bold shadow-lg shadow-rose-600/30'
        }`}
      >
        {isCorrect ? (
          <Sparkles className="w-4 h-4 fill-slate-950" />
        ) : (
          <HeartCrack className="w-4 h-4 fill-white" />
        )}
        <span className="text-sm tracking-tight">{notification.text}</span>
      </div>
    </div>
  );
};
