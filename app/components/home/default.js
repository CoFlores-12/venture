import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence,  } from 'framer-motion';
import { FiChevronRight, FiCalendar, FiMinimize, FiMaximize } from 'react-icons/fi';
import MapWrapper from '@/app/components/home/mapWrapper';
import LoadingModal from '@/app/components/loadingOverlay';
import EventCardSkeleton from '@/app/components/EventCardSkeleton';
import { useAuthUser } from '@/src/lib/authUsers';
import { subscribePush } from '@/src/lib/registerPush';

const UserHome = ({isMapExpanded, setIsMapExpanded}) => {
  const router = useRouter();
  const { user, loading2 } = useAuthUser();
  subscribePush(user?.id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapButton, setShowMapButton] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events/get/all')  
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

  const toggleMapSize = () => {
    setIsMapExpanded(!isMapExpanded);
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 relative">
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
              {events.length > 0 && (
                <button onClick={() => router.push('/events')} className="text-sm text-purple-600 flex items-center">
                  Ver todos <FiChevronRight className="ml-1" />
                </button>
              )}
            </div>
  
              {loading ? (
                <div className="relative">
                  <div className="overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex space-x-4">
                      {[1,2,3,4,5].map((item) => (
                        <EventCardSkeleton id={item} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : events.length > 0 ? (
                <div className="relative">
                  <div className="overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex space-x-4" style={{ width: `${events.length * 288}px` }}>
                      {events
                      .filter(event => event.featured)
                      .map(event => (
                        <motion.a 
                          href={`/event/${event._id}`}
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
              ) : (
                <div className="text-center py-8">
                  <div className="max-w-md mx-auto">
                  
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No hay eventos recomendados</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Parece que no tenemos recomendaciones personalizadas para ti en este momento.</p>
                    <button 
                      onClick={() => router.push('/events')}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto"
                    >
                      <FiCalendar className="mr-2" />
                      Explorar todos los eventos
                    </button>
                  </div>
                </div>
              )}
            </section>
        )}

         <button
            onClick={toggleMapSize}
            className="fixed bottom-6 right-6 z-20 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            aria-label={isMapExpanded ? 'Reducir mapa' : 'Expandir mapa'}
          >
            {isMapExpanded ? (
              <FiMinimize className="w-5 h-5" />
            ) : (
              <FiMaximize className="w-5 h-5" />
            )}
        </button>

        {/* Mapa Interactivo */}
        <MapWrapper events={events} isMapExpanded={isMapExpanded}/>
        

      </main>

      
    </div>
  );
};

export default UserHome;