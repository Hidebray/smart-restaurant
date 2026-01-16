> This document defines the working schedule and remaining development tasks for the Smart Restaurant project.

## Working Time Schedule

| Member   | Time Slot     |
| -------- | ------------- |
| Dai Hiep | 06:00 – 12:00 |
| Huu Dan  | 12:00 – 18:00 |
| Hoang Vu | 18:00 – 24:00 |

The working order rotates daily following this sequence:
1 → 2 → 3 → 1

# Project Remaining Tasks

**Notes:**

- Check the boxes when a task is completed.
- Add new tasks if additional requirements are identified.
- Each task should include: a clear goal, task name, subtasks with checkboxes, and a commit message.

---

## Module 1: Authentication & Authorization

**Goal:** Secure internal pages (Kitchen, Waiter, Admin).

- [x] **Task 1.1: Authentication Logic & API**

  - [x] Install `jsonwebtoken`, `cookies-next`.
  - [x] Create `lib/auth.ts` (JWT sign & verify utilities).
  - [x] Implement API `POST /api/auth/login`.
  - _Commit:_ `feat: implement jwt authentication logic and login API`

- [x] **Task 1.2: Login UI**

  - [x] Create `app/login/page.tsx`.
  - [x] Build login form (Email / Password).
  - [x] Handle redirect after successful login.
  - _Commit:_ `feat: implement login page UI and authentication flow`

- [x] **Task 1.3: Route Protection Middleware**
  - [x] Create `middleware.ts`.
  - [x] Restrict access to `/admin`, `/kitchen`, `/waiter` when no valid token is found.
  - _Commit:_ `feat: add middleware to protect private routes`

---

## Module 2: Admin Dashboard

**Goal:** Manage products and tables without modifying code or database directly.

- [x] **Task 2.1: Admin Layout & Product Listing**

  - [x] Create `app/admin/layout.tsx` (Sidebar navigation).
  - [x] Create `app/admin/products/page.tsx` (Product table view).
  - _Commit:_ `feat: setup admin layout and product list view`

- [x] **Task 2.2: Product CRUD (Create / Update)**
  - [x] Implement API `POST /api/products` and `PUT /api/products`.
  - [x] Create modal/form to add or edit products (Name, Price, Image, Category).
  - _Commit:_ `feat: enable admin product creation and editing`

- [x] **Task 2.3: Staff Management**
  - [x] Create `app/admin/staff/page.tsx`.
  - [x] Implement functionality to add, view, and delete staff members (Waiter, Kitchen).
  - _Commit:_ `feat: implement staff management for admin`

- [x] **Task 2.4: Product Modifiers**
  - [x] Update `schema.prisma` to include `ModifierGroup` and `ModifierOption`.
  - [x] Create backend API for managing modifiers.
  - [x] Update frontend UI to allow admins to add/edit modifiers for a product.
  - _Commit:_ `feat: implement product modifier management`

- [ ] **Task 2.5: Analytics and Reporting**
  - [ ] Design and implement a dashboard to show key metrics (revenue, top-selling products, etc.).
  - [ ] Create backend APIs to fetch analytics data.
  - _Commit:_ `feat: implement analytics and reporting dashboard`

---

## Module 3: Table & QR Code Management

**Goal:** Generate QR codes for each table.

- [x] **Task 3.1: Table Management**

  - [x] Create `app/admin/tables/page.tsx`.
  - [x] Display table list fetched from the database.
  - [x] Implement functionality to add new tables.
  - _Commit:_ `feat: implement table management interface`

- [x] **Task 3.2: QR Code Generation**
  - [x] Install `qrcode.react`.
  - [x] Create modal to display QR code for each table.
  - [x] QR URL format:  
         `http://{LAN_IP}:3000/guest/menu?tableId={id}`
  - _Commit:_ `feat: generate QR codes for restaurant tables`

---

## Module 4: Payment & Checkout

**Goal:** Complete the order lifecycle.

- [ ] **Task 4.1: Bill & Payment UI**

  - [ ] Create a "Temporary Bill" modal on the Waiter screen.
  - [ ] Display a static payment QR code (demo purpose).
  - _Commit:_ `feat: display order bill summary modal`

- [x] **Task 4.2: Checkout Logic**
  - [x] Implement API to update order status to `COMPLETED`.
  - [x] Emit socket event when an order is completed.
  - _Commit:_ `feat: implement checkout logic and order completion flow`

- [x] **Task 4.3: "Pay at Counter" Logic**
  - [x] Implement logic for waiters to mark an order as `COMPLETED` after manual payment.
  - [x] Ensure the table status is updated to `AVAILABLE`.
  - _Commit:_ `feat: implement pay at counter checkout logic`

- [ ] **Task 4.4: Payment Gateway Integration (Stripe)**
  - [ ] Integrate Stripe SDK for processing online payments.
  - [ ] Create backend APIs to handle payment intents.
  - [ ] Update frontend UI to include a "Pay with Card" option.
  - _Commit:_ `feat: integrate stripe for online payments`

---

## Module 5: Deployment

**Goal:** Package and run the system across different environments.

- [ ] **Task 5.1: Dockerfile**

  - [ ] Create a production-ready `Dockerfile` for the Next.js application.
  - _Commit:_ `ops: add Dockerfile for production build`

- [ ] **Task 5.2: Full Stack Docker Compose**
  - [ ] Update `docker-compose.yml` to include App, Database, and Socket services.
  - _Commit:_ `ops: finalize docker-compose setup for full-stack deployment`

---

## Module 6: Advanced Features & Polish

**Goal:** Enhance the application with advanced functionalities.

- [ ] **Task 6.1: Customer Self-Registration**
  - [ ] Create a registration page for customers.
  - [ ] Implement API `POST /auth/register`.
  - _Commit:_ `feat: implement customer self-registration`

- [ ] **Task 6.2: Super Admin Role**
  - [ ] Create a Super Admin role with permissions to create/manage Admin accounts.
  - _Commit:_ `feat: implement super admin role for multi-restaurant management`

- [ ] **Task 6.3: Customer Item Reviews**
  - [ ] Allow registered customers to rate and review products they have ordered.
  - _Commit:_ `feat: enable customer item reviews`

- [ ] **Task 6.4: Fuzzy Search for Products**
  - [ ] Implement a more robust search algorithm for finding products.
  - _Commit:_ `feat: implement fuzzy search for products`

- [ ] **Task 6.5: Multi-language Support (EN/VI)**
  - [ ] Refactor UI to support multiple languages.
  - _Commit:_ `feat: add multi-language support`
