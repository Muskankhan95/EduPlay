import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { loginAPI, demoLoginAPI } from '../../services/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useLearning();

  const [email, setEmail] = useState('alex.morgan@eduplay.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = 'Email address is required';
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
      const res = await loginAPI(email, password);
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

  const handleQuickDemoLogin = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      const res = await demoLoginAPI();
      setUser(res.user);
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

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

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-soft-lg p-6 sm:p-8 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pick up your daily streak and level up your engineering skills.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Button */}
        <button
          onClick={handleQuickDemoLogin}
          type="button"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mb-5 transition-all cursor-pointer group"
        >
          <Zap className="w-4 h-4 fill-amber-400 text-amber-500 group-hover:scale-110 transition-transform" />
          <span>Quick Demo Login as Alex (Lv. 7)</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold uppercase text-slate-400">
            Or log in with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
              {errors.form}
            </p>
          )}
          {/* Email input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white transition-all ${
                  errors.password
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In & Continue Quest</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
            Create an account for free
          </Link>
        </div>
      </div>
    </div>
  );
};
