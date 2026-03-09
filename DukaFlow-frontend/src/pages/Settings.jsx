import React from 'react'

// src/pages/Settings.jsx
const Settings = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
            <p className="text-slate-500 text-sm">Configure your POS system</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-200">
            Save Changes
          </button>
        </div>
  
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
                <input type="text" className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all" defaultValue="QuickPOS Coffee Shop" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2 ml-1">Store Address</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all" defaultValue="123 Main Street, City" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2 ml-1">Phone Number</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all" defaultValue="(555) 123-4567" />
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
              <ToggleOption title="Print Receipt Automatically" desc="Print receipt after each sale" defaultChecked={true} />
              <ToggleOption title="Sound Notifications" desc="Play sound for new orders" defaultChecked={true} />
              <ToggleOption title="Low Stock Alerts" desc="Notify when stock is below threshold" defaultChecked={true} />
              <ToggleOption title="Dark Mode" desc="Enable dark theme interface" defaultChecked={false} />
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
                <input type="number" className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 outline-none" defaultValue="8.00" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2 ml-1">Currency</label>
                <select className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 outline-none">
                  <option>USD ($)</option>
                  <option>KES (Ksh)</option>
                  <option>EUR (€)</option>
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
  const ToggleOption = ({ title, desc, defaultChecked }) => (
    <div className="flex justify-between items-center group">
      <div>
        <p className="font-bold text-slate-700">{title}</p>
        <p className="text-sm text-slate-400">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
  
  export default Settings;