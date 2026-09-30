import React from 'react';
import { X, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

export const ReviewMistakesModal = ({ answersHistory = [], isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 rounded-3xl border border-white/10 shadow-2xl text-white overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Question Review & Explanations</h3>
              <p className="text-xs text-slate-400">Deepen understanding through post-game reflection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {answersHistory.map((item, idx) => {
            const q = item.question;
            const isCorrect = item.isCorrect;
            const correctOpt = q.options?.find((o) => o.isCorrect);

            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border text-left space-y-3 ${
                  isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Q{idx + 1}.
                    </span>
                    <h4 className="text-sm font-bold text-white">{q.question}</h4>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                </div>

                {q.code && (
                  <div className="rounded-xl bg-slate-950 p-3 font-mono text-xs text-emerald-300 border border-slate-800">
                    <pre className="whitespace-pre overflow-x-auto">{q.code}</pre>
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  {!isCorrect && (
                    <p className="text-rose-300">
                      <strong>Your answer: </strong>
                      <span>{item.selectedOption ? item.selectedOption.text : 'Timed out'}</span>
                    </p>
                  )}
                  <p className="text-emerald-300">
                    <strong>Correct answer: </strong>
                    <span>{correctOpt ? correctOpt.text : 'N/A'}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl">
                  <strong className="text-indigo-300 block mb-0.5">Why this is correct:</strong>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
