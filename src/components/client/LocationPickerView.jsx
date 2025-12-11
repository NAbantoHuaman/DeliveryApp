import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../../config/mapbox';

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function LocationPickerView({ onBack, onConfirm }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [address, setAddress] = useState("Cargando dirección...");
  const [loading, setLoading] = useState(false);
  // Default center: Lima, Peru
  const defaultCenter = { lat: -12.0464, lng: -77.0428 };

  const [addressLabel, setAddressLabel] = useState('Casa'); // Default label
  const [isConfirming, setIsConfirming] = useState(false); // New state for confirmation loading

  // Function to fetch address from coordinates (Reverse Geocoding)
  const fetchAddress = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=address&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setAddress(data.features[0].place_name);
      } else {
        setAddress("Dirección desconocida");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error al obtener dirección");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 15,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Handle move end
    map.on('moveend', () => {
      const center = map.getCenter();
      fetchAddress(center.lat, center.lng);
    });

    // Initial fetch
    fetchAddress(defaultCenter.lat, defaultCenter.lng);

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      onConfirm(address, addressLabel); // Pass label too
    }, 1000);
  };

  return (
    <div className="w-full h-full relative bg-slate-200 animate-in fade-in duration-300">
      {/* Map Placeholder */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      
      {/* Interactive Map Mock (Pin Overlay) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
        <div className="relative -mt-10">
          <MapPin size={48} className="text-[#4c8479] fill-[#4c8479]/20 animate-bounce" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-sm"></div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex items-center gap-4 bg-gradient-to-b from-black/50 to-transparent z-[1000]">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} className="text-slate-900" />
        </button>
        <div className="flex-1 bg-white rounded-full px-4 py-2.5 shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700 truncate">{loading ? "Buscando..." : address}</span>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300 z-[1000]">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Confirmar ubicación</h3>
        <p className="text-slate-500 text-sm mb-4">Mueve el mapa para ajustar la ubicación exacta.</p>
        
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Guardar como</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Casa', 'Oficina', 'Pareja', 'Otro'].map(label => (
              <button
                key={label}
                onClick={() => setAddressLabel(label)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  addressLabel === label 
                  ? 'bg-[#4c8479] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={isConfirming || loading} // Disable if address is still loading
          className="w-full bg-[#4c8479] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#4c8479]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isConfirming ? (
            <>
              <Loader2 className="animate-spin" />
              Confirmando...
            </>
          ) : (
            'Confirmar Ubicación'
          )}
        </button>
      </div>
    </div>
  );
}
