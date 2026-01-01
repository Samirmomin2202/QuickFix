import mongoose, { Schema, Model } from 'mongoose';
import { IReview } from '../types';

const ReviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Review must belong to a service']
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Review must be associated with a booking']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one review per booking
ReviewSchema.index({ booking: 1 }, { unique: true });
ReviewSchema.index({ service: 1, createdAt: -1 });
ReviewSchema.index({ user: 1 });

// Update service rating after review save/delete
ReviewSchema.post('save', async function() {
  await (this.constructor as any).calcAverageRating(this.service);
});

ReviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await (this.constructor as any).calcAverageRating(this.service);
});

// Static method to calculate average rating
ReviewSchema.statics.calcAverageRating = async function(serviceId: string) {
  const Service = mongoose.model('Service');
  await (Service as any).calculateAverageRating(serviceId);
};

const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
