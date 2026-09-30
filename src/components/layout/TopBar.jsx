import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Zap,
  Flame,
  Menu,
  CheckCheck,
  User,
  Settings,
  LogOut,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const TopBar = ({ setMobileOpen }) => {
  const {
    user,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
    setSearchModalOpen
  } = useLearning();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Trigger */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="w-full max-w-sm flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-100/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all text-xs sm:text-sm font-medium border border-transparent hover:border-slate-200 text-left cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Search lessons, courses, topics...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Streak, XP Counter, Notifications, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Daily Streak Pill */}
        <div
          title={`${user.dailyStreak} Day Learning Streak!`}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold text-xs sm:text-sm select-none"
        >
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span>{user.dailyStreak}</span>
          <span className="hidden sm:inline text-xs font-semibold text-amber-700">Days</span>
        </div>

        {/* XP Counter Pill */}
        <div
          title={`Total Experience Points: ${user.currentXP} XP`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-extrabold text-xs sm:text-sm select-none shadow-2xs"
        >
          <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{user.currentXP.toLocaleString()}</span>
          <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wide">XP</span>
        </div>

        {/* Level badge */}
        <div className="hidden md:flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
          Lv. {user.level}
        </div>

        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden z-50 animate-scaleUp">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-4 transition-colors cursor-pointer text-left ${
                      notif.unread ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h5 className="text-xs font-bold text-slate-900">{notif.title}</h5>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <Link
                  to="/app/analytics"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View Learning Activity Log →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Name with Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/30"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                <span>{user.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold">{user.levelTitle}</span>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50 animate-scaleUp py-1.5">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  {user.league} • #{user.leagueRank}
                </div>
              </div>

              <Link
                to="/app/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/app/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </Link>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  resetDemoData();
                }}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>Reset Demo Progress</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setProfileOpen(false);
                  localStorage.removeItem('eduplay_token');
                  localStorage.removeItem('eduplay_user');
                  navigate('/login');
                }}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
