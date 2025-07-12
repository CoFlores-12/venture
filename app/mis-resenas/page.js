"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiStar, FiCalendar, FiMapPin } from "react-icons/fi";
import LoadingModal from "@/app/components/loadingOverlay";
import { useAuthUser } from "@/src/lib/authUsers";

const MisResenas = () => {
  const router = useRouter();
  const { user, loading2 } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!loading2) {
      setLoading(false);
      if (user?.id) {
        fetchUserReviews();
      }
    }
  }, [loading2, user]);

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/user/${user.id}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          onClick={() => router.push('/profile')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 mr-2"
        >
          <FiArrowLeft className="text-gray-800 dark:text-white text-lg" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-xs">
          Mis Reseñas
        </h1>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Historial de Reseñas
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Todas las reseñas que has escrito para eventos
          </p>
        </div>

        {/* Reviews Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <FiStar className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tienes reseñas aún
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Cuando escribas reseñas para eventos, aparecerán aquí
              </p>
              <button
                onClick={() => router.push('/events')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Explorar eventos
              </button>
            </div>
          ) : (
            <div className="p-4">
              {/* Desktop Table Header - Hidden on mobile */}
              <div className="hidden md:block bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600 mb-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="col-span-4">Evento</div>
                  <div className="col-span-2">Calificación</div>
                  <div className="col-span-2">Fecha del evento</div>
                  <div className="col-span-2">Fecha de reseña</div>
                  <div className="col-span-2">Acciones</div>
                </div>
              </div>

              {/* Reviews List - Mobile Cards / Desktop Table */}
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div 
                    key={review._id || index}
                    className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                    onClick={() => review.event?._id && router.push(`/event/${review.event._id}`)}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      {/* Event Info */}
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <FiCalendar className="text-purple-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-base">
                            {review.event?.title || 'Evento no disponible'}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {review.event?.location || 'Ubicación no disponible'}
                          </p>
                        </div>
                      </div>

                      {/* Rating and Dates */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {review.rating}/5
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                          <div>Evento: {review.event?.date ? formatEventDate(review.event.date) : 'N/A'}</div>
                          <div>Reseña: {formatDate(review.createdAt)}</div>
                        </div>
                      </div>

                      {/* Review Comment */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          "{review.comment}"
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/event/${review.event?._id}`);
                        }}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Ver evento
                      </button>
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden md:block">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Event Name */}
                        <div className="col-span-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <FiCalendar className="text-purple-700" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                {review.event?.title || 'Evento no disponible'}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {review.event?.location || 'Ubicación no disponible'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating)}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {review.rating}
                            </span>
                          </div>
                        </div>

                        {/* Event Date */}
                        <div className="col-span-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            <span>{review.event?.date ? formatEventDate(review.event.date) : 'N/A'}</span>
                          </div>
                        </div>

                        {/* Review Date */}
                        <div className="col-span-2">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/event/${review.event?._id}`);
                              }}
                              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                              Ver evento
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Review Comment (Desktop) */}
                      <div className="mt-3 pl-13">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisResenas; 