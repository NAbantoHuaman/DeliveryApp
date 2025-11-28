import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MapPin, Power, Shield, DollarSign, Navigation, Utensils, ShoppingBag, Coffee, Pizza, Truck, CheckCircle2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DriverOpportunitiesView from './DriverOpportunitiesView';
import DriverRadar from './DriverRadar';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CAJAMARCA_LANDMARKS = [
    { name: "KFC - El Quinde", latOffset: 0.002, lngOffset: 0.002, type: 'fast-food' },
    { name: "McDonald's - Plaza de Armas", latOffset: -0.002, lngOffset: -0.001, type: 'fast-food' },
    { name: "Bembos - Real Plaza", latOffset: 0.003, lngOffset: -0.002, type: 'fast-food' },
    { name: "Restaurante El Zarco", latOffset: -0.001, lngOffset: 0.003, type: 'restaurant' },
    { name: "Sanguchería La Lucha", latOffset: 0.001, lngOffset: -0.001, type: 'restaurant' },
    { name: "Metro - El Quinde", latOffset: 0.0025, lngOffset: 0.0015, type: 'supermarket' },
    { name: "Plaza Vea - Real Plaza", latOffset: 0.0035, lngOffset: -0.0025, type: 'supermarket' }
];

const CLIENT_NAMES = [
    "Juan Pérez", "María Rodríguez", "Carlos Sánchez", "Ana García", "Luis Romero",
    "Elena Torres", "Jorge Huamán", "Patricia Flores", "Miguel Quispe", "Lucía Vargas"
];

const DriverDashboard = ({ handleMotivateDriver, isAILoading, driverMotivation, setIncomingOrder, acceptOrder, onOnlineStatusChange }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  // Sync online status with parent (to hide navbar)
  useEffect(() => {
    if (onOnlineStatusChange) {
        onOnlineStatusChange(isOnline);
    }
  }, [isOnline, onOnlineStatusChange]);

  // Acceptance Animation State
  const [acceptanceStatus, setAcceptanceStatus] = useState('idle'); // idle, accepting, confirmed
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [countdown, setCountdown] = useState(5);

  // Helper to generate random coordinates near a point
  const generateNearbyPoint = (lat, lng, offset = 0.01) => {
      const r = offset; 
      const u = Math.random();
      const v = Math.random();
      const w = r * Math.sqrt(u);
      const t = 2 * Math.PI * v;
      const x = w * Math.cos(t);
      const y = w * Math.sin(t);
      return { lat: lat + x, lng: lng + y };
  };

  // Fetch real places from OpenStreetMap (Overpass API)
  const fetchNearbyPlaces = async (lat, lng) => {
      const query = `
        [out:json];
        (
          node["amenity"~"restaurant|fast_food|cafe|pharmacy"](around:1000,${lat},${lng});
          node["leisure"="park"](around:1000,${lat},${lng});
          node["tourism"="hotel"](around:1000,${lat},${lng});
        );
        out body;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.elements && data.elements.length > 0) {
              const places = data.elements.map(place => ({
                  name: place.tags.name || "Lugar sin nombre",
                  lat: place.lat,
                  lng: place.lon,
                  type: mapOsmTypeToAppType(place.tags)
              })).filter(p => p.name !== "Lugar sin nombre");
              
              if (places.length > 0) {
                  setNearbyPlaces(places);
                  return places;
              }
          }
      } catch (error) {
          console.error("Error fetching OSM data:", error);
      }
      return null;
  };

  const mapOsmTypeToAppType = (tags) => {
      if (tags.leisure === 'park') return 'park';
      if (tags.tourism === 'hotel') return 'hotel';
      if (tags.amenity === 'fast_food') return 'fast-food';
      if (tags.amenity === 'pharmacy') return 'pharmacy';
      if (tags.amenity === 'cafe') return 'restaurant';
      return 'restaurant';
  };

  // Handle Initial Location and Places (Run on Mount)
  useEffect(() => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setRiderLocation({ lat: latitude, lng: longitude });
            
            // Fetch nearby places
            const realPlaces = await fetchNearbyPlaces(latitude, longitude);
            // If no real places found, use mock landmarks but adjust them to be near the user
            const placesToUse = (realPlaces && realPlaces.length > 0) 
                ? realPlaces 
                : CAJAMARCA_LANDMARKS.map(p => ({
                    ...p,
                    lat: latitude + p.latOffset,
                    lng: longitude + p.lngOffset
                }));
            
            setNearbyPlaces(placesToUse);

        }, (error) => {
            console.error("Error getting location", error);
            // Default to Cajamarca if location fails
            setRiderLocation({ lat: -7.16378, lng: -78.50027 });
            setNearbyPlaces(CAJAMARCA_LANDMARKS);
        });
    } else {
        setRiderLocation({ lat: -7.16378, lng: -78.50027 });
        setNearbyPlaces(CAJAMARCA_LANDMARKS);
    }
  }, []);

  // Update Map Markers when Location/Places change
  useEffect(() => {
    if (!mapInstanceRef.current || !riderLocation) return;

    // Center Map
    mapInstanceRef.current.setView([riderLocation.lat, riderLocation.lng], 16);

    // Render Rider Marker
    if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng([riderLocation.lat, riderLocation.lng]);
    } else {
        const riderIcon = L.divIcon({
            className: 'bg-transparent',
            html: `<div class="w-12 h-12 bg-[#4c8479] rounded-full flex items-center justify-center border-4 border-white shadow-xl pulse-ring"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>`,
            iconSize: [48, 48],
            iconAnchor: [24, 24]
        });
        riderMarkerRef.current = L.marker([riderLocation.lat, riderLocation.lng], { icon: riderIcon, zIndexOffset: 1000 }).addTo(mapInstanceRef.current);
    }

    // Render Places
    if (nearbyPlaces.length > 0) {
        nearbyPlaces.forEach(place => {
            let iconHtml = '';
            let bgColor = 'bg-slate-500';

            if (place.type === 'park') {
                iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M15.14 8.86a5 5 0 0 1 1.94 1.69"/><path d="M8.86 8.86a5 5 0 0 0-1.94 1.69"/><path d="M12 13a5 5 0 1 0-4-8 5 5 0 0 0 4 8Z"/><path d="M20.5 10a5.5 5.5 0 0 0-5.5-5.5 5.5 5.5 0 0 0-2.9 1.05"/><path d="M6.09 14.5a5.5 5.5 0 1 1-2.91-1.05"/></svg>`;
                bgColor = 'bg-green-600';
            } else if (place.type === 'hotel') {
                iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>`;
                bgColor = 'bg-indigo-600';
            } else if (place.type === 'fast-food') {
                iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16.5 4c-1.5 0-2.8.8-3.5 2-.7-1.2-2-2-3.5-2-2.2 0-4 1.8-4 4h15c0-2.2-1.8-4-4-4Z"/><path d="M5 8v12h14V8"/></svg>`;
                bgColor = 'bg-orange-500';
            } else if (place.type === 'restaurant') {
                iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
                bgColor = 'bg-red-500';
            } else if (place.type === 'pharmacy') {
                iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M12 2v4"/><path d="M16 2v4"/><rect width="20" height="14" x="2" y="6" rx="2"/><path d="M2 14h20"/><path d="M12 14v6"/></svg>`;
                bgColor = 'bg-emerald-500';
            }

            const placeIcon = L.divIcon({
                className: 'bg-transparent',
                html: `<div class="w-8 h-8 ${bgColor} rounded-full flex items-center justify-center border-2 border-white shadow-md transition-transform hover:scale-110">${iconHtml}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });
            
            L.marker([place.lat, place.lng], { icon: placeIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup(`<div class="font-medium text-sm">${place.name}</div><div class="text-xs text-slate-500 capitalize">${place.type}</div>`);
        });
    }
  }, [riderLocation, nearbyPlaces]);

  // Initialize Map
  useEffect(() => {
      if (!mapContainerRef.current) return;
      if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current, {
              center: [-7.16378, -78.50027], // Default Cajamarca
              zoom: 15,
              zoomControl: false,
              attributionControl: false
          });
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          mapInstanceRef.current = map;
      }
  }, []);

  // Countdown Logic
  useEffect(() => {
    let timer;
    if (acceptanceStatus === 'accepting' && countdown > 0) {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (acceptanceStatus === 'accepting' && countdown === 0) {
        setAcceptanceStatus('confirmed');
        setTimeout(() => {
            acceptOrder(selectedOpportunity);
            setAcceptanceStatus('idle');
            setSelectedOpportunity(null);
        }, 1500);
    }
    return () => clearTimeout(timer);
  }, [acceptanceStatus, countdown, selectedOpportunity, acceptOrder]);

  const handleOrderSelect = (order) => {
    setSelectedOpportunity(order);
    setCountdown(5);
    setAcceptanceStatus('accepting');
  };

  const handleCancelAcceptance = () => {
    setAcceptanceStatus('idle');
    setSelectedOpportunity(null);
  };

  const handleDisconnect = () => {
    setIsOnline(false);
    setAcceptanceStatus('idle');
    setSelectedOpportunity(null);
  };

  return (
    <div className="h-full flex flex-col relative bg-slate-100 overflow-hidden">
        {/* ACCEPTANCE OVERLAYS */}
        {acceptanceStatus === 'accepting' && (
            <div className="absolute inset-0 z-50 bg-[#e0f2f1] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                {/* Order Details Card */}
                <div className="w-full max-w-xs bg-[#80cbc4] rounded-2xl p-4 mb-12 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-slate-900 text-lg">{selectedOpportunity?.client}</h3>
                            <p className="text-xs text-slate-700 mt-1">{selectedOpportunity?.address}</p>
                        </div>
                        <div className="text-right">
                            <span className="block font-medium text-slate-900 text-xl">S/ {selectedOpportunity?.price.toFixed(2)}</span>
                            <span className="text-xs text-slate-700">{selectedOpportunity?.distance}</span>
                        </div>
                    </div>
                </div>

                {/* Animation */}
                <div className="relative mb-8">
                    <Truck size={80} className="text-slate-800 animate-bounce" />
                    <div className="absolute -right-2 -top-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
                </div>
                
                <h2 className="text-xl font-medium text-slate-800 mb-2">Aceptando carrera...!</h2>
                <p className="text-5xl font-medium text-slate-900 mb-16">{countdown} s</p>

                <button 
                    onClick={handleCancelAcceptance}
                    className="w-full max-w-xs bg-[#ef5350] text-white font-medium py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                    CANCELAR
                </button>
            </div>
        )}

        {acceptanceStatus === 'confirmed' && (
            <div className="absolute inset-0 z-50 bg-[#e0f2f1] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="w-40 h-40 bg-[#66bb6a] rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-300 mb-8">
                    <CheckCircle2 size={80} className="text-white" />
                </div>
                <h2 className="text-2xl font-medium text-slate-800">Pedido confirmado...!</h2>
            </div>
        )}

        {/* Map Background */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0 grayscale-[20%]"></div>

        {/* Top Bar Overlay */}
        {acceptanceStatus === 'idle' && (
            <div className="absolute top-0 left-0 right-0 z-50 px-8 pt-14 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 shadow-lg border border-white/10">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-400'}`}></div>
                    <span className="text-sm font-medium text-white">{isOnline ? 'Conectado' : 'Desconectado'}</span>
                </div>
                
                {isOnline && (
                    <button 
                        onClick={handleDisconnect}
                        className="pointer-events-auto bg-[#ef5350] text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-[#e53935] active:scale-95 transition-all border border-white/10"
                    >
                        Desconectar
                    </button>
                )}
            </div>
        )}

        {/* Earnings Summary Card (Floating) - Only show when NOT online */}
        {!isOnline && (
            <div className="absolute top-24 left-4 right-4 z-30 pointer-events-auto animate-in slide-in-from-top-5">
                 <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Ganancias de hoy</p>
                            <h3 className="text-2xl font-medium text-slate-900">
                                S/ {
                                    (JSON.parse(localStorage.getItem('driverOrderHistory') || '[]')
                                        .filter(o => o.driverId === (JSON.parse(localStorage.getItem('chaskys_session') || '{}').id))
                                        .reduce((sum, o) => sum + o.price, 0)
                                    ).toFixed(2)
                                }
                            </h3>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="text-green-600" size={20} />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        {JSON.parse(localStorage.getItem('driverOrderHistory') || '[]')
                            .filter(o => o.driverId === (JSON.parse(localStorage.getItem('chaskys_session') || '{}').id))
                            .slice(0, 2).map((order, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-slate-50/80 rounded-lg border border-slate-100">
                                <div className="truncate max-w-[150px]">
                                    <p className="text-xs font-medium text-slate-700 truncate">{order.client}</p>
                                </div>
                                <span className="text-xs font-medium text-green-600">+ S/ {order.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Radar Overlay (When Online) */}
        {isOnline && (
            <div className="absolute top-24 left-0 right-0 z-10 flex justify-center pointer-events-none">
                <div className="w-80 bg-[#0f172a]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center justify-center p-6 animate-in slide-in-from-top-10 fade-in duration-700">
                    <div className="relative mb-6">
                        <DriverRadar />
                    </div>
                    <p className="text-[#4c8479] font-medium tracking-widest text-xs animate-pulse">BUSCANDO PEDIDOS...</p>
                </div>
            </div>
        )}

        {/* Bottom Control Panel / Feed */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end">
            
            {/* AI Coach Bubble */}
            {driverMotivation && !isOnline && (
                <div className="mb-24 mx-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-lg animate-in slide-in-from-bottom-5 text-center pointer-events-auto">
                    <p className="text-xs font-medium text-slate-700 italic">"{driverMotivation}"</p>
                </div>
            )}

            {/* Main Action Button or Feed */}
            {!isOnline ? (
                <div className="p-4 pb-24 pointer-events-auto w-full flex justify-center">
                    <button 
                        onClick={() => setIsOnline(true)}
                        className="w-full max-w-xs bg-[#4c8479] text-white font-medium text-lg py-4 rounded-full shadow-xl shadow-[#4c8479]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Power size={24} />
                        CONECTARSE
                    </button>
                </div>
            ) : (
                <DriverOpportunitiesView onAcceptOrder={handleOrderSelect} nearbyPlaces={nearbyPlaces} riderLocation={riderLocation} />
            )}
        </div>
    </div>
  );
};

export default DriverDashboard;
