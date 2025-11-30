# InsightX API Documentation

## Overview

InsightX is a feedback collection and analytics platform. This documentation covers all available endpoints for authentication, user management, form management, and feedback submission/retrieval.

**Base URL:** `https://insightx-f5t5.onrender.com`

**Version:** 1.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Form Endpoints](#form-endpoints)
5. [Feedback Endpoints](#feedback-endpoints)
6. [Error Codes](#error-codes)

---

## Authentication

InsightX uses JWT (JSON Web Tokens) for authentication.

### Access Token

- Purpose: Used for authenticated dashboard requests
- Storage: HTTP-only cookies
- Expiry: 1 hour

### API Token

- Purpose: Used for server-to-server API requests
- Storage: User must store securely
- Expiry: 30 days

---

## Authentication Endpoints

### POST /auth/login

Login with email and password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "message": "User login successful",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Unverified - 403):**

```json
{
  "error": "User account is not verified",
  "unverified": true,
  "email": "user@example.com"
}
```

---

### GET /auth/logout

Logout and clear the access token cookie.

**Response (Success - 200):**

```json
{
  "message": "User logout successful"
}
```

---

## User Endpoints

### POST /users

Register a new user account.

**Request:**

```json
{
  "organizationName": "My Company",
  "email": "admin@company.com",
  "password": "securePassword123"
}
```

**Response (Success - 201):**

```json
{
  "message": "Account created. Check your email for OTP.",
  "newUser": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@company.com",
    "organizationName": "My Company"
  }
}
```

**Notes:**

- OTP will be sent to email
- OTP expires in 30 minutes
- Password must be at least 8 characters

---

### PUT /users/verify

Verify email using OTP.

**Request:**

```json
{
  "email": "admin@company.com",
  "otp": "123456"
}
```

**Response (Success - 200):**

```json
{
  "message": "User verified successfully"
}
```

**Response (Invalid OTP - 404):**

```json
{
  "error": "Invalid email or OTP"
}
```

---

### GET /users/me

Get current user profile (requires authentication).

**Response (Success - 200):**

```json
{
  "message": "User found",
  "currentUser": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "admin@company.com",
    "organizationName": "My Company",
    "apiToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isVerified": true,
    "subscriptionExpires": "2025-02-28T12:00:00Z",
    "createdAt": "2025-01-28T12:00:00Z"
  }
}
```

---

### GET /users/token

Generate API token for programmatic access.

**Response (Success - 200):**

```json
{
  "message": "API token generated",
  "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- API token expires in 30 days
- Each call generates a new token (replaces old one)

---

## Form Endpoints

### POST /feedback/create

Create a new feedback form (requires authentication).

**Request:**

```json
{
  "title": "Customer Satisfaction Survey",
  "description": "Help us improve by sharing your feedback",
  "questions": [
    {
      "questionId": "q1",
      "text": "How satisfied are you with our service?",
      "type": "rating",
      "required": true
    },
    {
      "questionId": "q2",
      "text": "What can we improve?",
      "type": "text",
      "required": false
    }
  ]
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Form created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "organization": "507f1f77bcf86cd799439012",
    "title": "Customer Satisfaction Survey",
    "description": "Help us improve by sharing your feedback",
    "questions": [...],
    "shareableLink": "form-1704067200000-abc123def",
    "isActive": true,
    "responseCount": 0,
    "createdAt": "2025-01-28T12:00:00Z"
  }
}
```

---

### GET /feedback/user/forms

Get all forms created by authenticated user.

**Response (Success - 200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Customer Satisfaction Survey",
      "description": "Help us improve...",
      "questions": [...],
      "shareableLink": "form-1704067200000-abc123def",
      "isActive": true,
      "responseCount": 15,
      "createdAt": "2025-01-28T12:00:00Z"
    }
  ],
  "count": 1
}
```

---

### GET /feedback/form/:shareableLink

Get form by shareable link (public endpoint, no auth required).

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Customer Satisfaction Survey",
    "description": "Help us improve...",
    "questions": [...],
    "shareableLink": "form-1704067200000-abc123def",
    "isActive": true,
    "responseCount": 15
  }
}
```

---

### PUT /feedback/:formId

Update a form (requires authentication, owner only).

**Request:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "questions": [...],
  "isActive": true
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Form updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    ...
  }
}
```

---

### DELETE /feedback/:formId

Delete a form and all responses (requires authentication, owner only).

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Form deleted successfully"
}
```

**Warning:** This operation is irreversible. All responses will be permanently deleted.

---

## Feedback Endpoints

### POST /feedback/submit

Submit feedback for a form (public endpoint, no auth required).

**Request:**

```json
{
  "formId": "507f1f77bcf86cd799439011",
  "responses": [
    {
      "questionId": "q1",
      "question": "How satisfied are you?",
      "answer": 8,
      "type": "rating"
    },
    {
      "questionId": "q2",
      "question": "What can we improve?",
      "answer": "Better customer support would help",
      "type": "text"
    }
  ]
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439099"
  }
}
```

---

### GET /feedback/:formId/responses

Get all responses for a form (requires authentication, owner only).

**Response (Success - 200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439099",
      "form": "507f1f77bcf86cd799439011",
      "organization": "507f1f77bcf86cd799439012",
      "responses": [
        {
          "questionId": "q1",
          "question": "How satisfied are you?",
          "answer": 8,
          "type": "rating"
        }
      ],
      "submittedVia": "api",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-28T12:00:00Z"
    }
  ],
  "count": 1
}
```

---

### GET /feedback/:formId/analytics

Get analytics and NPS for a form (requires authentication, owner only).

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "nps": {
      "promoters": 8,
      "passive": 2,
      "detractors": 1,
      "promotersPercentage": 73,
      "passivePercentage": 18,
      "detractorsPercentage": 9,
      "totalResponses": 11,
      "npsScore": 64
    },
    "questionStats": {
      "q1": {
        "question": "How satisfied are you?",
        "type": "rating",
        "responses": [8, 9, 7, 10, 6],
        "average": 8.0
      }
    },
    "totalResponses": 11,
    "formTitle": "Customer Satisfaction Survey"
  }
}
```

**NPS Score Breakdown:**

- Promoters (9-10): Loyal customers
- Passive (7-8): Satisfied but not enthusiastic
- Detractors (0-6): Likely to recommend negatively
- NPS Score = Promoters % - Detractors %

---

## Error Codes

| Code | Name         | Description                            |
| ---- | ------------ | -------------------------------------- |
| 200  | OK           | Request succeeded                      |
| 201  | Created      | Resource created successfully          |
| 400  | Bad Request  | Invalid request data or missing fields |
| 403  | Forbidden    | User not authorized to access resource |
| 404  | Not Found    | Resource not found                     |
| 409  | Conflict     | Resource already exists                |
| 500  | Server Error | Internal server error                  |

---

## Support

For questions or issues, please open a GitHub issue or contact okwuosaoluchi95@gmail.com

---
