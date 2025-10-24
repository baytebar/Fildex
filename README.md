# Fildex Solutions - Digital Training & Recruitment Platform

## 🚀 Overview

Fildex Solutions is a comprehensive digital platform that combines IT training services with recruitment capabilities. The platform provides skill-based training programs and serves as a bridge between job seekers and employers through an integrated CV management and job posting system.

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4.x with custom components
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Storage**: Hetzner Cloud Storage (S3-compatible)
- **Real-time**: Socket.IO
- **Security**: Helmet, CORS, bcryptjs

## 🎯 Key Features

### For Job Seekers
- **CV Upload**: Upload resumes with automatic text extraction
- **Job Applications**: Apply to specific job postings
- **Talent Pool**: Submit CV to general talent pool
- **Real-time Notifications**: Get notified about application status
- **Interactive Chatbot**: AI-powered resume assistance

### For Employers/Admins
- **Admin Dashboard**: Comprehensive management interface
- **CV Management**: View, filter, and manage uploaded resumes
- **Job Posting**: Create and manage job opportunities
- **Real-time Notifications**: Get notified of new applications
- **Analytics**: Track application metrics and trends

### For Training
- **Course Management**: Structured training programs
- **Skill Assessment**: Evaluate candidate capabilities
- **Certification**: Issue completion certificates
- **Progress Tracking**: Monitor learning outcomes

## 🛠️ Technology Stack

### Frontend Technologies
```
React 19.1.1
├── Vite (Build Tool)
├── Tailwind CSS 4.x (Styling)
├── Redux Toolkit (State Management)
├── React Router DOM (Routing)
├── Framer Motion (Animations)
├── Radix UI (Component Library)
├── Socket.IO Client (Real-time)
└── Sonner (Notifications)
```

### Backend Technologies
```
Node.js + Express.js
├── MongoDB (Database)
├── Mongoose (ODM)
├── JWT (Authentication)
├── Socket.IO (Real-time)
├── Multer (File Upload)
├── AWS SDK (Cloud Storage)
├── Nodemailer (Email)
└── Helmet (Security)
```

## 📁 Project Structure

```
Fildex/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── admin/          # Admin-specific controllers
│   │   ├── config/         # Database & storage config
│   │   ├── controller/     # User controllers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── Admin/          # Admin dashboard components
│   │   ├── Client/         # Public-facing components
│   │   ├── components/     # Shared UI components
│   │   ├── features/       # Redux slices
│   │   ├── services/        # API services
│   │   └── utils/          # Helper functions
│   └── package.json
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Fildex
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:5173/admin

## 🔧 Environment Configuration

### Backend Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/fildex

# JWT
JWT_SECRET=your-jwt-secret
JWT_ADMIN_SECRET=your-admin-jwt-secret

# Cloud Storage (Hetzner)
HETZNER_ENDPOINT=your-hetzner-endpoint
HETZNER_ACCESS_KEY=your-access-key
HETZNER_SECRET_KEY=your-secret-key
HETZNER_BUCKET=your-bucket-name

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password

# Server
PORT=5000
NODE_ENV=development
```

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed installation instructions
- [API Documentation](docs/API.md) - Complete API reference
- [Feature Guide](docs/FEATURES.md) - Feature implementation details
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development**: Baytebar
- **Design**: Modern UI/UX with glassmorphism effects
- **Architecture**: Scalable microservices approach

## 🔮 Future Roadmap

- [ ] LMS Integration
- [ ] Advanced Analytics Dashboard
- [ ] Mobile Application
- [ ] AI-Powered Job Matching
- [ ] Video Interview Integration
- [ ] Multi-language Support

---

**Fildex Solutions** - Empowering teams with cutting-edge IT training and digital solutions.
