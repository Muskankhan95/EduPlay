import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { learningPathsData } from '../data/mockData';
import {
  Map,
  CheckCircle2,
  Lock,
  Play,
  Zap,
  Sparkles,
  Clock,
  ArrowRight,
  Compass
} from 'lucide-react';

export const LearningPathPage = () => {
  const { setActiveLessonModal, courses, learningPaths } = useLearning();
  const [selectedPathId, setSelectedPathId] = useState('path-fs');

  const paths = learningPaths.length ? learningPaths : learningPathsData;
  const activePath = paths.find((p) => p.id === selectedPathId) || paths[0];

  const handleNodeClick = (node) => {
    if (node.status === 'locked') return;
    const pythonCourse = courses.find((c) => c.id === 'py-101');
    setActiveLessonModal({
      course: pythonCourse,
      lessonId: 'py-l-22',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Adaptive Learning Paths
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              AI-Personalized
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Structured skill trees designed to take you from foundational concepts to production mastery.
          </p>
        </div>
      </div>

      {/* Path Track Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paths.map((path) => {
          const isSelected = path.id === selectedPathId;
          const completedNodes = path.nodes.filter((n) => n.status === 'completed').length;
          const percent = Math.round((completedNodes / path.nodes.length) * 100);

          return (
            <div
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-soft'
                  : 'bg-white/80 border-slate-200 hover:border-indigo-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  {path.category}
                </span>
                <span className="text-xs font-bold text-slate-500">{path.estimatedWeeks} Weeks</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{path.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {path.description}
              </p>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Track Progress</span>
                  <span className="text-indigo-600 font-bold">{percent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Path Visual Roadmap */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Selected Roadmap
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{activePath.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              <Zap className="w-4 h-4 fill-amber-400" />
              Total XP: {activePath.totalXP.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Visual Roadmap Nodes */}
        <div className="relative max-w-2xl mx-auto py-4">
          {/* Vertical Connecting Line */}
          <div className="absolute left-8 top-10 bottom-10 w-1 bg-slate-200 -translate-x-1/2 z-0" />

          <div className="space-y-8 relative z-10">
            {activePath.nodes.map((node, index) => {
              const isCompleted = node.status === 'completed';
              const isCurrent = node.status === 'current';
              const isLocked = node.status === 'locked';

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`flex items-start gap-5 p-4 sm:p-5 rounded-3xl border transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-soft ring-2 ring-indigo-500/20 cursor-pointer'
                      : isCompleted
                      ? 'bg-white border-emerald-200/80 hover:border-emerald-300 cursor-pointer shadow-soft-sm'
                      : 'bg-slate-50/80 border-slate-200 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {/* Node Status Bubble */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 animate-pulse-subtle'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : isCurrent ? (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  {/* Node Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{node.icon}</span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {node.title}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                        <Zap className="w-3 h-3 fill-amber-500" /> +{node.xp} XP
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs mt-2">
                      <span
                        className={`font-bold capitalize ${
                          isCompleted
                            ? 'text-emerald-600'
                            : isCurrent
                            ? 'text-indigo-600 font-extrabold'
                            : 'text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓ Completed Milestone' : isCurrent ? '⚡ Currently In Progress' : '🔒 Locked Milestone'}
                      </span>
                      {isCurrent && (
                        <button
                          onClick={() => handleNodeClick(node)}
                          className="ml-auto px-3.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Resume Node</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
