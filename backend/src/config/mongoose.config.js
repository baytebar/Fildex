import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export default async function connectDB() {
  try {
    console.log('=== MongoDB Connection Details ===');
    console.log('MONGO_URI:', process.env.MONGO_URI);
    console.log('Connection string length:', process.env.MONGO_URI?.length);
    console.log('Environment variables loaded:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Successfully connected to MongoDB!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    process.exit(1);
  }
}