"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence,  } from 'framer-motion';
import { FiSearch, FiMenu, FiUser, FiHeart, FiBookmark, FiSettings, FiMap, FiX, FiChevronRight, FiPlus } from 'react-icons/fi';
import { LuTicketCheck } from "react-icons/lu";
import { VscOrganization } from "react-icons/vsc";
import MapWrapper from '../components/home/mapWrapper';
import { useSession } from "next-auth/react";
import LogoutButton from '../components/LogoutBtn';
import LoadingModal from '../components/loadingOverlay';
import EventCardSkeleton from '../components/EventCardSkeleton';


const HomePage = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapButton, setShowMapButton] = useState(true);
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events/get')  
    .then(res => {return res.json()})
    .then(res =>{
      setEvents(res);
      setLoading(false);
      localStorage.setItem('cachedEvents', JSON.stringify(res));
    }).catch((error)=> {
      console.error('Error fetching events:', error);
      const cached = localStorage.getItem('cachedEvents');
      if (cached) {
        setEvents(JSON.parse(cached));
      }
      setLoading(false);
    })
  }, []);
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 relative">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-900 dark:text-white text-gray-700 mr-3 z-20"
          >
            <FiMenu size={20} />
          </button>
          
          <div className="flex-1 relative flex justify-center -left-7.5 z-10">
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
                  <h3 className="font-medium ">{session?.user?.name || "Usuario prueba"}</h3>
                  <p className="text-sm text-gray-500 truncate">{session?.user?.email || "invitado@ejemplo.com"}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                  <FiUser className="mr-3" /> Mi Perfil
                </a>
                <a href="/mis-compras" className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                  <LuTicketCheck className="mr-3" /> Mis compras
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
                {
                  session?.user?.role === "organizer" && (
                    <a href="/events/new" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                      <FiPlus className="mr-3" /> Crear Evento
                    </a>
                  )
                }
                {
                  session?.user?.role != "organizer" && (
                    <a href="/join" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                      <VscOrganization  className="mr-3" /> Convertirse en organizador
                    </a>
                  )
                }
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

      {/* Overlay cargando */}
      { loading && (
        <LoadingModal />
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
                  { loading && (
                    [1,2,3,4,5].map((item)=>(
                      <EventCardSkeleton key={item} id={item} />
                    ))
                  )}
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