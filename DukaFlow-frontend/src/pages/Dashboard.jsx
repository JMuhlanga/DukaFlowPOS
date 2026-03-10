import React, { useEffect, useMemo, useState } from 'react'

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
    const apiBaseUrl = useMemo(() => 'http://localhost:4000', []);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      let cancelled = false;
      const load = async () => {
        setError('');
        setLoading(true);
        try {
          const response = await fetch(`${apiBaseUrl}/api/dashboard/stats`);
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data?.error || 'Failed to load dashboard stats');
          if (!cancelled) setStats(data);
        } catch (e) {
          if (!cancelled) setError(e?.message || 'Failed to load dashboard stats');
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      load();
      return () => { cancelled = true; };
    }, [apiBaseUrl]);

    const todayLabel = useMemo(() => {
      const d = new Date();
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    }, []);

    const currency = useMemo(() => {
      const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
      return (n) => fmt.format(Number(n || 0));
    }, []);

    const todayIncome = loading ? '—' : currency(stats?.today_income);
    const todayTransactions = loading ? '—' : String(stats?.today_transactions ?? 0);
    const todayItemsSold = loading ? '—' : String(stats?.today_items_sold ?? 0);
    const lowStockItems = loading ? '—' : String(stats?.low_stock_items ?? 0);

    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm">Today's Overview - {todayLabel}</p>
          {error ? (
            <div className="mt-3 text-sm font-semibold text-rose-600">{error}</div>
          ) : null}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Today's Income" value={todayIncome} change={loading ? 'Loading…' : 'Updated'} color="bg-blue-500" />
          <StatCard title="Transactions" value={todayTransactions} change={loading ? 'Loading…' : 'Updated'} color="bg-emerald-500" />
          <StatCard title="Items Sold" value={todayItemsSold} change={loading ? 'Loading…' : 'Updated'} color="bg-amber-500" />
          <StatCard title="Low Stock Items" value={lowStockItems} change={loading ? 'Loading…' : 'Needs attention'} color="bg-rose-500" />
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
                <span className="text-xl font-bold">{todayItemsSold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;