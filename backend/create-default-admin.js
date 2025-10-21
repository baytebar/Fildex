import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import Admin model
import Admin from './src/admin/models/admin.model.js';

const defaultAdminData = {
  user_name: 'admin',
  email: 'admin@fildex.com',
  password: 'AdminPass123!'
};

async function createDefaultAdmin() {
  try {
    console.log('🔧 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('⚠️  Admin already exists in database:');
      console.log(`   Username: ${existingAdmin.user_name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      return;
    }

    console.log('🔐 Creating default admin account...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(defaultAdminData.password, 10);

    // Create the default admin
    const newAdmin = await Admin.create({
      user_name: defaultAdminData.user_name,
      email: defaultAdminData.email,
      password: hashedPassword,
      createdBy: null // First admin has no creator
    });

    console.log('✅ Default admin created successfully!');
    console.log('📋 Admin Details:');
    console.log(`   ID: ${newAdmin._id}`);
    console.log(`   Username: ${newAdmin.user_name}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Created: ${newAdmin.createdAt}`);
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log(`   Email/Username: ${defaultAdminData.email}`);
    console.log(`   Password: ${defaultAdminData.password}`);
    console.log('');
    console.log('🌐 You can now login at: http://localhost:5000/api/v1/admin/auth/login');

  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run the script
createDefaultAdmin().catch(console.error);
