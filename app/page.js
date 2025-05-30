import React from 'react';

const EventAppLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <nav className="navbar bg-base-200 bg-opacity-20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex flex-row items-center justify-between">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl scale-110">
              
              <span className="text-black dark:text-white"><span className="text-purple-700">V</span>enture</span>
            </a>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 hidden md:flex text-black dark:text-white">
              <li><a>Características</a></li>
              <li><a>Eventos</a></li>
              <li> <button className="btn bg-purple-700 ml-4 text-white">Empezar</button></li>
            </ul>
           
          </div>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Encuentra los mejores eventos cerca de ti
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Conciertos, fiestas, festivales y más. Todo en una sola aplicación.
            </p>
            <div className="flex flex-wrap gap-4">
            
              <button className="btn btn-outline btn-lg">
                Explorar Eventos
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="mockup-phone border-primary">
              <div className="camera"></div> 
              <div className="display">
                <div className="artboard artboard-demo phone-1 bg-gray-900">
                  <div className="flex flex-col h-full">
                    <div className="bg-gradient-to-r from-pink-600 to-purple-700 p-4">
                      <h2 className="text-xl font-bold text-white">Eventos Cercanos</h2>
                    </div>
                    <div className="overflow-auto p-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="card card-side bg-base-200 shadow-xl mb-4">
                          <figure className="w-1/3">
                            <div className="bg-gray-600 w-full h-full flex items-center justify-center">
                              <span className="text-4xl">🎵</span>
                            </div>
                          </figure>
                          <div className="card-body p-4 w-2/3 text-black dark:text-white">
                            <h3 className="card-title">Concierto de Verano</h3>
                            <p className="text-sm">Hoy, 20:00</p>
                            <p className="text-xs">Plaza Central</p>
                            <div className="badge badge-primary mt-2">2 km</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 bg-opacity-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Por qué elegir EventFinder?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              La mejor aplicación para descubrir eventos cerca de ti con funciones diseñadas para amantes de la diversión
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {icon: '🔔', title: 'Notificaciones', desc: 'Recibe alertas cuando tus artistas favoritos están en tu ciudad'},
              {icon: '📍', title: 'Ubicación en tiempo real', desc: 'Encuentra eventos cerca de ti con nuestro sistema de geolocalización'},
              {icon: '🎟️', title: 'Entradas digitales', desc: 'Compra y almacena tus entradas directamente en la app'},
              {icon: '📱', title: 'App PWA', desc: 'Funciona sin internet y se instala en cualquier dispositivo'},
              {icon: '👥', title: 'Comparte con amigos', desc: 'Invita amigos y coordina planes para eventos'},
              {icon: '⭐', title: 'Favoritos', desc: 'Guarda tus eventos favoritos y recibe actualizaciones'}
            ].map((feature, index) => (
              <div key={index} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body items-center text-center text-black dark:text-white">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="card-title text-2xl mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Explora por categorías</h2>
          
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
              <div key={index} className="card bg-base-200 shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${category.color} p-6 flex flex-col items-center justify-center h-40`}>
                  <span className="text-5xl mb-2">{category.icon}</span>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                </div>
                <div className="card-body p-4 text-center">
                  <button className="btn btn-outline btn-sm text-black dark:text-white">Ver eventos</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-700">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">¡No te pierdas ningún evento!</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Descarga nuestra app PWA y recibe notificaciones sobre los eventos más relevantes en tu ciudad
          </p>
          
          
        </div>
      </section>

      <footer className="footer p-10 bg-base-200 text-base-content">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="footer-title">
                <span className="text-black dark:text-white"><span className="text-purple-700">V</span>enture</span>
               
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
              <span className="footer-title">Newsletter</span> 
              <div className="form-control w-80">
                <label className="label">
                  <span className="label-text text-gray-300">Recibe noticias sobre eventos</span>
                </label> 
                <div className="relative">
                  <input type="text" placeholder="tu@email.com" className="input input-bordered w-full pr-16 text-gray-800" /> 
                  <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Suscribirme</button>
                </div>
              </div>
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