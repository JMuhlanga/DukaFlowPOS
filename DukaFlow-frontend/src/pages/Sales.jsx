import React, { useEffect, useMemo, useState } from 'react';

const getStoredUser = () => {
  const raw = window.localStorage.getItem('dukaflow_user') ?? window.sessionStorage.getItem('dukaflow_user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const Sales = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [taxRate, setTaxRate] = useState(8);
  const [currency, setCurrency] = useState('USD');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submittingSale, setSubmittingSale] = useState(false);
  const [saleError, setSaleError] = useState('');

  const apiBaseUrl = useMemo(() => 'http://localhost:4000', []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const safeTaxRate = Number.isFinite(Number(taxRate)) ? Number(taxRate) : 0;
  const tax = subtotal * (safeTaxRate / 100);

  const money = useMemo(() => {
    const code = String(currency || 'USD').trim().toUpperCase();
    try {
      const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: code });
      return (n) => fmt.format(Number(n || 0));
    } catch {
      const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
      return (n) => fmt.format(Number(n || 0));
    }
  }, [currency]);

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

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setProductsError('');
      setLoadingProducts(true);
      try {
        const response = await fetch(`${apiBaseUrl}/api/products`);
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error(data?.error || 'Failed to load products');
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setProductsError(e?.message || 'Failed to load products');
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [apiBaseUrl]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/settings`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || 'Failed to load settings');
        const next = Number(data?.tax_rate);
        if (!cancelled && Number.isFinite(next)) setTaxRate(next);
        const nextCurrency = String(data?.currency ?? '').trim();
        if (!cancelled && nextCurrency) setCurrency(nextCurrency);
      } catch {
        // Keep default/fallback taxRate
      }
    };
    load();
    return () => { cancelled = true; };
  }, [apiBaseUrl]);

  const categories = useMemo(() => {
    const set = new Set(['All Items']);
    for (const p of products) {
      if (p?.category) set.add(p.category);
    }
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (!p) return false;
      if (activeCategory !== 'All Items' && p.category !== activeCategory) return false;
      if (!q) return true;
      return String(p.name ?? '').toLowerCase().includes(q) || String(p.sku ?? '').toLowerCase().includes(q);
    });
  }, [products, search, activeCategory]);

  const completePayment = async () => {
    if (submittingSale) return;
    setSaleError('');

    const user = getStoredUser();
    const userId = user?.id;
    if (!userId) {
      setSaleError('Please login again (missing user id).');
      return;
    }
    if (cart.length === 0) {
      setSaleError('Cart is empty.');
      return;
    }

    const payload = {
      user_id: userId,
      total_amount: Number((subtotal + tax).toFixed(2)),
      payment_method: paymentMethod,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      })),
    };

    setSubmittingSale(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Failed to record sale');
      setCart([]);
    } catch (e) {
      setSaleError(e?.message || 'Failed to record sale');
    } finally {
      setSubmittingSale(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-120px)]">
      {/* Product Grid Section */}
      <div className="flex-1 lg:overflow-y-auto lg:pr-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Sales</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="px-4 py-2 border rounded-xl w-full sm:w-72 focus:outline-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 border-b pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${cat === activeCategory ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loadingProducts ? (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-slate-500 text-sm">Loading products…</div>
          ) : productsError ? (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-rose-600 text-sm font-semibold">{productsError}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-slate-500 text-sm">No products found.</div>
          ) : filteredProducts.map(item => (
            <button 
              key={item.id} 
              onClick={() => addToCart({ id: item.id, name: item.name, price: Number(item.price), category: item.category })}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-500 transition-all flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-xl bg-slate-100" />
              <p className="font-bold text-slate-800">{item.name}</p>
              <p className="text-blue-600 font-bold">{money(item.price)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Current Order</h3>
          <button onClick={() => setCart([])} className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded">Clear</button>
        </div>

        <div className="flex-1 lg:overflow-y-auto p-4 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-100" />
              <div className="flex-1">
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-xs text-slate-400">{money(item.price)} x {item.quantity}</p>
              </div>
              <p className="font-bold text-sm">{money(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 space-y-3">
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Tax ({safeTaxRate.toFixed(2).replace(/\.00$/, '')}%)</span>
            <span>{money(tax)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-slate-900 border-t pt-3">
            <span>Total</span>
            <span>{money(subtotal + tax)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`py-3 rounded-xl font-bold ${
                paymentMethod === 'cash' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`py-3 rounded-xl font-bold ${
                paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Card
            </button>
          </div>
          {saleError ? (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold rounded-2xl px-4 py-3">
              {saleError}
            </div>
          ) : null}
          <button
            onClick={completePayment}
            disabled={submittingSale || cart.length === 0}
            className="w-full py-4 bg-emerald-500 disabled:bg-slate-300 text-white rounded-xl font-bold mt-2 hover:bg-emerald-600 transition-colors disabled:hover:bg-slate-300"
          >
            {submittingSale ? 'Processing…' : 'Complete Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;