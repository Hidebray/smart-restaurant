# Smart Restaurant System (MVP)

A smart restaurant management system featuring QR code–based ordering and real-time status updates between Guests, Waiters, and Kitchen staff.

## 📂 Project Structure

The project is split into two main parts:

- **`frontend/`**: The Next.js web application (User Interfaces for Guest, Waiter, Kitchen, Admin). Handles database interactions via Prisma.
- **`backend/`**: The Node.js Socket.IO server for real-time signaling. Also contains the Docker infrastructure configuration.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS.
- **Backend:** Node.js, Socket.IO.
- **Database:** PostgreSQL (running via Docker).
- **ORM:** Prisma.
- **State Management:** Zustand.
- **Infrastructure:** Docker Compose.

---

## 🚀 Local Development Setup Guide

### 1. Prerequisites
- Node.js (v18 or later)
- Docker Desktop (installed and running)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/Hidebray/smart-restaurant.git
cd smart-restaurant
```

### 3. Setup Backend & Infrastructure
**This step must be done first to ensure the database is running.**

```bash
cd backend
npm install
```

**Start the Database:**
```bash
docker-compose up -d
```

**Start the Socket Server:**
```bash
npm run dev
# Server runs on http://localhost:3001
```

### 4. Setup Frontend
Open a **new terminal** window and navigate to the project root.

```bash
cd frontend
npm install
```

**Initialize Database Schema & Seed Data:**
(Make sure the backend docker container is running first)
```bash
# Push schema to the database
npx prisma db push

# Seed initial data (Menu, Tables, Users)
npx prisma db seed
```

**Start the Application:**
```bash
npm run dev
# App runs on http://localhost:3000
```

---

## 🧪 Feature Testing Guide (Workflow)

### Rules
- Open three browser tabs (or windows) to simulate the three different roles.

### Step 1: Guest (Ordering)
- **URL:** [http://localhost:3000/guest/menu](http://localhost:3000/guest/menu)
- **Action:** Select dishes (e.g., Phở, Milk Tea) -> Add to cart -> Click "Send Order to Kitchen".
- **Result:** Order is submitted, cart is cleared.

### Step 2: Kitchen (Cooking)
- **URL:** [http://localhost:3000/kitchen](http://localhost:3000/kitchen)
- **Action:**
  1. See the new order appear.
  2. Click **"NHẬN ĐƠN & NẤU"** (Status: Preparing).
  3. Click **"XONG -> TRẢ MÓN"** (Status: Ready).
- **Result:** Status updates are sent to Waiter.

### Step 3: Waiter (Serving & Payment)
- **URL:** [http://localhost:3000/waiter](http://localhost:3000/waiter)
- **Action:**
  1. Go to **"Trả món"** tab -> See "Ready" order.
  2. Click **"Đã mang ra bàn"**.
  3. Go to **"Đang phục vụ"** tab -> Click **"Thanh toán"**.
- **Result:** Order is completed.