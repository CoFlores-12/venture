"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

const features = [
  {icon: '🔔', title: 'Notificaciones', desc: 'Recibe alertas cuando tus artistas favoritos están en tu ciudad'},
  {icon: '📍', title: 'Ubicación en tiempo real', desc: 'Encuentra eventos cerca de ti con nuestro sistema de geolocalización'},
  {icon: '🎟️', title: 'Entradas digitales', desc: 'Compra y almacena tus entradas directamente en la app'},
  {icon: '📱', title: 'App PWA', desc: 'Funciona sin internet y se instala en cualquier dispositivo'},
  {icon: '👥', title: 'Comparte con amigos', desc: 'Invita amigos y coordina planes para eventos'},
  {icon: '⭐', title: 'Favoritos', desc: 'Guarda tus eventos favoritos y recibe actualizaciones'}
];

const EventAppLanding = () => {
  const router = useRouter()
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <nav className="navbar bg-base-200 bg-opacity-20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1">
            <a className="btn btn-ghost text-xl scale-110">
              <span className="text-black dark:text-white flex items-end" data-aos="zoom-in">
                <img src="/logo.png" height="40px" width={40} />enture
              </span>
            </a>
          </div>

          {/* Menú para pantallas grandes */}
          <div className="hidden md:flex">
            <ul className="menu menu-horizontal px-1 text-black dark:text-white">
              <li>
                <button
                  onClick={() => router.push('/register')}
                  className="btn bg-purple-700 ml-4 text-white"
                >
                  Empezar
                </button>
              </li>
            </ul>
          </div>

          {/* Menú para móviles */}
          <div className="dropdown dropdown-end md:hidden">
            <label tabIndex={0} className="btn btn-ghost text-black dark:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 text-black dark:text-white">
              <li>
                <button
                  onClick={() => router.push('/register')}
                  className="btn bg-purple-700 text-white mt-2"
                >
                  Empezar
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>


      <section className="py-20 px-4 relative overflow-hidden min-h-[80vh] flex items-center">
  {/* Efectos de fondo mejorados */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
    <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-purple-600 opacity-20 blur-3xl animate-float-slow"></div>
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-pink-600 opacity-20 blur-3xl animate-float"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-purple-900/30 to-transparent opacity-30"></div>
  </div>
  
  <div className="container mx-auto relative z-10">
    <div className="max-w-2xl mx-auto text-center" data-aos="fade-up">
      {/* Badge de destacado */}
      <div className="inline-flex items-center px-4 py-2 bg-purple-900/50 backdrop-blur-sm rounded-full border border-purple-700/50 mb-6">
        <span className="relative flex h-3 w-3 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
        </span>
        <span className="text-sm font-medium text-purple-200">¡Nueva actualización disponible!</span>
      </div>

      {/* Título principal con gradiente animado */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-pink-300 animate-text-shimmer bg-[length:200%_100%]">
          Encuentra los mejores <span className="text-[#f76a12]">eventos</span> cerca de ti
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Descubre experiencias únicas en tu ciudad con nuestra plataforma inteligente que aprende de tus gustos
      </p>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button 
          onClick={() => router.push('/events')} 
          className="btn btn-lg bg-purple-600 hover:bg-purple-700 border-0 text-white rounded-full px-8 shadow-lg hover:shadow-purple-500/30 transition-all group"
        >
          <span className="group-hover:scale-105 transition-transform block">Explorar Eventos</span>
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
        
      
      </div>

      {/* Tarjeta flotante de evento destacado */}
     

      {/* Testimonios y ratings */}
      <div className="mt-16 flex flex-col items-center" data-aos="fade-up" data-aos-delay="400">
        <div className="flex -space-x-3 mb-4">
          {[1,2,3,4,5].map((i) => (
            <img 
              key={i}
              src={`/user.webp`}
              className="w-10 h-10 rounded-full border-2 border-purple-900 bg-purple-950 hover:scale-110 transition-transform"
              alt={`Usuario ${i}`}
            />
          ))}
        </div>
        <div className="text-center">
          <div className="flex justify-center items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="ml-2 font-medium">5.0</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">Más de 1,000 reseñas en la App</p>
        </div>
      </div>
    </div>
  </div>

  {/* Efecto de partículas (opcional) */}
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div 
        key={i}
        className="absolute rounded-full bg-purple-500/20"
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 10 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      ></div>
    ))}
  </div>
</section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Vive experiencias <span className="text-purple-400">inolvidables</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Descubre cómo Venture transforma tu forma de encontrar y disfrutar eventos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 hover:border-purple-500/30 transition-all"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
                <div className="relative z-10 p-8 h-full flex flex-col">
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 flex-grow">{feature.desc}</p>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16"  data-aos="fade-up">Explora por categorías</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {name: 'Conciertos', icon: '🎤', color: 'from-pink-500 to-purple-600'},
              {name: 'Festivales', icon: '🎪', color: 'from-green-500 to-teal-600'},
              {name: 'Fiestas', icon: '🎉', color: 'from-yellow-500 to-orange-600'},
              {name: 'Deportes', icon: '⚽', color: 'from-blue-500 to-indigo-600'},
              {name: 'Teatro', icon: '🎭', color: 'from-red-500 to-pink-600'},
              {name: 'Conferencias', icon: '🎓', color: 'from-purple-500 to-indigo-700'},
              {name: 'Exposiciones', icon: '🖼️', color: 'from-teal-500 to-cyan-600'},
              {name: 'Ferias', icon: '🎡', color: 'from-orange-500 to-red-600'}
            ].map((category, index) => (
              <div key={index} 
              className="card bg-base-200 shadow-xl overflow-hidden"
              data-aos="zoom-in"
              data-aos-delay={index * 100} // animación escalonada
              data-aos-duration="800">
                <div className={`bg-gradient-to-r ${category.color} p-6 flex flex-col items-center justify-center h-40`}>
                  <span className="text-5xl mb-2">{category.icon}</span>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-gradient-to-r from-pink-600 to-purple-700"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6 text-white">
            ¡No te pierdas ningún evento!
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
            Descarga nuestra app PWA y recibe notificaciones sobre los eventos más relevantes en tu ciudad
          </p>
        </div>
      </section>


      <footer className="footer p-10 bg-base-200 text-base-content">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="footer-title">
                <span className="text-black dark:text-white  flex flex-row items-end"><img src='/logo.png' width={30} height={'40px'}/>enture</span>
               
              </span> 
              <p className="text-gray-300">
                La mejor app para descubrir eventos en tu ciudad
              </p>
              <div className="flex gap-4 mt-4">
                <a className="btn btn-circle btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a className="btn btn-circle btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>
                <a className="btn btn-circle btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </div> 
            <div className='flex flex-col'>
              <span className="footer-title">Enlaces</span> 
              <a className="link link-hover">Acerca de nosotros</a> 
              <a className="link link-hover">Contacto</a> 
              <a className="link link-hover">Eventos destacados</a> 
              <a className="link link-hover">Promociones</a>
            </div> 
            <div className='flex flex-col'>
              <span className="footer-title">Legal</span> 
              <a className="link link-hover">Términos de uso</a> 
              <a className="link link-hover">Política de privacidad</a> 
              <a className="link link-hover">Política de cookies</a>
            </div> 
            <div className='flex flex-col'>
              
            </div>
          </div>
        </div>
      </footer>
      <div className="bg-base-300 text-center py-4 text-gray-400">
        <p>© 2023 Venture. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default EventAppLanding;