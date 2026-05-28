import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validators
    if (!email || !password) {
      setError('Please fill in all credentials fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 text-dark-100 px-4 relative overflow-hidden font-sans">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl space-y-8 relative border border-dark-800 shadow-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-brand-500 p-3.5 rounded-2xl text-white shadow-xl shadow-brand-500/30 animate-bounce">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">LuminaLib Portal</h1>
            <p className="text-sm text-dark-400 mt-1.5 font-medium">LMS Administrator Security Access Gate</p>
          </div>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email input field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-300 uppercase tracking-widest block">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-brand-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@library.com"
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-dark-900 border border-dark-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none transition-all duration-300 text-white font-medium placeholder-dark-600"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-300 uppercase tracking-widest block">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-brand-400 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-dark-900 border border-dark-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none transition-all duration-300 text-white font-medium placeholder-dark-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all duration-300 shadow-xl shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authenticating User...</span>
              </>
            ) : (
              <span>Proceed to Portal</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center">
          <p className="text-xs text-dark-500 font-medium">
            Protected under LuminaLib enterprise security protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
