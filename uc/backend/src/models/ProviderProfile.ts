import mongoose, { Schema, Model } from 'mongoose';
import { IProviderProfile } from '../types';

const ProviderProfileSchema = new Schema<IProviderProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [50, 'Middle name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  gender: {
    type: String,
    required: [true, 'Please select gender'],
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  profilePicture: {
    type: String,
    default: 'default-provider-avatar.png'
  },
  legalDocumentType: {
    type: String,
    required: [true, 'Please provide legal document type'],
    enum: ['aadhar', 'pan', 'passport', 'driving-license', 'voter-id']
  },
  legalDocumentNumber: {
    type: String,
    required: [true, 'Please provide legal document number'],
    trim: true,
    uppercase: true
  },
  professionalType: {
    type: String,
    required: [true, 'Please provide professional type'],
    trim: true
  },
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be between 0 and 5'],
    max: [5, 'Rating must be between 0 and 5']
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimization (user index already created by unique: true)
ProviderProfileSchema.index({ email: 1 });
ProviderProfileSchema.index({ services: 1 });
ProviderProfileSchema.index({ verificationStatus: 1 });
ProviderProfileSchema.index({ rating: -1 });

// Virtual for bookings
ProviderProfileSchema.virtual('bookings', {
  ref: 'Booking',
  localField: 'user',
  foreignField: 'serviceProvider',
  justOne: false
});

const ProviderProfile: Model<IProviderProfile> = mongoose.model<IProviderProfile>('ProviderProfile', ProviderProfileSchema);

export default ProviderProfile;
