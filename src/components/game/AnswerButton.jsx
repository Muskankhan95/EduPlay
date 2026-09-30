import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export const AnswerButton = ({
  option,
  index,
  isSelected,
  isAnswerChecked,
  onClick,
  disabled,
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const letter = letters[index] || String.fromCharCode(65 + index);

  const isCorrect = option.isCorrect;

  // Base styling with tactile 3D bottom border
  let buttonClasses = "border-b-4 active:border-b-2 active:translate-y-0.5 border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 hover:shadow-soft-sm";
  let letterClasses = "bg-slate-100 text-slate-700 border-slate-300";

  if (isAnswerChecked) {
    if (isCorrect) {
      // Correct answer state
      buttonClasses = "border-emerald-600 bg-emerald-500 text-white border-b-4 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-300 animate-pulse-subtle";
      letterClasses = "bg-white text-emerald-700 border-white";
    } else if (isSelected && !isCorrect) {
      // Selected wrong answer state
      buttonClasses = "border-rose-700 bg-rose-600 text-white border-b-4 shadow-lg shadow-rose-600/25 ring-2 ring-rose-300";
      letterClasses = "bg-white text-rose-700 border-white";
    } else {
      // Unselected other options
      buttonClasses = "border-slate-200 bg-slate-50 text-slate-400 opacity-60 border-b-2";
      letterClasses = "bg-slate-200 text-slate-500 border-slate-300";
    }
  } else if (isSelected) {
    buttonClasses = "border-indigo-600 bg-indigo-50 text-indigo-900 border-b-4 ring-2 ring-indigo-500 shadow-sm";
    letterClasses = "bg-indigo-600 text-white border-indigo-600";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isAnswerChecked}
      className={`w-full min-h-[64px] sm:min-h-[72px] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-left font-bold text-sm sm:text-base transition-all duration-150 flex items-center justify-between gap-3.5 select-none cursor-pointer group ${buttonClasses}`}
    >
      <div className="flex items-center gap-3.5 flex-1">
        {/* Letter Pill */}
        <span
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center text-xs sm:text-sm font-black shrink-0 transition-transform group-hover:scale-105 ${letterClasses}`}
        >
          {letter}
        </span>

        {/* Answer Text */}
        <span className="leading-snug break-words">{option.text}</span>
      </div>

      {/* Trailing check or X icon */}
      {isAnswerChecked && (
        <div className="shrink-0 ml-2">
          {isCorrect ? (
            <div className="w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-md animate-scaleUp">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          ) : isSelected && !isCorrect ? (
            <div className="w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-md animate-scaleUp">
              <X className="w-5 h-5 stroke-[3]" />
            </div>
          ) : null}
        </div>
      )}
    </button>
  );
};
