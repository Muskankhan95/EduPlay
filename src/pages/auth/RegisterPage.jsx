import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerCelebration } from '../../utils/confetti';
import { registerAPI } from '../../services/api';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useLearning();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('Full-Stack Web Architect');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const tracks = [
    'Full-Stack Web Architect',
    'Python & Data Specialist',
    'AI & Neural Networks',
    'Cybersecurity Defense',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      soundFx.playError();
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      const res = await registerAPI({ name, email, password, learningGoal: goal });
      setUser(res.user);
      soundFx.playSuccess();
      navigate('/app');
    } catch (err) {
      setErrors({ form: err.message });
      soundFx.playError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Logo Header */}
      <Link to="/" className="flex items-center gap-2.5 mb-6 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
            EduPlay <span className="text-indigo-600 font-black">Unity</span>
          </span>
        </div>
      </Link>

      {/* Register Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-soft-lg p-6 sm:p-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            Join 50,000+ Active Engineers
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            Start Your Learning Quest
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create your account to unlock adaptive roadmaps, code simulators, and XP badges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
              {errors.form}
            </p>
          )}
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white transition-all ${
                  errors.name
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>
            {errors.name && (
              <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white transition-all ${
                  errors.email
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>
            {errors.email && (
              <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white transition-all ${
                  errors.password
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>
            {errors.password && (
              <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          {/* Preferred Primary Track */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Primary Learning Goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {tracks.map((track) => (
                <button
                  type="button"
                  key={track}
                  onClick={() => setGoal(track)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    goal === track
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Free Account & Claim Starter XP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
