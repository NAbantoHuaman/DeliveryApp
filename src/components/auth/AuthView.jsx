import React from 'react';
import { User, Lock, FileText, Phone, Mail } from 'lucide-react';

const AuthView = ({ authView, setAuthView, handleLogin, handleRegister, loginData, setLoginData, registerData, setRegisterData, isProcessing, authError, setAuthError }) => {
    // Usamos la imagen local solicitada
    const illustrationUrl = "/deliv.png"; 

    const handleInputChange = (setter, data, field, value) => {
        setter({ ...data, [field]: value });
        if (authError) setAuthError('');
    };

    return (
        <div className="h-full flex flex-col bg-[#4c8479] animate-in fade-in duration-500 relative overflow-hidden">
            
            {/* Top Section */}
            <div className="flex flex-col items-center pt-12 pb-4 px-4 relative z-10">
                <div className={`relative ${authView === 'login' ? 'w-64 h-64' : 'w-52 h-52'} mb-4 shrink-0 transition-all duration-300`}>
                   <div className="absolute inset-0 bg-teal-600 rounded-full opacity-20 scale-90 blur-2xl"></div>
                   <img src={illustrationUrl} alt="Delivery Scooter" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
                <h1 className="text-6xl text-[#e8b931] tracking-wide mb-0 font-['Itim']">Chaskys</h1>
                <p className="text-white text-3xl font-['Itim']">
                    {authView === 'login' ? 'Delivery app' : 'Registro Delivery app'}
                </p>
                {authError && (
                    <div className="mt-4 bg-red-500/90 text-white px-4 py-2 rounded-xl text-sm font-medium animate-in slide-in-from-top duration-300">
                        {authError}
                    </div>
                )}
            </div>

            {/* Middle Section - Inputs */}
            <div className="w-full px-8 mb-8 relative z-20">
                {authView === 'login' ? (
                    <form className="space-y-5 w-full" onSubmit={handleLogin}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="text-slate-400" size={22} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Usuario" 
                                value={loginData.user}
                                onChange={(e) => handleInputChange(setLoginData, loginData, 'user', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-black focus:border-[#e8b931] focus:ring-0 bg-white text-slate-600 placeholder:text-slate-400 text-lg shadow-sm outline-none transition-all"
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
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-black focus:border-[#e8b931] focus:ring-0 bg-white text-slate-600 placeholder:text-slate-400 text-lg shadow-sm outline-none transition-all"
                            />
                        </div>
                    </form>
                ) : (
                  <form className="space-y-4 w-full" onSubmit={handleRegister}>
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
                                  className="w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 border-black focus:border-[#e8b931] focus:ring-0 bg-white text-slate-600 placeholder:text-slate-400 text-base shadow-sm outline-none transition-all"
                              />
                          </div>
                      ))}
                  </form>
                )}
            </div>

            {/* Bottom Sheet Actions */}
            <div className="bg-white w-full pt-10 pb-10 px-8 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col items-center z-30 shrink-0 mt-auto">
                {authView === 'login' ? (
                    <>
                      <button type="button" className="text-slate-600 underline text-xl mb-8 hover:text-slate-800 transition-colors">
                          ¿Olvidaste tu contraseña?
                      </button>
                      <button 
                          onClick={handleLogin}
                          disabled={isProcessing}
                          className="w-full bg-[#4c8479] text-white text-xl py-3 rounded-2xl shadow-lg mb-6 active:scale-[0.98] transition-all hover:bg-[#3a665d] hover:shadow-xl"
                      >
                           {isProcessing ? 'Iniciando...' : 'Iniciar Sesión'}
                      </button>
                      <span className="text-slate-400 text-lg mb-6">o</span>
                      <button 
                          onClick={() => setAuthView('register')}
                          className="w-full bg-[#98b5ad] text-slate-800 text-xl py-3 rounded-2xl shadow-md active:scale-[0.98] transition-all hover:bg-[#87a39b] hover:text-white"
                      >
                          Crea una cuenta
                      </button>
                    </>
                ) : (
                    <>
                      <button 
                          onClick={handleRegister}
                          disabled={isProcessing}
                          className="w-full bg-[#4c8479] text-white text-xl py-3 rounded-2xl shadow-lg mb-6 active:scale-[0.98] transition-all hover:bg-[#3a665d] hover:shadow-xl"
                      >
                           {isProcessing ? 'Creando...' : 'Crear una cuenta'}
                      </button>
                      <button 
                          onClick={() => setAuthView('login')}
                          className="w-full bg-[#98b5ad] text-slate-800 text-xl py-3 rounded-2xl shadow-md active:scale-[0.98] transition-all hover:bg-[#87a39b] hover:text-white"
                      >
                          Iniciar Sesión
                      </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthView;
