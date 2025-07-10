'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./map.css";
import 'leaflet-routing-machine';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
  });
}

const MapResizeHandler = ({ isExpanded }) => {
  const map = useMap();
  
  useEffect(() => {
    
    const timer = setTimeout(() => {
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isExpanded, map]);

  return null;
};

export default function MapComponent({ events, isMapExpanded }) {
  const [userLocation, setUserLocation] = useState([14.0723, -87.1921]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const mapRef = useRef(null);

  // Añade efecto para debuggear cambios en isMapExpanded
  useEffect(() => {
    console.log('isMapExpanded changed:', isMapExpanded);
  }, [isMapExpanded]);

  function Routing({ from, to, onDistance }) {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
      if (!from || !to) return;

      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        createMarker: () => null,
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        show: false,
        fitSelectedRoutes: true,
        lineOptions: { styles: [{ color: '#0f766e', weight: 5 }] },
      })
        .on('routesfound', (e) => {
          const distanceMeters = e.routes[0].summary.totalDistance;
          const distanceKm = distanceMeters / 1000;
          if (onDistance) onDistance(distanceKm);
        })
        .addTo(map);

      return () => {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
        }
      };
    }, [from, to, map, onDistance]);

    return null;
  }
  
  const createEmojiIcon = (category) =>
    L.divIcon({
      html: `
        <div class="pin-container">
          <div class="pulse-circle"></div>
          <div class="emoji">${[...category][0]}</div>
        </div>
      `,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setUserLocation([14.0723, -87.1921])
    );
  }, []);

  return (
    <div className="relative w-full" style={{ height: isMapExpanded ? '100vh' : '60vh' }}>
      <MapContainer 
        center={userLocation} 
        zoom={13} 
        style={{ 
          height: '100%',
          width: '100%', 
          zIndex: 10,
          transition: 'height 0.3s ease'
        }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>

        {events?.map((event) => (
          <Marker
            key={event.id}
            position={event.position}
            eventHandlers={{ click: () => setSelectedEvent(event) }}
            icon={createEmojiIcon(event.category)}
          >
            <Popup>
              <div className="text-left">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p><strong>Lugar:</strong> {event.location}</p>
                <p><strong>Fecha:</strong> {event.date}</p>
                <p><strong>Distancia:</strong> {distanceKm !== null ? distanceKm.toFixed(2) + ' km' : 'Calculando...'}</p>
                <p><strong>Categoría:</strong> {event.category}</p>
                <Link
                  href={`/event/${event._id}`}
                  className="btn bg-purple-700 !text-white no-underline"
                >
                  Más Detalles
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {userLocation && selectedEvent?.position && (
          <Routing
            from={userLocation}
            to={selectedEvent.position}
            onDistance={setDistanceKm}
          />
        )}
        
        <MapResizeHandler isExpanded={isMapExpanded} />
      </MapContainer>
    </div>
  );
}