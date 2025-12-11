import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Bike, ArrowRight, CheckCircle, Phone, MapPin, Store, MessageSquare, ShieldAlert, Star } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SwipeButton from '../common/SwipeButton';
import DriverChatModal from './DriverChatModal';
import SafetyModal from './SafetyModal';
import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../../config/mapbox';

// Set Token
mapboxgl.accessToken = MAPBOX_TOKEN;

const DriverActiveOrder = ({ activeOrder, setDriverTab, setActiveOrder, deliveryStep, setDeliveryStep }) => {
   const mapContainerRef = useRef(null);
   const mapInstanceRef = useRef(null);
   const riderMarkerRef = useRef(null);
   const routesRef = useRef({ leg1: [], leg2: [] });
   const [isChatOpen, setIsChatOpen] = useState(false);
   const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
   const [isMoving, setIsMoving] = useState(false);
   const [deliveryStatus, setDeliveryStatus] = useState('idle'); // idle, confirming, confirmed

   // Use coordinates from activeOrder or fallback to defaults
   const STORE_POS = activeOrder?.storeLocation || { lat: -12.055248, lng: -77.045363 };
   const CLIENT_POS = activeOrder?.clientLocation || { lat: -12.062000, lng: -77.035000 };
   const INITIAL_RIDER_POS = activeOrder?.riderLocation || STORE_POS;
   
    useEffect(() => {
        if (!mapContainerRef.current || !activeOrder) return;

        // Reset routes and state to prevent stale data
        routesRef.current = { leg1: [], leg2: [] };
        setDeliveryStatus('idle');
        setIsMoving(false);

        // Force cleanup of previous map instance if it exists to ensure fresh start
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Initialize Map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: MAPBOX_STYLE,
            center: [INITIAL_RIDER_POS.lng, INITIAL_RIDER_POS.lat],
            zoom: 16,
            attributionControl: false
        });

        mapInstanceRef.current = map;

        map.on('load', () => {
            let iconHtml = '';
            let bgColor = 'bg-orange-500';
            const storeType = activeOrder.storeType || 'fast-food';

            if (storeType === 'fast-food') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16.5 4c-1.5 0-2.8.8-3.5 2-.7-1.2-2-2-3.5-2-2.2 0-4 1.8-4 4h15c0-2.2-1.8-4-4-4Z"/><path d="M5 8v12h14V8"/></svg>`;
                bgColor = 'bg-[#FF9E67]'; // Google Food Orange
            } else if (storeType === 'restaurant') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
                bgColor = 'bg-[#FF9E67]'; // Google Food Orange
            } else if (storeType === 'supermarket') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>`;
                bgColor = 'bg-[#4285F4]'; // Google Blue
            } else if (storeType === 'pharmacy') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M12 2v4"/><path d="M16 2v4"/><rect width="20" height="14" x="2" y="6" rx="2"/><path d="M2 14h20"/><path d="M12 14v6"/></svg>`;
                bgColor = 'bg-[#EA4335]'; // Google Health Red
            } else if (storeType === 'park') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M15.14 8.86a5 5 0 0 1 1.94 1.69"/><path d="M8.86 8.86a5 5 0 0 0-1.94 1.69"/><path d="M12 13a5 5 0 1 0-4-8 5 5 0 0 0 4 8Z"/><path d="M20.5 10a5.5 5.5 0 0 0-5.5-5.5 5.5 5.5 0 0 0-2.9 1.05"/><path d="M6.09 14.5a5.5 5.5 0 1 1-2.91-1.05"/></svg>`;
                bgColor = 'bg-[#34A853]'; // Google Green
            } else if (storeType === 'hotel') {
                iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>`;
                bgColor = 'bg-[#A142F4]'; // Google Purple
            }

            const storeEl = document.createElement('div');
            storeEl.className = 'store-marker';
            storeEl.innerHTML = `
            <div class="flex flex-col items-center transform hover:scale-110 transition-transform z-20">
                <div class="w-9 h-9 ${bgColor} rounded-full flex items-center justify-center border-[2px] border-white shadow-lg z-10">
                    ${iconHtml}
                </div>
                <div class="mt-1 bg-white px-2.5 py-1 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.15)] border border-black/5 text-[11px] font-bold text-slate-800 whitespace-nowrap z-0 max-w-[140px] truncate">
                    ${activeOrder.storeName || 'Tienda'}
                </div>
            </div>
            `;
            new mapboxgl.Marker(storeEl)
                .setLngLat([STORE_POS.lng, STORE_POS.lat])
                .addTo(map);

            // Client Marker
            const clientEl = document.createElement('div');
            clientEl.className = 'client-marker';
            clientEl.innerHTML = `
            <div class="flex flex-col items-center transform hover:scale-110 transition-transform z-20">
                <div class="w-9 h-9 bg-[#EA4335] rounded-full flex items-center justify-center border-[2px] border-white shadow-lg z-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div class="mt-1 bg-white px-2.5 py-1 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.15)] border border-black/5 text-[11px] font-bold text-slate-800 whitespace-nowrap z-0 max-w-[140px] truncate">
                    ${activeOrder.client}
                </div>
            </div>
            `;
            new mapboxgl.Marker(clientEl)
                .setLngLat([CLIENT_POS.lng, CLIENT_POS.lat])
                .addTo(map);

            // Rider Marker
            const riderEl = document.createElement('div');
            riderEl.className = 'rider-marker';
            riderEl.innerHTML = `<div class="w-12 h-12 bg-[#4c8479] rounded-full flex items-center justify-center border-4 border-white shadow-xl pulse-ring"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>`;
            
            // Ensure rider starts at INITIAL_RIDER_POS (which should be the store for the first leg if we assume pickup)
            // Or better, if it's a new order, the rider is likely at their current location. 
            // For simulation, let's assume rider starts near the store or at a fixed point.
            riderMarkerRef.current = new mapboxgl.Marker(riderEl)
                .setLngLat([INITIAL_RIDER_POS.lng, INITIAL_RIDER_POS.lat])
                .addTo(map);

            // Fetch Route (Mapbox Directions API)
            const fetchRoute = async () => {
                try {
                    // Leg 1: Rider -> Store
                    const leg1Url = `https://api.mapbox.com/directions/v5/mapbox/driving/${INITIAL_RIDER_POS.lng},${INITIAL_RIDER_POS.lat};${STORE_POS.lng},${STORE_POS.lat}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
                    const leg1Res = await fetch(leg1Url);
                    const leg1Data = await leg1Res.json();

                    // Leg 2: Store -> Client
                    const leg2Url = `https://api.mapbox.com/directions/v5/mapbox/driving/${STORE_POS.lng},${STORE_POS.lat};${CLIENT_POS.lng},${CLIENT_POS.lat}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
                    const leg2Res = await fetch(leg2Url);
                    const leg2Data = await leg2Res.json();

                    if (leg1Data.routes[0] && leg2Data.routes[0]) {
                        // Manually append the exact destination coordinates to ensure the route connects to the marker
                        const leg1Coords = leg1Data.routes[0].geometry.coordinates;
                        leg1Coords.unshift([INITIAL_RIDER_POS.lng, INITIAL_RIDER_POS.lat]); // Start exactly at rider
                        leg1Coords.push([STORE_POS.lng, STORE_POS.lat]);

                        const leg2Coords = leg2Data.routes[0].geometry.coordinates;
                        leg2Coords.unshift([STORE_POS.lng, STORE_POS.lat]); // Start exactly at store
                        leg2Coords.push([CLIENT_POS.lng, CLIENT_POS.lat]);

                        routesRef.current = {
                            leg1: leg1Coords,
                            leg2: leg2Coords
                        };

                        // Draw Route (Full Path)
                        const fullCoordinates = [...routesRef.current.leg1, ...routesRef.current.leg2];
                        
                        const geojson = {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: fullCoordinates
                            }
                        };

                        if (map.getSource('route')) {
                            map.getSource('route').setData(geojson);
                        } else {
                            map.addLayer({
                                id: 'route',
                                type: 'line',
                                source: {
                                    type: 'geojson',
                                    data: geojson
                                },
                                layout: {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                },
                                paint: {
                                    'line-color': '#3b82f6',
                                    'line-width': 5,
                                    'line-opacity': 0.8
                                }
                            });
                        }
                        
                        // Fit Bounds
                        const bounds = fullCoordinates.reduce((bounds, coord) => {
                            return bounds.extend(coord);
                        }, new mapboxgl.LngLatBounds(fullCoordinates[0], fullCoordinates[0]));

                        map.fitBounds(bounds, { padding: 50 });
                    }

                } catch (error) {
                    console.error("Error fetching routes:", error);
                }
            };

            fetchRoute();
        });

        return () => {
             if (mapInstanceRef.current) {
                 mapInstanceRef.current.remove();
                 mapInstanceRef.current = null;
             }
        };

    }, [activeOrder]);

   // Animation Logic (Path Following)
   const animateMovement = (pathCoordinates, onComplete) => {
       if (!pathCoordinates || pathCoordinates.length < 2) {
           console.warn("Invalid pathCoordinates for animation:", pathCoordinates);
           onComplete();
           return;
       }


       setIsMoving(true);
       const duration = 4000; // 4 seconds total duration
       const startTime = performance.now();
       const map = mapInstanceRef.current;
       const marker = riderMarkerRef.current;

       const animate = (currentTime) => {
           try {
               const elapsed = currentTime - startTime;
               const progress = Math.min(elapsed / duration, 1);
               
               // Calculate current position along the path
               const totalSegments = pathCoordinates.length - 1;
               const currentSegmentFloat = progress * totalSegments;
               const currentSegmentIndex = Math.floor(currentSegmentFloat);
               const segmentProgress = currentSegmentFloat - currentSegmentIndex;

               if (currentSegmentIndex < totalSegments) {
                   const start = pathCoordinates[currentSegmentIndex];
                   const end = pathCoordinates[currentSegmentIndex + 1];
                   if (!start || !end) {
                       // console.warn(`Skipping invalid segment at index ${currentSegmentIndex}`);
                       // Do not abort, just skip this frame's visual update
                   } else {
                        const currentLng = start[0] + (end[0] - start[0]) * segmentProgress;
                        const currentLat = start[1] + (end[1] - start[1]) * segmentProgress;

                        if (marker && !isNaN(currentLat) && !isNaN(currentLng)) {
                            marker.setLngLat([currentLng, currentLat]);
                        }
                        if (map && !isNaN(currentLat) && !isNaN(currentLng)) {
                            map.panTo([currentLng, currentLat], { animate: false });
                        }
                   }
               } else {
                   // Ensure we land exactly on the last point
                   const lastPoint = pathCoordinates[pathCoordinates.length - 1];
                   if (marker) marker.setLngLat(lastPoint);
                   if (map) map.panTo(lastPoint);
               }

               if (progress < 1) {
                   requestAnimationFrame(animate);
               } else {
                   setIsMoving(false);
                   onComplete();
               }
           } catch (error) {
               console.error("Animation error:", error);
               setIsMoving(false);
               onComplete(); // Force completion on error
           }
       };

       requestAnimationFrame(animate);
   };

    // Handle Swipe Actions
    const handleSwipe = () => {
        if (deliveryStep === 0) {
            // Move from Rider Start -> Store (Leg 1)
            const path = routesRef.current.leg1.length > 0 ? routesRef.current.leg1 : [[INITIAL_RIDER_POS.lng, INITIAL_RIDER_POS.lat], [STORE_POS.lng, STORE_POS.lat]];
            animateMovement(path, () => setDeliveryStep(1));
        } else if (deliveryStep === 1) {
            // Move from Store -> Client (Leg 2)
            const path = routesRef.current.leg2.length > 0 ? routesRef.current.leg2 : [[STORE_POS.lng, STORE_POS.lat], [CLIENT_POS.lng, CLIENT_POS.lat]];
            animateMovement(path, () => {
                // Trigger Delivery Animation
                setDeliveryStatus('confirmed');
                setTimeout(() => {
                    setDeliveryStatus('idle');
                    setDeliveryStep(2);
                }, 2000); // Show success for 2s
            });
        }
    };


   if(!activeOrder) return null; 

   const getStepInfo = () => {
       switch(deliveryStep) {
           case 0: return {
               title: "Recoger pedido",
               subtitle: activeOrder.storeName || "Restaurante",
               address: "Ver ubicación en mapa",
               icon: Store,
               color: "text-slate-800",
               action: "Deslizar para confirmar recogida"
           };
           case 1: return {
               title: "Entregar pedido",
               subtitle: activeOrder.client,
               address: activeOrder.address,
               icon: MapPin,
               color: "text-[#F08080]",
               action: "Deslizar para finalizar entrega"
           };
           default: return null;
       }
   };

   const stepInfo = getStepInfo();

   return (
       <div className="h-full flex flex-col relative bg-slate-100 overflow-hidden">
            {/* DELIVERY ANIMATION OVERLAY */}
            {deliveryStatus === 'confirmed' && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#e0f2f1] animate-in fade-in duration-300">
                    <div className="text-center">
                        <div className="w-32 h-32 bg-[#5cdb5c] rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-500 mx-auto mb-8">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 animate-in slide-in-from-bottom-4 duration-500 delay-150">Pedido Finalizado...!</h2>
                    </div>
                </div>
            )}

           {/* Map Layer */}
           <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

           {/* Top Floating Header */}
           <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-12 flex justify-between items-start pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-auto flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${deliveryStep < 2 ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                    <span className="text-xs font-bold text-slate-700">
                        {isMoving ? 'En camino...' : deliveryStep < 2 ? 'En curso' : 'Finalizado'}
                    </span>
                </div>
                <button 
                    onClick={() => setIsSafetyModalOpen(true)}
                    className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg pointer-events-auto text-slate-700 active:scale-95 transition-transform"
                >
                    <ShieldAlert size={20} className="text-red-500" />
                </button>
           </div>

           {/* Bottom Sheet */}
           <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
               {deliveryStep < 2 ? (
                   <div className={`bg-white rounded-3xl shadow-2xl p-5 transition-all duration-300 ${isMoving ? 'translate-y-full opacity-50' : 'translate-y-0 opacity-100'}`}>
                       {/* Task Header */}
                       <div className="flex items-start justify-between mb-6">
                           <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                   <stepInfo.icon size={24} className={stepInfo.color} />
                               </div>
                               <div>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Orden #{activeOrder.id.toString().slice(-6)}</p>
                                   <h2 className="text-xl font-medium text-slate-900">{stepInfo.title}</h2>
                                   <p className="text-sm font-medium text-slate-500">{stepInfo.subtitle}</p>
                               </div>
                           </div>
                           <div className="flex gap-2">
                               <button 
                                   onClick={() => setIsChatOpen(true)}
                                   className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
                               >
                                   <MessageSquare size={20} />
                               </button>
                               <button 
                                   onClick={() => window.open('tel:999999999')}
                                   className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
                               >
                                   <Phone size={20} />
                               </button>
                           </div>
                       </div>

                       {/* Address Card */}
                       <div className="bg-slate-50 rounded-xl p-4 mb-6 flex justify-between items-center border border-slate-100">
                           <div>
                               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Dirección</p>
                               <p className="text-sm font-medium text-slate-800">{stepInfo.address}</p>
                           </div>
                           <button className="bg-[#4c8479]/10 text-[#4c8479] p-2 rounded-lg">
                               <Navigation size={20} />
                           </button>
                       </div>

                       {/* Order Details & Client Info */}
                       <div className="mb-6 space-y-4 border-t border-slate-100 pt-4">
                           <div className="flex justify-between items-start">
                               <div>
                                   <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Cliente</p>
                                   <p className="text-sm font-medium text-slate-900">{activeOrder.client}</p>
                                   <p className="text-xs text-slate-500">{activeOrder.phone || '999 999 999'}</p>
                               </div>
                               <div className="text-right">
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Llegada Aprox.</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {new Date(Date.now() + 15 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                               </div>
                           </div>

                           <div>
                               <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Pedido</p>
                               <p className="text-sm text-slate-700">{activeOrder.items}</p>
                               <p className="text-xs font-medium text-slate-500 mt-1">Pago: {activeOrder.paymentMethod || 'Efectivo'}</p>
                           </div>

                           {activeOrder.indications && (
                               <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                                   <p className="text-xs text-amber-800 font-medium flex items-start gap-2">
                                       <MessageSquare size={14} className="mt-0.5 shrink-0" />
                                       <span>"{activeOrder.indications}"</span>
                                   </p>
                               </div>
                           )}
                       </div>

                       <SwipeButton  
                            key={deliveryStep}
                            onConfirm={handleSwipe} 
                            label={stepInfo.action}
                       />
                   </div>
               ) : (
                   // Summary Step
                   <div className="bg-white rounded-3xl shadow-2xl p-6 text-center animate-in slide-in-from-right">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h2 className="text-xl font-medium text-slate-900">¡Pedido Completado!</h2>
                            <p className="text-sm text-slate-500">Orden #{activeOrder.id.toString().slice(-6)} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>

                        {/* Trip Details */}
                        <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-left border border-slate-100 space-y-4">
                            <div className="relative pl-6 border-l-2 border-slate-200 ml-2">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-slate-300"></div>
                                <div className="mb-4">
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Recogido en</p>
                                    <p className="text-sm font-medium text-slate-900">{activeOrder.restaurant}</p>
                                </div>
                                
                                <div className="absolute -left-[9px] top-full -translate-y-full w-4 h-4 rounded-full bg-white border-4 border-[#4c8479]"></div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Entregado a</p>
                                    <p className="text-sm font-medium text-slate-900">{activeOrder.client}</p>
                                    <p className="text-xs text-slate-500">{activeOrder.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Financials */}
                        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-500 text-sm">Método de Pago</span>
                                <span className="font-medium text-slate-800">{activeOrder.paymentMethod || 'Efectivo'}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-500 text-sm">Tarifa Base</span>
                                <span className="font-medium text-slate-800">S/ {(activeOrder.price * 0.8).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-500 text-sm">Propina</span>
                                <span className="font-medium text-slate-800">S/ {(activeOrder.price * 0.2).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
                                <span className="font-medium text-slate-900">Total Ganado</span>
                                <span className="font-medium text-[#4c8479] text-xl">S/ {activeOrder.price.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Client Rating Simulation */}
                         <div className="mb-6 text-center">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Calificación del Cliente</p>
                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={24} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm font-medium text-slate-600 mt-1">¡Excelente servicio!</p>
                        </div>

                        <button 
                            onClick={() => { 
                                // Save Order to History
                                const currentUser = JSON.parse(localStorage.getItem('chaskys_session') || '{}');
                                const history = JSON.parse(localStorage.getItem('driverOrderHistory') || '[]');
                                const newOrderRecord = {
                                    ...activeOrder,
                                    status: 'completed',
                                    completedAt: new Date().toISOString(),
                                    rating: 5, // Fixed to 5 for now as per UI
                                    driverId: currentUser.id
                                };
                                history.unshift(newOrderRecord);
                                localStorage.setItem('driverOrderHistory', JSON.stringify(history));

                                setActiveOrder(null); 
                                setDriverTab('dashboard'); 
                                setDeliveryStep(0); 
                            }}
                            className="w-full bg-slate-900 text-white font-medium py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                        >
                            Volver al Mapa
                        </button>
                   </div>
               )}
           </div>

           {/* Chat Modal */}
           <DriverChatModal 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                clientName={activeOrder.client}
           />

           {/* Safety Modal */}
           <SafetyModal 
                isOpen={isSafetyModalOpen}
                onClose={() => setIsSafetyModalOpen(false)}
           />
       </div>
   );
};

export default DriverActiveOrder;
