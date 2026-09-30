import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { questionsPool, gameModes } from '../data/gameData';
import { useGameEngine } from '../hooks/useGameEngine';
import { GameHeader } from '../components/game/GameHeader';
import { QuestionCard } from '../components/game/QuestionCard';
import { AnswerButton } from '../components/game/AnswerButton';
import { TimerBar } from '../components/game/TimerBar';
import { XPAnimation } from '../components/game/XPAnimation';
import { BossLevelView } from '../components/game/BossLevelView';
import { ResultScreen } from '../components/game/ResultScreen';
import { ReviewMistakesModal } from '../components/game/ReviewMistakesModal';
import { ConceptMatchGame } from '../components/game/ConceptMatchGame';
import { TargetBlaster } from '../components/game/TargetBlaster';
import { EduQuest } from '../components/eduquest/EduQuest';
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Zap,
  Flame,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const GameScreenPage = () => {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const { user, courses, addXP } = useLearning();

  const activeMode = gameModes.find((m) => m.id === modeId) || gameModes[0];
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // If eduquest, render the EduQuest Learning Treasure Hunt!
  if (activeMode.id === 'eduquest' || modeId === 'eduquest') {
    return (
      <EduQuest
        userId={user?.id || 'usr_101'}
        courses={courses}
        addXPToUser={(amount, reason) => addXP(amount, reason, { syncBackend: false })}
        onExit={() => navigate('/app/play')}
      />
    );
  }

  // If target-blaster, render the interactive shooting quiz arcade
  if (activeMode.id === 'target-blaster') {
    return (
      <TargetBlaster
        userId={user?.id || 'usr_101'}
        onExit={() => navigate('/app/play')}
        addXPToUser={(amount, reason) => addXP(amount, reason, { syncBackend: false })}
      />
    );
  }

  // If concept-match, render the dedicated matching arena
  if (activeMode.id === 'concept-match') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
        <ConceptMatchGame
          onExit={() => navigate('/app/play')}
          addXPToUser={addXP}
        />
      </div>
    );
  }

  // Load questions for the active mode
  const questions = questionsPool[activeMode.id] || questionsPool['quiz-challenge'];
  const isTimed = activeMode.id === 'speed-round';
  const isBoss = activeMode.id === 'boss-level';

  const engine = useGameEngine({
    gameMode: activeMode.id,
    questions,
    initialDifficulty: activeMode.difficultyLevel,
    maxLives: isBoss ? 2 : 3,
    timePerQuestion: isTimed ? 15 : null,
    addXPToUser: addXP,
  });

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    score,
    xpEarned,
    lives,
    maxLives,
    streak,
    maxStreak,
    timer,
    selectedOptionId,
    isAnswerChecked,
    answersHistory,
    bossHP,
    maxBossHP,
    floatingXP,
    streakMilestone,
    difficulty,
    adaptiveMessage,
    isGameOver,
    gameCompleted,
    submitAnswer,
    nextQuestion,
    restartGame,
  } = engine;

  // Selected option object
  const selectedOption = currentQuestion?.options?.find((o) => o.id === selectedOptionId);
  const correctOption = currentQuestion?.options?.find((o) => o.isCorrect);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-y-auto font-sans selection:bg-indigo-500 selection:text-white">
      {/* Floating XP Toast Animation */}
      <XPAnimation notification={floatingXP} />

      {/* Top Game Bar */}
      <GameHeader
        level={user.level}
        xp={user.currentXP}
        lives={lives}
        maxLives={maxLives}
        streak={streak}
        score={score}
        currentQuestionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onExit={() => navigate('/app/play')}
        gameTitle={activeMode.title}
      />

      {/* Main Game Stage */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
        {isGameOver || gameCompleted ? (
          /* Result Screen */
          <ResultScreen
            isGameOver={isGameOver}
            score={score}
            xpEarned={xpEarned}
            correctCount={answersHistory.filter((h) => h.isCorrect).length}
            totalQuestions={totalQuestions}
            maxStreak={maxStreak}
            userLevel={user.level}
            onPlayAgain={restartGame}
            onNextChallenge={() => navigate('/app/play')}
            onReviewMistakes={() => setIsReviewOpen(true)}
            onBackToGames={() => navigate('/app/play')}
            isBossDefeated={isBoss && !isGameOver}
          />
        ) : (
          /* Active Question Stage */
          <div className="w-full space-y-6 animate-fadeIn">
            {/* Speed Round Timer Bar */}
            {isTimed && (
              <TimerBar timeLeft={timer} totalTime={15} />
            )}

            {/* Boss Level Header Banner */}
            {isBoss && (
              <BossLevelView
                bossName="Python Loops Titan"
                bossHP={bossHP}
                maxBossHP={maxBossHP}
                currentQuestionNumber={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
              />
            )}

            {/* Adaptive Difficulty Toast */}
            {adaptiveMessage && (
              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{adaptiveMessage}</span>
              </div>
            )}

            {/* Question Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-md">
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
                difficulty={difficulty}
              />

              {/* Large Interactive Answer Buttons */}
              <div className="grid grid-cols-1 gap-3.5 mt-6">
                {currentQuestion?.options?.map((option, idx) => (
                  <AnswerButton
                    key={option.id}
                    option={option}
                    index={idx}
                    isSelected={selectedOptionId === option.id}
                    isAnswerChecked={isAnswerChecked}
                    onClick={() => submitAnswer(option.id)}
                    disabled={isAnswerChecked}
                  />
                ))}
              </div>
            </div>

            {/* Answer Explanation & Next Question Drawer */}
            {isAnswerChecked && (
              <div
                className={`p-5 sm:p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scaleUp ${
                  isCorrect
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="space-y-1 text-left flex-1">
                  <div className="flex items-center gap-2 font-black text-base sm:text-lg">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <span className="text-emerald-300">Spot on! Excellent logic.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-rose-400" />
                        <span className="text-rose-300">Incorrect! One life lost.</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <button
                  onClick={nextQuestion}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Review Mistakes Modal */}
      <ReviewMistakesModal
        answersHistory={answersHistory}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </div>
  );
};
