import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('Connected to MongoDB...');
  } catch (error) {
    console.error(`Failed to connect to MongoDB : ${error.message}`);
    process.exit(1);
  }
}