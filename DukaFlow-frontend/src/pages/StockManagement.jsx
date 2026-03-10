import React, { useState, useEffect } from 'react';

// src/pages/StockManagement.jsx
const StockManagement = () => {
    // const stockItems = [
    //   { id: '#001', name: 'Coffee Latte', cat: 'Drinks', price: 4.50, qty: 142, status: 'In Stock' },
    //   { id: '#002', name: 'Croissant', cat: 'Food', price: 3.25, qty: 18, status: 'Low Stock' },
    //   { id: '#003', name: 'Water Bottle', cat: 'Drinks', price: 1.50, qty: 0, status: 'Out' },
    // ];

    const [stockItems, setStockItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch('http://localhost:4000/api/products');
          const data = await response.json();
          setStockItems(data);
        }
        catch(err){
          console.error('Failed to fetch products:', err);
        }
        finally {
          setLoading(false);
        }
      }
    });
  
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Stock Management</h2>
            <p className="text-slate-500 text-sm">Manage your inventory and products</p>
          </div>
          <div className="flex gap-4">
             <input type="text" placeholder="Search products..." className="px-4 py-2 border rounded-xl w-64 focus:outline-blue-500" />
             <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">+ Add Product</button>
          </div>
        </div>
  
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Products', val: '248', color: 'text-slate-800' },
            { label: 'In Stock', val: '215', color: 'text-emerald-500' },
            { label: 'Low Stock', val: '25', color: 'text-amber-500' },
            { label: 'Out of Stock', val: '8', color: 'text-rose-500' },
          ].map(s => (
            <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-400 font-medium mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>
  
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockItems.map(item => (
                <tr key={item.id} className="text-sm text-slate-600">
                  <td className="px-6 py-4 font-mono">{item.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">{item.cat}</td>
                  <td className="px-6 py-4 font-bold">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{item.qty}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">Edit</button>
                    <button className="p-2 hover:bg-rose-50 rounded-lg text-rose-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default StockManagement;