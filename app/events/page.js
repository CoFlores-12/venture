"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiCalendar, FiMapPin, FiFilter, FiX, FiStar, FiChevronDown, FiChevronUp, FiChevronLeft  } from 'react-icons/fi';

const EventsPage = () => {
    const router = useRouter()
  const events = [
    {
      id: 1,
      title: "Festival de Música Electrónica",
      location: "Parque Central",
      date: "04 JUN",
      distance: "1.2 km",
      category: "🎵 Música",
      emoji: "🎧",
      position: [14.1020, -87.2179],
      description: "Festival anual de música electrónica con DJs internacionales en el corazón de la ciudad",
      featured: true
    },
    {
      id: 2,
      title: "Exposición de Arte Moderno",
      location: "Museo para la Identidad Nacional",
      date: "05 JUN",
      distance: "3.5 km",
      category: "🖼️ Arte",
      emoji: "🎨",
      position: [14.0892, -87.2018],
      description: "Exposición de artistas hondureños contemporáneos con obras innovadoras"
    },
    {
      id: 3,
      title: "Feria Gastronómica",
      location: "Plaza La Merced",
      date: "15 JUN",
      distance: "2.1 km",
      category: "🍴 Comida",
      emoji: "🍔",
      position: [14.0945, -87.1910],
      description: "Feria de comida tradicional hondureña con chefs locales e internacionales",
      featured: true
    },
    {
      id: 4,
      title: "Concierto de Jazz",
      location: "Teatro Nacional Manuel Bonilla",
      date: "01 JUL",
      distance: "0.8 km",
      category: "🎵 Música",
      emoji: "🎷",
      position: [14.0996, -87.2065],
      description: "Noche de jazz con la Orquesta Sinfónica Nacional y artistas invitados"
    },
    {
      id: 5,
      title: "Taller de Fotografía",
      location: "Centro Cultural de España",
      date: "11 AGO",
      distance: "1.5 km",
      category: "📸 Taller",
      emoji: "📷",
      position: [14.1002, -87.2043],
      description: "Taller práctico de fotografía urbana con equipo profesional incluido"
    },
    {
      id: 6,
      title: "Maratón de la Ciudad",
      location: "Bulevar Morazán",
      date: "05 SEP",
      distance: "4.2 km",
      category: "🏃‍♂️ Deporte",
      emoji: "🏅",
      position: [14.0898, -87.1823],
      description: "Maratón anual 10K con participantes de todo Centroamérica",
      featured: true
    },
    {
      id: 7,
      title: "Feria del Libro",
      location: "Plaza San Martín",
      date: "30 OCT",
      distance: "2.8 km",
      category: "📚 Literatura",
      emoji: "📖",
      position: [14.0957, -87.1891],
      description: "Feria internacional del libro con autores locales e internacionales"
    },
    {
      id: 8,
      title: "Festival de Danza Folklórica",
      location: "Plaza Los Dolores",
      date: "02 NOV",
      distance: "1.7 km",
      category: "💃 Cultura",
      emoji: "👯",
      position: [14.0978, -87.1935],
      description: "Presentación de grupos de danza folklórica de todas las regiones de Honduras"
    },
    {
      id: 9,
      title: "Mercado Artesanal",
      location: "Barrio La Leona",
      date: "20 NOV",
      distance: "0.5 km",
      category: "🛍️ Artesanía",
      emoji: "🧵",
      position: [14.1038, -87.1954],
      description: "Mercado de artesanías tradicionales y productos locales"
    },
    {
      id: 10,
      title: "Proyección de Cine al Aire Libre",
      location: "Parque Naciones Unidas",
      date: "17 DIC",
      distance: "3.1 km",
      category: "🎬 Cine",
      emoji: "🎥",
      position: [14.0793, -87.1874],
      description: "Ciclo de cine centroamericano con proyecciones gratuitas"
    }
  ];

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [filteredEvents, setFilteredEvents] = useState(events);

  // Categorías únicas
  const categories = [...new Set(events.map(event => event.category))];
  
  // Meses únicos
  const months = [...new Set(events.map(event => event.date.split(' ')[1]))];
  
  // Función para filtrar eventos
  useEffect(() => {
    let result = [...events];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.location.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categorías seleccionadas
    if (selectedCategories.length > 0) {
      result = result.filter(event => selectedCategories.includes(event.category));
    }
    
    // Filtrar por meses seleccionados
    if (selectedMonths.length > 0) {
      result = result.filter(event => {
        const eventMonth = event.date.split(' ')[1];
        return selectedMonths.includes(eventMonth);
      });
    }
    
    // Ordenar resultados
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

  // Manejar selección de meses
  const toggleMonth = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  // Resetear todos los filtros
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedMonths([]);
    setSortBy('date');
  };

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="sticky top-0 z-10 bg-white shadow-md p-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-2 flex items-center justify-center rounded-full bg-gray-100 w-9 h-9"
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
              className="ml-3 p-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
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
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500"
              >
                <FiX />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <FiStar className="mr-2 text-purple-600" /> Categorías
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Filtro por mes */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <FiCalendar className="mr-2 text-purple-600" /> Meses
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {months.map(month => (
                  <button
                    key={month}
                    onClick={() => toggleMonth(month)}
                    className={`px-3 py-2 rounded-lg text-center ${
                      selectedMonths.includes(month)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Ordenar por */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <FiChevronDown className="mr-2 text-purple-600" /> Ordenar por
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setSortBy('date')}
                  className={`px-4 py-2 rounded-lg ${
                    sortBy === 'date'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Fecha
                </button>
                <button
                  onClick={() => setSortBy('distance')}
                  className={`px-4 py-2 rounded-lg ${
                    sortBy === 'distance'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Distancia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <main className="container mx-auto p-4">
        {/* Eventos destacados */}
        {filteredEvents.filter(e => e.featured).length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiStar className="text-yellow-500 mr-2" /> Eventos destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents
                .filter(event => event.featured)
                .map(event => (
                  <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-300">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-3xl">{event.emoji}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Destacado
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">{event.title}</h3>
                      <div className="flex items-center text-gray-600 mt-2">
                        <FiCalendar className="mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <FiMapPin className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {event.category}
                        </span>
                        <span className="text-sm text-gray-500">{event.distance}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Todos los eventos */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {filteredEvents.filter(e => !e.featured).length > 0 ? 'Todos los eventos' : 'No se encontraron eventos'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents
              .filter(event => !event.featured)
              .map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <span className="text-3xl">{event.emoji}</span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {event.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 mt-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                      <span className="text-xs text-gray-500">{event.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
        
        {/* Sin resultados */}
        {filteredEvents.length === 0 && (
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