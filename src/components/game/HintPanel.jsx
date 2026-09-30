import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
} from 'lucide-react';

export const HintPanel = ({
  isCorrect,
  currentQuestion,
  lives,
  onRetry,
  onNext,
  isLastQuestion = false,
}) => {
  if (!currentQuestion) return null;

  // Optional keyboard navigation (Enter/Space to advance)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (isCorrect || lives === 0) {
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCorrect, lives, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`relative w-full max-w-2xl mx-auto rounded-2xl border backdrop-blur-xl p-5 md:p-6 shadow-2xl overflow-hidden z-20 ${
        isCorrect
          ? 'bg-slate-900/95 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.25)]'
          : 'bg-slate-900/95 border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.25)]'
      }`}
    >
      {/* Background ambient radial glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          isCorrect ? 'bg-emerald-500/20' : 'bg-rose-500/20'
        }`}
      />

      <div className="relative z-10">
        {/* Header Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg ${
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
              ) : (
                <ShieldAlert className="w-5 h-5 animate-bounce" />
              )}
            </div>
            <div>
              <h3
                className={`text-lg font-black tracking-wide ${
                  isCorrect ? 'text-emerald-400 font-display' : 'text-rose-400 font-display'
                }`}
              >
                {isCorrect ? '🎯 DIRECT HIT! BULLSEYE!' : '💥 TARGET MISSED!'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {isCorrect
                  ? 'Target confirmed destroyed • Critical accuracy bonus'
                  : lives > 0
                  ? `Laser recalibrating • ${lives} shield charge${lives > 1 ? 's' : ''} remaining`
                  : 'Shield depleted • Tactical debrief'}
              </p>
            </div>
          </div>

          {/* Quick status pill */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isCorrect
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {isCorrect ? '+Score & Combo' : 'Combo Reset'}
          </span>
        </div>

        {/* Content Body */}
        <div className="space-y-3">
          {/* If Incorrect: Hint Card */}
          {!isCorrect && currentQuestion.hint && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm"
            >
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-amber-300 block text-xs uppercase tracking-wide mb-0.5">
                  Tactical Hint
                </span>
                <p className="text-slate-200 text-xs md:text-sm font-sans">
                  {currentQuestion.hint}
                </p>
              </div>
            </motion.div>
          )}

          {/* Concept Explanation */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs md:text-sm leading-relaxed">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              Concept Analysis
            </div>
            {!isCorrect && (
              <p className="text-xs text-rose-300 font-semibold mb-1">
                Correct Target:{' '}
                <span className="text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentQuestion.correctAnswer}
                </span>
              </p>
            )}
            <p className="text-slate-300">{currentQuestion.explanation}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-5 pt-3 border-t border-slate-800/80">
          {!isCorrect && lives > 0 && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 transition-all active:scale-95 text-xs md:text-sm font-semibold shadow-md"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              Re-Aim & Retry
            </button>
          )}

          <button
            onClick={onNext}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-lg transition-all active:scale-95 ${
              isCorrect
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
            }`}
          >
            <span>{isLastQuestion ? 'Complete Mission' : 'Next Target'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HintPanel;
