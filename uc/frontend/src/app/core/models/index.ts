// User interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'service-provider';
  address?: Address;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  landmark?: string;
}

export interface BookingClientDetails {
  name: string;
  email: string;
  phone: string;
}

// Category interface
export interface Category {
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

// Service interface
export interface Service {
  _id: string;
  name: string;
  description: string;
  category: Category | string;
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

// Booking interface
export interface Booking {
  _id: string;
  user: User | string;
  service: Service | string;
  serviceProvider?: User | string;
  bookingFor: 'self' | 'someone-else';
  clientDetails: BookingClientDetails;
  scheduledDate: Date;
  scheduledTime: string;
  preferredTimeSlots?: string[];
  address: Address;
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

// Review interface
export interface Review {
  _id: string;
  user: User | string;
  service: Service | string;
  booking: Booking | string;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface Profile {
  _id: string;
  user: string | User;
  name: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  dateOfBirth?: string;
  age?: number;
  profileImage: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    fullAddress?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  bio?: string;
  occupation?: string;
  createdAt: string;
  updatedAt: string;
}
// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  token?: string;
  user?: User;
}

// Auth interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Booking Create Request
export interface CreateBookingRequest {
  service: string;
  bookingFor: 'self' | 'someone-else';
  clientDetails: BookingClientDetails;
  scheduledDate: Date;
  scheduledTime: string;
  address: Address;
  notes?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
}

// Review Create Request
export interface CreateReviewRequest {
  booking: string;
  rating: number;
  comment: string;
}
