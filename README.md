# 🍽️ Smart Restaurant Management System

A comprehensive full-stack restaurant management system with real-time order tracking, QR code table ordering, role-based access control, online payments, loyalty points system, inventory management, and table reservations.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [User Roles](#-user-roles)
- [Testing Guide](#-testing-guide)
- [Recent Updates (Changelog)](#-recent-updates-changelog)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🎯 Core Features
- **QR Code Table Ordering**: Customers scan QR codes to access menu and place orders
- **Real-time Order Tracking**: WebSocket integration for live order status updates
- **Multi-role Authentication**: JWT-based auth with role-specific dashboards
- **Smart Table Management**: Auto-status updates (AVAILABLE → OCCUPIED → AVAILABLE)
- **Order Flow Management**: Complete workflow from order placement to completion
- **Staff Management**: Create and manage waiter and kitchen staff accounts

### 👥 Role-Based Features

#### 🛡️ Admin Dashboard
- **Product Management**: Create, edit, delete menu items with categories
- **Modifier Management**: Create, edit, delete modifier groups and options (e.g., Size, Toppings)
- **Table Management**: Manage tables with QR code generation
- **Staff Management**: Create/delete/edit staff accounts (Waiter, Kitchen, Admin)
- **Analytics & Reporting**: View key metrics, including total revenue, total orders, and top-selling products
- **Loyalty Management**: Create and manage vouchers, view loyalty statistics
- **Inventory Management**: Track product stock levels, low stock alerts, restock management
- **Reservation Management**: Manage table reservations, view upcoming bookings, handle cancellations
- **Smart Delete**: Tables with order history are set to INACTIVE instead of deleted

#### 🤵 Waiter Dashboard
- **Order Approval**: Accept or reject incoming orders
- **Order Tracking**: Monitor orders across all stages (Pending → Ready → Served)
- **Table Service**: Mark orders as served and complete payments
- **Bill Management**: View bill summaries, apply discounts, and generate QR codes for tables
- **Assigned Tables**: View and manage tables assigned to the waiter
- **Real-time Notifications**: Instant alerts for new orders and payment requests (Bell Ring)

#### 👨‍🍳 Kitchen Dashboard
- **Order Queue**: View approved orders ready for preparation
- **Status Updates**: Update order status (Accepted → Preparing → Ready)
- **Real-time Sync**: Automatic updates when waiters approve orders

#### 🍴 Customer Experience
- **Digital Menu**: Browse products by category with images
- **Product Detail Pages**: View full product details, allergens, availability status
- **Smart Search**: Fuzzy search for menu items with typo tolerance (e.g., "spageti" → "Spaghetti")
- **Cart Management**: Add items with modifiers (toppings, sizes), add order notes
- **Order Placement**: Submit orders directly from table
- **Order History**: View current and past orders
- **Online Payment**: Pay via Stripe (Credit Card) with secure payment processing
- **Call Waiter**: Request assistance or cash payment with one tap ("Bell Ring")
- **Customer Registration**: Create personal accounts to save order history
- **Item Reviews**: Rate and review products after ordering (1-5 stars + comments)
- **Loyalty Points**: Earn points on orders, redeem vouchers, view points history
- **Multi-language Support**: Switch between English and Vietnamese (EN/VI)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.IO Client
- **UI Components**: Custom components with Lucide icons
- **Notifications**: React Hot Toast
- **Internationalization**: Custom i18n context (EN/VI support)

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Real-time**: Socket.IO Gateway
- **Payments**: Stripe SDK
- **Validation**: class-validator, class-transformer
- **Security**: bcrypt for password hashing

### Infrastructure
- **Database**: PostgreSQL 15 (Docker)
- **Admin Tool**: pgAdmin 4 (Docker)
- **Container**: Docker Compose

---

## 🏗️ Architecture

### Authentication Flow
```
1. User logs in → Frontend sends credentials to /api/auth/login
2. Next.js API route calls NestJS backend
3. Backend validates credentials and returns JWT
4. Frontend stores token in:
   - HTTP-only cookie (for SSR/Middleware)
   - localStorage (for client-side API calls)
5. Axios interceptor auto-attaches Bearer token to all requests
6. Middleware protects routes based on user role
```

### Order Lifecycle
```
Customer → PENDING → Waiter Accepts → ACCEPTED
         ↓
Kitchen Receives → PREPARING → READY
         ↓
Waiter Serves → SERVED → Payment → COMPLETED
         ↓
Table Status: OCCUPIED → AVAILABLE
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or later
- Docker Desktop
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd smart-restaurant
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with:
PORT=5000
DATABASE_URL="postgresql://admin:admin-postgres-pwd-3@localhost:5433/smart_restaurant?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="http://localhost:3000"

# Email Configuration (Gmail)
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"

# Google Auth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/auth/google/callback"

# Stripe (Backend) - Payment Processing
# Get your keys from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="derqnwozh"
CLOUDINARY_API_KEY="117994551519933"
CLOUDINARY_API_SECRET="2_-HR6hBWV5cOJ5kmyu066rzb7Y"

# Start database
docker compose up -d

# Initialize database
npx prisma db push

# Seed sample data
npx prisma db seed

# Start backend server
npm run start:dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with:
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
JWT_SECRET=your-super-secret-jwt-key  # Must match backend JWT_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
# Get from Stripe Dashboard
NODE_ENV=development

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 👤 User Roles

### Default Credentials
After seeding, use these accounts (Password: `password@123`):

| Role | Email | Access |
|------|-------|--------|
| **Admin** | `admin@smart.restaurant` | Full system access |
| **Waiter** | `waiter@smart.restaurant` | Order management |
| **Kitchen** | `kitchen@smart.restaurant` | Kitchen dashboard |

### Role Permissions
- **ADMIN**: Products, Tables, Staff, Orders (full CRUD)
- **WAITER**: View/Update orders, Manage table service, View Bills
- **KITCHEN**: View/Update order preparation status
- **CUSTOMER**: Browse menu, Place orders, Pay Online, Call Waiter

---

## 🧪 Testing Guide

### Scenario 1: Customer Orders Food
1. Navigate to `http://localhost:3000/tables`
2. Click "Open Menu" on any table (or scan QR code)
3. Browse menu and add items to cart
4. Click cart icon → "🚀 Gửi Đơn Bếp"
5. **Verify**: Order appears in Waiter dashboard

### Scenario 2: Waiter Processes Order
1. Login as waiter: `waiter@smart.restaurant`
2. **Pending Orders**: See new order in yellow column
3. Click "✅ Chấp Nhận" to accept order
4. **Verify**: Order moves to Kitchen dashboard
5. When kitchen marks "Ready", order appears in green "Món Chờ Bưng"
6. Click "🏃 Bưng Ra Bàn Ngay" → Order moves to "Đang Ăn"

### Scenario 3: Payment & Completion
1. **Guest**: Go to "Your Orders" -> Click "🔔" to call waiter OR Click "💳 Pay All".
2. **Waiter (Manual)**: Click "💰 Thanh Toán & Dọn Bàn".
3. **Guest (Stripe)**: Enter test card details:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., `12/34`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **ZIP**: Any (e.g., `12345`)
4. **Verify**: Order marked COMPLETED, Table becomes AVAILABLE.

### Scenario 4: Customer Registration & Reviews
1. Navigate to `http://localhost:3000/register`
2. Fill in name, email, password, phone number
3. Click "Đăng Ký" (Register)
4. Login with the new account
5. Place an order and view it in "Your Orders"
6. Click the **⭐** button next to any ordered item
7. Select star rating (1-5) and add optional comment
8. Submit review
9. **Verify**: Success toast appears

### Scenario 5: Fuzzy Search
1. Go to Guest Menu: `http://localhost:3000/guest?tableId=1`
2. Type in search bar (e.g., "pho", "pizza", "com")
3. **Verify**: Results appear in real-time with partial matches
4. Search works case-insensitively and across product names

### Scenario 6: Multi-language Support
1. Visit any page (Login, Guest Menu, Waiter, Kitchen, Admin)
2. Click **EN** button in top-right corner
3. **Verify**: Text changes to English
4. Click **VI** button
5. **Verify**: Text changes back to Vietnamese
6. Navigate to other pages
7. **Verify**: Language preference persists

---

## 🆕 Recent Updates (Changelog)

### Module 1: Stability & Fixes
- ✅ Fixed duplicate key errors in Socket.io lists (Waiter/Kitchen dashboards).
- ✅ Fixed `Suspense` boundary issues in Next.js App Router.
- ✅ Fixed Database Seeding uniqueness constraints.
- ✅ Resolved port conflict issues (`EADDRINUSE`).

### Module 4: Payment System
- ✅ **Bill Modal**: Implemented Bill View for Waiters.
- ✅ **Stripe Integration**: Full real Stripe payment processing with PaymentIntent API.
- ✅ **Payment Validation**: Minimum amount validation (12,000 VND) and proper error handling.
- ✅ **Call Assistance**: Added "Ring Bell" feature for guests to notify waiters (Cash/Help).
- ✅ **Real-time Notifications**: Waiters receive toast alerts when guests request payment.

### Module 5: Deployment
- ✅ **Dockerfiles**: Production-ready Dockerfiles for Frontend and Backend.
- ✅ **Docker Compose**: Full stack orchestration (`docker-compose.prod.yml`).

### Module 6: Advanced Customer Features
- ✅ **Customer Registration**: Self-service account creation for customers (Task 6.1)
- ✅ **Item Reviews**: Rating system (1-5 stars) with comments for products (Task 6.3)
- ✅ **Fuzzy Search**: Smart product search with typo tolerance and partial matching (Task 6.4)
- ✅ **Multi-language Support**: English/Vietnamese language switcher on all pages (Task 6.5)
- ✅ **Review Modal**: Interactive UI for submitting ratings with authentication check
- ✅ **I18n Context**: Custom internationalization system with localStorage persistence

### Module 7: Admin & Waiter Enhancements
- ✅ **QR Code Download**: Download table QR codes as PNG with one click (Task 7.4)
- ✅ **Print Bill**: Professional bill printing with react-to-print library (Task 7.5)
- ✅ **Print-Optimized Layout**: Bills include restaurant header, item details, and footer
- ✅ **Enhanced QR Modal**: Download and print buttons with icons for better UX
- ✅ **Menu Pagination**: Guest menu shows 12 items per page with navigation controls (Task 7.6)
- ✅ **Smart Pagination**: URL parameter support, auto-reset on category change, item count display
- ✅ **Order Timer**: Visual stopwatch for Kitchen and Waiter to track prep time with overdue alerts (Task 7.12)
- ✅ **QR Code Regeneration**: Securely rotate QR codes via Admin to invalidate old links (Task 7.13)
- ✅ **Chef Recommendations**: Highlight special dishes with "Chef's Choice" badge and toggle in Admin (Task 7.14)
- ✅ **Related Items**: Suggests similar dishes from the same category in the product detail modal (Task 7.15)
- ✅ **Sorting & Statistics**: Track product popularity and allow guests to sort menu by price or popularity (Task 7.19)
- ✅ **Discount System**: Apply percentage or fixed amount discounts to orders (Task 7.17)
- ✅ **Menu Item Detail Page**: Dedicated product detail page with allergens and availability (Task 7.18)
- ✅ **Input Order Details**: Clear UI for adding order notes during checkout (Task 2.16)
- ✅ **Create Admin Accounts**: Admin can create Admin accounts via Staff Management UI (Task 5.1)
- ✅ **Manage Admin Accounts**: View, edit, and deactivate Admin accounts (Task 5.2)
- ✅ **View Assigned Tables**: Waiter can view and manage tables assigned to them (Task 7.4)

### Module 8: Advanced Business Features
- ✅ **Loyalty Points System**: Automatic points earning on orders, tier system (Bronze/Silver/Gold/Platinum), points redemption
- ✅ **Voucher Management**: Create and manage discount vouchers with validation (min order, expiry, max uses)
- ✅ **Inventory Management**: Track product stock levels, low stock alerts, automatic inventory deduction on order completion
- ✅ **Table Reservation System**: Book tables in advance, overlap detection, status management (Pending/Confirmed/Cancelled/Completed/No-Show)
- ✅ **Reservation Analytics**: View reservation statistics, upcoming bookings, no-show tracking

---

## 🐳 Deployment

To run the application in a production-like Docker environment:

```bash
# Stop local servers first
docker compose -f docker-compose.prod.yml up -d --build

# Initialize Prod DB
docker exec -it smart_restaurant_backend npx prisma db push
docker exec -it smart_restaurant_backend npx prisma db seed
```

App available at `http://localhost:3000`.

---

## 🐛 Troubleshooting

### Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Then restart backend
npm run start:dev
```

### Stripe Payment Issues
- Ensure you have set real Stripe keys in both `.env` files:
  - Backend: `STRIPE_SECRET_KEY=sk_test_...`
  - Frontend: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- Get keys from: https://dashboard.stripe.com/test/apikeys
- Minimum payment amount for VND is **12,000 VND**
- For testing, use card number: `4242 4242 4242 4242`

---

## 📄 License
This project is for educational purposes.

## 👥 Contributors
- Dan
- Hiep
- Vu

**Built with ❤️ using Next.js and NestJS**