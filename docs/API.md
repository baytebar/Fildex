# Fildex Solutions - API Documentation

## 🌐 Base URL

```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

## 🔐 Authentication

Most endpoints require authentication via JWT tokens in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## 📚 API Endpoints

### 🔑 Authentication Endpoints

#### User Authentication

**Register User**
```http
POST /user/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "User created successfully",
  "data": {
    "id": "64fabc1234567890abcdef90",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
}
```

**Login User**
```http
POST /user/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "id": "64fabc1234567890abcdef90",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
}
```

#### Admin Authentication

**Register Admin**
```http
POST /admin/auth/register
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "user_name": "admin1",
  "email": "admin@fildex.com",
  "password": "admin123"
}
```

**Login Admin**
```http
POST /admin/auth/login
Content-Type: application/json

{
  "identifier": "admin1",
  "password": "admin123"
}
```

**Create Default Admin (No Auth Required)**
```http
POST /admin/auth/register-default
Content-Type: application/json

{
  "user_name": "admin",
  "email": "admin@fildex.com",
  "password": "admin123"
}
```

**Create Emergency Admin (No Auth Required)**
```http
POST /admin/auth/register-emergency
Content-Type: application/json

{
  "user_name": "emergency_admin",
  "email": "emergency@fildex.com",
  "password": "emergency123"
}
```

**Create Super Admin (Token Protected)**
```http
POST /admin/auth/register-super-admin
Content-Type: application/json
X-Super-Admin-Token: <super_admin_creation_token>

{
  "user_name": "super_admin",
  "email": "super@fildex.com",
  "password": "super123"
}
```

### 👤 User Management

#### User Profile

**Update User Profile**
```http
POST /user/profile/profile-update
Authorization: Bearer <user_token>
Content-Type: multipart/form-data

{
  "contact": {
    "number": "1234567890",
    "country_code": "+1"
  },
  "jobTitles": ["64fabc1234567890abcdef78"]
}
```

**File Upload (CV):**
- Field name: `cv`
- File type: PDF
- Max size: 10MB

**Response:**
```json
{
  "status": 200,
  "message": "Profile updated successfully",
  "data": {
    "_id": "64fabc1234567890abcdef90",
    "name": "John Doe",
    "email": "john@example.com",
    "contact": {
      "number": "1234567890",
      "country_code": "+1"
    },
    "jobTitles": [
      {
        "_id": "64fabc1234567890abcdef78",
        "name": "Software Developer"
      }
    ],
    "cv": {
      "url": "public/uploads/64fabc1234567890abcdef90.pdf",
      "new": true
    }
  }
}
```

### 📄 Resume Management

#### Upload Resume (Public - No Auth Required)

**Upload CV with User Info**
```http
POST /resume/upload
Content-Type: multipart/form-data

Form Data:
- resume: <file> (PDF file)
- name: "John Doe"
- email: "john@example.com"
- contact: '{"number": "1234567890", "country_code": "+1"}' (JSON string)
- role: "Software Developer" (optional)
```

**Response:**
```json
{
  "status": 201,
  "message": "Resume uploaded successfully",
  "data": {
    "_id": "64fabc1234567890abcdef12",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "Software Developer",
    "resumeUrl": "https://your-bucket.com/resumes/john-doe-resume.pdf",
    "status": "active",
    "uploadedAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-04-15T10:30:00Z"
  }
}
```

#### Admin Resume Management

**Get All Resumes**
```http
GET /resume/
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Resumes fetched successfully",
  "data": [
    {
      "_id": "64fabc1234567890abcdef12",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "Software Developer",
      "resumeUrl": "https://your-bucket.com/resumes/john-doe-resume.pdf",
      "status": "active",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2024-04-15T10:30:00Z"
    }
  ]
}
```

**Get Resume by ID**
```http
GET /resume/64fabc1234567890abcdef12
Authorization: Bearer <admin_token>
```

**Get Resume Download URL**
```http
GET /resume/64fabc1234567890abcdef12/download
Authorization: Bearer <admin_token>
```

**Update Resume Status**
```http
PUT /resume/64fabc1234567890abcdef12
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "active"
}
```

**Update Resume Expiry**
```http
PUT /resume/64fabc1234567890abcdef12/expiry
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "expiryDate": "2024-06-15T23:59:59Z"
}
```

**Check Expired Resumes**
```http
POST /resume/check-expired
Authorization: Bearer <admin_token>
```

**Delete Resume**
```http
DELETE /resume/64fabc1234567890abcdef12
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Resume deleted successfully"
}
```

### 💼 Job Management

#### Job Postings

**Create Job Posting**
```http
POST /job-posting/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Senior Software Developer",
  "department": "Engineering",
  "location": "Cork, Ireland",
  "employmentType": "Full-time",
  "salary": "€60,000 - €80,000",
  "description": "We are looking for a senior software developer...",
  "requirements": [
    "5+ years of experience",
    "Proficiency in React and Node.js",
    "Experience with cloud platforms"
  ],
  "expiryDate": "2024-06-15T23:59:59Z"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Job posting created successfully",
  "data": {
    "_id": "64fabc1234567890abcdef34",
    "title": "Senior Software Developer",
    "department": "Engineering",
    "location": "Cork, Ireland",
    "employmentType": "Full-time",
    "salary": "€60,000 - €80,000",
    "status": "active",
    "applicantCount": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "expiryDate": "2024-06-15T23:59:59Z"
  }
}
```

**Get All Job Postings (Admin)**
```http
GET /job-posting/
Authorization: Bearer <admin_token>
```

**Get Job Posting by ID**
```http
GET /job-posting/64fabc1234567890abcdef34
Authorization: Bearer <admin_token>
```

**Update Job Posting**
```http
PUT /job-posting/64fabc1234567890abcdef34
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Lead Software Developer",
  "salary": "€70,000 - €90,000"
}
```

**Pause Job Posting**
```http
PUT /job-posting/64fabc1234567890abcdef34/pause
Authorization: Bearer <admin_token>
```

**Resume Job Posting**
```http
PUT /job-posting/64fabc1234567890abcdef34/resume
Authorization: Bearer <admin_token>
```

**Delete Job Posting**
```http
DELETE /job-posting/64fabc1234567890abcdef34
Authorization: Bearer <admin_token>
```

#### Public Job Listings

**Get Active Job Postings (Public)**
```http
GET /public/job-postings
```

**Response:**
```json
{
  "status": 200,
  "message": "Job postings fetched successfully",
  "data": [
    {
      "_id": "64fabc1234567890abcdef34",
      "title": "Senior Software Developer",
      "department": "Engineering",
      "location": "Cork, Ireland",
      "employmentType": "Full-time",
      "salary": "€60,000 - €80,000",
      "description": "We are looking for a senior software developer...",
      "requirements": [
        "5+ years of experience",
        "Proficiency in React and Node.js"
      ],
      "applicantCount": 5,
      "expiryDate": "2024-06-15T23:59:59Z"
    }
  ]
}
```

### 🏢 Department Management

**Create Department**
```http
POST /admin/departments
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Engineering",
  "description": "Software development and engineering team"
}
```

**Get All Departments**
```http
GET /admin/departments
Authorization: Bearer <admin_token>
```

**Get Department by ID**
```http
GET /admin/departments/64fabc1234567890abcdef56
Authorization: Bearer <admin_token>
```

**Update Department**
```http
PUT /admin/departments/64fabc1234567890abcdef56
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Software Engineering",
  "description": "Advanced software development team"
}
```

**Hold Department**
```http
PUT /admin/departments/64fabc1234567890abcdef56/hold
Authorization: Bearer <admin_token>
```

**Reactivate Department**
```http
PUT /admin/departments/64fabc1234567890abcdef56/reactivate
Authorization: Bearer <admin_token>
```

### 💼 Job Titles Management

**Create Job Title**
```http
POST /admin/job-titles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Software Developer",
  "description": "Full-stack software development role"
}
```

**Get All Job Titles (Admin)**
```http
GET /admin/job-titles
Authorization: Bearer <admin_token>
```

**Get Active Job Titles (Public)**
```http
GET /admin/job-titles/active
```

**Get Job Title by ID**
```http
GET /admin/job-titles/64fabc1234567890abcdef78
Authorization: Bearer <admin_token>
```

**Update Job Title**
```http
PUT /admin/job-titles/64fabc1234567890abcdef78
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Senior Software Developer",
  "description": "Senior full-stack software development role"
}
```

**Pause Job Title**
```http
PUT /admin/job-titles/64fabc1234567890abcdef78/pause
Authorization: Bearer <admin_token>
```

**Resume Job Title**
```http
PUT /admin/job-titles/64fabc1234567890abcdef78/resume
Authorization: Bearer <admin_token>
```

**Delete Job Title**
```http
DELETE /admin/job-titles/64fabc1234567890abcdef78
Authorization: Bearer <admin_token>
```

### 📊 Admin Dashboard

**Get All Users**
```http
GET /admin/dashboard/users
Authorization: Bearer <admin_token>
```

**Get User by ID**
```http
GET /admin/dashboard/user/64fabc1234567890abcdef90
Authorization: Bearer <admin_token>
```

**Delete User**
```http
DELETE /admin/dashboard/user/64fabc1234567890abcdef90
Authorization: Bearer <admin_token>
```

**Get All Admins**
```http
GET /admin/admins
Authorization: Bearer <admin_token>
```

**Delete Admin (Super Admin Only)**
```http
DELETE /admin/admins/64fabc1234567890abcdef12
Authorization: Bearer <super_admin_token>
```

### 🔔 Notifications

**Get Recent CVs**
```http
GET /admin/notifications/recent-cvs
Authorization: Bearer <admin_token>
```

**Mark Notification as Read**
```http
PUT /admin/notifications/64fabc1234567890abcdef12/read
Authorization: Bearer <admin_token>
```

## 🔔 Real-time Notifications

### Socket.IO Events

**Client Connection**
```javascript
// Connect to server
const socket = io('http://localhost:5000');

// Join admin room for notifications
socket.emit('join-admin');
```

**Server Events**

**New CV Upload Notification**
```javascript
socket.on('new-cv-upload', (data) => {
  console.log('New CV uploaded:', data);
  // data contains: name, email, role, phone, timestamp
});
```

**New Job Application**
```javascript
socket.on('new-job-application', (data) => {
  console.log('New job application:', data);
  // data contains: jobTitle, applicantName, email, timestamp
});
```

## 📁 File Management

### Static File Access

**Resume Files**
```
GET /api/v1/public/uploads/<filename>
```

**Example:**
```
http://localhost:5000/api/v1/public/uploads/64fabc1234567890abcdef90.pdf
```

### File Upload Limits

- **Max file size**: 10MB
- **Allowed types**: PDF only
- **Storage**: Hetzner Cloud Storage (with local fallback)
- **Retention**: 90 days (configurable)
- **Validation**: File type and size validation on upload

## 🚨 Error Handling

### Standard Error Response

```json
{
  "status": 400,
  "message": "Validation error",
  "error": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Error Examples

**Validation Error**
```json
{
  "status": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

**Authentication Error**
```json
{
  "status": 401,
  "message": "Unauthorized access",
  "error": "Invalid or expired token"
}
```

## 🔒 Security Features

### Authentication
- JWT tokens with expiration
- Separate admin and user tokens
- Password hashing with bcrypt

### Authorization
- Role-based access control
- Admin-only endpoints protection
- User data isolation

### Data Validation
- Input sanitization
- File type validation
- Size limits enforcement

### CORS Configuration
- Configured for frontend domain
- Credentials support
- Preflight handling

## 📈 Rate Limiting

### Current Limits
- **Authentication**: 5 attempts per minute
- **File Upload**: 10 uploads per hour
- **API Calls**: 100 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🧪 Testing

### Test Endpoints

**Health Check**
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "database": "connected",
  "storage": "connected"
}
```

### Postman Collection

Import the provided Postman collection for easy API testing:
- Authentication flows
- CRUD operations
- Error scenarios
- File uploads

## 📝 API Versioning

Current version: `v1`

Version is included in the base URL:
```
http://localhost:5000/api/v1/endpoint
```

Future versions will be backward compatible with deprecation notices.

## 🔄 Webhooks

### CV Upload Webhook
```http
POST /webhooks/cv-upload
Content-Type: application/json

{
  "event": "cv.uploaded",
  "data": {
    "resumeId": "64fabc1234567890abcdef12",
    "applicantName": "John Doe",
    "email": "john@example.com",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 📞 Support

For API support:
- Check error responses for detailed messages
- Review request/response examples
- Test with Postman collection
- Check server logs for debugging

---

**Last Updated**: January 2025  
**API Version**: v1.0.0

## 📝 API Summary

### Available Endpoints by Category

#### Public Endpoints (No Authentication Required)
- `POST /resume/upload` - Upload CV
- `GET /public/job-postings` - Get active job postings
- `GET /admin/job-titles/active` - Get active job titles

#### User Endpoints (User Authentication Required)
- `POST /user/auth/register` - Register user
- `POST /user/auth/login` - Login user
- `GET /user/profile` - Get user profile
- `POST /user/profile/profile-update` - Update user profile

#### Admin Endpoints (Admin Authentication Required)
- `POST /admin/auth/register` - Register admin
- `POST /admin/auth/login` - Login admin
- `GET /admin/dashboard/users` - Get all users
- `GET /admin/dashboard/user/:id` - Get user by ID
- `DELETE /admin/dashboard/user/:id` - Delete user
- `GET /admin/admins` - Get all admins
- `DELETE /admin/admins/:id` - Delete admin (super admin only)

#### Resume Management (Admin Only)
- `GET /resume/` - Get all resumes
- `GET /resume/:id` - Get resume by ID
- `GET /resume/:id/download` - Get resume download URL
- `PUT /resume/:id` - Update resume status
- `PUT /resume/:id/expiry` - Update resume expiry
- `POST /resume/check-expired` - Check expired resumes
- `DELETE /resume/:id` - Delete resume

#### Job Management (Admin Only)
- `GET /job-posting/` - Get all job postings
- `POST /job-posting/` - Create job posting
- `GET /job-posting/:id` - Get job posting by ID
- `PUT /job-posting/:id` - Update job posting
- `PUT /job-posting/:id/pause` - Pause job posting
- `PUT /job-posting/:id/resume` - Resume job posting
- `DELETE /job-posting/:id` - Delete job posting

#### Department Management (Admin Only)
- `GET /admin/departments` - Get all departments
- `POST /admin/departments` - Create department
- `GET /admin/departments/:id` - Get department by ID
- `PUT /admin/departments/:id` - Update department
- `PUT /admin/departments/:id/hold` - Hold department
- `PUT /admin/departments/:id/reactivate` - Reactivate department

#### Job Titles Management
- `GET /admin/job-titles` - Get all job titles (admin)
- `POST /admin/job-titles` - Create job title (admin)
- `GET /admin/job-titles/:id` - Get job title by ID (admin)
- `PUT /admin/job-titles/:id` - Update job title (admin)
- `PUT /admin/job-titles/:id/pause` - Pause job title (admin)
- `PUT /admin/job-titles/:id/resume` - Resume job title (admin)
- `DELETE /admin/job-titles/:id` - Delete job title (admin)

#### Notifications (Admin Only)
- `GET /admin/notifications/recent-cvs` - Get recent CVs
- `PUT /admin/notifications/:id/read` - Mark notification as read
