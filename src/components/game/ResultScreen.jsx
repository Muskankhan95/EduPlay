import React from 'react';
import {
  Trophy,
  Star,
  Zap,
  Flame,
  RotateCcw,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ResultScreen = ({
  isGameOver = false,
  score = 0,
  xpEarned = 0,
  correctCount = 0,
  totalQuestions = 10,
  maxStreak = 0,
  userLevel = 7,
  onPlayAgain,
  onNextChallenge,
  onReviewMistakes,
  onBackToGames,
  isBossDefeated = false,
}) => {
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Star calculation (1 to 5 stars)
  let stars = 1;
  if (accuracy >= 90) stars = 5;
  else if (accuracy >= 75) stars = 4;
  else if (accuracy >= 60) stars = 3;
  else if (accuracy >= 40) stars = 2;

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl text-white text-center space-y-6 animate-scaleUp">
      {/* Icon Badge */}
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        {isGameOver ? (
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-4xl shadow-lg shadow-rose-500/20">
            💔
          </div>
        ) : isBossDefeated ? (
          <div className="w-22 h-22 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-glow-gold animate-bounce">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-glow-primary">
            <Trophy className="w-10 h-10 text-amber-300" />
          </div>
        )}
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
          {isGameOver
            ? "Game Over!"
            : isBossDefeated
            ? "🏆 BOSS DEFEATED!"
            : accuracy >= 80
            ? "🎉 Great Job!"
            : "Quest Completed!"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {isGameOver
            ? "You ran out of lives, but don't worry! Review your mistakes and level up."
            : isBossDefeated
            ? "You conquered the Python Loops Titan! Functions & Scope track is now unlocked."
            : "You successfully cleared all questions in this session."}
        </p>
      </div>

      {/* Star Rating Display (only if not game over) */}
      {!isGameOver && (
        <div className="flex items-center justify-center gap-1.5 py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform ${
                i < stars
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>
      )}

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
          <p className="text-base sm:text-xl font-black font-mono text-white mt-0.5">{score}</p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
          <p
            className={`text-base sm:text-xl font-black font-mono mt-0.5 ${
              accuracy >= 75 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {accuracy}%
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Streak</span>
          <p className="text-base sm:text-xl font-black font-mono text-rose-400 mt-0.5 flex items-center justify-center gap-0.5">
            <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
            {maxStreak}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP Earned</span>
          <p className="text-base sm:text-xl font-black font-mono text-amber-400 mt-0.5 flex items-center justify-center gap-0.5">
            <Zap className="w-4 h-4 fill-amber-400" />
            +{xpEarned}
          </p>
        </div>
      </div>

      {/* Level Progression Indicator */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-left space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-indigo-300">Level Progression</span>
          <span className="text-white">Level {userLevel} → Level {userLevel + 1}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, accuracy + 20)}%` }}
          />
        </div>
      </div>

      {/* Badges / Rewards unlocked banner */}
      {isBossDefeated ? (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 flex items-center gap-3 text-left">
          <div className="text-2xl">👑</div>
          <div>
            <h4 className="text-xs font-black text-amber-300 uppercase">Boss Slayer Badge Unlocked!</h4>
            <p className="text-[11px] text-slate-300">Awarded for conquering the Python Loops Titan.</p>
          </div>
        </div>
      ) : accuracy >= 80 ? (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center gap-3 text-left">
          <div className="text-2xl">🏆</div>
          <div>
            <h4 className="text-xs font-black text-emerald-300 uppercase">Quiz Master Badge Unlocked!</h4>
            <p className="text-[11px] text-slate-300">+300 XP bonus added to your weekly league score.</p>
          </div>
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        {!isGameOver && onNextChallenge ? (
          <button
            onClick={onNextChallenge}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Next Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onBackToGames}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Back to Games</span>
          </button>
        )}
      </div>

      {/* Review Mistakes Button */}
      {onReviewMistakes && (
        <div>
          <button
            onClick={onReviewMistakes}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Review Question Explanations & Mistakes</span>
          </button>
        </div>
      )}
    </div>
  );
};
