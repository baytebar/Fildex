import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fildex';
    
    // Connection options with proper timeouts
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false, // Disable mongoose buffering
    };
    
    await mongoose.connect(mongoUri, options);
    console.log("Connected to MongoDB successfully");
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}
