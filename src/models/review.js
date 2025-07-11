import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per user per event
reviewSchema.index({ event: 1, user: 1 }, { unique: true });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtuals are serialized
reviewSchema.set('toJSON', { virtuals: true });

// Force recreate the model to ensure updated schema
if (mongoose.models.Review) {
  delete mongoose.models.Review;
}

const Review = mongoose.model('Review', reviewSchema);

export default Review; 