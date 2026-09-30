import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const GameTimer = ({ timeRemaining = 20, maxTime = 20 }) => {
  const percent = Math.max(0, Math.min(100, (timeRemaining / maxTime) * 100));
  const isCritical = timeRemaining <= 5;

  let colorClasses = "from-cyan-400 to-indigo-500";
  let badgeColor = "text-cyan-300 border-cyan-400/30 bg-cyan-500/10";

  if (isCritical) {
    colorClasses = "from-rose-500 to-red-600";
    badgeColor = "text-rose-300 border-rose-500/40 bg-rose-500/20";
  } else if (timeRemaining <= 10) {
    colorClasses = "from-amber-400 to-orange-500";
    badgeColor = "text-amber-300 border-amber-400/30 bg-amber-500/10";
  }

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.6 }}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${badgeColor}`}
      >
        <Clock className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
        <span className="text-white font-black text-sm">{timeRemaining}s</span>
      </motion.div>
    </div>
  );
};
