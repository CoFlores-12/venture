"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUser, FiCalendar, FiMapPin } from "react-icons/fi";
import LoadingModal from "@/app/components/loadingOverlay";
import { useAuthUser } from "@/src/lib/authUsers";

const UserProfile = () => {
  const router = useRouter();
  const { user, loading2 } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!loading2) {
      setLoading(false);
      if (user?.id) {
        fetchUserPurchases();
      }
    }
  }, [loading2, user]);

  const fetchUserPurchases = async () => {
    try {
      const response = await fetch(`/api/purchase/${user.id}`);
      const data = await response.json();
      setPurchases(data.slice(0, 2)); // Get only last 2 purchases
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  if (loading) {
    return <LoadingModal />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-700">Usuario no encontrado</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 btn btn-primary bg-purple-700 hover:bg-purple-800 text-white"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-20">
      {/* Navbar iOS Style */}
      <nav className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center shadow-sm">
        <button
          onClick={() => router.push('/home')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 mr-2"
        >
          <FiArrowLeft className="text-gray-800 dark:text-white text-lg" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-xs">
          Mi Perfil
        </h1>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Profile Card */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex items-center gap-5 mb-8">
          {user.image ? (
            <img
              src={user.image}
              alt={`Avatar de ${user.name}`}
              className="w-16 h-16 aspect-square rounded-full bg-purple-100 flex items-center justify-center border-2 border-white shadow-md object-cover"
            />
          ) : (
            <div className="w-16 h-16 aspect-square rounded-full bg-purple-100 flex items-center justify-center border-2 border-white shadow-md">
              <FiUser size={28} className="text-purple-700" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">{user.name}</h2>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
              {user.descripcion || "Agrega una descripción a tu perfil."}
            </p>
          </div>
        </div>

        {/* Recent Purchases Section */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Últimas compras</h3>
            {purchases.length > 0 && (
              <a href="/mis-compras" className="text-sm text-purple-700 font-medium">Ver todas</a>
            )}
          </div>
          
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar className="mx-auto text-3xl text-gray-400 mb-3" />
              <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-1">No hay compras recientes</h4>
              <p className="text-gray-500 text-sm">Tus compras aparecerán aquí cuando compres boletos para eventos.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map((purchase, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => purchase.event?._id && router.push(`/event/${purchase.event._id}`)}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FiCalendar className="text-2xl text-purple-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {purchase.event?.title || 'Evento no disponible'}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiMapPin className="mr-1" />
                        <span className="truncate">
                          {purchase.event?.date || 'Fecha no disponible'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-purple-700">
                          {purchase.typeTicket || 'Ticket'}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          x{purchase.ticketQuantity || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Placeholder for reviews or other sections */}
        {/* <div className="bg-gray-50 dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reseñas</h3>
          <p className="text-gray-500 text-sm">Aquí aparecerán tus reseñas cuando estén disponibles.</p>
        </div> */}
      </div>
    </div>
  );
};

export default UserProfile; 