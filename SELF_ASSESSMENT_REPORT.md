# Final project Self-assessment report

Team: 20120450-23120256-23122056

GitHub repo URL: https://github.com/Hidebray/smart-restaurant
# **TEAM INFORMATION**

| Student ID | Full name | Git account | Contribution | Contribution percentage (100% total) | Expected total points | Final total points |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 20120450 | Phạm Hữu Đan | danhuupham | \<List of tasks done by student 1\> | 33.3% |  |  |
| 23120256 | Trần Đại Hiệp | Hidebray | \<List of tasks done by student 2\> | 33.3% |  |  |
| 23122056 | Lâm Hoàng Vũ | vtpy23 | \<List of tasks done by student 3\> | 33.4% |  |  |

# **FEATURE LIST**

**Project:** Smart Restaurant - QR Menu Ordering System

Students must input minus points to every uncompleted feature in the SE column.

\*SE: Self-evaluation

\*TR: Teacher review

| ID | Features | Grade |  |  | Notes |
| ----- | :---- | ----- | :---- | :---- | :---- |
|  |  | **Point** | **SE\*** | **TR\*** |  |
| **1** | **Overall requirements** |  |  |  |  |
|  | User-centered design | \-5 | 0 |  | Built with user experience in mind, not just feature list. Focus on solving real restaurant problems: seamless QR ordering, efficient waiter workflow, real-time kitchen coordination, and convenient payment options |
|  | Database design | \-1 | 0 |  | Database with tables: users, restaurants, menus, menu_items, categories, modifiers, tables, orders, order_items, payments |
|  | Database mock data | \-1 | 0 |  | Sample restaurants, menu items, categories, tables, and test orders |
|  | Website layout | \-2 | 0 |  | Two layouts: Customer mobile ordering interface and Admin dashboard |
|  | Website architect | \-3 | 0 |  | Based on MVC architecture. Clear separation of concerns with controllers, services, repositories. Client-side validation, Input validation, Business rule validation |
|  | Website stability and compatibility | \-2 | 0 |  | Mobile-first responsive design, tested on Chrome and Safari |
|  | Document | \-1 | 0 |  | Clear documentation for developers and users: setup guide, API endpoints, database design, system architecture, user guide |
|  | Demo video | \-5 |  |  | Video demonstrating all features: restaurant signup, menu management, QR ordering, payment, KDS |
|  | Publish to public hosts | \-1 |  |  | Deployed to a public hosting service with accessible URL |
|  | Development progress is recorded in Github | \-7 | 0|  | Git history with meaningful commits, branches for features, pull requests |
| **2** | **Guest features (Customer Ordering)** |  |  |  |  |
|  | Home page (Menu page) | \-0.25 | 0 |  | Restaurant menu page loaded via QR code scan with categories and items |
|  | View list of menu items | \-0.25 | 0|  | Display menu items with images, prices, descriptions |
|  | Filter menu items by |  |  |  | A combination of the criteria |
|  | › Item name | \-0.25 | 0 |  | Search menu items by name |
|  | › Category | \-0.25 | 0 |  | Filter by food categories (Appetizers, Main Dishes, Drinks, Desserts) |
|  | Sort menu items by popularity | \-0.25 | 0 |  | Sort by most ordered items |
|  | › Chef recommendation | \-0.25 | 0 |  | Filter/highlight items marked as chef's recommendations |
|  | Menu item paging | \-0.75 | 0 |  | Pagination for large menus with infinite scroll. URL updated on search/filter/paging |
|  | View menu item details | \-0.25 | 0 |  | Item detail page with full description, modifiers, allergen info |
|  | View menu item status | \-0.25 | 0 |  | Display item availability status (Available, Unavailable, Sold out) |
|  | Show related menu items | \-0.25 | 0 |  | Suggest items from same category or popular pairings |
|  | View list of item reviews | \-0.5 | 0 |  | Customer reviews for menu items with pagination |
|  | Add a new item review | \-0.25 | 0 |  | Logged-in customers can review items they ordered |
|  | Shopping cart (Order Cart) |  |  |  |  |
|  | › Add a menu item to the Cart | \-0.25 | 0 |  | Add items with quantity selection |
|  | › View and update items in the Cart | \-0.5 | 0 |  | Cart summary with items, quantities, modifiers, prices. Update quantity with auto-update totals |
|  | Ordering and payment (Dine-in) |  |  |  |  |
|  | › Bind the shopping cart to the table session | \-0.25 | 0 |  | Cart persists for table session |
|  | › Input order details (notes, special requests) | \-0.25 | 0 |  | Guest name, special instructions field |
|  | › Add items to current order | \-0.25 | 0 |  | Customers can add more items to their unpaid order (single order per table session) |
|  | › View order status | \-0.25 | 0 |  | Guest can track order status (Received → Preparing → Ready) |
|  | › View order details | \-0.25 | 0 |  | Order confirmation with items, total, table number |
|  | › Request bill | \-0.25 | 0 |  | Customer requests bill when ready to pay |
|  | › Process payment after meal | \-0.25 | chưa hoàn hiện |  | Stripe payment processing after dining |
| **3** | **Authentication and authorization** |  |  |  |  |
|  | Use a popular authentication library | \-1 | 0 |  | Passport.js with JWT strategy |
|  | Registration (Customer Signup) | \-0.5 | 0 |  | Customer registration with email/password. Real-time email availability check |
|  | Verify user input: password complexity, full name | \-0.25 | 0 |  | Password rules, required fields validation |
|  | Account activation by email | \-0.25 | 0 |  | Email verification link sent on signup |
|  | Social Sign-up/Sign-In | \-0.25 | 0 |  | Google OAuth integration |
|  | Login to the website | \-0.25 | 0 |  | JWT-based authentication for admin/staff |
|  | Authorize website features | \-0.25 | 0 |  | Role-based access control (Admin, Waiter, Kitchen Staff, Customer) |
|  | Forgot password by email | \-0.25 | 0 |  | Password reset via email link |
| **4** | **Features for logged-in users (Customers)** |  |  |  |  |
|  | Update user profile | \-0.25 | 0 |  | Customer can update name, preferences |
|  | Verify user input | \-0.25 | 0 |  | Input validation on profile updates |
|  | Update the user's avatar | \-0.25 | 0 |  | Profile photo upload |
|  | Update password | \-0.25 | 0 |  | Change password with old password verification |
|  | Order history and tracking | \-0.25 | 0 |  | List of past orders linked to user account |
|  | › View order history | \-0.25 | 0 |  | List of past orders linked to user account |
|  | › View item processing status | \-0.25 | 0 |  | Track individual item status within an order (Queued, Cooking, Ready) |
|  | › Real-time Order Updates | 0.5 | 0.5 |  | WebSocket-based live order status updates for customers |
| **5** | **Administration features (Restaurant Admin)** |  |  |  |  |
|  | Create Admin accounts | \-0.25 | 0 |  | Admin creates additional Admin accounts |
|  | Manage Admin accounts | \-0.25 | 0 |  | View, edit, deactivate Admin accounts |
|  | Update admin profile | \-0.25 | 0 |  | Restaurant admin profile management |
|  | Create Waiter accounts | \-0.25 | 0 |  | Admin creates accounts for waiters |
|  | Create Kitchen Staff accounts | \-0.25 | 0 |  | Admin creates accounts for kitchen staff |
|  | Manage menu categories | \-0.25 | 0 |  | Create, edit, delete food categories |
|  | View menu item list | \-0.5 | 0 |  | List all menu items with filters and pagination |
|  | Filter menu items by name, category | \-0.25 | 0 |  | Search and filter menu items |
|  | Sort menu items by creation time, price, popularity | \-0.25 | 0 |  | Sortable menu item list |
|  | Create a new menu item | \-0.25 | 0 |  | Add item with name, price, description, category, prep time |
|  | Upload multiple menu item photos | \-0.5 | 0 |  | Multi-image upload for menu items |
|  | Add menu item to category with modifiers | \-0.25 | 0 |  | Assign categories and create modifier groups (Size, Extras) |
|  | Menu Item Modifiers | 0.5 | 0 |  | Modifier groups (Size, Extras) with price adjustments |
|  | Specify menu item status | \-0.25 | 0 |  | Available, Unavailable, Sold out |
|  | Verify user input | \-0.25 | 0 |  | Input validation for menu items |
|  | Update a menu item | \-0.25 | 0 |  | Edit existing menu items |
|  | Add, remove menu item photos | \-0.25 | 0 |  | Manage item images |
|  | Change menu item category, modifiers | \-0.25 | 0 |  | Update item categorization |
|  | Update menu item status | \-0.25 | 0 |  | Toggle availability |
|  | Verify user input | \-0.25 | 0 |  | Validation on updates |
|  | Customer orders (Order Management) |  |  |  |  |
|  | › View list of orders sorted by creation time | \-0.25 | 0 |  | Order list in KDS sorted by time |
|  | › Filter orders by status | \-0.25 | 0 |  | Filter: Received, Preparing, Ready, Completed |
|  | › View order details | \-0.25 | chưa làm |  | Full order details with items, modifiers, notes |
|  | › Update order status | \-0.25 | chưa làm |  | Progress order through states: Received → Preparing → Ready → Completed |
|  | › Kitchen Display System (KDS) | -0.5 | chưa hoàn hiện (chưa có chuông) |  | Real-time order display for kitchen staff with sound notifications |
|  | › Order Timer and Alerts | -0.25 | chưa làm |  | Highlight orders exceeding item's configured prep time |
|  | Table Management |  |  |  |  |
|  | › Create, edit, deactivate tables | -0.5 | chưa hoàn thiện (chưa vô hiệu hóa) |  | Create, edit, deactivate tables with capacity and location |
|  | › QR Code Generation | -0.5 | 0 |  | Generate unique QR codes per table with signed tokens |
|  | › QR Code Download/Print | -0.25 | 0 |  | Download QR as PNG/PDF for printing |
|  | › QR Code Regeneration | -0.25 | 0 |  | Regenerate QR and invalidate old codes |
|  | Reports |  |  |  |  |
|  | › View revenue report in time range | \-0.25 | chưa hoàn thiện |  | Daily, weekly, monthly revenue reports |
|  | › View top revenue by menu item in time range | \-0.25 | chưa hoàn thiện |  | Best-selling items report |
|  | › Show interactive chart in reports | \-0.25 | chưa hoàn thiện |  | Chart.js/Recharts for analytics dashboard (orders/day, peak hours, popular items) |
| **7** | **Waiter features** |  |  |  |  |
|  | View pending orders | \-0.25 | 0 |  | List of new orders waiting for waiter acceptance |
|  | Accept/Reject order items | \-0.25 | 0 |  | Waiter can accept or reject individual order items |
|  | Send orders to kitchen | \-0.25 | 0 |  | Forward accepted orders to Kitchen Display System |
|  | View assigned tables | \-0.25 | chưa làm |  | See tables assigned to the waiter |
|  | Mark orders as served | \-0.25 | 0 |  | Update order status when food is delivered to table |
|  | Bill Management |  |  |  |  |
|  | › Create bill for table | \-0.25 | 0 |  | Generate bill with all order items, subtotal, tax, and total |
|  | › Print bill | \-0.25 | 0 |  | Print bill to thermal printer or download as PDF |
|  | › Apply discounts | \-0.25 | chưa làm (cái này của khách hàng chứ không phải waiter ) |  | Apply percentage or fixed amount discounts to bill |
|  | › Process payment | \-0.25 | 0 |  | Mark bill as paid (cash, card, or e-wallet) |
| **8** | **Advanced features** |  |  |  |  |
|  | Payment system integration | 0.5 |  |  | Payment gateway integration (ZaloPay, MoMo, VNPay, Stripe, etc.) - at least 1 required |
|  | Fuzzy search | 0.25 |  |  | Fuzzy matching for menu item search with typo tolerance |
|  | Use memory cache to boost performance | 0.25 |  |  | Redis for menu caching and session management |
|  | Analyze and track user actions | 0.25 |  |  | Google Analytics for QR scan tracking, order conversion metrics |
|  | Dockerize your project | 0.25 |  |  | Docker containers for backend, frontend, database |
|  | CI/CD | 0.25 |  |  | GitHub Actions for automated testing and deployment |
|  | Monitoring and logging | 0.25 |  |  | Centralized application logs, metrics, dashboards, and alerting (e.g., ELK/EFK, Prometheus/Grafana) |
|  | BI integration | 0.25 |  |  | Connect operational data to BI tools for reporting and dashboards (e.g., Power BI, Tableau, Metabase) |
|  | Advanced authorization (RBAC) | 0.25 |  |  | Fine-grained role/permission management for Admin/Chef/Waiter and other staff roles |
|  | WebSocket real-time updates | 0.5 |  |  | Socket.IO for real-time features: KDS order notifications, customer order status tracking, waiter new order alerts, kitchen ready notifications, table status updates |
|  | Multi-tenant support | 0.5 |  |  | Multiple restaurants (tenants) with strict data isolation; tenant-scoped RBAC and configuration |
|  | Multilingual support | 0.25 |  |  | i18n for English/Vietnamese language selection |

# **GIT HISTORY**

## **Contributors**

| Avatar | Username | Commits | Additions | Deletions |
| :---- | :---- | :---- | :---- | :---- |
|  | \<git_username_1\> |  |  |  |
|  | \<git_username_2\> |  |  |  |
|  | \<git_username_3\> |  |  |  |

## **Commits**

*List significant commits here with format:*

| Date | Author | Commit Message | Files Changed |
| :---- | :---- | :---- | :---- |
| YYYY-MM-DD | \<author\> | \<commit message\> | \<number\> |

---

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

*Note: Fill in the student information, contribution details, self-evaluation scores, and git history before submission.*
