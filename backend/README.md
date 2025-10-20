# Project API Documentation

This project is a **Node.js + Express.js** backend with **MongoDB** for user and admin management. It includes authentication, profile management, and user interest roles.

---

## Base URL

```
http://localhost:5000/api/v1
```

---

## Table of Contents

* [Admin Routes](#admin-routes)

  * [Auth](#admin-auth)
  * [Dashboard Users](#dashboard-users)
  * [Interest Roles](#interest-roles)
* [User Routes](#user-routes)

  * [Auth](#user-auth)
  * [Profile](#profile)
* [Static Files](#static-files)

---

# Admin Routes

### 1. Admin Auth

#### **Register Admin**

```
POST /admin/auth/register
```

**Request Body**

```json
{
  "user_name": "admin1",
  "email": "admin1@example.com",
  "password": "password123"
}
```

**Response**

```json
{
  "status": 201,
  "message": "Admin created successfully",
  "data": {
    "id": "64fabc1234567890abcdef12",
    "user_name": "admin1",
    "email": "admin1@example.com"
  }
}
```

#### **Login Admin**

```
POST /admin/auth/login
```

**Request Body**

```json
{
  "identifier": "admin1",
  "password": "password123"
}
```

**Response**

```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "id": "64fabc1234567890abcdef12",
    "user_name": "admin1",
    "email": "admin1@example.com",
    "token": "jwt_token_here"
  }
}
```

#### **Reset Credentials**

```
PUT /admin/auth/reset-credentials
```

**Request Body**

```json
{
  "admin_name": "newAdminName",
  "new_password": "newPassword123"
}
```

**Response**

```json
{
  "status": 200,
  "message": "Credentials updated successfully",
  "data": {
    "id": "64fabc1234567890abcdef12",
    "user_name": "newAdminName",
    "email": "admin1@example.com"
  }
}
```

---

### 2. Dashboard Users

#### **Get All Users**

```
GET /admin/dashboard/users?page=1&limit=10
```

**Response**

```json
{
  "status": 200,
  "message": "Users fetched successfully",
  "data": {
    "totalUsers": 25,
    "currentPage": 1,
    "totalPages": 3,
    "limit": 10,
    "users": [
      {
        "_id": "64fabc1234567890abcdef34",
        "name": "John Doe",
        "email": "john@example.com",
        "contact": { "number": "1234567890", "country_code": "+91" },
        "jobTitles": ["64fabd1234567890abcdef56"]
      }
    ]
  }
}
```

#### **Get User by ID**

```
GET /admin/dashboard/user/:id
```

**Response**

```json
{
  "status": 200,
  "message": "User fetched successfully",
  "data": {
    "_id": "64fabc1234567890abcdef34",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 3. Interest Roles

#### **Create Role**

```
POST /admin/intrest-roles
```

**Request Body**

```json
{
  "name": "Developer"
}
```

**Response**

```json
{
  "status": 201,
  "message": "Interest role created successfully",
  "data": {
    "id": "64fabc1234567890abcdef78",
    "name": "Developer",
    "createdBy": "64fabc1234567890abcdef12"
  }
}
```

#### **Get All Roles**

```
GET /admin/intrest-roles?page=1&limit=10
```

**Response**

```json
{
  "status": 200,
  "message": "Roles fetched successfully",
  "data": {
    "pagination": { "total": 5, "page": 1, "pages": 1 },
    "roles": [
      { "_id": "64fabc1234567890abcdef78", "name": "Developer" }
    ]
  }
}
```

#### **Get Role by ID**

```
GET /admin/intrest-roles/:id
```

**Response**

```json
{
  "status": 200,
  "message": "Role fetched successfully",
  "data": {
    "_id": "64fabc1234567890abcdef78",
    "name": "Developer"
  }
}
```

#### **Update Role**

```
PUT /admin/intrest-roles/:id
```

**Request Body**

```json
{
  "name": "Senior Developer"
}
```

**Response**

```json
{
  "status": 200,
  "message": "Role updated successfully",
  "data": {
    "_id": "64fabc1234567890abcdef78",
    "name": "Senior Developer"
  }
}
```

#### **Delete Role (Soft Delete)**

```
DELETE /admin/intrest-roles/:id
```

**Response**

```json
{
  "status": 200,
  "message": "Role deleted successfully"
}
```

---

# User Routes

### 1. User Auth

#### **Register User**

```
POST /user/auth/register
```

**Request Body**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

**Response**

```json
{
  "status": 201,
  "message": "User created successfully",
  "data": {
    "id": "64fabc1234567890abcdef90",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "token": "jwt_token_here"
  }
}
```

#### **Login User**

```
POST /user/auth/login
```

**Request Body**

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response**

```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "id": "64fabc1234567890abcdef90",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "token": "jwt_token_here"
  }
}
```

---

### 2. User Profile

#### **Update Profile**

```
POST /user/profile/profile-update
```

**Request Body** (multipart/form-data)

```json
{
  "contact": { "number": "9876543210", "country_code": "+91" },
  "jobTitles": ["64fabc1234567890abcdef78"]
}
```

**Optional File:** `cv` (PDF)

**Response**

```json
{
  "status": 200,
  "message": "Profile updated successfully",
  "data": {
    "_id": "64fabc1234567890abcdef90",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "contact": { "number": "9876543210", "country_code": "+91" },
    "jobTitles": [
      { "_id": "64fabc1234567890abcdef78", "name": "Developer" }
    ],
    "cv": { "url": "public/uploads/64fabc1234567890abcdef90.pdf", "new": true }
  }
}
```

---

# Static Files

* **Uploads folder:** `/public/uploads`
* **Access files via URL:**

```
http://localhost:5000/api/v1/public/uploads/<filename>
```

---

# Notes

* **Authentication:** All protected routes require `Authorization: Bearer <token>` header.
* **Admin-only routes:** `/admin/dashboard/*` and `/admin/intrest-roles/*` require admin role.
* **Pagination:** `page` and `limit` query parameters are optional (defaults: `page=1, limit=10`).
