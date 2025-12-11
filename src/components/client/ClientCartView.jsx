import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ChevronRight, X } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';
import { useCart } from '../../context/CartContext';

export default function ClientCartView({ setView, restaurant }) {
  const { cart, removeFromCart, updateQuantity: updateCartItem, addToCart } = useCart();
  
  const [editingItem, setEditingItem] = useState(null);

  const deliveryFee = restaurant?.deliveryFee || 3.90;
  
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const total = useMemo(() => {
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee]);

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (product, quantity, options) => {
    // Remove the old item and add the updated one
    // In a real app, we might update in place, but this ensures options are updated correctly
    removeFromCart(editingItem.cartId);
    addToCart(product, quantity, options);
    setEditingItem(null);
  };

  // Mock Upselling Items
  const upsellingItems = [
    { id: 901, name: 'Inca Kola 500ml', price: 4.00, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=60' },
    { id: 902, name: 'Chaufa Especial', price: 25.00, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=200&q=60' },
    { id: 903, name: 'Alitas BBQ', price: 24.00, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=200&q=60' }
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-full bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="w-8"></div> {/* Spacer for centering */}
          <h1 className="text-lg font-bold text-slate-900">Tus carritos</h1>
          <button 
            onClick={() => setView('main')}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        {/* Empty State Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-[-100px]">
           <div className="w-24 h-24 mb-6 relative">
              <ShoppingBag size={96} strokeWidth={1} className="text-slate-300" />
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                  <span className="text-3xl font-bold text-slate-300">P</span>
              </div>
           </div>
           <h2 className="text-xl font-bold text-slate-900 mb-2">No tienes carritos creados</h2>
           <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
             Los carritos que armes quedarán listos para que termines tus pedidos.
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 animate-in fade-in duration-500 min-h-full bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-30">
        <button 
          onClick={() => setView('main')}
          className="p-2 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <h1 className="flex-1 text-center  text-lg text-slate-800">Tu carrito</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Restaurant Header */}
        <div className="bg-white p-4 mb-2 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white  text-xs overflow-hidden">
                    {restaurant ? <img src={restaurant.image} alt="logo" className="w-full h-full object-cover" /> : 'LOGO'}
                </div>
                <div>
                    <h2 className=" text-slate-900 text-sm">{restaurant ? restaurant.name : 'Restaurante'}</h2>
                    <p className="text-xs text-[#4c8479]  cursor-pointer">Ir al local</p>
                </div>
            </div>
            
            <div className="flex bg-slate-50 rounded-xl p-1 mb-3">
                <button className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-xs  shadow-sm">Delivery</button>
                <button className="flex-1 text-slate-500 py-2 rounded-lg text-xs font-medium">Retiro en el local</button>
            </div>

            <div className="flex justify-between text-xs text-slate-600">
                <span>Recibes en <span className=" text-slate-900">{restaurant?.time || '25-45 min'}</span></span>
                <span className=" text-[#4c8479]">Programar</span>
            </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white p-4 mb-4 shadow-sm space-y-6">
            {cart.map(item => (
                <div key={item.cartId} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className=" text-slate-900 text-sm">{item.name}</h3>
                            <div className="flex items-center bg-slate-100 rounded-lg">
                                <button 
                                    onClick={() => updateCartItem(item.cartId, item.quantity - 1)}
                                    className="p-1 hover:bg-slate-200 rounded-lg transition"
                                >
                                    <Minus size={14} className="text-slate-600" />
                                </button>
                                <span className="text-xs font-medium w-6 text-center text-slate-900">{item.quantity}</span>
                                <button 
                                    onClick={() => updateCartItem(item.cartId, item.quantity + 1)}
                                    className="p-1 hover:bg-slate-200 rounded-lg transition"
                                >
                                    <Plus size={14} className="text-slate-600" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col mt-2 gap-1">
                             {item.options?.extras?.length > 0 && (
                                <p className="text-xs text-slate-500">{item.options.extras.join(', ')}</p>
                             )}
                             {item.options?.instructions && (
                                <p className="text-xs text-slate-400 italic">"{item.options.instructions}"</p>
                             )}
                             <div className="flex justify-end">
                                <p className="text-sm font-medium text-slate-900">S/ {(item.price * item.quantity).toFixed(2)}</p>
                             </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="p-2 text-slate-400 hover:text-red-500 transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>

        {/* Upselling Items */}
        <div className="bg-white p-4 mb-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Completa tu pedido</h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {upsellingItems.map(item => (
                    <div key={item.id} className="min-w-[140px] bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="w-full h-24 rounded-lg bg-white mb-2 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-medium text-slate-700 truncate mb-1">{item.name}</p>
                        <div className="flex justify-between items-center">
                            <span className=" text-slate-900 text-sm">S/ {item.price.toFixed(2)}</span>
                            <button 
                                onClick={() => addToCart(item, 1, { extras: [], instructions: '' })}
                                className="bg-white shadow-sm p-1 rounded-full border border-slate-200 active:scale-90 transition-transform"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white p-4 shadow-sm flex justify-center py-6">
            <button className="bg-slate-100 text-slate-900  text-sm px-6 py-3 rounded-xl w-full">
                Buscar más productos
            </button>
        </div>

        {/* Notes */}
        <div className="bg-white p-4 mt-2 shadow-sm flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-lg"><ShoppingBag size={18}/></div>
                <span className=" text-slate-900 text-sm">Notas para el local</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
        </div>

        {/* Summary */}
        <div className="p-4 mt-6">
            <h3 className=" text-lg text-slate-900 mb-4">Resumen</h3>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Productos</span>
                <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-600">Envío</span>
                <span className="font-medium">S/ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg  border-t border-slate-200 pt-4">
                <span>Subtotal</span>
                <span>S/ {total.toFixed(2)}</span>
            </div>
        </div>
      </div>

      {/* Footer Button */}
      {cart.length > 0 && createPortal(
        <div className="absolute bottom-0 w-full z-[60] pointer-events-auto">
            <div className="bg-white p-4 border-t border-slate-100 max-w-md mx-auto rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-slate-500 font-medium">{cart.length} producto{cart.length !== 1 ? 's' : ''}</span>
                    <span className="text-xl text-slate-900">S/ {total.toFixed(2)}</span>
                </div>
                <button 
                    onClick={() => setView('checkout')}
                    className="w-full bg-[#4c8479] text-white text-lg py-4 rounded-2xl shadow-lg shadow-[#4c8479]/30 active:scale-[0.98] transition-transform"
                >
                    Ir a pagar
                </button>
            </div>
        </div>,
        document.getElementById('sticky-footer-root')
      )}

      {/* Edit Modal */}
      {editingItem && (
        <ProductDetailModal
            product={editingItem}
            initialQuantity={editingItem.quantity}
            initialOptions={editingItem.options}
            onClose={() => setEditingItem(null)}
            onAddToCart={handleSaveEdit}
        />
      )}
    </div>
  );
}
