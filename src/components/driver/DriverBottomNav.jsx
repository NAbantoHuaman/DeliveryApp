import React from 'react';
import { LayoutDashboard, List, User } from 'lucide-react';

const DriverBottomNav = ({ driverTab, setDriverTab, activeOrder }) => (
  <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 pb-6 pt-3 px-8 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] rounded-b-[3.5rem]">
      {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Panel' },
          { id: 'available', icon: List, label: 'Pedidos' },
          { id: 'profile', icon: User, label: 'Perfil' }
      ].map((item) => (
          <button 
              key={item.id}
              onClick={() => setDriverTab(item.id)}
              className={`flex flex-col items-center space-y-1 transition-colors ${driverTab === item.id ? 'text-[#4c8479]' : 'text-slate-400'}`}
          >
              <item.icon size={24} strokeWidth={2.5} />
              <span className="text-xs font-medium">{item.label}</span>
          </button>
      ))}
  </div>
);

export default DriverBottomNav;
