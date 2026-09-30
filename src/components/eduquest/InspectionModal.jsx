import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Lightbulb, Lock, Unlock, X, ArrowRight } from 'lucide-react';

export const InspectionModal = ({ inspection, onClose }) => {
  if (!inspection) return null;

  const { object, title, message, hint, isDoor, isSolved } = inspection;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-7 shadow-2xl overflow-hidden"
        >
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {object?.icon || '🔍'}
            </div>

            <div className="space-y-1 pr-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {isDoor ? 'Chamber Barrier' : isSolved ? 'Deciphered Relic' : 'Object Inspection'}
              </span>
              <h3 className="text-lg font-black text-white font-display">
                {title || object?.name}
              </h3>
            </div>
          </div>

          {/* Main Inspection Observation */}
          <div className="my-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm leading-relaxed">
            {message}
          </div>

          {/* Educational or Tactical Clue Hint */}
          {hint && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 font-bold mb-0.5 uppercase tracking-wide text-[10px]">
                  Explorer's Intuition
                </strong>
                <p>{hint}</p>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue Exploring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InspectionModal;
