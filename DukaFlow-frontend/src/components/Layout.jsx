import React from 'react'
import Navbar from './Navbar';

const Layout = ({ children, user }) => {
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