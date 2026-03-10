// src/pages/Login.jsx
import React, { useMemo, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const apiBaseUrl = useMemo(() => {
    // Keep consistent with existing pages (e.g. StockManagement.jsx)
    return 'http://localhost:4000';
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError('');
    setSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Login failed');
      }

      const token = data?.token;
      const user = data?.user;
      const safeUser = user && typeof user === 'object'
        ? { id: user.id, username: user.username, role: user.role }
        : null;

      const storage = rememberMe ? window.localStorage : window.sessionStorage;
      storage.setItem('dukaflow_user', JSON.stringify(safeUser));
      if (token) storage.setItem('dukaflow_token', token);

      window.location.assign('/');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[450px] bg-white rounded-[2rem] shadow-2xl p-10 relative z-10 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-blue-200">
            DF
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">DukaFlow</h1>
          <p className="text-slate-400 mt-2 font-medium">Log in to manage your shop</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error ? (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold rounded-2xl px-4 py-3">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-sm text-slate-500 font-medium group-hover:text-slate-700">Remember me</span>
            </label>
            <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot Password?</button>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:active:scale-100"
          >
            {submitting ? 'Signing in…' : 'Login to Dashboard'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account? <button className="font-bold text-blue-600">Contact Admin</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;