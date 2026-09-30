import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Unlock, Eye, HelpCircle } from 'lucide-react';

export const InteractiveObject = ({
  object,
  isTargetOfActiveClue = false,
  isInspected = false,
  isSolved = false,
  isDoorUnlocked = false,
  onInspect,
}) => {
  if (!object) return null;

  const isDoor = object.isDoor;
  const isFinal = object.isFinalTreasure;

  // Visual card styling based on object state
  let cardBorder = 'border-slate-700/80 bg-slate-900/80 hover:border-emerald-400';
  let glowStyle = 'shadow-md';

  if (isTargetOfActiveClue) {
    cardBorder = 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-400/50';
    glowStyle = 'shadow-[0_0_35px_rgba(16,185,129,0.4)] animate-pulse-subtle';
  } else if (isSolved) {
    cardBorder = 'border-teal-500/50 bg-teal-950/20';
    glowStyle = 'shadow-[0_0_20px_rgba(20,184,166,0.2)]';
  } else if (isDoor && !isDoorUnlocked) {
    cardBorder = 'border-rose-500/40 bg-slate-900/80';
    glowStyle = 'shadow-[0_0_20px_rgba(244,63,94,0.15)]';
  } else if (isFinal) {
    cardBorder = 'border-amber-400/60 bg-amber-950/20';
    glowStyle = 'shadow-[0_0_30px_rgba(245,158,11,0.25)]';
  }

  return (
    <motion.button
      type="button"
      onClick={() => onInspect(object.id)}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', damping: 18, stiffness: 300 }}
      aria-label={`Inspect ${object.name}`}
      className={`relative w-full max-w-[240px] sm:max-w-[260px] p-5 sm:p-6 rounded-3xl border-2 backdrop-blur-md flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group select-none ${cardBorder} ${glowStyle}`}
    >
      {/* Target Clue Beacon Badge */}
      {isTargetOfActiveClue && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-lg shadow-emerald-500/40"
        >
          <Sparkles className="w-3 h-3 fill-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Clue Relic</span>
        </motion.div>
      )}

      {/* Door status badge */}
      {isDoor && (
        <div
          className={`absolute -top-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
            isDoorUnlocked
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          {isDoorUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          <span>{isDoorUnlocked ? 'Gate Open' : 'Gate Sealed'}</span>
        </div>
      )}

      {/* Object Icon with Radial Glow Halo */}
      <div className="relative my-2">
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl transition-transform duration-300 group-hover:scale-110 shadow-inner ${
            isTargetOfActiveClue
              ? 'bg-gradient-to-br from-emerald-500/30 to-teal-500/10 border border-emerald-400/50'
              : isFinal
              ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/10 border border-amber-400/50'
              : isSolved
              ? 'bg-teal-950/40 border border-teal-500/30 text-teal-300'
              : 'bg-slate-800/60 border border-slate-700/60'
          }`}
        >
          <span>{object.icon}</span>
        </div>

        {/* Ambient Ring for active target */}
        {isTargetOfActiveClue && (
          <motion.div
            className="absolute -inset-2 rounded-2xl border border-dashed border-emerald-400/60 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          />
        )}
      </div>

      {/* Object Name & Details */}
      <h3 className="text-sm sm:text-base font-bold text-white tracking-wide mt-1 group-hover:text-emerald-300 transition-colors font-display">
        {object.name}
      </h3>

      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 px-1 leading-snug">
        {object.description}
      </p>

      {/* Inspection Cue on Hover */}
      <div className="mt-3 text-[10px] font-bold tracking-widest text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 uppercase">
        <Eye className="w-3 h-3" />
        <span>Tap to Inspect</span>
      </div>
    </motion.button>
  );
};

export default InteractiveObject;
