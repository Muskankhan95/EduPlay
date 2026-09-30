import React, { useEffect, useRef, useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Code2,
  HelpCircle,
  Zap,
  Terminal,
  Target,
  Crosshair,
  Flame,
} from 'lucide-react';
import { triggerCelebration } from '../../utils/confetti';
import { soundFx } from '../../utils/sound';

export const LessonPlayerModal = () => {
  const {
    activeLessonModal,
    setActiveLessonModal,
    completeLesson,
    sampleLessonContent,
  } = useLearning();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizMode, setQuizMode] = useState('arcade'); // 'arcade' | 'standard'
  const [userCode, setUserCode] = useState(sampleLessonContent.steps[2].starterCode);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [simulatorStatus, setSimulatorStatus] = useState("idle"); // idle, success, error
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const quizAdvanceTimeoutRef = useRef(null);
  const quizSubmissionLockedRef = useRef(false);
  const currentStepIndexRef = useRef(currentStepIndex);
  const nextStepRef = useRef(null);
  currentStepIndexRef.current = currentStepIndex;

  const currentStep = sampleLessonContent.steps[currentStepIndex];
  const totalSteps = sampleLessonContent.steps.length;

  const handleNextStep = () => {
    soundFx.playClick();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      quizSubmissionLockedRef.current = false;
    }
  };
  nextStepRef.current = handleNextStep;

  useEffect(() => {
    if (!quizSubmitted || currentStepIndex >= totalSteps - 1) return undefined;
    const selectedOption = currentStep.options?.find((option) => option.id === selectedQuizOption);
    if (!selectedOption?.correct) return undefined;

    const answeredStepIndex = currentStepIndex;
    quizAdvanceTimeoutRef.current = setTimeout(() => {
      if (currentStepIndexRef.current === answeredStepIndex) {
        nextStepRef.current?.();
      }
    }, 700);

    return () => {
      clearTimeout(quizAdvanceTimeoutRef.current);
      quizAdvanceTimeoutRef.current = null;
    };
  }, [currentStep, currentStepIndex, quizSubmitted, selectedQuizOption, totalSteps]);

  useEffect(() => () => clearTimeout(quizAdvanceTimeoutRef.current), []);

  if (!activeLessonModal) return null;

  const handlePrevStep = () => {
    soundFx.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      quizSubmissionLockedRef.current = false;
    }
  };

  const handleGoToStep = (stepIndex) => {
    setCurrentStepIndex(stepIndex);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    quizSubmissionLockedRef.current = false;
  };

  const handleQuizAnswer = (optionId) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(optionId);
  };

  const handleQuizSubmit = () => {
    if (quizSubmissionLockedRef.current) return;
    quizSubmissionLockedRef.current = true;
    setQuizSubmitted(true);
    const chosen = currentStep.options.find(o => o.id === selectedQuizOption);
    if (chosen?.correct) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  const handleRunCode = () => {
    soundFx.playClick();
    setConsoleOutput("Executing Python runtime virtual sandbox...\n");

    setTimeout(() => {
      // Check if user code has even number squaring logic
      if (userCode.includes("% 2 == 0") || userCode.includes("% 2 ==0") || userCode.includes("even")) {
        setConsoleOutput(">>> Running tests with [1, 2, 3, 4, 5, 6]...\nResult: [4, 16, 36]\n\n[PASS] All 3 unit test suites passed! (Execution time: 14ms)");
        setSimulatorStatus("success");
        soundFx.playSuccess();
      } else {
        setConsoleOutput(">>> Running tests with [1, 2, 3, 4, 5, 6]...\nOutput: []\n\n[FAIL] Output did not match expected [4, 16, 36]. Did you check for even numbers using `% 2 == 0`?");
        setSimulatorStatus("error");
        soundFx.playError();
      }
    }, 400);
  };

  const handleFinishLesson = () => {
    completeLesson("py-101", "py-l-22", sampleLessonContent.xpReward);
    setIsLessonFinished(true);
    triggerCelebration();
  };

  const handleClose = () => {
    clearTimeout(quizAdvanceTimeoutRef.current);
    quizAdvanceTimeoutRef.current = null;
    quizSubmissionLockedRef.current = false;
    setActiveLessonModal(null);
    setCurrentStepIndex(0);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setSimulatorStatus("idle");
    setConsoleOutput("");
    setIsLessonFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
              🐍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-600">{sampleLessonContent.moduleTitle}</span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-amber-500" /> +{sampleLessonContent.xpReward} XP
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{sampleLessonContent.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Step Pills */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
              {sampleLessonContent.steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGoToStep(idx)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currentStepIndex === idx
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Step {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-indigo-600 h-1.5 transition-all duration-300 rounded-r-full"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {isLessonFinished ? (
            /* Lesson Finished Celebration Screen */
            <div className="text-center py-10 max-w-lg mx-auto animate-scaleUp">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-2 inline-block">
                Quest Completed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                Lesson Mastered!
              </h2>
              <p className="text-slate-600 text-sm mb-6">
                You've conquered Loops and Iterations in Python! You gained <span className="font-bold text-indigo-600">+{sampleLessonContent.xpReward} XP</span> and increased your course completion to <span className="font-bold text-emerald-600">68%</span>.
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 flex items-center justify-around">
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-semibold uppercase">XP Earned</span>
                  <p className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 fill-amber-500" /> +{sampleLessonContent.xpReward}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Daily Streak</span>
                  <p className="text-xl font-black text-rose-500">14 Days 🔥</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Accuracy</span>
                  <p className="text-xl font-black text-emerald-600">100%</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                Return to Course Hub
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: CONCEPT WALKTHROUGH */}
              {currentStep.type === "concept" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                    <BookOpen className="w-5 h-5" />
                    <span>Concept Breakdown</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900">{currentStep.title}</h3>
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                    {currentStep.content}
                  </p>

                  <div className="bg-slate-900 rounded-2xl p-5 font-mono text-xs sm:text-sm text-slate-200 shadow-inner border border-slate-800">
                    <div className="text-xs text-slate-400 border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
                      <span>Python 3.12 syntax</span>
                      <span className="text-indigo-400 font-bold">iteration_demo.py</span>
                    </div>
                    <pre className="text-emerald-400 overflow-x-auto leading-relaxed">
                      {currentStep.codeExample}
                    </pre>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-amber-800">
                      <strong className="font-semibold text-amber-900">Pro Tip: </strong>
                      {currentStep.tip}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: QUIZ CHALLENGE */}
              {currentStep.type === "quiz" && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                      <HelpCircle className="w-5 h-5" />
                      <span>Check Your Understanding</span>
                    </div>

                    {/* Mode Toggle: Target Blaster Arcade vs Standard */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setQuizMode('arcade')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                          quizMode === 'arcade'
                            ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>Target Blaster 🎯</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuizMode('standard')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                          quizMode === 'standard'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Standard</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900">{currentStep.title}</h3>

                  <div className="bg-slate-900 rounded-2xl p-4 text-sm font-medium text-white shadow-md border border-slate-800">
                    <pre className="font-mono text-xs sm:text-sm bg-slate-950 text-emerald-400 p-3 rounded-xl mb-2 overflow-x-auto border border-slate-800">
                      {`for i in range(1, 6, 2):\n    print(i, end=' ')`}
                    </pre>
                    <p className="font-semibold text-slate-200">
                      {quizMode === 'arcade'
                        ? '🎯 Aim crosshair and shoot the target with the correct output:'
                        : 'What will this loop output?'}
                    </p>
                  </div>

                  {/* Target Blaster Arcade Mode: Floating Interactive Targets */}
                  {quizMode === 'arcade' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/20 shadow-inner">
                      {currentStep.options.map((opt, idx) => {
                        const isSelected = selectedQuizOption === opt.id;
                        const isCorrect = opt.correct;
                        let targetClass =
                          "border-cyan-500/40 hover:border-cyan-300 bg-slate-900/90 text-white hover:scale-[1.03]";

                        if (quizSubmitted) {
                          if (isCorrect) {
                            targetClass = "border-emerald-400 bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-400";
                          } else if (isSelected && !isCorrect) {
                            targetClass = "border-rose-500 bg-rose-950/80 text-rose-200 ring-2 ring-rose-400";
                          } else {
                            targetClass = "border-slate-800 bg-slate-950/60 text-slate-500 opacity-40";
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={quizSubmitted}
                            onClick={() => {
                              if (quizSubmissionLockedRef.current) return;
                              quizSubmissionLockedRef.current = true;
                              soundFx.playLaserShoot();
                              handleQuizAnswer(opt.id);
                              setQuizSubmitted(true);
                              if (opt.correct) {
                                soundFx.playTargetExplosion();
                                setTimeout(() => soundFx.playSuccess(), 100);
                              } else {
                                soundFx.playError();
                              }
                            }}
                            className={`relative p-5 rounded-2xl border-2 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-crosshair group ${targetClass}`}
                          >
                            <div className="w-10 h-10 rounded-full border border-dashed border-cyan-400/60 flex items-center justify-center group-hover:rotate-45 transition-transform text-lg">
                              🎯
                            </div>
                            <span className="font-mono font-bold text-base">{opt.text}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300 opacity-0 group-hover:opacity-100 flex items-center gap-1">
                              <Crosshair className="w-3 h-3" />
                              <span>CLICK TO SHOOT</span>
                            </span>
                            {quizSubmitted && isCorrect && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
                                DIRECT HIT!
                              </span>
                            )}
                            {quizSubmitted && isSelected && !isCorrect && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px]">
                                MISS!
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Standard Quiz View */
                    <div className="space-y-3">
                      {currentStep.options.map(opt => {
                        const isSelected = selectedQuizOption === opt.id;
                        const isCorrect = opt.correct;
                        let btnStyle = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700";

                        if (isSelected) {
                          btnStyle = "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500";
                        }
                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500";
                          } else if (isSelected && !isCorrect) {
                            btnStyle = "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500";
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={quizSubmitted}
                            onClick={() => handleQuizAnswer(opt.id)}
                            className={`w-full text-left p-4 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-mono">{opt.text}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            )}
                            {quizSubmitted && isSelected && !isCorrect && (
                              <AlertCircle className="w-5 h-5 text-rose-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!quizSubmitted && quizMode === 'standard' ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={!selectedQuizOption}
                      className={`w-full py-3.5 rounded-2xl font-bold text-white transition-all cursor-pointer ${
                        selectedQuizOption
                          ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25'
                          : 'bg-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : null}

                  {quizSubmitted && (
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs sm:text-sm">
                      <strong className="block mb-1 text-indigo-950 font-bold">Explanation:</strong>
                      {currentStep.explanation}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: CODE SIMULATOR */}
              {currentStep.type === "simulator" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                      <Code2 className="w-5 h-5" />
                      <span>Live Simulation Lab</span>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                      Python Runtime 3.12
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900">{currentStep.title}</h3>
                  <p className="text-slate-700 text-sm">{currentStep.instructions}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Code Editor */}
                    <div className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 text-xs text-slate-400 border-b border-slate-800">
                        <span className="font-mono">solution.py</span>
                        <button
                          onClick={() => setUserCode(sampleLessonContent.steps[2].starterCode)}
                          className="flex items-center gap-1 hover:text-slate-200 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                      </div>
                      <textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        rows={10}
                        className="w-full bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm p-4 outline-none resize-none leading-relaxed"
                        spellCheck="false"
                      />
                      <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Target output: <code className="text-amber-400">[4, 16, 36]</code></span>
                        <button
                          onClick={handleRunCode}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" /> Run Code
                        </button>
                      </div>
                    </div>

                    {/* Console Output */}
                    <div className="flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-xs text-slate-400 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-slate-400" />
                          <span>Console & Test Suite</span>
                        </div>
                        {simulatorStatus === 'success' && (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Tests Passed
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex-1 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap min-h-[180px]">
                        {consoleOutput || "Click 'Run Code' to execute tests and view console evaluation..."}
                      </div>

                      <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400">
                        💡 <span className="text-slate-300">{currentStep.hint}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation */}
        {!isLessonFinished && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentStepIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="text-xs text-slate-400 font-semibold">
              Step {currentStepIndex + 1} of {totalSteps}
            </div>

            {currentStepIndex < totalSteps - 1 ? (
              <button
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishLesson}
                disabled={simulatorStatus !== 'success'}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  simulatorStatus === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 animate-pulse-subtle'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Lesson & Claim XP</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
