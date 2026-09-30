import React from 'react';
import { Code2, HelpCircle } from 'lucide-react';

export const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  difficulty,
}) => {
  if (!question) return null;

  const difficultyColors = {
    easy: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    medium: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    hard: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    boss: "bg-rose-500/20 text-rose-300 border-rose-400/30",
  };

  return (
    <div className="w-full space-y-4">
      {/* Question metadata strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-black text-xs uppercase tracking-wider">
            Question {questionNumber} / {totalQuestions}
          </span>
          {question.topic && (
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              • {question.topic}
            </span>
          )}
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${
            difficultyColors[difficulty] || difficultyColors.medium
          }`}
        >
          {difficulty}
        </span>
      </div>

      {/* Main Question Heading */}
      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
        {question.question}
      </h2>

      {/* Code Snippet Box (if present) */}
      {question.code && (
        <div className="rounded-2xl sm:rounded-3xl bg-slate-950 p-4 sm:p-5 font-mono text-xs sm:text-sm text-emerald-300 shadow-inner border border-slate-800/80 overflow-x-auto relative group">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-sans font-semibold">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Python 3.12
            </span>
            <span className="text-slate-600">eval_runtime.py</span>
          </div>
          <pre className="leading-relaxed whitespace-pre font-mono">
            {question.code}
          </pre>
        </div>
      )}
    </div>
  );
};
