import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Flame,
  Award,
  ArrowRight,
  BookOpen,
  Code2,
  CheckCircle2,
  Play,
  Star,
  Users,
  BarChart3,
  Map,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { coursesData, badgesData } from '../data/mockData';
import { soundFx } from '../utils/sound';

export const LandingPage = () => {
  const navigate = useNavigate();

  // Mini live demo state inside the landing page!
  const [demoAnswer, setDemoAnswer] = useState(null);
  const [demoFeedback, setDemoFeedback] = useState(null);

  const handleDemoSelect = (idx) => {
    setDemoAnswer(idx);
    if (idx === 1) {
      soundFx.playSuccess();
      setDemoFeedback({ correct: true, text: "Correct! range(1, 6, 2) produces 1, 3, 5. +50 XP!" });
    } else {
      soundFx.playError();
      setDemoFeedback({ correct: false, text: "Try again! The third argument is the step size." });
    }
  };

  const popularCourses = coursesData.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-display font-black text-lg sm:text-xl text-slate-900 tracking-tight">
                <span>EduPlay</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold">
                  UnityLearn
                </span>
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#interactive" className="hover:text-indigo-600 transition-colors">Interactive Learning</a>
            <a href="#gamification" className="hover:text-indigo-600 transition-colors">Gamified Progress</a>
            <a href="#popular-courses" className="hover:text-indigo-600 transition-colors">Popular Courses</a>
            <a href="#analytics" className="hover:text-indigo-600 transition-colors">Analytics</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-all"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Decorative Background Gradients */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen Gamified EdTech Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span className="text-indigo-600/80">No Backend Required</span>
              </div>

              {/* Exact required title & subtitle */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-display leading-[1.1]">
                Learn. Play. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800">Level Up.</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Turn learning into an interactive experience with challenges, simulations and personalized learning paths.
              </p>

              {/* Buttons: "Start Learning" & "Explore Courses" */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/app"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/app/explore"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200 shadow-soft-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Explore Courses</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <strong>14-Day Streaks</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <strong>XP & League Ranks</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <strong>25+ Collectible Badges</strong>
                </span>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-7 overflow-hidden">
                {/* Floating badge */}
                <div className="absolute -top-1 -right-1 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-bl-2xl shadow">
                  🔥 Interactive Live Demo
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                    🐍
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                      Python Fundamentals
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">Loops and Iterations</h4>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs text-slate-200 mb-4 shadow-inner">
                  <span className="text-slate-400 block mb-1 text-[11px]"># What does this output?</span>
                  <code className="text-emerald-400">
                    for i in range(1, 6, 2):<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;print(i, end=' ')
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {["1 2 3 4 5", "1 3 5", "2 4 6", "1 3 5 7"].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleDemoSelect(i)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        demoAnswer === i
                          ? i === 1
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-rose-500 text-white border-rose-500'
                          : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {demoFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold mb-4 ${
                      demoFeedback.correct
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {demoFeedback.text}
                  </div>
                )}

                <Link
                  to="/app"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                >
                  <span>Launch Student Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW EDUPLAY WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display mt-3">
              How EduPlay Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              A scientifically backed loop that pairs micro-lessons with gamified incentives to make coding retention effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Choose Your Path",
                desc: "Select tailored roadmaps across Python, Full-Stack Web, Machine Learning, or Cybersecurity.",
                icon: Map,
                color: "text-indigo-600 bg-indigo-50",
              },
              {
                step: "02",
                title: "Solve Active Quests",
                desc: "Learn concepts through interactive code simulators, multiple choice checks, and live debugging.",
                icon: Code2,
                color: "text-amber-600 bg-amber-50",
              },
              {
                step: "03",
                title: "Earn XP & Badges",
                desc: "Level up your rank, maintain your daily streak shields, and unlock rare collector badges.",
                icon: Zap,
                color: "text-rose-600 bg-rose-50",
              },
              {
                step: "04",
                title: "Top the Leagues",
                desc: "Compete with peers in weekly Diamond divisions and earn verifiable industry skill certificates.",
                icon: Award,
                color: "text-emerald-600 bg-emerald-50",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-indigo-200 hover:shadow-soft transition-all duration-300 relative group"
                >
                  <span className="text-4xl font-black text-slate-200 group-hover:text-indigo-200 transition-colors">
                    {item.step}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center my-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE LEARNING & SIMULATIONS */}
      <section id="interactive" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                Interactive Learning
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
                Learn by Doing, Not Just Passive Watching
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Traditional video courses lead to high dropout rates. EduPlay embeds virtual runtime simulators, unit test suites, and instant feedback directly into every single lesson module.
              </p>

              <div className="space-y-3.5">
                {[
                  "Live browser-based code simulation with zero terminal setup",
                  "Automated unit tests that evaluate your algorithmic logic in milliseconds",
                  "Step-by-step interactive hints so you never get hopelessly stuck",
                  "Immediate XP and celebratory confetti upon completing exercises",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{point}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/app/practice"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Try Simulation Arena</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual simulation card */}
            <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white font-mono text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs">simulator_test.py</span>
                </div>
                <span className="text-emerald-400 font-bold">Python 3.12</span>
              </div>
              <pre className="text-emerald-300 leading-relaxed overflow-x-auto">
{`def get_even_squares(numbers):
    # Loop and filter even numbers
    return [n ** 2 for n in numbers if n % 2 == 0]

# Testing with [1, 2, 3, 4, 5, 6]
assert get_even_squares([1, 2, 3, 4, 5, 6]) == [4, 16, 36]
print("✓ 3/3 Test cases passed! +60 XP Awarded")`}
              </pre>
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-xs">
                <span className="text-indigo-400 font-bold">Console: </span>
                <span>Execution time 12ms. Memory overhead negligible.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GAMIFIED PROGRESS */}
      <section id="gamification" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
              Gamified Motivation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display mt-3">
              Level Up Like Your Favorite RPG
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Transform repetitive practice into an addictive habit with XP multipliers, leagues, streaks, and achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center text-3xl mb-4">
                🔥
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Daily Streaks</h3>
              <p className="text-xs text-slate-500">
                Log in and practice at least 5 minutes each day to maintain your streak and avoid freeze penalties.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 mx-auto flex items-center justify-center text-3xl mb-4">
                ⚡
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">XP & Level Milestones</h3>
              <p className="text-xs text-slate-500">
                Earn experience points from every lesson, daily challenge, and code test to advance your player tier.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 mx-auto flex items-center justify-center text-3xl mb-4">
                🏆
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Weekly Leagues</h3>
              <p className="text-xs text-slate-500">
                Compete against 30 learners in your division. Top 5 promote from Bronze to Diamond each Sunday.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-4">
                🎖️
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Collector Badges</h3>
              <p className="text-xs text-slate-500">
                Unlock 25+ collectible achievements ranging from 'Speed Demon' to '30-Day Legend' and 'Bug Hunter'.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ADAPTIVE LEARNING & ANALYTICS */}
      <section id="analytics" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase">Weekly Activity</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +22% This Week
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Study Time vs. XP Velocity</h3>
              <div className="space-y-2">
                {[
                  { day: "Mon", h: "1.2h", xp: "240 XP", pct: 45 },
                  { day: "Wed", h: "1.5h", xp: "320 XP", pct: 60 },
                  { day: "Thu", h: "2.1h", xp: "450 XP", pct: 85 },
                  { day: "Sat", h: "2.8h", xp: "580 XP", pct: 100 },
                ].map((item) => (
                  <div key={item.day} className="flex items-center gap-3 text-xs">
                    <span className="w-8 font-bold text-slate-600">{item.day}</span>
                    <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="font-semibold text-slate-500">{item.h}</span>
                    <span className="font-bold text-amber-500 w-16 text-right">{item.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                Adaptive Analytics
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
                Personalized Pathways Powered by Analytics
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                EduPlay dynamically adjusts difficulty based on your quiz accuracy and problem-solving speed. If you master loops quickly, we fast-forward you to advanced generators and algorithms.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl font-black text-slate-900">94%</div>
                  <div className="text-xs font-bold text-slate-400 uppercase mt-0.5">Average Accuracy</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl font-black text-indigo-600">3.4x</div>
                  <div className="text-xs font-bold text-slate-400 uppercase mt-0.5">Faster Retention</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. POPULAR COURSES */}
      <section id="popular-courses" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                Featured Tracks
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display mt-3">
                Popular Courses
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                Start with top-rated learning paths built by industry veterans.
              </p>
            </div>

            <Link
              to="/app/explore"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Browse All 6 Courses</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/app/courses/${c.id}`)}
                className="bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft-sm hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-base">
                      {c.badgeIcon}
                    </div>
                    <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800">
                      {c.difficulty}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span>{c.totalLessons} Lessons</span>
                      <span className="font-extrabold text-amber-500">+{c.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STUDENT ACHIEVEMENTS & TESTIMONIALS */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Student Hall of Fame
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display mt-3">
              Achievements That Drive Careers
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Over 50,000 learners have transformed coding from a chore into their favorite daily habit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "EduPlay's daily streak and code simulator got me through Python and recursion when college lectures felt completely dry. Now I have 18 badges and an internship offer!",
                author: "Devon Reed",
                role: "Software Engineering Intern",
                xp: "4,820 XP Earned",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
              },
              {
                quote: "The visual learning paths and Diamond leaderboard kept me intensely motivated. The interactive quizzes give immediate feedback so I know exactly what I missed.",
                author: "Samantha Lin",
                role: "Frontend Developer",
                xp: "6,150 XP Earned",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
              },
              {
                quote: "It feels like Duolingo meets LeetCode in a clean, professional SaaS interface. The code challenges are practical, modern, and genuinely fun to solve.",
                author: "Marcus Vance",
                role: "Full-Stack Apprentice",
                xp: "5,400 XP Earned",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.author}</h4>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                    <span className="text-[10px] text-amber-600 font-bold">{t.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL-TO-ACTION SECTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Join over 50,000 students leveling up today</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
            Start Learning. Play Quests. Level Up Today.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Create your student profile in 30 seconds and dive right into Python, Web Development, or AI without any setup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/app"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Platform Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-display font-black text-base mb-3">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>EduPlay: UnityLearn</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                A gamified modern EdTech platform empowering learners through interactive challenges, simulations, and streak momentum.
              </p>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold uppercase text-[11px] mb-3">Tracks</h4>
              <ul className="space-y-2">
                <li><Link to="/app/explore" className="hover:text-white transition-colors">Python Programming</Link></li>
                <li><Link to="/app/explore" className="hover:text-white transition-colors">Modern Web & React</Link></li>
                <li><Link to="/app/explore" className="hover:text-white transition-colors">Data Structures & Quests</Link></li>
                <li><Link to="/app/explore" className="hover:text-white transition-colors">Machine Learning Sims</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold uppercase text-[11px] mb-3">Features</h4>
              <ul className="space-y-2">
                <li><Link to="/app/practice" className="hover:text-white transition-colors">Daily Logic Challenges</Link></li>
                <li><Link to="/app/leaderboard" className="hover:text-white transition-colors">Diamond League Rankings</Link></li>
                <li><Link to="/app/achievements" className="hover:text-white transition-colors">Collector Badges</Link></li>
                <li><Link to="/app/analytics" className="hover:text-white transition-colors">Cognitive Analytics</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold uppercase text-[11px] mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Free Account</Link></li>
                <li><Link to="/app/settings" className="hover:text-white transition-colors">System Preferences</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} EduPlay: UnityLearn. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Security Arena</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
