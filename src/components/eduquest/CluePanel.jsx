import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, MapPin, Package, ArrowRight } from 'lucide-react';

export const CluePanel = ({
  currentClue,
  totalClues = 4,
  inventory = [],
  chambers = [],
  currentChamberId,
  onNavigateChamber,
}) => {
  if (!currentClue) return null;

  // Find target chamber name
  const targetChamber = chambers.find((c) => c.id === currentClue.targetChamberId);
  const isDifferentChamber =
    targetChamber && currentChamberId && targetChamber.id !== currentChamberId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl p-5 sm:p-6 shadow-2xl relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Active Clue Content */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-400" />
              Clue {currentClue.step} of {totalClues}
            </span>

            <span className="text-xs font-bold text-slate-300 font-mono">
              {currentClue.title}
            </span>
          </div>

          <div className="relative pl-3 border-l-2 border-emerald-400">
            <p className="text-sm sm:text-base text-slate-100 font-serif italic leading-relaxed">
              "{currentClue.riddle}"
            </p>
          </div>

          {/* Chamber Guide Pill */}
          {targetChamber && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Search Location:</span>
                <strong className="text-cyan-300 font-semibold">{targetChamber.name}</strong>
              </span>

              {isDifferentChamber && onNavigateChamber && (
                <button
                  onClick={() => onNavigateChamber(targetChamber.id)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Go to {targetChamber.name}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Collected Inventory Relics */}
        {inventory.length > 0 && (
          <div className="w-full md:w-auto p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 shrink-0 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Package className="w-3 h-3 text-amber-400" />
              <span>Discovered Relics ({inventory.length})</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {inventory.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CluePanel;
