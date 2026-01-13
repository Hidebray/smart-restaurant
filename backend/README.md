# Smart Restaurant - Backend Service

This directory contains the backend service for the Smart Restaurant application, built with [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), and PostgreSQL.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or later)
- Docker Desktop (for the PostgreSQL database)

### 2. Installation
```bash
# Navigate to the backend directory
cd smart-restaurant/backend

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in this directory (`/backend`) and add the following variables. A PostgreSQL instance is required.

```env
# Example for Docker Compose setup in the project root
DATABASE_URL="postgresql://user:password@localhost:5432/smart_restaurant_db?schema=public"

# IMPORTANT: Use a strong, unique secret for JWT signing
JWT_SECRET="YOUR_SUPER_SECRET_KEY_CHANGE_ME"
```

### 4. Running the Application
```bash
# Run in development mode (with hot-reload)
npm run start:dev
```
The server will be running at `http://localhost:5000`.

---

## 🧪 Feature Testing Guide

This guide explains how to test the API endpoints using a command-line tool like `cURL`.

### **Authentication API (`/auth`)**

#### **1. Register a New User**
Send a POST request to `/auth/register` with the user's details.

```bash
curl -X POST http://localhost:5000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "test.user@example.com",
  "password": "password123",
  "name": "Test User"
}'
```
- **Expected Success Response (201 Created):** You will get the new user object back (without the password).
- **Expected Error Response (409 Conflict):** If you try to register with an email that already exists, the API will return a conflict error.

#### **2. Log In as a User**
Send a POST request to `/auth/login` with the credentials you just registered.

```bash
curl -X POST http://localhost:5000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "test.user@example.com",
  "password": "password123"
}'
```
- **Expected Success Response (200 OK):** The API will return an `accessToken` and a user object.
  ```json
  {
    "accessToken": "ey...",
    "user": { ... }
  }
  ```
- **Expected Error Response (401 Unauthorized):** If credentials are incorrect, the API will return an unauthorized error.

#### **3. Access a Protected Route**
Send a GET request to the protected `/auth/profile` endpoint. You must include the `accessToken` from the login step as a Bearer Token in the `Authorization` header.

**Replace `YOUR_TOKEN_HERE` with the actual token from the login response.**

```bash
curl -X GET http://localhost:5000/auth/profile \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```
- **Expected Success Response (200 OK):** The API will return the user's profile information (`{ "id": "...", "email": "...", "role": "..." }`).
- **Expected Error Response (401 Unauthorized):** If the token is missing, invalid, or expired, the API will return an unauthorized error.
