"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiStar, FiCalendar, FiMapPin, FiMessageSquare, FiHeart } from 'react-icons/fi';


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
const OrganizerProfile = () => {
    const router = useRouter()
   const { id } = useParams();
    
    let organizer = events.find(e => e.organizer.profile === `/organizer/${id}`);


  const organizerEvents = events.filter(event => event.organizer.profile === `/organizer/${id}`)

    organizer = organizer.organizer

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
          {organizer.name}
        </h1>
      </nav>

      {/* Header del organizador */}
      <div className="px-6 pt-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <img 
              src={organizer.avatar} 
              alt={`Avatar de ${organizer.name}`} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 bg-purple-700 text-white rounded-full p-1 shadow-md">
              <FiStar className="text-sm" />
            </div>
          </div>
          
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{organizer.name}</h2>
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
              <span className="text-gray-600">{organizer.eventsOrganized} eventos</span>
            </div>
            
            <p className="text-gray-600 mt-2 text-sm">Creador de experiencias memorables en Tegucigalpa</p>
          </div>
        </div>
        
        <div className="flex gap-3 mb-6">
          <button className="flex-1 py-2.5 px-4 rounded-xl bg-purple-700 text-white font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-purple-800 transition-colors">
            <FiMessageSquare />
            Contactar
          </button>
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
          {organizerEvents.length > 0 && (
            <button className="text-sm text-purple-700 font-medium">Ver todos</button>
          )}
        </div>
        
        {organizerEvents.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center py-8">
              <FiCalendar className="mx-auto text-3xl text-gray-400 mb-3" />
              <h4 className="text-gray-700 font-medium mb-1">No hay eventos próximos</h4>
              <p className="text-gray-500 text-sm">Este organizador no tiene eventos programados actualmente.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {organizerEvents.slice(0, 3).map(event => (
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