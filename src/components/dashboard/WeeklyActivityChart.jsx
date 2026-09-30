import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { weeklyActivityData as fallbackWeeklyActivityData } from '../../data/mockData';
import { BarChart3, Clock, Zap, TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs font-sans border border-slate-800">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        <div className="flex items-center gap-1.5 text-indigo-300 mb-0.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Study Time: <strong>{payload[0].payload.hours} hrs</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
          <Zap className="w-3.5 h-3.5 fill-amber-400" />
          <span>XP Gained: <strong>{payload[0].payload.xp} XP</strong></span>
        </div>
        <div className="text-[11px] text-slate-400">
          Lessons: {payload[0].payload.lessons} completed
        </div>
      </div>
    );
  }
  return null;
};

export const WeeklyActivityChart = () => {
  const { weeklyActivity } = useLearning();
  const [metric, setMetric] = useState('hours'); // 'hours' or 'xp'
  const chartData = weeklyActivity.length ? weeklyActivity : fallbackWeeklyActivityData;

  const totalWeeklyHours = chartData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);
  const totalWeeklyXP = chartData.reduce((acc, curr) => acc + curr.xp, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Weekly Learning Activity</h3>
              <p className="text-xs text-slate-500 font-medium">Daily study breakdown & XP velocity</p>
            </div>
          </div>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setMetric('hours')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                metric === 'hours'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hours ({totalWeeklyHours}h)
            </button>
            <button
              onClick={() => setMetric('xp')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                metric === 'xp'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              XP ({totalWeeklyXP})
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar
              dataKey={metric}
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {chartData.map((entry, index) => {
                const isToday = index === chartData.length - 1;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      isToday
                        ? metric === 'hours'
                          ? '#4f46e5'
                          : '#eab308'
                        : metric === 'hours'
                        ? '#818cf8'
                        : '#fcd34d'
                    }
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Insights */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span>+22% learning time vs. last week</span>
        </div>
        <span className="font-medium text-slate-400">Peak study day: Saturday (2.8 hrs)</span>
      </div>
    </div>
  );
};
