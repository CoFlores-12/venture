"use client"
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EventPetitions = () => {
  const router = useRouter();
  const { admin, loading: authLoading } = useAdminAuth();
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (authLoading) return;
    
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, authLoading, router]);

  // Load petitions data from API
  useEffect(() => {
    if (admin) {
      const fetchPetitions = async () => {
        try {
          const response = await fetch('/api/admin/events');
          const result = await response.json();
          
          if (result.success) {
            setPetitions(result.data);
          } else {
            console.error('Error fetching petitions:', result.error);
          }
        } catch (error) {
          console.error('Error fetching petitions:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPetitions();
    }
  }, [admin]);

  const handleViewPetition = (petition) => {
    setSelectedPetition(petition);
    setShowModal(true);
  };

  const handleApprove = async (petitionId) => {
    try {
      const response = await fetch(`/api/admin/events/${petitionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPetitions(prev => prev.map(p => 
          p.id === petitionId ? { ...p, status: 'approved' } : p
        ));
        setShowModal(false);
      } else {
        console.error('Error approving petition:', result.error);
      }
    } catch (error) {
      console.error('Error approving petition:', error);
    }
  };

  const handleReject = async (petitionId) => {
    try {
      const response = await fetch(`/api/admin/events/${petitionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPetitions(prev => prev.map(p => 
          p.id === petitionId ? { ...p, status: 'rejected' } : p
        ));
        setShowModal(false);
      } else {
        console.error('Error rejecting petition:', result.error);
      }
    } catch (error) {
      console.error('Error rejecting petition:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      default: return 'Desconocido';
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
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Revisar y aprobar solicitudes de eventos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {petitions.filter(p => p.status === 'pending').length} pendientes
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
            {petitions.map((petition) => (
              <motion.div
                key={petition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewPetition(petition)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          {petition.eventName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {petition.eventName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Solicitado por: {petition.userName} (ID: {petition.userId})
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>📅 {petition.dates.length} fecha{petition.dates.length > 1 ? 's' : ''}</span>
                      <span>📍 {petition.location}</span>
                      <span>💰 {petition.tickets.length} tipo{petition.tickets.length > 1 ? 's' : ''} de entrada</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(petition.status)}`}>
                      {getStatusText(petition.status)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(petition.createdAt).toLocaleDateString('es-ES')}
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
      {showModal && selectedPetition && (
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
              {/* Event Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {selectedPetition.eventName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedPetition.description}
                </p>
              </div>

              {/* User Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Información del Solicitante</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">ID de Usuario:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedPetition.userId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Nombre:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedPetition.userName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">RTN:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedPetition.rtn}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Ubicación</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedPetition.location}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Horario</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedPetition.schedule}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Fechas del Evento</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPetition.dates.map((date, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {new Date(date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tickets */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tipos de Entrada</h4>
                <div className="space-y-2">
                  {selectedPetition.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="font-medium text-gray-900 dark:text-white">{ticket.label}</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        L. {ticket.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedPetition.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleApprove(selectedPetition.id)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    ✅ Aprobar Evento
                  </button>
                  <button
                    onClick={() => handleReject(selectedPetition.id)}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    ❌ Rechazar Evento
                  </button>
                </div>
              )}

              {selectedPetition.status === 'approved' && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-800 dark:text-green-200 font-medium">Evento Aprobado</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPetition.status === 'rejected' && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-red-800 dark:text-red-200 font-medium">Evento Rechazado</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventPetitions; 