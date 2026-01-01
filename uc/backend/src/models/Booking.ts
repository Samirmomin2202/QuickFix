import mongoose, { Schema, Model } from 'mongoose';
import { IBooking } from '../types';

const BookingSchema = new Schema<IBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Please specify a service']
  },
  serviceProvider: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please provide a scheduled date']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Please provide a scheduled time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
    },
    landmark: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please provide total amount'],
    min: [0, 'Amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'wallet'],
    default: 'cash'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  cancelledAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Indexes
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ serviceProvider: 1, scheduledDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ scheduledDate: 1 });

// Prevent double booking of service provider
BookingSchema.index(
  { serviceProvider: 1, scheduledDate: 1, scheduledTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    }
  }
);

// Middleware to update completedAt
BookingSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  if (this.isModified('status') && this.status === 'cancelled' && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
  next();
});

const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
