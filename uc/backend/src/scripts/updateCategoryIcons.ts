import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category';

dotenv.config();

const categoryIcons: { [key: string]: string } = {
  'Salon for Women': 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_72d18950.png',
  'Salon for Men': 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_a5704a40.png',
  'AC & Appliance Repair': 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_7fbf42c0.png',
  'Cleaning & Pest Control': 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_ba1b2ee0.png',
  'Electrician, Plumber & Carpenter': 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_7d5f3d80.png',
  'Painting & Waterproofing': 'https://res.cloudinary.com/urbanclap/image/upload/categories/category_v2/category_15e6e1c0.png'
};

async function updateCategoryIcons() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('📦 Connected to MongoDB');

    // Update all categories with icons
    for (const [categoryName, iconUrl] of Object.entries(categoryIcons)) {
      const result = await Category.updateOne(
        { name: categoryName },
        { $set: { icon: iconUrl } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated icon for: ${categoryName}`);
      } else {
        console.log(`⚠️  Category not found or already has icon: ${categoryName}`);
      }
    }

    // Display all categories with their icons
    const allCategories = await Category.find().select('name icon');
    console.log('\n📋 All categories:');
    allCategories.forEach(category => {
      console.log(`  - ${category.name}: ${category.icon || 'No icon'}`);
    });

    console.log('\n✅ Category icon update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating icons:', error);
    process.exit(1);
  }
}

updateCategoryIcons();
