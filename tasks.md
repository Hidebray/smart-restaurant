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

- [x] **Task 2.5: Analytics and Reporting**
  - [x] Design and implement a dashboard to show key metrics (revenue, top-selling products, etc.).
  - [x] Create backend APIs to fetch analytics data.
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

- [x] **Task 4.1: Bill & Payment UI**
  - [x] Create a "Temporary Bill" modal on the Waiter screen.
  - [x] Display a static payment QR code (demo purpose).
  - _Commit:_ `feat: display order bill summary modal`

- [x] **Task 4.2: Checkout Logic**
  - [x] Implement API to update order status to `COMPLETED`.
  - [x] Emit socket event when an order is completed.
  - _Commit:_ `feat: implement checkout logic and order completion flow`

- [x] **Task 4.3: "Pay at Counter" Logic**
  - [x] Implement logic for waiters to mark an order as `COMPLETED` after manual payment.
  - [x] Ensure the table status is updated to `AVAILABLE`.
  - _Commit:_ `feat: implement pay at counter checkout logic`

- [x] **Task 4.4: Payment Gateway Integration (Stripe)**
  - [x] Integrate Stripe SDK for processing online payments.
  - [x] Create backend APIs to handle payment intents.
  - [x] Update frontend UI to include a "Pay with Card" option.
  - _Commit:_ `feat: integrate stripe for online payments`

---

## Module 5: Deployment

**Goal:** Package and run the system across different environments.

- [x] **Task 5.1: Dockerfile**
  - [x] Create a production-ready `Dockerfile` for the Next.js application.
  - [x] Create a production-ready `Dockerfile` for the NestJS application.
  - _Commit:_ `ops: add Dockerfile for production build`

- [x] **Task 5.2: Full Stack Docker Compose**
  - [x] Update `docker-compose.yml` to include App, Database, and Socket services.
  - [x] Created `docker-compose.prod.yml` for full stack deployment.
  - _Commit:_ `ops: finalize docker-compose setup for full-stack deployment`

---

## Module 6: Advanced Features & Polish

**Goal:** Enhance the application with advanced functionalities.

- [x] **Task 6.1: Customer Self-Registration**
  - [x] Create a registration page for customers.
  - [x] Implement API `POST /auth/register`.
  - _Commit:_ `feat: implement customer self-registration`

- [ ] **Task 6.2: Super Admin Role** (Không cần làm)
  - [ ] Create a Super Admin role with permissions to create/manage Admin accounts.
  - _Commit:_ `feat: implement super admin role for multi-restaurant management`

- [x] **Task 6.3: Customer Item Reviews**
  - [x] Allow registered customers to rate and review products they have ordered.
  - [x] Implemented `Review` model and backend API.
  - [x] Added Review Modal to Guest Order History.
  - _Commit:_ `feat: enable customer item reviews`

- [x] **Task 6.4: Fuzzy Search for Products**
  - [x] Implemented backend search API with case-insensitive partial matching
  - [x] Updated frontend to use backend search with debouncing
  - [x] Search works across product name and description
  - _Commit:_ `feat: implement fuzzy search for products`

- [x] **Task 6.5: Multi-language Support (EN/VI)**
  - [x] Created translation files for English and Vietnamese
  - [x] Implemented i18n context and custom hook
  - [x] Added language switcher component to header
  - [x] Integrated translations in guest menu page
  - _Commit:_ `feat: add multi-language support`

---

## **Module 7: Essential Missing Features**

### Critical Features (Required for Submission)

- [ ] **Task 7.1: Demo Video**
  - [ ] Create comprehensive demo video (25-30 minutes)
  - [ ] Cover all user roles (Admin, Waiter, Kitchen, Customer)
  - [ ] Demonstrate real-time features
  - [ ] Show advanced features (Stripe, Socket.IO, i18n)
  - [ ] Upload to YouTube/Google Drive
  - _Points:_ -5 (critical missing requirement)

- [ ] **Task 7.2: Public Hosting Deployment**
  - [ ] Deploy frontend to Vercel/Netlify
  - [ ] Deploy backend to Railway/Render
  - [ ] Setup production PostgreSQL database
  - [ ] Configure environment variables
  - [ ] Test all features on production
  - _Points:_ -1 (required for submission)

### High Priority Features

- [x] **Task 7.3: View Item Reviews**
  - [x] Display reviews in Product Modal
  - [x] Show average rating
  - [x] Show user name and date
  - [x] Display star ratings visually
  - [x] Handle empty reviews state
  - _Commit:_ Already implemented in `feat: enable customer item reviews`
  - _Points:_ -0.5 ✅

- [x] **Task 7.4: QR Code Download/Print**
  - [x] Add download QR as PNG button
  - [x] Implement print functionality
  - [x] Added icons for better UX
  - _Commit:_ `feat: add QR code download as PNG feature`
  - _Points:_ -0.25 ✅

- [x] **Task 7.5: Print Bill Feature**
  - [x] Install react-to-print library
  - [x] Create printable bill template with header/footer
  - [x] Add print button to Bill Modal
  - [x] Hide UI elements when printing (QR, buttons)
  - _Commit:_ `feat: add print bill functionality with react-to-print`
  - _Points:_ -0.25 ✅

- [x] **Task 7.6: Menu Item Pagination**
  - [x] Implement pagination in guest menu (12 items/page)
  - [x] Add page navigation controls with ellipsis
  - [x] Update URL with page parameter
  - [x] Show items count info
  - [x] Reset to page 1 on category/search change
  - _Commit:_ `feat: add pagination to guest menu (12 items per page)`
  - _Points:_ -0.75 ✅

- [x] **Task 7.7: Email Verification**
  - [x] Setup email service (NodeMailer/SendGrid)
  - [x] Send verification email on registration
  - [x] Create email verification endpoint
  - [x] Add email verification page
  - _Points:_ -0.25 ✅

- [x] **Task 7.8: Forgot Password**
  - [x] Create forgot password page
  - [x] Add link from login page
  - [x] Implement backend logic (token generation, email)
  - [x] Create reset password page
  - _Points:_ -0.5 ✅

### Medium Priority Features

- [x] **Task 7.9: User Profile Management**
  - [x] Create customer profile page
  - [x] Edit name, email, phone
  - [x] Change password feature
  - [x] Upload avatar image
  - _Points:_ -1.0

- [x] **Task 7.10: Revenue Reports & Charts**
  - [x] Install Chart.js or Recharts
  - [x] Create daily/weekly/monthly revenue charts
  - [x] Top products pie chart
  - [x] Order trends line chart
  - [x] Time range filter
  - _Points:_ -0.75

- [ ] **Task 7.11: Sort Menu Items (Admin)**
  - [ ] Add sort dropdown in admin products list
  - [ ] Sort by: creation date, price, name, popularity
  - [ ] Persist sort preference
  - _Points:_ -0.25

- [ ] **Task 7.12: Order Timer & Alerts**
  - [ ] Calculate order preparation time
  - [ ] Highlight overdue orders in Kitchen Display
  - [ ] Show countdown timer
  - [ ] Sound alert for overdue orders
  - _Points:_ -0.25

- [ ] **Task 7.13: QR Code Regeneration**
  - [ ] Add regenerate QR button
  - [ ] Invalidate old QR codes
  - [ ] Update table QR in database
  - _Points:_ -0.25

### Low Priority Features

- [ ] **Task 7.14: Chef Recommendations**
  - [ ] Add `isRecommended` field to Product model
  - [ ] Add recommendation toggle in admin
  - [ ] Display badge on menu items
  - [ ] Filter by recommendations
  - _Points:_ -0.25

- [ ] **Task 7.15: Related Items Suggestions**
  - [ ] Suggest items from same category
  - [ ] Show in product detail modal
  - [ ] Based on popularity
  - _Points:_ -0.25

- [ ] **Task 7.16: Multi-Image Upload**
  - [ ] Update Product model for multiple images
  - [ ] Implement image gallery
  - [ ] Add/remove images in admin
  - _Points:_ -0.5

- [ ] **Task 7.17: Discount System**
  - [ ] Add discount field to orders
  - [ ] Percentage and fixed amount discounts
  - [ ] Apply discount in Bill Modal
  - _Points:_ -0.25

- [ ] **Task 7.18: Menu Item Detail Page**
  - [ ] Create dedicated product detail page
  - [ ] Show full description, allergens
  - [ ] Display item availability status
  - _Points:_ -0.5

- [ ] **Task 7.19: Sort by Popularity**
  - [ ] Track order count per product
  - [ ] Add sort option in guest menu
  - [ ] Show "Popular" badge
  - _Points:_ -0.25

---

## **Estimated Points Summary**

### Current Implementation

- ✅ Modules 1-6: ~68-70 points

### After Critical Tasks (7.1-7.2)

- Target: ~74-75 points

### After High Priority (7.3-7.8)

- Target: ~77-78 points

### Full Completion

- Maximum Possible: ~85+ points (with advanced features bonus)
