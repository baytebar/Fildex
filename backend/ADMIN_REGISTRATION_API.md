# Admin Registration API Documentation

## Overview
The Admin Registration API allows authenticated administrators to create new admin accounts in the system. This API includes proper validation, authentication, and security measures.

## API Endpoints

### 1. Admin Registration
**POST** `/api/v1/admin/auth/register`

Creates a new admin account. Requires authentication from an existing admin.

#### Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "user_name": "string (3-50 characters, unique)",
  "email": "string (valid email format, unique)",
  "password": "string (min 8 chars, must contain uppercase, lowercase, number, and special character)"
}
```

#### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character

#### Response Examples

**Success (201 Created)**
```json
{
  "success": true,
  "message": "Admin created",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "user_name": "newadmin",
    "email": "newadmin@fildex.com",
    "createdBy": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

**Error (400 Bad Request)**
```json
{
  "success": false,
  "message": "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special symbol."
}
```

**Error (409 Conflict)**
```json
{
  "success": false,
  "message": "Username already exist"
}
```

### 2. Admin Login
**POST** `/api/v1/admin/auth/login`

Authenticates an admin and returns a JWT token.

#### Request Body
```json
{
  "identifier": "string (email or username)",
  "password": "string"
}
```

#### Response
```json
{
  "success": true,
  "message": "login successfull",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "user_name": "admin",
    "email": "admin@fildex.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get All Admins
**GET** `/api/v1/admin/admins`

Retrieves a paginated list of all admins.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### Response
```json
{
  "success": true,
  "message": "Admins fetched successfully",
  "data": {
    "pagination": {
      "total": 5,
      "page": 1,
      "pages": 1
    },
    "admins": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "user_name": "admin1",
        "email": "admin1@fildex.com",
        "createdBy": {
          "user_name": "superadmin",
          "email": "superadmin@fildex.com"
        },
        "createdAt": "2023-09-05T10:30:00.000Z"
      }
    ]
  }
}
```

## Security Features

### Authentication
- JWT-based authentication
- Token expires in 1 day
- Role-based access control

### Password Security
- Passwords are hashed using bcrypt
- Strong password requirements enforced
- No password returned in responses

### Validation
- Input validation using Joi
- Email format validation
- Username uniqueness validation
- Email uniqueness validation

## Error Handling

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (insufficient permissions)
- `409` - Conflict (duplicate username/email)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## Usage Examples

### Using curl

#### 1. Login to get token
```bash
curl -X POST http://localhost:5000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@fildex.com",
    "password": "AdminPass123!"
  }'
```

#### 2. Create new admin
```bash
curl -X POST http://localhost:5000/api/v1/admin/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_name": "newadmin",
    "email": "newadmin@fildex.com",
    "password": "NewPass123!"
  }'
```

#### 3. Get all admins
```bash
curl -X GET http://localhost:5000/api/v1/admin/admins \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/v1/admin/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    identifier: 'admin@fildex.com',
    password: 'AdminPass123!'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// Create new admin
const registerResponse = await fetch('http://localhost:5000/api/v1/admin/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    user_name: 'newadmin',
    email: 'newadmin@fildex.com',
    password: 'NewPass123!'
  })
});

const registerData = await registerResponse.json();
console.log(registerData);
```

## Testing

Run the test script to verify the API functionality:

```bash
cd backend
node test-admin-registration-api.js
```

## Database Schema

### Admin Model
```javascript
{
  user_name: String (required, unique)
  email: String (required, unique)
  password: String (required, hashed)
  createdBy: ObjectId (ref: 'Admin', default: null)
  createdAt: Date
  updatedAt: Date
}
```

## Notes

1. **First Admin**: The first admin account typically needs to be created directly in the database or through a special setup process.

2. **Authentication Required**: Admin registration requires an existing admin to be authenticated.

3. **Password Security**: Passwords are automatically hashed before storage.

4. **Audit Trail**: The `createdBy` field tracks which admin created each account.

5. **Token Expiration**: JWT tokens expire after 1 day for security.

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Make sure you're logged in and have a valid token
2. **409 Conflict**: Username or email already exists
3. **400 Bad Request**: Check password requirements and input validation
4. **403 Forbidden**: Ensure you have admin role permissions

### Password Requirements Reminder
- At least 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)
