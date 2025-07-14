"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence,  } from 'framer-motion';
import { FiSearch, FiCalendar, FiMapPin, FiFilter, FiX, FiStar, FiChevronDown, FiChevronUp, FiChevronLeft  } from 'react-icons/fi';
import EventCardSkeleton from '../components/EventCardSkeleton';
import LoadingModal from '../components/loadingOverlay';

const EventsPage = () => {
    const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState(events);

    useEffect(() => {
      fetch('/api/events/get/all')  
      .then(res => {return res.json()})
      .then(res =>{
        setEvents(res);
        setFilteredEvents(res)
        setLoading(false);
        localStorage.setItem('cachedEventsAll', JSON.stringify(res));
      }).catch((error)=> {
      console.error('Error fetching events:', error);
      const cached = localStorage.getItem('cachedEventsAll');
      if (cached) {
        setEvents(JSON.parse(cached));
      }
      setLoading(false);
    })
    }, []);

  const categories = [...new Set(events.map(event => event.category))];
  
const months = [...new Set(
  events
    .filter(event => new Date(event.date) >= new Date()) // solo eventos próximos
    .map(event => new Date(event.date).toLocaleString('es-HN', { month: 'short' }).toUpperCase())
)];

  
  useEffect(() => {
    let result = [...events];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.location.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategories.length > 0) {
      result = result.filter(event => selectedCategories.includes(event.category));
    }
    
    if (selectedMonths.length > 0) {
      result = result.filter(event => {
        const eventMonth = event.date.split(' ')[1];
        return selectedMonths.includes(eventMonth);
      });
    }
    
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const monthsOrder = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
        const aMonth = a.date.split(' ')[1];
        const bMonth = b.date.split(' ')[1];
        return monthsOrder.indexOf(aMonth) - monthsOrder.indexOf(bMonth);
      }
      if (sortBy === 'distance') {
        return parseFloat(a.distance) - parseFloat(b.distance);
      }
      return 0;
    });
    
    setFilteredEvents(result);
  }, [searchTerm, selectedCategories, selectedMonths, sortBy]);

  // Manejar selección de categorías
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleMonth = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedMonths([]);
    setSortBy('date');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
     
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-md p-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-2 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-900 dark:text-white w-9 h-9"
              aria-label="Regresar"
            >
              <FiChevronLeft className="text-gray-700 text-xl" />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="ml-3 p-2 bg-purple-100 dark:bg-slate-900 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            >
              <FiFilter className="text-xl" />
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
            </p>
            
            {(searchTerm || selectedCategories.length > 0 || selectedMonths.length > 0) && (
              <button 
                onClick={resetFilters}
                className="text-sm text-purple-600 flex items-center"
              >
                <FiX className="mr-1" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4 dark:bg-slate-900">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-300">Filtros</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500"
              >
                <FiX />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center dark:text-gray-300">
                <FiStar className="mr-2 text-purple-600 " /> Categorías
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Filtro por mes */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center dark:text-gray-300">
                <FiCalendar className="mr-2 text-purple-600" /> Fecha
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {months.map(month => (
                  <button
                    key={month}
                    onClick={() => toggleMonth(month)}
                    className={`px-3 py-2 rounded-lg text-center ${
                      selectedMonths.includes(month)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Resultados */}
      <main className="container mx-auto p-4">
        {/* Eventos destacados */}
        {(filteredEvents.filter(e => e.featured).length > 0 || loading) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center dark:text-gray-300">
              <FiStar className="text-yellow-500 mr-2  " /> Eventos destacados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              { loading && (
                    [1,2,3,4].map((item)=>(
                      <EventCardSkeleton key={item} id={item} />
                    ))
                  )}
              {filteredEvents
                .filter(event => event.featured)
                .map(event => (
                  <motion.a 
                    href={`/event/${event._id}`}
                      key={event.id}
                      whileHover={{ y: -5 }}
                      className="min-w-72 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden flex-shrink-0 card hover:shadow-2xl transition-shadow border-1 border-yellow-300"
                    >
                      <figure>
                        <img src={event.banner} alt={event.title} className="h-24 w-full object-cover" />
                      </figure>
                      <div className="card-body">
                        <div className="flex items-center justify-between relative">
                          <span className="badge absolute -top-[100px] badge-primary bg-purple-700 text-white">{event.category}</span>
                          <span className="text-xs absolute -top-[100px] right-0 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Destacado
                          </span>
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
          </section>
        )}

        {/* Overlay cargando */}
        { loading && (
          <LoadingModal />
        )}

        {/* Todos los eventos */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4  dark:text-gray-300">
            {(filteredEvents.filter(e => !e.featured).length > 0 || loading) ? 'Todos los eventos' : 'No se encontraron eventos'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            { loading && (
                    [1,2,3,4].map((item)=>(
                      <EventCardSkeleton key={item} id={item} />
                    ))
                  )}
            {filteredEvents
              .filter(event => !event.featured)
              .map(event => (
                <motion.a 
                    href={`/event/${event._id}`}
                      key={event.id}
                      whileHover={{ y: -5 }}
                      className="min-w-72 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden flex-shrink-0 card hover:shadow-2xl transition-shadow"
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
        </section>
        
        {/* Sin resultados */}
        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No encontramos eventos</h3>
            <p className="text-gray-600 mb-4">Intenta con otros filtros o busca algo diferente</p>
            <button 
              onClick={resetFilters}
              className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Mostrar todos los eventos
            </button>
          </div>
        )}
        
      </main>

      {/* Filtros flotantes para móviles */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
        >
          {showFilters ? <FiX className="text-2xl" /> : <FiFilter className="text-2xl" />}
        </button>
      </div>
    </div>
  );
};

export default EventsPage;