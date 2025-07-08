import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  documentId: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true
  },
  documentType: {
    type: String,
    enum: ['RTN', 'DNI', 'PASSPORT', 'OTHER'],
    default: 'RTN'
  }, 
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin', 'superadmin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'deleted'],
    default: 'active'
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false }
  },
  credits: {
    type: Number,
    default: 0,
    min: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  createdEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  purchaseHistory: [{
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    quantity: Number,
    totalPrice: Number,
    purchaseDate: Date
  }],
  address: {
    city: String,
    country: String,
    postalCode: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  signUpMethod: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials'
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
