
import React from 'react';
import { Order, StoreConfig } from '../types';

interface ReceiptModalProps {
  order: Order;
  config: StoreConfig;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, config, onClose }) => {
  const handlePrint = () => {
    // Standard web print triggers the @media print styles defined below
    window.print();
  };

  const handleShare = () => {
    const text = `Mumbai Brew Receipt\nOrder: #${order.id.toUpperCase()}\nTotal: ${config.currency}${order.total.toFixed(2)}\nThank you!`;
    if (navigator.share) {
      navigator.share({ title: 'Receipt', text }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Receipt summary copied to clipboard!');
    }
  };

  const cgst = order.tax / 2;
  const sgst = order.tax / 2;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Receipt Header Actions */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 print:hidden">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Digital Bill</h3>
          <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500" title="Share">
              📤
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
              ✕
            </button>
          </div>
        </div>

        <div id="receipt-area" className="flex-1 overflow-y-auto p-8 bg-white text-slate-800 font-mono text-sm print:p-0">
          <div className="text-center space-y-2 mb-6">
            <div className="text-4xl print:text-3xl">☕</div>
            <h2 className="text-xl font-black uppercase tracking-tighter print:text-lg">{config.name}</h2>
            <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
              Marine Drive, Mumbai, 400020<br/>
              GSTIN: 27AABCM1234F1Z1<br/>
              Tel: +91 98765 43210
            </p>
          </div>

          <div className="border-t border-b border-dashed border-slate-300 py-4 mb-4 space-y-1 text-[11px] font-sans">
            <div className="flex justify-between">
              <span>Bill No:</span>
              <span className="font-bold">#{order.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(order.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span className="uppercase">{order.staffId}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-12 gap-2 font-bold mb-2 text-[9px] uppercase tracking-widest font-sans text-slate-400 print:text-slate-900">
              <span className="col-span-7">Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-3 text-right">Price</span>
            </div>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 text-[11px] font-sans">
                  <span className="col-span-7 font-bold uppercase truncate">{item.name}</span>
                  <span className="col-span-2 text-center text-slate-500 print:text-slate-900">x{item.quantity}</span>
                  <span className="col-span-3 text-right font-black">{config.currency}{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300 pt-4 space-y-1.5 font-sans">
            <div className="flex justify-between text-[11px]">
              <span>Subtotal</span>
              <span>{config.currency}{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 italic print:text-slate-900">
              <span>CGST (2.5%)</span>
              <span>{config.currency}{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 italic print:text-slate-900">
              <span>SGST (2.5%)</span>
              <span>{config.currency}{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black pt-2 mt-2 border-t border-slate-900">
              <span>GRAND TOTAL</span>
              <span className="text-indigo-600 print:text-slate-900">{config.currency}{order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-8 space-y-3">
            <div className="inline-block p-1 border border-slate-200 rounded-lg opacity-40 print:opacity-100">
               {/* Simplified QR Code Placeholder */}
               <div className="w-16 h-16 bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                  QR FOR UPI
               </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-slate-400 print:text-slate-900">Paid via {order.paymentMethod}</p>
              {order.status === 'cancelled' && (
                <p className="text-rose-500 font-black uppercase text-xs border-2 border-rose-500 py-1 rounded-lg">VOID TRANSACTION</p>
              )}
              <p className="text-[9px] font-sans text-slate-400 uppercase tracking-widest mt-4">Dhanyavaad! Visit again!</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 print:hidden">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 px-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
          >
            Close
          </button>
          <button 
            onClick={handlePrint} 
            className="flex-1 py-4 px-4 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <span>🖨️</span> PRINT BILL
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          /* Hide everything except the receipt area */
          body * { 
            visibility: hidden; 
            margin: 0;
            padding: 0;
          }
          #receipt-area, #receipt-area * { 
            visibility: visible; 
          }
          #receipt-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 80mm; /* Standard thermal paper width */
            padding: 5mm !important;
            margin: 0 auto;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            font-family: 'Courier New', Courier, monospace !important;
          }
          
          /* Force colors for visibility on thermal paper */
          .print\\:text-slate-900 { color: black !important; }
          .print\\:text-lg { font-size: 1.25rem !important; }
          .print\\:text-3xl { font-size: 2rem !important; }

          /* Adjustments for narrow paper */
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptModal;
