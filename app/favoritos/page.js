"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiUser, FiHeart, FiX, FiPlus, FiHome, FiBarChart2 } from 'react-icons/fi';
import { LuTicketCheck } from "react-icons/lu";
import { VscOrganization } from "react-icons/vsc";
import { useAuthUser } from '@/src/lib/authUsers';
import LogoutButton from '@/app/components/LogoutBtn';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavoritosPage() {
  const [mostLikedEvents, setMostLikedEvents] = useState([]);
  const [mostLikedOrganizers, setMostLikedOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading: authLoading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/likes/most-liked")
      .then((res) => res.json())
      .then((data) => {
        setMostLikedEvents(data.mostLikedEvents || []);
        setMostLikedOrganizers(data.mostLikedOrganizers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (authLoading) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      {/* Header compartido */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-900 dark:text-white text-gray-700 mr-3 z-20"
          >
            <FiMenu size={20} />
          </button>
          <div className={`flex-1 relative flex justify-center z-10`}>
            <span className="text-black dark:text-white flex items-end" data-aos="zoom-in">
              <img src="/logo.png" height="30px" width={30} />enture
            </span>
          </div>
        </div>
      </header>
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
                {user?.rol === "organizer" && (
                  <a href="/events/new" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                    <FiPlus className="mr-3" /> Crear Evento
                  </a>
                )}
                {user?.rol != "organizer" && (
                  <a href="/join" className="flex items-center p-3 rounded-lg  hover:bg-purple-50 hover:text-purple-600">
                    <VscOrganization  className="mr-3" /> Convertirse en organizador
                  </a>
                )}
              </nav>
              <div className="">
                <LogoutButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Contenido principal */}
      <main className="flex-1">
        <div className="min-h-screen bg-whitepy-8 px-4">
          {/* Back Button */}
          <button
            onClick={() => router.push('/home')}
            className="mb-6 flex items-center text-purple-700 hover:text-purple-900 font-medium"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            Volver al inicio
          </button>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Favoritos</h1>
            {/* Most Liked Events Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">Eventos más gustados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="favoritos-eventos">
                {loading ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 text-center text-gray-500 col-span-2">Cargando...</div>
                ) : mostLikedEvents.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 text-center text-gray-500 col-span-2">No hay eventos favoritos aún.</div>
                ) : (
                  mostLikedEvents.map(({ event, likeCount }) => (
                    <div key={event._id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col gap-2">
                      <img src={event.banner} alt={event.title} className="w-full h-40 object-cover rounded-lg mb-2" />
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">{event.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{event.location} &middot; {event.date}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-purple-700 font-semibold">{likeCount} Me gusta</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
            {/* Most Liked Organizers Section */}
            <section>
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">Creadores de eventos más gustados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="favoritos-organizadores">
                {loading ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 text-center text-gray-500 col-span-2">Cargando...</div>
                ) : mostLikedOrganizers.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 text-center text-gray-500 col-span-2">No hay organizadores favoritos aún.</div>
                ) : (
                  mostLikedOrganizers.map(({ user, likeCount }) => (
                    <div key={user._id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col gap-2 items-center">
                      <img src={user.foto || "/logo.png"} alt={user.nombre} className="w-20 h-20 object-cover rounded-full mb-2 border-2 border-purple-200" />
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">{user.nombre}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{user.correo}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-purple-700 font-semibold">{likeCount} Me gusta</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 