import React from 'react'

// src/pages/Dashboard.jsx
const StatCard = ({ title, value, change, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4 text-slate-400">
        <div className={`w-10 h-10 rounded-xl ${color} opacity-20`} />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="text-3xl font-bold text-slate-800">{value}</div>
      <div className="text-xs font-semibold text-emerald-500 mt-2">
        {change} <span className="text-slate-400 font-normal">from yesterday</span>
      </div>
    </div>
  );
  
  const Dashboard = () => {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm">Today's Overview - Feb 23, 2026</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Today's Income" value="$4,582.50" change="+12.5%" color="bg-blue-500" />
          <StatCard title="Transactions" value="127" change="+8" color="bg-emerald-500" />
          <StatCard title="Items Sold" value="342" change="+15.2%" color="bg-amber-500" />
          <StatCard title="Low Stock Items" value="8" change="Needs attention" color="bg-rose-500" />
        </div>
  
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
            <h3 className="font-bold text-slate-800 mb-4">Income per Hour</h3>
            {/* Integrate a Chart library like Recharts here */}
            <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 italic">
              Chart Visualization Area
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Stock Movement</h3>
            <div className="flex items-center justify-center h-full">
              {/* Donut Chart placeholder */}
              <div className="w-32 h-32 rounded-full border-[12px] border-emerald-500 relative flex items-center justify-center">
                <span className="text-xl font-bold">342</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;