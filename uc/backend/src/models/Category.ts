import mongoose, { Schema, Model } from 'mongoose';
import { ICategory } from '../types';

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a category description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    required: [true, 'Please provide an icon URL']
  },
  image: {
    type: String,
    default: 'default-category.jpg'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name
CategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

// Virtual for service count
CategorySchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

// Index
CategorySchema.index({ isActive: 1 });

const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
