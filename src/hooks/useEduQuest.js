import { useState, useEffect, useRef, useCallback } from 'react';
import { eduQuestWorlds, eduQuestLevels } from '../data/eduQuestData';
import { soundFx } from '../utils/sound';
import { triggerCelebration, triggerStars } from '../utils/confetti';
import { completeQuizAPI } from '../services/api';

export const useEduQuest = ({
  initialWorldId = 'python-world',
  initialLevelId = 'py-level-1',
  userId = 'usr_101',
  courses = [],
  addXPToUser = null,
  onQuestComplete = null,
} = {}) => {
  // Worlds & Selected World
  const [currentWorldId, setCurrentWorldId] = useState(initialWorldId);
  const currentWorld =
    eduQuestWorlds.find((w) => w.id === currentWorldId) || eduQuestWorlds[0];

  // Completed levels from localStorage
  const [completedLevels, setCompletedLevels] = useState(() => {
    try {
      const saved = localStorage.getItem('eduplay_quest_completed_levels');
      return saved ? JSON.parse(saved) : ['py-level-1']; // level 1 completed or start
    } catch {
      return [];
    }
  });

  // Check if a level is unlocked
  const isLevelUnlocked = useCallback(
    (level) => {
      if (!level) return false;
      // Level 1 is always unlocked by default
      if (level.levelNumber === 1 || level.unlockedByDefault) return true;
      // Already completed
      if (completedLevels.includes(level.id)) return true;
      // Prerequisite level completed?
      if (level.prereqLevelId && !completedLevels.includes(level.prereqLevelId)) {
        return false;
      }
      // Check courses prerequisite
      if (level.prerequisiteCourse && level.prerequisiteModuleId && courses.length > 0) {
        const course = courses.find((c) => c.id === level.prerequisiteCourse);
        const mod = course?.modules?.find((m) => m.id === level.prerequisiteModuleId);
        if (mod && mod.lessons) {
          const allCompleted = mod.lessons.every((l) => l.completed);
          if (allCompleted) return true;
        }
      }
      return false;
    },
    [completedLevels, courses]
  );

  // Selected Level
  const worldLevels = eduQuestLevels[currentWorldId] || eduQuestLevels['python-world'];
  const [currentLevelId, setCurrentLevelId] = useState(initialLevelId);
  const currentLevel =
    worldLevels.find((lvl) => lvl.id === currentLevelId) || worldLevels[0];

  // Chambers & Exploration State
  const initialChamberId = currentLevel?.chambers?.[0]?.id || 'chamber-1';
  const [currentChamberId, setCurrentChamberId] = useState(initialChamberId);

  // Clue & Inventory State
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [discoveredClues, setDiscoveredClues] = useState([]);
  const [inspectedObjects, setInspectedObjects] = useState([]);
  const [unlockedDoors, setUnlockedDoors] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Gameplay Metrics
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [lives, setLives] = useState(3);
  const [maxLives] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakesHistory, setMistakesHistory] = useState([]);

  // Time tracking
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // UI Interactive Modals
  const [activeInspection, setActiveInspection] = useState(null); // { object, message, hint }
  const [activeChallenge, setActiveChallenge] = useState(null); // { clue, question }
  const [challengeFeedback, setChallengeFeedback] = useState(null); // { isCorrect, message, explanation }
  const [revealedHintIndex, setRevealedHintIndex] = useState(-1);
  const [treasureFound, setTreasureFound] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [adaptiveResult, setAdaptiveResult] = useState(null);

  const levelStartTimeRef = useRef(Date.now());
  const timerRef = useRef(null);
  const autoProceedTimeoutRef = useRef(null);
  const levelCompletionTimeoutRef = useRef(null);
  const challengeAnsweredRef = useRef(false);
  const lastProceededClueIndexRef = useRef(null);
  const proceedToNextClueRef = useRef(null);
  const handleLevelCompleteRef = useRef(null);

  // Current active clue in the chain
  const cluesList = currentLevel?.clues || [];
  const currentClue = cluesList[currentClueIndex] || null;
  const isLastClue = currentClueIndex >= cluesList.length - 1;

  // Sync initial chamber when level changes
  useEffect(() => {
    if (currentLevel?.chambers?.[0]?.id) {
      setCurrentChamberId(currentLevel.chambers[0].id);
      setCurrentClueIndex(0);
      setDiscoveredClues([]);
      setInspectedObjects([]);
      setUnlockedDoors([]);
      setInventory([]);
      setScore(0);
      setXpEarned(0);
      setLives(3);
      setHintsUsed(0);
      setMistakesHistory([]);
      setTimeElapsed(0);
      setTreasureFound(false);
      setLevelCompleted(false);
      setIsGameOver(false);
      setActiveInspection(null);
      setActiveChallenge(null);
      setChallengeFeedback(null);
      setRevealedHintIndex(-1);
      setTimerActive(true);
      clearTimeout(autoProceedTimeoutRef.current);
      clearTimeout(levelCompletionTimeoutRef.current);
      challengeAnsweredRef.current = false;
      lastProceededClueIndexRef.current = null;
      levelStartTimeRef.current = Date.now();
    }
  }, [currentLevelId]);

  // Timer loop
  useEffect(() => {
    if (!timerActive || levelCompleted || isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerActive, levelCompleted, isGameOver]);

  useEffect(() => () => {
    clearTimeout(autoProceedTimeoutRef.current);
    clearTimeout(levelCompletionTimeoutRef.current);
  }, []);

  // Toggle Sound
  const toggleSound = () => {
    setSoundMuted((prev) => {
      const next = !prev;
      soundFx.setSoundEnabled(!next);
      return next;
    });
  };

  // Chamber Navigation
  const navigateChamber = (chamberId) => {
    if (chamberId === currentChamberId) return;
    if (!soundMuted) soundFx.playClick();
    setCurrentChamberId(chamberId);
    setActiveInspection(null);
  };

  // Inspect an interactive object in the chamber
  const inspectObject = (objectId) => {
    if (levelCompleted || isGameOver) return;
    const obj = currentLevel?.objects?.[objectId];
    if (!obj) return;

    // Record as inspected
    if (!inspectedObjects.includes(objectId)) {
      setInspectedObjects((prev) => [...prev, objectId]);
    }

    // Case 1: Door object
    if (obj.isDoor) {
      const isUnlocked = unlockedDoors.includes(objectId);
      if (!isUnlocked) {
        if (!soundMuted) soundFx.playError();
        setActiveInspection({
          object: obj,
          title: "Door Sealed",
          message: obj.inspectMessageLocked,
          hint: "Solve the previous chamber riddle to release the electromagnetic lock.",
          isDoor: true,
        });
        return;
      } else {
        if (!soundMuted) soundFx.playClick();
        setActiveInspection({
          object: obj,
          title: "Gateway Open",
          message: obj.inspectMessageUnlocked,
          isDoor: true,
        });
        return;
      }
    }

    // Case 2: Object requires door to be unlocked first
    if (obj.requiresDoorUnlocked && !unlockedDoors.includes('obj-chamber-door')) {
      if (!soundMuted) soundFx.playError();
      setActiveInspection({
        object: obj,
        title: "Inaccessible Area",
        message: "You cannot reach this artifact yet. The Runic Vault Gate is still sealed shut!",
        hint: "Solve the riddle in the Syntax Archives first.",
      });
      return;
    }

    // Case 3: Distractor object
    if (obj.isDistractor) {
      if (!soundMuted) soundFx.playClick();
      setActiveInspection({
        object: obj,
        title: obj.name,
        message: obj.inspectMessage,
        hint: obj.hint,
        isDistractor: true,
      });
      return;
    }

    // Case 4: Target of the CURRENT active clue
    if (currentClue && currentClue.targetObjectId === objectId) {
      if (!soundMuted) soundFx.playSecretFound();
      setActiveInspection(null);
      setRevealedHintIndex(-1);
      setChallengeFeedback(null);
      setActiveChallenge({
        clue: currentClue,
        question: currentClue.question,
      });
      return;
    }

    // Case 5: Target of an ALREADY solved clue
    const alreadySolved = discoveredClues.some((c) => c.targetObjectId === objectId);
    if (alreadySolved) {
      if (!soundMuted) soundFx.playClick();
      setActiveInspection({
        object: obj,
        title: `${obj.name} (Decoded)`,
        message: "You have already deciphered the secrets of this sacred relic. Its power remains active.",
        isSolved: true,
      });
      return;
    }

    // Case 6: Target of a FUTURE clue (not ready yet)
    if (!soundMuted) soundFx.playClick();
    setActiveInspection({
      object: obj,
      title: obj.name,
      message: `${obj.name} vibrates with dormant energy. A mysterious lock protects it from being deciphered right now.`,
      hint: `Follow your current clue: "${currentClue?.title}".`,
    });
  };

  // Submit Answer to Active Challenge / Riddle
  const submitChallengeAnswer = (selectedAnswerText) => {
    if (!activeChallenge || challengeAnsweredRef.current || levelCompleted || isGameOver) return;
    const { clue, question } = activeChallenge;
    const isCorrect = selectedAnswerText === question.correctAnswer;

    if (isCorrect) {
      challengeAnsweredRef.current = true;
      // Award XP
      const gainedXP = question.xpAward || 30;
      const gainedScore = 200 - hintsUsed * 20;

      setScore((prev) => prev + gainedScore);
      setXpEarned((prev) => prev + gainedXP);
      if (addXPToUser) addXPToUser(gainedXP, `EduQuest: ${clue.title}`);

      // Add reward item to inventory
      if (clue.rewardItem && !inventory.includes(clue.rewardItem)) {
        setInventory((prev) => [...prev, clue.rewardItem]);
      }

      // If clue unlocks a door
      if (clue.unlocksDoor) {
        setUnlockedDoors((prev) => [...prev, clue.unlocksDoor]);
        if (!soundMuted) soundFx.playDoorUnlock();
      } else {
        if (!soundMuted) soundFx.playSuccess();
      }

      // Record solved clue
      setDiscoveredClues((prev) => [...prev, clue]);

      setChallengeFeedback({
        isCorrect: true,
        message: `✨ CLUE SOLVED! +${gainedXP} XP`,
        explanation: question.explanation,
        solvedMessage: clue.solvedMessage,
        rewardItem: clue.rewardItem,
      });

      // If final treasure
      if (clue.isFinalTreasure) {
        setTreasureFound(true);
        levelCompletionTimeoutRef.current = setTimeout(() => {
          handleLevelCompleteRef.current?.();
        }, 800);
      } else {
        autoProceedTimeoutRef.current = setTimeout(() => {
          proceedToNextClueRef.current?.();
        }, 700);
      }
    } else {
      // Incorrect Answer
      if (!soundMuted) soundFx.playHeartLost();

      const newLives = Math.max(0, lives - 1);
      setLives(newLives);

      setMistakesHistory((prev) => [
        ...prev,
        {
          clueTitle: clue.title,
          question: question.text,
          userAnswer: selectedAnswerText,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        },
      ]);

      setChallengeFeedback({
        isCorrect: false,
        message: "💥 Not quite right!",
        explanation: `Look closely at the clue hint. You have ${newLives} shield charge${
          newLives !== 1 ? 's' : ''
        } remaining.`,
      });

      if (newLives === 0) {
        setIsGameOver(true);
        if (!soundMuted) soundFx.playGameOver();
      }
    }
  };
  // Next Clue after solving current challenge
  const proceedToNextClue = () => {
    if (lastProceededClueIndexRef.current === currentClueIndex) return;
    lastProceededClueIndexRef.current = currentClueIndex;
    clearTimeout(autoProceedTimeoutRef.current);
    autoProceedTimeoutRef.current = null;
    challengeAnsweredRef.current = false;
    setActiveChallenge(null);
    setChallengeFeedback(null);
    setRevealedHintIndex(-1);

    if (currentClueIndex + 1 < cluesList.length) {
      const nextIdx = currentClueIndex + 1;
      setCurrentClueIndex(nextIdx);

      // Auto guide chamber if next clue is in another chamber
      const nextClue = cluesList[nextIdx];
      if (nextClue && nextClue.targetChamberId) {
        setCurrentChamberId(nextClue.targetChamberId);
      }
    }
  };
  proceedToNextClueRef.current = proceedToNextClue;

  // Request a hint during challenge
  const requestHint = () => {
    if (!activeChallenge) return;
    const hints = activeChallenge.question?.hints || [];
    if (revealedHintIndex < hints.length - 1) {
      setHintsUsed((prev) => prev + 1);
      setRevealedHintIndex((prev) => prev + 1);
      if (!soundMuted) soundFx.playClick();
    }
  };

  // Level Complete Handler
  const handleLevelComplete = useCallback(async () => {
    setLevelCompleted(true);
    setTimerActive(false);

    // Save to completed levels
    setCompletedLevels((prev) => {
      const next = Array.from(new Set([...prev, currentLevel.id]));
      localStorage.setItem('eduplay_quest_completed_levels', JSON.stringify(next));
      return next;
    });

    // Sound and celebration
    if (!soundMuted) {
      soundFx.playChestOpen();
      setTimeout(() => soundFx.playLevelUp(), 400);
      triggerCelebration();
    }

    // Total XP with completion bonus
    const finalBonusXP = currentLevel.finalTreasure?.xpBonus || 150;
    const totalXP = xpEarned + finalBonusXP;
    setXpEarned(totalXP);
    if (addXPToUser) addXPToUser(finalBonusXP, `EduQuest: Treasure Found (${currentLevel.title})`);

    const correctAnswersCount = cluesList.length;
    const totalAttempts = correctAnswersCount + mistakesHistory.length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAnswersCount / totalAttempts) * 100) : 100;

    let recommendation;
    try {
      const res = await completeQuizAPI({
        userId,
        quizId: `eduquest-${currentLevel.id}`,
        score: score + 500,
        accuracy,
        xpEarned: totalXP,
        timeTaken: timeElapsed,
        correctAnswers: correctAnswersCount,
        wrongAnswers: mistakesHistory.length,
        maxCombo: 1,
        topicStats: {
          [currentLevel.topic || 'Python Basics']: {
            correct: correctAnswersCount,
            total: totalAttempts,
          },
        },
        });
      recommendation = res.adaptiveRecommendation;
    } catch (err) {
      console.error('Unable to save EduQuest results:', err);
    }

    if (recommendation) {
      setAdaptiveResult(recommendation);
    }

    if (onQuestComplete) {
      onQuestComplete({
        levelId: currentLevel.id,
        worldId: currentWorldId,
        score: score + 500,
        xpEarned: totalXP,
        accuracy,
        adaptiveRecommendation: recommendation,
        timeElapsed,
        hintsUsed,
      });
    }
  }, [
    currentLevel,
    currentWorldId,
    soundMuted,
    xpEarned,
    addXPToUser,
    cluesList.length,
    mistakesHistory.length,
    userId,
    score,
    timeElapsed,
    hintsUsed,
    onQuestComplete,
  ]);
  handleLevelCompleteRef.current = handleLevelComplete;

  // Restart Current Level
  const restartLevel = () => {
    clearTimeout(autoProceedTimeoutRef.current);
    clearTimeout(levelCompletionTimeoutRef.current);
    autoProceedTimeoutRef.current = null;
    levelCompletionTimeoutRef.current = null;
    challengeAnsweredRef.current = false;
    lastProceededClueIndexRef.current = null;
    setCurrentClueIndex(0);
    setDiscoveredClues([]);
    setInspectedObjects([]);
    setUnlockedDoors([]);
    setInventory([]);
    setScore(0);
    setXpEarned(0);
    setLives(3);
    setHintsUsed(0);
    setMistakesHistory([]);
    setTimeElapsed(0);
    setTreasureFound(false);
    setLevelCompleted(false);
    setIsGameOver(false);
    setActiveInspection(null);
    setActiveChallenge(null);
    setChallengeFeedback(null);
    setRevealedHintIndex(-1);
    setTimerActive(true);
    levelStartTimeRef.current = Date.now();
    if (currentLevel?.chambers?.[0]?.id) {
      setCurrentChamberId(currentLevel.chambers[0].id);
    }
    if (!soundMuted) soundFx.playClick();
  };

  // Close modals
  const closeInspection = () => setActiveInspection(null);
  const closeChallenge = () => {
    clearTimeout(autoProceedTimeoutRef.current);
    autoProceedTimeoutRef.current = null;
    challengeAnsweredRef.current = false;
    setActiveChallenge(null);
    setChallengeFeedback(null);
    setRevealedHintIndex(-1);
  };

  return {
    worlds: eduQuestWorlds,
    currentWorld,
    currentWorldId,
    setCurrentWorldId,
    worldLevels,
    currentLevel,
    currentLevelId,
    setCurrentLevelId,
    currentChamberId,
    navigateChamber,
    currentClue,
    currentClueIndex,
    cluesList,
    discoveredClues,
    inspectedObjects,
    unlockedDoors,
    inventory,
    score,
    xpEarned,
    lives,
    maxLives,
    hintsUsed,
    mistakesHistory,
    timeElapsed,
    activeInspection,
    inspectObject,
    closeInspection,
    activeChallenge,
    challengeFeedback,
    revealedHintIndex,
    requestHint,
    submitChallengeAnswer,
    proceedToNextClue,
    closeChallenge,
    treasureFound,
    levelCompleted,
    isGameOver,
    restartLevel,
    completedLevels,
    isLevelUnlocked,
    soundMuted,
    toggleSound,
    adaptiveResult,
  };
};

export default useEduQuest;
