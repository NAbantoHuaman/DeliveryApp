import React, { useState } from 'react';
import { User, Lock, FileText, Phone, Mail, Bike, Truck, Upload, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

// Custom Motorbike Icon from Lucide (not available in all versions/packages yet)
const MotorbikeIcon = ({ size = 24, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m18 14-1-3" />
        <path d="m3 9 6 2a2 2 0 0 1 2-2h2a2 2 0 0 1 1.99 1.81" />
        <path d="M8 17h3a1 1 0 0 0 1-1 6 6 0 0 1 6-6 1 1 0 0 0 1-1v-.75A5 5 0 0 0 17 5" />
        <circle cx="19" cy="17" r="3" />
        <circle cx="5" cy="17" r="3" />
    </svg>
);

const DriverRegisterView = ({ onBack, onRegister, isProcessing }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        user: '',
        password: '',
        vehicleType: 'moto', // moto, bici, auto
        plate: '',
        documents: {
            license: null,
            idCard: null,
            soat: null
        }
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [uploadStatus, setUploadStatus] = useState({}); // { [docId]: 'idle' | 'uploading' | 'success' }

    const handleSimulateUpload = (field) => {
        if (uploadStatus[field] === 'success' || uploadStatus[field] === 'uploading') return;

        setUploadStatus(prev => ({ ...prev, [field]: 'uploading' }));
        
        // Simulate network delay
        setTimeout(() => {
            setUploadStatus(prev => ({ ...prev, [field]: 'success' }));
            setFormData(prev => ({
                ...prev,
                documents: { ...prev.documents, [field]: { name: 'foto_documento_simulado.jpg' } }
            }));
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            onRegister(formData);
        }
    };

    const steps = [
        { id: 1, title: "Datos Personales", icon: User },
        { id: 2, title: "Tu Vehículo", icon: MotorbikeIcon },
        { id: 3, title: "Documentos", icon: FileText }
    ];

    return (
        <div className="h-full flex flex-col bg-[#4c8479] animate-in fade-in duration-500 relative overflow-hidden">
            
            {/* Header Section (Green Background) */}
            <div className="flex flex-col items-center pt-12 pb-4 px-6 relative z-10">
                <button 
                    onClick={step === 1 ? onBack : () => setStep(step - 1)}
                    className="absolute top-12 left-6 text-white/80 hover:text-white transition-colors"
                >
                    <ChevronLeft size={32} />
                </button>
                
                <div className="text-center mt-2">
                    <h1 className="text-4xl text-white mb-1">Registro de Aliado</h1>
                    <p className="text-white/90 text-base">Únete a la flota Chaskys</p>
                </div>
                
                {/* Stepper */}
                <div className="flex justify-center items-center mt-6 gap-4">
                    {steps.map((s, idx) => (
                        <div key={s.id} className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                step >= s.id 
                                ? 'bg-[#e8b931] border-[#e8b931] text-slate-900' 
                                : 'bg-transparent border-white/30 text-white/50'
                            }`}>
                                <s.icon size={20} />
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                                    step > s.id ? 'bg-[#e8b931]' : 'bg-white/20'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Card (White) */}
            <div className="bg-white w-full flex-1 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col px-8 pt-8 pb-8 z-30 mt-4 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    
                    {/* STEP 1: PERSONAL DATA */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in slide-in-from-right duration-300">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Cuéntanos sobre ti</h2>
                            {[
                                { icon: User, placeholder: "Nombre Completo", field: "name" },
                                { icon: Phone, placeholder: "Teléfono", field: "phone" },
                                { icon: Mail, placeholder: "Correo Electrónico", field: "email" },
                                { icon: User, placeholder: "Usuario", field: "user" },
                                { icon: Lock, placeholder: "Contraseña", field: "password", type: "password" },
                            ].map((input, idx) => (
                                <div className="relative" key={idx}>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <input.icon className="text-slate-400" size={22} />
                                    </div>
                                    <input 
                                        type={input.type || "text"} 
                                        required
                                        placeholder={input.placeholder} 
                                        value={formData[input.field]}
                                        onChange={(e) => handleInputChange(input.field, e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#4c8479] focus:ring-2 focus:ring-[#4c8479]/20 bg-slate-50 text-slate-700 text-xl outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 2: VEHICLE */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-2xl font-bold text-slate-800 text-center">¿Qué vehículo usarás?</h2>
                            
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'bici', label: 'Bicicleta', icon: Bike },
                                    { id: 'moto', label: 'Moto', icon: MotorbikeIcon },
                                    { id: 'auto', label: 'Auto', icon: Truck }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleInputChange('vehicleType', type.id)}
                                        className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${
                                            formData.vehicleType === type.id
                                            ? 'border-[#4c8479] bg-[#4c8479]/10 text-[#4c8479]'
                                            : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                                        }`}
                                    >
                                        <type.icon size={36} className="mb-2" />
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </button>
                                ))}
                            </div>

                            {formData.vehicleType !== 'bici' && (
                                <div className="space-y-2">
                                    <label className="text-base font-medium text-slate-700">Placa del Vehículo</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="ABC-123" 
                                        value={formData.plate}
                                        onChange={(e) => handleInputChange('plate', e.target.value.toUpperCase())}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#4c8479] focus:ring-2 focus:ring-[#4c8479]/20 bg-slate-50 text-slate-700 text-xl outline-none transition-all uppercase tracking-widest font-mono"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: DOCUMENTS */}
                    {step === 3 && (
                        <div className="space-y-5 animate-in slide-in-from-right duration-300">
                            <div className="text-center mb-2">
                                <h2 className="text-2xl font-bold text-slate-800">Sube tus documentos</h2>
                                <p className="text-base text-slate-500">Verificación de identidad (Simulación)</p>
                            </div>

                            {[
                                { id: 'license', label: 'Licencia de Conducir', hidden: formData.vehicleType === 'bici' },
                                { id: 'idCard', label: 'DNI / Carnet de Extranjería' },
                                { id: 'soat', label: 'SOAT Vigente', hidden: formData.vehicleType === 'bici' }
                            ].map((doc) => !doc.hidden && (
                                <div key={doc.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-slate-700 text-lg">{doc.label}</span>
                                        {uploadStatus[doc.id] === 'success' && <CheckCircle2 size={24} className="text-green-500 animate-in zoom-in" />}
                                    </div>
                                    <div 
                                        onClick={() => handleSimulateUpload(doc.id)}
                                        className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                                            uploadStatus[doc.id] === 'success' 
                                            ? 'border-green-500 bg-green-50' 
                                            : uploadStatus[doc.id] === 'uploading'
                                                ? 'border-[#4c8479] bg-[#4c8479]/5'
                                                : 'border-slate-300 hover:bg-white'
                                        }`}
                                    >
                                        {uploadStatus[doc.id] === 'uploading' ? (
                                            <div className="flex flex-col items-center animate-pulse">
                                                <Upload className="text-[#4c8479] mb-1 animate-bounce" size={24} />
                                                <p className="text-sm text-[#4c8479] font-medium">Subiendo...</p>
                                            </div>
                                        ) : uploadStatus[doc.id] === 'success' ? (
                                            <div className="flex flex-col items-center">
                                                <CheckCircle2 className="text-green-600 mb-1" size={24} />
                                                <p className="text-sm text-green-700 font-medium">¡Documento subido!</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                                <Upload className="text-slate-400 mb-1" size={24} />
                                                <p className="text-sm text-slate-500">Toca para simular subida</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-auto pt-4">
                        <button 
                            type="submit"
                            disabled={isProcessing || (step === 3 && Object.values(uploadStatus).filter(s => s === 'success').length < (formData.vehicleType === 'bici' ? 1 : 3))}
                            className={`w-full text-white text-xl font-medium py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                                isProcessing || (step === 3 && Object.values(uploadStatus).filter(s => s === 'success').length < (formData.vehicleType === 'bici' ? 1 : 3))
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-[#4c8479] hover:bg-[#3a665d] hover:shadow-xl'
                            }`}
                        >
                            {isProcessing ? 'Procesando...' : (step === 3 ? 'Finalizar Registro' : 'Continuar')}
                            {!isProcessing && step < 3 && <ChevronRight size={24} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriverRegisterView;
