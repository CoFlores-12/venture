'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import "./map.css"



// Fix icon issue with Leaflet + Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

const createEmojiIcon = (emoji) =>
  L.divIcon({
    html: `
      <div class="pin-container">
        <div class="pulse-circle"></div>
        <div class="emoji">${emoji}</div>
      </div>
    `,
    className: "", // Evitamos clases de Leaflet por defecto
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });


// Routing component (opcional, si quieres ruta GPS -> evento)
function Routing({ from, to }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!from || !to) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      lineOptions: { styles: [{ color: '#0f766e', weight: 5 }] },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    return () => map.removeControl(routingControlRef.current);
  }, [from, to, map]);

  return null;
}

export default function MapComponent({events}) {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Obtener ubicación GPS del usuario
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation([14.0723, -87.1921]); // fallback a Plaza de Armas si no hay GPS
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setUserLocation([14.0723, -87.1921]);
      }
    );
  }, []);

  if (!userLocation) return <div>Cargando ubicación...</div>;

  return (
    <div className="container mx-auto p-4 h-[700px] z-10 rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer center={userLocation} zoom={14} style={{ height: '100%', width: '100%', zIndex: 10 }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador de la ubicación del usuario */}
        <Marker position={userLocation}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>

        {/* Marcadores para cada evento */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.position}
            eventHandlers={{
              click: () => setSelectedEvent(event),
            }}
            icon={createEmojiIcon(event.emoji)}
          >
            <Popup>
              <div className="text-left">
                <h3 className="font-semibold text-lg">{event.emoji} {event.title}</h3>
                <p><strong>Lugar:</strong> {event.location}</p>
                <p><strong>Fecha:</strong> {event.date}</p>
                <p><strong>Distancia:</strong> {event.distance}</p>
                <p><strong>Categoría:</strong> {event.category}</p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
