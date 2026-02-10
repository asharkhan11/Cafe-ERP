
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Order, Product, View, StoreConfig } from '../types';

interface DashboardProps {
  orders: Order[];
  products: Product[];
  config: StoreConfig;
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, products, config, onNavigate }) => {
  const lowStockItems = products.filter(p => p.stock < p.minStock);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const endOfYesterday = new Date(startOfToday.getTime() - 1);


  // Sort products by stock unit in increasing order to show lowest stock first
  const sortedLowStockProducts = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5);

  const todaysOrders = orders.filter(o =>
    o.timestamp >= startOfToday.getTime() &&
    o.timestamp <= endOfToday.getTime()
  );

  const yesterdaysOrders = orders.filter(o =>
    o.timestamp >= startOfYesterday.getTime() &&
    o.timestamp <= endOfYesterday.getTime()
  );

  const todaysRevenue = todaysOrders.reduce((s, o) => s + o.total, 0);
  const yesterdaysRevenue = yesterdaysOrders.reduce((s, o) => s + o.total, 0);

  const revenueChange =
    yesterdaysRevenue === 0
      ? 0
      : ((todaysRevenue - yesterdaysRevenue) / yesterdaysRevenue) * 100;

  const totalOrders = todaysOrders.length;

  const avgOrderValue = totalOrders > 0 ? todaysRevenue / totalOrders : 0;

  const salesData = todaysOrders.map(o => ({
    time: new Date(o.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    total: o.total
  }));


  return (
    <div className="space-y-6 pb-8">
      {/* Actionable Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <button
          onClick={() => onNavigate('reports')}
          className="group text-left bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex justify-between items-start">
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
            <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">→</span>
          </div>
          <p className="text-xl lg:text-3xl font-black text-slate-900 mt-1">{config.currency}{todaysRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <div className="mt-2 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full w-fit">{revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange).toFixed(1)}%</div>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="group text-left bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex justify-between items-start">
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Orders</p>
            <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">→</span>
          </div>
          <p className="text-xl lg:text-3xl font-black text-slate-900 mt-1">{totalOrders}</p>
          <div className="mt-2 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full w-fit">Live Tracking</div>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="group text-left bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex justify-between items-start">
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Value</p>
            <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">→</span>
          </div>
          <p className="text-xl lg:text-3xl font-black text-slate-900 mt-1">{config.currency}{avgOrderValue.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Per ticket average</p>
        </button>

        <button
          onClick={() => onNavigate('inventory')}
          className="group text-left bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-amber-500 transition-all hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex justify-between items-start">
            <p className="text-[10px] lg:text-xs font-bold text-amber-600 uppercase tracking-widest">Alerts</p>
            <span className="text-slate-300 group-hover:text-amber-600 transition-colors font-bold">Manage ➔</span>
          </div>
          <p className="text-xl lg:text-3xl font-black text-slate-900 mt-1">{lowStockItems.length}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">Items require restocking</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 uppercase tracking-tighter">Recent Sales Trend</h3>
            <span className="text-[10px] bg-slate-50 px-2 py-1 rounded-full font-bold text-slate-400">LAST 7 ORDERS</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} hide={window.innerWidth < 640} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Stock Health (Lowest First)</h3>
          <div className="space-y-5">
            {sortedLowStockProducts.map(p => (
              <div key={p.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 uppercase tracking-tight truncate max-w-[150px]">{p.name}</span>
                  <span className={p.stock < p.minStock ? 'text-rose-500' : 'text-indigo-500'}>{p.stock} Units</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${p.stock < p.minStock ? 'bg-rose-500' : 'bg-indigo-500'}`}
                    style={{ width: `${Math.min(100, (p.stock / 100) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-center text-slate-400 py-10">No stock data available</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
