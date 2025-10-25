import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export default async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    process.exit(1);
  }
}