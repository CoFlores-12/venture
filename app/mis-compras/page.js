"use client"
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaDownload, FaPrint, FaShareAlt } from 'react-icons/fa';
import { FaGoogle, FaWaze, FaApple } from 'react-icons/fa';
import { SiUber } from 'react-icons/si';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { FiMenu, FiUser, FiHeart, FiX, FiPlus, FiHome, FiBarChart2, FiArrowLeft } from 'react-icons/fi';
import { LuTicketCheck } from "react-icons/lu";
import { VscOrganization } from "react-icons/vsc";
import { useAuthUser } from '@/src/lib/authUsers';
import LogoutButton from '@/app/components/LogoutBtn';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const MyTickets = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading: authLoading } = useAuthUser();

  useEffect(() => {
  const loadPurchases = async () => {
    try {
      const res = await fetch("/api/purchase/purchaseUser/");
      if (!res.ok) throw new Error("Error en la respuesta");
      const data = await res.json();

      // Guardar en localStorage
      localStorage.setItem("purchase", JSON.stringify(data));
      setTickets(data);
    } catch (error) {
      console.warn("No se pudo obtener desde la API, usando localStorage:", error);

      // Intentar cargar desde localStorage
      const purchases = JSON.parse(localStorage.getItem("purchase")) || [];
      
      if (purchases.length === 0) {
        setTickets(mockEvents); // datos falsos o alternativos
      } else {
        setTickets(purchases);
      }
    } finally {
      setLoading(false);
    }
  };

  loadPurchases();
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-HN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-HN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterTickets = () => {
    const today = new Date();
    
    switch(activeTab) {
      case 'upcoming':
        return tickets.filter(ticket => new Date(ticket.date) > today);
      case 'past':
        return tickets.filter(ticket => new Date(ticket.date) < today);
      default:
        return tickets;
    }
  };

  const filteredTickets = filterTickets();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Cargando tus boletos...</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return null;
  }

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header compartido */}
        <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20 w-full">
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
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <FaTicketAlt className="text-5xl text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Aún no tienes boletos</h1>
          <p className="text-gray-600 mb-6">
            Parece que aún no has comprado boletos para ningún evento. Explora nuestros eventos disponibles y encuentra el tuyo.
          </p>
          <a 
            href='/home'
            className="bg-purple-700 text-white py-2 px-6 rounded-lg hover:bg-purple-800 transition"
          >
            Ver eventos
          </a>
          </div>
        </div>
      </div>
    );
  }

  const generateToken = (id, quan) => {
    const data = {
      id,
      boletos: quan
    }
    const encryptedId = CryptoJS.AES.encrypt(JSON.stringify(data), "QRCODE").toString();
    return encryptedId
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header compartido */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20 w-full">
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
      <div className="max-w-4xl mx-auto">
        {/* Back to Profile Link */}
        <div className="mb-4 mt-4 ml-4">
          <button
            onClick={() => router.back()}
            className="bg-white dark:bg-slate-800 dark:text-gray-300 bg-opacity-90 rounded-full p-2 shadow-md inline-block"
          >
            <FiArrowLeft className="text-gray-800 dark:bg-slate-800 dark:text-gray-300 text-xl" />
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Mis Boletos
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Gestiona todos tus boletos comprados en un solo lugar
          </p>
        </div>

        {/* Filtros */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'upcoming' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'past' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Pasados
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {filteredTickets.map((ticket, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                {/* Sección QR */}
                <div className="md:w-1/3 bg-gradient-to-br from-purple-700 to-indigo-800 p-8 flex flex-col items-center justify-center">
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white bg-opacity-20 mb-4">
                      <img src='/logo.png' width={"20px"}/>
                    </div>
                    <h2 className="text-lg font-semibold text-white">Tu entrada digital</h2>
                    <p className="text-purple-200 text-sm mt-1">
                      Escanea este código en la entrada
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <QRCodeSVG 
                      value={ticket.token}
                      size={180}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  
                  <div className="mt-6 text-center text-white text-sm">
                    <p className="font-medium">{ticket.typeTicket}</p>
                    <p className="text-purple-200">x{ticket.ticketQuantity}</p>
                  </div>
                </div>
                
                {/* Información del evento */}
                <div className="md:w-2/3 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{ticket.eventName}</h2>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {ticket.status === 'used' ? 'Usado' : 'Confirmado'}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Compra: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4 col-span-2 md:col-span-1">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-2 text-purple-600" />
                          Fecha
                        </h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {formatDate(ticket.date)}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaClock className="mr-2 text-purple-600" />
                          Hora
                        </h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {formatTime(ticket.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 col-span-2 md:col-span-1">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-purple-600" />
                          Lugar
                        </h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {ticket.location}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaUser className="mr-2 text-purple-600" />
                          Asistentes
                        </h3>
                        <div className="mt-1">
                          <div className="flex -space-x-2">
                            {Array.from({ length: ticket.ticketQuantity }).map((_, i) => (
                              <div key={i} className=" h-10 w-10 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-800 font-medium">
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                     <div className="relative col-span-2 flex flex-wrap gap-3 overflow-x-auto max-w-full py-4 justify-center items-center">
                                      <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${ticket.position[0] || ""},${ticket.position[1] || ""}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-white dark:bg-slate-800 dark:text-gray-300 px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                                      >
                                        <FaGoogle className="text-purple-500 mr-2" /> Google
                                      </a>
                                      <a 
                                        href={`https://www.waze.com/ul?ll=${ticket.position[0] || ""},${ticket.position[1] || ""}&navigate=yes`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-white dark:bg-slate-800 dark:text-gray-300 px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                                      >
                                        <FaWaze className="text-purple-600 mr-2" /> Waze
                                      </a>
                                       <a 
                                            href={`https://maps.apple.com/?q=${ticket.position[0] || ""},${ticket.position[1] || ""}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="bg-white dark:bg-slate-800 dark:text-gray-300 px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                                        >
                                            <FaApple className="text-purple-600 mr-2" />
                                            <span>Apple</span>
                                        </a>
                                        <a 
                                    href={`https://m.uber.com/ul/?action=setPickup&client_id=<TU_CLIENT_ID>&pickup=my_location&dropoff[formatted_address]=${ticket.eventName}&dropoff[latitude]=${ticket.position[0] || ""}&dropoff[longitude]=${ticket.position[1] || ""}`} 
                                     target="_blank" 
                                            rel="noopener noreferrer"
                                            className="bg-white dark:bg-slate-800 dark:text-gray-300 px-4 py-2 rounded-full shadow-md flex items-center text-sm font-medium hover:bg-gray-50"
                                  >
                                    <SiUber className="text-black text-xl" />
                                  </a>
                                  
                                  
                                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la compra</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div>
                        <p className="text-sm text-gray-500">Transacción</p>
                        <p className="text-sm font-medium text-gray-900 break-all">{ticket._id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-sm font-medium text-gray-900">L {ticket.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
              <FaTicketAlt className="text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes boletos {activeTab === 'upcoming' ? 'próximos' : 'pasados'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'upcoming' 
                ? 'Compra boletos para eventos futuros para verlos aquí.' 
                : 'Tus eventos pasados aparecerán aquí después de asistir a un evento.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;