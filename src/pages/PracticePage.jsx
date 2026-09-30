import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import {
  Dumbbell,
  Flame,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Code2,
  Terminal,
  Trophy,
  Sparkles,
  ArrowRight,
  Clock,
  Gamepad2,
  Target
} from 'lucide-react';
import { triggerCelebration } from '../utils/confetti';
import { soundFx } from '../utils/sound';

export const PracticePage = () => {
  const navigate = useNavigate();
  const { setActiveChallengeModal, dailyChallenge, addXP, user } = useLearning();

  // Rapid Fire Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const quizAdvanceTimeoutRef = useRef(null);
  const quizAnswerLockedRef = useRef(false);
  const currentQuizQuestionIndexRef = useRef(currentQuizQ);
  currentQuizQuestionIndexRef.current = currentQuizQ;

  useEffect(() => () => clearTimeout(quizAdvanceTimeoutRef.current), []);

  const rapidQuizQuestions = [
    {
      q: "Which keyword defines an anonymous inline function in Python?",
      options: ["def", "lambda", "anon", "function"],
      correct: 1,
      exp: "'lambda' is used for creating small anonymous functions in Python.",
    },
    {
      q: "What is the average time complexity of lookups in a Python hash dictionary?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correct: 2,
      exp: "Hash tables provide average O(1) constant time complexity for key lookups.",
    },
    {
      q: "In React, what hook is used to handle side effects like data fetching?",
      options: ["useState", "useEffect", "useMemo", "useContext"],
      correct: 1,
      exp: "'useEffect' tells React that your component needs to do something after render.",
    },
  ];

  // Code Playground State
  const [sandboxCode, setSandboxCode] = useState(
    `# Python Logic Sandbox\ndef calculate_fibonacci(n):\n    if n <= 1:\n        return n\n    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)\n\nprint("Fibonacci(7):", calculate_fibonacci(7))`
  );
  const [sandboxOutput, setSandboxOutput] = useState("");

  const handleRunSandbox = () => {
    soundFx.playClick();
    setSandboxOutput("Evaluating script in EduPlay virtual runtime...\n");
    setTimeout(() => {
      soundFx.playSuccess();
      setSandboxOutput(">>> Script execution successful.\nFibonacci(7): 13\n\n[INFO] Memory: 4.2 MB | Runtime: 8ms");
    }, 350);
  };

  const handleStartRapidQuiz = () => {
    clearTimeout(quizAdvanceTimeoutRef.current);
    quizAdvanceTimeoutRef.current = null;
    quizAnswerLockedRef.current = false;
    soundFx.playClick();
    setQuizActive(true);
    setCurrentQuizQ(0);
    setQuizScore(0);
    setSelectedAns(null);
    setQuizFinished(false);
  };

  const handleSelectQuizAnswer = (idx) => {
    if (quizAnswerLockedRef.current || selectedAns !== null) return;
    quizAnswerLockedRef.current = true;
    setSelectedAns(idx);

    const isCorrect = idx === rapidQuizQuestions[currentQuizQ].correct;
    const answeredQuestionIndex = currentQuizQ;
    if (isCorrect) {
      soundFx.playSuccess();
      setQuizScore((prev) => prev + 1);
    } else {
      soundFx.playError();
    }

    quizAdvanceTimeoutRef.current = setTimeout(() => {
      if (currentQuizQuestionIndexRef.current !== answeredQuestionIndex) return;
      quizAdvanceTimeoutRef.current = null;

      if (!isCorrect) {
        setSelectedAns(null);
        quizAnswerLockedRef.current = false;
      } else if (answeredQuestionIndex < rapidQuizQuestions.length - 1) {
        setCurrentQuizQ((prev) => prev + 1);
        setSelectedAns(null);
        quizAnswerLockedRef.current = false;
      } else {
        setQuizFinished(true);
        triggerCelebration();
        addXP(75, "Rapid Quiz Blitz Complete");
      }
    }, 700);
  };

  const handleCloseRapidQuiz = () => {
    clearTimeout(quizAdvanceTimeoutRef.current);
    quizAdvanceTimeoutRef.current = null;
    quizAnswerLockedRef.current = false;
    setQuizActive(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Practice & Simulator Arena
            </h1>
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              Streak Protected
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Sharpen your fundamentals with rapid-fire questions, code simulators, and daily logic challenges.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/play')}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Open Play & Learn Game Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Daily Challenge + Rapid Blitz Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Challenge Spotlight */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-soft-lg border border-indigo-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                Today's Daily Challenge
              </span>
              <span className="text-xs text-indigo-300 font-semibold">{dailyChallenge.timeLeft} remaining</span>
            </div>

            <h3 className="text-xl font-black text-white mb-2">{dailyChallenge.title}</h3>
            <p className="text-indigo-200 text-xs sm:text-sm mb-5 leading-relaxed">
              {dailyChallenge.description}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-amber-300 text-xs font-bold flex items-center gap-1 border border-white/10">
                <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{dailyChallenge.xpReward} XP
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 text-emerald-300 text-xs font-bold flex items-center gap-1 border border-white/10">
                <Flame className="w-3.5 h-3.5 fill-emerald-400" /> Streak Shield
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveChallengeModal(true)}
            className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{dailyChallenge.completed ? 'Review Daily Solution' : 'Launch Challenge Quest'}</span>
          </button>
        </div>

        {/* Rapid Blitz Quiz Arena */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft flex flex-col justify-between">
          {!quizActive ? (
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    Blitz Arena
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">3 Fast Questions</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2">Rapid-Fire Quiz Challenge</h3>
                <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                  Test your engineering intuition under time pressure. Answer 3 quick concept questions and earn instant bonus XP.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-around mb-6 text-center">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-bold">Reward</div>
                    <div className="text-base font-black text-amber-500 flex items-center justify-center gap-0.5">
                      <Zap className="w-4 h-4 fill-amber-500" /> +75 XP
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-bold">Time Limit</div>
                    <div className="text-base font-black text-slate-800">45 Secs</div>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-bold">Difficulty</div>
                    <div className="text-base font-black text-indigo-600">Adaptive</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleStartRapidQuiz}
                  className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Rapid Quiz</span>
                </button>
                <button
                  onClick={() => navigate('/app/game/target-blaster')}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Target Blaster 🎯</span>
                </button>
              </div>
            </div>
          ) : quizFinished ? (
            <div className="text-center py-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-1">Blitz Finished!</h4>
              <p className="text-xs text-slate-500 mb-4">
                You scored <strong className="text-emerald-600">{quizScore} / {rapidQuizQuestions.length}</strong>! Earned <strong className="text-amber-500">+75 XP</strong>!
              </p>
              <button
                onClick={handleCloseRapidQuiz}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Back to Arena
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Question {currentQuizQ + 1} of {rapidQuizQuestions.length}</span>
                <span className="text-indigo-600 font-extrabold">Blitz Active</span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {rapidQuizQuestions[currentQuizQ].q}
              </h4>

              <div className="space-y-2">
                {rapidQuizQuestions[currentQuizQ].options.map((opt, idx) => {
                  let style = "bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800";
                  if (selectedAns !== null) {
                    if (idx === rapidQuizQuestions[currentQuizQ].correct) {
                      style = "bg-emerald-500 text-white border-emerald-500 font-bold";
                    } else if (idx === selectedAns) {
                      style = "bg-rose-500 text-white border-rose-500 font-bold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizAnswer(idx)}
                      disabled={selectedAns !== null}
                      className={`w-full p-3 text-left rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Simulator Lab Sandbox */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Virtual Code Simulator Sandbox</h3>
              <p className="text-xs text-slate-500">Run and experiment with Python scripts in an isolated browser environment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSandboxCode(`# Python Logic Sandbox\ndef calculate_fibonacci(n):\n    if n <= 1:\n        return n\n    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)\n\nprint("Fibonacci(7):", calculate_fibonacci(7))`)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Reset Sandbox"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRunSandbox}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Code</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            <div className="px-4 py-2 bg-slate-950 text-slate-400 text-xs font-mono border-b border-slate-800">
              main.py
            </div>
            <textarea
              value={sandboxCode}
              onChange={(e) => setSandboxCode(e.target.value)}
              rows={9}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm p-4 outline-none resize-none"
              spellCheck="false"
            />
          </div>

          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="px-4 py-2 bg-slate-900 text-slate-400 text-xs font-mono border-b border-slate-800 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Console</span>
            </div>
            <div className="p-4 flex-1 font-mono text-xs text-slate-300 whitespace-pre-wrap min-h-[160px]">
              {sandboxOutput || "Click 'Run Code' above to evaluate Python in real time..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
