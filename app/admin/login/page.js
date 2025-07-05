"use client"
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLoginScreen = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    adminCode: ''
  });

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isLogin) {
      try {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          adminCode: formData.adminCode,
          redirect: false,
        });

        if (result?.error) {
          setError('Credenciales inválidas. Por favor, verifica tu email, contraseña y código de administrador.');
        } else {
          router.push('/admin/dashboard');
        }
      } catch (error) {
        setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    } else {
      // TODO: Implement admin signup with database
      setError('El registro de administradores está temporalmente deshabilitado.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="admin-login"
              initial={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-black dark:text-white mb-2">Admin Panel</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Acceso exclusivo para administradores</p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="admin@venture.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código de Administrador
                  </label>
                  <input
                    type="password"
                    id="adminCode"
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Código de acceso"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-700 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-orange-700 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Accediendo...
                    </div>
                  ) : (
                    'Acceder al Panel'
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center justify-center mx-auto"
                >
                  <span>Registrar nuevo administrador</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push('/register')}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  ← Volver al login de usuarios
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="admin-register"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-2">Nuevo Administrador</h2>
                <p className="text-gray-600 dark:text-gray-400">Registro de administrador</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="admin@venture.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="reg-adminCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código de Administrador
                  </label>
                  <input
                    type="password"
                    id="reg-adminCode"
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Código de acceso"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-orange-700 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-orange-700 transition duration-300 shadow-lg"
                >
                  Registrar Administrador
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center justify-center mx-auto"
                >
                  <span>Ya tengo una cuenta</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminLoginScreen; 