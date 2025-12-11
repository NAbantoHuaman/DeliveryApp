import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, MapPin, Store, Calendar, DollarSign, Package, CreditCard, Star } from 'lucide-react';
import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../../config/mapbox';

// Set Token
mapboxgl.accessToken = MAPBOX_TOKEN;

const OrderDetailsModal = ({ order, onClose }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current || !order) return;

        const STORE_POS = order.storeLocation || { lat: -12.055248, lng: -77.045363 };
        const CLIENT_POS = order.clientLocation || { lat: -12.062000, lng: -77.035000 };
        // Use riderLocation if available, otherwise just start from store (or maybe a default)
        // For history, usually Store -> Client is the most important leg.
        // But if we want "lo que se siguió", maybe we include the pickup leg if we have the data.
        // The saved order has 'riderLocation' (initial).
        const RIDER_POS = order.riderLocation;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: MAPBOX_STYLE,
            center: [STORE_POS.lng, STORE_POS.lat],
            zoom: 13,
            attributionControl: false
        });
        mapInstanceRef.current = map;

        map.on('load', () => {
            // Markers
            // Store
            const storeEl = document.createElement('div');
            storeEl.className = 'store-marker';
            storeEl.innerHTML = `<div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg></div>`;
            new mapboxgl.Marker(storeEl).setLngLat([STORE_POS.lng, STORE_POS.lat]).addTo(map);

            // Client
            const clientEl = document.createElement('div');
            clientEl.className = 'client-marker';
            clientEl.innerHTML = `<div class="w-8 h-8 bg-[#F08080] rounded-full flex items-center justify-center border-2 border-white shadow-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`;
            new mapboxgl.Marker(clientEl).setLngLat([CLIENT_POS.lng, CLIENT_POS.lat]).addTo(map);

            // If we have rider start pos, maybe show it too?
            if (RIDER_POS) {
                 const riderEl = document.createElement('div');
                 riderEl.className = 'rider-start-marker';
                 riderEl.innerHTML = `<div class="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg opacity-70"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg></div>`;
                 new mapboxgl.Marker(riderEl).setLngLat([RIDER_POS.lng, RIDER_POS.lat]).addTo(map);
            }

            // Fetch Route
            const fetchRoute = async () => {
                try {
                    let coordinates = [];
                    
                    // If we have Rider Pos, fetch Leg 1 (Rider -> Store) and Leg 2 (Store -> Client)
                    if (RIDER_POS) {
                        const leg1Url = `https://api.mapbox.com/directions/v5/mapbox/driving/${RIDER_POS.lng},${RIDER_POS.lat};${STORE_POS.lng},${STORE_POS.lat}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
                        const leg1Res = await fetch(leg1Url);
                        const leg1Data = await leg1Res.json();
                        if (leg1Data.routes[0]) {
                            coordinates.push(...leg1Data.routes[0].geometry.coordinates);
                            coordinates.push([STORE_POS.lng, STORE_POS.lat]); // Ensure connection
                        }
                    }

                    // Leg 2 (Store -> Client) - Always fetch
                    const leg2Url = `https://api.mapbox.com/directions/v5/mapbox/driving/${STORE_POS.lng},${STORE_POS.lat};${CLIENT_POS.lng},${CLIENT_POS.lat}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
                    const leg2Res = await fetch(leg2Url);
                    const leg2Data = await leg2Res.json();
                    
                    if (leg2Data.routes[0]) {
                        coordinates.push(...leg2Data.routes[0].geometry.coordinates);
                        coordinates.push([CLIENT_POS.lng, CLIENT_POS.lat]); // Ensure connection
                    }

                    if (coordinates.length > 0) {
                        const geojson = {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: coordinates
                            }
                        };

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
                                'line-width': 4,
                                'line-opacity': 0.7
                            }
                        });

                        // Fit Bounds
                        const bounds = coordinates.reduce((bounds, coord) => {
                            return bounds.extend(coord);
                        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                        map.fitBounds(bounds, { padding: 50 });
                    }

                } catch (error) {
                    console.error("Error fetching route history:", error);
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
    }, [order]);

    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Detalles del Pedido</h2>
                        <p className="text-xs text-slate-500">Orden #{order.id.toString().slice(-6)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Map Area */}
                <div className="relative h-64 bg-slate-100 shrink-0">
                    <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Status & Date */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-green-600 uppercase">Completado</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                            <Calendar size={14} />
                            <span>{new Date(order.completedAt).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="relative pl-4 border-l-2 border-slate-200 space-y-6 ml-1">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm flex items-center justify-center">
                                <Store size={8} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Recogido en</p>
                                <h3 className="text-sm font-bold text-slate-900">{order.restaurant || order.storeName}</h3>
                                <p className="text-xs text-slate-500 truncate w-full">Ver en mapa</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-[#F08080] border-2 border-white shadow-sm flex items-center justify-center">
                                <MapPin size={8} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Entregado a</p>
                                <h3 className="text-sm font-bold text-slate-900">{order.client}</h3>
                                <p className="text-xs text-slate-500">{order.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Package size={20} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Contenido</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{order.items}</p>
                                {order.indications && (
                                    <p className="text-xs text-slate-500 mt-2 italic">"{order.indications}"</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <CreditCard size={18} className="text-slate-400" />
                                <span className="text-sm text-slate-600">Método de Pago</span>
                            </div>
                            <span className="font-medium text-slate-900">{order.paymentMethod || 'Efectivo'}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-[#4c8479]/5 rounded-xl border border-[#4c8479]/10">
                            <div className="flex items-center gap-3">
                                <DollarSign size={18} className="text-[#4c8479]" />
                                <span className="text-sm font-bold text-[#4c8479]">Ganancia Total</span>
                            </div>
                            <span className="text-xl font-bold text-[#4c8479]">S/ {order.price.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Rating */}
                    {order.rating && (
                        <div className="text-center pt-2">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Calificación del Cliente</p>
                            <div className="flex justify-center gap-1">
                                {[...Array(order.rating)].map((_, i) => (
                                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
