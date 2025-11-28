import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Minus, Plus, ChevronDown } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart, initialQuantity = 1, initialOptions = { extras: [], instructions: '' } }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [options, setOptions] = useState(initialOptions);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));

  const totalPrice = product.price * quantity;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header Image */}
        <div className="relative h-64 shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <X size={20} className="text-slate-800" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl  text-slate-900 mb-2">{product.name}</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{product.desc}</p>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl  text-[#4c8479]">S/ {product.price.toFixed(2)}</span>
                <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs  text-slate-600">
                    Popular
                </div>
            </div>
          </div>

          {/* Options Mockup */}
          <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className=" text-slate-800">Elige tus salsas</h3>
                    <span className="bg-slate-100 text-[10px]  px-2 py-1 rounded text-slate-500">OBLIGATORIO</span>
                </div>
                <div className="space-y-3">
                    {['Mayonesa', 'Ketchup', 'Mostaza', 'Ají'].map((sauce) => (
                        <label key={sauce} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                            <span className="text-slate-700 font-medium">{sauce}</span>
                            <input type="radio" name="sauce" className="w-5 h-5 text-[#4c8479] focus:ring-[#4c8479]" />
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className=" text-slate-800 mb-3">Instrucciones especiales</h3>
                <textarea 
                    placeholder="Ej: Sin cebolla, extra picante..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c8479]/20"
                    rows={3}
                    value={options.instructions}
                    onChange={(e) => setOptions({...options, instructions: e.target.value})}
                />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
                <span className=" text-slate-900 text-sm">1 producto</span>
                <span className=" text-xl text-slate-900">S/ {totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-4">
                <div className="flex items-center bg-slate-100 rounded-xl px-2">
                    <button 
                        onClick={handleDecrement}
                        className="p-3 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                        disabled={quantity <= 1}
                    >
                        <Minus size={18} className="text-slate-600" />
                    </button>
                    <span className="w-8 text-center  text-lg text-slate-800">{quantity}</span>
                    <button 
                        onClick={handleIncrement}
                        className="p-3 hover:bg-white rounded-lg transition-colors"
                    >
                        <Plus size={18} className="text-slate-600" />
                    </button>
                </div>
                
                <button 
                    onClick={() => onAddToCart(product, quantity, options)}
                    className="flex-1 bg-[#4c8479] text-white  text-lg py-3 rounded-xl shadow-lg shadow-[#4c8479]/30 active:scale-[0.98] transition-transform"
                >
                    Agregar
                </button>
            </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
