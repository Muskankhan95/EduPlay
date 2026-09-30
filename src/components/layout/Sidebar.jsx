import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Compass,
  Map,
  Dumbbell,
  Trophy,
  Award,
  BarChart3,
  User,
  Settings,
  Flame,
  Zap,
  Sparkles,
  Gamepad2,
  X
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

const navItems = [
  { name: 'Dashboard', path: '/app', icon: LayoutDashboard, exact: true },
  { name: 'Play & Learn', path: '/app/play', icon: Gamepad2, badge: 'HOT' },
  { name: 'EduQuest 🗺️', path: '/app/quest', icon: Compass, badge: 'ADVENTURE' },
  { name: 'My Courses', path: '/app/my-courses', icon: GraduationCap },
  { name: 'Explore', path: '/app/explore', icon: Compass },
  { name: 'Learning Path', path: '/app/learning-path', icon: Map },
  { name: 'Practice', path: '/app/practice', icon: Dumbbell },
  { name: 'Leaderboard', path: '/app/leaderboard', icon: Trophy },
  { name: 'Achievements', path: '/app/achievements', icon: Award },
  { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/app/profile', icon: User },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user } = useLearning();

  const xpProgress = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-display font-extrabold text-base tracking-tight text-slate-900">
                <span>EduPlay</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold">
                  Unity
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Learn • Play • Level Up
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Platform Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-indigo-600'
                      }`}
                    />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-2xs">
                        {item.badge}
                      </span>
                    )}
                    {item.name === 'Practice' && !item.badge && (
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        Daily
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Level & XP Mini Progress Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                  Lv.{user.level}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-none">{user.levelTitle}</h5>
                  <span className="text-[10px] text-slate-400 font-medium">Rank Tier</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{user.dailyStreak}d</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span className="flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                {user.currentXP.toLocaleString()} XP
              </span>
              <span>Next: {user.nextLevelXP.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
