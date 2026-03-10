import React from 'react'
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, user }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <main className="p-0">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar user={user} />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;