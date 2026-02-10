
import React, { useState } from 'react';
import { Order, StoreConfig } from '../types';

interface OrdersHistoryProps {
  orders: Order[];
  config: StoreConfig;
  onViewReceipt: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
}

const OrdersHistory: React.FC<OrdersHistoryProps> = ({ orders, config, onViewReceipt, onCancelOrder }) => {
  const [filter, setFilter] = useState<'all' | 'cash' | 'card' | 'upi'>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.paymentMethod === filter;
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.staffId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalSales: filteredOrders.reduce((sum, o) => sum + (o.status === 'completed' ? o.total : 0), 0),
    totalGst: filteredOrders.reduce((sum, o) => sum + (o.status === 'completed' ? o.tax : 0), 0),
    count: filteredOrders.length
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtered Sales</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{config.currency}{stats.totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total GST Collected</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{config.currency}{stats.totalGst.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Count</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.count}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'cash', 'card', 'upi'].map((m) => (
            <button
              key={m}
              onClick={() => setFilter(m as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === m ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search ID or Staff..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Staff</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className={`hover:bg-slate-50/50 transition-colors ${order.status === 'cancelled' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 font-black text-slate-700 text-xs">#{order.id.toUpperCase()}</td>
                  <td className="px-6 py-4 text-slate-500 text-[10px] font-medium">
                    {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                      order.paymentMethod === 'upi' ? 'bg-emerald-100 text-emerald-700' : 
                      order.paymentMethod === 'card' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-800 text-xs">
                    {config.currency}{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[10px] font-bold">
                    {order.staffId}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onViewReceipt(order)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-indigo-600 text-lg"
                        title="Print / View Receipt"
                      >
                        🖨️
                      </button>
                      {order.status !== 'cancelled' && (
                        <button 
                          onClick={() => { if(confirm('Cancel this order? Stock will be returned.')) onCancelOrder(order.id) }}
                          className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-rose-400 text-lg"
                          title="Cancel Transaction"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersHistory;
