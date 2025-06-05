"use client";
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Solución para los iconos rotos en Leaflet
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png'
})

const LeafletMap = ({ position, onMapClick }) => {
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    // Inicializar el mapa solo en el cliente
    if (typeof window !== 'undefined') {
      const map = L.map(mapRef.current).setView(position, 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      // Agregar marcador inicial
      markerRef.current = L.marker(position, {
        draggable: true
      }).addTo(map)

      // Manejar clics en el mapa
      map.on('click', (e) => {
        markerRef.current.setLatLng(e.latlng)
        onMapClick(e.latlng)
      })

      // Manejar movimiento del marcador
      markerRef.current.on('dragend', (e) => {
        const newPos = markerRef.current.getLatLng()
        onMapClick(newPos)
      })

      return () => {
        map.remove()
      }
    }
  }, [])

  // Actualizar posición cuando cambia la prop
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position)
    }
  }, [position])

  return <div ref={mapRef} className="h-full w-full" />
}

export default LeafletMap