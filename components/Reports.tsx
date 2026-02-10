
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Order, Product, StoreConfig } from '../types';

interface ReportsProps {
  orders: Order[];
  products: Product[];
  config: StoreConfig;
}

const Reports: React.FC<ReportsProps> = ({ orders, products, config }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalProfit = orders.reduce((sum, o) => sum + o.profit, 0);
  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Aggregate item sales
  const itemSales = orders.flatMap(o => o.items).reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const topItemsData = Object.entries(itemSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const hourlySales = orders.reduce((acc, o) => {
    const hour = new Date(o.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + o.total;
    return acc;
  }, {} as Record<number, number>);

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    amount: hourlySales[i] || 0
  })).filter(d => d.amount > 0 || (parseInt(d.hour) > 8 && parseInt(d.hour) < 22));

  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
          <p className="text-4xl font-black text-slate-900 mt-2">{config.currency}{totalRevenue.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full w-fit">
            ↑ 8.4% <span className="text-slate-400 font-normal">vs last week</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Net Profit</p>
          <p className="text-4xl font-black text-indigo-600 mt-2">{config.currency}{totalProfit.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-4">Estimated based on unit costs</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Profit Margin</p>
          <p className="text-4xl font-black text-slate-900 mt-2">{margin.toFixed(1)}%</p>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-full" style={{ width: `${margin}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Hourly Revenue Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Top Selling Products</h3>
          <div className="h-80 flex">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topItemsData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {topItemsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-48 flex flex-col justify-center gap-4">
              {topItemsData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-sm font-semibold text-slate-600 truncate">{item.name}</span>
                  <span className="text-xs text-slate-400 font-bold ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
