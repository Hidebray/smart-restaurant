# 🍽️ Smart Restaurant Management System

A comprehensive full-stack restaurant management system with real-time order tracking, QR code table ordering, and role-based access control.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [User Roles](#-user-roles)
- [Testing Guide](#-testing-guide)
- [Recent Updates](#-recent-updates)

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
- **Staff Management**: Create/delete staff accounts (Waiter, Kitchen, Admin)
- **Analytics & Reporting**: View key metrics, including total revenue, total orders, and top-selling products.
- **Smart Delete**: Tables with order history are set to INACTIVE instead of deleted

#### 🤵 Waiter Dashboard
- **Order Approval**: Accept or reject incoming orders
- **Order Tracking**: Monitor orders across all stages (Pending → Ready → Served)
- **Table Service**: Mark orders as served and complete payments
- **Real-time Notifications**: Instant alerts for new orders

#### 👨‍🍳 Kitchen Dashboard
- **Order Queue**: View approved orders ready for preparation
- **Status Updates**: Update order status (Accepted → Preparing → Ready)
- **Real-time Sync**: Automatic updates when waiters approve orders

#### 🍴 Customer Experience
- **Digital Menu**: Browse products by category with images
- **Cart Management**: Add items with modifiers (toppings, sizes)
- **Order Placement**: Submit orders directly from table
- **Order History**: View current and past orders

---

## �️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.IO Client
- **UI Components**: Custom components with Lucide icons
- **Notifications**: React Hot Toast

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Real-time**: Socket.IO Gateway
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
JWT_SECRET=your-super-secret-jwt-key  # Must match backend JWT_SECRET
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
- **WAITER**: View/Update orders, Manage table service
- **KITCHEN**: View/Update order preparation status
- **CUSTOMER**: Browse menu, Place orders

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
7. Click "💰 Thanh Toán & Dọn Bàn" to complete
8. **Verify**: Table status returns to AVAILABLE

### Scenario 3: Kitchen Prepares Food

1. Login as kitchen: `kitchen@smart.restaurant`
2. **Đơn Đã Duyệt**: See accepted orders
3. Click "👨‍🍳 Nhận Nấu" → Order moves to "Đang Nấu"
4. Click "✅ Nấu Xong" → Order moves to "Trả Món"
5. **Verify**: Waiter sees order in "Ready" column

### Scenario 4: Admin Manages System

#### Product Management
1. Login as admin: `admin@smart.restaurant`
2. Navigate to **Products**
3. Click "Add Product" → Fill form → Save
4. **Verify**: Product appears in customer menu
5. Edit/Delete products as needed

#### Table Management
1. Navigate to **Tables**
2. Click "Add Table" → Enter details → Save
3. Click QR icon to generate QR code
4. **Smart Delete**: 
   - Tables without orders: Deleted permanently
   - Tables with order history: Set to INACTIVE

#### Staff Management
1. Navigate to **Staff**
2. Click "Add New Staff"
3. Fill form (Name, Email, Password, Role)
4. **Verify**: Staff appears in respective section
5. Click "Delete" to remove staff

#### Modifier Management
1. Login as admin: `admin@smart.restaurant`
2. Navigate to **Modifiers**
3. Click "Add New Group"
4. Fill form:
   - Name: `Size`
   - Selection Type: `SINGLE`
   - Add options: `Small` (0), `Medium` (+5000), `Large` (+10000)
5. Save the group.
6. Navigate to **Products** and edit an existing product.
7. In the form, check the `Size` modifier group to associate it with the product.
8. Save the product.
9. Open the customer menu for any table and find the product you just edited.
10. **Verify**: When you click on the product, a modal opens showing the "Size" options.

---

## 🆕 Recent Updates

### Authentication System
- ✅ Fixed JWT secret synchronization between AuthModule and JwtStrategy
- ✅ Implemented Axios request interceptor for automatic token attachment
- ✅ Added localStorage token management for client-side requests
- ✅ Enhanced logout to clear both cookie and localStorage

### Order Management
- ✅ Auto-update table status: AVAILABLE → OCCUPIED (on order) → AVAILABLE (on completion)
- ✅ Fixed order merging logic to only merge with PENDING orders
- ✅ Prevented completed orders from appearing on table after payment

### Table Management
- ✅ Implemented smart delete: INACTIVE status for tables with order history
- ✅ Fixed foreign key constraint issues
- ✅ Enhanced error messages with actionable suggestions

### Staff Management
- ✅ Added full CRUD operations for staff accounts
- ✅ Implemented role-based staff creation (Waiter, Kitchen, Admin)
- ✅ Added delete functionality with confirmation dialogs

### UI/UX Improvements
- ✅ Fixed dialog closing issues in forms
- ✅ Enhanced error handling with detailed toast notifications
- ✅ Improved text contrast for better readability
- ✅ Added loading states and disabled states for better UX

### Modifier Management
- ✅ Implemented backend API for full CRUD on modifier groups and options.
- ✅ Added admin UI to create, edit, and delete modifier groups and their options.
- ✅ Integrated modifier selection into the product form, allowing admins to assign modifiers to products.
- ✅ Updated customer product modal to display modifier options (single/multiple choice) and dynamically update prices.
- ✅ Ensured selected modifiers and their price adjustments are correctly reflected in the shopping cart and order creation.
- ✅ Fixed a bug preventing the deletion of modifier options.

---

## 📝 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products (Admin only)
- `GET /products` - List all products
- `POST /products` - Create product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/:id/modifier-groups` - Associate modifier groups with a product

### Modifiers (Admin only)
- `GET /modifiers/groups` - List all modifier groups with their options
- `POST /modifiers/groups` - Create a new modifier group
- `PATCH /modifiers/groups/:id` - Update a modifier group
- `DELETE /modifiers/groups/:id` - Delete a modifier group
- `POST /modifiers/options` - Create a new modifier option for a group
- `PATCH /modifiers/options/:id` - Update a modifier option
- `DELETE /modifiers/options/:id` - Delete a modifier option

### Tables (Admin only)
- `GET /tables` - List all tables
- `POST /tables` - Create table
- `PATCH /tables/:id` - Update table
- `DELETE /tables/:id` - Delete/Deactivate table
- `POST /tables/:id/generate-qr` - Generate QR code

### Orders
- `GET /orders` - List all orders
- `POST /orders` - Create order
- `PATCH /orders/:id/status` - Update order status

### Users (Admin only)
- `GET /users` - List all users
- `POST /users` - Create user
- `DELETE /users/:id` - Delete user

### Reports (Admin only)
- `GET /reports/summary` - Get sales summary
- `GET /reports/top-products` - Get top selling products

---

## 🔒 Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt (10 rounds)
- Role-based access control (RBAC)
- Protected API routes with Guards
- CORS configuration
- Input validation with DTOs
- SQL injection prevention via Prisma ORM

---

## 📦 Database Schema

### Key Models
- **User**: Authentication and role management
- **Table**: Restaurant tables with QR tokens
- **Product**: Menu items with categories
- **Category**: Product categorization
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items in orders
- **ModifierGroup**: Customization options (sizes, toppings)
- **ModifierOption**: Specific modifier choices

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

### Database connection failed
```bash
# Ensure Docker is running
docker ps

# Restart containers
docker compose down
docker compose up -d

# Re-push schema
npx prisma db push
```

### Frontend can't connect to backend
- Check backend is running on port 5000
- Verify CORS is enabled in `main.ts`
- Check `NEXT_PUBLIC_API_BASE_URL` in frontend

---

## 📄 License

This project is for educational purposes.

---

## 👥 Contributors

- Dan
- Hiep
- Vu

---

**Built with ❤️ using Next.js and NestJS**