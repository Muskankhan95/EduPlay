import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { updateUserProfileAPI } from '../services/api';
import {
  Award,
  Zap,
  Flame,
  Edit3,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, setUser, badges } = useLearning();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  const [profileError, setProfileError] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);

  const unlockedBadges = badges.filter((b) => b.unlocked);

  const certificates = [
    { title: "Python Essentials & Algorithmic Logic", issueDate: "November 2025", certId: "EDU-PY-9201" },
    { title: "Responsive Web Foundations & Semantic HTML", issueDate: "December 2025", certId: "EDU-WEB-8145" },
    { title: "JavaScript ES6+ Functional Concepts", issueDate: "January 2026", certId: "EDU-JS-7643" },
  ];

  const handleSaveBio = async () => {
    setIsSavingBio(true);
    setProfileError('');
    try {
      const response = await updateUserProfileAPI({ bio: bioText });
      setUser(response.user);
      setIsEditingBio(false);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setIsSavingBio(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-8 shadow-soft-lg border border-indigo-700/50">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with level badge */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/30 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
              Lv. {user.level}
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold self-center sm:self-auto border border-white/15">
                {user.levelTitle}
              </span>
            </div>

            <p className="text-indigo-200 text-xs sm:text-sm font-medium">
              {user.role} • Member since {user.joinedDate}
            </p>

            {/* Editable Bio */}
            {isEditingBio ? (
              <div className="mt-2 space-y-2">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-indigo-950/80 text-white border border-indigo-500/50 outline-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBio}
                    disabled={isSavingBio}
                    className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-60"
                  >
                    {isSavingBio ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1 rounded-lg bg-white/20 text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
                {profileError && <p role="alert" className="text-xs font-semibold text-rose-300">{profileError}</p>}
              </div>
            ) : (
              <p
                onClick={() => setIsEditingBio(true)}
                className="text-xs sm:text-sm text-slate-200 cursor-pointer hover:text-white flex items-center gap-1 group justify-center sm:justify-start"
              >
                <span>{user.bio}</span>
                <Edit3 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
              </p>
            )}

            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-indigo-200">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <strong className="text-white">{user.currentXP.toLocaleString()}</strong> Total XP
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
                <strong className="text-white">{user.dailyStreak}</strong> Days Streak
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-300" />
                <strong className="text-white">{user.badgesEarned}</strong> Badges Unlocked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Badges Showcase + Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Showcase Badges */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Showcase Badges</h3>
            <span className="text-xs text-slate-400 font-semibold">{unlockedBadges.length} Unlocked</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unlockedBadges.slice(0, 6).map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-indigo-200 transition-all text-center flex flex-col items-center justify-between"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-2xl mb-1.5 border border-slate-100">
                  {badge.icon}
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{badge.name}</h4>
                <span className="text-[10px] text-amber-600 font-bold">+{badge.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Certificates */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Earned Certificates</h3>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="space-y-3">
            {certificates.map((cert) => (
              <div
                key={cert.certId}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{cert.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      Issued {cert.issueDate} • ID: {cert.certId}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Certificate ${cert.certId} verified and ready for download!`)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title="Download Certificate"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
