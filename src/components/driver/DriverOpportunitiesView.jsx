import React, { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Navigation, Store } from 'lucide-react';


const CLIENT_NAMES = [
    "Juan Pérez", "María Rodríguez", "Carlos Sánchez", "Ana García", "Luis Romero",
    "Elena Torres", "Jorge Huamán", "Patricia Flores", "Miguel Quispe", "Lucía Vargas"
];

const ITEMS_BY_TYPE = {
    'fast-food': ["Hamburguesa Royal", "Combo Nuggets", "Pizza Personal", "Salchipapa", "Pollo Broaster"],
    'restaurant': ["Lomo Saltado", "Ají de Gallina", "Ceviche Clásico", "Arroz Chaufa", "Milanesa de Pollo"],
    'pharmacy': ["Paracetamol 500mg", "Alcohol Medicinal", "Pañales Talla M", "Shampoo", "Vitaminas"],
    'supermarket': ["Pack Gaseosas", "Arroz 5kg", "Aceite Vegetal", "Leche Gloria", "Pan de Molde"],
    'park': ["Picnic Set", "Bebidas Energéticas"], // Fallback
    'hotel': ["Servicio a Habitación"] // Fallback
};

const DriverOpportunitiesView = ({ onAcceptOrder, nearbyPlaces = [], riderLocation }) => {
    const [opportunities, setOpportunities] = useState([]);

    const generateRandomOrder = () => {
        const place = nearbyPlaces.length > 0 
            ? nearbyPlaces[Math.floor(Math.random() * nearbyPlaces.length)]
            : { name: "Restaurante Desconocido", type: 'restaurant', lat: -7.16, lng: -78.50 };

        const type = place.type || 'restaurant';
        const itemsList = ITEMS_BY_TYPE[type] || ITEMS_BY_TYPE['restaurant'];
        const randomItem = itemsList[Math.floor(Math.random() * itemsList.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;

        return {
            id: Date.now() + Math.random(),
            client: CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)],
            restaurant: place.name,
            address: `Calle ${Math.floor(Math.random() * 900) + 100}`,
            distance: `${(Math.random() * 2 + 0.5).toFixed(1)} km`,
            price: (Math.random() * 20 + 10),
            items: `${quantity}x ${randomItem}`,
            storeType: type,
            storeLocation: { lat: place.lat, lng: place.lng },
            clientLocation: { lat: place.lat + 0.002, lng: place.lng + 0.002 }, // Mock client loc
            riderLocation: riderLocation || { lat: -7.16378, lng: -78.50027 }, // Pass current rider loc
            indications: ["Tocad el timbre", "Dejar en recepción", "Llamar al llegar", "Casa de reja blanca", "Sin cebolla por favor"][Math.floor(Math.random() * 5)],
            phone: '9' + Math.floor(Math.random() * 90000000 + 10000000)
        };
    };

    // Generate initial random orders
    useEffect(() => {
        if (nearbyPlaces.length === 0) return;

        const initialCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 orders
        const newOrders = Array.from({ length: initialCount }).map(generateRandomOrder);
        setOpportunities(newOrders);

        // Add more orders periodically
        const interval = setInterval(() => {
            if (Math.random() > 0.6) { // 40% chance to add new order
                setOpportunities(prev => [...prev, generateRandomOrder()]);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [nearbyPlaces]);

    return (
        <div className="absolute inset-x-0 bottom-0 h-[60%] z-40 bg-slate-50 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500 pointer-events-auto">
            {/* Header */}
            <div className="bg-white p-4 pb-2 shadow-sm z-10">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-lg font-medium text-slate-800">Oportunidades ({opportunities.length})</h2>
                    <span className="text-xs font-medium text-[#4c8479] bg-[#4c8479]/10 px-2 py-1 rounded-full animate-pulse">
                        Buscando zona...
                    </span>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {opportunities.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>Escaneando área...</p>
                    </div>
                ) : (
                    opportunities.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform animate-in slide-in-from-bottom-4 fade-in duration-500">
                            {/* Header: Restaurant & Price */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md
                                        ${order.storeType === 'fast-food' ? 'bg-orange-500' : 
                                          order.storeType === 'pharmacy' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        <Store size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-900">{order.restaurant}</h3>
                                        <p className="text-xs text-slate-500">{order.distance} • {order.items}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-medium text-[#4c8479]">S/ {order.price.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Route Visual (Simple Line) */}
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                <div className="flex-1 h-0.5 bg-slate-200" />
                                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                <span className="text-xs text-slate-400 ml-2">{order.distance}</span>
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={() => onAcceptOrder(order)}
                                className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Aceptar Pedido</span>
                                <ArrowRightIcon />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export default DriverOpportunitiesView;
