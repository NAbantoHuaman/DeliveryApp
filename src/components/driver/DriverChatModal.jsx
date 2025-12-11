import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User } from 'lucide-react';

const DriverChatModal = ({ isOpen, onClose, clientName, initialMessages, context = 'order' }) => {
    const defaultMessages = [
        { id: 1, text: '¡Hola! Ya estoy en camino a la tienda.', sender: 'me', time: '10:30' },
        { id: 2, text: '¡Genial! Gracias por avisar.', sender: 'client', time: '10:31' }
    ];

    const [messages, setMessages] = useState(initialMessages || defaultMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Reset messages when isOpen changes, if initialMessages provided
    useEffect(() => {
        if (isOpen && initialMessages) {
            setMessages(initialMessages);
        } else if (isOpen && !initialMessages) {
             setMessages(defaultMessages);
        }
    }, [isOpen, initialMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, msg]);
        setNewMessage('');

        // Simulate reply based on context
        setTimeout(() => {
            let replyText = 'Entendido, estaré atento.';
            if (context === 'support') {
                replyText = 'Gracias por contactarnos. Un agente revisará tu caso en breve.';
            }

            const reply = {
                id: Date.now() + 1,
                text: replyText,
                sender: 'client',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full sm:max-w-md h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="bg-[#4c8479] p-4 flex justify-between items-center text-white shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">{clientName}</h3>
                            <p className="text-xs opacity-80 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span> En línea
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                                msg.sender === 'me' 
                                    ? 'bg-[#4c8479] text-white rounded-br-none' 
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                            }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-white/70' : 'text-slate-400'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-slate-100 text-slate-800 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#4c8479]/50 transition-all"
                    />
                    <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-[#4c8479] text-white p-3 rounded-full shadow-lg hover:bg-[#3a665d] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DriverChatModal;
