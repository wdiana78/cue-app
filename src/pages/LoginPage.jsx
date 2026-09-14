import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Compass, Check } from 'lucide-react';
import { AuthService } from '../services/auth.js';

export const LoginPage = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('sparks@cue.life');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Sparks');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let user;
      if (mode === 'signup') {
        user = AuthService.createAccount(email, password, name);
      } else {
        user = AuthService.login(email, password);
      }
      onLoginSuccess && onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    setError(null);
    const guestUser = AuthService.continueAsGuest();
    onLoginSuccess && onLoginSuccess(guestUser);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFE] flex flex-col justify-between selection:bg-[#FFD1E3] selection:text-[#9F1239]">
      {/* Top Brand Bar */}
      <header className="px-6 py-6 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF2E79] to-[#FFA07A] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-display font-black text-xl text-[#21181D] tracking-tight">
            Cue
          </span>
        </div>

        <button
          type="button"
          onClick={handleGuest}
          className="text-xs font-bold text-[#8A7983] hover:text-[#21181D] transition-colors cursor-pointer"
        >
          Skip to Guest Mode →
        </button>
      </header>

      {/* Main Centered Welcome Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          {/* Aesthetic Palette Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F5] border border-[#FFD6E5] text-[#FF2E79] text-xs font-black uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>Personal Life Direction</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl text-[#21181D] tracking-tight">
              CUE
            </h1>

            <p className="font-display font-medium text-base sm:text-lg text-[#665760] tracking-tight">
              "Your life, already chosen."
            </p>

            <p className="text-xs text-[#8A7983] max-w-xs mx-auto pt-1 leading-relaxed">
              When you don't know what you want to do right now, Cue helps you choose from the things that belong in your life.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border-2 border-[#21181D] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
            {/* Mode Switcher */}
            <div className="flex items-center rounded-xl bg-[#FAF7F8] p-1 border border-[#EBE3E7]">
              <button
                type="button"
                id="tab-login"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#21181D] text-white shadow-xs'
                    : 'text-[#665760] hover:text-[#21181D]'
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                id="tab-signup"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#21181D] text-white shadow-xs'
                    : 'text-[#665760] hover:text-[#21181D]'
                }`}
              >
                Create account
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs font-bold text-[#E11D48]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sparks"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EBE3E7] bg-[#FAF7F8] text-[#21181D] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FF2E79]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sparks@cue.life"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EBE3E7] bg-[#FAF7F8] text-[#21181D] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FF2E79]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <span className="text-[11px] text-[#A89AA2]">
                      Demo password auto-filled
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EBE3E7] bg-[#FAF7F8] text-[#21181D] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FF2E79]"
                />
              </div>

              <div className="pt-2">
                <button
                  id="submit-auth-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{mode === 'login' ? 'Log in to Cue' : 'Create My Cue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#F5EDF0] w-full"></div>
              <span className="bg-white px-3 text-[10px] font-black uppercase tracking-wider text-[#A89AA2] absolute">
                or
              </span>
            </div>

            {/* Continue as Guest Button */}
            <button
              id="guest-auth-btn"
              type="button"
              onClick={handleGuest}
              className="w-full py-3 px-4 bg-[#F5EDF0] hover:bg-[#EBE3E7] text-[#21181D] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Guest</span>
            </button>
          </div>

          {/* Honest MVP Architecture Transparency Note */}
          <div className="p-3.5 rounded-2xl bg-[#FCF9F6] border border-[#F0E6EC] flex items-start gap-2.5 text-[11px] text-[#8A7983] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#55474F] block">Local Session (MVP)</span>
              Running client-side without cloud credentials. Your library and trained preferences are saved directly to this browser session.
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 text-center text-[11px] text-[#A89AA2]">
        Cue · Made for Sparks · Life & Experiences
      </footer>
    </div>
  );
};
