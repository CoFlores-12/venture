"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence,  } from 'framer-motion';
import { FiSearch, FiMenu, FiUser, FiHeart, FiBookmark, FiSettings, FiMap, FiX, FiChevronRight } from 'react-icons/fi';
import MapWrapper from '../components/home/mapWrapper';


const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapButton, setShowMapButton] = useState(true);

const events = [
  {
    id: 1,
    title: "Festival de Música Electrónica",
    location: "Parque Central",
    date: "04 JUN",
    distance: "1.2 km",
    category: "🎵 Música",
    emoji: "🎧",
    position: [14.1020, -87.2179], // Parque Central de Tegucigalpa
    description: "Festival anual de música electrónica con DJs internacionales en el corazón de la ciudad"
  },
  {
    id: 2,
    title: "Exposición de Arte Moderno",
    location: "Museo para la Identidad Nacional",
    date: "05 JUN",
    distance: "3.5 km",
    category: "🖼️ Arte",
    emoji: "🎨",
    position: [14.0892, -87.2018], // Museo para la Identidad Nacional
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
    position: [14.0945, -87.1910], // Plaza La Merced
    description: "Feria de comida tradicional hondureña con chefs locales e internacionales"
  },
  {
    id: 4,
    title: "Concierto de Jazz",
    location: "Teatro Nacional Manuel Bonilla",
    date: "01 JUL",
    distance: "0.8 km",
    category: "🎵 Música",
    emoji: "🎷",
    position: [14.0996, -87.2065], // Teatro Nacional Manuel Bonilla
    description: "Noche de jazz con la Orquesta Sinfónica Nacional y artistas invitados"
  },
  {
    id: 5,
    title: "Taller de Fotografía",
    location: "Centro Cultural de España en Tegucigalpa",
    date: "11 AGO",
    distance: "1.5 km",
    category: "📸 Taller",
    emoji: "📷",
    position: [14.1002, -87.2043], // Centro Cultural de España
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
    position: [14.0898, -87.1823], // Bulevar Morazán
    description: "Maratón anual 10K con participantes de todo Centroamérica"
  },
  {
    id: 7,
    title: "Feria del Libro",
    location: "Plaza San Martín",
    date: "30 OCT",
    distance: "2.8 km",
    category: "📚 Literatura",
    emoji: "📖",
    position: [14.0957, -87.1891], // Plaza San Martín
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
    position: [14.0978, -87.1935], // Plaza Los Dolores
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
    position: [14.1038, -87.1954], // Barrio La Leona
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
    position: [14.0793, -87.1874], // Parque Naciones Unidas
    description: "Ciclo de cine centroamericano con proyecciones gratuitas"
  }
];


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full bg-gray-100 text-gray-700 mr-3"
          >
            <FiMenu size={20} />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar eventos, lugares..."
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
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
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Mi Cuenta</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <FiX size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <FiUser size={20} className="text-purple-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Usuario Ejemplo</h3>
                  <p className="text-sm text-gray-500">usuario@ejemplo.com</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                  <FiUser className="mr-3" /> Mi Perfil
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                  <FiHeart className="mr-3" /> Favoritos
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                  <FiBookmark className="mr-3" /> Eventos Guardados
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                  <FiSettings className="mr-3" /> Configuración
                </a>
              </nav>
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
              <h2 className="text-xl font-bold text-gray-800">Recomendados para ti</h2>
              <button className="text-sm text-purple-600 flex items-center">
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
                      className="w-72 bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0"
                    >
                      <div className="h-24 bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
                        <span className="text-6xl">{event.emoji}</span>
                      </div>
                      <div className="p-4 relative">
                        
                        <h3 className="font-bold text-gray-800 truncate">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">{event.location}</p>
                        <p className="text-sm text-gray-500 mt-2">{event.date}</p>
                        
                        
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