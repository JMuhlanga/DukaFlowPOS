import React, { useEffect, useMemo, useState } from 'react'

// src/pages/Settings.jsx
const Settings = () => {
    const apiBaseUrl = useMemo(() => 'http://localhost:4000', []);
    const getStoredToken = () =>
      window.localStorage.getItem('dukaflow_token') ?? window.sessionStorage.getItem('dukaflow_token');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [printReceiptAutomatically, setPrintReceiptAutomatically] = useState(true);
    const [soundNotifications, setSoundNotifications] = useState(true);
    const [lowStockAlerts, setLowStockAlerts] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const [taxRate, setTaxRate] = useState('8.00');
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
      let cancelled = false;
      const load = async () => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
          const token = getStoredToken();
          const response = await fetch(`${apiBaseUrl}/api/settings`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data?.error || 'Failed to load settings');

          if (cancelled) return;
          setStoreName(String(data.store_name ?? ''));
          setStoreAddress(String(data.store_address ?? ''));
          setPhoneNumber(String(data.phone_number ?? ''));

          setPrintReceiptAutomatically(Boolean(Number(data.print_receipt_automatically ?? 1)));
          setSoundNotifications(Boolean(Number(data.sound_notifications ?? 1)));
          setLowStockAlerts(Boolean(Number(data.low_stock_alerts ?? 1)));
          setDarkMode(Boolean(Number(data.dark_mode ?? 0)));

          setTaxRate(String(data.tax_rate ?? '8.00'));
          setCurrency(String(data.currency ?? 'USD'));
        } catch (e) {
          if (!cancelled) setError(e?.message || 'Failed to load settings');
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      load();
      return () => { cancelled = true; };
    }, [apiBaseUrl]);

    const onSave = async () => {
      if (saving) return;
      setError('');
      setSuccess('');
      setSaving(true);
      try {
        const token = getStoredToken();
        const payload = {
          store_name: storeName,
          store_address: storeAddress,
          phone_number: phoneNumber,
          print_receipt_automatically: printReceiptAutomatically,
          sound_notifications: soundNotifications,
          low_stock_alerts: lowStockAlerts,
          dark_mode: darkMode,
          tax_rate: taxRate,
          currency,
        };

        const response = await fetch(`${apiBaseUrl}/api/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || 'Failed to save settings');
        setSuccess('Saved.');
      } catch (e) {
        setError(e?.message || 'Failed to save settings');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
            <p className="text-slate-500 text-sm">Configure your POS system</p>
          </div>
          <button
            onClick={onSave}
            disabled={loading || saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-8 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-200 disabled:shadow-none"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {loading ? (
          <div className="bg-slate-50 border border-slate-100 text-slate-600 text-sm font-semibold rounded-xl px-4 py-3 mb-6">
            Loading settings…
          </div>
        ) : null}

        {error ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold rounded-xl px-4 py-3 mb-6">
            {success}
          </div>
        ) : null}
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Store Information */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <span className="text-xl">🏪</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Store Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2 ml-1">Store Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2 ml-1">Store Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2 ml-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </section>
  
          {/* System Preferences */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
                <span className="text-xl">⚙️</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">System Preferences</h3>
            </div>
  
            <div className="space-y-6">
              <ToggleOption title="Print Receipt Automatically" desc="Print receipt after each sale" checked={printReceiptAutomatically} onChange={setPrintReceiptAutomatically} />
              <ToggleOption title="Sound Notifications" desc="Play sound for new orders" checked={soundNotifications} onChange={setSoundNotifications} />
              <ToggleOption title="Low Stock Alerts" desc="Notify when stock is below threshold" checked={lowStockAlerts} onChange={setLowStockAlerts} />
              <ToggleOption title="Dark Mode" desc="Enable dark theme interface" checked={darkMode} onChange={setDarkMode} />
            </div>
          </section>
  
          {/* Tax Settings */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Tax Settings</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2 ml-1">Tax Rate (%)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 outline-none"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2 ml-1">Currency</label>
                <select
                  className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 outline-none"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (Ksh)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </section>
  
          {/* Backup and Data */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <span className="text-xl">💾</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Backup and Data</h3>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 border border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Export Data</button>
              <button className="py-3 border border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Import Data</button>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
               <div className="w-5 h-5 bg-emerald-200 rounded text-[10px] flex items-center justify-center">✔</div>
               <p className="text-sm text-emerald-700 font-medium">Last backup: Today at 3:45 PM</p>
            </div>
          </section>
  
          {/* Danger Zone */}
          <section className="lg:col-span-2 border-2 border-rose-100 p-8 rounded-3xl bg-rose-50/30 space-y-6 mt-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500">
                <span className="text-xl">⚠️</span>
              </div>
              <h3 className="font-bold text-rose-800 text-lg">Danger Zone</h3>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button className="py-4 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-2xl font-bold transition-colors">Reset All Data</button>
               <button className="py-4 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-2xl font-bold transition-colors">Delete Account</button>
            </div>
          </section>
        </div>
      </div>
    );
  };
  
  // Toggle Component helper
  const ToggleOption = ({ title, desc, checked, onChange }) => (
    <div className="flex justify-between items-center group">
      <div>
        <p className="font-bold text-slate-700">{title}</p>
        <p className="text-sm text-slate-400">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
  
  export default Settings;