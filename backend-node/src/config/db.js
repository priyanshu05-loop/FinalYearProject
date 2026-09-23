import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const conn = await mongoose.connect(mongoUri || 'mongodb://localhost:27017/ai_interview_db');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      process.env.MONGODB_URI = mongoUri;
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB connected via memory server: ${conn.connection.host}`);
    } catch (memoryError) {
      console.error('MongoDB connection failed:', error.message);
      console.error('Memory Mongo fallback failed:', memoryError.message);
      process.exit(1);
    }
  }
};

export default connectDB;
