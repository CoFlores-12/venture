"use client";
import React from 'react';
import { useParams } from 'next/navigation'
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiUser, FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi';
import { FaGoogle, FaWaze, FaApple } from 'react-icons/fa';
import Link from 'next/link';
import MapWrapperStatic from '@/app/components/mapWrapper';
import ShareButton from '@/app/components/shareEvent';
import { SiUber } from 'react-icons/si';

const events = [
  {
    id: 1,
    title: "Festival de Música Electrónica",
    location: "Parque Central",
    date: "04 JUN",
    time: "20:00 - 02:00",
    distance: "1.2 km",
    category: "🎵 Música",
    emoji: "🎧",
    position: [14.1020, -87.2179],
    description: "Festival anual de música electrónica con DJs internacionales en el corazón de la ciudad. Vive una experiencia única con los mejores artistas del género en un ambiente inigualable.",
    price: "Desde L. 450",
    ticketsAvailable: 47,
    organizer: {
      name: "Tegus Music Events",
      profile: "/organizer/tegus-music",
      rating: 4.9,
      eventsOrganized: 28,
      avatar: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    banner: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
  },
  {
    id: 2,
    title: "Exposición de Arte Moderno",
    location: "Museo para la Identidad Nacional",
    date: "05 JUN",
    time: "10:00 - 18:00",
    distance: "3.5 km",
    category: "🖼️ Arte",
    emoji: "🎨",
    position: [14.0892, -87.2018],
    description: "Exposición de artistas hondureños contemporáneos con obras innovadoras que exploran la identidad nacional y las problemáticas sociales actuales.",
    price: "L. 100",
    ticketsAvailable: 120,
    organizer: {
      name: "Cultura Tegus",
      profile: "/organizer/cultura-tegus",
      rating: 4.8,
      eventsOrganized: 42,
      avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    banner: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
  },
  {
    id: 3,
    title: "Feria Gastronómica",
    location: "Plaza La Merced",
    date: "15 JUN",
    time: "11:00 - 21:00",
    distance: "2.1 km",
    category: "🍴 Comida",
    emoji: "🍔",
    position: [14.0945, -87.1910],
    description: "Feria de comida tradicional hondureña con chefs locales e internacionales. Disfruta de platillos típicos como baleadas, sopa de caracol, y nuevos fusiones gastronómicas.",
    price: "Entrada libre",
    ticketsAvailable: null,
    organizer: {
      name: "Sabores de Honduras",
      profile: "/organizer/sabores-hn",
      rating: 4.7,
      eventsOrganized: 15,
      avatar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    banner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
  },
  {
    id: 4,
    title: "Concierto de Jazz",
    location: "Teatro Nacional Manuel Bonilla",
    date: "01 JUL",
    time: "21:30 - 23:30",
    distance: "0.8 km",
    category: "🎵 Música",
    emoji: "🎷",
    position: [14.0996, -87.2065],
    description: "Una noche mágica de jazz con la Orquesta Sinfónica Nacional y artistas invitados internacionales. Disfruta de clásicos del jazz y nuevas composiciones en el histórico Teatro Nacional.",
    price: "Desde L. 350",
    ticketsAvailable: 32,
    organizer: {
      name: "Cultura Tegus",
      profile: "/organizer/cultura-tegus",
      rating: 4.8,
      eventsOrganized: 42,
      avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    banner: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
  },
  {
    id: 5,
    title: "Taller de Fotografía",
    location: "Centro Cultural de España",
    date: "11 AGO",
    time: "15:00 - 18:00",
    distance: "1.5 km",
    category: "📸 Taller",
    emoji: "📷",
    position: [14.1002, -87.2043],
    description: "Taller práctico de fotografía urbana con equipo profesional incluido. Aprende técnicas de composición, iluminación y edición con fotógrafos profesionales.",
    price: "L. 600",
    ticketsAvailable: 8,
    organizer: {
      name: "Artes Visuales HN",
      profile: "/organizer/artes-visuales",
      rating: 4.6,
      eventsOrganized: 12,
      avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    banner: "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
  },
  {
  id: 6,
  title: "Maratón de la Ciudad",
  location: "Bulevar Morazán",
  date: "05 SEP",
  time: "07:00 - 12:00",
  distance: "4.2 km",
  category: "🏃‍♂️ Deporte",
  emoji: "🏅",
  position: [14.0898, -87.1823],
  description: "Maratón anual 10K con participantes de todo Centroamérica. Recorre las principales avenidas de Tegucigalpa en esta carrera que promueve el deporte y la vida saludable.",
  price: "L. 250",
  ticketsAvailable: 120,
  organizer: {
    name: "Deportes Honduras",
    profile: "/organizer/deportes-hn",
    rating: 4.7,
    eventsOrganized: 18,
    avatar: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  banner: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
},
{
  id: 7,
  title: "Feria Internacional del Libro",
  location: "Plaza San Martín",
  date: "30 OCT",
  time: "09:00 - 20:00",
  distance: "2.8 km",
  category: "📚 Literatura",
  emoji: "📖",
  position: [14.0957, -87.1891],
  description: "Feria internacional del libro con autores locales e internacionales. Presentaciones, firmas de libros, talleres literarios y actividades para toda la familia.",
  price: "L. 50",
  ticketsAvailable: 200,
  organizer: {
    name: "Literatura Viva",
    profile: "/organizer/literatura-viva",
    rating: 4.9,
    eventsOrganized: 9,
    avatar: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  banner: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
},
{
  id: 8,
  title: "Festival Nacional de Danza Folklórica",
  location: "Plaza Los Dolores",
  date: "02 NOV",
  time: "18:00 - 22:00",
  distance: "1.7 km",
  category: "💃 Cultura",
  emoji: "👯",
  position: [14.0978, -87.1935],
  description: "Presentación de grupos de danza folklórica de todas las regiones de Honduras. Un colorido espectáculo que celebra nuestras tradiciones y raíces culturales.",
  price: "Entrada libre",
  ticketsAvailable: null,
  organizer: {
    name: "Cultura Nacional",
    profile: "/organizer/cultura-nacional",
    rating: 4.8,
    eventsOrganized: 15,
    avatar: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  banner: "https://images.unsplash.com/photo-1547153760-18fc86324498?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
},
{
  id: 9,
  title: "Mercado Artesanal La Leona",
  location: "Barrio La Leona",
  date: "20 NOV",
  time: "10:00 - 18:00",
  distance: "0.5 km",
  category: "🛍️ Artesanía",
  emoji: "🧵",
  position: [14.1038, -87.1954],
  description: "Mercado de artesanías tradicionales y productos locales. Encuentra textiles, cerámica, café, cacao y otros productos hechos por artesanos hondureños.",
  price: "Entrada libre",
  ticketsAvailable: null,
  organizer: {
    name: "Artesanías de Honduras",
    profile: "/organizer/artesanias-hn",
    rating: 4.6,
    eventsOrganized: 12,
    avatar: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  banner: "https://noticiasncc.com/wp-content/uploads/2021/12/403-10-CULTURA_Mercado-de-la-Ciudadela_Foto-de-Canal-221.jpg"
},
{
  id: 10,
  title: "Cine al Aire Libre: Noche Centroamericana",
  location: "Parque Naciones Unidas",
  date: "17 DIC",
  time: "19:00 - 23:00",
  distance: "3.1 km",
  category: "🎬 Cine",
  emoji: "🎥",
  position: [14.0793, -87.1874],
  description: "Ciclo de cine centroamericano con proyecciones gratuitas bajo las estrellas. Películas premiadas de Honduras, Guatemala, El Salvador, Nicaragua y Costa Rica.",
  price: "Entrada libre",
  ticketsAvailable: null,
  organizer: {
    name: "Cine Tegus",
    profile: "/organizer/cine-tegus",
    rating: 4.5,
    eventsOrganized: 7,
    avatar: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
}
];

const EventDetailPage = () => {
  const { id } = useParams();
  
  const event = events.find(e => e.id === parseInt(id));
  
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
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&client_id=<TU_CLIENT_ID>&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(location)}&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;
  const inDriveUrl = `https://indriver.com/`;
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner superior */}
      <div className="relative">
        <img 
          src={event.banner} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        
        <div className="absolute top-4 left-4">
          <Link href="/home" className="bg-white bg-opacity-90 rounded-full p-2 shadow-md inline-block">
            <FiArrowLeft className="text-gray-800 text-xl" />
          </Link>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
         <ShareButton event={event} />
          <button className="bg-white bg-opacity-90 rounded-full p-2 shadow-md">
            <FiHeart className="text-gray-800 text-xl" />
          </button>
        </div>
        
        
      </div>

      {/* Contenido principal */}
      <div className="px-4 py-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
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
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
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
                  <p className="font-medium">{event.price}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Descripción */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Descripción del evento</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
          
          {/* Mapa de ubicación */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Ubicación</h2>
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
                    className="bg-white px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                  >
                    <FaGoogle className="text-purple-500 mr-2" /> Google
                  </a>
                  <a 
                    href={wazeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                  >
                    <FaWaze className="text-purple-600 mr-2" /> Waze
                  </a>
                   <a 
                        href={appleMapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                    >
                        <FaApple className="text-purple-600 mr-2" />
                        <span>Apple</span>
                    </a>
                    <a 
                href={uberUrl} 
                 target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
              >
                <SiUber className="text-black text-xl" />
              </a>
              
              
                </div>
          </div>
          
          {/* Planificador del evento */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Organizado por</h2>
            <Link href={event.organizer.profile} className="block">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition">
                <img 
                  src={event.organizer.avatar} 
                  alt={event.organizer.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{event.organizer.name}</h3>
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
            <div className="sticky bottom-6 z-40 bg-white p-4">
              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Comprar boletos - {event.price}
              </button>
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
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-2">Evento seguro</h3>
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