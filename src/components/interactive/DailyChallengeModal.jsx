import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { X, Flame, Zap, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';

export const DailyChallengeModal = () => {
  const {
    activeChallengeModal,
    setActiveChallengeModal,
    dailyChallenge,
    submitDailyChallenge
  } = useLearning();

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!activeChallengeModal) return null;

  const handleSubmit = () => {
    if (!selectedOption) return;
    const res = submitDailyChallenge(selectedOption);
    setFeedback(res);
    if (res.success) {
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    setActiveChallengeModal(false);
    setSelectedOption(null);
    setFeedback(null);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden border border-slate-100 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Daily Challenge
                </span>
                <span className="text-xs text-slate-400 font-medium">Expires in {dailyChallenge.timeLeft}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{dailyChallenge.title}</h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reward Pills */}
        <div className="flex items-center gap-3 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-indigo-600" />
            +{dailyChallenge.xpReward} XP Reward
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            {dailyChallenge.streakBonus} Streak Protection
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {dailyChallenge.difficulty}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
          {dailyChallenge.description}
        </p>

        {/* Problem Snippet */}
        <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-200 shadow-inner mb-5 overflow-x-auto border border-slate-800">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-xs">
            <span>python_loop_bug.py</span>
            <span className="text-rose-400 font-bold"># Logic Error</span>
          </div>
          <pre className="text-emerald-400">{dailyChallenge.problemSnippet}</pre>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-6">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Select the correct fix:
          </label>
          {dailyChallenge.options.map((option) => {
            const isSelected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                disabled={isSubmitted || dailyChallenge.completed}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full text-left p-3.5 rounded-2xl border text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                } ${isSubmitted || dailyChallenge.completed ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="leading-snug">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl mb-6 flex items-start gap-3 ${
              feedback.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm">
              <p className="font-bold mb-0.5">
                {feedback.success ? 'Brilliant Solution!' : 'Oops, Check Again!'}
              </p>
              <p>{feedback.explanation}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        {dailyChallenge.completed || isSubmitted ? (
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Challenge Completed (+100 XP Claimed)</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedOption
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
                : 'bg-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Verify & Claim XP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
