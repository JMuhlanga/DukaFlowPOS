import React from 'react'

// src/pages/UserManagement.jsx
const UserManagement = () => {
    const users = [
      { name: 'Admin User', email: 'admin@quickpos.com', role: 'Administrator', status: 'Active', color: 'bg-purple-500' },
      { name: 'Maria Lopez', email: 'maria@quickpos.com', role: 'Manager', status: 'Active', color: 'bg-emerald-500' },
      { name: 'John Smith', email: 'john.s@quickpos.com', role: 'Cashier', status: 'Active', color: 'bg-blue-500' },
      { name: 'Sarah Johnson', email: 'sarah.j@quickpos.com', role: 'Cashier', status: 'Offline', color: 'bg-indigo-500' },
    ];
  
    return (
      <div className="flex gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">User Management</h2>
          <p className="text-slate-500 text-sm mb-6">Admin only - Manage system users</p>
  
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 flex items-center gap-3">
            <div className="w-6 h-6 bg-amber-200 rounded-md" />
            <p className="text-sm text-amber-700 font-medium">Admin Access Required - Only administrators can create, edit, or delete users</p>
          </div>
  
          <div className="space-y-4">
            {users.map(u => (
              <div key={u.email} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${u.color} flex items-center justify-center text-white font-bold`}>
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">{u.role}</span>
                <div className="text-right mr-4">
                  <span className={`text-[10px] font-bold uppercase ${u.status === 'Active' ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {u.status}
                  </span>
                  <p className="text-[10px] text-slate-400">Last: 2 mins ago</p>
                </div>
                <div className="flex gap-2">
                   <button className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center text-slate-400">✎</button>
                   <button className="w-8 h-8 bg-rose-50 rounded flex items-center justify-center text-rose-400">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="w-96 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h3 className="font-bold text-xl mb-6">Add New User</h3>
          <form className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Full Name</label>
              <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white" placeholder="Enter full name" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Enter email address" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">User Role</label>
              <select className="w-full px-4 py-3 border rounded-xl bg-slate-50">
                <option>Select role</option>
                <option>Administrator</option>
                <option>Manager</option>
                <option>Cashier</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mt-4">Create User</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default UserManagement;