import React, { useState, useEffect } from 'react';
import { ArrowRight, CreditCard } from 'lucide-react';

export default function ClientPromotionsView() {
  // --- Timer Logic ---
  const [timers, setTimers] = useState({
    promo1: 39 * 60 + 20, // 39:20
    promo2: 15 * 60 + 0,  // 15:00
    promo3: 5 * 60 + 45   // 05:45
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        Object.keys(newTimers).forEach(key => {
          if (newTimers[key] > 0) {
            newTimers[key] -= 1;
          } else {
            // Reset timer when it reaches 0
            if (key === 'promo1') newTimers[key] = 39 * 60 + 20;
            if (key === 'promo2') newTimers[key] = 15 * 60;
            if (key === 'promo3') newTimers[key] = 5 * 60 + 45;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="pb-32 animate-in fade-in duration-500 min-h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-30">
        <h1 className="text-center text-lg text-slate-900 font-bold">Promociones</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Yellow Promo Card */}
        <div className="bg-[#fef051] rounded-3xl p-5 relative overflow-hidden shadow-sm">
            <div className="bg-slate-900 text-[#fef051] text-xs font-bold px-2 py-1 rounded-md inline-block mb-2">
                {formatTime(timers.promo1)}
            </div>
            <div className="flex justify-between items-start">
                <div className="max-w-[60%] z-10 relative">
                    <h2 className="text-xl text-slate-900 font-bold leading-tight mb-2">Ahorra hasta S/ 14</h2>
                    <p className="text-xs text-slate-800 mb-4">Prueba nuevos sabores y disfruta descuentos fugaces.</p>
                    <button className="text-xs font-bold text-slate-900">Descubrir locales</button>
                </div>
                <div className="absolute -right-4 top-4 w-32 h-32">
                    <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover rounded-full border-4 border-white shadow-md" alt="Pizza" />
                    <div className="absolute -top-4 -left-4 w-16 h-16">
                        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm" alt="Salad" />
                    </div>
                </div>
            </div>
        </div>

        {/* Pink Featured Card */}
        <div className="bg-[#ea004b] rounded-3xl p-6 relative overflow-hidden shadow-sm text-white flex items-center justify-between">
            <div className="max-w-[50%] z-10">
                <h2 className="text-2xl font-bold mb-1">Destacados</h2>
                <p className="text-sm opacity-90">Locales que brindan la mejor experiencia.</p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2">
                <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover mask-gradient-left" alt="Chef" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ea004b] to-transparent"></div>
            </div>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-[#fef051] rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
                <CreditCard size={18} />
                <span className="text-sm font-bold">Medios de pago</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Ahorra hoy con este medio de pago</h2>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                        Cencosud
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Tarjeta Cencosud</h3>
                        <span className="bg-[#fef051] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">25% DSCTO</span>
                        <p className="text-xs text-slate-500 mb-2">En restaurantes</p>
                        <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                            <div className="flex gap-1">
                                <div className="w-4 h-2.5 bg-red-500 rounded-sm"></div>
                                <div className="w-4 h-2.5 bg-blue-500 rounded-sm"></div>
                            </div>
                            <span>VISA MASTERCARD · VISA</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Martes · Jueves</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <button className="text-xs font-bold text-slate-900">Ir a todas las promociones</button>
                </div>
            </div>
        </div>

        {/* Market Section */}
        <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">PedidosYa Market es nuestro súper</h2>
            <p className="text-xs text-slate-500 mb-4">Ahorra con nuestras promociones todos los días</p>
            
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {/* Product 1 */}
                <div className="min-w-[120px] bg-slate-50 rounded-xl p-3 relative">
                    <span className="absolute top-2 left-2 bg-[#fef051] text-[10px] font-bold px-1.5 py-0.5 rounded">17% DSCTO</span>
                    <div className="h-24 flex items-center justify-center mb-2">
                        <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80" className="h-full object-contain mix-blend-multiply" alt="Water" />
                    </div>
                </div>
                {/* Product 2 */}
                <div className="min-w-[120px] bg-slate-50 rounded-xl p-3 relative">
                    <span className="absolute top-2 left-2 bg-[#fef051] text-[10px] font-bold px-1.5 py-0.5 rounded">18% DSCTO</span>
                    <div className="h-24 flex items-center justify-center mb-2">
                        <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80" className="h-full object-contain mix-blend-multiply hue-rotate-180" alt="Soda" />
                    </div>
                </div>
                {/* Product 3 */}
                <div className="min-w-[120px] bg-slate-50 rounded-xl p-3 relative">
                    <span className="absolute top-2 left-2 bg-[#fef051] text-[10px] font-bold px-1.5 py-0.5 rounded">2 x 1</span>
                    <div className="h-24 flex items-center justify-center mb-2">
                        <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=100&q=80" className="h-full object-contain mix-blend-multiply" alt="Meat" />
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
