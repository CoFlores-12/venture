"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiUser, FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi';
import { FaGoogle, FaWaze, FaApple } from 'react-icons/fa';
import Link from 'next/link';
import MapWrapperStatic from '@/app/components/mapWrapper';
import ShareButton from '@/app/components/shareEvent';
import { SiUber } from 'react-icons/si';
import ComprarBoletosModal from '@/app/components/orderPlace';
import LoadingModal from '@/app/components/loadingOverlay';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({})
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch("/api/event/"+id)
    .then(res=>{return res.json()})
    .then(res=>{
      const lowestPrice = Math.min(...res.tickets.map(t => t.price));
      res.price= lowestPrice
      setEvent(res);
      setLoading(false)
    })
  }, [])

  
  if( loading) {
    return (
      <LoadingModal />
    )
  }
  
  
  
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Evento no encontrado</h1>
          <p className="text-gray-700 mb-6">Lo sentimos, el evento que buscas no está disponible.</p>
          <Link href="/home" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const [lat, lng] = event.position;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const wazeUrl = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  const appleMapsUrl = `https://maps.apple.com/?q=${lat},${lng}`;
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&client_id=<TU_CLIENT_ID>&pickup=my_location&dropoff[formatted_address]=${event.location}&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;
  const inDriveUrl = `https://indriver.com/`;

  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 dark:text-gray-300">
      {/* Banner superior */}
      <div className="relative">
        <img 
          src={event.banner} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        
        <div className="absolute top-4 left-4">
          <Link href="/home" className="bg-white dark:bg-slate-800 dark:text-gray-300 bg-opacity-90 rounded-full p-2 shadow-md inline-block">
            <FiArrowLeft className="text-gray-800 dark:bg-slate-800 dark:text-gray-300 text-xl" />
          </Link>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
         <ShareButton event={event}/>
          <button className="bg-white  bg-opacity-90 rounded-full p-2 shadow-md dark:bg-slate-800 dark:text-gray-300">
            <FiHeart className="text-gray-800 text-xl dark:bg-slate-800 dark:text-gray-300  " />
          </button>
        </div>
        
        
      </div>

      {/* Contenido principal */}
      <div className="px-4 py-6 -mt-10 relative z-10">
        <div className="bg-white dark:bg-slate-900 dark:text-gray-300 rounded-2xl shadow-lg p-6">
          {/* Categoría y título */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{event.emoji}</span>
              <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                {event.category}
              </span>
            </div>
            <span className="text-sm text-gray-500">{event.distance}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4 dark:bg-slate-900 dark:text-gray-300">{event.title}</h1>
          
          {/* Información del evento */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <FiCalendar className="text-gray-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">{event.date} · {event.time}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FiMapPin className="text-gray-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-medium">{event.location}</p>
                <p className="text-xs text-gray-500 mt-1">Tegucigalpa, Honduras</p>
              </div>
            </div>
            
            {event.price !== "Entrada libre" && (
              <div className="flex items-center">
                <FiDollarSign className="text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="font-medium">L.{event.price}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Descripción */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2  dark:text-gray-300">Descripción del evento</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
          
          {/* Mapa de ubicación */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3  dark:text-gray-300">Ubicación</h2>
            <div className="rounded-xl overflow-hidden h-56 relative bg-gray-100 border border-gray-200">
               
                 <div className='absolute z-10  w-full h-full '>
                    <MapWrapperStatic
                     
                        position={event.position} 
                        location={event.location} 
                    />
                 </div>
                  <div className='w-full h-full bg-[#00000080] absolute z-20'></div>
              {/* Mapa estático - En una app real usarías Google Maps o Mapbox */}
              <div className="absolute inset-0 z-30 w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <FiMapPin className="text-red-500 text-4xl mx-auto mb-2" />
                  <p className="font-medium text-white">{event.location}</p>
                  <p className="text-sm text-white mt-1">Tegucigalpa, Honduras</p>
                </div>
                
                {/* Botones de acción sobre el mapa */}
                
              </div>
            </div>
            <div className="relative flex flex-wrap gap-3 overflow-x-auto max-w-full py-4 justify-center items-center">
                  <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-slate-800 dark:text-gray-300 px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                  >
                    <FaGoogle className="text-purple-500 mr-2" /> Google
                  </a>
                  <a 
                    href={wazeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-slate-800 dark:text-gray-300 px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                  >
                    <FaWaze className="text-purple-600 mr-2" /> Waze
                  </a>
                   <a 
                        href={appleMapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-slate-800 dark:text-gray-300 px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                    >
                        <FaApple className="text-purple-600 mr-2" />
                        <span>Apple</span>
                    </a>
                    <a 
                href={uberUrl} 
                 target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-slate-800 dark:text-gray-300 px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
              >
                <SiUber className="text-black text-xl" />
              </a>
              
              
                </div>
          </div>
          
          {/* Planificador del evento */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3  dark:text-gray-300">Organizado por</h2>
            <Link href={`/organizer/${event.organizer._id}`} className="block">
              <div className="flex items-center p-4 bg-gray-50 dark:bg-slate-800 dark:text-gray-300 rounded-xl hover:bg-purple-50 transition">
                <img 
                  src={event.organizer.foto} 
                  alt={event.organizer.nombre} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-900 dark:bg-slate-800 dark:text-gray-300">{event.organizer.nombre}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(event.organizer.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{event.organizer.rating} ({event.organizer.eventsOrganized} eventos)</span>
                  </div>
                  <p className="mt-2 text-sm text-purple-600 font-medium">
                    Ver perfil del organizador →
                  </p>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Botón de compra */}
          {event.price !== "Entrada libre" ? (
            <div className="sticky bottom-6 z-40 bg-white p-4 dark:bg-slate-800 dark:text-gray-300">
             <ComprarBoletosModal event={event} />

              {event.ticketsAvailable && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  {event.ticketsAvailable} boletos disponibles
                </p>
              )}
            </div>
          ) : (
            <div className="sticky bottom-6 z-40 bg-white p-4">
              <button className="w-full bg-gradient-to-r from-green-600 to-teal-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Confirmar asistencia
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">
                Evento gratuito - Entrada libre
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer de seguridad */}
      <div className="px-4 pb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 dark:bg-slate-900 dark:text-gray-300">
          <h3 className="font-bold text-gray-900 mb-2  dark:text-gray-300">Evento seguro</h3>
          <p className="text-sm text-gray-600">
            Este evento ha sido verificado por nuestro equipo. La información proporcionada es precisa y confiable.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <span className="text-xs text-gray-700">Verificado</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <span className="text-xs text-gray-700">Asistencia confirmada</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <span className="text-xs text-gray-700">Entradas digitales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <EventDetailPage />
    </div>
  );
};

export default App;