import React from 'react';
import { motion } from 'framer-motion';
import { Target, HelpCircle } from 'lucide-react';

export const QuestionPanel = ({
  question,
  questionNumber = 1,
  totalQuestions = 10,
  difficulty = 'easy',
}) => {
  if (!question) return null;

  const difficultyTags = {
    easy: { text: "🟢 EASY", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40" },
    medium: { text: "🟡 MEDIUM", bg: "bg-amber-500/20 text-amber-300 border-amber-400/40" },
    hard: { text: "🔴 HARD", bg: "bg-rose-500/20 text-rose-300 border-rose-400/40" },
  };

  const currentDiff = difficultyTags[difficulty] || difficultyTags.easy;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      key={question.id || questionNumber}
      className="w-full text-center space-y-3"
    >
      {/* Sub-header info */}
      <div className="flex items-center justify-center gap-3">
        <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-xs font-black uppercase tracking-wider">
          Question {questionNumber} / {totalQuestions}
        </span>

        {question.topic && (
          <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            {question.topic}
          </span>
        )}

        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${currentDiff.bg}`}>
          {currentDiff.text}
        </span>
      </div>

      {/* Main Question Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug max-w-2xl mx-auto px-4 font-display">
        "{question.question}"
      </h2>

      {/* Aim Hint */}
      <p className="text-xs text-cyan-400/80 font-mono tracking-wider flex items-center justify-center gap-1.5 uppercase">
        <Target className="w-3.5 h-3.5" />
        <span>Aim crosshair and shoot the correct floating target</span>
      </p>
    </motion.div>
  );
};
