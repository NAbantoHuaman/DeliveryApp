import React from 'react';
import { Search, MapPin, Plus, Globe, ChevronLeft } from 'lucide-react';

const AddressSelectionView = ({ savedAddresses = [], onSelectAddress, onAddNewAddress, onBack }) => {
  return (
    <div className="bg-white min-h-full animate-in fade-in duration-300 font-sans flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-4 px-6 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4 mb-6">
            {onBack && (
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ChevronLeft size={24} className="text-slate-900" />
                </button>
            )}
            <h1 className="text-2xl font-bold text-slate-900">Ingresa tu dirección</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-slate-400" size={20} />
              </div>
              <input 
                  type="text" 
                  placeholder="Dirección o punto de referencia" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#4c8479]/20 transition-all"
              />
          </div>
      </div>

      {/* Options List */}
      <div className="flex-1 px-6 pb-8 overflow-y-auto">
          <div className="space-y-6">
              {/* Current Location Option */}
              <button 
                  onClick={onAddNewAddress}
                  className="w-full flex items-center gap-4 group"
              >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-active:scale-95 transition-transform">
                      <MapPin size={20} className="text-slate-900" />
                  </div>
                  <span className="text-slate-700 font-medium">Mi ubicación actual</span>
              </button>

              {/* Saved Addresses */}
              {savedAddresses.map((addr, index) => (
                  <button 
                      key={index}
                      onClick={() => onSelectAddress(addr)}
                      className="w-full flex items-start gap-4 group text-left"
                  >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-active:scale-95 transition-transform">
                          <MapPin size={20} className="text-slate-700" />
                      </div>
                      <div>
                          <h3 className="font-medium text-slate-900 flex items-center gap-2">
                              {addr.label}
                              {/* Optional: Add icons based on label (Heart for favorites, etc.) */}
                          </h3>
                          <p className="text-sm text-slate-500 mt-0.5">{addr.address}</p>
                      </div>
                  </button>
              ))}

              {/* Country Change (Mock) */}
              <button className="w-full flex items-center gap-4 group mt-8 pt-8 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-active:scale-95 transition-transform">
                      <Globe size={20} className="text-slate-900" />
                  </div>
                  <div className="text-left">
                      <span className="block text-slate-700 font-medium">Cambiar de país</span>
                      <span className="text-sm text-slate-500">Perú</span>
                  </div>
              </button>
          </div>
      </div>
    </div>
  );
};

export default AddressSelectionView;
