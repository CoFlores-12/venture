"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence,  } from 'framer-motion';
import { FiSearch, FiMenu, FiUser, FiHeart, FiBookmark, FiSettings, FiMap, FiX, FiChevronRight, FiPlus } from 'react-icons/fi';
import { VscOrganization } from "react-icons/vsc";
import MapWrapper from '../components/home/mapWrapper';
import { useSession } from "next-auth/react";
import LogoutButton from '../components/LogoutBtn';


const HomePage = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapButton, setShowMapButton] = useState(true);
  const { data: session, status } = useSession();

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


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 relative">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-900 dark:text-white text-gray-700 mr-3"
          >
            <FiMenu size={20} />
          </button>
          
          <div className="flex-1 relative flex justify-center -left-7.5">
            <span className="text-black dark:text-white flex items-end" data-aos="zoom-in">
              <img src="/logo.png" height="30px" width={30} />enture
            </span>
          </div>
        </div>
      </header>

      {/* Menú Lateral */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 text-gray-800 dark:text-white shadow-lg z-30"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold ">Mi Cuenta</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <FiX size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 relative">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 aspect-square rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <FiUser size={20} className="text-purple-700" />
                </div>
                <div className='max-w-[75%]'>
                  <h3 className="font-medium ">Usuario Ejemplo</h3>
                  <p className="text-sm text-gray-500 truncate">{session?.user?.email || "invitado@ejemplo.com"}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                  <FiUser className="mr-3" /> Mi Perfil
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                  <FiHeart className="mr-3" /> Favoritos
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                  <FiBookmark className="mr-3" /> Eventos Guardados
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                  <FiSettings className="mr-3" /> Configuración
                </a>
                <a href="/events/new" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                  <FiPlus className="mr-3" /> Crear Evento
                </a>
                 <a href="/join" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                  <VscOrganization  className="mr-3" /> Convertirse en organizador
                </a>
              </nav>
              <div className="">
                <LogoutButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay del menú */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#00000050] bg-opacity-50 z-20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <main className={`flex-1 ${isMapExpanded ? 'overflow-hidden' : ''}`}>
        {/* Sección de Recomendaciones con scroll horizontal */}
        {!isMapExpanded && (
          <section className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300">Recomendados para ti</h2>
              <button onClick={()=>router.push('/events')} className="text-sm text-purple-600 flex items-center">
                Ver todos <FiChevronRight className="ml-1" />
              </button>
            </div>
            
            <div className="relative">
              <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex space-x-4" style={{ width: `${events.length * 288}px` }}>
                  {events.map(event => (
                    <motion.a 
                    href={`/event/${event.id}`}
                      key={event.id}
                      whileHover={{ y: -5 }}
                      className="w-72 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden flex-shrink-0 card hover:shadow-2xl transition-shadow"
                    >
                      <figure>
                        <img src={event.banner} alt={event.title} className="h-24 w-full object-cover" />
                      </figure>
                      <div className="card-body">
                        <div className="flex items-center justify-between relative">
                          <span className="badge absolute -top-[100px] badge-primary bg-purple-700 text-white">{event.category}</span>
                        </div>
                        <h3 className="card-title truncate">{event.title}</h3>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                            <p className="font-semibold text-purple-700">{event.price}</p>
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mapa Interactivo */}
         <MapWrapper events={events}/>

        {/* Espacio adicional para el scroll en móviles */}
        {!isMapExpanded && <div className="h-20"></div>}
      </main>

      
    </div>
  );
};

export default HomePage;