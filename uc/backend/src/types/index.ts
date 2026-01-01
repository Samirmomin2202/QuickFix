import { Request } from 'express';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'user' | 'admin' | 'service-provider';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  _id: string;
  name: string;
  description: string;
  category: string | ICategory;
  price: number;
  discountPrice?: number;
  duration: number;
  image?: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  features?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking {
  _id: string;
  user: string | IUser;
  service: string | IService;
  serviceProvider?: string | IUser;
  scheduledDate: Date;
  scheduledTime: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id: string;
  user: string | IUser;
  service: string | IService;
  booking: string | IBooking;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
