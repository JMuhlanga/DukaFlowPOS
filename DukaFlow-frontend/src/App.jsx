// src/App.jsx
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Import Pages
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import StockManagement from './pages/StockManagement';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const currentUser = useMemo(() => {
    const raw = window.localStorage.getItem('dukaflow_user') ?? window.sessionStorage.getItem('dukaflow_user');
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed || null;
    } catch {
      return null;
    }
  }, []);

  const token = useMemo(() => {
    return window.localStorage.getItem('dukaflow_token') ?? window.sessionStorage.getItem('dukaflow_token');
  }, []);

  const isLoggedIn = Boolean(currentUser && token);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <Router>
      <Layout user={currentUser}>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />

          {/* Public Routes (Accessible by both Admin and User) */}
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/sales" element={isLoggedIn ? <Sales /> : <Navigate to="/login" replace />} />
          <Route path="/stock" element={isLoggedIn ? <StockManagement /> : <Navigate to="/login" replace />} />

          {/* Admin Only Routes */}
          {isAdmin ? (
            <>
              <Route path="/users" element={isLoggedIn ? <UserManagement /> : <Navigate to="/login" replace />} />
              <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              {/* Redirect users away from admin pages if they try to access via URL */}
              <Route path="/users" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
              <Route path="/settings" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            </>
          )}

          {/* 404 Catch-all */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <h1 className="text-4xl font-bold text-slate-800">404</h1>
              <p className="text-slate-500">Page not found</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;