
import React, { useState } from 'react';
import { Product, OrderItem, Category, StoreConfig } from '../types';

interface POSProps {
  products: Product[];
  config: StoreConfig;
  onCompleteOrder: (items: OrderItem[], paymentMethod: 'cash' | 'card' | 'upi') => void;
}

const POS: React.FC<POSProps> = ({ products, config, onCompleteOrder }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState<Category | 'All'>('All');

  const getProductStock = (id: string) => products.find(p => p.id === id)?.stock || 0;

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty >= product.stock) {
        alert(`Insufficient stock for ${product.name}.`);
        return prev;
      }
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        quantity: 1, 
        price: product.price,
        cost: product.cost
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.productId === productId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      const stock = getProductStock(productId);
      if (delta > 0 && newQty > stock) return prev;
      if (newQty <= 0) return prev.filter(i => i.productId !== productId);
      return prev.map(i => i.productId === productId ? { ...i, quantity: newQty } : i);
    });
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * config.taxRate;
  const total = subtotal + tax;

  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] min-h-[500px]">
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', ...Object.values(Category)].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-1 scrollbar-thin">
          {filteredProducts.map(product => {
            const inCart = cart.find(i => i.productId === product.id)?.quantity || 0;
            const isOutOfStock = product.stock <= inCart;
            return (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                className={`group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left hover:border-indigo-500 transition-all ${isOutOfStock ? 'opacity-50 grayscale-[0.5]' : ''}`}
              >
                <div className="h-32 w-full overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  {inCart > 0 && <span className="absolute top-2 right-2 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">{inCart}</span>}
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-slate-800 text-xs truncate uppercase">{product.name}</h4>
                  <p className="text-indigo-600 font-black text-sm mt-0.5">{config.currency}{product.price.toFixed(2)}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Stock: {product.stock - inCart}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-[380px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden h-full">
        <div className="p-5 border-b flex justify-between items-center shrink-0">
          <h3 className="text-lg font-black text-slate-800">New Order</h3>
          <button onClick={() => setCart([])} className="text-[10px] text-rose-500 font-black bg-rose-50 px-2 py-1 rounded">CLEAR</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {cart.map(item => (
            <div key={item.productId} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-xs truncate uppercase tracking-tighter">{item.name}</p>
                <p className="text-[10px] font-bold text-indigo-500">{config.currency}{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl">
                <button onClick={() => updateQuantity(item.productId, -1)} className="w-7 h-7 bg-white rounded-lg text-xs font-bold shadow-sm">−</button>
                <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, 1)} className="w-7 h-7 bg-white rounded-lg text-xs font-bold shadow-sm">+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 bg-white border-t shrink-0">
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase"><span>Subtotal</span><span>{config.currency}{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase"><span>GST (5%)</span><span>{config.currency}{tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-black text-xl pt-2 border-t text-slate-900"><span>TOTAL</span><span className="text-indigo-600">{config.currency}{total.toFixed(2)}</span></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onCompleteOrder(cart, 'cash')} disabled={cart.length === 0} className="py-3 bg-slate-100 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-[0.97] disabled:opacity-50">
              <span className="text-lg">💵</span><span className="text-[9px] font-black uppercase text-slate-600">Cash</span>
            </button>
            <button onClick={() => onCompleteOrder(cart, 'card')} disabled={cart.length === 0} className="py-3 bg-slate-100 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-[0.97] disabled:opacity-50">
              <span className="text-lg">💳</span><span className="text-[9px] font-black uppercase text-slate-600">Card</span>
            </button>
            <button onClick={() => onCompleteOrder(cart, 'upi')} disabled={cart.length === 0} className="py-3 bg-indigo-600 text-white rounded-2xl flex flex-col items-center gap-1 transition-all shadow-lg active:scale-[0.97] disabled:opacity-50">
              <span className="text-lg">📲</span><span className="text-[9px] font-black uppercase">UPI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
