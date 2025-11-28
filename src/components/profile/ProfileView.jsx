import React, { useState, useEffect } from 'react';
import { User, Ticket, Headphones, Utensils, MapPin, Heart, Bell, Info, BookOpen, Store, LogOut, ChevronRight, Smartphone, ChevronLeft, Edit2, Plus, Trash2, Bike } from 'lucide-react';
import { RESTAURANTS } from '../../constants';

const ProfileView = ({ isDriverMode, setDriverTab, setActiveTab, userMode, setUserMode, handleLogout, currentUser, setCurrentUser, updateUserProfile, onAddAddress }) => {
  const [activeSection, setActiveSection] = useState(null);
  
  // Personal Info State
  const [formData, setFormData] = useState({
      user: currentUser?.user || '',
      password: currentUser?.password || '',
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Update formData when currentUser changes
  useEffect(() => {
    if (currentUser) {
        setFormData({
            user: currentUser.user || '',
            password: currentUser.password || '',
            name: currentUser.name || '',
            phone: currentUser.phone || '',
            email: currentUser.email || ''
        });
    }
  }, [currentUser]);

  // Mock Data States
  const [coupons] = useState([
      { id: 1, code: 'WELCOME50', discount: '50% OFF', desc: 'En tu primera compra', valid: 'Válido hasta 30 Nov' },
      { id: 2, code: 'BURGERKING', discount: 'S/ 10.00', desc: 'En combos seleccionados', valid: 'Válido hoy' }
  ]);

  const [preferences, setPreferences] = useState(['Hamburguesas', 'Pizza', 'Chifa']);
  const allPreferences = ['Hamburguesas', 'Pizza', 'Chifa', 'Sushi', 'Pollo', 'Vegano', 'Postres', 'Criollo'];

  const handleSaveProfile = () => {
      updateUserProfile({ ...currentUser, ...formData });
      setIsEditing(false);
  };

  const renderContent = () => {
      switch (activeSection) {
          case 'personal':
              return (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl  text-slate-900">Información Personal</h2>
                          <button onClick={() => setIsEditing(!isEditing)} className="text-[#4c8479]  text-base">
                              {isEditing ? 'Cancelar' : 'Editar'}
                          </button>
                      </div>
                      <div className="space-y-4">
                          {[
                              { label: 'Nombre Completo', key: 'name', type: 'text' },
                              { label: 'Teléfono', key: 'phone', type: 'tel' },
                              { label: 'Correo Electrónico', key: 'email', type: 'email' },
                              { label: 'Contraseña', key: 'password', type: 'password' }
                          ].map((field) => (
                              <div key={field.key} className="space-y-1">
                                  <label className="text-sm  text-slate-500 uppercase">{field.label}</label>
                                  <input 
                                      type={field.type}
                                      value={formData[field.key]}
                                      onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                      disabled={!isEditing}
                                      className={`w-full bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 outline-none focus:ring-2 focus:ring-[#4c8479]/20 transition-all ${!isEditing && 'opacity-60'}`}
                                  />
                              </div>
                          ))}
                      </div>
                      {isEditing && (
                          <button onClick={handleSaveProfile} className="w-full bg-[#4c8479] text-white text-lg py-4 rounded-xl shadow-lg shadow-[#4c8479]/30 active:scale-[0.98] transition-transform">
                              Guardar Cambios
                          </button>
                      )}
                  </div>
              );
          case 'coupons':
              return (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                      <h2 className="text-2xl  text-slate-900 mb-4">Mis Cupones</h2>
                      {coupons.map(coupon => (
                          <div key={coupon.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex justify-between items-center relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4c8479]"></div>
                              <div>
                                  <h3 className=" text-xl text-slate-900">{coupon.code}</h3>
                                  <p className="text-[#4c8479] text-lg">{coupon.discount}</p>
                                  <p className="text-sm text-slate-500">{coupon.desc}</p>
                              </div>
                              <div className="text-right">
                                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{coupon.valid}</span>
                              </div>
                          </div>
                      ))}
                      <button className="w-full border-2 border-dashed border-slate-300 text-slate-400 text-base py-3 rounded-xl hover:border-[#4c8479] hover:text-[#4c8479] transition-colors">
                          Agregar Cupón
                      </button>
                  </div>
              );
          case 'help':
              return (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                      <h2 className="text-2xl  text-slate-900 mb-4">Centro de Ayuda</h2>
                      {['¿Dónde está mi pedido?', 'Problemas con el pago', 'Quiero cancelar mi orden', 'Reportar un problema'].map((faq, i) => (
                          <button key={i} className="w-full bg-slate-50 rounded-xl p-4 text-left font-medium text-base text-slate-700 flex justify-between items-center">
                              {faq}
                              <ChevronRight size={16} className="text-slate-400" />
                          </button>
                      ))}
                      <div className="bg-[#4c8479]/5 p-4 rounded-xl mt-4">
                          <h3 className=" text-[#4c8479] text-lg mb-2">¿Necesitas más ayuda?</h3>
                          <button className="bg-[#4c8479] text-white text-base  px-4 py-2 rounded-lg">Chat con Soporte</button>
                      </div>
                  </div>
              );
          case 'preferences':
              return (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                      <h2 className="text-2xl  text-slate-900 mb-4">Preferencias de Comida</h2>
                      <div className="flex flex-wrap gap-2">
                          {allPreferences.map(pref => (
                              <button 
                                  key={pref}
                                  onClick={() => {
                                      if (preferences.includes(pref)) {
                                          setPreferences(preferences.filter(p => p !== pref));
                                      } else {
                                          setPreferences([...preferences, pref]);
                                      }
                                  }}
                                  className={`px-4 py-2 rounded-full text-base  transition-colors ${preferences.includes(pref) ? 'bg-[#4c8479] text-white' : 'bg-slate-100 text-slate-600'}`}
                              >
                                  {pref}
                              </button>
                          ))}
                      </div>
                  </div>
              );
          case 'addresses':
              return (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                      <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl  text-slate-900">Mis Direcciones</h2>
                          <button onClick={onAddAddress} className="text-[#4c8479]"><Plus size={24} /></button>
                      </div>
                      {(currentUser?.addresses || []).length === 0 ? (
                          <p className="text-slate-500 text-base text-center py-8">No tienes direcciones guardadas.</p>
                      ) : (
                          (currentUser?.addresses || []).map((addr, index) => (
                              <div key={index} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex justify-between items-start">
                                  <div className="flex gap-3">
                                      <MapPin className="text-[#4c8479] mt-1" size={20} />
                                      <div>
                                          <h3 className=" text-slate-900 text-lg">{addr.label}</h3>
                                          <p className="text-base text-slate-600">{addr.address}</p>
                                      </div>
                                  </div>
                                  <button onClick={() => {
                                      const newAddresses = currentUser.addresses.filter((_, i) => i !== index);
                                      updateUserProfile({ ...currentUser, addresses: newAddresses });
                                  }}>
                                      <Trash2 size={18} className="text-slate-300 hover:text-red-500" />
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
              );
          case 'favorites':
              return (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                      <h2 className="text-2xl  text-slate-900 mb-4">Mis Favoritos</h2>
                      {RESTAURANTS.slice(0, 3).map(rest => (
                          <div key={rest.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                              <img src={rest.image} className="w-16 h-16 rounded-xl object-cover" alt={rest.name} />
                              <div>
                                  <h3 className=" text-slate-900 text-lg">{rest.name}</h3>
                                  <div className="flex items-center gap-1 text-sm text-slate-500">
                                      <Heart size={12} className="fill-[#4c8479] text-[#4c8479]" />
                                      <span>Te gusta este lugar</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              );
          case 'notifications':
              return (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <h2 className="text-2xl  text-slate-900 mb-4">Notificaciones</h2>
                      {[
                          'Estado de mi pedido',
                          'Promociones y descuentos',
                          'Novedades de la app',
                          'Sugerencias de restaurantes'
                      ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                              <span className="text-slate-700 font-medium text-base">{item}</span>
                              <div className="w-11 h-6 bg-[#4c8479] rounded-full relative cursor-pointer">
                                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                              </div>
                          </div>
                      ))}
                  </div>
              );
          default:
              return (
                  <div className="animate-in fade-in duration-300">
                      <p className="text-slate-500 text-center mt-10">Esta sección está en construcción 🚧</p>
                  </div>
              );
      }
  };

  const menuItems = [
    {
      title: 'Perfil',
      items: [
        { icon: Utensils, label: 'Preferencias de comida', id: 'preferences' },
        { icon: MapPin, label: 'Direcciones', id: 'addresses' },
        { icon: Heart, label: 'Favoritos', id: 'favorites' },
      ]
    },
    {
      title: 'Configuración',
      items: [
        { icon: Bell, label: 'Notificaciones', id: 'notifications' },
        { icon: Info, label: 'Información legal', id: 'legal' },
        { icon: BookOpen, label: 'Libro de reclamaciones', id: 'claims' },
        { icon: Store, label: 'Registrar mi negocio', id: 'business' },
      ]
    }
  ];

  return (
    <div className="bg-[#4c8479] min-h-full flex flex-col font-sans">
        {/* Header Section */}
        <div className="pt-12 pb-8 px-6 flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-medium text-white mb-1">
                    ¡Hola, <span className="text-[#e8b931]">{currentUser?.name?.split(' ')[0] || 'Usuario'}!</span>
                </h1>
                <p className="text-white/80 text-base">¿Qué deseas hacer hoy?</p>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                <User size={24} className="text-white" />
            </div>
        </div>

        {/* Main Content Card */}
        <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-24 overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            
            {activeSection ? (
                <div className="animate-in slide-in-from-right duration-300">
                    <button 
                        onClick={() => setActiveSection(null)} 
                        className="flex items-center gap-2 text-slate-500 mb-6 hover:text-[#4c8479] transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium text-sm">Volver</span>
                    </button>
                    {renderContent()}
                </div>
            ) : (
                <div className="animate-in fade-in duration-500">
                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { icon: User, label: 'Personal', id: 'personal', color: 'bg-blue-50 text-blue-600' },
                            { icon: Ticket, label: 'Cupones', id: 'coupons', color: 'bg-amber-50 text-amber-600' },
                            { icon: Headphones, label: 'Ayuda', id: 'help', color: 'bg-purple-50 text-purple-600' }
                        ].map((item, index) => (
                            <button 
                                key={index} 
                                onClick={() => setActiveSection(item.id)}
                                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all"
                            >
                                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
                                    <item.icon size={20} strokeWidth={2} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Menu Sections */}
                    <div className="space-y-8">
                        {menuItems.map((section, idx) => (
                            <div key={idx}>
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">{section.title}</h2>
                                <div className="space-y-3">
                                    {section.items.map((item, itemIdx) => (
                                        <button 
                                            key={itemIdx} 
                                            onClick={() => setActiveSection(item.id)}
                                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm">
                                                    <item.icon size={16} strokeWidth={2} />
                                                </div>
                                                <span className="text-base font-medium text-slate-700">{item.label}</span>
                                            </div>
                                            <ChevronRight size={18} className="text-slate-300 group-hover:text-[#4c8479] transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Mode Switch & Logout */}
                        <div className="pt-2 space-y-3">
                            <button 
                                onClick={() => setUserMode(userMode === 'client' ? 'driver' : 'client')}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#4c8479]/10 border border-[#4c8479]/20 group active:scale-[0.99] transition-transform"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-[#4c8479] rounded-full flex items-center justify-center text-white shadow-sm">
                                        <Bike size={16} strokeWidth={2} />
                                    </div>
                                    <span className="text-base font-bold text-[#4c8479]">
                                        {userMode === 'client' ? 'Modo Repartidor' : 'Modo Cliente'}
                                    </span>
                                </div>
                                <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-[#4c8479] shadow-sm">
                                    CAMBIAR
                                </div>
                            </button>

                            <button 
                                onClick={handleLogout} 
                                className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium text-base hover:bg-red-50 rounded-2xl transition-colors"
                            >
                                <LogOut size={18} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProfileView;
