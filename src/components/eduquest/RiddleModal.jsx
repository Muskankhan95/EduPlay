import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Key,
  X,
  Package,
} from 'lucide-react';

export const RiddleModal = ({
  challenge,
  feedback,
  revealedHintIndex = -1,
  onRequestHint,
  onSubmitAnswer,
  onProceed,
  onClose,
  lives = 3,
}) => {
  if (!challenge) return null;

  const { clue, question } = challenge;
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (optionText) => {
    if (feedback && feedback.isCorrect) return;
    setSelectedOption(optionText);
  };

  const handleAnswerSubmit = () => {
    if (!selectedOption) return;
    onSubmitAnswer(selectedOption);
  };

  const hints = question.hints || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-emerald-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden my-8"
      >
        {/* Background glow element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button (only allowed when not in correct feedback state) */}
        {!feedback?.isCorrect && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 text-2xl font-bold shadow-md shadow-emerald-500/25 shrink-0">
            🗝️
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
              Clue {clue.step} • {clue.title}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-display">
              {question.title || 'Guardian Riddle'}
            </h3>
          </div>
        </div>

        {/* Riddle / Question Prompt */}
        <div className="my-5 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-white font-serif italic text-sm sm:text-base leading-relaxed shadow-inner">
            "{question.text}"
          </div>

          {/* Progressive Hint Box */}
          {revealedHintIndex >= 0 && (
            <div className="space-y-2">
              {hints.slice(0, revealedHintIndex + 1).map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold text-[10px] uppercase">
                      Hint #{i + 1}
                    </strong>
                    <p>{h}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Ask For Hint Button */}
          {!feedback?.isCorrect && revealedHintIndex < hints.length - 1 && (
            <button
              type="button"
              onClick={onRequestHint}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>
                {revealedHintIndex === -1 ? 'Need a Clue Hint?' : 'Reveal Further Hint'}
              </span>
            </button>
          )}
        </div>

        {/* Options Selection */}
        {!feedback?.isCorrect && (
          <div className="space-y-2.5 my-5">
            {question.options?.map((option, idx) => {
              const isSelected = selectedOption === option;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 font-mono text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-400/40'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Display */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border my-4 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wide mb-1">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
                <span>{feedback.message}</span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed mt-1 text-slate-200">
                {feedback.explanation}
              </p>

              {feedback.solvedMessage && (
                <div className="mt-2.5 pt-2 border-t border-emerald-500/30 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{feedback.solvedMessage}</span>
                </div>
              )}

              {feedback.rewardItem && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-900/50 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold">
                  <Package className="w-3.5 h-3.5" />
                  <span>Obtained: {feedback.rewardItem}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          {!feedback?.isCorrect ? (
            <button
              onClick={handleAnswerSubmit}
              disabled={!selectedOption}
              className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 ${
                selectedOption
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 cursor-pointer active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <span>Decipher Riddle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onProceed}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{clue.isFinalTreasure ? 'Claim Final Treasure 🏆' : 'Next Clue →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RiddleModal;
