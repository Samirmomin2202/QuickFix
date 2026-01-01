import mongoose, { Schema, Model } from 'mongoose';
import { IService } from '../types';

const ServiceSchema = new Schema<IService>({
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a service description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Service must belong to a category']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide service duration in minutes'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  image: {
    type: String,
    default: 'default-service.jpg'
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be between 0 and 5'],
    max: [5, 'Rating must be between 0 and 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  features: [{
    type: String
  }],
  tags: [{
    type: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimization
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ rating: -1 });
ServiceSchema.index({ price: 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ isFeatured: 1 });

// Virtual for reviews
ServiceSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'service',
  justOne: false
});

// Calculate average rating
ServiceSchema.statics.calculateAverageRating = async function(serviceId: string) {
  const Review = mongoose.model('Review');
  
  const stats = await Review.aggregate([
    { $match: { service: new mongoose.Types.ObjectId(serviceId) } },
    {
      $group: {
        _id: '$service',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await this.findByIdAndUpdate(serviceId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount
    });
  } else {
    await this.findByIdAndUpdate(serviceId, {
      rating: 0,
      reviewCount: 0
    });
  }
};

const Service: Model<IService> = mongoose.model<IService>('Service', ServiceSchema);

export default Service;
