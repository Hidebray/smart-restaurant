# Final project Self-assessment report

Team: 20120450-23120256-23122056

GitHub repo URL: https://github.com/Hidebray/smart-restaurant

# **TEAM INFORMATION**

| MSSV     | Họ và Tên     | Git account | Contribution                                              | Commits | Tỷ lệ |
| -------- | ------------- | ----------- | --------------------------------------------------------- | ------- | ----- |
| 20120450 | Phạm Hữu Đan  | danhuupham  | Frontend Developer, UI/UX Designer, Integration           | 120     | 51.9% |
| 23120256 | Trần Đại Hiệp | Hidebray    | Backend Developer, Database Architect, Real-time Features | 51      | 22.1% |
| 23122056 | Lâm Hoàng Vũ  | vtpy23      | Full-stack Developer, Git Manager, QA & Code Review       | 60      | 26.0% |

# **FEATURE LIST**

**Project:** Smart Restaurant - QR Menu Ordering System

Students must input minus points to every uncompleted feature in the SE column.

\*SE: Self-evaluation

\*TR: Teacher review

| ID    | Features                                            | Grade     |          |          | Notes                                                                                                                                                                                                                 |
| ----- | :-------------------------------------------------- | --------- | :------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       |                                                     | **Point** | **SE\*** | **TR\*** |                                                                                                                                                                                                                       |
| **1** | **Overall requirements**                            |           |          |          |                                                                                                                                                                                                                       |
|       | User-centered design                                | \-5       | 0        |          | Built with user experience in mind, not just feature list. Focus on solving real restaurant problems: seamless QR ordering, efficient waiter workflow, real-time kitchen coordination, and convenient payment options |
|       | Database design                                     | \-1       | 0        |          | Database with tables: users, restaurants, menus, menu_items, categories, modifiers, tables, orders, order_items, payments                                                                                             |
|       | Database mock data                                  | \-1       | 0        |          | Sample restaurants, menu items, categories, tables, and test orders                                                                                                                                                   |
|       | Website layout                                      | \-2       | 0        |          | Two layouts: Customer mobile ordering interface and Admin dashboard                                                                                                                                                   |
|       | Website architect                                   | \-3       | 0        |          | Based on MVC architecture. Clear separation of concerns with controllers, services, repositories. Client-side validation, Input validation, Business rule validation                                                  |
|       | Website stability and compatibility                 | \-2       | 0        |          | Mobile-first responsive design, tested on Chrome and Safari                                                                                                                                                           |
|       | Document                                            | \-1       | 0        |          | Clear documentation for developers and users: setup guide, API endpoints, database design, system architecture, user guide                                                                                            |
|       | Demo video                                          | \-5       | 0        |          | Video demonstrating all features: restaurant signup, menu management, QR ordering, payment, KDS                                                                                                                       |
|       | Publish to public hosts                             | \-1       | 0        |          | Deployed to a public hosting service with accessible URL                                                                                                                                                              |
|       | Development progress is recorded in Github          | \-7       | 0        |          | Git history with meaningful commits, branches for features, pull requests                                                                                                                                             |
| **2** | **Guest features (Customer Ordering)**              |           |          |          |                                                                                                                                                                                                                       |
|       | Home page (Menu page)                               | \-0.25    | 0        |          | Restaurant menu page loaded via QR code scan with categories and items                                                                                                                                                |
|       | View list of menu items                             | \-0.25    | 0        |          | Display menu items with images, prices, descriptions                                                                                                                                                                  |
|       | Filter menu items by                                |           |          |          | A combination of the criteria                                                                                                                                                                                         |
|       | › Item name                                         | \-0.25    | 0        |          | Search menu items by name                                                                                                                                                                                             |
|       | › Category                                          | \-0.25    | 0        |          | Filter by food categories (Appetizers, Main Dishes, Drinks, Desserts)                                                                                                                                                 |
|       | Sort menu items by popularity                       | \-0.25    | 0        |          | Sort by most ordered items                                                                                                                                                                                            |
|       | › Chef recommendation                               | \-0.25    | 0        |          | Filter/highlight items marked as chef's recommendations                                                                                                                                                               |
|       | Menu item paging                                    | \-0.75    | 0        |          | Pagination for large menus with infinite scroll. URL updated on search/filter/paging                                                                                                                                  |
|       | View menu item details                              | \-0.25    | 0        |          | Item detail page with full description, modifiers, allergen info                                                                                                                                                      |
|       | View menu item status                               | \-0.25    | 0        |          | Display item availability status (Available, Unavailable, Sold out)                                                                                                                                                   |
|       | Show related menu items                             | \-0.25    | 0        |          | Suggest items from same category or popular pairings                                                                                                                                                                  |
|       | View list of item reviews                           | \-0.5     | 0        |          | Customer reviews for menu items with pagination                                                                                                                                                                       |
|       | Add a new item review                               | \-0.25    | 0        |          | Logged-in customers can review items they ordered                                                                                                                                                                     |
|       | Shopping cart (Order Cart)                          |           |          |          |                                                                                                                                                                                                                       |
|       | › Add a menu item to the Cart                       | \-0.25    | 0        |          | Add items with quantity selection                                                                                                                                                                                     |
|       | › View and update items in the Cart                 | \-0.5     | 0        |          | Cart summary with items, quantities, modifiers, prices. Update quantity with auto-update totals                                                                                                                       |
|       | Ordering and payment (Dine-in)                      |           |          |          |                                                                                                                                                                                                                       |
|       | › Bind the shopping cart to the table session       | \-0.25    | 0        |          | Cart persists for table session                                                                                                                                                                                       |
|       | › Input order details (notes, special requests)     | \-0.25    | 0        |          | Guest name, special instructions field                                                                                                                                                                                |
|       | › Add items to current order                        | \-0.25    | 0        |          | Customers can add more items to their unpaid order (single order per table session)                                                                                                                                   |
|       | › View order status                                 | \-0.25    | 0        |          | Guest can track order status (Received → Preparing → Ready)                                                                                                                                                           |
|       | › View order details                                | \-0.25    | 0        |          | Order confirmation with items, total, table number                                                                                                                                                                    |
|       | › Request bill                                      | \-0.25    | 0        |          | Customer requests bill when ready to pay                                                                                                                                                                              |
|       | › Process payment after meal                        | \-0.25    | 0        |          | Stripe payment processing after dining                                                                                                                                                                                |
| **3** | **Authentication and authorization**                |           |          |          |                                                                                                                                                                                                                       |
|       | Use a popular authentication library                | \-1       | 0        |          | Passport.js with JWT strategy                                                                                                                                                                                         |
|       | Registration (Customer Signup)                      | \-0.5     | 0        |          | Customer registration with email/password. Real-time email availability check                                                                                                                                         |
|       | Verify user input: password complexity, full name   | \-0.25    | 0        |          | Password rules, required fields validation                                                                                                                                                                            |
|       | Account activation by email                         | \-0.25    | 0        |          | Email verification link sent on signup                                                                                                                                                                                |
|       | Social Sign-up/Sign-In                              | \-0.25    | 0        |          | Google OAuth integration                                                                                                                                                                                              |
|       | Login to the website                                | \-0.25    | 0        |          | JWT-based authentication for admin/staff                                                                                                                                                                              |
|       | Authorize website features                          | \-0.25    | 0        |          | Role-based access control (Admin, Waiter, Kitchen Staff, Customer)                                                                                                                                                    |
|       | Forgot password by email                            | \-0.25    | 0        |          | Password reset via email link                                                                                                                                                                                         |
| **4** | **Features for logged-in users (Customers)**        |           |          |          |                                                                                                                                                                                                                       |
|       | Update user profile                                 | \-0.25    | 0        |          | Customer can update name, preferences                                                                                                                                                                                 |
|       | Verify user input                                   | \-0.25    | 0        |          | Input validation on profile updates                                                                                                                                                                                   |
|       | Update the user's avatar                            | \-0.25    | 0        |          | Profile photo upload                                                                                                                                                                                                  |
|       | Update password                                     | \-0.25    | 0        |          | Change password with old password verification                                                                                                                                                                        |
|       | Order history and tracking                          |           |          |          |                                                                                                                                                                                                                       |
|       | › View order history                                | \-0.25    | 0        |          | List of past orders linked to user account                                                                                                                                                                            |
|       | › View item processing status                       | \-0.25    | 0        |          | Track individual item status within an order (Queued, Cooking, Ready)                                                                                                                                                 |
|       | › Real-time Order Updates                           | 0.5       | 0        |          | WebSocket-based live order status updates for customers                                                                                                                                                               |
| **5** | **Administration features (Restaurant Admin)**      |           |          |          |                                                                                                                                                                                                                       |
|       | Create Admin accounts                               | \-0.25    | 0        |          | Admin creates additional Admin accounts                                                                                                                                                                               |
|       | Manage Admin accounts                               | \-0.25    | 0        |          | View, edit, deactivate Admin accounts                                                                                                                                                                                 |
|       | Update admin profile                                | \-0.25    | 0        |          | Restaurant admin profile management                                                                                                                                                                                   |
|       | Create Waiter accounts                              | \-0.25    | 0        |          | Admin creates accounts for waiters                                                                                                                                                                                    |
|       | Create Kitchen Staff accounts                       | \-0.25    |          |          | Admin creates accounts for kitchen staff                                                                                                                                                                              |
|       | Manage menu categories                              | \-0.25    | 0        |          | Create, edit, delete food categories                                                                                                                                                                                  |
|       | View menu item list                                 | \-0.5     | 0        |          | List all menu items with filters and pagination                                                                                                                                                                       |
|       | Filter menu items by name, category                 | \-0.25    | 0        |          | Search and filter menu items                                                                                                                                                                                          |
|       | Sort menu items by creation time, price, popularity | \-0.25    | 0        |          | Sortable menu item list                                                                                                                                                                                               |
|       | Create a new menu item                              | \-0.25    | 0        |          | Add item with name, price, description, category, prep time                                                                                                                                                           |
|       | Upload multiple menu item photos                    | \-0.5     | 0        |          | Multi-image upload for menu items                                                                                                                                                                                     |
|       | Add menu item to category with modifiers            | \-0.25    | 0        |          | Assign categories and create modifier groups (Size, Extras)                                                                                                                                                           |
|       | Menu Item Modifiers                                 | 0.5       | 0        |          | Modifier groups (Size, Extras) with price adjustments                                                                                                                                                                 |
|       | Specify menu item status                            | \-0.25    | 0        |          | Available, Unavailable, Sold out                                                                                                                                                                                      |
|       | Verify user input                                   | \-0.25    | 0        |          | Input validation for menu items                                                                                                                                                                                       |
|       | Update a menu item                                  | \-0.25    | 0        |          | Edit existing menu items                                                                                                                                                                                              |
|       | Add, remove menu item photos                        | \-0.25    | 0        |          | Manage item images                                                                                                                                                                                                    |
|       | Change menu item category, modifiers                | \-0.25    | 0        |          | Update item categorization                                                                                                                                                                                            |
|       | Update menu item status                             | \-0.25    | 0        |          | Toggle availability                                                                                                                                                                                                   |
|       | Verify user input                                   | \-0.25    | 0        |          | Validation on updates                                                                                                                                                                                                 |
|       | Customer orders (Order Management)                  |           |          |          |                                                                                                                                                                                                                       |
|       | › View list of orders sorted by creation time       | \-0.25    | 0        |          | Order list in KDS sorted by time                                                                                                                                                                                      |
|       | › Filter orders by status                           | \-0.25    | 0        |          | Filter: Received, Preparing, Ready, Completed                                                                                                                                                                         |
|       | › View order details                                | \-0.25    | 0        |          | Full order details with items, modifiers, notes                                                                                                                                                                       |
|       | › Update order status                               | \-0.25    | 0        |          | Progress order through states: Received → Preparing → Ready → Completed                                                                                                                                               |
|       | › Kitchen Display System (KDS)                      | -0.5      | 0        |          | Real-time order display for kitchen staff with sound notifications                                                                                                                                                    |
|       | › Order Timer and Alerts                            | -0.25     | 0        |          | Highlight orders exceeding item's configured prep time                                                                                                                                                                |
|       | Table Management                                    |           |          |          |                                                                                                                                                                                                                       |
|       | › Create, edit, deactivate tables                   | -0.5      | 0        |          | Create, edit, deactivate tables with capacity and location                                                                                                                                                            |
|       | › QR Code Generation                                | -0.5      | 0        |          | Generate unique QR codes per table with signed tokens                                                                                                                                                                 |
|       | › QR Code Download/Print                            | -0.25     | 0        |          | Download QR as PNG/PDF for printing                                                                                                                                                                                   |
|       | › QR Code Regeneration                              | -0.25     | 0        |          | Regenerate QR and invalidate old codes                                                                                                                                                                                |
|       | Reports                                             |           |          |          |                                                                                                                                                                                                                       |
|       | › View revenue report in time range                 | \-0.25    | 0        |          | Daily, weekly, monthly revenue reports                                                                                                                                                                                |
|       | › View top revenue by menu item in time range       | \-0.25    | 0        |          | Best-selling items report                                                                                                                                                                                             |
|       | › Show interactive chart in reports                 | \-0.25    | 0        |          | Chart.js/Recharts for analytics dashboard (orders/day, peak hours, popular items)                                                                                                                                     |
| **7** | **Waiter features**                                 |           |          |          |                                                                                                                                                                                                                       |
|       | View pending orders                                 | \-0.25    | 0        |          | List of new orders waiting for waiter acceptance                                                                                                                                                                      |
|       | Accept/Reject order items                           | \-0.25    | 0        |          | Waiter can accept or reject individual order items                                                                                                                                                                    |
|       | Send orders to kitchen                              | \-0.25    | 0        |          | Forward accepted orders to Kitchen Display System                                                                                                                                                                     |
|       | View assigned tables                                | \-0.25    | 0        |          | See tables assigned to the waiter                                                                                                                                                                                     |
|       | Mark orders as served                               | \-0.25    | 0        |          | Update order status when food is delivered to table                                                                                                                                                                   |
|       | Bill Management                                     |           |          |          |                                                                                                                                                                                                                       |
|       | › Create bill for table                             | \-0.25    | 0        |          | Generate bill with all order items, subtotal, tax, and total                                                                                                                                                          |
|       | › Print bill                                        | \-0.25    | 0        |          | Print bill to thermal printer or download as PDF                                                                                                                                                                      |
|       | › Apply discounts                                   | \-0.25    | 0        |          | Apply percentage or fixed amount discounts to bill                                                                                                                                                                    |
|       | › Process payment                                   | \-0.25    | 0        |          | Mark bill as paid (cash, card, or e-wallet)                                                                                                                                                                           |
| **8** | **Advanced features**                               |           |          |          |                                                                                                                                                                                                                       |
|       | Payment system integration                          | 0.5       | 0.5      |          | Payment gateway integration (ZaloPay, MoMo, VNPay, Stripe, etc.) - at least 1 required                                                                                                                                |
|       | Fuzzy search                                        | 0.25      | 0.25     |          | Fuzzy matching for menu item search with typo tolerance                                                                                                                                                               |
|       | Use memory cache to boost performance               | 0.25      | 0        |          | Redis for menu caching and session management                                                                                                                                                                         |
|       | Analyze and track user actions                      | 0.25      | 0        |          | Google Analytics for QR scan tracking, order conversion metrics                                                                                                                                                       |
|       | Dockerize your project                              | 0.25      | 0.25     |          | Docker containers for backend, frontend, database                                                                                                                                                                     |
|       | CI/CD                                               | 0.25      | 0        |          | GitHub Actions for automated testing and deployment                                                                                                                                                                   |
|       | Monitoring and logging                              | 0.25      | 0        |          | Centralized application logs, metrics, dashboards, and alerting (e.g., ELK/EFK, Prometheus/Grafana)                                                                                                                   |
|       | BI integration                                      | 0.25      | 0        |          | Connect operational data to BI tools for reporting and dashboards (e.g., Power BI, Tableau, Metabase)                                                                                                                 |
|       | Advanced authorization (RBAC)                       | 0.25      | 0        |          | Fine-grained role/permission management for Admin/Chef/Waiter and other staff roles                                                                                                                                   |
|       | WebSocket real-time updates                         | 0.5       | 0.5      |          | Socket.IO for real-time features: KDS order notifications, customer order status tracking, waiter new order alerts, kitchen ready notifications, table status updates                                                 |
|       | Multi-tenant support                                | 0.5       | 0        |          | Multiple restaurants (tenants) with strict data isolation; tenant-scoped RBAC and configuration                                                                                                                       |
|       | Multilingual support                                | 0.25      | 0.25     |          | i18n for English/Vietnamese language selection                                                                                                                                                                        |

# **GIT HISTORY**

## **Contributors**

**Repository:** `smart-restaurant`  
**Main Branch:** `main`  
**Total Commits:** 231 commits  
**Contributors:** 3 thành viên

| Author        | Commits | Tỷ lệ |
| ------------- | ------- | ----- |
| Phạm Hữu Đan  | 120     | 51.9% |
| Lâm Hoàng Vũ  | 60      | 26.0% |
| Trần Đại Hiệp | 51      | 22.1% |

![Git Shortlog](Report%20images/Screenshot%202026-01-20%20152118.png)

### Chi tiết Commits (Sắp xếp theo thời gian)

| Date       | Author        | Commit Hash | Message                                                                                   |
| ---------- | ------------- | ----------- | ----------------------------------------------------------------------------------------- |
| 2026-01-05 | Trần Đại Hiệp | 9ee76be     | Generation by Google AI Studio & Gemini                                                   |
| 2026-01-05 | Trần Đại Hiệp | 1ba4dbc     | chore: init nextjs project and setup docker postgres                                      |
| 2026-01-06 | Trần Đại Hiệp | 26d3a73     | feat: setup prisma schema and seed data                                                   |
| 2026-01-06 | Trần Đại Hiệp | 85531ba     | feat: connect guest menu to real api                                                      |
| 2026-01-06 | Trần Đại Hiệp | f310b16     | feat: complete guest ordering flow (menu display, cart drawer, order api)                 |
| 2026-01-06 | Trần Đại Hiệp | 2289a56     | feat: setup standalone socket.io server for realtime features                             |
| 2026-01-06 | Trần Đại Hiệp | 9452e04     | feat: setup socket.io server and client connection                                        |
| 2026-01-06 | Trần Đại Hiệp | 85b3a75     | feat: implement kitchen kds dashboard with realtime order updates                         |
| 2026-01-06 | Trần Đại Hiệp | e619957     | feat: implement waiter dashboard and refine kitchen workflow (pending/accepted logic)     |
| 2026-01-07 | Trần Đại Hiệp | 4d99fe7     | docs: add project tasks tracking and comprehensive setup guide                            |
| 2026-01-07 | Trần Đại Hiệp | bfb4f7e     | docs: add project tasks tracking and comprehensive setup guide                            |
| 2026-01-12 | Phạm Hữu Đan  | 386703a     | Split the project into two repositories: frontend and backend                             |
| 2026-01-12 | Phạm Hữu Đan  | 6a7d05a     | Standardize the standard folder structure                                                 |
| 2026-01-12 | Phạm Hữu Đan  | 9a33d55     | Delete unnecessary .gitignore files                                                       |
| 2026-01-12 | Phạm Hữu Đan  | befa08b     | Update Readme                                                                             |
| 2026-01-13 | Trần Đại Hiệp | 48fc1d8     | feat(auth): implement user authentication and authorization                               |
| 2026-01-13 | Trần Đại Hiệp | bf0fed1     | feat: implement table management and QR code generation                                   |
| 2026-01-14 | Trần Đại Hiệp | 707a5a5     | feat(orders): support item modifiers and add Socket.IO order events                       |
| 2026-01-14 | Trần Đại Hiệp | 0fdb5ff     | feat(frontend): send and display order modifiers; add tables QR page                      |
| 2026-01-14 | Trần Đại Hiệp | 7f55697     | feat: implement jwt authentication logic and login API                                    |
| 2026-01-14 | Trần Đại Hiệp | 7f216da     | feat: implement login page UI and authentication flow                                     |
| 2026-01-14 | Trần Đại Hiệp | 10fd185     | chore: update seed script to use hashed passwords                                         |
| 2026-01-14 | Trần Đại Hiệp | bdbfa76     | chore: update seed script to use hashed password                                          |
| 2026-01-14 | Trần Đại Hiệp | 64ec0ba     | feat: add middleware to protect private routes                                            |
| 2026-01-15 | Lâm Hoàng Vũ  | fc33d99     | setup admin layout and product list view, enable admin product creation and editing       |
| 2026-01-15 | Lâm Hoàng Vũ  | f12f53f     | Merge pull request #1 from Hidebray/vu                                                    |
| 2026-01-15 | Phạm Hữu Đan  | eb10266     | docs: Add initial project description and self-assessment report                          |
| 2026-01-15 | Phạm Hữu Đan  | dfeee1b     | Rename components                                                                         |
| 2026-01-15 | Phạm Hữu Đan  | 8d20288     | Rename components                                                                         |
| 2026-01-15 | Phạm Hữu Đan  | 58e6f23     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-15 | Phạm Hữu Đan  | a83fc10     | docs: Add database seeding command and default login credentials to README                |
| 2026-01-15 | Phạm Hữu Đan  | ca7395e     | feat: Implement initial backend API for products and tables, and set up frontend          |
| 2026-01-15 | Phạm Hữu Đan  | d1bf4cc     | feat: Add initial admin dashboard layout, kitchen order management page                   |
| 2026-01-15 | Phạm Hữu Đan  | 1a3d173     | feat: implement initial frontend pages and components for kitchen order management        |
| 2026-01-15 | Phạm Hữu Đan  | 40fcf6d     | feat: Implement full-stack authentication, user management, and role-based interfaces     |
| 2026-01-15 | Phạm Hữu Đan  | 2fcba39     | feat(admin): Add StaffForm component for creating new staff members                       |
| 2026-01-15 | Phạm Hữu Đan  | e27da20     | feat: Implement admin staff management page with user CRUD operations                     |
| 2026-01-15 | Phạm Hữu Đan  | 83d0fbf     | feat: Implement comprehensive table management with CRUD operations, QR code generation   |
| 2026-01-15 | Phạm Hữu Đan  | eac3ec9     | make the text darker                                                                      |
| 2026-01-15 | Phạm Hữu Đan  | 1810cc7     | docs: Revamp README with comprehensive project overview                                   |
| 2026-01-16 | Trần Đại Hiệp | 820c565     | feat: implement product modifier management                                               |
| 2026-01-16 | Trần Đại Hiệp | 481f83f     | feat(modifiers): complete and stabilize product modifier workflow                         |
| 2026-01-16 | Trần Đại Hiệp | 9dd32f9     | feat: implement analytics and reporting dashboard                                         |
| 2026-01-16 | Trần Đại Hiệp | 4f255f0     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-16 | Phạm Hữu Đan  | cd5b14a     | feat: Implement user authentication (registration, login) and backend order management    |
| 2026-01-16 | Phạm Hữu Đan  | 69d4e97     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-16 | Phạm Hữu Đan  | 6cf5829     | small fix                                                                                 |
| 2026-01-16 | Phạm Hữu Đan  | 8f01293     | feat: Add initial project structure including mockups for customer, admin, and waiter UIs |
| 2026-01-16 | Phạm Hữu Đan  | 472d41e     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-16 | Phạm Hữu Đan  | 781d7fb     | feat: add mobile Header component with title, optional back button                        |
| 2026-01-16 | Phạm Hữu Đan  | e2b1cf8     | feat: Implement guest application with table identification, cart management              |
| 2026-01-16 | Phạm Hữu Đan  | c2dced8     | feat: add mobile bottom navigation component with menu, cart, orders, and profile links   |
| 2026-01-16 | Phạm Hữu Đan  | 1737317     | feat: Implement admin order management and sales reporting with new API endpoints and UI  |
| 2026-01-16 | Phạm Hữu Đan  | f67af26     | feat: Implement a comprehensive restaurant order management system                        |
| 2026-01-16 | Phạm Hữu Đan  | 9600e04     | feat: Add real-time waiter and kitchen dashboards for order management                    |
| 2026-01-16 | Phạm Hữu Đan  | 60e4d30     | feat: Implement initial user authentication with email verification                       |
| 2026-01-16 | Phạm Hữu Đan  | f902280     | feat: Implement user authentication including registration, login, email verification     |
| 2026-01-16 | Phạm Hữu Đan  | 5a73bd0     | feat: Implement user authentication with local and Google OAuth                           |
| 2026-01-16 | Phạm Hữu Đan  | 0c4738b     | feat: Introduce customer registration, email verification, and Google authentication      |
| 2026-01-16 | Phạm Hữu Đan  | 99e7b5b     | docs: Update environment configuration templates with actual non-sensitive values         |
| 2026-01-16 | Phạm Hữu Đan  | 3bcca69     | docs: Reset environment templates to default placeholders                                 |
| 2026-01-16 | Phạm Hữu Đan  | a545391     | docs: Restore DATABASE_URL to actual configuration                                        |
| 2026-01-17 | Trần Đại Hiệp | 5d1a82d     | feat: implement bill modal and payment demo (Task 4.1)                                    |
| 2026-01-17 | Trần Đại Hiệp | 0942ef0     | feat: integrate stripe for online payments (Task 4.4)                                     |
| 2026-01-17 | Trần Đại Hiệp | d84a76e     | feat: implement table call assistance (payment request) notification                      |
| 2026-01-17 | Trần Đại Hiệp | 030ee4d     | docs: update README with payment and notification features                                |
| 2026-01-17 | Trần Đại Hiệp | 29f1e10     | ops: setup production dockerfiles and compose                                             |
| 2026-01-17 | Trần Đại Hiệp | 1e2340b     | docs: comprehensive update of README with all features and changelog                      |
| 2026-01-17 | Trần Đại Hiệp | abc577f     | feat: implement customer self-registration                                                |
| 2026-01-17 | Trần Đại Hiệp | f35efe7     | feat: enable customer item reviews                                                        |
| 2026-01-17 | Trần Đại Hiệp | d544362     | feat: implement fuzzy search for products                                                 |
| 2026-01-17 | Trần Đại Hiệp | b73a1a7     | feat: add multi-language support (EN/VI)                                                  |
| 2026-01-17 | Trần Đại Hiệp | 1b43dbe     | fix: add language switcher to all pages                                                   |
| 2026-01-17 | Trần Đại Hiệp | 6120a7d     | fix: implement translations on login page                                                 |
| 2026-01-17 | Trần Đại Hiệp | 451cd85     | feat: add translations to all dashboards (waiter, kitchen, admin)                         |
| 2026-01-17 | Trần Đại Hiệp | 881199b     | docs: update README with Module 6 features                                                |
| 2026-01-17 | Trần Đại Hiệp | bc7544c     | docs: add Module 7 missing features to tasks.md                                           |
| 2026-01-17 | Trần Đại Hiệp | 8b8944a     | feat: add QR code download as PNG feature                                                 |
| 2026-01-17 | Trần Đại Hiệp | fd6889c     | feat: add print bill functionality with react-to-print                                    |
| 2026-01-17 | Trần Đại Hiệp | dc31d63     | docs: mark Tasks 7.4 & 7.5 complete, update README                                        |
| 2026-01-17 | Trần Đại Hiệp | 1eb14eb     | feat: add pagination to guest menu (12 items per page)                                    |
| 2026-01-17 | Trần Đại Hiệp | d09f9ed     | docs: mark Task 7.6 complete, update README                                               |
| 2026-01-18 | Phạm Hữu Đan  | 4525557     | feat: Implement full authentication flow with login, forgot/reset password, Google OAuth  |
| 2026-01-18 | Phạm Hữu Đan  | 517f53e     | feat: introduce initial frontend structure including guest menu                           |
| 2026-01-18 | Phạm Hữu Đan  | c8b2875     | feat: Implement guest cart and ordering system with new pages                             |
| 2026-01-18 | Phạm Hữu Đan  | 0be3079     | feat: implement guest menu page with product display, search, category filtering          |
| 2026-01-18 | Phạm Hữu Đan  | ee34b87     | feat: implement guest menu page with product display using Zustand menu store             |
| 2026-01-18 | Phạm Hữu Đan  | b41867f     | feat: Implement guest order management with viewing, payment, waiter assistance           |
| 2026-01-18 | Phạm Hữu Đan  | bf2ef60     | feat: Add initial public-facing pages including landing, menu, and tables                 |
| 2026-01-18 | Phạm Hữu Đan  | 0b57f7e     | feat: Implement initial user authentication flows with internationalization support       |
| 2026-01-18 | Phạm Hữu Đan  | 6049837     | feat: Implement guest menu page with product display, search, category filtering          |
| 2026-01-18 | Phạm Hữu Đan  | ddeeb1a     | feat: Implement user login with email/password and Google authentication                  |
| 2026-01-18 | Phạm Hữu Đan  | 7303435     | feat: Implement login page with email/password and Google authentication                  |
| 2026-01-18 | Phạm Hữu Đan  | 7cebe33     | fix the QR Code generation                                                                |
| 2026-01-18 | Phạm Hữu Đan  | b841108     | small fix UI                                                                              |
| 2026-01-18 | Phạm Hữu Đan  | 902d887     | add more products                                                                         |
| 2026-01-18 | Phạm Hữu Đan  | ebed3c0     | fix UI and translation                                                                    |
| 2026-01-19 | Lâm Hoàng Vũ  | 0576c84     | task 7.9                                                                                  |
| 2026-01-19 | Lâm Hoàng Vũ  | 98352b3     | Add admin reports feature with revenue charts                                             |
| 2026-01-19 | Lâm Hoàng Vũ  | 27d8953     | Merge pull request #2 from Hidebray/vu                                                    |
| 2026-01-19 | Lâm Hoàng Vũ  | ba2859a     | feat(products): add admin products management                                             |
| 2026-01-19 | Lâm Hoàng Vũ  | fe3d50f     | Merge pull request #3 from Hidebray/vu                                                    |
| 2026-01-19 | Lâm Hoàng Vũ  | 70dc8c1     | feat(products): update product schema and admin product form                              |
| 2026-01-19 | Lâm Hoàng Vũ  | 013b038     | update tasks                                                                              |
| 2026-01-19 | Lâm Hoàng Vũ  | 7db57f1     | Merge pull request #4 from Hidebray/vu                                                    |
| 2026-01-19 | Trần Đại Hiệp | 2ed3636     | feat: implement order timer for kds and waiter dashboard with visual alerts               |
| 2026-01-19 | Trần Đại Hiệp | 8e657eb     | feat: implement qr code regeneration and secure token authentication                      |
| 2026-01-19 | Trần Đại Hiệp | af18ee0     | feat: implement chef recommendations with admin toggle and badging                        |
| 2026-01-19 | Trần Đại Hiệp | 3f2fa34     | feat: implement related items suggestion in product modal                                 |
| 2026-01-19 | Trần Đại Hiệp | 2e42dce     | feat: implement product popularity tracking and menu sorting                              |
| 2026-01-19 | Lâm Hoàng Vũ  | 77c6a01     | feat: add discount functionality to orders with update and display in bill modal          |
| 2026-01-19 | Lâm Hoàng Vũ  | 3063d7e     | feat: enhance order processing with improved discount application                         |
| 2026-01-19 | Lâm Hoàng Vũ  | 40f8bc1     | Merge pull request #5 from Hidebray/vu                                                    |
| 2026-01-19 | Lâm Hoàng Vũ  | 9c70944     | feat(products): add allergens field to product schema                                     |
| 2026-01-19 | Lâm Hoàng Vũ  | 956ff3c     | Update tasks.md to mark Task 7.17: Discount System as complete                            |
| 2026-01-19 | Lâm Hoàng Vũ  | 4fdc24c     | Merge pull request #6 from Hidebray/vu                                                    |
| 2026-01-19 | Lâm Hoàng Vũ  | 9f2f27f     | Update bill modal and sync prisma migration                                               |
| 2026-01-19 | Lâm Hoàng Vũ  | 2a2c045     | Merge pull request #7 from Hidebray/vu                                                    |
| 2026-01-19 | Lâm Hoàng Vũ  | 7053836     | feat: enhance user and table management with waiter assignment                            |
| 2026-01-19 | Lâm Hoàng Vũ  | bc535fd     | Merge pull request #8 from Hidebray/vu                                                    |
| 2026-01-19 | Lâm Hoàng Vũ  | 130647e     | style: update UI components for improved accessibility and visual consistency             |
| 2026-01-19 | Lâm Hoàng Vũ  | df9c191     | Merge pull request #9 from Hidebray/vu                                                    |
| 2026-01-19 | Lâm Hoàng Vũ  | 8e73f49     | feat: introduce loyalty points system with models for loyalty tiers                       |
| 2026-01-19 | Lâm Hoàng Vũ  | ec61d25     | Merge pull request #10 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | e656d21     | feat: implement user feedback system with ratings and comments for products               |
| 2026-01-19 | Lâm Hoàng Vũ  | dbdb1d2     | Merge pull request #11 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | 8af72ea     | feat: implement inventory management system with models                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | ca6f139     | Merge pull request #12 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | 698b317     | feat: implement table reservation system with new Reservation model                       |
| 2026-01-19 | Lâm Hoàng Vũ  | 23315c8     | Merge pull request #13 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | ee8de9b     | feat: integrate user authentication system with login, registration                       |
| 2026-01-19 | Lâm Hoàng Vũ  | 010e3e6     | Merge pull request #14 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | fe2a2de     | Remove obsolete documentation files                                                       |
| 2026-01-19 | Lâm Hoàng Vũ  | ad58d25     | Merge pull request #15 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | 2c14081     | Add inventory, loyalty, reservation modules and related UI                                |
| 2026-01-19 | Lâm Hoàng Vũ  | 4d85e52     | Merge pull request #16 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | c8bb5f7     | feat: add analytics module with AnalyticsSnapshot model                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | afd5565     | Merge pull request #17 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | b7dddb9     | Advanced Analytics Dashboard                                                              |
| 2026-01-19 | Lâm Hoàng Vũ  | 2a86c30     | Merge pull request #18 from Hidebray/vu                                                   |
| 2026-01-19 | Lâm Hoàng Vũ  | 128463c     | Revert "Merge pull request #18 from Hidebray/vu"                                          |
| 2026-01-19 | Lâm Hoàng Vũ  | c1f383a     | feat: add loyalty points, inventory, and reservation systems                              |
| 2026-01-19 | Lâm Hoàng Vũ  | f96a22f     | thêm vào dependencies trong package.json                                                  |
| 2026-01-19 | Phạm Hữu Đan  | ad00746     | update self assessment report                                                             |
| 2026-01-19 | Phạm Hữu Đan  | ea9d031     | fix bug create product                                                                    |
| 2026-01-19 | Phạm Hữu Đan  | 18188e6     | use Cloudinary for upload image                                                           |
| 2026-01-19 | Phạm Hữu Đan  | 29aef72     | use Cloudinary for profile picture upload                                                 |
| 2026-01-19 | Phạm Hữu Đan  | 57f7bc5     | update item review                                                                        |
| 2026-01-19 | Phạm Hữu Đan  | 65f53f4     | update request bill                                                                       |
| 2026-01-19 | Phạm Hữu Đan  | c4a50de     | update Menu item paging                                                                   |
| 2026-01-19 | Phạm Hữu Đan  | b21b8c3     | update guest UI and translation                                                           |
| 2026-01-19 | Phạm Hữu Đan  | 864049d     | update product modal                                                                      |
| 2026-01-19 | Phạm Hữu Đan  | fdb6a9d     | Verify user input                                                                         |
| 2026-01-19 | Phạm Hữu Đan  | c0bfb91     | user order history                                                                        |
| 2026-01-19 | Phạm Hữu Đan  | 887f508     | update translation                                                                        |
| 2026-01-19 | Phạm Hữu Đan  | c139c89     | View item processing status and update UI kitchen                                         |
| 2026-01-19 | Phạm Hữu Đan  | 0aaa118     | View menu item status                                                                     |
| 2026-01-19 | Phạm Hữu Đan  | d7ae58e     | View menu item status                                                                     |
| 2026-01-19 | Phạm Hữu Đan  | caa72c0     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-19 | Phạm Hữu Đan  | 557bbdf     | Show related menu items                                                                   |
| 2026-01-19 | Phạm Hữu Đan  | 61d9d68     | Input order details                                                                       |
| 2026-01-19 | Phạm Hữu Đan  | e838dbc     | update team info                                                                          |
| 2026-01-20 | Phạm Hữu Đan  | f10232d     | update Customer Signup                                                                    |
| 2026-01-20 | Phạm Hữu Đan  | 4c91484     | update Registration and Verify user input                                                 |
| 2026-01-20 | Phạm Hữu Đan  | ceb3e97     | Manage Admin accounts                                                                     |
| 2026-01-20 | Phạm Hữu Đan  | b1c77e7     | update UI Staff                                                                           |
| 2026-01-20 | Phạm Hữu Đan  | 5c4ae54     | Update admin profile                                                                      |
| 2026-01-20 | Phạm Hữu Đan  | ed711cc     | Manage menu categories                                                                    |
| 2026-01-20 | Phạm Hữu Đan  | 3a3150d     | update translation                                                                        |
| 2026-01-20 | Phạm Hữu Đan  | 2a7fb54     | add filter Categories                                                                     |
| 2026-01-20 | Phạm Hữu Đan  | e413173     | update UI Products page                                                                   |
| 2026-01-20 | Phạm Hữu Đan  | f2c0474     | Filter orders by status                                                                   |
| 2026-01-20 | Phạm Hữu Đan  | 947eb53     | View order details                                                                        |
| 2026-01-20 | Phạm Hữu Đan  | cd6e68e     | Update order status                                                                       |
| 2026-01-20 | Phạm Hữu Đan  | 902fe7c     | Kitchen Display System with sound                                                         |
| 2026-01-20 | Phạm Hữu Đan  | e479a54     | update Table Management                                                                   |
| 2026-01-20 | Phạm Hữu Đan  | ba674c4     | View revenue report in time range                                                         |
| 2026-01-20 | Phạm Hữu Đan  | 28fe5ff     | View top revenue by menu item in time range                                               |
| 2026-01-20 | Phạm Hữu Đan  | 987720c     | Show interactive chart in reports                                                         |
| 2026-01-20 | Phạm Hữu Đan  | 9f3ec53     | View assigned tables                                                                      |
| 2026-01-20 | Phạm Hữu Đan  | d18db47     | Apply discounts                                                                           |
| 2026-01-20 | Phạm Hữu Đan  | b205e6f     | update UI for discount price                                                              |
| 2026-01-20 | Phạm Hữu Đan  | edf100d     | use Stripe for payment                                                                    |
| 2026-01-20 | Phạm Hữu Đan  | 81dd32b     | feat: implement real fuzzy search with Fuse.js for typo tolerance                         |
| 2026-01-20 | Phạm Hữu Đan  | 09e7187     | fix: implement role-based access control in middleware                                    |
| 2026-01-20 | Phạm Hữu Đan  | c09492c     | fix: allow ADMIN to access kitchen and waiter pages                                       |
| 2026-01-20 | Phạm Hữu Đan  | 0668bf7     | update package.json                                                                       |
| 2026-01-20 | Phạm Hữu Đan  | 7e56b05     | update UI profile                                                                         |
| 2026-01-20 | Phạm Hữu Đan  | 12b415b     | update UI table selection                                                                 |
| 2026-01-20 | Phạm Hữu Đan  | 91a77ca     | update UI for cart                                                                        |
| 2026-01-20 | Phạm Hữu Đan  | d01bef9     | Refine UI/UX and Localizations across Profile, Tables, Cart, and Waiter pages             |
| 2026-01-20 | Lâm Hoàng Vũ  | d4f406a     | remove Analytics link from Admin layout                                                   |
| 2026-01-20 | Lâm Hoàng Vũ  | 385428a     | Remove FEATURE_COMPARISON_REPORT.md and update package-lock.json                          |
| 2026-01-20 | Lâm Hoàng Vũ  | 5f0fd03     | Merge pull request #19 from Hidebray/config-update-92667                                  |
| 2026-01-20 | Lâm Hoàng Vũ  | b456809     | Enhance localization by adding translations for Loyalty, Inventory, and Reservations      |
| 2026-01-20 | Lâm Hoàng Vũ  | 8c5583a     | Merge pull request #20 from Hidebray/config-update-92667                                  |
| 2026-01-20 | Lâm Hoàng Vũ  | f9127b4     | Refactor Admin layout to improve accessibility and streamline navigation                  |
| 2026-01-20 | Lâm Hoàng Vũ  | 812973c     | Merge pull request #21 from Hidebray/config-update-92667                                  |
| 2026-01-20 | Lâm Hoàng Vũ  | fc5418f     | add Final Project Report                                                                  |
| 2026-01-20 | Lâm Hoàng Vũ  | 9e9bcbe     | Merge pull request #22 from Hidebray/config-update-92667                                  |
| 2026-01-20 | Lâm Hoàng Vũ  | 4d14226     | Implement loyalty points redemption in cart functionality                                 |
| 2026-01-20 | Lâm Hoàng Vũ  | 4447a90     | Merge pull request #23 from Hidebray/config-update-92667                                  |
| 2026-01-20 | Phạm Hữu Đan  | 129ac98     | update UI /menu and /menu/items                                                           |
| 2026-01-20 | Phạm Hữu Đan  | 01dfd52     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-20 | Phạm Hữu Đan  | 3fc7ba2     | update guest UI                                                                           |
| 2026-01-20 | Lâm Hoàng Vũ  | c042030     | Enhance loyalty points display and localization support                                   |
| 2026-01-20 | Phạm Hữu Đan  | 330dde5     | update UX/UI /kitchen                                                                     |
| 2026-01-20 | Phạm Hữu Đan  | 693af0c     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-20 | Lâm Hoàng Vũ  | d237167     | Add category name localization for guest menu page                                        |
| 2026-01-20 | Phạm Hữu Đan  | 0644d9b     | update realtime in /waiter                                                                |
| 2026-01-20 | Phạm Hữu Đan  | f8ce5b7     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-20 | Lâm Hoàng Vũ  | 5f80431     | Add copy voucher code feature with click to clipboard                                     |
| 2026-01-20 | Phạm Hữu Đan  | 08ea99b     | update UI /waiter                                                                         |
| 2026-01-20 | Phạm Hữu Đan  | f7a5259     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-20 | Phạm Hữu Đan  | f00b37c     | update UI /verify-email                                                                   |
| 2026-01-20 | Phạm Hữu Đan  | d9f1b5c     | add ChefHat                                                                               |
| 2026-01-20 | Lâm Hoàng Vũ  | da73a29     | Enhance seed data script with user roles, loyalty points, vouchers                        |
| 2026-01-20 | Phạm Hữu Đan  | 9ec7940     | display allergen info /guest                                                              |
| 2026-01-20 | Phạm Hữu Đan  | 9334fc4     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                       |
| 2026-01-20 | Phạm Hữu Đan  | 5f53012     | fix loyalty UI                                                                            |
| 2026-01-20 | Phạm Hữu Đan  | c95b856     | store URL params in guest page                                                            |
| 2026-01-20 | Lâm Hoàng Vũ  | 57c8d3f     | Fix admin dashboard to use real data from API instead of mock data                        |
| 2026-01-20 | Lâm Hoàng Vũ  | b0facc5     | Add inventory stock validation when creating orders                                       |
| 2026-01-20 | Phạm Hữu Đan  | 8b81959     | Fix tsconfig include backend prisma seed                                                  |
| 2026-01-20 | Phạm Hữu Đan  | ac5203a     | Fix inventory type import path                                                            |
| 2026-01-20 | Phạm Hữu Đan  | 3af1d48     | Fix inventory type imports                                                                |
| 2026-01-20 | Phạm Hữu Đan  | 918f573     | Fix inventory types import in inventory page                                              |
| 2026-01-20 | Phạm Hữu Đan  | f75420c     | Fix final typescript errors in product modal and loyalty imports                          |
| 2026-01-20 | Phạm Hữu Đan  | 0b65765     | Remove build log files                                                                    |
| 2026-01-20 | Lâm Hoàng Vũ  | 52d083f     | chore(db): add large seed data                                                            |
| 2026-01-20 | Lâm Hoàng Vũ  | a5bf0f5     | docs: add self assessment report                                                          |

# **PROJECT SUMMARY**

## System Overview

**Smart Restaurant** is a QR-based menu ordering system for **dine-in service** that enables restaurants to:

- Manage digital menus with categories, items, and modifiers
- Generate unique QR codes for each table
- Allow customers to scan QR, browse menu, and place orders from their phones
- Customers can add items to their current order during their visit (single order per table session)
- Process payments after the meal via payment gateway integration (ZaloPay, MoMo, VNPay, Stripe, etc.) - pay-after-meal model
- Track orders in real-time via Kitchen Display System (KDS)
- View analytics and performance reports

**Note:** This is a single-restaurant system. Multi-tenant support is not included.

## Technology Stack

- **Architecture:** Single Page Application (SPA)
- **Frontend:** ReactJS / NextJS
- **Backend:** NodeJS with Express/similar framework
- **Database:** SQL or NoSQL database
- **Authentication:** Passport.js with JWT
- **Payment:** Payment Gateway (ZaloPay, MoMo, VNPay, Stripe, etc.)
- **Real-time:** Socket.IO / WebSocket
- **Caching:** Redis (optional)
- **Hosting:** Public hosting service

## Key User Flows

1. **Restaurant Setup:** Admin account creation → Admin login → Menu Creation → Table Setup → QR Generation
2. **Customer Registration:** Sign up → Email Verification → Login → Access order history
3. **Customer Ordering (Dine-in):** Scan QR → View Menu → Add to Cart → Submit Items → Track Order → Add More Items → Request Bill → Payment
4. **Waiter Order Acceptance:** Customer Places Order → Waiter Receives Notification → Waiter Reviews → Accept/Reject → Send to Kitchen
5. **Order Processing (Kitchen):** Waiter Accepts Order → Kitchen Receives → Preparing → Ready → Waiter Serves → Completed

---
