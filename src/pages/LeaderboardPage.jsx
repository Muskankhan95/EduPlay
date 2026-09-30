import React, { useEffect, useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { leaderboardData } from '../data/mockData';
import { getLeaderboardAPI } from '../services/api';
import {
  Trophy,
  Flame,
  Zap,
  Crown,
  Medal,
  Clock,
  Sparkles,
  Gamepad2,
  Info,
  ChevronRight
} from 'lucide-react';

export const LeaderboardPage = () => {
  const { user, leaderboard } = useLearning();
  const [activeTab, setActiveTab] = useState('Diamond'); // Diamond league
  const [items, setItems] = useState(leaderboard);

  useEffect(() => {
    let isMounted = true;
    getLeaderboardAPI(activeTab)
      .then((response) => {
        if (isMounted && response.success) setItems(response.leaderboard);
      })
      .catch((err) => console.error('Unable to load leaderboard:', err));
    return () => { isMounted = false; };
  }, [activeTab]);

  const leagues = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

  // Top 3 Podium
  const sourceItems = items.length ? items : leaderboardData;
  const enrichedLeaderboard = sourceItems.map((item, idx) => ({
    ...item,
    totalXP: item.totalXP ?? item.xp + 4500,
    gamesCompleted: item.gamesCompleted ?? 18 + ((item.rank || idx + 1) * 3),
    highestStreak: item.highestStreak ?? item.streak + 5,
  }));
  const [top1, top2, top3] = enrichedLeaderboard;

  if (!top1 || !top2 || !top3) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">No leaderboard entries yet</h1>
        <p className="mt-2 text-sm text-slate-500">Try another league or check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              🏆 WEEKLY LEADERBOARD
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Diamond Tier
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Top 3 learners at the end of the week earn the Diamond Crown and +500 XP bonus!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 shadow-soft-sm">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Resets in: <strong className="text-slate-900">2d 14h 22m</strong></span>
        </div>
      </div>

      {/* Friendly Note: Not mandatory for learning (Section 12) */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3 text-xs text-indigo-900">
        <Info className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          <strong>Friendly Motivation:</strong> Leaderboard rankings are purely for fun and streak momentum. Your personal learning path and concept understanding always come first!
        </span>
      </div>

      {/* Current User Spotlight Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-soft-lg border border-indigo-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-lg text-amber-300">
            #{user.leagueRank || 4}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              YOUR STANDING
            </span>
            <h3 className="text-base font-black text-white">{user.name} (You)</h3>
            <p className="text-xs text-indigo-200">Diamond Division • {user.levelTitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-2 sm:pt-0">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Weekly XP</span>
            <span className="font-black text-amber-400 font-mono text-sm">{user.currentXP.toLocaleString()} XP</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Games Done</span>
            <span className="font-black text-white font-mono text-sm">24 Played</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Highest Streak</span>
            <span className="font-black text-rose-400 font-mono text-sm">{user.dailyStreak} Days 🔥</span>
          </div>
        </div>
      </div>

      {/* League Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white rounded-2xl border border-slate-200 shadow-soft-sm">
        {leagues.map((league) => (
          <button
            key={league}
            onClick={() => setActiveTab(league)}
            className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === league
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {league === 'Diamond' && <Sparkles className="w-3.5 h-3.5" />}
            <span>{league}</span>
          </button>
        ))}
      </div>

      {/* Top 3 Podium Display */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-indigo-900/50">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Top Performers This Week
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Diamond League Podium</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-2xl mx-auto pt-6">
          {/* Rank 2 (Silver) */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2">
              <img
                src={top2.avatar}
                alt={top2.name}
                className="w-14 sm:w-20 h-14 sm:h-20 rounded-2xl object-cover ring-4 ring-slate-300"
              />
              <span className="absolute -bottom-2 -right-1 text-xl">🥈</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[90px] sm:max-w-none">
              {top2.name}
            </h4>
            <span className="text-[11px] text-amber-400 font-extrabold">{top2.xp.toLocaleString()} XP</span>
            <div className="w-full h-24 sm:h-32 bg-slate-800/80 rounded-t-2xl mt-3 flex items-center justify-center border-t-4 border-slate-300">
              <span className="text-2xl sm:text-4xl font-black text-slate-400">2</span>
            </div>
          </div>

          {/* Rank 1 (Gold / Crown) */}
          <div className="flex flex-col items-center text-center -translate-y-4">
            <div className="relative mb-2">
              <Crown className="w-6 h-6 text-amber-400 fill-amber-400 absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce" />
              <img
                src={top1.avatar}
                alt={top1.name}
                className="w-18 sm:w-24 h-18 sm:h-24 rounded-2xl object-cover ring-4 ring-amber-400 shadow-glow-gold"
              />
              <span className="absolute -bottom-2 -right-1 text-2xl">🥇</span>
            </div>
            <h4 className="text-xs sm:text-base font-black text-white truncate max-w-[100px] sm:max-w-none">
              {top1.name}
            </h4>
            <span className="text-xs sm:text-sm text-amber-400 font-black">{top1.xp.toLocaleString()} XP</span>
            <div className="w-full h-32 sm:h-44 bg-amber-500/20 rounded-t-2xl mt-3 flex items-center justify-center border-t-4 border-amber-400 backdrop-blur-xs">
              <span className="text-3xl sm:text-5xl font-black text-amber-400">1</span>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2">
              <img
                src={top3.avatar}
                alt={top3.name}
                className="w-14 sm:w-20 h-14 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-700"
              />
              <span className="absolute -bottom-2 -right-1 text-xl">🥉</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[90px] sm:max-w-none">
              {top3.name}
            </h4>
            <span className="text-[11px] text-amber-400 font-extrabold">{top3.xp.toLocaleString()} XP</span>
            <div className="w-full h-20 sm:h-24 bg-slate-800/80 rounded-t-2xl mt-3 flex items-center justify-center border-t-4 border-amber-700">
              <span className="text-2xl sm:text-4xl font-black text-amber-700">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings List Table with All 4 Metrics (Weekly XP, Total XP, Games Completed, Highest Streak) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Weekly Standings</h3>
            <p className="text-xs text-slate-400">Scores sync automatically after every game completion</p>
          </div>
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Top 5 Advance
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {enrichedLeaderboard.map((item) => {
            const isYou = item.isCurrentUser;

            return (
              <div
                key={item.rank}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isYou
                    ? 'bg-indigo-50/80 border-l-4 border-indigo-600 font-bold'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Student Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className={`w-6 text-center text-sm font-black ${
                      item.rank === 1
                        ? 'text-amber-500'
                        : item.rank === 2
                        ? 'text-slate-400'
                        : item.rank === 3
                        ? 'text-amber-700'
                        : 'text-slate-400'
                    }`}
                  >
                    #{item.rank}
                  </span>

                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm ${
                          isYou ? 'font-black text-indigo-700' : 'font-bold text-slate-900'
                        }`}
                      >
                        {item.name} {isYou && '(You)'}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>{item.league} League</span>
                      <span>•</span>
                      <span className="text-indigo-600 font-semibold">{item.gamesCompleted} Games Done</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown (Weekly XP, Total XP, Games, Highest Streak) */}
                <div className="flex items-center justify-between sm:justify-end gap-6 text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Highest Streak</span>
                    <span className="text-xs font-bold text-rose-500 flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 fill-rose-500" /> {item.highestStreak}d
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Total XP</span>
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      {item.totalXP.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Weekly XP</span>
                    <span className="text-sm font-black text-amber-500 font-mono flex items-center justify-end gap-0.5">
                      <Zap className="w-3.5 h-3.5 fill-amber-500" /> {item.xp.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
