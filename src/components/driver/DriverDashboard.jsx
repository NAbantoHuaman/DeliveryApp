import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MapPin, Power, Shield, DollarSign, Navigation, Utensils, ShoppingBag, Coffee, Pizza, Truck, CheckCircle2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import DriverOpportunitiesView from './DriverOpportunitiesView';
import DriverRadar from './DriverRadar';

import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../../config/mapbox';

// Set Mapbox Token
mapboxgl.accessToken = MAPBOX_TOKEN;



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
  const placesMarkersRef = useRef([]);
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

  const mapMapboxTypeToAppType = (maki, category) => {
      // Mapbox POI features usually have a 'maki' icon property or 'class'
      // We can also check the category string if available
      if (maki === 'park' || category?.includes('park')) return 'park';
      if (maki === 'lodging' || category?.includes('hotel')) return 'hotel';
      if (maki === 'hospital' || category?.includes('hospital') || category?.includes('clinic') || category?.includes('doctor')) return 'hospital';
      if (maki === 'pharmacy' || category?.includes('pharmacy')) return 'pharmacy';
      if (maki === 'fast-food' || category?.includes('burger') || category?.includes('pizza')) return 'fast-food';
      if (maki === 'restaurant' || maki === 'cafe' || category?.includes('food')) return 'restaurant';
      if (maki === 'grocery' || maki === 'shop' || category?.includes('shop')) return 'supermarket';
      if (maki === 'clothing_store' || category?.includes('clothing')) return 'clothing';
      if (maki === 'electronics_store' || category?.includes('electronics')) return 'electronics';
      if (maki === 'furniture' || category?.includes('furniture')) return 'department_store';
      if (category?.includes('shoe')) return 'shoe_store';
      if (category?.includes('book')) return 'bookstore';
      if (category?.includes('florist')) return 'florist';
      if (category?.includes('cinema')) return 'cinema';
      if (category?.includes('bar')) return 'bar';
      
      return 'restaurant'; // Default fallback
  };

  // Handle Initial Location (Run on Mount)
  useEffect(() => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setRiderLocation({ lat: latitude, lng: longitude });
        }, (error) => {
            if (error.code === 1) {
                console.warn("Ubicación denegada por el usuario. Usando ubicación por defecto (Cajamarca).");
            } else {
                console.warn("No se pudo obtener la ubicación. Usando ubicación por defecto.", error.message);
            }
            // Fallback to Cajamarca
            setRiderLocation({ lat: -7.16378, lng: -78.50027 }); 
        });
    } else {
        setRiderLocation({ lat: -7.16378, lng: -78.50027 });
    }
  }, []);

  // Initialize Map & Real-time POI Extraction
  useEffect(() => {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: MAPBOX_STYLE,
          center: [-78.50027, -7.16378], // Default Cajamarca (lng, lat)
          zoom: 16, // Higher zoom to see POIs
          attributionControl: false
      });

      mapInstanceRef.current = map;

      // Function to fetch city-wide places via API
      const fetchCityWidePlaces = async (lat, lng) => {
          try {
              // Search for popular categories in a wider radius (approx 5km)
              const categories = ['restaurant', 'cafe', 'bakery', 'shopping_mall', 'pharmacy', 'market'];
              const promises = categories.map(cat => 
                  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${cat}.json?proximity=${lng},${lat}&limit=25&types=poi&access_token=${MAPBOX_TOKEN}`)
                      .then(res => res.json())
              );

              const results = await Promise.all(promises);
              const apiPlaces = results.flatMap(data => data.features || []).map(f => {
                  const maki = f.properties.maki || (f.properties.category || '').split(',')[0].trim();
                  const category = f.properties.category || '';
                  
                  return {
                      id: f.id,
                      name: f.text,
                      lat: f.center[1],
                      lng: f.center[0],
                      type: mapMapboxTypeToAppType(maki, category),
                      rawMaki: maki,
                      rawCategory: category,
                      source: 'api'
                  };
              });
              return apiPlaces;
          } catch (e) {
              console.error("Error fetching city-wide places:", e);
              return [];
          }
      };

      // Function to extract POIs directly from the map tiles
      const updateMarkers = async () => {
          const map = mapInstanceRef.current;
          if (!map || !map.getStyle()) return;

          // 1. Viewport POIs (High Precision, Local)
          const features = map.queryRenderedFeatures({ layers: ['poi-label'] });
          
          const viewportPlaces = features.map(f => {
              const maki = f.properties.maki || '';
              const category = f.properties.type || '';
              
              // Expanded relevant types
              const relevantTypes = [
                  'restaurant', 'fast-food', 'cafe', 'grocery', 'shop', 'pharmacy', 'hospital', 
                  'park', 'lodging', 'clothing', 'department_store', 'electronics', 'furniture',
                  'bakery', 'ice_cream', 'bookstore', 'shoe_store', 'florist', 'pet_store', 'cinema', 'bar'
              ];
              
              if (!relevantTypes.some(t => maki.includes(t) || category.includes(t))) return null;
              if (!f.properties.name) return null;

              return {
                  id: f.properties.name + f.geometry.coordinates.join(','),
                  name: f.properties.name,
                  lat: f.geometry.coordinates[1],
                  lng: f.geometry.coordinates[0],
                  type: mapMapboxTypeToAppType(maki, category),
                  rawMaki: maki,
                  rawCategory: category,
                  source: 'viewport'
              };
          }).filter(Boolean);

          // 2. City-Wide POIs (Background Fetch - ALWAYS fetch to ensure variety)
          let allPlaces = [...viewportPlaces];
          
          if (riderLocation) {
             const apiPlaces = await fetchCityWidePlaces(riderLocation.lat, riderLocation.lng);
             allPlaces = [...allPlaces, ...apiPlaces];
          }

          // Deduplicate by Name (prefer viewport exact location)
          const uniquePlacesMap = new Map();
          allPlaces.forEach(p => {
              if (!uniquePlacesMap.has(p.name)) {
                  uniquePlacesMap.set(p.name, p);
              }
          });
          
          const uniquePlaces = Array.from(uniquePlacesMap.values());
          
          // Limit to avoid clutter
          setNearbyPlaces(uniquePlaces.slice(0, 60));
      };

      map.on('load', () => {
          updateMarkers();
          map.on('moveend', updateMarkers);
      });

      return () => {
          map.remove();
          mapInstanceRef.current = null;
          riderMarkerRef.current = null;
      };
  }, [riderLocation]); // Re-run if rider location changes significantly (for API fetch)

  // Update Map Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !riderLocation) return;
    const map = mapInstanceRef.current;

    // Only fly to rider location once on initial load/change if needed
    // We don't want to lock the camera if the user is panning
    // For now, we'll just ensure the rider marker is updated
    
    // Render Rider Marker
    if (!riderMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'rider-marker';
        el.innerHTML = `<div class="w-12 h-12 bg-[#4c8479] rounded-full flex items-center justify-center border-4 border-white shadow-xl pulse-ring"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>`;
        
        riderMarkerRef.current = new mapboxgl.Marker(el)
            .setLngLat([riderLocation.lng, riderLocation.lat])
            .addTo(map);
            
        // Initial FlyTo
        map.flyTo({
            center: [riderLocation.lng, riderLocation.lat],
            zoom: 17,
            speed: 1.5
        });
    } else {
        riderMarkerRef.current.setLngLat([riderLocation.lng, riderLocation.lat]);
    }

    // Render Places (POIs)
    // Clear existing place markers
    placesMarkersRef.current.forEach(marker => marker.remove());
    placesMarkersRef.current = [];

    if (nearbyPlaces.length > 0) {
        nearbyPlaces.forEach(place => {
            let iconHtml = '';
            let bgColor = 'bg-slate-500';

            if (place.type === 'park') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M15.14 8.86a5 5 0 0 1 1.94 1.69"/><path d="M8.86 8.86a5 5 0 0 0-1.94 1.69"/><path d="M12 13a5 5 0 1 0-4-8 5 5 0 0 0 4 8Z"/><path d="M20.5 10a5.5 5.5 0 0 0-5.5-5.5 5.5 5.5 0 0 0-2.9 1.05"/><path d="M6.09 14.5a5.5 5.5 0 1 1-2.91-1.05"/></svg>`;
                bgColor = 'bg-[#34A853]'; // Google Green
            } else if (place.type === 'hotel') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>`;
                bgColor = 'bg-[#A142F4]'; // Google Purple
            } else if (place.type === 'fast-food') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16.5 4c-1.5 0-2.8.8-3.5 2-.7-1.2-2-2-3.5-2-2.2 0-4 1.8-4 4h15c0-2.2-1.8-4-4-4Z"/><path d="M5 8v12h14V8"/></svg>`;
                bgColor = 'bg-[#FF9E67]'; // Google Food Orange
            } else if (place.type === 'restaurant') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
                bgColor = 'bg-[#FF9E67]'; // Google Food Orange
            } else if (place.type === 'pharmacy') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M12 2v4"/><path d="M16 2v4"/><rect width="20" height="14" x="2" y="6" rx="2"/><path d="M2 14h20"/><path d="M12 14v6"/></svg>`;
                bgColor = 'bg-[#EA4335]'; // Google Health Red
            } else if (place.type === 'supermarket') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>`;
                bgColor = 'bg-[#4285F4]'; // Google Blue
            }

            const el = document.createElement('div');
            el.className = 'place-marker group';
            // Google Maps Style: Smaller Icon + Clean White Label with Shadow
            // Position: Absolute center to match the POI location exactly
            el.innerHTML = `
                <div class="flex flex-col items-center transform transition-transform hover:scale-110 hover:z-50 cursor-pointer">
                    <div class="w-7 h-7 ${bgColor} rounded-full flex items-center justify-center border-[1.5px] border-white shadow-md z-10">
                        ${iconHtml}
                    </div>
                    <div class="mt-1 bg-white px-2 py-0.5 rounded shadow-[0_1px_3px_rgba(0,0,0,0.2)] border border-black/5 text-[10px] font-semibold text-slate-700 whitespace-nowrap z-0 max-w-[120px] truncate leading-tight">
                        ${place.name}
                    </div>
                </div>
            `;

            const marker = new mapboxgl.Marker(el)
                .setLngLat([place.lng, place.lat])
                .addTo(map);
            
            placesMarkersRef.current.push(marker);
        });
    }
  }, [riderLocation, nearbyPlaces]);

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

  const getNearestStreetName = (lat, lng) => {
      if (!mapInstanceRef.current) return null;
      const map = mapInstanceRef.current;
      try {
          const point = map.project([lng, lat]);
          const features = map.queryRenderedFeatures(
              [[point.x - 20, point.y - 20], [point.x + 20, point.y + 20]]
          );
          const road = features.find(f => 
              (f.layer.id.includes('road') || f.layer.id.includes('street') || f.layer.id.includes('way')) && 
              f.properties && f.properties.name
          );
          return road ? road.properties.name : null;
      } catch (e) {
          return null;
      }
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
                            <h3 className="font-medium text-slate-900 text-xl">{selectedOpportunity?.client}</h3>
                            <p className="text-sm text-slate-700 mt-1">{selectedOpportunity?.address}</p>
                        </div>
                        <div className="text-right">
                            <span className="block font-medium text-slate-900 text-2xl">S/ {selectedOpportunity?.price.toFixed(2)}</span>
                            <span className="text-sm text-slate-700">{selectedOpportunity?.distance}</span>
                        </div>
                    </div>
                </div>

                {/* Animation */}
                <div className="relative mb-8">
                    <Truck size={80} className="text-slate-800 animate-bounce" />
                    <div className="absolute -right-2 -top-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
                </div>
                
                <h2 className="text-2xl font-medium text-slate-800 mb-2">Aceptando carrera...!</h2>
                <p className="text-6xl font-medium text-slate-900 mb-16">{countdown} s</p>

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
                <h2 className="text-3xl font-medium text-slate-800">Pedido confirmado...!</h2>
            </div>
        )}

        {/* Map Background */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0 grayscale-[20%]"></div>

        {/* Top Bar Overlay */}
        {acceptanceStatus === 'idle' && (
            <div className="absolute top-0 left-0 right-0 z-50 px-8 pt-14 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 shadow-lg border border-white/10">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-400'}`}></div>
                    <span className="text-base font-medium text-white">{isOnline ? 'Conectado' : 'Desconectado'}</span>
                </div>
                
                {isOnline && (
                    <button 
                        onClick={handleDisconnect}
                        className="pointer-events-auto bg-[#ef5350] text-white px-5 py-2 rounded-full text-base font-medium shadow-lg hover:bg-[#e53935] active:scale-95 transition-all border border-white/10"
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
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Ganancias de hoy</p>
                            <h3 className="text-3xl font-medium text-slate-900">
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
                                    <p className="text-sm font-medium text-slate-700 truncate">{order.client}</p>
                                </div>
                                <span className="text-sm font-medium text-green-600">+ S/ {order.price.toFixed(2)}</span>
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
                    <p className="text-[#4c8479] font-medium tracking-widest text-sm animate-pulse">BUSCANDO PEDIDOS...</p>
                </div>
            </div>
        )}

        {/* Bottom Control Panel / Feed */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end">
            
            {/* AI Coach Bubble */}
            {driverMotivation && !isOnline && (
                <div className="mb-24 mx-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-lg animate-in slide-in-from-bottom-5 text-center pointer-events-auto">
                    <p className="text-sm font-medium text-slate-700 italic">"{driverMotivation}"</p>
                </div>
            )}

            {/* Main Action Button or Feed */}
            {!isOnline ? (
                <div className="p-4 pb-24 pointer-events-auto w-full flex justify-center">
                    <button 
                        onClick={() => setIsOnline(true)}
                        className="w-full max-w-xs bg-[#4c8479] text-white font-medium text-xl py-4 rounded-full shadow-xl shadow-[#4c8479]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Power size={24} />
                        CONECTARSE
                    </button>
                </div>
            ) : (
                <DriverOpportunitiesView 
                    onAcceptOrder={handleOrderSelect} 
                    nearbyPlaces={nearbyPlaces} 
                    riderLocation={riderLocation}
                    getStreetName={getNearestStreetName}
                />
            )}
        </div>
    </div>
  );
};

export default DriverDashboard;
