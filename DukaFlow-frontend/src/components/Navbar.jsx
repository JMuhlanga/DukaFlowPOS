import React, { useMemo, useState } from 'react'
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, KeyRound, ChevronUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user }) => {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const [menuOpen, setMenuOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');

  const apiBaseUrl = useMemo(() => 'http://localhost:4000', []);

  const displayName = user?.name || user?.username || 'User';
  const initials = String(displayName).trim().charAt(0).toUpperCase() || 'U';

  const getStoredToken = () =>
    window.localStorage.getItem('dukaflow_token') ?? window.sessionStorage.getItem('dukaflow_token');

  const clearAuthStorage = () => {
    window.localStorage.removeItem('dukaflow_user');
    window.localStorage.removeItem('dukaflow_token');
    window.sessionStorage.removeItem('dukaflow_user');
    window.sessionStorage.removeItem('dukaflow_token');
  };

  const logout = () => {
    setMenuOpen(false);
    clearAuthStorage();
    window.location.assign('/login');
  };

  const openChangePassword = () => {
    setMenuOpen(false);
    setChangePasswordError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordOpen(true);
  };

  const submitChangePassword = async (e) => {
    e.preventDefault();
    if (changingPassword) return;
    setChangePasswordError('');

    if (!currentPassword || !newPassword) {
      setChangePasswordError('Please fill in all required fields.');
      return;
    }
    if (newPassword.length < 8) {
      setChangePasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError('New password and confirm password do not match.');
      return;
    }

    const token = getStoredToken();
    if (!token) {
      setChangePasswordError('Missing token. Please login again.');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/changePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Failed to change password');

      // Backend returns a rotated token; replace stored auth.
      const storage = window.localStorage.getItem('dukaflow_token') ? window.localStorage : window.sessionStorage;
      storage.setItem('dukaflow_user', JSON.stringify(data?.user ?? user ?? null));
      if (data?.token) storage.setItem('dukaflow_token', data.token);

      setChangePasswordOpen(false);
    } catch (err) {
      setChangePasswordError(err?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', public: true },
    { name: 'Sales', icon: <ShoppingCart size={20} />, path: '/sales', public: true },
    { name: 'Stock Management', icon: <Package size={20} />, path: '/stock', public: true },
    { name: 'User Management', icon: <Users size={20} />, path: '/users', public: false },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings', public: false },
  ];

  return (
    <nav className="w-64 bg-[#0f172a] text-slate-300 h-screen fixed left-0 top-0 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">DF</div>
        <h1 className="text-xl font-bold text-white tracking-tight">DukaFlow</h1>
      </div>

      <div className="flex-1 space-y-1">
        {menuItems.map((item) => {
          if (!item.public && !isAdmin) return null;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              {initials}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-white leading-tight">{displayName}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
            </div>
            <ChevronUp
              size={18}
              className={`text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen ? (
            <div className="absolute bottom-[72px] left-0 right-0 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <button
                type="button"
                onClick={openChangePassword}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                <KeyRound size={18} />
                Change password
              </button>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-300 hover:bg-slate-800"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {changePasswordOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <button
            type="button"
            onClick={() => !changingPassword && setChangePasswordOpen(false)}
            className="absolute inset-0 bg-black/60"
            aria-label="Close change password modal"
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Change password</h3>
            </div>

            <form className="space-y-4" onSubmit={submitChangePassword}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                  autoComplete="new-password"
                  required
                />
              </div>

              {changePasswordError ? (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold rounded-xl px-4 py-3">
                  {changePasswordError}
                </div>
              ) : null}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !changingPassword && setChangePasswordOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  disabled={changingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300"
                  disabled={changingPassword}
                >
                  {changingPassword ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;