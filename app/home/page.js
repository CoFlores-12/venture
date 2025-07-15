"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthUser } from '@/src/lib/authUsers';
import LoadingModal from '@/app/components/loadingOverlay';
import { FiSearch, FiMenu, FiUser, FiHeart, FiX, FiPlus,  FiHome, FiBarChart2 } from 'react-icons/fi';
import { LuTicketCheck } from "react-icons/lu";
import LogoutButton from '@/app/components/LogoutBtn';
import OrganizerDashboard from '../components/home/organizer/home';
import UserHome from '../components/home/default';
import { VscOrganization } from "react-icons/vsc";

const HomePage = () => {
  const { user, loading: authLoading } = useAuthUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('default');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      setView(user.rol === 'organizer' ? 'dashboard' : 'default');
      setLoading(false);
    }
  }, [user]);

  if (authLoading || loading) {
    return <LoadingModal />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Header compartido */}
      {!isMapExpanded && (
        <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-900 dark:text-white text-gray-700 mr-3 z-20"
          >
            <FiMenu size={20} />
          </button>
          
          <div className={`flex-1 relative flex justify-center ${user?.rol === 'organizer' ? "" : "-left-7.5"} z-10`}>
            <span className="text-black dark:text-white flex items-end" data-aos="zoom-in">
              <img src="/logo.png" height="30px" width={30} />enture
            </span>
          </div>

          {/* Toggle para organizadores */}
        {user?.rol === 'organizer' && (
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 rounded-full p-1">
            <button
              onClick={() => setView('default')}
              className={`p-2 rounded-full ${view === 'default' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}
              title="Vista normal"
            >
              <FiHome className={view === 'default' ? 'text-purple-600' : 'text-gray-500'} />
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`p-2 rounded-full ${view === 'dashboard' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}
              title="Dashboard organizador"
            >
              <FiBarChart2 className={view === 'dashboard' ? 'text-purple-600' : 'text-gray-500'} />
            </button>
          </div>
        )}
        </div>
      </header>
      )}

      {/* Sidebar compartido */}
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
                      { (!user?.image || user?.image === "") ? (
                        <div className="w-12 h-12 aspect-square rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <FiUser size={20} className="text-purple-700" />
                        </div>
                      ) : (
                        <img src={user?.image} className="w-12 h-12 aspect-square rounded-full bg-purple-100 flex items-center justify-center mr-3" />
                     
                      )}
                      <div className='max-w-[75%]'>
                        <h3 className="font-medium ">{user?.name || "Usuario prueba"}</h3>
                        <p className="text-sm text-gray-500 truncate">{user?.email || "invitado@ejemplo.com"}</p>
                      </div>
                    </div>
                    
                    <nav className="space-y-2">
                      <a href="/profile" className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                        <FiUser className="mr-3" /> Mi Perfil
                      </a>
                      <a href="/mis-compras" className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                        <LuTicketCheck className="mr-3" /> Mis compras
                      </a>
                      <a href="/favoritos" className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                        <FiHeart className="mr-3" /> Favoritos
                      </a>
                      
                      {
                        user?.rol === "organizer" && (
                          <a href="/events/new" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                            <FiPlus className="mr-3" /> Crear Evento
                          </a>
                        )
                      }
                      {
                        user?.rol != "organizer" && (
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

      {/* Contenido principal con animación */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: view === 'dashboard' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === 'dashboard' ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {view === 'default' ? (
              <UserHome isMapExpanded={isMapExpanded} setIsMapExpanded={setIsMapExpanded} />
            ) : (
              <OrganizerDashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HomePage;