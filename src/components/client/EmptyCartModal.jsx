import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const EmptyCartModal = ({ onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 pb-10 pointer-events-auto animate-in slide-in-from-bottom duration-300 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-8"></div> {/* Spacer */}
          <h2 className="text-lg font-bold text-slate-900">Tus carritos</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
           <div className="w-24 h-24 mb-6 relative">
              <ShoppingBag size={96} strokeWidth={1} className="text-slate-300" />
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                  <span className="text-3xl font-bold text-slate-300">P</span>
              </div>
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">No tienes carritos creados</h3>
           <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
             Los carritos que armes quedarán listos para que termines tus pedidos.
           </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EmptyCartModal;
