import React, { useEffect } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { FaGoogle, FaWaze } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solución para el problema de iconos en producción
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const EventLocationMap = ({ position, location }) => {
  const [lat, lng] = position;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const wazeUrl = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  
  useEffect(() => {
    
    const map = L.map('event-map-container', {
      zoomControl: false,
      dragging: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: false
    }).setView(position, 16);
    
    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Añadir marcador en la ubicación del evento
    L.marker(position).addTo(map)
      .bindPopup(location)
      .openPopup();
    
    // Limpiar al desmontar
    return () => map.remove();
  }, [position, location]);

  return (
    <div className="mb-8">
      <div className="rounded-xl overflow-hidden h-56 relative bg-gray-100 border border-gray-200">
        {/* Contenedor del mapa */}
        <div 
          id="event-map-container" 
          className="absolute inset-0 w-full h-full"
        />
        
      
      
      </div>
    </div>
  );
};

export default EventLocationMap;