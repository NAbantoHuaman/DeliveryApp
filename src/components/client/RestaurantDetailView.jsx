import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Star, Clock, Bike, Plus, Search, Heart, Share2, ChevronRight } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';
import { useCart } from '../../context/CartContext';

const RestaurantDetailView = ({ restaurant, setView }) => {
  const { cart, addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Menú');

  if (!restaurant) return null;

  const categories = ['Menú', 'Descuentos', 'Más vendidos', 'Vegano', 'Vegetariano', 'Bebidas'];

  const handleProductClick = (item) => {
    setSelectedProduct(item);
  };

  const handleAddToCart = (product, quantity, options) => {
    addToCart(product, quantity, options);
    setSelectedProduct(null);
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500 min-h-full bg-[#f8fafc] relative z-40">
      {/* Header Image & Nav */}
      <div className="relative h-64 w-full">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
          
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <button 
                onClick={() => setView('main')}
                className="bg-white p-2 rounded-full text-slate-800 shadow-md hover:bg-slate-100 transition"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="flex gap-3">
                <button className="bg-white p-2 rounded-full text-slate-800 shadow-md hover:bg-slate-100 transition">
                    <Heart size={20} />
                </button>
                <button className="bg-white p-2 rounded-full text-slate-800 shadow-md hover:bg-slate-100 transition">
                    <Share2 size={20} />
                </button>
            </div>
          </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="relative -mt-12 px-4 mb-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
              <div className="flex gap-4 items-start mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0 border border-slate-100">
                      <img src={restaurant.image} alt="logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                      <h1 className="text-2xl  text-slate-900 leading-tight mb-1">{restaurant.name}</h1>
                      <div className="flex items-center gap-1 mb-1">
                          <Star size={14} className="fill-slate-900 text-slate-900" />
                          <span className=" text-base text-slate-900">{restaurant.rating}</span>
                          <span className="text-slate-400 text-sm ml-1">Leer opiniones</span>
                      </div>
                  </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1 mb-4">
                  <button className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-base  shadow-md">Delivery</button>
                  <button className="flex-1 text-slate-500 py-2 rounded-lg text-base font-medium hover:bg-slate-200 transition">Retiro en el local</button>
              </div>
              
              <div className="flex items-center justify-between text-base text-slate-600">
                  <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span>Recibes en <span className=" text-slate-900">{restaurant.time}</span></span>
                  </div>
                  <button className="text-[#4c8479]  text-sm">Programar</button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-base text-slate-600">
                  <Bike size={16} className="text-slate-400" />
                  <span>Envío <span className=" text-slate-900">{restaurant.deliveryFee === 0 ? 'Gratis' : `S/ ${restaurant.deliveryFee.toFixed(2)}`}</span></span>
              </div>
          </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 mb-6">
          <div className="bg-[#4c00b0] rounded-2xl p-4 flex justify-between items-center text-white shadow-lg shadow-purple-900/20">
              <div className="flex items-center gap-3">
                  <span className="bg-white text-[#4c00b0] text-xs  px-1.5 py-0.5 rounded">plus</span>
                  <span className="font-medium text-base">Ahorra S/ 3.9 Prueba gratis</span>
              </div>
              <ChevronRight size={16} className="opacity-70" />
          </div>
      </div>

      {/* Category Pills */}
      <div className="pl-4 mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pr-4">
              {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-base font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      {/* Más Vendidos Section */}
      <div className="mb-8">
          <h2 className="text-xl  text-slate-900 px-4 mb-4">Más vendidos</h2>
          <div className="overflow-x-auto scrollbar-hide pl-4 pb-4">
              <div className="flex gap-4 pr-4">
                  {restaurant.menu.slice(0, 3).map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => handleProductClick(item)}
                        className="min-w-[160px] w-[160px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer active:scale-95 transition-transform"
                      >
                          <div className="h-32 w-full relative">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              <button className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md">
                                  <Heart size={14} className="text-slate-400" />
                              </button>
                          </div>
                          <div className="p-3">
                              <h3 className=" text-slate-800 text-base mb-1 truncate">{item.name}</h3>
                              <p className=" text-slate-900 text-lg">S/ {item.price}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Full Menu Section */}
      <div className="px-4">
          <h2 className="text-xl  text-slate-900 mb-4">Los mejores descuentos</h2>
          <div className="space-y-4">
              {restaurant.menu.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => handleProductClick(item)}
                    className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer active:scale-[0.99] transition-transform"
                  >
                      <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          {Math.random() > 0.5 && (
                              <div className="absolute top-2 left-2 bg-[#e8b931] text-slate-900 text-xs  px-2 py-1 rounded-md shadow-sm">
                                  32% DSCTO
                              </div>
                          )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                              <h3 className=" text-slate-800 text-lg leading-tight mb-1">{item.name}</h3>
                              <p className="text-sm text-slate-500 line-clamp-2">{item.desc}</p>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                              <div className="flex flex-col">
                                  <span className=" text-slate-900 text-xl">S/ {item.price.toFixed(2)}</span>
                                  <span className="text-sm text-slate-400 line-through">S/ {(item.price * 1.3).toFixed(2)}</span>
                              </div>
                              <button className="bg-white border border-slate-200 p-1.5 rounded-full shadow-sm">
                                  <Plus size={18} className="text-slate-600" />
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={handleAddToCart}
        />
      )}

      {/* Sticky Cart Footer */}
      {cart && cart.length > 0 && document.getElementById('sticky-footer-root') && createPortal(
        <div className="w-full bg-white border-t border-slate-100 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-300 pointer-events-auto">
            <div className="flex items-center gap-4 max-w-md mx-auto">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-500">{cart.length} producto{cart.length > 1 ? 's' : ''}</span>
                    <span className="text-xl  text-slate-900">S/ {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(1)}</span>
                </div>
                <button 
                    onClick={() => setView('cart')}
                    className="flex-1 bg-[#4c8479] text-white  text-lg py-3 rounded-2xl shadow-lg shadow-[#4c8479]/30 active:scale-[0.98] transition-transform"
                >
                    Ver carrito
                </button>
            </div>
        </div>,
        document.getElementById('sticky-footer-root')
      )}
    </div>
  );
};

export default RestaurantDetailView;
