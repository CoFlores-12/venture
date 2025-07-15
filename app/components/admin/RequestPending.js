import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SolicitudesOrganizadores = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axios.get('/api/users/requests');
        setSolicitudes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las solicitudes');
        setLoading(false);
        console.error(err);
      }
    };

    fetchSolicitudes();
  }, []);

 const handleAction = async (action) => {
    try {
      const currentUserId = solicitudes[currentIndex]._id;
      
      const res = await fetch('/api/users/validate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUserId, 
          action 
        }),
      });
      
      if (!res.ok) throw new Error('Error al procesar la acción');

      setActionMessage(
        `Solicitud ${action === 'approve' ? 'aceptada' : 'rechazada'} correctamente`
      );
      
      // Actualizar lista o pasar a la siguiente
      if (currentIndex < solicitudes.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowModal(false);
        fetchSolicitudes(); // Recargar lista
      }
    } catch (err) {
      setError(err.message);
    }
  };

 

  const openModal = () => {
    setCurrentIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all hover:shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Solicitudes de Organizadores</h2>
              <p className="text-gray-600 mt-1">Gestiona las solicitudes de usuarios que quieren ser organizadores</p>
            </div>
          </div>
            <div className="bg-purple-100 text-purple-800 rounded-full max-w-[200px] mt-2 justify-center px-6 py-3 flex items-center">
              <span className="text-3xl font-bold mr-2">{solicitudes.length}</span>
              <span>Pendientes</span>
            </div>
          
          <button
            onClick={openModal}
            disabled={solicitudes.length === 0}
            className={`mt-6 px-6 py-3 rounded-lg font-medium ${solicitudes.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800 text-white transition-colors'}`}
          >
            Revisar Solicitudes
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="fixed bottom-4 right-4 bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {actionMessage}
        </div>
      )}

      {showModal && solicitudes.length > 0 && (
        <div className="fixed inset-0 bg-[#00000050] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Solicitud {currentIndex + 1} de {solicitudes.length}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <img 
                    src={solicitudes[currentIndex].foto || 'https://via.placeholder.com/150'} 
                    alt={`Foto de ${solicitudes[currentIndex].nombre}`} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 mb-4"
                  />
                  <h4 className="text-xl font-bold text-gray-800">{solicitudes[currentIndex].nombre}</h4>
                  <p className="text-purple-700">{solicitudes[currentIndex].correo}</p>
                </div>

                <div className="md:w-2/3 space-y-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Organización</h5>
                    <p className="text-lg">{solicitudes[currentIndex].organizacion}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ubicación</h5>
                    <p className="text-lg">{solicitudes[currentIndex].ubicacion}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contacto</h5>
                    <p className="text-lg">{solicitudes[currentIndex].contacto}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Descripción</h5>
                    <p className="text-gray-700">{solicitudes[currentIndex].descripcion}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Documento de Identidad</h5>
                    <img src={solicitudes[currentIndex].identidadDoc} />
                    <a 
                      href={solicitudes[currentIndex].identidadDoc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-700 hover:underline flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Ver documento
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                 <button
                  onClick={() => handleAction('reject')}
                  className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => handleAction('approve')}
                  className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesOrganizadores;