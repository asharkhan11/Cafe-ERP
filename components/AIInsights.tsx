
import React, { useState, useEffect } from 'react';
import { getBusinessInsights, getSmartMenuSuggestions } from '../services/geminiService';
import { Order, Product } from '../types';

interface AIInsightsProps {
  orders: Order[];
  products: Product[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ orders, products }) => {
  const [insights, setInsights] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await getBusinessInsights(orders, products);
      const suggRes = await getSmartMenuSuggestions(products);
      setInsights(res);
      setSuggestions(suggRes);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">GEMINI ADVISORY</h2>
          <p className="text-xs text-slate-500 font-medium">Predictive business intelligence.</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black text-sm transition-all hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100"
        >
          {loading ? 'ANALYZING...' : 'GENERATE NEW ADVICE'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white p-6 lg:p-10 rounded-[32px] border border-indigo-100 shadow-sm relative overflow-hidden min-h-[400px]">
          <div className="absolute top-0 right-0 p-6 opacity-5 text-9xl pointer-events-none select-none">💡</div>
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">✨</span>
            EXECUTIVE SUMMARY
          </h3>
          <div className="prose prose-indigo max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {insights || (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -bottom-8 -right-8 opacity-20 text-[180px] group-hover:scale-110 transition-transform duration-1000">☕</div>
             <h3 className="text-lg font-black mb-2 tracking-tight">MENU EVOLUTION</h3>
             <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-8">Generated Seasonal Expansions</p>
             <div className="space-y-3 relative z-10">
               {suggestions.map((s, idx) => (
                 <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all cursor-pointer">
                   <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-xs">
                     {idx + 1}
                   </div>
                   <span className="font-bold text-sm">{s}</span>
                   <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-black">
                     <span>DEPLOY</span>
                     <span className="text-lg">➔</span>
                   </div>
                 </div>
               ))}
               {!loading && suggestions.length === 0 && <p className="text-slate-400 italic text-sm">No suggestions yet.</p>}
               {loading && <div className="space-y-3 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl"></div>)}
               </div>}
             </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">Performance Milestones</h3>
            <ul className="space-y-5">
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black shadow-sm shrink-0">✓</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Supply Chain Audit</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight tracking-wider">Completed Oct 2023</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-black shadow-sm shrink-0">→</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Digital Loyalty System</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">Prototype Stage</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
