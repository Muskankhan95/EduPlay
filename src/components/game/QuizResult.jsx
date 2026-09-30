import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Target,
  Flame,
  Zap,
  Award,
  RotateCcw,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { triggerCelebration } from '../../utils/confetti';

export const QuizResult = ({
  score = 0,
  xpEarned = 0,
  accuracy = 0,
  correctCount = 0,
  totalQuestions = 10,
  maxCombo = 1,
  answersHistory = [],
  adaptiveResult = null,
  isGameOver = false,
  onRestart,
  onExit,
}) => {
  const [showReview, setShowReview] = useState(false);

  // Compute badges unlocked
  const badges = [];
  if (accuracy >= 90) {
    badges.push({
      id: 'sniper',
      icon: '🎯',
      name: 'Sharpshooter Elite',
      desc: 'Achieved 90%+ target accuracy',
      color: 'from-amber-400 to-yellow-500',
    });
  } else if (accuracy >= 70) {
    badges.push({
      id: 'marksman',
      icon: '🏹',
      name: 'Skilled Marksman',
      desc: 'Achieved over 70% accuracy',
      color: 'from-cyan-400 to-blue-500',
    });
  }

  if (maxCombo >= 4) {
    badges.push({
      id: 'combo-king',
      icon: '🔥',
      name: 'Laser Combo Master',
      desc: 'Maintained 4x+ combo streak',
      color: 'from-orange-400 to-rose-500',
    });
  }

  badges.push({
    id: 'cadet',
    icon: '⚡',
    name: 'Cyber Cadet',
    desc: 'Completed target shooting simulation',
    color: 'from-purple-400 to-indigo-500',
  });

  const wrongAnswers = answersHistory.filter((h) => !h.isCorrect);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto p-4 md:p-8"
    >
      <div className="relative rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 md:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-2"
            >
              <Trophy className="w-10 h-10" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white">
              {isGameOver ? 'ROUND DEBRIEF COMPLETE' : 'MISSION ACCOMPLISHED!'}
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
              {isGameOver
                ? 'Great effort in the arcade grid! Review missed targets below to lock in the concepts.'
                : 'Outstanding targeting cadence! All simulation objectives have been evaluated.'}
            </p>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {/* Score */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Total Score
              </span>
              <div className="text-2xl md:text-3xl font-black font-display text-white mt-1">
                {score.toLocaleString()}
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">Points Earned</span>
            </div>

            {/* Accuracy */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Accuracy
              </span>
              <div
                className={`text-2xl md:text-3xl font-black font-display mt-1 ${
                  accuracy >= 80
                    ? 'text-emerald-400'
                    : accuracy >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {accuracy}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {correctCount} / {totalQuestions} targets
              </span>
            </div>

            {/* Total XP */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                XP Gained
              </span>
              <div className="text-2xl md:text-3xl font-black font-display text-amber-400 mt-1 flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
                +{xpEarned}
              </div>
              <span className="text-[10px] text-amber-300 font-mono">Level Progress</span>
            </div>

            {/* Max Combo */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Peak Combo
              </span>
              <div className="text-2xl md:text-3xl font-black font-display text-rose-400 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-rose-500 text-rose-500 inline" />
                ×{maxCombo}
              </div>
              <span className="text-[10px] text-rose-300 font-mono">Streak Multiplier</span>
            </div>
          </div>

          {/* Badges Unlocked Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Badges & Commendations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${b.color} flex items-center justify-center text-xl shadow-md`}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{b.name}</h4>
                    <p className="text-[11px] text-slate-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Learning Recommendations */}
          {adaptiveResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-3"
            >
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                Adaptive Learning Path Recommendation
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  {adaptiveResult.title || 'Recommended Practice Focus'}
                </h4>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  {adaptiveResult.reason ||
                    'Based on your accuracy in this arcade session, we recommend strengthening this concept to level up your mastery.'}
                </p>
              </div>

              {adaptiveResult.actionText && (
                <div className="pt-2">
                  <button
                    onClick={onExit}
                    className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:bg-cyan-900/50 transition-colors"
                  >
                    <span>{adaptiveResult.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Review Mistakes Section */}
          {wrongAnswers.length > 0 && (
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/50">
              <button
                onClick={() => setShowReview(!showReview)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-bold text-slate-200">
                    Review Mistaken Targets ({wrongAnswers.length})
                  </span>
                </div>
                {showReview ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {showReview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 pt-0 space-y-3"
                  >
                    {wrongAnswers.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5"
                      >
                        <div className="font-semibold text-white">
                          #{idx + 1}. {item.question.question}
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                          <span className="text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                            Your Shot: {item.selectedAnswer}
                          </span>
                          <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                            Correct: {item.question.correctAnswer}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1 leading-relaxed">
                          💡 {item.question.explanation}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Action Footer Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={onRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-all active:scale-95 shadow-lg"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              Replay Simulation
            </button>

            <button
              onClick={onExit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all active:scale-95"
            >
              <span>Return to Learning Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizResult;
