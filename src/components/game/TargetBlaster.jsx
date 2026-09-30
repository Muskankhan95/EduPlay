import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTargetBlaster } from '../../hooks/useTargetBlaster';
import { GameHUD } from './GameHUD';
import { QuestionPanel } from './QuestionPanel';
import { AnswerTarget } from './AnswerTarget';
import { Crosshair } from './Crosshair';
import { HitEffect } from './HitEffect';
import { HintPanel } from './HintPanel';
import { GameProgress } from './GameProgress';
import { QuizResult } from './QuizResult';
import { Zap, Target, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const TargetBlaster = ({
  customQuestions = null,
  userId = 'usr_101',
  initialDifficulty = 'easy',
  onExit = () => window.history.back(),
  onComplete = null,
  addXPToUser = null,
}) => {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    score,
    xp,
    lives,
    maxLives,
    combo,
    maxCombo,
    timeRemaining,
    difficulty,
    setDifficulty,
    answered,
    gameCompleted,
    isGameOver,
    selectedAnswer,
    isCorrect,
    showFeedback,
    hoveredTarget,
    setHoveredTarget,
    hitEffect,
    floatingXP,
    answersHistory,
    adaptiveResult,
    soundMuted,
    toggleSound,
    shootTarget,
    nextQuestion,
    retryQuestion,
    restartGame,
  } = useTargetBlaster({
    customQuestions,
    userId,
    initialDifficulty,
    onGameComplete: onComplete,
    addXPToUser,
  });

  // Track laser beam shot line
  const [laserBeam, setLaserBeam] = useState(null);
  const containerRef = useRef(null);

  const handleShoot = (answerText, coords) => {
    if (answered || gameCompleted || isGameOver) return;

    // Laser beam origin from bottom center of viewport
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight - 40;

    setLaserBeam({
      x1: originX,
      y1: originY,
      x2: coords.x,
      y2: coords.y,
    });

    setTimeout(() => {
      setLaserBeam(null);
    }, 250);

    shootTarget(answerText, coords);
  };

  const correctCount = answersHistory.filter((h) => h.isCorrect).length;
  const accuracy =
    answersHistory.length > 0 ? Math.round((correctCount / answersHistory.length) * 100) : 0;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden select-none cursor-crosshair"
    >
      {/* Dynamic Laser Crosshair Cursor */}
      <Crosshair
        isHovered={Boolean(hoveredTarget)}
        isLocked={Boolean(selectedAnswer)}
      />

      {/* Radial Grid Arena Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"
      />

      {/* Laser Tracer SVG */}
      {laserBeam && (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-50">
          <line
            x1={laserBeam.x1}
            y1={laserBeam.y1}
            x2={laserBeam.x2}
            y2={laserBeam.y2}
            stroke="#06b6d4"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-pulse shadow-[0_0_20px_#06b6d4]"
          />
          <line
            x1={laserBeam.x1}
            y1={laserBeam.y1}
            x2={laserBeam.x2}
            y2={laserBeam.y2}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Hit Shockwave & Particles Effect */}
      {hitEffect && hitEffect.active && (
        <HitEffect
          x={hitEffect.x}
          y={hitEffect.y}
          isCorrect={hitEffect.isCorrect}
        />
      )}

      {/* Floating XP Toast */}
      <AnimatePresence>
        {floatingXP && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1.15 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl font-black text-sm md:text-base font-display flex items-center gap-2 shadow-2xl backdrop-blur-md border ${
              floatingXP.type === 'correct'
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                : 'bg-rose-950/90 border-rose-400 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
            }`}
          >
            {floatingXP.type === 'correct' ? (
              <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
            ) : (
              <Target className="w-5 h-5 text-rose-400" />
            )}
            <span>{floatingXP.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Game HUD */}
      <GameHUD
        lives={lives}
        maxLives={maxLives}
        xp={xp}
        combo={combo}
        score={score}
        timeRemaining={timeRemaining}
        soundMuted={soundMuted}
        onToggleSound={toggleSound}
        onExit={onExit}
        difficulty={difficulty}
        onSelectDifficulty={!answered ? setDifficulty : null}
      />

      {/* Main Game Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-4 md:py-6 max-w-5xl mx-auto w-full">
        {gameCompleted || isGameOver ? (
          <QuizResult
            score={score}
            xpEarned={xp}
            accuracy={accuracy}
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            maxCombo={maxCombo}
            answersHistory={answersHistory}
            adaptiveResult={adaptiveResult}
            isGameOver={isGameOver}
            onRestart={restartGame}
            onExit={onExit}
          />
        ) : (
          <div className="w-full flex flex-col items-center gap-5 sm:gap-7">
            {/* Question Panel */}
            <QuestionPanel
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              difficulty={difficulty}
            />

            {/* Floating Targets Grid (4 options: Stack, Queue, Array, Tree style) */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 px-2">
              {currentQuestion?.options?.map((optionText, idx) => (
                <AnswerTarget
                  key={`${currentQuestionIndex}-${idx}`}
                  answerText={optionText}
                  index={idx}
                  difficulty={difficulty}
                  isAnswered={answered}
                  isSelected={selectedAnswer === optionText}
                  isCorrect={optionText === currentQuestion.correctAnswer}
                  onShoot={handleShoot}
                  onHoverStart={(text) => setHoveredTarget(text)}
                  onHoverEnd={() => setHoveredTarget(null)}
                />
              ))}
            </div>

            {/* Hint / Feedback Panel */}
            <AnimatePresence>
              {showFeedback && (
                <div className="w-full px-2">
                  <HintPanel
                    isCorrect={isCorrect}
                    currentQuestion={currentQuestion}
                    lives={lives}
                    onRetry={retryQuestion}
                    onNext={
                      currentQuestionIndex + 1 < totalQuestions
                        ? nextQuestion
                        : () => restartGame()
                    }
                    isLastQuestion={currentQuestionIndex + 1 >= totalQuestions}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Bottom Progress Bar & Controller Bar */}
      {!gameCompleted && !isGameOver && (
        <footer className="relative z-10 w-full bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 px-4 py-3">
          <GameProgress
            currentQuestionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />
        </footer>
      )}
    </div>
  );
};

export default TargetBlaster;
