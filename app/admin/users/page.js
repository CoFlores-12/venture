"use client"
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const UserManagement = () => {
  const router = useRouter();
  const { admin, loading: authLoading } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (authLoading) return;
    
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, authLoading, router]);

  // Load users data from API
  useEffect(() => {
    if (admin) {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/admin/users');
          const result = await response.json();
          
          if (result.success) {
            setUsers(result.data);
          } else {
            console.error('Error fetching users:', result.error);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [admin]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: newStatus } : u
        ));
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        console.error('Error updating user status:', result.error);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'suspended': return 'Suspendido';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'organizer': return 'Organizador';
      case 'user': return 'Usuario';
      default: return 'Usuario';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'organizer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'user': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Administrar usuarios de la plataforma</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {users.length} usuarios total
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters and Search */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="suspended">Suspendidos</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Activos: {users.filter(u => u.status === 'active').length}</span>
            <span>Suspendidos: {users.filter(u => u.status === 'suspended').length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewUser(user)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>🆔 {user.userId}</span>
                      <span>📅 Registrado: {new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
                      <span>📊 {user.eventsCount || 0} eventos</span>
                      <span>💰 {user.totalSpent || 0} L. gastados</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No se encontraron usuarios
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay usuarios registrados'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
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
                  Detalles del Usuario
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
              {/* User Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Información del Usuario</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">ID de Usuario:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedUser.userId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">RTN:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedUser.rtn || 'No registrado'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Rol:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{getRoleText(selectedUser.role)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Estado:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{getStatusText(selectedUser.status)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Fecha de Registro:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedUser.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Último Acceso:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedUser.eventsCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Eventos Creados</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedUser.ticketsPurchased || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Entradas Compradas</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    L. {(selectedUser.totalSpent || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Gastado</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.status)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedUser.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedUser.status === 'active' ? '🚫 Suspender Usuario' : '✅ Activar Usuario'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 