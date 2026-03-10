import React, { useState, useEffect, useMemo } from 'react';

// src/pages/StockManagement.jsx
const StockManagement = () => {
    const apiBaseUrl = useMemo(() => 'http://localhost:4000', []);

    const [stockItems, setStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      let cancelled = false;

      const fetchProducts = async () => {
        setError('');
        setLoading(true);
        try {
          const response = await fetch(`${apiBaseUrl}/api/products`);
          const data = await response.json().catch(() => []);
          if (!response.ok) {
            throw new Error(data?.error || 'Failed to load products');
          }
          if (!cancelled) {
            setStockItems(Array.isArray(data) ? data : []);
          }
        } catch (err) {
          if (!cancelled) {
            console.error('Failed to fetch products:', err);
            setError(err?.message || 'Failed to load products');
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

      fetchProducts();

      return () => {
        cancelled = true;
      };
    }, [apiBaseUrl]);

    const {
      totalProducts,
      inStockCount,
      lowStockCount,
      outOfStockCount,
    } = useMemo(() => {
      let total = stockItems.length;
      let inStock = 0;
      let lowStock = 0;
      let outOfStock = 0;

      for (const item of stockItems) {
        const qty = Number(item?.stock_quantity ?? 0);
        const min = Number(item?.min_stock_level ?? 0);

        if (qty <= 0) {
          outOfStock += 1;
        } else if (qty > 0 && qty <= min) {
          lowStock += 1;
        } else if (qty > min) {
          inStock += 1;
        }
      }

      return {
        totalProducts: total,
        inStockCount: inStock,
        lowStockCount: lowStock,
        outOfStockCount: outOfStock,
      };
    }, [stockItems]);

    const rows = useMemo(() => {
      return stockItems.map((item) => {
        const qty = Number(item?.stock_quantity ?? 0);
        const min = Number(item?.min_stock_level ?? 0);
        let status = 'In Stock';

        if (qty <= 0) {
          status = 'Out of Stock';
        } else if (qty > 0 && qty <= min) {
          status = 'Low Stock';
        }

        return {
          id: item.id,
          name: item.name,
          category: item.category,
          price: Number(item.price ?? 0),
          quantity: qty,
          status,
        };
      });
    }, [stockItems]);
  
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
            { label: 'Total Products', val: totalProducts, color: 'text-slate-800' },
            { label: 'In Stock', val: inStockCount, color: 'text-emerald-500' },
            { label: 'Low Stock', val: lowStockCount, color: 'text-amber-500' },
            { label: 'Out of Stock', val: outOfStockCount, color: 'text-rose-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-400 font-medium mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>
                {loading ? '—' : s.val}
              </p>
            </div>
          ))}
        </div>

        {error ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        ) : null}
  
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
              {rows.map((item) => (
                <tr key={item.id} className="text-sm text-slate-600">
                  <td className="px-6 py-4 font-mono">#{String(item.id).padStart(3, '0')}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4 font-bold">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
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