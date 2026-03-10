import React, { useEffect, useMemo, useState } from 'react';

// src/pages/UserManagement.jsx
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const apiBaseUrl = useMemo(() => 'http://localhost:4000', []);

  const getStoredToken = () =>
    window.localStorage.getItem('dukaflow_token') ?? window.sessionStorage.getItem('dukaflow_token');

  const loadUsers = async () => {
    const token = getStoredToken();
    if (!token) {
      setError('Missing token. Please login again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json().catch(() => ([]));
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to load users');
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateUser = async (e) => {
    e.preventDefault();
    if (creating) return;

    setCreateError('');

    if (!username.trim() || !password.trim() || !role) {
      setCreateError('Username, password and role are required.');
      return;
    }

    const apiRole = role === 'Administrator' ? 'admin' : 'user';
    const token = getStoredToken();
    if (!token) {
      setCreateError('Missing token. Please login again.');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          role: apiRole,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create user');
      }

      setUsername('');
      setPassword('');
      setRole('');
      await loadUsers();
    } catch (err) {
      setCreateError(err?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const onDeleteUser = async (usernameToDelete) => {
    if (!window.confirm(`Delete user "${usernameToDelete}"?`)) return;

    const token = getStoredToken();
    if (!token) {
      setError('Missing token. Please login again.');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/deleteUser/${encodeURIComponent(usernameToDelete)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete user');
      }
      setUsers((prev) => prev.filter((u) => u.username !== usernameToDelete));
    } catch (err) {
      setError(err?.message || 'Failed to delete user');
    }
  };

  const colorForUser = (usernameValue) => {
    const colors = ['bg-purple-500', 'bg-emerald-500', 'bg-blue-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500'];
    if (!usernameValue) return colors[0];
    const code = usernameValue.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return colors[code % colors.length];
  };

  const normalizedUsers = Array.isArray(users)
    ? users.map((u) => {
        const uname = u.username || u.name || '';
        const displayName = uname.charAt(0).toUpperCase() + uname.slice(1);
        const isAdmin = u.role === 'admin';
        return {
          username: uname,
          name: displayName,
          roleLabel: isAdmin ? 'Administrator' : 'User',
          status: 'Active',
          color: colorForUser(uname),
        };
      })
    : [];

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">User Management</h2>
        <p className="text-slate-500 text-sm mb-6">Admin only - Manage system users</p>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-4 flex items-center gap-3">
          <div className="w-6 h-6 bg-amber-200 rounded-md" />
          <p className="text-sm text-amber-700 font-medium">
            Admin Access Required - Only administrators can create or delete users
          </p>
        </div>

        {error ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide">
            {loading ? 'Loading users…' : `Total users: ${normalizedUsers.length}`}
          </p>
        </div>

        <div className="space-y-4">
          {normalizedUsers.map((u) => (
            <div
              key={u.username}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-full ${u.color} flex items-center justify-center text-white font-bold`}
              >
                {u.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{u.name}</p>
                <p className="text-xs text-slate-400">@{u.username}</p>
              </div>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                {u.roleLabel}
              </span>
              <div className="text-right mr-4">
                <span className="text-[10px] font-bold uppercase text-emerald-500">{u.status}</span>
                <p className="text-[10px] text-slate-400">Active account</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="w-8 h-8 bg-rose-50 rounded flex items-center justify-center text-rose-400"
                  onClick={() => onDeleteUser(u.username)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}

          {!loading && normalizedUsers.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-500">
              No users found. Use the form on the right to add your first user.
            </div>
          ) : null}
        </div>
      </div>

      <div className="w-96 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-fit">
        <h3 className="font-bold text-xl mb-2">Add New User</h3>
        <p className="text-xs text-slate-400 mb-4">
          New users will use these credentials to log in. You can create both administrators and normal users.
        </p>

        <form className="space-y-4" onSubmit={onCreateUser}>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">User Role</label>
            <select
              className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select role</option>
              <option>Administrator</option>
              <option>User</option>
            </select>
          </div>

          {createError ? (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl px-4 py-2">
              {createError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={creating}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold mt-2 text-sm transition-colors"
          >
            {creating ? 'Creating user…' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;