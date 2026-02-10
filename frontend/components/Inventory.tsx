
import React, { useState, useRef } from 'react';
import { Product, Category, StoreConfig } from '../types';

interface InventoryProps {
  products: Product[];
  config: StoreConfig;
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

const Inventory: React.FC<InventoryProps> = ({ products, config, onSaveProduct, onDeleteProduct }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || {
      id: '',
      name: '',
      price: 0,
      cost: 0,
      category: Category.BEVERAGES,
      stock: 0,
      minStock: 5,
      image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=200&h=200'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct.name) {
      await onSaveProduct(editingProduct as Product);
      handleCloseModal();
    }
  };

  const handleQuickStock = async (e: React.MouseEvent, id: string, current: number, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find(p => p.id === id);
    if (product) {
      await onSaveProduct({ ...product, stock: current + delta });
    }
  };

  const handleDelete = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${product.name.toUpperCase()}" from the menu? This action cannot be undone.`)) {
      await onDeleteProduct(product.id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size validation (limit to 2MB for localStorage health)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please select a file smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => prev ? { ...prev, image: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search Mumbai Brew inventory..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            <span>✨</span> NEW MENU ITEM
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Price / Cost</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(product => {
                const isLow = product.stock <= product.minStock;
                const isCritical = product.stock === 0;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-100" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm uppercase tracking-tight">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-wider border border-indigo-100">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-slate-800 font-black text-sm">{config.currency}{product.price.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-400 font-bold">Cost: {config.currency}{product.cost.toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-rose-500 animate-pulse' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <div className="flex flex-col">
                          <span className={`text-sm font-black ${isLow ? 'text-rose-600' : 'text-slate-700'}`}>{product.stock} Units</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Min: {product.minStock}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleQuickStock(e, product.id, product.stock, 10)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          +10 Stock
                        </button>
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, product)}
                          className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="text-6xl mb-4 grayscale opacity-20">📦</div>
                    <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">No assets in storage</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Management Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    {editingProduct.id ? 'Edit Menu Item' : 'New Menu Addition'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Mumbai Brew Inventory Manager</p>
                </div>
                <button type="button" onClick={handleCloseModal} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-200 transition-all text-slate-400 font-bold text-xl">✕</button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Item Name</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingProduct.name}
                        onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        placeholder="e.g. Cutting Chai"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                        value={editingProduct.category}
                        onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}
                      >
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Retail Price ({config.currency})</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editingProduct.price}
                          onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Unit Cost ({config.currency})</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editingProduct.cost}
                          onChange={e => setEditingProduct({ ...editingProduct, cost: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock & Visuals */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Initial Stock</label>
                        <input
                          required
                          type="number"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editingProduct.stock}
                          onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Alert Threshold</label>
                        <input
                          required
                          type="number"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editingProduct.minStock}
                          onChange={e => setEditingProduct({ ...editingProduct, minStock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Item Photo</label>
                      <div className="flex gap-4 items-center">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-4 py-6 text-center cursor-pointer hover:border-indigo-500 transition-colors group relative overflow-hidden"
                        >
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest">Select From Device</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-200 shadow-inner group transition-transform hover:scale-105 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          {editingProduct.image ? (
                            <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">🖼️</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100">
                      <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-1">Projected Margin</p>
                      <p className="text-xl font-black text-indigo-900">
                        {editingProduct.price && editingProduct.cost
                          ? `${(((editingProduct.price - editingProduct.cost) / editingProduct.price) * 100).toFixed(1)}%`
                          : '0.0%'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-4 px-6 rounded-2xl bg-white border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                >
                  {editingProduct.id ? 'UPDATE ASSET' : 'PUBLISH TO MENU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
