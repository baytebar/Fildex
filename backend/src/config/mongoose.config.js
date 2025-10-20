import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export default async function connectDB() {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
  } catch (error) {
    console.error(`Failed to connect to MongoDB : ${error.message}`);
    process.exit(1);
  }
}