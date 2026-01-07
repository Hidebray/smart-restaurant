# Smart Restaurant System (MVP)

A smart restaurant management system featuring QR code–based ordering and real-time status updates between Guests, Waiters, and Kitchen staff.

---

## Technology Stack
- **Frontend & Backend:** Next.js 14 (App Router)
- **Database:** PostgreSQL (running on Docker)
- **ORM:** Prisma
- **Real-time Communication:** Socket.IO (separate server)
- **Styling:** Tailwind CSS
- **State Management:** Zustand

---

## Local Development Setup Guide

### 1. Prerequisites
- Node.js (v18 or later)
- Docker Desktop (installed and running)
- Git

---

### 2. Clone the Repository
```bash
git clone https://github.com/Hidebray/smart-restaurant.git
cd smart-restaurant

```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a .env file in the project root with the following content:
```env
# Database connection (credentials must match docker-compose.yml)
DATABASE_URL="postgresql://admin:password123@localhost:5433/smart_restaurant?schema=public"
```
### 5. Start the Database with Docker
Run the following command to start PostgreSQL and pgAdmin:
```bash
docker-compose up -d
```
*Wait approximately 30 seconds for the database to start.*

### 6. Run Migration & Seed Data
Push the table schema and create sample data (Menu, Tables, Users):
```bash
npx prisma db push
npx prisma db seed
```

---

## Feature Testing Guide (Latest Features)

### Rules
- This is a latest feature testing guide for the current Smart Restaurant system.
- Please change the content below if you have added new features.
- Each step includes the URL to access, actions to perform, and expected results.

### Description
- The current system simulates a restaurant workflow involving three roles.
- Please open three browser tabs (or three incognito windows) to test each role.

### Step 1: Guest 
- Access: http://localhost:3000/guest/menu
- Actions:
    1. Select dishes (Phở, Trà sữa...) -> Add to cart.
    2. Click the cart icon (top right).
    3. Click the "Send Order to Kitchen" button.
- Expected result: 
    - Order submission success message.
    - Shopping cart is cleared.

### Step 2: Waiter
- Access: http://localhost:3000/waiter
- Actions:
    1. Go to the "Chờ duyệt" tab. See the newly placed order appear (Real-time).
    2. Click "Chấp nhận"
- Expected result: 
    - The order disappears from the "Pending" tab.

### Step 3: Kitchen
- Access: http://localhost:3000/kitchen
- Actions:
    1. See the order appear with status PENDING (or PREPARING if waiter has accepted).
    2. Click "NHẬN ĐƠN & NẤU" -> Status changes to Yellow (Preparing).
    3. Click "XONG -> TRẢ MÓN" -> Status changes to Green (Ready).
- Expected result:
    - Waiter and Guest receive real-time status updates.

### Step 4: Waiter (Completion)
- Return to the Waiter tab: http://localhost:3000/waiter
- Actions:
    1. Go to the "Trả món" tab. See the completed order.
    2. Click "Đã mang ra bàn".
    3. Go to the "Đang phục vụ" tab. Click "Thanh toán".
- Expected result:
    - The workflow is completed.
    - Order status is updated to COMPLETED.