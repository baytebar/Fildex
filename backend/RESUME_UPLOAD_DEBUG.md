# Resume Upload Debug Guide

## Issue: 500 Internal Server Error on Resume Upload

The resume upload endpoint is returning a 500 Internal Server Error. This guide will help you debug and fix the issue.

## Quick Fix Steps

### 1. Run the Debug Script

```bash
cd backend
node debug-resume-upload.js
```

This script will check:
- Environment variables
- Database connection
- S3/Hetzner Cloud Storage connection
- Resume model functionality

### 2. Check Environment Variables

Make sure your `.env` file contains all required variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/fildex
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/fildex

# Hetzner Cloud Storage Configuration
HETZNER_BUCKET=your-bucket-name
HETZNER_ENDPOINT=https://your-bucket-name.your-region.your-provider.com
HETZNER_ACCESS_KEY=your-access-key
HETZNER_SECRET_KEY=your-secret-key

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Common Issues and Solutions

#### Missing Environment Variables
- **Error**: "Missing cloud storage credentials"
- **Solution**: Set all HETZNER_* environment variables in your .env file

#### Database Connection Issues
- **Error**: MongoDB connection failed
- **Solution**: Check your MONGO_URI and ensure MongoDB is running

#### S3/Hetzner Cloud Storage Issues
- **Error**: S3 upload failed
- **Solution**: Verify your Hetzner credentials and bucket permissions

#### File Upload Issues
- **Error**: Multer errors
- **Solution**: Check file size (max 5MB) and file type (PDF, DOC, DOCX only)

### 4. Enhanced Error Logging

The resume upload controller now includes detailed logging. Check your server logs for:

```
=== Resume Upload Debug ===
Request body: { name: '...', email: '...', ... }
Request file: { originalname: '...', mimetype: '...', size: ... }
=== Environment Variables Check ===
HETZNER_BUCKET: Set/Missing
...
```

### 5. Testing the Fix

1. Start your server: `npm run dev`
2. Try uploading a resume through the frontend
3. Check the server logs for detailed debug information
4. The logs will show exactly where the process fails

### 6. File Requirements

- **File types**: PDF, DOC, DOCX only
- **File size**: Maximum 5MB
- **Required fields**: name, email
- **Optional fields**: contact, role

### 7. API Endpoint

The resume upload endpoint is:
```
POST http://46.62.206.205/api/v1/resume/upload
```

With form data:
- `resume`: File (required)
- `name`: String (required)
- `email`: String (required)
- `contact`: JSON string (optional)
- `role`: String (optional)

## Next Steps

1. Run the debug script to identify the specific issue
2. Fix any missing environment variables
3. Test the upload again
4. Check server logs for detailed error information

The enhanced error logging will help you identify exactly where the upload process is failing.

