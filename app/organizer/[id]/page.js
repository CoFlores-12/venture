"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiStar, FiCalendar, FiMapPin, FiMessageSquare, FiHeart } from 'react-icons/fi';
import LoadingModal from '@/app/components/loadingOverlay';

const OrganizerProfile = () => {
  const { id } = useParams();
    const [organizer, setOrganizer] = useState({})
    const [loading, setLoading] = useState(true);
  
    useEffect(()=>{
      fetch("/api/users/"+id)
      .then(res=>{return res.json()})
      .then(res=>{
        setOrganizer(res);
        setLoading(false)
      })
    }, [])

  if (!organizer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-700">Organizador no encontrado</h1>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 btn btn-primary bg-purple-700 hover:bg-purple-800 text-white"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

    if( loading) {
    return (
      <LoadingModal />
    )
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Navbar iOS Style */}
      <nav className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200 flex items-center shadow-sm">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 mr-2"
        >
          <FiArrowLeft className="text-gray-800 text-lg" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
          {organizer.nombre}
        </h1>
      </nav>

      {/* Header del organizador */}
      <div className="px-6 pt-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <img 
              src={organizer.foto} 
              alt={`Avatar de ${organizer.nombre}`} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 bg-purple-700 text-white rounded-full p-1 shadow-md">
              <FiStar className="text-sm" />
            </div>
          </div>
          
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{organizer.nombre}</h2>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <FiHeart className="text-lg" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <FiStar className="text-yellow-400 mr-1" />
                <span className="text-gray-900 font-medium">{organizer.rating}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{organizer.organizerEvents.length} eventos</span>
            </div>
            
            <p className="text-gray-600 mt-2 text-sm">{organizer.descripcion}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mb-6">
          <a href={`tel:${organizer.contacto}`} className="flex-1 py-2.5 px-4 rounded-xl bg-purple-700 text-white font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-purple-800 transition-colors">
            <FiMessageSquare />
            Contactar
          </a>
          <button className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-gray-300 font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            <FiHeart />
            Seguir
          </button>
        </div>
      </div>

      {/* Sección de eventos */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Próximos eventos</h3>
          {organizer.organizerEvents.length > 0 && (
            <button className="text-sm text-purple-700 font-medium">Ver todos</button>
          )}
        </div>
        
        {organizer.organizerEvents.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center py-8">
              <FiCalendar className="mx-auto text-3xl text-gray-400 mb-3" />
              <h4 className="text-gray-700 font-medium mb-1">No hay eventos próximos</h4>
              <p className="text-gray-500 text-sm">Este organizador no tiene eventos programados actualmente.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {organizer.organizerEvents.slice(0, 3).map(event => (
              <div 
                key={event.id} 
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <div className="flex gap-3">
                  <img 
                    src={event.banner} 
                    alt={event.title} 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FiMapPin className="mr-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-purple-700">{event.price}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {event.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de reseñas */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Reseñas</h3>
          <button className="text-sm text-purple-700 font-medium">Ver todas</button>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <h4 className="font-medium text-gray-900">María Fernández</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i}
                      className={`text-sm ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400">Hace 2 semanas</span>
          </div>
          <p className="text-gray-700 text-sm">
            Excelente organización en todos sus eventos. La atención al detalle y la calidad de los artistas invitados es siempre impecable.
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <h4 className="font-medium text-gray-900">Carlos Martínez</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i}
                      className={`text-sm ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400">Hace 1 mes</span>
          </div>
          <p className="text-gray-700 text-sm">
            Nunca me decepcionan. Cada evento al que asisto supera mis expectativas. La ubicación, el sonido y la energía son siempre perfectos.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrganizerProfile