"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleBtn from '../components/GoogleBtn';
import { signIn } from "next-auth/react";

export default function AuthScreen() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loadingRegister, setLR] = useState(false);
  const [warning, setWarning] = useState(false);
  const [info, setInfo] = useState("");


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setWarning(true);
      setInfo(decodeURIComponent(errorParam));
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    //TODO: Auth
    e.preventDefault();
    if (isLogin) {
      setLR(true)
      const res = await signIn("user-login", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (res?.ok) {
        router.push("/home");
      } else {
        console.error("Error al iniciar sesión:", res?.error);
        // Mostrar error en la UI si quieres
        setWarning(true);
        setInfo("Credenciales incorrectas");
      }
      setLR(false)
    } else {
      setWarning(false);
      if (formData.password != formData.confirmPassword) {
        setWarning(true);
        setInfo("La contraseña no coincide.");
        return
      }
      setLR(true)
      const res = await signIn("user-register", {
        redirect: false,
        nombre: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (res?.error) {
        setWarning(true);
        setInfo(res.error);
      } else if (res?.ok) {
        router.push("/home");
      } else {
        setWarning(true);
        setInfo("Error desconocido en el registro.");
      }

      setLR(false);


    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-8"
            >
              <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">Iniciar Sesión</h2>
              {warning && (
                <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                  <span className="font-medium"></span> {info}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300  mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Recuérdame
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-pink-400 hover:text-pink-300">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>
                
                  
                <button
                  type="submit"
                  disabled={loadingRegister}
                  className="w-full bg-gradient-to-r flex flex-row items-center justify-center from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition duration-300 shadow-lg"
                >

                  {loadingRegister ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    `Iniciar Sesión`
                  )}
                  
                </button>

              </form>
              <GoogleBtn />
              
              <div className="mt-6 text-center space-y-3">
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center justify-center mx-auto"
                >
                  <span>Crear una cuenta</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                  <button
                    onClick={() => router.push('/admin/login')}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center mx-auto"
                  >
                    <span>¿Eres un Administrador?</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-8"
            >
              <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">Crear Cuenta</h2>

              {warning && (
                <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                  <span className="font-medium"></span> {info}
                </div>
              )}
              
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
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="tu@email.com"
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
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-900 bg-opacity-20 border border-white border-opacity-30 text-black dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loadingRegister}
                  className="w-full bg-gradient-to-r flex flex-row items-center justify-center from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition duration-300 shadow-lg"
                >

                  {loadingRegister ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    `Registrarse`
                  )}
                  
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center justify-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Inicia sesión</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};