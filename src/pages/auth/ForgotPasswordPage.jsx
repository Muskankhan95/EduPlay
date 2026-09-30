import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { forgotPasswordAPI } from '../../services/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      soundFx.playError();
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      soundFx.playError();
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await forgotPasswordAPI(email);
      setIsSubmitted(true);
      soundFx.playSuccess();
    } catch (err) {
      setError(err.message);
      soundFx.playError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Logo */}
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

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-soft-lg p-6 sm:p-8 relative z-10">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                Reset Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your registered email address and we'll send you an instant reset link to recover your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                      error
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {error && (
                  <span className="text-[11px] text-rose-500 font-semibold mt-1 block">{error}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Check Your Inbox</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              We've sent a password reset token and instruction link to <strong className="text-slate-900">{email}</strong>.
            </p>

            <Link
              to="/login"
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Back to Login</span>
            </Link>
          </div>
        )}

        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
