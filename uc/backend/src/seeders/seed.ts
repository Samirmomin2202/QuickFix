import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Category from '../models/Category';
import Service from '../models/Service';
import Booking from '../models/Booking';
import Review from '../models/Review';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@quickfix.com',
        password: 'Admin@123',
        phone: '9876543210',
        role: 'admin',
        isActive: true
      },
      {
        name: 'John Doe',
        email: 'user@test.com',
        password: 'User@123',
        phone: '9876543211',
        role: 'user',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        }
      },
      {
        name: 'Service Provider',
        email: 'provider@test.com',
        password: 'Provider@123',
        phone: '9876543212',
        role: 'service-provider'
      }
    ]);
    console.log('✅ Users created');

    // Create Categories
    const categories = await Category.create([
      {
        name: 'Salon for Women',
        description: 'Beauty services for women including hair, skin, and makeup',
        icon: 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_72d18950.png',
        displayOrder: 1
      },
      {
        name: 'Salon for Men',
        description: 'Grooming services for men including haircuts and shaves',
        icon: 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_a5704a40.png',
        displayOrder: 2
      },
      {
        name: 'AC & Appliance Repair',
        description: 'Repair and maintenance of air conditioners and appliances',
        icon: 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_7fbf42c0.png',
        displayOrder: 3
      },
      {
        name: 'Cleaning & Pest Control',
        description: 'Home cleaning and pest control services',
        icon: 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_ba1b2ee0.png',
        displayOrder: 4
      },
      {
        name: 'Electrician, Plumber & Carpenter',
        description: 'Home repair and maintenance services',
        icon: 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_7d5f3d80.png',
        displayOrder: 5
      },
      {
        name: 'Painting & Waterproofing',
        description: 'Professional painting and waterproofing services',
        icon: 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_15e6e1c0.png',
        displayOrder: 6
      }
    ]);
    console.log('✅ Categories created');

    // Create Services
    const services = await Service.create([
      // Salon for Women
      {
        name: 'Hair Cut & Styling',
        description: 'Professional haircut and styling by expert stylists',
        category: categories[0]._id,
        price: 599,
        discountPrice: 499,
        duration: 60,
        rating: 4.5,
        reviewCount: 234,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500',
        features: ['Expert stylist', 'Quality products', 'Customized styling'],
        tags: ['haircut', 'styling', 'women']
      },
      {
        name: 'Facial & Cleanup',
        description: 'Deep cleansing facial for glowing skin',
        category: categories[0]._id,
        price: 899,
        discountPrice: 749,
        duration: 90,
        rating: 4.7,
        reviewCount: 456,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
        features: ['Deep cleansing', 'Professional products', 'Relaxing'],
        tags: ['facial', 'cleanup', 'skincare']
      },
      {
        name: 'Manicure & Pedicure',
        description: 'Nail care and grooming for hands and feet',
        category: categories[0]._id,
        price: 799,
        duration: 75,
        rating: 4.6,
        reviewCount: 189,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
        features: ['Nail art', 'Quality products', 'Hygienic'],
        tags: ['manicure', 'pedicure', 'nails']
      },
      // Salon for Men
      {
        name: 'Haircut for Men',
        description: 'Trendy haircut styles for men',
        category: categories[1]._id,
        price: 299,
        discountPrice: 249,
        duration: 30,
        rating: 4.4,
        reviewCount: 567,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500',
        features: ['Modern styles', 'Expert barber', 'Quick service'],
        tags: ['haircut', 'men', 'grooming']
      },
      {
        name: 'Shaving & Facial',
        description: 'Professional shaving with facial treatment',
        category: categories[1]._id,
        price: 399,
        duration: 45,
        rating: 4.5,
        reviewCount: 234,
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500',
        features: ['Smooth shave', 'Facial massage', 'Quality products'],
        tags: ['shaving', 'facial', 'men']
      },
      // AC & Appliance Repair
      {
        name: 'AC Service & Repair',
        description: 'Complete AC servicing and repair by certified technicians',
        category: categories[2]._id,
        price: 499,
        duration: 60,
        rating: 4.6,
        reviewCount: 892,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
        features: ['Certified technician', '30-day warranty', 'Quality parts'],
        tags: ['ac', 'repair', 'service']
      },
      {
        name: 'Washing Machine Repair',
        description: 'Expert washing machine repair and maintenance',
        category: categories[2]._id,
        price: 399,
        duration: 45,
        rating: 4.5,
        reviewCount: 345,
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500',
        features: ['Quick service', 'Genuine parts', 'Warranty'],
        tags: ['washing machine', 'repair', 'appliance']
      },
      // Cleaning & Pest Control
      {
        name: 'Deep Home Cleaning',
        description: 'Thorough cleaning of your entire home',
        category: categories[3]._id,
        price: 1999,
        discountPrice: 1699,
        duration: 240,
        rating: 4.8,
        reviewCount: 1234,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
        features: ['Professional team', 'Eco-friendly products', 'Deep cleaning'],
        tags: ['cleaning', 'home', 'deep clean']
      },
      {
        name: 'Pest Control',
        description: 'Complete pest control treatment for your home',
        category: categories[3]._id,
        price: 1499,
        duration: 120,
        rating: 4.7,
        reviewCount: 678,
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500',
        features: ['Safe chemicals', 'Effective treatment', '3-month warranty'],
        tags: ['pest control', 'cockroach', 'termite']
      },
      // Electrician, Plumber & Carpenter
      {
        name: 'Electrician Services',
        description: 'All electrical repairs and installations',
        category: categories[4]._id,
        price: 299,
        duration: 30,
        rating: 4.5,
        reviewCount: 456,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
        features: ['Certified electrician', 'Quick service', 'Safety guaranteed'],
        tags: ['electrician', 'electrical', 'repair']
      },
      {
        name: 'Plumbing Services',
        description: 'Expert plumbing repair and installation',
        category: categories[4]._id,
        price: 299,
        duration: 30,
        rating: 4.6,
        reviewCount: 543,
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500',
        features: ['Expert plumber', 'Quality work', 'Emergency service'],
        tags: ['plumber', 'plumbing', 'repair']
      },
      // Painting & Waterproofing
      {
        name: 'Interior Painting',
        description: 'Professional interior painting services',
        category: categories[5]._id,
        price: 4999,
        duration: 480,
        rating: 4.7,
        reviewCount: 234,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
        features: ['Professional painters', 'Quality paint', 'Clean finish'],
        tags: ['painting', 'interior', 'home']
      }
    ]);
    console.log('✅ Services created');

    // Create sample booking
    const booking = await Booking.create({
      user: users[1]._id,
      service: services[0]._id,
      serviceProvider: users[2]._id,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      scheduledTime: '14:00',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      status: 'confirmed',
      totalAmount: 499,
      paymentStatus: 'pending',
      paymentMethod: 'cash'
    });
    console.log('✅ Sample booking created');

    // Create completed booking for review
    const completedBooking = await Booking.create({
      user: users[1]._id,
      service: services[7]._id,
      serviceProvider: users[2]._id,
      scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      scheduledTime: '10:00',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      status: 'completed',
      totalAmount: 1699,
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    });

    // Create Review
    await Review.create({
      user: users[1]._id,
      service: services[7]._id,
      booking: completedBooking._id,
      rating: 5,
      comment: 'Excellent service! The cleaning team was very professional and thorough. Highly recommended!',
      isVerified: true,
      helpful: 12
    });
    console.log('✅ Sample review created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@quickfix.com');
    console.log('  Password: Admin@123');
    console.log('\nUser:');
    console.log('  Email: user@test.com');
    console.log('  Password: User@123');
    console.log('\nService Provider:');
    console.log('  Email: provider@test.com');
    console.log('  Password: Provider@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
