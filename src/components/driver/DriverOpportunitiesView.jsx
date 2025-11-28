import React, { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Navigation, Store } from 'lucide-react';


const CLIENT_NAMES = [
    "Juan Pérez", "María Rodríguez", "Carlos Sánchez", "Ana García", "Luis Romero",
    "Elena Torres", "Jorge Huamán", "Patricia Flores", "Miguel Quispe", "Lucía Vargas"
];

const ITEMS_BY_TYPE = {
    'polleria': ["1/4 Pollo a la Brasa + Papas", "1/2 Pollo a la Brasa + Ensalada", "1 Pollo Entero (Oferta Familiar)", "Mostrito (Chaufa + Pollo)", "Mollejitas a la Parrilla", "Anticuchos de Corazón"],
    'cevicheria': ["Ceviche Clásico", "Ceviche Mixto", "Jalea de Mariscos", "Arroz con Mariscos", "Chicharrón de Pescado", "Leche de Tigre", "Trio Marino"],
    'sushi': ["Maki Acevichado (10 cortes)", "California Roll", "Sashimi de Salmón", "Poke Bowl Nikkei", "Ebi Furai", "Maki Furai"],
    'chifa': ["Arroz Chaufa de Pollo", "Tallarín Saltado", "Sopa Wantán Especial", "Kam Lu Wantán", "Aeropuerto de Pollo", "Chi Jau Kay", "Ti Pa Kay"],
    'pizza': ["Pizza Americana (Grande)", "Pizza Pepperoni (Familiar)", "Pizza Hawaiana", "Pan al Ajo Especial", "Lasagna de Carne", "Pizza Suprema"],
    'burger': ["Hamburguesa Royal", "Cheese Burger Doble", "Hamburguesa a lo Pobre", "Combo Whopper", "Salchipapa Especial", "Club Sandwich"],
    'broaster': ["Pollo Broaster (Pecho)", "Alitas BBQ (6 pzas)", "Salchipapa Broaster", "Nuggets de Pollo"],
    'cafe': ["Cappuccino Grande", "Americano", "Cheesecake de Fresa", "Torta de Chocolate", "Jugo de Naranja", "Sandwich Mixto", "Empanada de Carne", "Frappuccino"],
    'bakery': ["Pastel de Acelga", "Empanada de Pollo", "Croissant de Mantequilla", "Pan Ciabatta (Bolsa)", "Alfajor de Maicena", "Turrón de Doña Pepa", "Keke de Zanahoria"],
    'ice_cream': ["Helado 1 Litro (Vainilla)", "Barquillos (Caja)", "Paletas de Crema", "Copa de Helado"],
    'pharmacy': ["Paracetamol 500mg (Caja)", "Alcohol Medicinal 96°", "Pañales Talla M (Paquete)", "Shampoo H&S", "Vitaminas C", "Crema Humectante", "Pasta Dental", "Bloqueador Solar"],
    'supermarket': ["Pack Gaseosas 3L", "Arroz Costeño 5kg", "Aceite Vegetal 1L", "Leche Gloria (Pack x6)", "Pan de Molde", "Detergente 2kg", "Papel Higiénico (Planja)", "Huevos (Jaba)"],
    'market': ["Kilo de Pollo", "Verduras Variadas", "Frutas de Estación", "Queso Fresco", "Carne Molida"],
    'florist': ["Ramo de Rosas Rojas", "Arreglo Floral Mixto", "Girasoles (Docena)", "Orquídea en Maceta"],
    'pet_store': ["Comida para Perro 3kg", "Arena para Gatos", "Juguete para Mascota", "Shampoo Veterinario", "Collar Antipulgas"],
    'technology': ["Cable HDMI 2m", "Mouse Inalámbrico", "Memoria USB 64GB", "Funda para Laptop", "Audífonos Bluetooth", "Cargador Carga Rápida", "Power Bank"],
    'clothing': ["Polo Básico Algodón", "Jean Slim Fit", "Casaca Cortaviento", "Zapatillas Urbanas", "Camisa Oxford", "Pack Medias", "Gorra Deportiva"],
    'shoe_store': ["Zapatillas Running", "Zapatos de Vestir", "Sandalias de Cuero", "Limpiador de Calzado"],
    'bookstore': ["Cuaderno A4", "Set de Lapiceros", "Libro Best Seller", "Agenda 2024", "Mochila Escolar"],
    'toy_store': ["Juego de Mesa", "Muñeca/Figura de Acción", "Pelota de Fútbol", "Rompecabezas 1000 pzas", "Lego Set"],
    'department_store': ["Juego de Sábanas", "Toalla de Baño", "Set de Vasos", "Almohada Viscoelástica", "Lámpara de Mesa", "Licuadora", "Hervidor Eléctrico"],
    'cinema': ["Combo Popcorn + Gaseosa", "Entradas Cine (2)", "Hot Dog Jumbo"],
    'bar': ["Six Pack Cerveza", "Pisco Sour (Botella)", "Chilcano Clásico", "Alitas Picantes"],
    'restaurant': ["Lomo Saltado", "Ají de Gallina", "Ceviche Clásico", "Arroz con Pollo", "Milanesa de Pollo", "Bistec a lo Pobre", "Tacu Tacu"], // Generic fallback
};

const DriverOpportunitiesView = ({ onAcceptOrder, nearbyPlaces = [], riderLocation, getStreetName }) => {
    const [opportunities, setOpportunities] = useState([]);

    // Smart Classifier: Determines the specific type of place based on name and raw data
    const classifyPlace = (place) => {
        const name = (place.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const rawType = (place.rawCategory || '').toLowerCase();
        const maki = (place.rawMaki || '').toLowerCase();

        // 1. Keyword Analysis (Highest Priority)
        if (name.includes('norkys') || name.includes('rokys') || name.includes('pardos') || name.includes('lena') || name.includes('granja') || name.includes('corralito') || name.includes('brasa')) return 'polleria';
        if (name.includes('punto azul') || name.includes('embarcadero') || name.includes('pescado') || name.includes('mar') || name.includes('ceviche') || name.includes('limon') || name.includes('barra marina')) return 'cevicheria';
        if (name.includes('sushi') || name.includes('maki') || name.includes('edo') || name.includes('osaka') || name.includes('hanzo') || name.includes('wasabi')) return 'sushi';
        if (name.includes('chifa') || name.includes('wok') || name.includes('china') || name.includes('wa lok') || name.includes('madam tusan')) return 'chifa';
        if (name.includes('pizza') || name.includes('papa johns') || name.includes('hut') || name.includes('dominos') || name.includes('little caesars')) return 'pizza';
        if (name.includes('bembos') || name.includes('burger') || name.includes('king') || name.includes('macdonalds') || name.includes('mcdonalds') || name.includes('carnivoro')) return 'burger';
        if (name.includes('kfc') || name.includes('popeyes') || name.includes('broaster') || name.includes('alitas')) return 'broaster';
        if (name.includes('starbucks') || name.includes('juan valdez') || name.includes('cafe') || name.includes('coffee') || name.includes('havanna') || name.includes('manolo')) return 'cafe';
        if (name.includes('pasteleria') || name.includes('san antonio') || name.includes('maria almenara') || name.includes('panaderia') || name.includes('bakery')) return 'bakery';
        if (name.includes('inkafarma') || name.includes('mifarma') || name.includes('botica') || name.includes('farma') || name.includes('arcangel')) return 'pharmacy';
        if (name.includes('tottus') || name.includes('metro') || name.includes('wong') || name.includes('vea') || name.includes('vivanda') || name.includes('makro') || name.includes('tambo') || name.includes('mass') || name.includes('oxxo')) return 'supermarket';
        if (name.includes('mercado') || name.includes('market')) return 'market';
        if (name.includes('rosatel') || name.includes('floreria') || name.includes('flores')) return 'florist';
        if (name.includes('superpet') || name.includes('veterinaria') || name.includes('pet') || name.includes('mascota')) return 'pet_store';
        if (name.includes('coolbox') || name.includes('ishop') || name.includes('xiaomi') || name.includes('samsung') || name.includes('tecno')) return 'technology';
        if (name.includes('zara') || name.includes('h&m') || name.includes('forever 21') || name.includes('falabella') || name.includes('ripley') || name.includes('oechsle') || name.includes('estilos')) return 'department_store';
        if (name.includes('adidas') || name.includes('nike') || name.includes('puma') || name.includes('marathon') || name.includes('triathlon')) return 'shoe_store';
        if (name.includes('cineplanet') || name.includes('cinemark') || name.includes('cinepolis')) return 'cinema';
        if (name.includes('tailoy') || name.includes('libreria') || name.includes('crisol')) return 'bookstore';

        // 2. Raw Category/Maki Fallback
        if (rawType.includes('chicken') || rawType.includes('bbq')) return 'polleria';
        if (rawType.includes('seafood') || rawType.includes('marisco')) return 'cevicheria';
        if (rawType.includes('chinese') || rawType.includes('asian')) return 'chifa';
        if (rawType.includes('sushi') || rawType.includes('japanese')) return 'sushi';
        if (rawType.includes('pizza') || rawType.includes('italian')) return 'pizza';
        if (rawType.includes('burger') || rawType.includes('fast food')) return 'burger';
        if (rawType.includes('coffee') || rawType.includes('cafe') || maki === 'cafe') return 'cafe';
        if (rawType.includes('bakery') || maki === 'bakery') return 'bakery';
        if (rawType.includes('pharmacy') || maki === 'pharmacy') return 'pharmacy';
        if (rawType.includes('grocery') || maki === 'grocery' || rawType.includes('supermarket')) return 'supermarket';
        if (rawType.includes('clothing') || maki === 'clothing_store') return 'clothing';
        if (rawType.includes('electronics') || maki === 'electronics_store') return 'technology';
        if (rawType.includes('shoe')) return 'shoe_store';
        if (rawType.includes('book')) return 'bookstore';
        if (rawType.includes('pet')) return 'pet_store';
        if (rawType.includes('florist')) return 'florist';
        if (rawType.includes('cinema') || maki === 'cinema') return 'cinema';
        if (rawType.includes('bar') || maki === 'bar') return 'bar';
        if (rawType.includes('mall') || rawType.includes('shopping')) return 'department_store'; // Treat generic malls as department stores for variety

        // 3. Default Fallback
        return 'restaurant';
    };

    // Synthetic Places Backup (if map data is sparse)
    const SYNTHETIC_PLACES = [
        { name: "Norky's", type: "polleria" },
        { name: "Roky's", type: "polleria" },
        { name: "Pardo's Chicken", type: "polleria" },
        { name: "Bembos", type: "burger" },
        { name: "Burger King", type: "burger" },
        { name: "Pizza Hut", type: "pizza" },
        { name: "Papa John's", type: "pizza" },
        { name: "Starbucks", type: "cafe" },
        { name: "Dunkin' Donuts", type: "bakery" },
        { name: "Inkafarma", type: "pharmacy" },
        { name: "Mifarma", type: "pharmacy" },
        { name: "Tottus", type: "supermarket" },
        { name: "Plaza Vea", type: "supermarket" },
        { name: "Tambo", type: "supermarket" },
        { name: "Oxxo", type: "supermarket" },
        { name: "Rosatel", type: "florist" },
        { name: "Tai Loy", type: "bookstore" },
        { name: "Cineplanet", type: "cinema" }
    ];

    const generateRandomOrder = (existingOrders = []) => {
        // Filter out non-commercial places (parks, etc.)
        const validPlaces = nearbyPlaces.filter(p => 
            p.type !== 'park' && 
            p.type !== 'hospital' && 
            p.type !== 'lodging'
        );

        // Diversity Logic: Try to find a place that isn't already in the list
        const existingNames = new Set(existingOrders.map(o => o.restaurant));
        let availablePlaces = validPlaces.filter(p => !existingNames.has(p.name));
        
        let place = null;
        let isSynthetic = false;

        // STRICT UNIQUENESS: If all real places are taken, try to use a synthetic place
        if (availablePlaces.length > 0) {
             place = availablePlaces[Math.floor(Math.random() * availablePlaces.length)];
        } else {
            // Try to find a synthetic place that isn't already used
            const availableSynthetic = SYNTHETIC_PLACES.filter(p => !existingNames.has(p.name));
            
            if (availableSynthetic.length > 0) {
                const synthetic = availableSynthetic[Math.floor(Math.random() * availableSynthetic.length)];
                // Create a fake place object with a random location near the rider
                place = {
                    name: synthetic.name,
                    type: synthetic.type,
                    // Random offset within ~1km
                    lat: (riderLocation?.lat || -7.16378) + (Math.random() - 0.5) * 0.01,
                    lng: (riderLocation?.lng || -78.50027) + (Math.random() - 0.5) * 0.01,
                    rawCategory: synthetic.type,
                    rawMaki: synthetic.type
                };
                isSynthetic = true;
            } else {
                // If absolutely everything is taken (rare), return null to avoid duplicates
                return null;
            }
        }
        
        // INTELLIGENT CLASSIFICATION
        let specificType = isSynthetic ? place.type : classifyPlace(place);
        
        // Special Logic for "Shopping Malls" or "Department Stores"
        // If it's a mall, we can simulate a specific store inside it to add variety
        if (specificType === 'department_store' || (place.name.toLowerCase().includes('mall') || place.name.toLowerCase().includes('plaza'))) {
            const mallSubTypes = ['clothing', 'shoe_store', 'technology', 'bookstore', 'toy_store', 'cafe', 'fast-food'];
            specificType = mallSubTypes[Math.floor(Math.random() * mallSubTypes.length)];
        }

        // Select items strictly from the classified type
        let itemsList = ITEMS_BY_TYPE[specificType];
        
        // Fallback if type not found (shouldn't happen with robust classifier, but safety first)
        if (!itemsList) {
             itemsList = ITEMS_BY_TYPE['restaurant'];
             specificType = 'restaurant';
        }

        const randomItem = itemsList[Math.floor(Math.random() * itemsList.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const paymentMethods = ['Efectivo', 'Yape', 'Plin', 'Tarjeta'];

        // Get Real Street Name if available
        let realAddress = `Calle ${Math.floor(Math.random() * 900) + 100}`;
        if (getStreetName) {
            const street = getStreetName(place.lat, place.lng);
            if (street) {
                realAddress = `${street} ${Math.floor(Math.random() * 900) + 100}`;
            }
        }

        return {
            id: Date.now() + Math.random(),
            client: CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)],
            restaurant: place.name,
            address: realAddress,
            distance: `${(Math.random() * 2 + 0.5).toFixed(1)} km`,
            price: (Math.random() * 20 + 10),
            items: `${quantity}x ${randomItem}`,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            storeType: specificType, // Use the specific type for icon/color logic
            storeLocation: { lat: place.lat, lng: place.lng },
            clientLocation: { lat: place.lat + 0.002, lng: place.lng + 0.002 }, 
            riderLocation: riderLocation || { lat: -7.16378, lng: -78.50027 },
            indications: ["Casa de reja blanca", "Tocar el timbre 2 veces", "Dejar en recepción", "Llamar al llegar", "Casa color verde", "Portón negro", "Esperar afuera"][Math.floor(Math.random() * 7)],
            phone: '9' + Math.floor(Math.random() * 90000000 + 10000000)
        };
    };

    // Generate initial random orders
    useEffect(() => {
        if (!nearbyPlaces || nearbyPlaces.length === 0) return;

        setOpportunities(prev => {
            // If we already have orders, don't regenerate everything, just ensure we have enough
            if (prev.length >= 3) return prev;

            const needed = 3 - prev.length;
            const newOrders = [...prev];
            
            for (let i = 0; i < needed; i++) {
                const order = generateRandomOrder(newOrders);
                if (order) newOrders.push(order);
            }
            return newOrders;
        });

    }, [nearbyPlaces]); // Only run when places change (which should be stable if map doesn't move)

    // Periodic updates (add new orders)
    useEffect(() => {
        const interval = setInterval(() => {
            setOpportunities(prev => {
                // Max 6 orders
                if (prev.length >= 6) return prev;

                // 30% chance to add a new order
                if (Math.random() > 0.7) {
                    const newOrder = generateRandomOrder(prev);
                    if (newOrder) {
                        return [...prev, newOrder];
                    }
                }
                return prev;
            });
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [nearbyPlaces]); // Re-create interval if places change to use latest places in closure

    return (
        <div className="absolute inset-x-0 bottom-0 h-[60%] z-40 bg-slate-50 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500 pointer-events-auto">
            {/* Header */}
            <div className="bg-white p-4 pb-2 shadow-sm z-10">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-xl font-medium text-slate-800">Oportunidades ({opportunities.length})</h2>
                    <span className="text-sm font-medium text-[#4c8479] bg-[#4c8479]/10 px-2 py-1 rounded-full animate-pulse">
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
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md`}
                                         style={{
                                             backgroundColor: 
                                                ['fast-food', 'restaurant', 'burger', 'pizza', 'sushi', 'chifa', 'polleria', 'cafe', 'bakery'].includes(order.storeType) ? '#FF9E67' :
                                                ['pharmacy', 'hospital'].includes(order.storeType) ? '#EA4335' :
                                                ['supermarket', 'shop'].includes(order.storeType) ? '#4285F4' :
                                                '#A142F4' // Default/Service
                                         }}
                                    >
                                        <Store size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-900 text-lg">{order.restaurant}</h3>
                                        <p className="text-sm text-slate-500">{order.distance} • {order.items}</p>
                                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-medium text-[#4c8479]">S/ {order.price.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Route Visual (Simple Line) */}
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                <div className="flex-1 h-0.5 bg-slate-200" />
                                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                <span className="text-sm text-slate-400 ml-2">{order.distance}</span>
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={() => onAcceptOrder(order)}
                                className="w-full bg-slate-900 text-white font-medium text-lg py-3 rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
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
