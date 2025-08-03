"use client";
import React, { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewDisplay from './ReviewDisplay';

const ReviewSection = ({ 
  eventId, 
  reviews = [], 
  canReview = false, 
  hasReviewed = false,
  userReview = null,
  hasVerifiedPurchase = false,
  onReviewSubmit,
  onReviewUpdate 
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewSubmit = async (reviewData) => {
    setIsSubmitting(true);
    try {
      await onReviewSubmit(reviewData);
      setShowReviewForm(false);
      // Optionally refresh reviews
      if (onReviewUpdate) {
        onReviewUpdate();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // You could show an error message here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  const handleAddReview = () => {
    setShowReviewForm(true);
  };

  return (
    <div className="space-y-6">
      {showReviewForm ? (
        <ReviewForm
          eventId={eventId}
          onSubmit={handleReviewSubmit}
          onCancel={handleCancelReview}
          existingReview={userReview}
          isEditing={hasReviewed}
          hasVerifiedPurchase={hasVerifiedPurchase}
        />
      ) : (
        <ReviewDisplay
          reviews={reviews}
          onAddReview={handleAddReview}
          canReview={canReview}
          hasReviewed={hasReviewed}
        />
      )}
    </div>
  );
};

export default ReviewSection; 