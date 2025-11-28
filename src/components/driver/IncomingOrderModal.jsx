import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../../config/mapbox';

mapboxgl.accessToken = MAPBOX_TOKEN;

const IncomingOrderModal = ({ incomingOrder, setIncomingOrder, acceptOrder }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [acceptanceStatus, setAcceptanceStatus] = React.useState('idle'); // idle, processing, confirmed
    const [countdown, setCountdown] = React.useState(5);

    useEffect(() => {
        if (!incomingOrder || !mapContainerRef.current) return;

        // Initialize Map if not already initialized
        if (!mapInstanceRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: MAPBOX_STYLE,
                zoom: 13,
                interactive: false,
                attributionControl: false
            });
            mapInstanceRef.current = map;

            map.on('load', () => {
                const fetchRoute = async () => {
                    try {
                        const waypoints = `${incomingOrder.storeLocation.lng},${incomingOrder.storeLocation.lat};${incomingOrder.clientLocation.lng},${incomingOrder.clientLocation.lat}`;
                        const response = await fetch(
                            `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
                        );
                        const data = await response.json();

                        if (data.routes && data.routes[0]) {
                            const route = data.routes[0];
                            const geojson = {
                                type: 'Feature',
                                properties: {},
                                geometry: route.geometry
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
                                        'line-opacity': 0.8,
                                        'line-dasharray': [0.2, 2] // Dotted line effect approximation
                                    }
                                });
                            }

                            // Fit bounds to route
                            const coordinates = route.geometry.coordinates;
                            const bounds = coordinates.reduce((bounds, coord) => {
                                return bounds.extend(coord);
                            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                            map.fitBounds(bounds, {
                                padding: 40
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching route:", error);
                    }
                };

                fetchRoute();
            });
        }

        return () => {
             if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };

    }, [incomingOrder]);

    useEffect(() => {
        let timer;
        if (acceptanceStatus === 'processing') {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setAcceptanceStatus('confirmed');
                        setTimeout(() => {
                            acceptOrder(incomingOrder);
                        }, 1500); // Show success for 1.5s before closing
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [acceptanceStatus, acceptOrder, incomingOrder]);

    const handleAcceptClick = () => {
        setAcceptanceStatus('processing');
    };

    const handleCancelAcceptance = () => {
        setAcceptanceStatus('idle');
        setCountdown(5);
    };

    if (!incomingOrder) return null;

    // Format Date
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });

    // RENDER: Processing State (Countdown)
    if (acceptanceStatus === 'processing') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                <div className="bg-[#e0f2f1] w-[95%] max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 border-4 border-[#e0f2f1] flex flex-col items-center justify-center py-12 px-6 text-center">
                    
                    {/* Truck Animation */}
                    <div className="mb-6 relative">
                         <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4c8479" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                         </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">Aceptando carrera...!</h3>
                    <p className="text-4xl font-bold text-[#4c8479] mb-8">{countdown} s</p>

                    <button 
                        onClick={handleCancelAcceptance}
                        className="w-full bg-[#f08080] text-black font-bold py-3 rounded-xl shadow-md active:scale-95 transition-transform uppercase tracking-wide"
                    >
                        CANCELAR
                    </button>
                </div>
            </div>
        );
    }

    // RENDER: Confirmed State (Success)
    if (acceptanceStatus === 'confirmed') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                <div className="bg-[#e0f2f1] w-[95%] max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 border-4 border-[#e0f2f1] flex flex-col items-center justify-center py-16 px-6 text-center">
                    
                    {/* Success Checkmark */}
                    <div className="mb-6">
                        <div className="w-24 h-24 bg-[#5cdb5c] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800">Pedido confirmado...!</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-[#e0f2f1] w-[95%] max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 border-4 border-[#e0f2f1]">
                
                {/* Header Section */}
                <div className="bg-[#99d5c9] p-6 pb-8 rounded-t-[1.5rem] rounded-b-[1.5rem] mb-[-1.5rem] relative z-10 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <h2 className="text-3xl font-bold text-slate-900">{incomingOrder.client}</h2>
                        <span className="text-3xl font-bold text-slate-900">S/ {incomingOrder.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-base text-slate-700 font-medium">
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">{incomingOrder.storeName}</p>
                            <p className="text-slate-600">{incomingOrder.address}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-right">
                            <p>Distancia: 2.5km</p>
                            <p>{dateStr} {timeStr}</p>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white pt-8 pb-2 px-2 rounded-[2rem] overflow-hidden relative z-0 mt-[-1rem]">
                    <div className="h-96 w-full rounded-2xl overflow-hidden relative">
                        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-slate-100"></div>
                        
                        {/* Route Info Overlay (Mock) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow text-xs font-bold text-slate-700 z-[500]">
                            15 min
                        </div>
                    </div>
                    <div className="text-center text-[10px] text-slate-400 mt-1">Mapbox GL JS</div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 flex gap-3 bg-[#e0f2f1]">
                    <button 
                        onClick={() => setIncomingOrder(null)}
                        className="flex-1 bg-[#f08080] text-black font-bold py-3 rounded-xl shadow-md active:scale-95 transition-transform uppercase tracking-wide"
                    >
                        CANCELAR
                    </button>
                    <button 
                        onClick={handleAcceptClick}
                        className="flex-1 bg-[#5cdb5c] text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-transform uppercase tracking-wide"
                    >
                        ACEPTAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingOrderModal;
