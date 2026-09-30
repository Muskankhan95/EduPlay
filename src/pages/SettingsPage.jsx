import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import {
  Settings,
  Bell,
  Volume2,
  Music,
  Sparkles,
  RotateCcw,
  Check,
  Shield,
  Clock,
  User,
  Save,
  Gamepad2
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export const SettingsPage = () => {
  const { user, setUser, updatePreferences, resetDemoData } = useLearning();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [dailyGoal, setDailyGoal] = useState(user.preferences?.dailyGoalMinutes || 30);
  const [gameSounds, setGameSounds] = useState(user.preferences?.soundEffects ?? true);
  const [backgroundMusic, setBackgroundMusic] = useState(user.preferences?.backgroundMusic ?? false);
  const [notifications, setNotifications] = useState(user.preferences?.notificationsEnabled ?? true);
  const [confettiEnabled, setConfettiEnabled] = useState(user.preferences?.confettiEffects ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    soundFx.playSuccess();
    setUser((prev) => ({
      ...prev,
      name,
      email,
    }));
    updatePreferences({
      dailyGoalMinutes: dailyGoal,
      soundEffects: gameSounds,
      backgroundMusic,
      notificationsEnabled: notifications,
      confettiEffects: confettiEnabled,
    });

    soundFx.setSoundEnabled(gameSounds);
    soundFx.setMusicEnabled(backgroundMusic);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all mock progress, XP, and badges back to initial defaults?")) {
      resetDemoData();
      alert("Platform demo progress has been reset to defaults.");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
          Platform Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your learning goals, audio feedback, game sounds, and student profile.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900">Student Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Audio & Sound Preferences (Section 15) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900">Audio & Sound Settings</h3>
          </div>

          {/* 🔊 Game Sounds */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                🔊
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Game Sounds</h4>
                <p className="text-[11px] text-slate-400">Audio chimes on correct answers, streak milestones, and level-ups</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={gameSounds}
              onChange={(e) => setGameSounds(e.target.checked)}
              className="w-5 h-5 rounded-md text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* 🎵 Background Music */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                🎵
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Background Music</h4>
                <p className="text-[11px] text-slate-400">Gentle ambient pentatonic focus synth loop during gameplay</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={backgroundMusic}
              onChange={(e) => {
                setBackgroundMusic(e.target.checked);
                soundFx.setMusicEnabled(e.target.checked);
              }}
              className="w-5 h-5 rounded-md text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* 🔔 Notifications */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                🔔
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Notifications</h4>
                <p className="text-[11px] text-slate-400">In-game streak preservation alerts and leaderboard rank updates</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 rounded-md text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Confetti Animation Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                🎉
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Celebration Confetti</h4>
                <p className="text-[11px] text-slate-400">Show particle fireworks on victory screens and boss defeats</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={confettiEnabled}
              onChange={(e) => setConfettiEnabled(e.target.checked)}
              className="w-5 h-5 rounded-md text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Gamification & Daily Goals Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Gamepad2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900">Learning Pace & Study Target</h3>
          </div>

          {/* Daily Goal Selection */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">
              Daily Study Target
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[15, 30, 60].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDailyGoal(mins)}
                  className={`py-3 px-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    dailyGoal === mins
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-base font-black">{mins} mins</div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {mins === 15 ? 'Casual Pace' : mins === 30 ? 'Regular Habit' : 'Intensive Sprint'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Progress</span>
          </button>

          <button
            type="submit"
            className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved Changes!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
