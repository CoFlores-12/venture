"use client"
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaDownload, FaPrint, FaShareAlt } from 'react-icons/fa';
import { FaGoogle, FaWaze, FaApple } from 'react-icons/fa';
import { SiUber } from 'react-icons/si';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Simulamos datos de eventos
  const mockEvents = [
    {
      id: 'evt-001',
      eventName: "Festival de Música Nacional 2023",
      date: "2023-11-15T19:00:00",
      venue: "Estadio Nacional, Tegucigalpa",
      ticketType: "VIP - Frente al Escenario",
      price: 1200,
      quantity: 2,
      purchaseDate: "2023-10-10T14:30:00",
      transactionId: "TXN-789456123",
      paymentMethod: "paypal",
      status: "confirmed",
      position: [14.1020, -87.2179]
    },
    {
      id: 'evt-002',
      eventName: "Conferencia de Tecnología HN",
      date: "2023-12-05T09:00:00",
      venue: "Centro de Convenciones, San Pedro Sula",
      ticketType: "Acceso General",
      price: 500,
      quantity: 1,
      purchaseDate: "2023-10-08T10:15:00",
      transactionId: "TXN-321654987",
      paymentMethod: "card",
      status: "confirmed",
      position: [14.1020, -87.2179]
    },
    {
      id: 'evt-003',
      eventName: "Exposición de Arte Contemporáneo",
      date: "2023-10-25T16:00:00",
      venue: "Museo de Arte, Comayagüela",
      ticketType: "Entrada Doble",
      price: 300,
      quantity: 2,
      purchaseDate: "2023-10-05T16:45:00",
      transactionId: "TXN-147258369",
      paymentMethod: "efectivo",
      status: "used",
      position: [14.1020, -87.2179]
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      // Intentar cargar desde localStorage
      let purchases = [];
      
      
      
      // Combinar con eventos de muestra si no hay compras
      if (purchases.length === 0) {
        setTickets(mockEvents);
      } else {
        setTickets([...purchases, ...mockEvents]);
      }
      
      setLoading(false);
    }, 1200);
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

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
                      value={JSON.stringify({
                        eventId: ticket.id,
                        ticketId: `TKT-${ticket.transactionId.slice(-8)}`,
                        event: ticket.eventName,
                        type: ticket.ticketType,
                        buyer: "Usuario Actual", // En una app real sería el nombre del usuario
                        date: ticket.date,
                        valid: true
                      })}
                      size={180}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  
                  <div className="mt-6 text-center text-white text-sm">
                    <p className="font-medium">{ticket.ticketType}</p>
                    <p className="text-purple-200">x{ticket.quantity}</p>
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
                        <span>Compra: {new Date(ticket.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                        <FaDownload className="w-5 h-5" />
                      </button>
                      
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-purple-600" />
                          Lugar
                        </h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {ticket.venue}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaUser className="mr-2 text-purple-600" />
                          Asistentes
                        </h3>
                        <div className="mt-1">
                          <div className="flex -space-x-2">
                            {Array.from({ length: ticket.quantity }).map((_, i) => (
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Método de pago</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {ticket.paymentMethod === 'card' ? 'Tarjeta' : ticket.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transacción</p>
                        <p className="text-sm font-medium text-gray-900">{ticket.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-sm font-medium text-gray-900">L {ticket.price * ticket.quantity}</p>
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