import React from 'react'

// src/pages/Sales.jsx
import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Coffee Latte', price: 4.50, category: 'Drinks', color: 'bg-amber-100' },
  { id: 2, name: 'Cappuccino', price: 4.00, category: 'Drinks', color: 'bg-blue-100' },
  { id: 3, name: 'Green Tea', price: 3.50, category: 'Drinks', color: 'bg-emerald-100' },
  { id: 4, name: 'Croissant', price: 3.25, category: 'Food', color: 'bg-rose-100' },
  // ... add more as per your screenshots
];

const Sales = () => {
  const [cart, setCart] = useState([]);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Product Grid Section */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Sales</h2>
          <input type="text" placeholder="Search products..." className="px-4 py-2 border rounded-xl w-64 focus:outline-blue-500" />
        </div>

        <div className="flex gap-4 mb-6 border-b pb-4">
          {['All Items', 'Drinks', 'Food', 'Snacks', 'Desserts'].map(cat => (
            <button key={cat} className={`px-4 py-2 rounded-lg text-sm font-medium ${cat === 'All Items' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {PRODUCTS.map(item => (
            <button 
              key={item.id} 
              onClick={() => addToCart(item)}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-500 transition-all flex flex-col items-center gap-3"
            >
              <div className={`w-16 h-16 rounded-xl ${item.color}`} />
              <p className="font-bold text-slate-800">{item.name}</p>
              <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Current Order</h3>
          <button onClick={() => setCart([])} className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded">Clear</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg ${item.color}`} />
              <div className="flex-1">
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-xs text-slate-400">${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 space-y-3">
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-slate-900 border-t pt-3">
            <span>Total</span>
            <span>${(subtotal + tax).toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button className="py-3 bg-slate-200 rounded-xl font-bold text-slate-700">Cash</button>
            <button className="py-3 bg-slate-200 rounded-xl font-bold text-slate-700">Card</button>
          </div>
          <button className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold mt-2 hover:bg-emerald-600 transition-colors">
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;