import { useState, useEffect, useRef, useCallback } from 'react';
import { soundFx } from '../utils/sound';
import { triggerCelebration, triggerStars } from '../utils/confetti';

export const useGameEngine = ({
  gameMode = 'quiz-challenge',
  questions = [],
  initialDifficulty = 'medium',
  maxLives = 3,
  timePerQuestion = null, // e.g. 15 for speed round
  onComplete = null,
  addXPToUser = null,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Timer
  const [timer, setTimer] = useState(timePerQuestion || 15);
  const [isTimerRunning, setIsTimerRunning] = useState(timePerQuestion !== null);

  // Question interaction state
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]);

  // Boss Battle state
  const isBossMode = gameMode === 'boss-level';
  const [bossHP, setBossHP] = useState(1000);
  const maxBossHP = 1000;

  // Feedback & Animations
  const [floatingXP, setFloatingXP] = useState(null); // { amount, text, type }
  const [streakMilestone, setStreakMilestone] = useState(null); // { count, message }
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [adaptiveMessage, setAdaptiveMessage] = useState(null);

  // Status flags
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const timerRef = useRef(null);
  const autoAdvanceTimeoutRef = useRef(null);
  const answerSubmissionLockedRef = useRef(false);
  const lastAdvancedQuestionIndexRef = useRef(null);
  const questionIndexRef = useRef(currentQuestionIndex);
  const nextQuestionRef = useRef(null);
  const questionStartTimeRef = useRef(Date.now());

  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;
  questionIndexRef.current = currentQuestionIndex;

  useEffect(() => () => clearTimeout(autoAdvanceTimeoutRef.current), []);

  // Reset timer on new question
  useEffect(() => {
    if (timePerQuestion !== null && !isAnswerChecked && !isGameOver && !gameCompleted) {
      setTimer(timePerQuestion);
      setIsTimerRunning(true);
      questionStartTimeRef.current = Date.now();
    }
  }, [currentQuestionIndex, timePerQuestion, isAnswerChecked, isGameOver, gameCompleted]);

  // Timer countdown loop
  useEffect(() => {
    if (timePerQuestion === null || !isTimerRunning || isAnswerChecked || isGameOver || gameCompleted) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        if (prev <= 5) {
          soundFx.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isAnswerChecked, isGameOver, gameCompleted, timePerQuestion]);

  // Handle timeout
  const handleTimeExpired = () => {
    if (answerSubmissionLockedRef.current || isAnswerChecked || isGameOver || gameCompleted) return;

    answerSubmissionLockedRef.current = true;
    setIsAnswerChecked(true);
    setIsTimerRunning(false);
    soundFx.playHeartLost();

    const newLives = Math.max(0, lives - 1);
    setLives(newLives);
    setStreak(0);

    setAnswersHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedOption: null,
        isCorrect: false,
        timeTaken: timePerQuestion,
        timeout: true,
        xpAwarded: 0,
      },
    ]);

    if (newLives === 0) {
      setIsGameOver(true);
      soundFx.playGameOver();
    }
  };

  // Submit Answer
  const submitAnswer = (optionId) => {
    if (
      answerSubmissionLockedRef.current ||
      isAnswerChecked ||
      isGameOver ||
      gameCompleted ||
      !currentQuestion
    ) return;

    answerSubmissionLockedRef.current = true;
    setIsAnswerChecked(true);
    setIsTimerRunning(false);
    setSelectedOptionId(optionId);

    const timeTaken = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const chosenOption = currentQuestion.options.find((opt) => opt.id === optionId);
    const isCorrect = chosenOption ? chosenOption.isCorrect : false;

    if (isCorrect) {
      // XP Calculation:
      // Base: +20 XP
      // Speed bonus: <=5s -> +30 XP total; <=10s -> +20 XP total; >10s -> +10 XP
      let questionXP = 20;
      let xpText = "+20 XP";

      if (timePerQuestion !== null) {
        if (timeTaken <= 5) {
          questionXP = 30;
          xpText = "+30 XP (⚡ Speed Bonus!)";
        } else if (timeTaken <= 10) {
          questionXP = 20;
          xpText = "+20 XP";
        } else {
          questionXP = 10;
          xpText = "+10 XP";
        }
      }

      // Streak Bonus: at 3 in a row -> +50 XP bonus!
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      let bonusStreakXP = 0;
      if (newStreak === 3) {
        bonusStreakXP = 50;
        setStreakMilestone({ count: 3, message: "🔥 3 STREAK! +50 XP Bonus!" });
        soundFx.playStreak(3);
      } else if (newStreak === 5) {
        bonusStreakXP = 75;
        setStreakMilestone({ count: 5, message: "🔥 5 STREAK! You're on fire!" });
        soundFx.playStreak(5);
        triggerStars();
      } else if (newStreak >= 7 && newStreak % 2 === 1) {
        bonusStreakXP = 100;
        setStreakMilestone({ count: newStreak, message: `🔥 ${newStreak} UNSTOPPABLE STREAK!` });
        soundFx.playStreak(newStreak);
      } else {
        soundFx.playSuccess();
      }

      const totalGain = questionXP + bonusStreakXP;
      setXpEarned((prev) => prev + totalGain);
      setScore((prev) => prev + 100 + (newStreak * 15) + (questionXP));

      setFloatingXP({
        amount: totalGain,
        text: bonusStreakXP > 0 ? `${xpText} & 🔥 +${bonusStreakXP} Streak Bonus!` : xpText,
        type: 'correct',
      });

      // Boss damage
      if (isBossMode) {
        const damage = Math.round(maxBossHP / totalQuestions);
        setBossHP((prev) => Math.max(0, prev - damage));
      }

      // Add to global user context immediately if available
      if (addXPToUser) {
        addXPToUser(totalGain, "Game Quest Answer");
      }
    } else {
      // Incorrect answer:
      soundFx.playHeartLost();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);

      setFloatingXP({
        amount: 0,
        text: "💔 Life Lost!",
        type: 'incorrect',
      });

      if (newLives === 0) {
        setIsGameOver(true);
        soundFx.playGameOver();
      }
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedOption: chosenOption,
        isCorrect,
        timeTaken,
        xpAwarded: isCorrect ? 20 : 0,
      },
    ]);

    if (isCorrect) {
      const answeredQuestionIndex = currentQuestionIndex;
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        if (questionIndexRef.current === answeredQuestionIndex) {
          nextQuestionRef.current?.();
        }
      }, 700);
    }
  };

  // Next Question or Finish
  const nextQuestion = () => {
    if (lastAdvancedQuestionIndexRef.current === currentQuestionIndex) return;
    lastAdvancedQuestionIndexRef.current = currentQuestionIndex;
    clearTimeout(autoAdvanceTimeoutRef.current);
    autoAdvanceTimeoutRef.current = null;
    answerSubmissionLockedRef.current = false;

    // Clear transient feedback
    setFloatingXP(null);
    setStreakMilestone(null);
    setSelectedOptionId(null);
    setIsAnswerChecked(false);

    // Rule-based adaptive difficulty calculation
    const currentCorrect = answersHistory.filter((h) => h.isCorrect).length;
    const currentAttempted = answersHistory.length;
    if (currentAttempted >= 3) {
      const accuracyRate = currentCorrect / currentAttempted;
      if (accuracyRate >= 0.8 && difficulty !== 'hard' && difficulty !== 'boss') {
        setDifficulty('hard');
        setAdaptiveMessage("Difficulty adjusted: Questions adapted to Advanced level!");
      } else if (accuracyRate < 0.5 && difficulty !== 'easy') {
        setDifficulty('easy');
        setAdaptiveMessage("Difficulty adjusted: Focused on foundational concepts.");
      }
    }

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Finished all questions!
      finishGame();
    }
  };
  nextQuestionRef.current = nextQuestion;

  // Finish Game & calculate final bonuses
  const finishGame = useCallback(() => {
    setGameCompleted(true);
    setIsTimerRunning(false);

    // Completion bonus: +100 XP base, +150 for perfect score, +250 for boss defeat
    const correctCount = answersHistory.filter((h) => h.isCorrect).length;
    const isPerfect = correctCount === totalQuestions;
    let completionXP = 100;

    if (isBossMode) {
      completionXP = 250;
      soundFx.playBossDefeat();
      triggerCelebration();
    } else if (isPerfect) {
      completionXP = 150;
      soundFx.playLevelUp();
      triggerCelebration();
    } else {
      soundFx.playSuccess();
      triggerStars();
    }

    setXpEarned((prev) => prev + completionXP);
    setScore((prev) => prev + (isPerfect ? 500 : 250));

    if (addXPToUser) {
      addXPToUser(completionXP, `${gameMode} Game Completion`);
    }

    if (onComplete) {
      onComplete({
        score: score + (isPerfect ? 500 : 250),
        xpEarned: xpEarned + completionXP,
        correctCount,
        totalQuestions,
        accuracy: Math.round((correctCount / totalQuestions) * 100),
        maxStreak,
        isPerfect,
        isBossDefeated: isBossMode && correctCount >= 7,
      });
    }
  }, [answersHistory, totalQuestions, isBossMode, addXPToUser, onComplete, score, xpEarned, maxStreak, gameMode]);

  // Restart / Try Again
  const restartGame = () => {
    clearTimeout(autoAdvanceTimeoutRef.current);
    autoAdvanceTimeoutRef.current = null;
    answerSubmissionLockedRef.current = false;
    lastAdvancedQuestionIndexRef.current = null;
    setCurrentQuestionIndex(0);
    setScore(0);
    setXpEarned(0);
    setLives(maxLives);
    setStreak(0);
    setMaxStreak(0);
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setAnswersHistory([]);
    setIsGameOver(false);
    setGameCompleted(false);
    setBossHP(maxBossHP);
    setFloatingXP(null);
    setStreakMilestone(null);
    setAdaptiveMessage(null);
    setTimer(timePerQuestion || 15);
    setIsTimerRunning(timePerQuestion !== null);
    soundFx.playClick();
  };

  return {
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
    timePerQuestion,
    isTimerRunning,
    selectedOptionId,
    isAnswerChecked,
    answersHistory,
    isBossMode,
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
  };
};
