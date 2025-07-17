"use client"
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EventPetitions = () => {
  const router = useRouter();
  const { admin, loading: authLoading } = useAdminAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (authLoading) return;
    
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, authLoading, router]);

  // Load events data from API
  useEffect(() => {
    if (admin) {
      const fetchEvents = async () => {
        try {
          const response = await fetch('/api/admin/events');
          const result = await response.json();
          
          if (result.success) {
            setEvents(result.events);
          } else {
            console.error('Error fetching events:', result.error);
          }
        } catch (error) {
          console.error('Error fetching events:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [admin]);

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleTakeDown = async (eventId) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setEvents(prev => prev.filter(e => e._id !== eventId));
        setShowModal(false);
        setActionMessage('Evento retirado exitosamente');
        
        // Clear message after 3 seconds
        setTimeout(() => setActionMessage(''), 3000);
      } else {
        console.error('Error taking down event:', result.error);
      }
    } catch (error) {
      console.error('Error taking down event:', error);
    }
  };



  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!admin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Gestión de Eventos</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Revisar y gestionar eventos publicados</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {events.length} eventos totales
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewEvent(event)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          {event.title.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Organizado por: {event.organizerName} ({event.organizerEmail})
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>📅 {event.date}</span>
                      <span>🕒 {event.time}</span>
                      <span>📍 {event.location}</span>
                      <span>💰 {event.tickets.length} tipo{event.tickets.length > 1 ? 's' : ''} de entrada</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Activo
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(event.createdAt).toLocaleDateString('es-ES')}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Event Detail Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Detalles del Evento
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Banner */}
              {selectedEvent.banner && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img 
                    src={selectedEvent.banner} 
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Event Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Organizer Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Información del Organizador</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Nombre:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.organizerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.organizerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Ubicación</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedEvent.location}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Fecha y Hora</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedEvent.date} a las {selectedEvent.time}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Categoría</h4>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {selectedEvent.category}
                </span>
              </div>

              {/* Tickets */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tipos de Entrada</h4>
                <div className="space-y-2">
                  {selectedEvent.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="font-medium text-gray-900 dark:text-white">{ticket.name}</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        L. {ticket.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Take Down Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleTakeDown(selectedEvent._id)}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  🚫 Retirar Evento
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Action Message */}
      {actionMessage && (
        <div className="fixed bottom-4 right-4 bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {actionMessage}
        </div>
      )}
    </div>
  );
};

export default EventPetitions; 