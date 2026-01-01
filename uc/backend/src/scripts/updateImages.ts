import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service';
import Category from '../models/Category';

dotenv.config();

const serviceImages: { [key: string]: string } = {
  'Hair Cut & Styling': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500',
  'Facial & Cleanup': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
  'Manicure & Pedicure': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
  'Haircut for Men': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500',
  'Shaving & Facial': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500',
  'AC Service & Repair': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
  'Washing Machine Repair': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500',
  'Deep Home Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
  'Pest Control': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500',
  'Electrician Services': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
  'Plumbing Services': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500',
  'Interior Painting': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500'
};

async function updateImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('📦 Connected to MongoDB');

    // Update all services with images
    for (const [serviceName, imageUrl] of Object.entries(serviceImages)) {
      const result = await Service.updateOne(
        { name: serviceName },
        { $set: { image: imageUrl } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated image for: ${serviceName}`);
      } else {
        console.log(`⚠️  Service not found or already has image: ${serviceName}`);
      }
    }

    // Update any services without images to have a default image
    const servicesWithoutImages = await Service.updateMany(
      { $or: [{ image: { $exists: false } }, { image: '' }, { image: 'default-service.jpg' }] },
      { $set: { image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500' } }
    );
    
    console.log(`✅ Updated ${servicesWithoutImages.modifiedCount} services with default images`);

    // Display all services with their images
    const allServices = await Service.find().select('name image');
    console.log('\n📋 All services:');
    allServices.forEach(service => {
      console.log(`  - ${service.name}: ${service.image || 'No image'}`);
    });

    console.log('\n✅ Image update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

updateImages();
