import React, { useState, useMemo } from 'react';
import { Sparkles, MapPin, Calendar, Filter, Star } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

const DriverOrderHistoryView = ({ handleMotivateDriver, isAILoading, driverMotivation, setDriverTab }) => {
  const [timeRange, setTimeRange] = useState('all'); // 'today', 'week', 'all'
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Real History Data from LocalStorage
  const allHistory = JSON.parse(localStorage.getItem('driverOrderHistory') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('chaskys_session') || '{}');
  
  // Filter by Driver
  const myHistory = allHistory.filter(order => order.driverId === currentUser.id);

  // Filter by Time Range
  const filteredHistory = useMemo(() => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime(); // Sunday as start

      return myHistory.filter(order => {
          const orderTime = new Date(order.completedAt).getTime();
          if (timeRange === 'today') return orderTime >= startOfDay;
          if (timeRange === 'week') return orderTime >= startOfWeek;
          return true;
      });
  }, [myHistory, timeRange]);

  const totalEarnings = filteredHistory.reduce((sum, order) => sum + order.price, 0);
  const driverName = currentUser.name || 'Conductor';

  return (
    <div className="bg-[#4c8479] min-h-full flex flex-col font-sans relative">
        <div className="pt-12 pb-6 px-6 text-white text-center relative">
            <div className="absolute top-12 left-6 text-[#e8b931] font-medium text-lg leading-tight text-left">
                {driverName} <br/> <span className="text-[#e8b931] text-sm font-normal">Chasky Black</span>
            </div>
            <div className="absolute top-12 right-6 text-right">
                <h1 className="text-2xl font-medium text-[#e8b931]">Chaskys</h1>
                <p className="text-xs opacity-90">Delivery app</p>
            </div>

            <div className="mt-24 mb-6">
                <p className="text-sm font-medium opacity-90 mb-1 uppercase tracking-widest">
                    {timeRange === 'today' ? 'Ganancia de Hoy' : timeRange === 'week' ? 'Ganancia Semanal' : 'Ganancia Total'}
                </p>
                <h2 className="text-5xl font-medium mb-2">S/ {totalEarnings.toFixed(2)}</h2>
                <p className="text-sm opacity-80">{filteredHistory.length} pedidos completados</p>
                
                {/* Filter Chips */}
                <div className="flex justify-center gap-2 mt-6">
                    <button 
                        onClick={() => setTimeRange('today')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${timeRange === 'today' ? 'bg-[#e8b931] text-slate-900 shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Hoy
                    </button>
                    <button 
                        onClick={() => setTimeRange('week')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${timeRange === 'week' ? 'bg-[#e8b931] text-slate-900 shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Semana
                    </button>
                    <button 
                        onClick={() => setTimeRange('all')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${timeRange === 'all' ? 'bg-[#e8b931] text-slate-900 shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Total
                    </button>
                </div>
            </div>
        </div>

        <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-24 overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-slate-800 text-lg uppercase tracking-wider">HISTORIAL</h3>
                <button onClick={() => setDriverTab('dashboard')} className="text-xs font-bold text-[#4c8479] border border-[#4c8479] px-3 py-1 rounded-full hover:bg-[#4c8479] hover:text-white transition-colors">
                    IR AL MAPA
                </button>
            </div>
            
            <div className="space-y-4">
                {filteredHistory.map((order, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-[#98dad0] rounded-xl p-4 relative shadow-sm animate-in slide-in-from-bottom-4 duration-500 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]" 
                        style={{animationDelay: `${idx * 50}ms`}}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Orden #{order.id.toString().slice(-6)}</span>
                                <p className="text-xs text-slate-800 font-medium">{new Date(order.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                            <span className="font-bold text-xl text-slate-900">S/ {order.price.toFixed(2)}</span>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-3 border-l-2 border-slate-700/20 ml-1 space-y-3 py-1">
                            <div className="relative">
                                <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#98dad0] border-2 border-slate-600"></div>
                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-0.5">Recogido en</p>
                                <p className="text-sm font-medium text-slate-900 truncate">{order.restaurant || order.storeName}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#98dad0] border-2 border-[#4c8479]"></div>
                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-0.5">Entregado a</p>
                                <p className="text-sm font-medium text-slate-900 truncate">{order.client}</p>
                                <p className="text-xs text-slate-700 truncate">{order.address}</p>
                            </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-700/10 flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-800 bg-white/30 px-2 py-1 rounded-md">
                                    {order.paymentMethod || 'Efectivo'}
                                </span>
                                <div className="flex">
                                    {[...Array(order.rating || 5)].map((_, i) => (
                                        <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                             </div>
                             <span className="text-xs text-slate-700">{new Date(order.completedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {filteredHistory.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p>No hay pedidos en este periodo.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
            <OrderDetailsModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
        )}
    </div>
  );
};

export default DriverOrderHistoryView;
