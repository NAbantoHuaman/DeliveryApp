import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, CreditCard, Ticket, MapPin, FileText, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ClientCheckoutView({ setView, address, placeOrder, onChangeAddress }) {
  const { cart } = useCart();
  const [tip, setTip] = useState(1.40);
  const [isPriority, setIsPriority] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cash'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 3.90;
  const priorityFee = isPriority ? 2.20 : 0;
  const total = subtotal + deliveryFee + priorityFee + tip;

  const handlePay = () => {
    setPaymentStatus('processing');
    
    // Simulate processing
    setTimeout(() => {
        setPaymentStatus('success');
        
        // Redirect after success
        setTimeout(() => {
            placeOrder(); // Call placeOrder instead of clearCart
        }, 2000);
    }, 2000);
  };

  if (paymentStatus === 'processing' || paymentStatus === 'success') {
      return (
        <div className="w-full h-full bg-[#4c8479] z-[70] flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
            {paymentStatus === 'processing' ? (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={64} className="animate-spin" />
                    <h2 className="text-2xl font-bold">Procesando transacción...</h2>
                    <p className="text-white/80">Por favor espere un momento</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#4c8479] shadow-xl">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <h2 className="text-3xl font-bold">¡Pago Exitoso!</h2>
                    <p className="text-white/80">Tu pedido ha sido confirmado</p>
                </div>
            )}
        </div>
      );
  }

  return (
    <div className="pb-32 animate-in fade-in duration-500 min-h-full bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-30">
        <button 
          onClick={() => setView('cart')}
          className="p-2 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <h1 className="flex-1 text-center  text-lg text-slate-800">Último paso</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        
        {/* Payment Method */}
        <section>
            <h2 className=" text-lg text-slate-900 mb-4">¿Cómo quieres pagar?</h2>
            
            {paymentMethod === 'card' ? (
                <div 
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                >
                    <div className="flex justify-between items-start mb-8">
                        <span className=" text-sm tracking-wider">BANCO DE CREDITO DEL PERU</span>
                    </div>
                    <div className="mb-6">
                        <p className="font-mono text-xl tracking-widest">**** 0500</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-medium">NESTOR JOSE ABANTO HUAMAN</span>
                        <div className="text-right">
                            <span className="block  text-lg italic">VISA</span>
                            <span className="text-[10px]">Débito</span>
                        </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                </div>
            ) : (
                <div 
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-white border-2 border-[#4c8479] rounded-2xl p-6 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#4c8479]/10 rounded-full flex items-center justify-center text-[#4c8479]">
                            <span className="text-2xl">💵</span>
                        </div>
                        <div>
                            <h3 className=" text-slate-900">Efectivo</h3>
                            <p className="text-xs text-slate-500">Pagas al recibir tu pedido</p>
                        </div>
                    </div>
                    <div className="text-[#4c8479]">Cambiar</div>
                </div>
            )}
        </section>

        {/* Coupon */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-800">
                <Ticket size={20} />
                <span className=" text-sm">¿Tienes un cupón?</span>
            </div>
            <button className="text-sm  text-slate-900">Agregar</button>
        </div>

        {/* Tip */}
        <section>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className=" text-lg text-slate-900">Propina para tu rider</h2>
                    <p className="text-xs text-slate-500">El 100% irá directo a su bolsillo.</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-2xl">👷</div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
                <button onClick={() => setTip(0)} className={`px-4 py-2 rounded-xl text-sm  whitespace-nowrap transition ${tip === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Ahora no</button>
                <button onClick={() => setTip(1)} className={`px-4 py-2 rounded-xl text-sm  whitespace-nowrap transition ${tip === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>S/ 1</button>
                <div className="relative">
                    <button onClick={() => setTip(1.40)} className={`px-4 py-2 rounded-xl text-sm  whitespace-nowrap transition ${tip === 1.40 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>S/ 1.40</button>
                    {tip === 1.40 && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-300 text-[8px]  px-1.5 rounded text-slate-900">Recomendada</span>}
                </div>
                <button onClick={() => setTip(2)} className={`px-4 py-2 rounded-xl text-sm  whitespace-nowrap transition ${tip === 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>S/ 2</button>
                <button onClick={() => setTip(2.90)} className={`px-4 py-2 rounded-xl text-sm  whitespace-nowrap transition ${tip === 2.90 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>S/ 2.90</button>
                <button className="px-4 py-2 rounded-xl text-sm  whitespace-nowrap bg-slate-100 text-slate-600">Otro</button>
            </div>
        </section>

        {/* Delivery Data */}
        <section>
            <h2 className=" text-lg text-slate-900 mb-4">Datos de entrega</h2>
            
            <div className="flex items-start gap-4 mb-6">
                <div className="mt-1"><MapPin size={20} className="text-slate-800"/></div>
                <div className="flex-1">
                    <h3 className=" text-slate-900 text-sm">Delivery</h3>
                    <p className="text-xs text-slate-500">20-40 min</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-slate-800">⚡</div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className=" text-slate-900 text-sm">Envío prioritario</span>
                            <span className="bg-cyan-300 text-[10px]  px-1.5 rounded text-slate-900">+ S/ 2.20</span>
                        </div>
                        <p className="text-xs text-slate-500">Recibe tu pedido más rápido.</p>
                    </div>
                </div>
                <div 
                    onClick={() => setIsPriority(!isPriority)}
                    className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${isPriority ? 'bg-slate-900' : 'bg-slate-200'}`}
                >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isPriority ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
                <div className="mt-1"><MapPin size={20} className="text-slate-800"/></div>
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                        <h3 className=" text-slate-900 text-sm">Ubicación de entrega</h3>
                    </div>
                    <p className="text-xs text-slate-500">{address}</p>
                </div>
                <button onClick={onChangeAddress} className="text-xs  text-slate-900">Cambiar</button>
            </div>

            <div className="flex items-start gap-4">
                <div className="mt-1"><FileText size={20} className="text-slate-800"/></div>
                <div className="flex-1">
                    <h3 className=" text-slate-900 text-sm">Instrucciones de entrega</h3>
                    {isEditingInstructions ? (
                        <div className="mt-2">
                            <textarea 
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Ej: Casa de rejas negras, tocar timbre..."
                                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#4c8479]/20"
                                rows={3}
                                autoFocus
                            />
                            <button 
                                onClick={() => setIsEditingInstructions(false)}
                                className="mt-2 bg-slate-900 text-white text-xs px-4 py-2 rounded-lg"
                            >
                                Guardar
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 mt-1">
                            {instructions || 'Sin instrucciones especiales'}
                        </p>
                    )}
                </div>
                {!isEditingInstructions && (
                    <button onClick={() => setIsEditingInstructions(true)} className="text-xs  text-slate-900">
                        {instructions ? 'Editar' : 'Agregar'}
                    </button>
                )}
            </div>
        </section>

      </div>

      {/* Footer Payment */}
      {createPortal(
        <div className="absolute bottom-0 w-full z-[60] pointer-events-auto">
            <div className="bg-white p-4 border-t border-slate-100 max-w-md mx-auto rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                    <span className=" text-lg text-slate-900">Total</span>
                    <span className=" text-xl text-slate-900">S/ {total.toFixed(2)}</span>
                </div>
                <button 
                    onClick={handlePay}
                    className="w-full bg-[#4c8479] text-white  text-lg py-4 rounded-2xl shadow-lg shadow-[#4c8479]/30 active:scale-[0.98] transition-transform"
                >
                    Pagar
                </button>
            </div>
        </div>,
        document.getElementById('sticky-footer-root')
      )}
      {/* Payment Method Modal */}
      {showPaymentModal && createPortal(
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <h3 className="text-xl  text-slate-900 mb-6">Selecciona método de pago</h3>
                
                <div className="space-y-4 mb-6">
                    <button 
                        onClick={() => { setPaymentMethod('card'); setShowPaymentModal(false); }}
                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${paymentMethod === 'card' ? 'border-[#4c8479] bg-[#4c8479]/5' : 'border-slate-200'}`}
                    >
                        <CreditCard size={24} className={paymentMethod === 'card' ? 'text-[#4c8479]' : 'text-slate-400'} />
                        <div className="text-left">
                            <span className={`block font-medium ${paymentMethod === 'card' ? 'text-[#4c8479]' : 'text-slate-900'}`}>Tarjeta de Crédito/Débito</span>
                            <span className="text-xs text-slate-500">**** 0500</span>
                        </div>
                        {paymentMethod === 'card' && <Check size={20} className="ml-auto text-[#4c8479]" />}
                    </button>

                    <button 
                        onClick={() => { setPaymentMethod('cash'); setShowPaymentModal(false); }}
                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${paymentMethod === 'cash' ? 'border-[#4c8479] bg-[#4c8479]/5' : 'border-slate-200'}`}
                    >
                        <div className="text-2xl">💵</div>
                        <div className="text-left">
                            <span className={`block font-medium ${paymentMethod === 'cash' ? 'text-[#4c8479]' : 'text-slate-900'}`}>Efectivo</span>
                            <span className="text-xs text-slate-500">Pagas al recibir</span>
                        </div>
                        {paymentMethod === 'cash' && <Check size={20} className="ml-auto text-[#4c8479]" />}
                    </button>
                </div>

                <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-medium"
                >
                    Cancelar
                </button>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
}
