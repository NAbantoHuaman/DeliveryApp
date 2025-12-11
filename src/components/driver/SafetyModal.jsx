import React, { useState } from 'react';
import { X, ShieldAlert, Phone, Share2, Ambulance } from 'lucide-react';

const SafetyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [SOSActive, setSOSActive] = useState(false);

    const handleSOS = () => {
        setSOSActive(true);
        // Simulate SOS trigger
        setTimeout(() => {
            alert("¡ALERTA SOS ENVIADA A CENTRAL Y CONTACTOS DE EMERGENCIA!");
            setSOSActive(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-red-600">
                        <ShieldAlert size={28} className="animate-pulse" />
                        <h2 className="text-2xl font-bold">Centro de Seguridad</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <button onClick={() => window.location.href = 'tel:105'} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-100 active:scale-[0.98] transition-all group">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <Phone size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-slate-800">Llamar a la Policía</h3>
                            <p className="text-sm text-slate-500">Línea de emergencia 105</p>
                        </div>
                    </button>

                    <button onClick={() => window.location.href = 'tel:106'} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-100 active:scale-[0.98] transition-all group">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                            <Ambulance size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-slate-800">Llamar Ambulancia</h3>
                            <p className="text-sm text-slate-500">Servicio médico SAMU 106</p>
                        </div>
                    </button>

                    <button className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-100 active:scale-[0.98] transition-all group">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Share2 size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-slate-800">Compartir Ubicación</h3>
                            <p className="text-sm text-slate-500">Enviar a contactos de confianza</p>
                        </div>
                    </button>

                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <button 
                            onClick={handleSOS}
                            className={`w-full py-5 rounded-2xl font-bold text-xl text-white shadow-xl shadow-red-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                                SOSActive ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            <ShieldAlert size={28} />
                            {SOSActive ? 'ENVIANDO ALERTA...' : 'BOTÓN DE PÁNICO SOS'}
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-3">
                            Esto enviará una alerta inmediata a la central de Chaskys y a tus contactos de emergencia con tu ubicación en tiempo real.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafetyModal;
