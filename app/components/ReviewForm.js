"use client";
import React, { useState, useEffect } from 'react';
import { FiStar, FiSend } from 'react-icons/fi';

const ReviewForm = ({ eventId, onSubmit, onCancel, existingReview = null, isEditing = false }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill form with existing review data if editing
  useEffect(() => {
    if (existingReview && isEditing) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (rating === 0) {
      newErrors.rating = 'Por favor selecciona una calificación';
    }
    if (!comment.trim()) {
      newErrors.comment = 'Por favor escribe un comentario';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({ rating, comment, eventId });
      if (!isEditing) {
        setRating(0);
        setComment('');
      }
      setErrors({});
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {isEditing ? 'Editar tu reseña' : 'Escribe tu reseña'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Calificación
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded-full transition-colors ${
                  star <= rating 
                    ? 'text-yellow-400 hover:text-yellow-500' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <FiStar className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comentario
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white resize-none"
            placeholder="Comparte tu experiencia en este evento..."
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment && (
              <p className="text-sm text-red-600">{errors.comment}</p>
            )}
            <span className="text-sm text-gray-500 ml-auto">
              {comment.length}/500
            </span>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <FiSend className="w-4 h-4" />
            <span>{isSubmitting ? 'Enviando...' : (isEditing ? 'Actualizar reseña' : 'Enviar reseña')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm; 