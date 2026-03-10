import React, { useEffect, useMemo, useState } from 'react';

// src/pages/StockManagement.jsx
const StockManagement = () => {
    const apiBaseUrl = useMemo(() => 'http://localhost:4000', []);
    const [currencyCode, setCurrencyCode] = useState('USD');

    const [stockItems, setStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [addProductOpen, setAddProductOpen] = useState(false);
    const [addingProduct, setAddingProduct] = useState(false);
    const [addProductError, setAddProductError] = useState('');
    const [addProductForm, setAddProductForm] = useState({
      name: '',
      sku: '',
      category: '',
      price: '',
      stock_quantity: '',
      min_stock_level: '',
    });

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

    useEffect(() => {
      let cancelled = false;
      const load = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/api/settings`);
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data?.error || 'Failed to load settings');
          const next = String(data?.currency ?? '').trim();
          if (!cancelled && next) setCurrencyCode(next);
        } catch {
          // keep fallback
        }
      };
      load();
      return () => { cancelled = true; };
    }, [apiBaseUrl]);

    const money = useMemo(() => {
      const code = String(currencyCode || 'USD').trim().toUpperCase();
      try {
        const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: code });
        return (n) => fmt.format(Number(n || 0));
      } catch {
        const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
        return (n) => fmt.format(Number(n || 0));
      }
    }, [currencyCode]);

    const fetchProducts = async () => {
      setError('');
      setLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/api/products`);
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error(data?.error || 'Failed to load products');
        setStockItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const openAddProduct = () => {
      setAddProductError('');
      setAddProductForm({
        name: '',
        sku: '',
        category: '',
        price: '',
        stock_quantity: '',
        min_stock_level: '',
      });
      setAddProductOpen(true);
    };

    const closeAddProduct = () => {
      if (addingProduct) return;
      setAddProductOpen(false);
    };

    const updateAddProductField = (field) => (e) => {
      const value = e.target.value;
      setAddProductForm((prev) => ({ ...prev, [field]: value }));
    };

    const submitAddProduct = async (e) => {
      e.preventDefault();
      if (addingProduct) return;
      setAddProductError('');

      const name = addProductForm.name.trim();
      const sku = addProductForm.sku.trim();
      const category = addProductForm.category.trim();
      const price = Number(addProductForm.price);
      const stock_quantity = Number(addProductForm.stock_quantity);
      const min_stock_level = Number(addProductForm.min_stock_level);

      if (!name || !sku || !category) {
        setAddProductError('Please fill in all required fields.');
        return;
      }
      if (!Number.isFinite(price) || price <= 0) {
        setAddProductError('Please enter a valid price greater than 0.');
        return;
      }
      if (!Number.isInteger(stock_quantity) || stock_quantity < 1) {
        setAddProductError('Please enter a valid stock quantity (1 or more).');
        return;
      }
      if (!Number.isInteger(min_stock_level) || min_stock_level < 1) {
        setAddProductError('Please enter a valid minimum stock level (1 or more).');
        return;
      }

      setAddingProduct(true);
      try {
        const response = await fetch(`${apiBaseUrl}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, sku, category, price, stock_quantity, min_stock_level }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || 'Failed to add product');

        await fetchProducts();
        setAddProductOpen(false);
      } catch (err) {
        setAddProductError(err?.message || 'Failed to add product');
      } finally {
        setAddingProduct(false);
      }
    };

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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Stock Management</h2>
            <p className="text-slate-500 text-sm">Manage your inventory and products</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
             <input
               type="text"
               placeholder="Search products..."
               className="px-4 py-2 border rounded-xl w-full sm:w-72 focus:outline-blue-500"
             />
             <button
               type="button"
               onClick={openAddProduct}
               className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold w-full sm:w-auto"
             >
               + Add Product
             </button>
          </div>
        </div>

        {addProductOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <button
              type="button"
              onClick={closeAddProduct}
              className="absolute inset-0 bg-black/60"
              aria-label="Close add product modal"
            />

            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Add product</h3>
              </div>

              <form className="space-y-4" onSubmit={submitAddProduct}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product name</label>
                    <input
                      type="text"
                      value={addProductForm.name}
                      onChange={updateAddProductField('name')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                      placeholder="e.g. Sugar 1kg"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</label>
                    <input
                      type="text"
                      value={addProductForm.sku}
                      onChange={updateAddProductField('sku')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                      placeholder="e.g. SUG-001"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      value={addProductForm.category}
                      onChange={updateAddProductField('category')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                      placeholder="e.g. Grocery"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={addProductForm.price}
                      onChange={updateAddProductField('price')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                      placeholder="e.g. 120.00"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock quantity</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      min="1"
                      value={addProductForm.stock_quantity}
                      onChange={updateAddProductField('stock_quantity')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                      placeholder="e.g. 50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min stock level</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      min="1"
                      value={addProductForm.min_stock_level}
                      onChange={updateAddProductField('min_stock_level')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                      placeholder="e.g. 10"
                      required
                    />
                  </div>
                </div>

                {addProductError ? (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold rounded-xl px-4 py-3">
                    {addProductError}
                  </div>
                ) : null}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeAddProduct}
                    className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                    disabled={addingProduct}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300"
                    disabled={addingProduct}
                  >
                    {addingProduct ? 'Saving…' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
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
                  <td className="px-6 py-4 font-bold">{money(item.price)}</td>
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
      </div>
    );
  };
  
  export default StockManagement;