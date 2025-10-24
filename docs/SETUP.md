# Fildex Solutions - Setup Guide

## 📋 Prerequisites

Before setting up the Fildex platform, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Optional but Recommended
- **MongoDB Compass** - [Download](https://www.mongodb.com/products/compass)
- **Postman** - [Download](https://www.postman.com/downloads/)

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Fildex
```

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```bash
   # Edit .env file with your configuration
   nano .env
   ```

   **Required Environment Variables:**
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/fildex
   
   # JWT Secrets
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_ADMIN_SECRET=your-super-secret-admin-jwt-key-here
   
   # Cloud Storage (Hetzner Cloud)
   HETZNER_ENDPOINT=https://your-bucket-name.your-region.hetzner.cloud
   HETZNER_ACCESS_KEY=your-hetzner-access-key
   HETZNER_SECRET_KEY=your-hetzner-secret-key
   HETZNER_BUCKET=your-bucket-name
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

### Step 3: Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

### Step 4: Database Setup

1. **Start MongoDB service**
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

2. **Verify MongoDB connection**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Create database named `fildex`

## 🔧 Configuration Details

### MongoDB Configuration

The application uses MongoDB with the following collections:
- `users` - User accounts and profiles
- `admins` - Admin accounts
- `resumes` - CV/resume data
- `jobpostings` - Job postings
- `departments` - Company departments
- `jobtitles` - Job titles and roles

### Cloud Storage Setup (Hetzner)

1. **Create Hetzner Cloud account**
   - Visit [Hetzner Cloud](https://www.hetzner.com/cloud)
   - Create a new project

2. **Create Object Storage**
   - Go to Object Storage in your project
   - Create a new bucket
   - Note down the endpoint URL

3. **Generate Access Keys**
   - Go to Access Keys section
   - Create new access key
   - Save the access key and secret key

### Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

For other providers, adjust `EMAIL_HOST` and `EMAIL_PORT` accordingly.

## 🧪 Testing the Setup

### Backend API Test

1. **Check server status**
   ```bash
   curl http://localhost:5000/api/v1
   ```

2. **Test database connection**
   ```bash
   # The server should log MongoDB connection status
   ```

### Frontend Test

1. **Open browser**
   - Navigate to `http://localhost:5173`
   - You should see the Fildex homepage

2. **Test admin access**
   - Navigate to `http://localhost:5173/admin-login`
   - Use default credentials (if configured)

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

#### Environment Variables Not Loading
- Ensure `.env` file is in the backend root directory
- Check for typos in variable names
- Restart the server after changes

#### Frontend Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Logs and Debugging

#### Backend Logs
```bash
# Check server logs
npm run dev

# Look for MongoDB connection messages
# Look for server startup messages
```

#### Frontend Logs
```bash
# Check browser console for errors
# Check network tab for API calls
```

## 📁 Project Structure After Setup

```
Fildex/
├── backend/
│   ├── node_modules/       # Dependencies
│   ├── src/               # Source code
│   ├── .env               # Environment variables
│   ├── package.json        # Dependencies
│   └── server.js          # Main server file
├── frontend/
│   ├── node_modules/      # Dependencies
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies
│   └── vite.config.js    # Vite configuration
└── docs/                 # Documentation
```

## 🚀 Next Steps

After successful setup:

1. **Create Admin Account**
   - Use the admin registration API
   - Or use the admin login interface

2. **Test Features**
   - Upload a test CV
   - Create a job posting
   - Test the chatbot functionality


## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all prerequisites are installed
4. Verify environment variables are correct


