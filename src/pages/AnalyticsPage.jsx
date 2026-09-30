import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  skillBreakdownData as fallbackSkillBreakdownData,
  accuracyHistoryData as fallbackAccuracyHistoryData
} from '../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Flame,
  Calendar,
  Zap,
  Award,
  BookOpen
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { user, skillBreakdown, accuracyHistory } = useLearning();
  const chartSkillBreakdown = skillBreakdown.length ? skillBreakdown : fallbackSkillBreakdownData;
  const chartAccuracyHistory = accuracyHistory.length ? accuracyHistory : fallbackAccuracyHistoryData;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Learning Analytics & Insights
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              Real-time Metrics
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track your cognitive retention, coding velocity, daily practice consistency and skill growth.
          </p>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Study Time</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{user.totalHoursLearned}h</div>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +4.2h this week
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Overall Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{user.quizAccuracy}%</div>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +3% vs. last week
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Current Streak</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-rose-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{user.dailyStreak} Days</div>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
            Unbroken habit streak 🔥
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Avg. Daily Session</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">28 mins</div>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
            Goal: 30 mins / day
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Accuracy Trend Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Quiz Accuracy Progression</h3>
              <p className="text-xs text-slate-500">6-Week cognitive retention score</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              96% Peak
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartAccuracyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs font-sans">
                          <p className="font-bold">{payload[0].payload.week}</p>
                          <p className="text-indigo-300">Accuracy: {payload[0].value}%</p>
                          <p className="text-slate-400">Quizzes: {payload[0].payload.quizzes}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#accuracyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Competency Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Skill Competency Breakdown</h3>
              <p className="text-xs text-slate-500">Evaluated from interactive exercises & code tests</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {chartSkillBreakdown.map((item) => (
              <div key={item.subject} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{item.subject}</span>
                  <span className="text-indigo-600">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Habit Streak Calendar Heatmap (Last 28 Days Simulation) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">28-Day Consistency Map</h3>
              <p className="text-xs text-slate-500">Visualizing your daily learning habit commitment</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Less</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded bg-slate-100" />
              <span className="w-3 h-3 rounded bg-indigo-200" />
              <span className="w-3 h-3 rounded bg-indigo-400" />
              <span className="w-3 h-3 rounded bg-indigo-600" />
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const dayNum = i + 1;
            const isCompleted = dayNum <= 14; // current streak
            const intensity = isCompleted ? (dayNum % 3 === 0 ? 'bg-indigo-600' : 'bg-indigo-400') : 'bg-slate-100';

            return (
              <div
                key={i}
                title={`Day ${dayNum}: ${isCompleted ? 'Target achieved (45 min)' : 'Upcoming day'}`}
                className={`h-9 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${intensity} ${
                  isCompleted ? 'text-white shadow-2xs' : 'text-slate-400'
                }`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
