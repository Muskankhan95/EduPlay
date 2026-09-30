import { useState, useEffect, useRef, useCallback } from 'react';
import { targetBlasterQuestions, targetBlasterConfig } from '../data/targetBlasterData';
import { soundFx } from '../utils/sound';
import { triggerCelebration, triggerStars } from '../utils/confetti';
import { completeQuizAPI, getTargetBlasterDataAPI } from '../services/api';

export const useTargetBlaster = ({
  customQuestions = null,
  userId = 'usr_101',
  initialDifficulty = 'easy',
  onGameComplete = null,
  addXPToUser = null,
} = {}) => {
  // Questions pool
  const questions = customQuestions && customQuestions.length > 0
    ? customQuestions
    : targetBlasterQuestions;
  const [serverQuestions, setServerQuestions] = useState(null);
  const activeQuestions = customQuestions?.length ? customQuestions : serverQuestions || questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [lives, setLives] = useState(targetBlasterConfig.maxLives);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);

  // Difficulty: easy, medium, hard
  const [difficulty, setDifficulty] = useState(initialDifficulty);

  // Timer: 20s
  const [timeRemaining, setTimeRemaining] = useState(targetBlasterConfig.defaultTimerSeconds);
  const [timerActive, setTimerActive] = useState(true);

  // Interaction & State
  const [gameStarted, setGameStarted] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Sound settings
  const [soundMuted, setSoundMuted] = useState(false);

  // Animations & Visual effects
  const [hitEffect, setHitEffect] = useState(null); // { x, y, active, isCorrect }
  const [floatingXP, setFloatingXP] = useState(null); // { amount, text, type }
  const [hoveredTarget, setHoveredTarget] = useState(null); // Target currently locked by crosshair

  // History & analytics tracking
  const [answersHistory, setAnswersHistory] = useState([]);
  const [topicStats, setTopicStats] = useState({});
  const [gameStartTime] = useState(Date.now());
  const [adaptiveResult, setAdaptiveResult] = useState(null);

  const timerRef = useRef(null);
  const autoAdvanceTimeoutRef = useRef(null);
  const answerSubmissionLockedRef = useRef(false);
  const lastAdvancedQuestionIndexRef = useRef(null);
  const questionIndexRef = useRef(currentQuestionIndex);
  const nextQuestionRef = useRef(null);
  const questionStartTimeRef = useRef(Date.now());

  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0];
  const totalQuestions = activeQuestions.length;
  questionIndexRef.current = currentQuestionIndex;

  useEffect(() => () => clearTimeout(autoAdvanceTimeoutRef.current), []);

  useEffect(() => {
    if (customQuestions?.length) return;
    getTargetBlasterDataAPI()
      .then((response) => {
        if (response.success && Array.isArray(response.questions) && response.questions.length > 0) {
          setServerQuestions(response.questions);
        }
      })
      .catch((err) => console.error('Unable to load Target Blaster questions:', err));
  }, [customQuestions]);

  // Toggle sound
  const toggleSound = () => {
    setSoundMuted((prev) => {
      const next = !prev;
      soundFx.setSoundEnabled(!next);
      return next;
    });
  };

  // Reset timer on new question
  useEffect(() => {
    if (!answered && !gameCompleted && !isGameOver) {
      const timerSecs = difficulty === 'hard' ? 15 : difficulty === 'medium' ? 18 : 20;
      setTimeRemaining(timerSecs);
      setTimerActive(true);
      questionStartTimeRef.current = Date.now();
    }
  }, [currentQuestionIndex, difficulty, answered, gameCompleted, isGameOver]);

  // Timer loop
  useEffect(() => {
    if (!timerActive || answered || gameCompleted || isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        if (prev <= 5 && !soundMuted) {
          soundFx.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerActive, answered, gameCompleted, isGameOver, soundMuted]);

  // Handle timeout
  const handleTimeExpired = () => {
    if (answerSubmissionLockedRef.current || answered || gameCompleted || isGameOver) return;

    answerSubmissionLockedRef.current = true;
    setAnswered(true);
    setTimerActive(false);
    setIsCorrect(false);
    setShowFeedback(true);
    setShowHint(true);
    setCombo(1);

    if (!soundMuted) soundFx.playHeartLost();

    const newLives = Math.max(0, lives - 1);
    setLives(newLives);

    setAnswersHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedAnswer: "Timed out",
        isCorrect: false,
        timeTaken: 20,
        pointsAwarded: 0,
        xpAwarded: 0,
      },
    ]);

    if (newLives === 0) {
      setIsGameOver(true);
      if (!soundMuted) soundFx.playGameOver();
    }
  };

  // Shoot an answer target
  const shootTarget = (targetAnswerText, targetCoords = null) => {
    if (
      answerSubmissionLockedRef.current ||
      answered ||
      gameCompleted ||
      isGameOver ||
      !currentQuestion
    ) return;

    answerSubmissionLockedRef.current = true;
    // Trigger laser shoot sound
    if (!soundMuted) soundFx.playLaserShoot();

    // Trigger visual hit effect
    if (targetCoords) {
      setHitEffect({
        x: targetCoords.x,
        y: targetCoords.y,
        active: true,
        isCorrect: targetAnswerText === currentQuestion.correctAnswer,
      });
      setTimeout(() => setHitEffect(null), 700);
    }

    setAnswered(true);
    setTimerActive(false);
    setSelectedAnswer(targetAnswerText);

    const timeTaken = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const correct = targetAnswerText === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    const topic = currentQuestion.topic || "General";
    setTopicStats((prev) => {
      const current = prev[topic] || { correct: 0, total: 0 };
      return {
        ...prev,
        [topic]: {
          correct: current.correct + (correct ? 1 : 0),
          total: current.total + 1,
        },
      };
    });

    if (correct) {
      // Correct shooting!
      if (!soundMuted) {
        soundFx.playTargetExplosion();
        setTimeout(() => soundFx.playSuccess(), 80);
      }

      // Fast answer bonus
      let fastBonusPoints = 0;
      let fastBonusXP = 0;
      if (timeTaken <= 5) {
        fastBonusPoints = 20;
        fastBonusXP = 10;
      } else if (timeTaken <= 10) {
        fastBonusPoints = 10;
        fastBonusXP = 5;
      }

      // Combo multiplier (1x up to 5x)
      const currentCombo = combo;
      const newCombo = Math.min(5, combo + 1);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Points calculation
      const gainedScore = (targetBlasterConfig.scorePerCorrect + fastBonusPoints) * currentCombo;
      setScore((prev) => prev + gainedScore);

      // XP calculation: 20 XP + fast bonus + streak bonus
      let gainedXP = 20 + fastBonusXP;
      let floatingText = `+${gainedXP} XP`;
      if (newCombo >= 4) {
        gainedXP += targetBlasterConfig.perfectComboBonusXP;
        floatingText = `+${gainedXP} XP (🔥 ×${newCombo} Combo Bonus!)`;
        triggerStars();
        if (!soundMuted) soundFx.playStreak(newCombo);
      }

      setXp((prev) => prev + gainedXP);
      if (addXPToUser) addXPToUser(gainedXP, "Target Blaster Shot");

      setFloatingXP({
        amount: gainedXP,
        text: floatingText,
        type: 'correct',
      });
      setTimeout(() => setFloatingXP(null), 1800);

      setShowHint(false);

      // Add to history
      setAnswersHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          selectedAnswer: targetAnswerText,
          isCorrect: true,
          timeTaken,
          pointsAwarded: gainedScore,
          xpAwarded: gainedXP,
        },
      ]);

      const answeredQuestionIndex = currentQuestionIndex;
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        if (questionIndexRef.current === answeredQuestionIndex) {
          nextQuestionRef.current?.();
        }
      }, 700);
    } else {
      // Incorrect shooting: target shakes, loses 1 life, combo resets to x1
      if (!soundMuted) soundFx.playHeartLost();

      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setCombo(1); // combo resets to x1
      setShowHint(true);

      setFloatingXP({
        amount: 0,
        text: "💔 Target Missed!",
        type: 'incorrect',
      });
      setTimeout(() => setFloatingXP(null), 1800);

      // Add to history
      setAnswersHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          selectedAnswer: targetAnswerText,
          isCorrect: false,
          timeTaken,
          pointsAwarded: 0,
          xpAwarded: 0,
        },
      ]);

      if (newLives === 0) {
        setIsGameOver(true);
        if (!soundMuted) soundFx.playGameOver();
      }
    }
  };

  // Next Question
  const nextQuestion = () => {
    if (lastAdvancedQuestionIndexRef.current === currentQuestionIndex) return;
    lastAdvancedQuestionIndexRef.current = currentQuestionIndex;
    clearTimeout(autoAdvanceTimeoutRef.current);
    autoAdvanceTimeoutRef.current = null;
    answerSubmissionLockedRef.current = false;

    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setShowHint(false);
    setAnswered(false);

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishGame();
    }
  };
  nextQuestionRef.current = nextQuestion;

  // Retry same question after hint (if lives remain)
  const retryQuestion = () => {
    if (lives <= 0) return;
    clearTimeout(autoAdvanceTimeoutRef.current);
    autoAdvanceTimeoutRef.current = null;
    answerSubmissionLockedRef.current = false;
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setAnswered(false);
    setTimerActive(true);
    questionStartTimeRef.current = Date.now();
  };

  // Finish Game & trigger Backend / Adaptive Integration
  const finishGame = useCallback(async () => {
    setGameCompleted(true);
    setTimerActive(false);

    const correctAnswers = answersHistory.filter((h) => h.isCorrect).length;
    const wrongAnswers = answersHistory.length - correctAnswers;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const totalTimeTaken = Math.round((Date.now() - gameStartTime) / 1000);

    // Completion XP
    const finalXP = xp + targetBlasterConfig.completionXP;
    setXp(finalXP);
    if (addXPToUser) addXPToUser(targetBlasterConfig.completionXP, "Target Blaster Completion");

    if (!soundMuted) {
      soundFx.playLevelUp();
      triggerCelebration();
    }

    // Backend payload conforming to specification
    const payload = {
      userId,
      quizId: 'target-blaster-arcade',
      score,
      accuracy,
      xpEarned: finalXP,
      timeTaken: totalTimeTaken,
      correctAnswers,
      wrongAnswers,
      maxCombo,
      completedAt: new Date().toISOString(),
      topicStats,
    };

    let recommendation;
    try {
      const res = await completeQuizAPI(payload);
      recommendation = res.adaptiveRecommendation;
    } catch (err) {
      console.error('Unable to save Target Blaster results:', err);
    }
    if (recommendation) {
      setAdaptiveResult(recommendation);
    }

    if (onGameComplete) {
      onGameComplete({
        score,
        accuracy,
        xpEarned: finalXP,
        correctAnswers,
        wrongAnswers,
        maxCombo,
        adaptiveRecommendation: recommendation,
      });
    }
  }, [answersHistory, totalQuestions, gameStartTime, xp, addXPToUser, soundMuted, userId, score, maxCombo, topicStats, onGameComplete]);

  // Restart
  const restartGame = () => {
    clearTimeout(autoAdvanceTimeoutRef.current);
    autoAdvanceTimeoutRef.current = null;
    answerSubmissionLockedRef.current = false;
    lastAdvancedQuestionIndexRef.current = null;
    setCurrentQuestionIndex(0);
    setScore(0);
    setXp(0);
    setLives(targetBlasterConfig.maxLives);
    setCombo(1);
    setMaxCombo(1);
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setShowHint(false);
    setGameCompleted(false);
    setIsGameOver(false);
    setAnswersHistory([]);
    setTopicStats({});
    setHitEffect(null);
    setFloatingXP(null);
    setAdaptiveResult(null);
    setTimeRemaining(targetBlasterConfig.defaultTimerSeconds);
    setTimerActive(true);
    questionStartTimeRef.current = Date.now();
    if (!soundMuted) soundFx.playClick();
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    score,
    xp,
    lives,
    maxLives: targetBlasterConfig.maxLives,
    combo,
    maxCombo,
    timeRemaining,
    defaultTimerSeconds: targetBlasterConfig.defaultTimerSeconds,
    difficulty,
    setDifficulty,
    answered,
    gameStarted,
    gameCompleted,
    isGameOver,
    selectedAnswer,
    isCorrect,
    showFeedback,
    showHint,
    hoveredTarget,
    setHoveredTarget,
    hitEffect,
    floatingXP,
    answersHistory,
    topicStats,
    adaptiveResult,
    soundMuted,
    toggleSound,
    shootTarget,
    nextQuestion,
    retryQuestion,
    restartGame,
  };
};
