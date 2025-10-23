#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import s3Client from './src/config/s3.config.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function debugResumeUpload() {
  console.log('=== Resume Upload Debug Script ===\n');

  // 1. Check environment variables
  console.log('1. Environment Variables Check:');
  console.log('================================');
  const requiredEnvVars = [
    'HETZNER_BUCKET',
    'HETZNER_ENDPOINT', 
    'HETZNER_ACCESS_KEY',
    'HETZNER_SECRET_KEY',
    'MONGO_URI'
  ];

  let envVarsMissing = false;
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Set (${value.length} characters)`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      envVarsMissing = true;
    }
  });

  if (envVarsMissing) {
    console.log('\n❌ Some environment variables are missing. Please check your .env file.');
    return;
  }

  // 2. Test database connection
  console.log('\n2. Database Connection Test:');
  console.log('============================');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connection successful');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Port: ${mongoose.connection.port}`);
  } catch (error) {
    console.log('❌ MongoDB connection failed:');
    console.log('Error:', error.message);
    return;
  }

  // 3. Test S3 connection
  console.log('\n3. S3/Hetzner Cloud Storage Test:');
  console.log('==================================');
  try {
    // Create a small test file
    const testContent = Buffer.from('Test resume upload content');
    const testKey = `test-uploads/test-${Date.now()}.txt`;
    
    const params = {
      Bucket: process.env.HETZNER_BUCKET,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    };

    console.log('Uploading test file...');
    const uploadResult = await s3Client.send(new PutObjectCommand(params));
    console.log('✅ S3 upload successful');
    console.log('Test file URL:', `${process.env.HETZNER_ENDPOINT}/${process.env.HETZNER_BUCKET}/${testKey}`);
  } catch (error) {
    console.log('❌ S3 upload failed:');
    console.log('Error:', error.message);
    console.log('Error code:', error.code);
    console.log('Error name:', error.name);
    return;
  }

  // 4. Test Resume model
  console.log('\n4. Resume Model Test:');
  console.log('======================');
  try {
    const Resume = (await import('./src/admin/models/resume.model.js')).default;
    
    const testResumeData = {
      name: 'Test User',
      email: 'test@example.com',
      contact: { number: '1234567890', country_code: '+1' },
      role: 'Test Role',
      'resume-link': `${process.env.HETZNER_ENDPOINT}/${process.env.HETZNER_BUCKET}/test-resume.pdf`,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    };

    const testResume = new Resume(testResumeData);
    const savedResume = await testResume.save();
    console.log('✅ Resume model test successful');
    console.log('Saved resume ID:', savedResume._id);
    
    // Clean up test data
    await Resume.findByIdAndDelete(savedResume._id);
    console.log('✅ Test data cleaned up');
  } catch (error) {
    console.log('❌ Resume model test failed:');
    console.log('Error:', error.message);
    console.log('Error name:', error.name);
    return;
  }

  console.log('\n🎉 All tests passed! Your resume upload should work correctly.');
  console.log('\nIf you\'re still getting 500 errors, check the server logs for the detailed debug information.');
}

// Run the debug script
debugResumeUpload()
  .then(() => {
    console.log('\nDebug script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nDebug script failed:', error);
    process.exit(1);
  });
