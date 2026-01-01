import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes
    await createIndexes();
    
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Create database indexes for optimization
const createIndexes = async (): Promise<void> => {
  try {
    const User = (await import('../models/User')).default;
    const Service = (await import('../models/Service')).default;
    const Booking = (await import('../models/Booking')).default;
    
    await User.createIndexes();
    await Service.createIndexes();
    await Booking.createIndexes();
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('Index creation error:', (error as Error).message);
  }
};

export default connectDB;
