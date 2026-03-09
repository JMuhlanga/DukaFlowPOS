// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Import Pages
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import StockManagement from './pages/StockManagement';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

function App() {
  // This state would eventually come from your Auth Context/Backend
  // Change role to 'user' to test the restriction logic
  const currentUser = { 
    name: "José Muhlanga", 
    role: "admin", 
    email: "jose@dukaflow.com" 
  };

  const isAdmin = currentUser.role === 'admin';

  return (
    <Router>
      <Layout user={currentUser}>
        <Routes>
          {/* Public Routes (Accessible by both Admin and User) */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/stock" element={<StockManagement />} />

          {/* Admin Only Routes */}
          {isAdmin ? (
            <>
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <>
              {/* Redirect users away from admin pages if they try to access via URL */}
              <Route path="/users" element={<Navigate to="/" replace />} />
              <Route path="/settings" element={<Navigate to="/" replace />} />
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