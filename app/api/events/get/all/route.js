export async function GET(req) {
    //data tmp
    const events = [
    {
        id: 1,
        featured: true,
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
        featured: true,
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
    featured: true,
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
    
    //Devolver Todos los eventos activos ---- Agregar el atributo {featured: true} a los eventos Pro
    return Response.json(events);
}