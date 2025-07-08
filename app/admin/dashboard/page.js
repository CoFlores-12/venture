"use client"
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const router = useRouter();
  const { admin, loading, logout } = useAdminAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingEvents: 0,
    totalUsers: 0,
    totalSales: 0,
    totalCommissions: 0
  });
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [createAdminForm, setCreateAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
    role: 'admin'
  });
  const [createAdminLoading, setCreateAdminLoading] = useState(false);
  const [createAdminError, setCreateAdminError] = useState('');
  const [createAdminSuccess, setCreateAdminSuccess] = useState('');

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (loading) return;
    
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, loading, router]);

  // Simulate loading data
  useEffect(() => {
    // TODO: Replace with actual API calls
    setTimeout(() => {
      setStats({
        totalEvents: 156,
        pendingEvents: 23,
        totalUsers: 2847,
        totalSales: 45678,
        totalCommissions: 3421
      });
    }, 1000);
  }, []);

  const metricCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: "🎪",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Pending Events",
      value: stats.pendingEvents,
      icon: "⏳",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500",
      change: "+5%",
      changeType: "neutral"
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: "👥",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Total Sales",
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: "💰",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500",
      change: "+15%",
      changeType: "positive"
    },
    {
      title: "Total Commissions",
      value: `$${stats.totalCommissions.toLocaleString()}`,
      icon: "💸",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500",
      change: "+22%",
      changeType: "positive"
    }
  ];

  const recentEvents = [
    { id: 1, name: "Concierto de Verano", organizer: "Music Corp", status: "Approved", date: "2024-01-15" },
    { id: 2, name: "Feria Cultural", organizer: "Art Events", status: "Pending", date: "2024-01-14" },
    { id: 3, name: "Cine al Aire Libre", organizer: "Cinema Plus", status: "Approved", date: "2024-01-13" },
    { id: 4, name: "Festival de Comida", organizer: "Food Fest", status: "Pending", date: "2024-01-12" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateAdminChange = (e) => {
    setCreateAdminForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateAdminLoading(true);
    setCreateAdminError('');
    setCreateAdminSuccess('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(createAdminForm)
      });
      const data = await response.json();
      if (data.success) {
        setCreateAdminSuccess('Administrador creado exitosamente');
        setCreateAdminForm({ name: '', email: '', password: '', adminCode: '', role: 'admin' });
        setShowCreateAdminModal(false);
      } else {
        setCreateAdminError(data.error || 'Error al crear el admin');
      }
    } catch (error) {
      setCreateAdminError('Error de conexión');
    } finally {
      setCreateAdminLoading(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Show loading while checking authentication
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
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Panel de administración de Venture</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {admin?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {admin?.name || 'Admin'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido de vuelta! 👋
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Aquí tienes un resumen de la actividad de Venture
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {metricCards.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                    {metric.title}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">
                    {metric.value}
                  </p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center ml-3`}>
                  <span className="text-lg sm:text-xl">{metric.icon}</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center">
                <span className={`text-xs sm:text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 hidden sm:inline">
                  desde el mes pasado
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Eventos Recientes
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Últimos eventos registrados
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium">
                          {event.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {event.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {event.organizer}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'Approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {event.status}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {event.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => router.push('/admin/events')}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Ver todos los eventos →
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Acciones Rápidas
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Gestiona tu plataforma
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button 
                  onClick={() => router.push('/admin/events')}
                  className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="text-blue-600 dark:text-blue-400 text-xl sm:text-2xl mb-1 sm:mb-2">📋</div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Gestionar Eventos</p>
                </button>
                <button 
                  onClick={() => router.push('/admin/users')}
                  className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="text-green-600 dark:text-green-400 text-xl sm:text-2xl mb-1 sm:mb-2">👥</div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Gestionar Usuarios</p>
                </button>
                <button className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <div className="text-purple-600 dark:text-purple-400 text-xl sm:text-2xl mb-1 sm:mb-2">📊</div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Reportes</p>
                </button>
                {admin?.role === 'superadmin' ? (
                  <button 
                    onClick={() => setShowCreateAdminModal(true)}
                    className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <div className="text-red-600 dark:text-red-400 text-xl sm:text-2xl mb-1 sm:mb-2">👑</div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Crear Admin</p>
                  </button>
                ) : (
                  <button className="p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <div className="text-orange-600 dark:text-orange-400 text-xl sm:text-2xl mb-1 sm:mb-2">⚙️</div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Configuración</p>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Actividad Reciente
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Últimas actividades en la plataforma
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: "Nuevo evento aprobado", user: "Music Corp", time: "Hace 2 horas", type: "success" },
                { action: "Usuario registrado", user: "john@example.com", time: "Hace 3 horas", type: "info" },
                { action: "Venta realizada", user: "Concierto de Verano", time: "Hace 4 horas", type: "success" },
                { action: "Evento rechazado", user: "Feria Cultural", time: "Hace 5 horas", type: "warning" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Crear Nuevo Administrador
                </h2>
                <button
                  onClick={() => setShowCreateAdminModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input 
                  type="text" 
                  name="name" 
                  value={createAdminForm.name} 
                  onChange={handleCreateAdminChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email" 
                  value={createAdminForm.email} 
                  onChange={handleCreateAdminChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  name="password" 
                  value={createAdminForm.password} 
                  onChange={handleCreateAdminChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código de Admin</label>
                <input 
                  type="password" 
                  name="adminCode" 
                  value={createAdminForm.adminCode} 
                  onChange={handleCreateAdminChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
                <select 
                  name="role" 
                  value={createAdminForm.role} 
                  onChange={handleCreateAdminChange} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              {createAdminError && <div className="text-red-600 dark:text-red-400 text-sm">{createAdminError}</div>}
              {createAdminSuccess && <div className="text-green-600 dark:text-green-400 text-sm">{createAdminSuccess}</div>}
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={createAdminLoading} 
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {createAdminLoading ? 'Creando...' : 'Crear Admin'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateAdminModal(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 