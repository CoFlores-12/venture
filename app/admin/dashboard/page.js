"use client"
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SolicitudesOrganizadores from '@/app/components/admin/RequestPending';

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
  const [statsLoading, setStatsLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
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

  // Fetch real data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/admin/stats', {
          credentials: 'include'
        });
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats(statsData.stats);
        } else {
          console.error('Error fetching stats:', statsData.error);
        }

        // Fetch activities only if admin ID is available
        if (admin.id) {
          const activitiesResponse = await fetch(`/api/admin/activities?adminId=${admin.id}`, {
            credentials: 'include'
          });
          const activitiesData = await activitiesResponse.json();
          
          if (activitiesData.success) {
            setActivities(activitiesData.activities);
          } else {
            console.error('Error fetching activities:', activitiesData.error);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setStatsLoading(false);
        setActivitiesLoading(false);
      }
    };

    if (admin) {
      fetchData();
    }
  }, [admin]);



  const metricCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: "🎪",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500",
      change: `${stats.changes?.events >= 0 ? '+' : ''}${stats.changes?.events || 0}%`,
      changeType: stats.changes?.events >= 0 ? "positive" : "negative"
    },
    {
      title: "Pending Events",
      value: stats.pendingEvents,
      icon: "⏳",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500",
      change: `${stats.changes?.events >= 0 ? '+' : ''}${stats.changes?.events || 0}%`,
      changeType: "neutral"
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: "👥",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500",
      change: `${stats.changes?.users >= 0 ? '+' : ''}${stats.changes?.users || 0}%`,
      changeType: stats.changes?.users >= 0 ? "positive" : "negative"
    },
    {
      title: "Total Sales",
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: "💰",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500",
      change: `${stats.changes?.sales >= 0 ? '+' : ''}${stats.changes?.sales || 0}%`,
      changeType: stats.changes?.sales >= 0 ? "positive" : "negative"
    },
    {
      title: "Total Commissions",
      value: `$${stats.totalCommissions.toLocaleString()}`,
      icon: "💸",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500",
      change: `${stats.changes?.commissions >= 0 ? '+' : ''}${stats.changes?.commissions || 0}%`,
      changeType: stats.changes?.commissions >= 0 ? "positive" : "negative"
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

  // Helper function to format time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
  };

  // Helper function to refresh activities
  const refreshActivities = async () => {
    if (!admin?.id) return;
    
    try {
      const activitiesResponse = await fetch(`/api/admin/activities?adminId=${admin.id}`, {
        credentials: 'include'
      });
      const activitiesData = await activitiesResponse.json();
      if (activitiesData.success) {
        setActivities(activitiesData.activities);
      }
    } catch (error) {
      console.error('Error refreshing activities:', error);
    }
  };

  // Helper function to log admin activities
  const logActivity = async (action, details, type = 'info') => {
    if (!admin?.id) {
      console.warn('Cannot log activity: admin ID not available');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          adminId: admin.id,
          action,
          details,
          type
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh activities after logging
        await refreshActivities();
      } else {
        console.error('Failed to log activity:', result.error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
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
        
        // Log the activity
        await logActivity(
          'Administrador creado',
          `Nuevo administrador: ${createAdminForm.name} (${createAdminForm.email})`,
          'success'
        );
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
          {statsLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse ml-3"></div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
              </motion.div>
            ))
          ) : (
            metricCards.map((metric, index) => (
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
            ))
          )}
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className=""
          >
            
              {admin?.id ? (
                <SolicitudesOrganizadores 
                  onActivityLog={logActivity} 
                  adminId={admin.id} 
                  key={`solicitudes-${admin.id}`}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                  </div>
                </div>
              )}
              
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
              
              {/* Test Activities Button - Remove in production */}
              {admin?.rol === 'superadmin' && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={async () => {
                      await logActivity('Evento aprobado', 'Concierto de Verano fue aprobado', 'success');
                      await logActivity('Usuario bloqueado', 'Usuario spam@example.com fue bloqueado', 'warning');
                      await logActivity('Reporte generado', 'Reporte de ventas mensual generado', 'info');
                    }}
                    className="w-full p-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Agregar Actividades de Prueba
                  </button>
                </div>
              )}
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
              Últimas actividades del administrador
            </p>
          </div>
          <div className="p-6">
            {activitiesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No hay actividades recientes</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Las actividades aparecerán aquí cuando realices acciones</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const timeAgo = getTimeAgo(activity.timestamp);
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' :
                        activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.details} • {timeAgo}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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