"use client";
import React, { useState } from 'react';
import { FiStar, FiUser, FiCalendar } from 'react-icons/fi';

const ReviewDisplay = ({ reviews = [], onAddReview, canReview = false, hasReviewed = false }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [showAll, setShowAll] = useState(false);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Limit reviews to show
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Reseñas ({reviews.length})
          </h3>
          {reviews.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">
                {averageRating.toFixed(1)} de 5
              </span>
            </div>
          )}
        </div>
        
        <div className="ml-4">
          {canReview && !hasReviewed && (
            <button
              onClick={onAddReview}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Escribir reseña
            </button>
          )}
          {canReview && hasReviewed && (
            <button
              onClick={onAddReview}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Editar reseña
            </button>
          )}
        </div>
      </div>

      {/* Sort options */}
      {reviews.length > 1 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="highest">Mejor calificados</option>
            <option value="lowest">Peor calificados</option>
          </select>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <FiStar className="mx-auto text-3xl text-gray-400 mb-3" />
          <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            No hay reseñas aún
          </h4>
          <p className="text-gray-500 text-sm">
            Sé el primero en compartir tu experiencia
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((review, index) => (
            <div
              key={review._id || index}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FiUser className="text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {review.user?.name || 'Usuario'}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FiCalendar className="w-3 h-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                    {review.rating}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Show more/less button */}
      {reviews.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            {showAll ? 'Mostrar menos' : `Ver todas las ${reviews.length} reseñas`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay; 