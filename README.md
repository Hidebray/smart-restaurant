# Smart Restaurant

This is the monorepo for the Smart Restaurant application, containing the frontend and backend services.

-   **Frontend:** A [Next.js](https://nextjs.org/) application located in the `/frontend` directory.
-   **Backend:** A [NestJS](https://nestjs.com/) API located in the `/backend` directory.

---

## 🚀 Local Development Setup

### 1. Prerequisites

-   Node.js (v18 or later)
-   Docker Desktop (for the PostgreSQL database)

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env

# Update the environment variables in .env:
# - PORT=5000
# - DATABASE_URL="postgresql://admin:admin-postgres-pwd-3@localhost:5433/smart_restaurant?schema=public"
# - JWT_SECRET="your-super-secret-jwt-key"

# Run the backend server
npm run start:dev
```

The backend API will be running at `http://localhost:5000`.

### Database Setup (Required)

Ensure you have Docker Desktop running, then start the database:

```bash
# Start the database containers
docker compose up -d

# Initialize the database schema
npx prisma db push
```

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the frontend development server
npm run dev
```

The frontend application will be accessible at `http://localhost:3000`.

---

## 🧪 Feature Testing Guide

This guide provides end-to-end testing scenarios to verify the core features of the Smart Restaurant application from the user's perspective.

**Prerequisites:**
1.  Ensure the [Backend Setup](#2-backend-setup) is complete and the server is running.
2.  Ensure the [Frontend Setup](#3-frontend-setup) is complete and the server is running.
3.  You may need to register `Admin` and `Staff` users first via the API as described in the old guide, or through a dedicated UI if available.

---

### **Scenario 1: Customer Places an Order**

1.  **Open Customer View:** Navigate to `http://localhost:3000` in your web browser.
2.  **Select a Table:** Choose any available table to start an order. For this example, let's use **Table 5**.
3.  **Browse Menu:** You will be taken to the menu page. Browse the different categories and items.
4.  **Add Items to Cart:** Add a few items to your cart by clicking the "Add" or "+" button next to them.
5.  **Place Order:** Go to your cart, review the items, and click **"Place Order"**.
6.  **Verify Order Status:** After placing the order, you should be redirected to an order status page. Verify that your new order is listed with the status **`Pending`**.

---

### **Scenario 2: Staff Manages the Order in Real-Time**

1.  **Open Staff View:** In a separate browser window or an incognito tab, navigate to the login page (e.g., `http://localhost:3000/login`).
2.  **Log In as Staff:** Enter the credentials for a user with the `Staff` role.
3.  **View Kitchen Dashboard:** Navigate to the kitchen or orders dashboard. You should see the new order from **Table 5**.
4.  **Update Status to `Preparing`:**
    *   Find the order and change its status from `Pending` to **`Preparing`**.
    *   **Check the customer's browser window.** The order status for Table 5 should update automatically to **`Preparing`** without a page refresh.
5.  **Update Status to `Ready`:**
    *   In the staff view, change the order status to **`Ready`**.
    *   **Check the customer's browser window again.** The status should update in real-time to **`Ready`**.
6.  **Complete the Order:**
    *   Finally, update the status to **`Completed`**. The order may now move to a "Completed" tab or be removed from the active dashboard.

---

### **Scenario 3: Admin Manages Tables and QR Codes**

1.  **Log In as Admin:** In a separate browser window, log in with an `Admin` user's credentials.
2.  **Navigate to Table Management:** Go to the admin section and find the "Table Management" page (e.g., `http://localhost:3000/admin/tables`).
3.  **Create a New Table:**
    *   Click "Add New Table".
    *   Fill in the form with a table number (e.g., "Table 10"), capacity, and location.
    *   Save the new table.
    *   **Verify:** The new table should appear in the list of tables.
4.  **Update an Existing Table:**
    *   Click the "Edit" icon on an existing table.
    *   Change its capacity or location.
    *   Save the changes.
    *   **Verify:** The table's details should be updated in the list.
5.  **Generate a QR Code:**
    *   Click the "QR Code" icon on any table.
    *   A modal should appear displaying the unique QR code for that table.
    *   **Verify:** You can test this by scanning it with your phone; it should lead to a URL like `http://localhost:3000/table/some-unique-token`.
6.  **Delete a Table:**
    *   Click the "Delete" icon on a table.
    *   Confirm the deletion.
    *   **Verify:** The table should be removed from the list.

### **Scenario 4: Admin Manages the Menu**


1.  **Log In as Admin:** In a separate browser window, log in with an `Admin` user's credentials.
2.  **Navigate to Menu Management:** Go to the section for editing the restaurant's menu.
3.  **Create a New Menu Item:**
    *   Add a new item with a name, price, and description (e.g., "Spicy Chicken Wings").
    *   Save the new item.
    *   **Verify:** Open the customer's menu page (`http://localhost:3000`) and confirm that "Spicy Chicken Wings" is now visible.
4.  **Update an Existing Item:**
    *   Edit the price of an existing item.
    *   Save the changes.
    *   **Verify:** Refresh the customer's menu page and check that the price has been updated.
5.  **Delete a Menu Item:**
    *   Remove an item from the menu.
    *   **Verify:** The item should no longer be visible on the customer's menu page.


---

### **Scenario 5: Authentication**

- **Strategy:** JWT (JSON Web Tokens)
- **Flow:** 1. Frontend sends credentials to Next.js API Route.
  2. Next.js calls Backend to validate and get JWT.
  3. JWT is stored in an HTTP-only cookie (`accessToken`) for security.
  4. **Middleware** automatically intercepts requests to `/admin`, `/waiter`, and `/kitchen`.
  5. Unauthenticated users are redirected to `/login`.
 
 ---