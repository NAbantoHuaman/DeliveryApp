import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { User, Lock, FileText, Phone, Mail } from 'lucide-react';

const AuthView = ({ authView, setAuthView, handleLogin, handleRegister, loginData, setLoginData, registerData, setRegisterData, isProcessing, authError, setAuthError }) => {
    // Usamos la imagen local solicitada
    // Usamos la imagen local solicitada
    const illustrationUrl = "/deliv.png"; 
    const dustRefs = useRef([]);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Continuous Smoke Animation
            gsap.fromTo(dustRefs.current, 
                { scale: 0, opacity: 0.8, x: 0, y: 0 },
                {
                    duration: 1.2,
                    scale: () => gsap.utils.random(2, 4),
                    x: () => gsap.utils.random(-50, -20), // Move left more
                    y: () => gsap.utils.random(-40, -10),  // Move up
                    opacity: 0,
                    stagger: {
                        each: 0.1,
                        repeat: -1
                    },
                    ease: "power1.out"
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []); 

    const handleInputChange = (setter, data, field, value) => {
        setter({ ...data, [field]: value });
        if (authError) setAuthError('');
    };

    return (
        <div ref={containerRef} className="h-full flex flex-col bg-[#4c8479] animate-in fade-in duration-500 relative overflow-hidden">
            
            {/* Top Section */}
            <div className="flex flex-col items-center pt-12 pb-4 px-4 relative z-10">
                <div className={`relative ${authView === 'login' ? 'w-64 h-64' : 'w-52 h-52'} mb-4 shrink-0 transition-all duration-300`}>
                   <div className="absolute inset-0 bg-teal-600 rounded-full opacity-20 scale-90 blur-2xl"></div>
                   
                   {/* Dust Particles */}
                   <div className="absolute bottom-16 left-10 z-20">
                       {[...Array(8)].map((_, i) => (
                           <div 
                               key={i}
                               ref={el => dustRefs.current[i] = el}
                               className="absolute w-5 h-5 bg-white/70 rounded-full blur-[3px]"
                           />
                       ))}
                   </div>

                   <img src={illustrationUrl} alt="Delivery Scooter" className="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-vibrate" />
                </div>
                <h1 className="text-6xl text-[#e8b931] tracking-wide mb-0">Chaskys</h1>
                <p className="text-white text-3xl">
                    Delivery app
                </p>
                {authError && (
                    <div className="mt-4 bg-red-500/90 text-white px-4 py-2 rounded-xl text-sm font-medium animate-in slide-in-from-top duration-300">
                        {authError}
                    </div>
                )}
            </div>

            {/* Main Content Card (White) */}
            <div className="bg-white w-full flex-1 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col px-8 pt-10 pb-8 z-30 mt-4 overflow-y-auto">
                
                {/* Login Form */}
                {authView === 'login' && (
                    <form className="space-y-5 w-full mb-6" onSubmit={handleLogin}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="text-slate-400" size={22} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Usuario" 
                                value={loginData.user}
                                onChange={(e) => handleInputChange(setLoginData, loginData, 'user', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#e8b931] focus:ring-2 focus:ring-[#e8b931]/20 bg-slate-50 text-slate-600 placeholder:text-slate-400 text-xl outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="text-slate-400" size={22} />
                            </div>
                            <input 
                                type="password" 
                                placeholder="Contraseña" 
                                value={loginData.password}
                                onChange={(e) => handleInputChange(setLoginData, loginData, 'password', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#e8b931] focus:ring-2 focus:ring-[#e8b931]/20 bg-slate-50 text-slate-600 placeholder:text-slate-400 text-xl outline-none transition-all"
                            />
                        </div>
                    </form>
                )}

                {/* Register Form */}
                {authView === 'register' && (
                    <form className="space-y-3 w-full mb-6" onSubmit={handleRegister}>
                        {[
                            { icon: FileText, placeholder: "Nombre Completo", field: "name" },
                            { icon: Phone, placeholder: "Teléfono", field: "phone" },
                            { icon: Mail, placeholder: "Correo", field: "email" },
                            { icon: User, placeholder: "Usuario", field: "user" },
                            { icon: Lock, placeholder: "Contraseña", field: "password", type: "password" },
                        ].map((input, idx) => (
                            <div className="relative" key={idx}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <input.icon className="text-slate-400" size={20} />
                                </div>
                                <input 
                                    type={input.type || "text"} 
                                    placeholder={input.placeholder} 
                                    value={registerData[input.field]}
                                    onChange={(e) => handleInputChange(setRegisterData, registerData, input.field, e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#e8b931] focus:ring-2 focus:ring-[#e8b931]/20 bg-slate-50 text-slate-600 placeholder:text-slate-400 text-xl outline-none transition-all"
                                />
                            </div>
                        ))}
                    </form>
                )}

                {/* Actions */}
                <div className="mt-auto w-full flex flex-col items-center">
                    {authView === 'login' ? (
                        <>
                        <button 
                            onClick={handleLogin}
                            disabled={isProcessing}
                            className="w-full bg-[#4c8479] text-white text-xl py-3.5 rounded-2xl shadow-lg mb-4 active:scale-[0.98] transition-all hover:bg-[#3a665d] hover:shadow-xl font-medium"
                        >
                            {isProcessing ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>

                        {/* Social Login */}
                        <div className="flex gap-4 w-full mb-6">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 py-3 rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                <span className="text-sm font-medium text-slate-600">Google</span>
                            </button>
                        </div>

                        <div className="w-full h-px bg-slate-200 mb-6 relative">
                            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-2 text-slate-400 text-sm">o continúa con</span>
                        </div>

                        <button 
                            onClick={() => setAuthView('register')}
                            className="w-full text-slate-600 font-medium mb-4 hover:text-[#4c8479] transition-colors"
                        >
                            ¿No tienes cuenta? <span className="text-[#4c8479] font-bold">Regístrate</span>
                        </button>

                        <button 
                            onClick={() => setAuthView('driver-register')}
                            className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors"
                        >
                            Quiero ser <span className="text-[#4c8479]">Aliado / Repartidor</span>
                        </button>
                        </>
                    ) : (
                        <>
                        <button 
                            onClick={handleRegister}
                            disabled={isProcessing}
                            className="w-full bg-[#4c8479] text-white text-xl py-3.5 rounded-2xl shadow-lg mb-4 active:scale-[0.98] transition-all hover:bg-[#3a665d] hover:shadow-xl font-medium"
                        >
                            {isProcessing ? 'Creando...' : 'Crear Cuenta'}
                        </button>
                        <button 
                            onClick={() => setAuthView('login')}
                            className="text-slate-600 font-medium hover:text-[#4c8479] transition-colors"
                        >
                            ¿Ya tienes cuenta? <span className="text-[#4c8479] font-bold">Inicia Sesión</span>
                        </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthView;
