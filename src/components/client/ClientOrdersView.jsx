import React from 'react';
import { Clock, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { CLIENT_ORDERS } from '../../constants';

const ClientOrdersView = ({ orders }) => {
  return (
    <div className="pb-24 animate-in fade-in duration-500 min-h-full bg-[#f8fafc]">
      <header className="bg-white px-5 pt-12 pb-4 sticky top-0 z-30 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Mis Pedidos</h1>
      </header>

      <div className="px-5 mt-6 space-y-4">
         {orders.map(order => (
             <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                 <div className="flex justify-between items-start mb-3">
                     <div className="flex gap-3">
                         <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
                             <img src={order.image} alt={order.restaurant} className="w-full h-full object-cover" />
                         </div>
                         <div>
                             <h3 className="font-bold text-slate-800">{order.restaurant}</h3>
                             <p className="text-xs text-slate-500">{order.date}</p>
                         </div>
                     </div>
                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                         order.status === 'En camino' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                     }`}>
                         {order.status}
                     </span>
                 </div>
                 
                 <div className="border-t border-slate-100 my-3 pt-3">
                     <p className="text-sm text-slate-600 mb-1">{order.items}</p>
                     <p className="text-sm font-bold text-slate-800">Total: S/ {order.price.toFixed(2)}</p>
                 </div>

                 <div className="flex gap-3 mt-3">
                     <button className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-lg hover:bg-slate-200 transition">
                         Ayuda
                     </button>
                     <button className="flex-1 bg-[#4c8479] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#3a665d] transition">
                         Ver Detalles
                     </button>
                 </div>
             </div>
         ))}
         
         {orders.length === 0 && (
             <div className="text-center py-12">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                     <ShoppingBag size={32} className="text-slate-300" />
                 </div>
                 <p className="text-slate-500 font-medium">No tienes pedidos aún</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default ClientOrdersView;
