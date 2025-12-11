import React, { useState, useMemo, useCallback } from 'react';
import { MapPin, User, Search, Bike, Sparkles, Star, Clock, ArrowRight, X, Bell, ShoppingBag, ChevronDown, ShoppingCart } from 'lucide-react';
import { CATEGORIES, RESTAURANTS } from '../../constants';

const ClientHomeView = ({ user, onRestaurantClick, address, onAddressClick, setActiveTab, setSelectedRestaurant, setView, isAIModalOpen, setIsAIModalOpen, aiPrompt, setAiPrompt, aiResponse, setAiResponse, isAILoading, handleAskChef, cart = [], onCartClick }) => {
  
  return (
  <div className="pb-24 animate-in fade-in duration-500 relative bg-slate-50 min-h-full">
    {/* Red Header */}
    <header className="bg-[#4c8479] px-4 pt-12 pb-6 rounded-b-[2rem] shadow-lg z-30 relative">
      <div className="flex justify-between items-center mb-4 text-white">
        <div 
            className="flex items-center gap-1 cursor-pointer active:opacity-80 transition-opacity"
            onClick={onAddressClick}
        >
            <span className=" text-lg truncate max-w-[200px]">{address || "Seleccionar ubicación"}</span>
            <ChevronDown size={16} />
        </div>
        <div className="flex items-center gap-3">
            <button className="relative p-1">
                <Bell size={24} />
            </button>
            <button 
                className="relative p-1"
                onClick={onCartClick}
            >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-[#4c8479] text-xs  w-4 h-4 flex items-center justify-center rounded-full">
                        {cart.length}
                    </span>
                )}
            </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Locales, platos y productos" 
          className="w-full bg-white rounded-full py-3 pl-12 pr-12 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none shadow-sm"
        />
        <div className="absolute right-2 top-2 bg-[#4c8479] p-1.5 rounded-full">
             <Search size={16} className="text-white" />
        </div>
      </div>
    </header>

    <div className="px-4 mt-4 relative z-20">


        {/* Main Categories */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col items-center text-center gap-3 cursor-pointer active:scale-[0.98] transition-transform">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D" className="w-24 h-24 object-cover rounded-full shadow-md" alt="Restaurantes" />
                <span className=" text-slate-800 text-lg">Restaurantes</span>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col items-center text-center gap-3 cursor-pointer active:scale-[0.98] transition-transform">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JvY2VyeXxlbnwwfHwwfHx8MA%3D%3D" className="w-24 h-24 object-cover rounded-full shadow-md" alt="Market" />
                <span className=" text-slate-800 text-lg">PedidosYa Market</span>
            </div>
        </div>

        {/* Secondary Categories */}
        <div className="grid grid-cols-4 gap-3 mb-8">
            {[
                { name: 'Súper', img: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hcmtldHxlbnwwfHwwfHx8MA%3D%3D' },
                { name: 'Envíos', img: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVsaXZlcnklMjBiYWd8ZW58MHx8MHx8fDA%3D' },
                { name: 'Farmacias', img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBoYXJtYWN5fGVufDB8fDB8fHww' },
                { name: 'Tiendas', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvcHxlbnwwfHwwfHx8MA%3D%3D' }
            ].map((cat) => (
                <div key={cat.name} className="bg-white rounded-2xl p-2 shadow-sm flex flex-col items-center gap-2 cursor-pointer active:scale-[0.98] transition-transform">
                    <div className="w-full aspect-square rounded-xl overflow-hidden">
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs  text-slate-800">{cat.name}</span>
                </div>
            ))}
        </div>

        {/* Brand Strip */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide mb-8 pb-2">
            {RESTAURANTS.map((rest) => (
                <div key={rest.id} className="bg-[#4c8479] min-w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-white  text-xs shadow-md shrink-0">
                    {rest.name.split(' ')[0]}
                </div>
            ))}
        </div>

        {/* Promo Footer */}
        <div className="bg-[#fff9c4] rounded-3xl p-6 flex justify-between items-center shadow-sm mb-6">
            <div>
                <div className="bg-black text-[#fff9c4] text-sm  px-2 py-1 rounded w-fit mb-2">08:44</div>
                <h3 className="text-2xl  text-slate-900 mb-1">Ahorra hasta S/ 14</h3>
                <p className="text-sm text-slate-700 mb-4">Prueba nuevos sabores y disfruta descuentos fugaces.</p>
                <button className=" text-base text-slate-900">Descubrir locales</button>
            </div>
            <img src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D" className="w-24 h-24 rounded-full object-cover shadow-md" alt="Promo" />
        </div>

        {/* Restaurant List (Hidden or below? Keeping it below for now but simplified) */}
        <div className="mb-8">
            <h2 className="text-xl  text-slate-800 mb-4">Restaurantes cerca de ti</h2>
            <div className="space-y-4">
                {RESTAURANTS.map(rest => (
                <div 
                    key={rest.id} 
                    onClick={() => onRestaurantClick(rest)}
                    className="bg-white rounded-2xl p-3 shadow-sm flex gap-4 cursor-pointer active:scale-[0.99] transition-transform"
                >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h3 className=" text-slate-800 text-lg">{rest.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                            <Star size={14} className="fill-slate-900 text-slate-900" />
                            <span className=" text-slate-900">{rest.rating}</span>
                            <span>• {rest.time}</span>
                        </div>
                        <span className="text-sm text-slate-500 mt-1 block">Envío S/ {rest.deliveryFee}</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>
    
    {/* AI Chef Modal (Kept as is) */}
    {isAIModalOpen && (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
         <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
             <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2">
                     <div className="bg-[#e8b931] p-2 rounded-full"><Sparkles size={18} className="text-white"/></div>
                     <h3 className=" text-lg text-slate-800">Chasky Chef</h3>
                 </div>
                 <button onClick={() => setIsAIModalOpen(false)}><X className="text-slate-400"/></button>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-2xl mb-4 max-h-60 overflow-y-auto">
                 {aiResponse ? (
                     <p className="text-sm text-slate-700 leading-relaxed">{aiResponse}</p>
                 ) : (
                     <p className="text-sm text-slate-400 text-center py-4">Cuéntame qué se te antoja hoy... 🍕🥗🍔</p>
                 )}
             </div>

             <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={aiPrompt}
                   onChange={(e) => setAiPrompt(e.target.value)}
                   placeholder="Ej: Algo vegano y barato..."
                   className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#e8b931]/50"
                   onKeyDown={(e) => e.key === 'Enter' && handleAskChef()}
                 />
                 <button 
                   onClick={handleAskChef}
                   disabled={isAILoading || !aiPrompt}
                   className="bg-[#4c8479] text-white p-3 rounded-xl disabled:opacity-50 hover:bg-[#3a665d] transition"
                 >
                     {isAILoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <ArrowRight size={20} />}
                 </button>
             </div>
         </div>
      </div>
    )}
  </div>
  );
};

export default ClientHomeView;
