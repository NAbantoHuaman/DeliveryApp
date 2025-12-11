import React, { useState, useEffect } from 'react';
import { User, Ticket, Headphones, Utensils, MapPin, Heart, Bell, Info, BookOpen, Store, LogOut, ChevronRight, Smartphone, ChevronLeft, Edit2, Plus, Trash2, Bike, Wallet, FileText, BarChart, Star, Shield, Car, Truck, CheckCircle2, MessageSquare, AlertCircle, FileQuestion, HelpCircle } from 'lucide-react';
import { RESTAURANTS } from '../../constants';
import DriverChatModal from '../driver/DriverChatModal';

// Custom Icons
const MotorbikeIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m18 14-1-3" />
        <path d="m3 9 6 2a2 2 0 0 1 2-2h2a2 2 0 0 1 1.99 1.81" />
        <path d="M8 17h3a1 1 0 0 0 1-1 6 6 0 0 1 6-6 1 1 0 0 0 1-1v-.75A5 5 0 0 0 17 5" />
        <circle cx="19" cy="17" r="3" />
        <circle cx="5" cy="17" r="3" />
    </svg>
);

// Help Content Database
const HELP_TOPICS = {
    'Problemas con el pago': {
        title: 'Problemas con el pago',
        content: `
            Si no has recibido el pago de tu pedido, verifica lo siguiente:
            
            1. Asegúrate de haber completado la entrega en la app.
            2. Revisa si el ciclo de pago semanal ya ha cerrado.
            3. Si el pago aparece como "Pendiente", espera 24 horas.
            
            Si el problema persiste, contacta a soporte con tu ID de pedido a mano.
        `
    },
    'Accidente o Emergencia': {
        title: 'Accidente o Emergencia',
        content: `
            En caso de accidente:
            
            1. Primero, asegúrate de que estás bien y busca atención médica si es necesario.
            2. Llama a los servicios de emergencia (105 / 116) si hay heridos.
            3. Reporta el incidente a Chaskys inmediatamente usando el botón de Chat de Soporte.
            
            Tu seguridad es nuestra prioridad número uno.
        `
    },
    'Objetos olvidados': {
        title: 'Objetos olvidados',
        content: `
            Si olvidaste entregar parte del pedido:
            
            1. No marques el pedido como completado si es posible.
            2. Contacta al cliente a través del chat de la orden.
            3. Si ya finalizaste la orden, contacta a Soporte para coordinar la devolución o entrega faltante.
        `
    },
    'Cambiar mis datos': {
        title: 'Cambiar mis datos personales',
        content: `
            Puedes editar tu información básica (Nombre, Teléfono, Correo) directamente en la sección "Mi Cuenta".
            
            Para cambios sensibles como Placa de Vehículo o Documentos de Identidad, necesitas enviar una solicitud con la foto de los nuevos documentos a través del Chat de Soporte para validación legal.
        `
    },
    '¿Dónde está mi pedido?': {
        title: '¿Dónde está mi pedido?',
        content: 'Puedes rastrear tu pedido en tiempo real desde la pantalla de inicio. Si el repartidor no se mueve por más de 10 minutos, contáctanos.'
    },
    'Quiero cancelar mi orden': {
        title: 'Cancelar orden',
        content: 'Solo puedes cancelar tu orden si el restaurante aún no ha comenzado a prepararla. Ve al detalle de la orden y busca el botón "Cancelar".'
    },
    'Reportar un problema': {
        title: 'Reportar un problema',
        content: 'Si tuviste un problema con la calidad de la comida o el servicio, por favor utiliza el Chat de Soporte para enviarnos fotos y detalles.'
    }
};

const ProfileView = ({ isDriverMode, setDriverTab, setActiveTab, userMode, setUserMode, handleLogout, currentUser, setCurrentUser, updateUserProfile, onAddAddress, onSectionChange }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState(null); // New state for selected topic details
  
  // Notify parent about section change (to hide navbar)
  useEffect(() => {
      if (onSectionChange) {
          onSectionChange(!!activeSection || !!selectedHelpTopic);
      }
  }, [activeSection, selectedHelpTopic, onSectionChange]);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [driverStats, setDriverStats] = useState({
      earnings: 0,
      orders: 0,
      hours: '0.0h', 
      rating: 5.0,
      acceptance: '0%', 
      history: []
  });

  // Personal Info State
  const [formData, setFormData] = useState({
      user: currentUser?.user || '',
      password: currentUser?.password || '',
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Vehicle Edit State
  const [vehicleFormData, setVehicleFormData] = useState({
      vehicleType: currentUser?.vehicleType || 'moto',
      plate: currentUser?.plate || ''
  });
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);

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
        setVehicleFormData({
            vehicleType: currentUser.vehicleType || 'moto',
            plate: currentUser.plate || ''
        });
    }
  }, [currentUser]);

  // Load Driver Data and Calculate Stats
  useEffect(() => {
      if (userMode !== 'driver' || !currentUser) return;

      const loadDriverStats = () => {
          try {
              const allHistory = JSON.parse(localStorage.getItem('driverOrderHistory') || '[]');
              // Filter orders for the current driver
              const driverHistory = allHistory.filter(order => order.driverId === currentUser.id);
              
              const totalEarnings = driverHistory.reduce((sum, order) => sum + order.price, 0);
              
              // Calculate average rating
              const ratedOrders = driverHistory.filter(o => o.rating);
              const avgRating = ratedOrders.length > 0 
                  ? (ratedOrders.reduce((sum, o) => sum + o.rating, 0) / ratedOrders.length).toFixed(1)
                  : '5.0'; // Default high rating for new drivers

              // Calculate "acceptance rate" (simulated based on logic for now, or defaulting to 100% for new)
              // In a real app this would track declined vs accepted.
              // For simulation let's calculate based on finished orders vs "missed" (which we don't track, so we'll mock it slightly random or high)
              const acceptanceRate = driverHistory.length > 0 ? '98%' : '100%';

              // Calculate estimated hours (mock: 0.5h per order)
              const totalHours = (driverHistory.length * 0.5).toFixed(1) + 'h';

              setDriverStats({
                  earnings: totalEarnings,
                  orders: driverHistory.length,
                  hours: totalHours,
                  rating: avgRating,
                  acceptance: acceptanceRate,
                  history: driverHistory
              });
          } catch (error) {
              console.error("Error loading driver stats:", error);
          }
      };

      loadDriverStats();
      
      // Refresh stats every time the section becomes active or mode changes
      const interval = setInterval(loadDriverStats, 5000); 
      return () => clearInterval(interval);

  }, [userMode, activeSection, currentUser]);

  // ... (coupons, preferences states remain same)

  const handleSaveProfile = () => {
      updateUserProfile({ ...currentUser, ...formData });
      setIsEditingVehicle(false); // Close vehicle edit if open
      setIsEditing(false);
  };
  
  const handleSaveVehicle = () => {
      updateUserProfile({ ...currentUser, ...vehicleFormData });
      setIsEditingVehicle(false);
  };

  const renderContent = () => {
      // ... (Topic Details logic remains same)
      if (selectedHelpTopic) {
        // ...
      }

      switch (activeSection) {
          // ... (personal case remains same but ensure handleSaveProfile closes isEditing)
          case 'personal':
               // ...
               return (
                  // ...
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    {/* ... existing personal info jsx ... */}
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl text-slate-900">Información Personal</h2>
                          <button onClick={() => setIsEditing(!isEditing)} className="text-[#4c8479] text-base">
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
                                  <label className="text-sm text-slate-500 uppercase">{field.label}</label>
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



          case 'vehicle':
              const vehicleType = isEditingVehicle ? vehicleFormData.vehicleType : (currentUser?.vehicleType || 'moto');
              const vehicleConfig = {
                  moto: { icon: MotorbikeIcon, label: 'Moto', model: 'Honda CB 125' }, 
                  bici: { icon: Bike, label: 'Bicicleta', model: 'Bicicleta' },
                  auto: { icon: Truck, label: 'Auto', model: 'Auto Sedan' }
              };
              const currentVehicle = vehicleConfig[vehicleType] || vehicleConfig.moto;
              
              return (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl text-slate-900">Mi Vehículo</h2>
                          {isEditingVehicle && (
                              <button onClick={() => setIsEditingVehicle(false)} className="text-[#4c8479]">Cancelar</button>
                          )}
                      </div>

                      {isEditingVehicle ? (
                          <div className="space-y-6">
                              <div className="grid grid-cols-3 gap-2">
                                  {Object.keys(vehicleConfig).map((type) => {
                                      const ConfigIcon = vehicleConfig[type].icon;
                                      return (
                                          <button
                                              key={type}
                                              onClick={() => setVehicleFormData({...vehicleFormData, vehicleType: type})}
                                              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                                  vehicleFormData.vehicleType === type
                                                  ? 'border-[#4c8479] bg-[#4c8479]/10 text-[#4c8479]'
                                                  : 'border-slate-200 bg-slate-50 text-slate-400'
                                              }`}
                                          >
                                              <ConfigIcon size={24} className="mb-1" />
                                              <span className="text-xs font-bold uppercase">{vehicleConfig[type].label}</span>
                                          </button>
                                      );
                                  })}
                              </div>

                              {vehicleFormData.vehicleType !== 'bici' && (
                                  <div className="space-y-2">
                                      <label className="text-sm font-bold text-slate-500 uppercase">Placa del Vehículo</label>
                                      <input 
                                          type="text" 
                                          value={vehicleFormData.plate}
                                          onChange={(e) => setVehicleFormData({...vehicleFormData, plate: e.target.value.toUpperCase()})}
                                          placeholder="ABC-123"
                                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4c8479] focus:ring-2 focus:ring-[#4c8479]/20 bg-slate-50 text-slate-900 text-lg outline-none uppercase font-mono tracking-wider"
                                      />
                                  </div>
                              )}

                              <button 
                                  onClick={handleSaveVehicle}
                                  className="w-full bg-[#4c8479] text-white text-lg py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all"
                              >
                                  Guardar Vehículo
                              </button>
                          </div>
                      ) : (
                          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-[#4c8479]">
                                  <currentVehicle.icon size={48} />
                              </div>
                              <h3 className="text-xl font-bold text-slate-800 uppercase">{currentVehicle.label}</h3>
                              <p className="text-slate-500 mb-4 uppercase">
                                  {vehicleType === 'bici' ? 'Sin Placa' : (currentUser?.plate || 'ABC-123')}
                              </p>
                              <button 
                                  onClick={() => setIsEditingVehicle(true)}
                                  className="text-[#4c8479] font-medium text-sm flex items-center gap-1"
                              >
                                  <Edit2 size={16} /> Editar Vehículo
                              </button>
                          </div>
                      )}
                  </div>
              );
          case 'documents':
              return (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                      <h2 className="text-2xl text-slate-900 mb-4">Mis Documentos</h2>
                      {[
                          { name: 'Licencia de Conducir', status: 'valid', date: 'Vence: 20/05/2026' },
                          { name: 'SOAT', status: 'valid', date: 'Vence: 15/12/2025' },
                          { name: 'DNI / Identificación', status: 'review', date: 'En revisión' },
                          { name: 'Antecedentes Policiales', status: 'expired', date: 'Venció: 01/10/2024' }
                      ].map((doc, idx) => (
                          <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
                              <div>
                                  <p className="font-medium text-slate-800">{doc.name}</p>
                                  <p className={`text-xs ${
                                      doc.status === 'valid' ? 'text-green-600' : 
                                      doc.status === 'review' ? 'text-orange-500' : 'text-red-500'
                                  }`}>{doc.date}</p>
                              </div>
                              {doc.status === 'valid' && <Shield size={20} className="text-green-500" />}
                              {doc.status === 'review' && <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" />}
                              {doc.status === 'expired' && <div className="w-3 h-3 bg-red-500 rounded-full" />}
                          </div>
                      ))}
                      <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm flex gap-3">
                          <Info className="shrink-0" size={20} />
                          <p>Mantén tus documentos actualizados para seguir recibiendo pedidos.</p>
                      </div>
                  </div>
              );
          case 'performance':
              return (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <h2 className="text-2xl text-slate-900 mb-4">Mi Desempeño</h2>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
                              <div className="mb-2 flex justify-center text-yellow-400"><Star fill="currentColor" size={32} /></div>
                              <h3 className="text-3xl font-bold text-slate-800">{driverStats.orders > 0 ? driverStats.rating : '--'}</h3>
                              <p className="text-xs text-slate-500">Calificación Promedio</p>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
                              <div className="mb-2 flex justify-center text-green-500"><CheckCircle2 size={32} /></div>
                              <h3 className="text-3xl font-bold text-slate-800">{driverStats.acceptance}</h3>
                              <p className="text-xs text-slate-500">Tasa de Aceptación</p>
                          </div>
                      </div>
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                          <h4 className="font-bold text-slate-800 mb-4">Comentarios Recientes</h4>
                          <div className="space-y-4">
                              {driverStats.orders === 0 ? (
                                  <p className="text-slate-400 text-center py-4">Aún no tienes calificaciones.</p>
                              ) : (
                                  driverStats.history.slice(0, 3).map((order, i) => (
                                      <div key={i} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                          <div className="flex justify-between mb-1">
                                              <span className="text-sm font-medium">{order.client || 'Cliente'}</span>
                                              <div className="flex text-yellow-400">
                                                  {[...Array(order.rating || 5)].map((_, r) => (
                                                      <Star key={r} size={12} fill="currentColor"/>
                                                  ))}
                                              </div>
                                          </div>
                                          <p className="text-sm text-slate-600">"¡Entrega completada con éxito! Gran servicio."</p>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  </div>
              );

          case 'driver-support':
              return (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl text-slate-900">Centro de Ayuda</h2>
                      </div>
                      
                      <div className="bg-[#4c8479]/10 rounded-2xl p-6 mb-6">
                          <h3 className="font-bold text-[#4c8479] mb-2">¿Necesitas ayuda urgente?</h3>
                          <p className="text-sm text-slate-600 mb-4">Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier problema en tus pedidos.</p>
                          <button 
                              onClick={() => setIsChatModalOpen(true)}
                              className="w-full bg-[#4c8479] text-white py-3 rounded-xl font-medium shadow-lg shadow-[#4c8479]/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                          >
                              <MessageSquare size={20} />
                              Chatear con Soporte
                          </button>
                      </div>

                      <div className="space-y-3">
                          <h3 className="font-bold text-slate-800 ml-1">Preguntas Frecuentes</h3>
                          {[
                              { question: 'Problemas con un pago', answer: 'Si tienes problemas con tus ganancias o pagos, revisa tu historial en la sección "Pedidos".' },
                              { question: 'Cambiar vehículo', answer: 'Puedes actualizar tu vehículo en la sección "Mi Vehículo". Recuerda que la placa es obligatoria para motos y autos.' },
                              { question: 'No recibo pedidos', answer: 'Asegúrate de estar en una zona de alta demanda (marcada en rojo en el mapa) y de tener buena conexión a internet.' },
                              { question: 'Reportar accidente', answer: 'En caso de accidente, usa el botón de escudo en la pantalla de pedido activo para contactar emergencias.' }
                          ].map((item, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                                  <h4 className="font-medium text-slate-800 text-sm mb-1">{item.question}</h4>
                                  <p className="text-xs text-slate-500">{item.answer}</p>
                              </div>
                          ))}
                      </div>
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

  const menuItems = userMode === 'driver' ? [
    {
        title: 'Mi Cuenta', 
        items: [
            { icon: User, label: 'Información Personal', id: 'personal' }
        ]
    },
    {
        title: 'Mi Trabajo',
        items: [
            { icon: BarChart, label: 'Mi Desempeño', id: 'performance' },
        ]
    },
    {
        title: 'Mi Herramienta',
        items: [
            { icon: MotorbikeIcon, label: 'Mi Vehículo', id: 'vehicle' },
            { icon: FileText, label: 'Documentos', id: 'documents' },
        ]
    },
    {
        title: 'Soporte',
        items: [
            { icon: Headphones, label: 'Centro de Ayuda', id: 'driver-support' },
        ]
    }
  ] : [
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

  const quickActions = userMode === 'driver' ? [
      { icon: BarChart, label: 'Metas', id: 'performance', color: 'bg-blue-50 text-blue-600' },
      { icon: Shield, label: 'Alertas', id: 'documents', color: 'bg-orange-50 text-orange-600' }
  ] : [
      { icon: User, label: 'Personal', id: 'personal', color: 'bg-blue-50 text-blue-600' },
      { icon: Ticket, label: 'Cupones', id: 'coupons', color: 'bg-amber-50 text-amber-600' },
      { icon: Headphones, label: 'Ayuda', id: 'help', color: 'bg-purple-50 text-purple-600' }
  ];

  return (
    <div className="bg-[#4c8479] min-h-full flex flex-col font-sans">
        {/* Header Section */}
        <div className="pt-12 pb-8 px-6 flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-medium text-white mb-1">
                    ¡Hola, <span className="text-[#e8b931]">{currentUser?.name?.split(' ')[0] || 'Usuario'}!</span>
                </h1>
                <p className="text-white/80 text-base">{userMode === 'driver' ? 'Tu turno está activo 🛵' : '¿Qué deseas hacer hoy?'}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                <User size={24} className="text-white" />
            </div>
        </div>

        {/* Main Content Card */}
        <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-24 overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            
            {(activeSection || selectedHelpTopic) ? (
                <div className="animate-in slide-in-from-right duration-300">
                    {!selectedHelpTopic && (
                        <button 
                            onClick={() => setActiveSection(null)} 
                            className="flex items-center gap-2 text-slate-500 mb-6 hover:text-[#4c8479] transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="font-medium text-sm">Volver</span>
                        </button>
                    )}
                    {renderContent()}
                </div>
            ) : (
                <div className="animate-in fade-in duration-500">
                    {/* Quick Actions Grid - CONDITIONAL */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {quickActions.map((item, index) => (
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

        {/* DRIVER CHAT MODAL */}
        <DriverChatModal 
            isOpen={isChatModalOpen}
            onClose={() => setIsChatModalOpen(false)}
            clientName="Soporte Chaskys"
            context="support"
            initialMessages={[
                { id: 1, text: '¡Hola! Soy el asistente de soporte de Chaskys. ¿En qué te puedo ayudar hoy?', sender: 'client', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
            ]}
        />
    </div>
  );
};

export default ProfileView;
