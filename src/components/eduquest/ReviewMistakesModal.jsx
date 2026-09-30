import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertCircle, CheckCircle2, X, Sparkles, HelpCircle } from 'lucide-react';

export const ReviewMistakesModal = ({
  clues = [],
  mistakes = [],
  isOpen = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('clues'); // 'clues' | 'mistakes'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-black text-white font-display">
              Temple Codex & Investigation Debrief
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('clues')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'clues'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            📜 Discovered Lore & Clues ({clues.length})
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mistakes'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            💥 Review Mistakes ({mistakes.length})
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {activeTab === 'clues' ? (
            clues.length > 0 ? (
              clues.map((clue, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-400 uppercase tracking-wide">
                      Clue #{clue.step}: {clue.title}
                    </span>
                    {clue.rewardItem && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        ✨ {clue.rewardItem}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 italic font-serif">"{clue.riddle}"</p>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-semibold text-white">
                      Concept: {clue.question?.title || 'Key Principle'}
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      💡 {clue.question?.explanation}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No clues deciphered yet. Start exploring the temple chambers!
              </div>
            )
          ) : mistakes.length > 0 ? (
            mistakes.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>#{idx + 1}. {m.clueTitle}</span>
                </div>

                <div className="text-slate-300">"{m.question}"</div>

                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                    Your Choice: {m.userAnswer}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    Correct: {m.correctAnswer}
                  </span>
                </div>

                <p className="text-slate-400 pt-1 leading-relaxed">
                  💡 {m.explanation}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Flawless Investigation!</h4>
              <p className="text-xs text-slate-400">
                You solved every riddle without a single mistake. True Master Sleuth status!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            Close Codex
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewMistakesModal;
