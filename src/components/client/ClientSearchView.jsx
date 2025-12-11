import React, { useState } from 'react';
import { Search, Star, Clock, Bike, ArrowLeft } from 'lucide-react';
import { RESTAURANTS } from '../../constants';

const ClientSearchView = ({ setActiveTab, setSelectedRestaurant, setView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRestaurants = RESTAURANTS.filter(rest => 
    rest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rest.menu.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pb-24 animate-in fade-in duration-500 min-h-full bg-[#f8fafc]">
      <header className="bg-white px-5 pt-12 pb-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
           <button onClick={() => setActiveTab('home')} className="text-slate-600">
               <ArrowLeft size={24} />
           </button>
           <h1 className="text-xl font-bold text-slate-800">Buscar</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Restaurantes, platos..." 
            className="w-full bg-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c8479]/20 transition-all"
          />
        </div>
      </header>

      <div className="px-5 mt-6 space-y-4">
         {searchTerm && (
             <p className="text-sm text-slate-500 font-medium mb-2">
                 Resultados para "{searchTerm}"
             </p>
         )}

         {filteredRestaurants.length > 0 ? (
             filteredRestaurants.map(rest => (
                <div 
                  key={rest.id} 
                  onClick={() => { setSelectedRestaurant(rest); setView('restaurant'); setActiveTab('home'); }}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-800 text-lg">{rest.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{rest.category}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Star size={12} className="text-[#e8b931] fill-current"/> {rest.rating}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {rest.time}</span>
                    </div>
                  </div>
                </div>
             ))
         ) : (
             <div className="text-center py-12">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Search size={32} className="text-slate-300" />
                 </div>
                 <p className="text-slate-500 font-medium">No encontramos resultados</p>
                 <p className="text-xs text-slate-400">Intenta buscar otra cosa</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default ClientSearchView;
