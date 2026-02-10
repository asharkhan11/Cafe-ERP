
import React, { useState, useEffect } from 'react';
import { View, Order, Product, OrderItem, Staff, StoreConfig } from './types';
import { DataEngine } from './services/dataEngine';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import AIInsights from './components/AIInsights';
import Reports from './components/Reports';
import StaffView from './components/Staff';
import ReceiptModal from './components/ReceiptModal';
import OrdersHistory from './components/OrdersHistory';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [showReceiptPrompt, setShowReceiptPrompt] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      const [p, o, s, c] = await Promise.all([
        DataEngine.getProducts(),
        DataEngine.getOrders(),
        DataEngine.getStaff(),
        DataEngine.getConfig()
      ]);
      setProducts(p);
      setOrders(o);
      setStaff(s);
      setConfig(c);
      setIsLoading(false);
    };
    bootstrap();
  }, []);

  const handleCompleteOrder = async (items: OrderItem[], paymentMethod: 'cash' | 'card' | 'upi') => {
    if (!config) return;
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalCost = items.reduce((sum, i) => sum + i.cost * i.quantity, 0);
    const tax = subtotal * config.taxRate;
    const total = subtotal + tax;
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6),
      items,
      subtotal,
      tax,
      total,
      profit: total - totalCost,
      timestamp: Date.now(),
      paymentMethod,
      staffId: staff.find(s => s.isClockedIn)?.name || 'Admin',
      status: 'completed'
    };

    await DataEngine.saveOrder(newOrder);
    const [up, uo] = await Promise.all([DataEngine.getProducts(), DataEngine.getOrders()]);
    setProducts([...up]);
    setOrders([...uo]);
    setLastCompletedOrder(newOrder);
    setShowReceiptPrompt(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    const updatedOrders = await DataEngine.cancelOrder(orderId);
    setOrders([...updatedOrders]);
    const updatedProducts = await DataEngine.getProducts();
    setProducts([...updatedProducts]);
  };

  const handleSaveProduct = async (product: Product) => {
    await DataEngine.updateProduct(product);
    const updatedProducts = await DataEngine.getProducts();
    setProducts([...updatedProducts]);
  };

  const handleDeleteProduct = async (productId: string) => {
    await DataEngine.deleteProduct(productId);
    const updatedProducts = await DataEngine.getProducts();
    setProducts([...updatedProducts]);
  };

  const handleViewReceipt = (order: Order) => {
    setLastCompletedOrder(order);
    setShowReceiptModal(true);
  };

  const renderView = () => {
    if (!config) return null;
    switch (currentView) {
      case 'dashboard': return <Dashboard orders={orders} products={products} config={config} onNavigate={setView} />;
      case 'pos': return <POS products={products} config={config} onCompleteOrder={handleCompleteOrder} />;
      case 'orders': return <OrdersHistory orders={orders} config={config} onViewReceipt={handleViewReceipt} onCancelOrder={handleCancelOrder} />;
      case 'inventory': return <Inventory 
        products={products} 
        config={config} 
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
      />;
      case 'reports': return <Reports orders={orders} products={products} config={config} />;
      case 'staff': return <StaffView staff={staff} onToggleClock={async (id) => setStaff(await DataEngine.toggleClock(id))} />;
      case 'ai-insights': return <AIInsights orders={orders} products={products} />;
      default: return <Dashboard orders={orders} products={products} config={config} onNavigate={setView} />;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return `Namaste, ${staff.find(s => s.isClockedIn)?.name.split(' ')[0] || 'Manager'}`;
      case 'orders': return 'Order History';
      case 'pos': return 'Mumbai Terminal 1';
      case 'inventory': return 'Stock & Assets';
      default: return currentView.toUpperCase();
    }
  };

  if (isLoading || !config) return <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white font-black uppercase tracking-widest">Initialising Mumbai Brew...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 text-slate-900">
      <Sidebar currentView={currentView} setView={setView} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <span className="text-2xl">☰</span>
            </button>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">{getViewTitle()}</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{config.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto">{renderView()}</div>
        </main>
      </div>

      {showReceiptPrompt && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center space-y-6 scale-in-center">
            <div className="text-5xl">✅</div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Order Success</h3>
            <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase">Transaction complete. Generate GST bill?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowReceiptPrompt(false); setShowReceiptModal(true); }} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">YES, VIEW RECEIPT</button>
              <button onClick={() => setShowReceiptPrompt(false)} className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-slate-200 transition-all">CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && lastCompletedOrder && (
        <ReceiptModal order={lastCompletedOrder} config={config} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};

export default App;
