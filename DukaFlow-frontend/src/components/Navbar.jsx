import React from 'react'
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user }) => {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

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
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
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
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;