
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard' as View, label: 'Overview', icon: '📊' },
    { id: 'pos' as View, label: 'Terminal', icon: '💳' },
    { id: 'orders' as View, label: 'History', icon: '📑' },
    { id: 'inventory' as View, label: 'Inventory', icon: '📦' },
    { id: 'reports' as View, label: 'Analytics', icon: '📈' },
    { id: 'staff' as View, label: 'Team', icon: '👥' },
    { id: 'ai-insights' as View, label: 'AI Advisor', icon: '✨' },
  ];

  const handleNavClick = (view: View) => {
    setView(view);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-100 rotate-3 shrink-0">
              ☕
            </div>
            <div>
              <h1 className="font-black text-lg text-slate-800 tracking-tighter leading-none uppercase">Mumbai Brew</h1>
              <p className="text-[9px] text-indigo-500 font-black tracking-widest mt-1">PRO EDITION</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all text-sm font-bold ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">⚙️</div>
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">POS Status</p>
            <p className="text-sm font-bold mb-4">Live: Colaba Terminal</p>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
               <div className="bg-indigo-400 h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
