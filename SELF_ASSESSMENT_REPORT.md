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
|  | Demo video | \-5 | 0 |  | Video demonstrating all features: restaurant signup, menu management, QR ordering, payment, KDS |
|  | Publish to public hosts | \-1 | 0 |  | Deployed to a public hosting service with accessible URL |
|  | Development progress is recorded in Github | \-7 | 0 |  | Git history with meaningful commits, branches for features, pull requests |
| **2** | **Guest features (Customer Ordering)** |  |  |  |  |
|  | Home page (Menu page) | \-0.25 | 0 |  | Restaurant menu page loaded via QR code scan with categories and items |
|  | View list of menu items | \-0.25 | 0 |  | Display menu items with images, prices, descriptions |
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
|  | › Process payment after meal | \-0.25 | 0 |  | Stripe payment processing after dining |
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
|  | Order history and tracking |  |  |  |  |
|  | › View order history | \-0.25 | 0 |  | List of past orders linked to user account |
|  | › View item processing status | \-0.25 | 0 |  | Track individual item status within an order (Queued, Cooking, Ready) |
|  | › Real-time Order Updates | 0.5 | 0 |  | WebSocket-based live order status updates for customers |
| **5** | **Administration features (Restaurant Admin)** |  |  |  |  |
|  | Create Admin accounts | \-0.25 | 0 |  | Admin creates additional Admin accounts |
|  | Manage Admin accounts | \-0.25 | 0 |  | View, edit, deactivate Admin accounts |
|  | Update admin profile | \-0.25 | 0 |  | Restaurant admin profile management |
|  | Create Waiter accounts | \-0.25 | 0 |  | Admin creates accounts for waiters |
|  | Create Kitchen Staff accounts | \-0.25 |  |  | Admin creates accounts for kitchen staff |
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
|  | › View order details | \-0.25 | 0 |  | Full order details with items, modifiers, notes |
|  | › Update order status | \-0.25 | 0 |  | Progress order through states: Received → Preparing → Ready → Completed |
|  | › Kitchen Display System (KDS) | -0.5 | 0 |  | Real-time order display for kitchen staff with sound notifications |
|  | › Order Timer and Alerts | -0.25 | 0 |  | Highlight orders exceeding item's configured prep time |
|  | Table Management |  |  |  |  |
|  | › Create, edit, deactivate tables | -0.5 | 0 |  | Create, edit, deactivate tables with capacity and location |
|  | › QR Code Generation | -0.5 | 0 |  | Generate unique QR codes per table with signed tokens |
|  | › QR Code Download/Print | -0.25 | 0 |  | Download QR as PNG/PDF for printing |
|  | › QR Code Regeneration | -0.25 | 0 |  | Regenerate QR and invalidate old codes |
|  | Reports |  |  |  |  |
|  | › View revenue report in time range | \-0.25 | 0 |  | Daily, weekly, monthly revenue reports |
|  | › View top revenue by menu item in time range | \-0.25 | 0 |  | Best-selling items report |
|  | › Show interactive chart in reports | \-0.25 | 0 |  | Chart.js/Recharts for analytics dashboard (orders/day, peak hours, popular items) |
| **7** | **Waiter features** |  |  |  |  |
|  | View pending orders | \-0.25 | 0 |  | List of new orders waiting for waiter acceptance |
|  | Accept/Reject order items | \-0.25 | 0 |  | Waiter can accept or reject individual order items |
|  | Send orders to kitchen | \-0.25 | 0 |  | Forward accepted orders to Kitchen Display System |
|  | View assigned tables | \-0.25 | 0 |  | See tables assigned to the waiter |
|  | Mark orders as served | \-0.25 | 0 |  | Update order status when food is delivered to table |
|  | Bill Management |  |  |  |  |
|  | › Create bill for table | \-0.25 | 0 |  | Generate bill with all order items, subtotal, tax, and total |
|  | › Print bill | \-0.25 | 0 |  | Print bill to thermal printer or download as PDF |
|  | › Apply discounts | \-0.25 | 0 |  | Apply percentage or fixed amount discounts to bill |
|  | › Process payment | \-0.25 | 0 |  | Mark bill as paid (cash, card, or e-wallet) |
| **8** | **Advanced features** |  |  |  |  |
|  | Payment system integration | 0.5 | 0.5 |  | Payment gateway integration (ZaloPay, MoMo, VNPay, Stripe, etc.) - at least 1 required |
|  | Fuzzy search | 0.25 | 0.25 |  | Fuzzy matching for menu item search with typo tolerance |
|  | Use memory cache to boost performance | 0.25 | 0  |  | Redis for menu caching and session management |
|  | Analyze and track user actions | 0.25 | 0 |  | Google Analytics for QR scan tracking, order conversion metrics |
|  | Dockerize your project | 0.25 | 0.25 |  | Docker containers for backend, frontend, database |
|  | CI/CD | 0.25 | 0 |  | GitHub Actions for automated testing and deployment |
|  | Monitoring and logging | 0.25 | 0 |  | Centralized application logs, metrics, dashboards, and alerting (e.g., ELK/EFK, Prometheus/Grafana) |
|  | BI integration | 0.25 | 0 |  | Connect operational data to BI tools for reporting and dashboards (e.g., Power BI, Tableau, Metabase) |
|  | Advanced authorization (RBAC) | 0.25 | 0 |  | Fine-grained role/permission management for Admin/Chef/Waiter and other staff roles |
|  | WebSocket real-time updates | 0.5 | 0.5 |  | Socket.IO for real-time features: KDS order notifications, customer order status tracking, waiter new order alerts, kitchen ready notifications, table status updates |
|  | Multi-tenant support | 0.5 | 0 |  | Multiple restaurants (tenants) with strict data isolation; tenant-scoped RBAC and configuration |
|  | Multilingual support | 0.25 | 0.25 |  | i18n for English/Vietnamese language selection |

# **GIT HISTORY**

## **Contributors**

| Avatar | Username | Commits | Additions | Deletions |
| :---- | :---- | :---- | :---- | :---- |
|  | Hidebray |  |  |  |
|  | vtpy23 |  |  |  |
|  | vtpy23 |  |  |  |

## **Commits**

*List significant commits here with format:*

| Date | Author | Commit Message | Files Changed |
|------|--------|----------------|---------------|
| 2026-01-20 | Hidebray | docs: add self assessment report | SELF_ASSESSMENT_REPORT.md |
| 2026-01-20 | Hidebray | chore(db): add large seed data | backend/prisma/seed.ts |
| 2026-01-20 | Dan Pham | Remove build log files | frontend/build_error.log, frontend/build_log.txt |
| 2026-01-20 | Dan Pham | Fix final typescript errors in product modal and loyalty imports | frontend/build_error.log, frontend/build_log.txt, frontend/src/app/admin/loyalty/VoucherFormModal.tsx, frontend/src/app/admin/loyalty/page.tsx, frontend/src/app/admin/reservations/ReservationFormModal.tsx, frontend/src/app/admin/reservations/page.tsx, frontend/src/app/guest/cart/page.tsx, frontend/src/components/ProductModal.tsx, frontend/src/components/inventory/LowStockAlert.tsx, ... |
| 2026-01-20 | Dan Pham | Fix inventory types import in inventory page | frontend/src/app/admin/inventory/page.tsx |
| 2026-01-20 | Dan Pham | Fix inventory type imports | frontend/src/app/admin/inventory/RestockModal.tsx |
| 2026-01-20 | Dan Pham | Fix inventory type import path | frontend/src/app/admin/inventory/InventoryFormModal.tsx |
| 2026-01-20 | Dan Pham | Fix tsconfig include backend prisma seed | frontend/tsconfig.json |
| 2026-01-20 | vtpy23 | Add inventory stock validation when creating orders - prevent ordering out-of-stock or over-stock items | backend/src/orders/orders.service.ts, backend/src/products/products.service.ts, frontend/src/app/guest/page.tsx, frontend/src/components/ProductModal.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json, frontend/src/types/index.ts |
| 2026-01-20 | vtpy23 | Fix admin dashboard to use real data from API instead of mock data | frontend/src/app/admin/dashboard/page.tsx |
| 2026-01-20 | Dan Pham | store URL params in guest page | frontend/src/app/guest/page.tsx |
| 2026-01-20 | Dan Pham | fix loyalty UI | frontend/src/components/loyalty/PointsDisplay.tsx |
| 2026-01-20 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-20 | Dan Pham | display allergen info /guest | frontend/src/components/ProductModal.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | vtpy23 | Enhance seed data script by adding new user roles, loyalty points, vouchers, and order creation logic. Clean up old data before seeding and improve logging for better visibility of the seeding process. Update cart page to handle user authentication and loyalty points fetching more robustly, ensuring proper error handling and state management. | backend/prisma/seed.ts, frontend/src/app/guest/cart/page.tsx |
| 2026-01-20 | Dan Pham | add ChefHat | frontend/src/app/guest/page.tsx, frontend/src/app/menu/page.tsx, frontend/src/components/ProductModal.tsx |
| 2026-01-20 | Dan Pham | update UI /verify-email | frontend/src/app/verify-email/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-20 | Dan Pham | update UI /waiter | frontend/src/app/waiter/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | vtpy23 | Add copy voucher code feature with click to clipboard | frontend/src/components/loyalty/VoucherList.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-20 | Dan Pham | update realtime in /waiter | frontend/src/app/waiter/page.tsx |
| 2026-01-20 | vtpy23 | Add category name localization for guest menu page | frontend/src/app/guest/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-20 | Dan Pham | update UX/UI /kitchen | frontend/src/app/kitchen/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | vtpy23 | Enhance loyalty points display and localization support. Update PointsDisplay component to use internationalization for tier names and error messages. Modify loyalty-related text in profile and loyalty pages to utilize translation keys. Add new translation entries for loyalty features in English and Vietnamese. | frontend/src/app/guest/loyalty/page.tsx, frontend/src/app/guest/profile/page.tsx, frontend/src/components/loyalty/PointsDisplay.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | update guest UI | frontend/src/app/menu/items/[id]/page.tsx, frontend/src/components/ProductModal.tsx |
| 2026-01-20 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-20 | Dan Pham | update UI /menu and /menu/items | frontend/src/app/menu/items/[id]/page.tsx, frontend/src/app/menu/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json, frontend/src/store/useMenuStore.ts |
| 2026-01-20 | vtpy23 | Merge pull request #23 from Hidebray/config-update-92667 |  |
| 2026-01-20 | vtpy23 | Implement loyalty points redemption in cart functionality, allowing users to apply points for discounts on orders. Update order creation logic to handle points and adjust discount calculations accordingly. Enhance UI to display available points and provide user prompts for login to use points. Add translations for new features in both English and Vietnamese. | backend/src/loyalty/loyalty.controller.ts, backend/src/orders/dto/create-order.dto.ts, backend/src/orders/orders.service.ts, frontend/src/app/guest/cart/page.tsx, frontend/src/lib/api/orders.ts, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | vtpy23 | Merge pull request #22 from Hidebray/config-update-92667 |  |
| 2026-01-20 | vtpy23 | add Fianl Project Report | Final Project Report.md |
| 2026-01-20 | vtpy23 | Merge pull request #21 from Hidebray/config-update-92667 |  |
| 2026-01-20 | vtpy23 | Refactor Admin layout to improve accessibility and streamline navigation, ensuring a more intuitive user experience. | Teamwork Report.md |
| 2026-01-20 | vtpy23 | Merge pull request #20 from Hidebray/config-update-92667 |  |
| 2026-01-20 | vtpy23 | Enhance localization by adding translations for Loyalty, Inventory, and Reservations in both English and Vietnamese, and update Admin layout to utilize these translations. | frontend/src/app/admin/layout.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | vtpy23 | Merge pull request #19 from Hidebray/config-update-92667 |  |
| 2026-01-20 | vtpy23 | Remove FEATURE_COMPARISON_REPORT.md and update package-lock.json files for backend and frontend with new dependencies and configurations. | FEATURE_COMPARISON_REPORT.md, backend/package-lock.json, frontend/package-lock.json |
| 2026-01-20 | vtpy23 | remove Analytics link from Admin layout | frontend/src/app/admin/layout.tsx |
| 2026-01-20 | Dan Pham | Refine UI/UX and Localizations across Profile, Tables, Cart, and Waiter pages | frontend/src/components/waiter/BillModal.tsx |
| 2026-01-20 | Dan Pham | update UI for cart | frontend/src/app/guest/cart/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | update UI table selection | frontend/src/app/tables/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | update UI profile | frontend/src/app/guest/profile/page.tsx, frontend/src/components/mobile/BottomNav.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | update package.json | frontend/package-lock.json, frontend/package.json |
| 2026-01-20 | Dan Pham | fix: allow ADMIN to access kitchen and waiter pages | frontend/src/middleware.ts |
| 2026-01-20 | Dan Pham | fix: implement role-based access control in middleware - prevent waiter/kitchen from accessing admin | frontend/src/middleware.ts |
| 2026-01-20 | Dan Pham | feat: implement real fuzzy search with Fuse.js for typo tolerance | frontend/package-lock.json, frontend/package.json, frontend/src/app/guest/page.tsx |
| 2026-01-20 | Dan Pham | use Stripe for payment | README.md, SELF_ASSESSMENT_REPORT.md, backend/.env.example, backend/src/payments/payments.controller.ts, backend/src/payments/payments.service.ts, frontend/.env.example, frontend/src/components/guest/PaymentModal.tsx |
| 2026-01-20 | Dan Pham | update UI for discount price | backend/src/reports/reports.service.ts, frontend/src/app/admin/orders/OrderDetailModal.tsx, frontend/src/app/admin/orders/page.tsx, frontend/src/app/guest/profile/orders/page.tsx, frontend/src/app/waiter/page.tsx |
| 2026-01-20 | Dan Pham | Apply discounts | SELF_ASSESSMENT_REPORT.md, backend/src/app.module.ts, backend/src/orders/dto/create-order.dto.ts, backend/src/orders/orders.service.ts, backend/src/vouchers.controller.ts, backend/src/vouchers.module.ts, backend/src/vouchers.service.ts, frontend/src/app/guest/cart/page.tsx, frontend/src/app/guest/orders/page.tsx, ... |
| 2026-01-20 | Dan Pham | View assigned tables | SELF_ASSESSMENT_REPORT.md, backend/src/orders/orders.controller.ts, frontend/src/app/admin/tables/TableFormModal.tsx, frontend/src/app/waiter/page.tsx |
| 2026-01-20 | Dan Pham | Show interactive chart in reports | SELF_ASSESSMENT_REPORT.md, frontend/src/app/admin/reports/revenue/page.tsx, frontend/src/components/charts/OrdersTrendChart.tsx, frontend/src/lib/api/reports.ts |
| 2026-01-20 | Dan Pham | View top revenue by menu item in time range | SELF_ASSESSMENT_REPORT.md, backend/src/reports/reports.service.ts, frontend/src/app/admin/reports/revenue/page.tsx |
| 2026-01-20 | Dan Pham | View revenue report in time range | SELF_ASSESSMENT_REPORT.md, frontend/src/app/admin/reports/page.tsx, frontend/src/app/admin/reports/revenue/page.tsx, frontend/src/components/charts/RevenueLineChart.tsx, frontend/src/components/charts/TopProductsPieChart.tsx |
| 2026-01-20 | Dan Pham | update Table Management | SELF_ASSESSMENT_REPORT.md, backend/src/tables/dto/update-table.dto.ts, frontend/package-lock.json, frontend/package.json, frontend/src/app/admin/tables/TableFormModal.tsx, frontend/src/app/admin/tables/TableList.tsx, frontend/src/app/admin/tables/page.tsx |
| 2026-01-20 | Dan Pham | Kitchen Display System with sound | SELF_ASSESSMENT_REPORT.md, frontend/src/app/kitchen/page.tsx |
| 2026-01-20 | Dan Pham | Update order status | SELF_ASSESSMENT_REPORT.md, frontend/src/app/admin/orders/OrderDetailModal.tsx, frontend/src/app/admin/orders/page.tsx, frontend/src/lib/api/orders.ts |
| 2026-01-20 | Dan Pham | View order details | SELF_ASSESSMENT_REPORT.md, frontend/src/app/admin/orders/OrderDetailModal.tsx, frontend/src/app/admin/orders/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham |  Filter orders by status | SELF_ASSESSMENT_REPORT.md, frontend/src/app/admin/orders/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | update UI Products page | SELF_ASSESSMENT_REPORT.md, backend/src/products/dto/create-product.dto.ts, frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | add filter Categories | frontend/src/app/admin/products/page.tsx |
| 2026-01-20 | Dan Pham | update translation | frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/app/admin/products/ProductList.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | Manage menu categories | SELF_ASSESSMENT_REPORT.md, backend/src/app.module.ts, backend/src/categories/categories.controller.ts, backend/src/categories/categories.module.ts, backend/src/categories/categories.service.ts, backend/src/categories/dto/create-category.dto.ts, backend/src/categories/dto/update-category.dto.ts, frontend/src/app/admin/categories/CategoryForm.tsx, frontend/src/app/admin/categories/page.tsx, ... |
| 2026-01-20 | Dan Pham | Update admin profile | SELF_ASSESSMENT_REPORT.md, frontend/src/app/admin/layout.tsx, frontend/src/app/admin/profile/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | update UI Staff | frontend/src/app/admin/staff/EditStaffModal.tsx, frontend/src/app/admin/staff/StaffForm.tsx, frontend/src/app/admin/staff/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | Manage Admin accounts | SELF_ASSESSMENT_REPORT.md, backend/prisma/schema.prisma, backend/src/auth/auth.service.ts, backend/src/user/dto/update-user.dto.ts, frontend/src/app/admin/staff/EditStaffModal.tsx, frontend/src/app/admin/staff/page.tsx, frontend/src/app/login/page.tsx, frontend/src/lib/api/users.ts, frontend/src/messages/en.json, ... |
| 2026-01-20 | Dan Pham | update Registration and Verify user input | SELF_ASSESSMENT_REPORT.md, backend/src/auth/dto/login.dto.ts, frontend/src/app/login/page.tsx, frontend/src/app/register/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-20 | Dan Pham | update Customer Signup | backend/src/auth/auth.controller.ts, backend/src/auth/auth.service.ts, frontend/src/app/register/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-19 | Dan Pham | update team info | SELF_ASSESSMENT_REPORT.md |
| 2026-01-19 | Dan Pham | Input order details | SELF_ASSESSMENT_REPORT.md, frontend/src/app/kitchen/page.tsx, frontend/src/app/waiter/page.tsx, frontend/src/types/index.ts |
| 2026-01-19 | Dan Pham | Show related menu items | SELF_ASSESSMENT_REPORT.md, frontend/src/app/guest/page.tsx, frontend/src/components/ProductModal.tsx |
| 2026-01-19 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-19 | Dan Pham | View menu item status | SELF_ASSESSMENT_REPORT.md, frontend/src/app/guest/page.tsx, frontend/src/components/ProductModal.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-19 | Dan Pham | View menu item status | frontend/src/app/guest/page.tsx, frontend/src/components/ProductModal.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-19 | Dan Pham | View item processing status and update UI kitchen | backend/prisma/schema.prisma, backend/src/orders/orders.controller.ts, backend/src/orders/orders.service.ts, frontend/src/app/guest/orders/page.tsx, frontend/src/app/guest/profile/orders/page.tsx, frontend/src/app/kitchen/page.tsx, frontend/src/components/OrderTimer.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json, ... |
| 2026-01-19 | Dan Pham | update translation | frontend/src/app/guest/profile/orders/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-19 | Dan Pham | user order history | SELF_ASSESSMENT_REPORT.md, backend/src/orders/orders.controller.ts, frontend/src/app/guest/profile/orders/page.tsx, frontend/src/app/guest/profile/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-19 | Dan Pham | Verify user input | SELF_ASSESSMENT_REPORT.md, frontend/src/app/guest/profile/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-19 | Dan Pham | update product modal | frontend/src/components/ProductModal.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-19 | Dan Pham | update guest UI and translation | backend/src/products/products.service.ts, frontend/src/app/guest/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json, frontend/src/types/index.ts |
| 2026-01-19 | Dan Pham | update Menu item paging | SELF_ASSESSMENT_REPORT.md, frontend/src/app/guest/page.tsx |
| 2026-01-19 | Dan Pham | update request bill | SELF_ASSESSMENT_REPORT.md, frontend/src/app/guest/orders/page.tsx, frontend/src/app/waiter/page.tsx |
| 2026-01-19 | Dan Pham | update item review | SELF_ASSESSMENT_REPORT.md, backend/src/reviews/reviews.service.ts, frontend/src/app/guest/orders/page.tsx, frontend/src/components/guest/ReviewModal.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-19 | Dan Pham | use Cloudinary for profile picture upload | SELF_ASSESSMENT_REPORT.md, backend/src/auth/auth.controller.ts, backend/src/auth/auth.module.ts, backend/src/auth/auth.service.ts, backend/src/user/user.controller.ts, backend/src/user/user.module.ts, backend/src/user/user.service.ts |
| 2026-01-19 | Dan Pham | use Cloudinary for upload image | README.md, backend/.env.example, backend/package-lock.json, backend/package.json, backend/src/app.module.ts, backend/src/cloudinary/cloudinary.module.ts, backend/src/cloudinary/cloudinary.provider.ts, backend/src/cloudinary/cloudinary.service.ts, backend/src/products/products.controller.ts, ... |
| 2026-01-19 | Dan Pham | fix bug create product | SELF_ASSESSMENT_REPORT.md, backend/src/products/dto/create-product.dto.ts, backend/src/products/products.service.ts, frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/components/ui/Dialog.tsx, frontend/src/lib/api/products.ts, frontend/src/types/index.ts |
| 2026-01-19 | Dan Pham | update self assessment report | SELF_ASSESSMENT_REPORT.md |
| 2026-01-19 | vtpy23 | thêm vào dependencies trong package.json | frontend/package-lock.json, frontend/package.json |
| 2026-01-19 | vtpy23 | feat: add loyalty points, inventory, and reservation systems | FEATURE_COMPARISON_REPORT.md, README.md, backend/prisma/migrations/20260119084156_add_loyalty_points_system/migration.sql, backend/prisma/migrations/20260119160253_add_inventory_management/migration.sql, backend/prisma/migrations/20260119_add_discount_fields/migration.sql, backend/src/app.module.ts, backend/src/inventory/inventory.service.ts, backend/src/loyalty/loyalty.service.ts, backend/src/reservations/reservations.service.ts, ... |
| 2026-01-19 | vtpy23 | Revert "Merge pull request #18 from Hidebray/vu" | backend/frontend/node_modules/.package-lock.json, backend/frontend/node_modules/@reduxjs/toolkit/LICENSE, backend/frontend/node_modules/@reduxjs/toolkit/README.md, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/index.js, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.development.cjs, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.development.cjs.map, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.production.min.cjs, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.production.min.cjs.map, backend/frontend/node_modules/@reduxjs/toolkit/dist/index.d.mts, ... |
| 2026-01-19 | vtpy23 | Merge pull request #18 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | Advanced Analytics Dashboard | backend/frontend/node_modules/.package-lock.json, backend/frontend/node_modules/@reduxjs/toolkit/LICENSE, backend/frontend/node_modules/@reduxjs/toolkit/README.md, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/index.js, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.development.cjs, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.development.cjs.map, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.production.min.cjs, backend/frontend/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.production.min.cjs.map, backend/frontend/node_modules/@reduxjs/toolkit/dist/index.d.mts, ... |
| 2026-01-19 | vtpy23 | Merge pull request #17 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat: add analytics module with AnalyticsSnapshot model for revenue, customer, product, table, and reservation metrics | backend/prisma/schema.prisma, backend/src/app.module.ts, frontend/src/app/admin/layout.tsx |
| 2026-01-19 | vtpy23 | Merge pull request #16 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | Add inventory, loyalty, reservation modules and related UI | backend/prisma/migrations/20260119081800_add_table_waiter_assignment/migration.sql, backend/prisma/migrations/20260119084156_add_loyalty_points_system/migration.sql, backend/prisma/migrations/20260119090000_add_inventory_management/migration.sql, backend/prisma/migrations/20260119100000_add_table_reservation_system/migration.sql, backend/src/inventory/dto/create-inventory.dto.ts, backend/src/inventory/dto/inventory-transaction.dto.ts, backend/src/inventory/dto/update-inventory.dto.ts, backend/src/inventory/entities/inventory-transaction.entity.ts, backend/src/inventory/entities/inventory.entity.ts, ... |
| 2026-01-19 | vtpy23 | Merge pull request #15 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | Remove obsolete documentation files |  |
|  |  |  | IMPLEMENTATION_PLAN_20K_LINES.md |
| 2026-01-19 | vtpy23 | Merge pull request #14 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat: integrate user authentication system with login, registration, and password recovery features |  |
|  |  |  | backend/src/loyalty/dto/create-points-transaction.dto.ts |
| 2026-01-19 | vtpy23 | Merge pull request #13 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat: implement table reservation system with new Reservation model and status enum | IMPLEMENTATION_PLAN_20K_LINES.md, backend/prisma/schema.prisma, backend/src/app.module.ts, frontend/src/app/admin/layout.tsx |
| 2026-01-19 | vtpy23 | Merge pull request #12 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat: implement inventory management system with models for inventory and inventory transactions | backend/prisma/schema.prisma, backend/src/app.module.ts, backend/src/orders/orders.module.ts, backend/src/orders/orders.service.ts, frontend/src/app/admin/layout.tsx |
| 2026-01-19 | vtpy23 | Merge pull request #11 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat: implement user feedback system with ratings and comments for products | backend/src/app.module.ts, backend/src/orders/orders.module.ts, backend/src/orders/orders.service.ts, frontend/src/app/admin/layout.tsx, frontend/src/app/admin/staff/EditStaffModal.tsx, frontend/src/app/guest/profile/page.tsx |
| 2026-01-19 | vtpy23 | Merge pull request #10 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat: introduce loyalty points system with models for loyalty tiers, points transactions, and voucher management | backend/prisma/schema.prisma, backend/src/user/dto/update-user.dto.ts |
| 2026-01-19 | vtpy23 | Merge pull request #9 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | style: update UI components for improved accessibility and visual consistency across waiter, product, and admin pages | frontend/src/app/admin/orders/page.tsx, frontend/src/app/admin/products/ProductList.tsx, frontend/src/app/admin/staff/page.tsx, frontend/src/app/menu/items/[id]/page.tsx, frontend/src/app/tables/page.tsx, frontend/src/app/waiter/page.tsx, frontend/src/components/ProductModal.tsx |
| 2026-01-19 | vtpy23 | Merge pull request #8 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat: enhance user and table management with waiter assignment and order notes functionality | backend/prisma/schema.prisma, backend/src/orders/dto/create-order.dto.ts, backend/src/orders/orders.service.ts, backend/src/tables/dto/create-table.dto.ts, backend/src/tables/tables.controller.ts, backend/src/tables/tables.service.ts, backend/src/user/user.controller.ts, backend/src/user/user.service.ts, frontend/src/app/admin/staff/StaffForm.tsx, ... |
| 2026-01-19 | vtpy23 | Merge pull request #7 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | Update bill modal and sync prisma migration | FEATURE_COMPARISON_REPORT.md, backend/prisma/migrations/20260119074656_sync_schema_after_reset/migration.sql, frontend/src/components/waiter/BillModal.tsx |
| 2026-01-19 | vtpy23 | Merge pull request #6 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | Update tasks.md to mark Task 7.17: Discount System as complete, including all associated subtasks. | backend/prisma/migrations/20260119_add_allergens_to_product/migration.sql, frontend/src/app/menu/items/[id]/page.tsx, tasks.md |
| 2026-01-19 | vtpy23 | feat(products): add allergens field to product schema and update related components | backend/prisma/schema.prisma, backend/src/products/dto/create-product.dto.ts, backend/src/products/products.service.ts, frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/app/menu/page.tsx, frontend/src/lib/api/products.ts, frontend/src/types/index.ts |
| 2026-01-19 | vtpy23 | Merge pull request #5 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat: enhance order processing with improved discount application and billing display | backend/src/orders/dto/update-discount.dto.ts |
| 2026-01-19 | vtpy23 | feat: add discount functionality to orders with update and display in bill modal | backend/prisma/migrations/20260119_add_discount_fields/migration.sql, backend/prisma/schema.prisma, backend/src/orders/orders.controller.ts, backend/src/orders/orders.service.ts, frontend/src/app/waiter/page.tsx, frontend/src/components/waiter/BillModal.tsx, frontend/src/types/index.ts |
| 2026-01-19 | Hidebray | feat: implement product popularity tracking and menu sorting | README.md, backend/prisma/schema.prisma, backend/src/orders/orders.service.ts, frontend/src/app/guest/page.tsx, frontend/src/types/index.ts, tasks.md |
| 2026-01-19 | Hidebray | feat: implement related items suggestion in product modal | README.md, frontend/src/components/ProductModal.tsx, tasks.md |
| 2026-01-19 | Hidebray | feat: implement chef recommendations with admin toggle and badging | README.md, frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/app/guest/page.tsx, frontend/src/lib/api/products.ts, frontend/src/types/index.ts, tasks.md |
| 2026-01-19 | Hidebray | feat: implement qr code regeneration and secure token authentication | README.md, backend/src/tables/tables.controller.ts, backend/src/tables/tables.service.ts, frontend/src/app/admin/tables/QrCodeModal.tsx, frontend/src/app/admin/tables/TableList.tsx, frontend/src/app/guest/page.tsx, frontend/src/lib/api/tables.ts, tasks.md |
| 2026-01-19 | Hidebray | feat: implement order timer for kds and waiter dashboard with visual alerts | README.md, frontend/src/app/kitchen/page.tsx, frontend/src/app/waiter/page.tsx, frontend/src/components/OrderTimer.tsx, frontend/src/i18n.ts, tasks.md |
| 2026-01-19 | vtpy23 | Merge pull request #4 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | upadte tasks | tasks.md |
| 2026-01-19 | vtpy23 | feat(products): update product schema and admin product form | backend/prisma/schema.prisma, backend/src/products/products.controller.ts, backend/src/products/products.service.ts, frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/lib/api/products.ts |
| 2026-01-19 | vtpy23 | Merge pull request #3 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | feat(products): add admin products management | backend/src/products/dto/admin-products-query.dto.ts, backend/src/products/products.controller.ts, backend/src/products/products.service.ts, frontend/src/app/admin/products/page.tsx, frontend/src/lib/api/products.ts, tasks.md |
| 2026-01-19 | vtpy23 | Merge pull request #2 from Hidebray/vu |  |
| 2026-01-19 | vtpy23 | Add admin reports feature with revenue charts | backend/src/reports/dto/revenue-query.dto.ts, backend/src/reports/reports.controller.ts, backend/src/reports/reports.service.ts, frontend/package-lock.json, frontend/src/app/admin/reports/page.tsx, frontend/src/app/admin/reports/revenue/page.tsx, frontend/src/components/charts/RevenueLineChart.tsx, frontend/src/components/charts/TopProductsPieChart.tsx, frontend/src/lib/api/reports.ts, ... |
| 2026-01-19 | vtpy23 | task 7.9 | backend/package-lock.json, backend/package.json, backend/src/auth/auth.controller.ts, backend/src/auth/auth.service.ts, backend/src/auth/dto/change-password.dto.ts, backend/src/auth/dto/update-profile.dto.ts, backend/src/main.ts, frontend/package-lock.json, frontend/src/app/guest/profile/page.tsx, ... |
| 2026-01-18 | Dan Pham | fix UI and translation | frontend/src/app/guest/page.tsx, frontend/src/app/menu/page.tsx, frontend/src/components/ProductModal.tsx, frontend/src/components/mobile/Header.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-18 | Dan Pham | add more products | backend/prisma/seed.ts |
| 2026-01-18 | Dan Pham | small fix UI | frontend/src/app/admin/layout.tsx |
| 2026-01-18 | Dan Pham | fix the QR Code generation | backend/src/tables/tables.service.ts |
| 2026-01-18 | Dan Pham | feat: Implement login page with email/password and Google authentication, session management, and role-based redirection. | frontend/src/app/login/page.tsx |
| 2026-01-18 | Dan Pham | feat: Implement user login with email/password and Google authentication, role-based redirection, and initial admin pages. | frontend/src/app/admin/dashboard/page.tsx, frontend/src/app/admin/layout.tsx, frontend/src/app/admin/page.tsx, frontend/src/app/login/page.tsx |
| 2026-01-18 | Dan Pham | feat: Implement guest menu page with product display, search, category filtering, pagination, and table validation. | frontend/src/app/guest/page.tsx |
| 2026-01-18 | Dan Pham | feat: Implement initial user authentication flows including login, register, and forgot password pages with internationalization support. | frontend/src/app/forgot-password/page.tsx, frontend/src/app/layout.tsx, frontend/src/app/login/page.tsx, frontend/src/app/register/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-18 | Dan Pham | feat: Add initial public-facing pages including landing, menu, and tables, with internationalization support. | frontend/src/app/menu/page.tsx, frontend/src/app/page.tsx, frontend/src/app/tables/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-18 | Dan Pham | feat: Implement guest order management with viewing, payment, waiter assistance, product reviews, and add internationalization support. | frontend/src/app/guest/cart/page.tsx, frontend/src/app/guest/orders/page.tsx, frontend/src/app/guest/page.tsx, frontend/src/app/guest/profile/page.tsx, frontend/src/contexts/I18nContext.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-18 | Dan Pham | feat: implement guest menu page with product display, search, category filtering, and pagination using a new Zustand menu store. | frontend/src/app/guest/page.tsx, frontend/src/store/useMenuStore.ts |
| 2026-01-18 | Dan Pham | feat: implement guest menu page with product display, search, category filtering, pagination, and product details modal. | frontend/src/app/guest/page.tsx |
| 2026-01-18 | Dan Pham | feat: Implement guest cart and ordering system with new pages for cart, orders, and profile, and UI components for cart management, language switching, and mobile header. | frontend/src/app/guest/cart/page.tsx, frontend/src/app/guest/orders/page.tsx, frontend/src/app/guest/page.tsx, frontend/src/app/guest/profile/page.tsx, frontend/src/components/CartDrawer.tsx, frontend/src/components/LanguageSwitcher.tsx, frontend/src/components/mobile/Header.tsx |
| 2026-01-18 | Dan Pham | feat: introduce initial frontend structure including guest menu with product listing, search, categories, and pagination. | frontend/src/app/guest/page.tsx, frontend/src/app/menu/page.tsx, frontend/src/app/page.tsx, frontend/src/app/tables/page.tsx, frontend/src/components/mobile/BottomNav.tsx, frontend/src/middleware.ts |
| 2026-01-18 | Dan Pham | feat: Implement full authentication flow with login, forgot/reset password, and Google OAuth, alongside new UI components and backend services. | backend/package-lock.json, backend/prisma/migrations/20260118064759_add_reset_password_fields/migration.sql, backend/prisma/schema.prisma, backend/src/auth/auth.controller.ts, backend/src/auth/auth.service.ts, frontend/package-lock.json, frontend/src/app/forgot-password/page.tsx, frontend/src/app/login/page.tsx, frontend/src/app/reset-password/page.tsx, ... |
| 2026-01-17 | Hidebray | docs: mark Task 7.6 complete, update README | README.md, tasks.md |
| 2026-01-17 | Hidebray | feat: add pagination to guest menu (12 items per page) | frontend/src/app/guest/page.tsx |
| 2026-01-17 | Hidebray | docs: mark Tasks 7.4 & 7.5 complete, update README | README.md, tasks.md |
| 2026-01-17 | Hidebray | feat: add print bill functionality with react-to-print | frontend/package-lock.json, frontend/package.json, frontend/src/components/waiter/BillModal.tsx |
| 2026-01-17 | Hidebray | feat: add QR code download as PNG feature | frontend/src/app/admin/tables/QrCodeModal.tsx, tasks.md |
| 2026-01-17 | Hidebray | docs: add Module 7 missing features to tasks.md | tasks.md |
| 2026-01-17 | Hidebray | docs: update README with Module 6 features | README.md |
| 2026-01-17 | Hidebray | feat: add translations to all dashboards (waiter, kitchen, admin) | frontend/src/app/admin/layout.tsx, frontend/src/app/kitchen/page.tsx, frontend/src/app/waiter/page.tsx, frontend/src/messages/en.json, frontend/src/messages/vi.json |
| 2026-01-17 | Hidebray | fix: implement translations on login page | frontend/src/app/login/page.tsx |
| 2026-01-17 | Hidebray | fix: add language switcher to all pages | frontend/src/app/admin/layout.tsx, frontend/src/app/kitchen/page.tsx, frontend/src/app/login/page.tsx, frontend/src/app/register/page.tsx, frontend/src/app/waiter/page.tsx |
| 2026-01-17 | Hidebray | feat: add multi-language support (EN/VI) | frontend/package-lock.json, frontend/package.json, frontend/src/app/guest/page.tsx, frontend/src/app/layout.tsx, frontend/src/components/LanguageSwitcher.tsx, frontend/src/components/mobile/Header.tsx, frontend/src/contexts/I18nContext.tsx, frontend/src/i18n.ts, frontend/src/messages/en.json, ... |
| 2026-01-17 | Hidebray | feat: implement fuzzy search for products | backend/src/products/products.controller.ts, backend/src/products/products.service.ts, frontend/src/app/guest/page.tsx, tasks.md |
| 2026-01-17 | Hidebray | feat: enable customer item reviews | backend/prisma/schema.prisma, backend/src/app.module.ts, backend/src/products/products.service.ts, backend/src/reviews/dto/create-review.dto.ts, backend/src/reviews/dto/update-review.dto.ts, backend/src/reviews/entities/review.entity.ts, backend/src/reviews/reviews.controller.ts, backend/src/reviews/reviews.module.ts, backend/src/reviews/reviews.service.ts, ... |
| 2026-01-17 | Hidebray | feat: implement customer self-registration | docker-compose.prod.yml, frontend/src/app/register/page.tsx, tasks.md |
| 2026-01-17 | Hidebray | docs: comprehensive update of README with all features and changelog | README.md |
| 2026-01-17 | Hidebray | ops: setup production dockerfiles and compose | backend/Dockerfile, docker-compose.prod.yml, frontend/Dockerfile, frontend/next.config.ts, tasks.md |
| 2026-01-17 | Hidebray | docs: update README with payment and notification features | README.md |
| 2026-01-17 | Hidebray | feat: implement table call assistance (payment request) notification | backend/src/events/orders.gateway.ts, backend/src/orders/orders.module.ts, backend/src/tables/tables.controller.ts, backend/src/tables/tables.module.ts, backend/src/tables/tables.service.ts, frontend/src/app/guest/orders/page.tsx, frontend/src/app/waiter/page.tsx |
| 2026-01-17 | Hidebray | feat: integrate stripe for online payments (Task 4.4) | backend/package-lock.json, backend/package.json, backend/src/app.module.ts, backend/src/payments/payments.controller.spec.ts, backend/src/payments/payments.controller.ts, backend/src/payments/payments.module.ts, backend/src/payments/payments.service.spec.ts, backend/src/payments/payments.service.ts, frontend/package-lock.json, ... |
| 2026-01-17 | Hidebray | feat: implement bill modal and payment demo (Task 4.1) | backend/package-lock.json, backend/prisma/seed.ts, backend/src/orders/orders.controller.spec.ts, backend/src/orders/orders.service.spec.ts, backend/src/orders/orders.service.ts, backend/src/products/products.controller.spec.ts, backend/src/products/products.service.spec.ts, frontend/package-lock.json, frontend/package.json, ... |
| 2026-01-16 | Dan Pham | docs: Restore DATABASE_URL to actual configuration | backend/.env.example |
| 2026-01-16 | Dan Pham | docs: Reset environment templates to default placeholders | README.md, backend/.env.example |
| 2026-01-16 | Dan Pham | docs: Update environment configuration templates with actual non-sensitive values | README.md, backend/.env.example |
| 2026-01-16 | Dan Pham | feat: Introduce customer registration, email verification, and Google authentication, updating README with new features, API endpoints, and configuration, and creating a backend .env.example. | README.md, backend/.env.example |
| 2026-01-16 | Dan Pham | feat: Implement user authentication with local and Google OAuth, email verification, and a login UI. | backend/package-lock.json, backend/package.json, backend/prisma/schema.prisma, backend/src/auth/auth.controller.ts, backend/src/auth/auth.module.ts, backend/src/auth/auth.service.ts, backend/src/auth/strategies/google.strategy.ts, frontend/next.config.ts, frontend/src/app/login/page.tsx |
| 2026-01-16 | Dan Pham | feat: Implement user authentication including registration, login, email verification, and a guest profile page with mobile navigation. | backend/src/auth/auth.service.ts, backend/src/auth/strategies/jwt.strategy.ts, frontend/src/app/guest/profile/page.tsx, frontend/src/components/mobile/BottomNav.tsx |
| 2026-01-16 | Dan Pham | feat: Implement initial user authentication with email verification and backend infrastructure setup. | backend/.env.example, backend/package-lock.json, backend/package.json, backend/prisma/schema.prisma, backend/src/app.module.ts, backend/src/auth/auth.controller.ts, backend/src/auth/auth.module.ts, backend/src/auth/auth.service.ts, backend/src/main.ts, ... |
| 2026-01-16 | Dan Pham | feat: Add real-time waiter and kitchen dashboards for order management. | frontend/src/app/kitchen/page.tsx, frontend/src/app/waiter/page.tsx |
| 2026-01-16 | Dan Pham | feat: Implement a comprehensive restaurant order management system with dedicated guest, waiter, and kitchen UIs and real-time order status updates. | README.md, backend/.env.example, backend/README.md, backend/src/main.ts, backend/src/tables/tables.service.ts, frontend/.env.example, frontend/src/app/guest/page.tsx, frontend/src/app/kitchen/page.tsx, frontend/src/app/tables/page.tsx, ... |
| 2026-01-16 | Dan Pham | feat: Implement admin order management and sales reporting with new API endpoints and UI. | backend/src/reports/reports.controller.ts, backend/src/reports/reports.service.ts, frontend/package-lock.json, frontend/package.json, frontend/src/app/admin/layout.tsx, frontend/src/app/admin/orders/page.tsx, frontend/src/app/admin/reports/page.tsx, frontend/src/lib/api/orders.ts, frontend/src/lib/api/reports.ts |
| 2026-01-16 | Dan Pham | feat: add mobile bottom navigation component with menu, cart, orders, and profile links. | frontend/src/components/mobile/BottomNav.tsx |
| 2026-01-16 | Dan Pham | feat: Implement guest application with table identification, cart management, and order placement, including a new table store and mobile navigation. | frontend/src/app/guest/cart/page.tsx, frontend/src/app/guest/layout.tsx, frontend/src/app/guest/orders/page.tsx, frontend/src/app/guest/page.tsx, frontend/src/components/TableSync.tsx, frontend/src/components/mobile/BottomNav.tsx, frontend/src/store/useTableStore.ts |
| 2026-01-16 | Dan Pham | feat: add mobile Header component with title, optional back button, and dynamic table number display. | frontend/src/components/mobile/Header.tsx |
| 2026-01-16 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-16 | Dan Pham | feat: Add initial project structure including mockups for customer, admin, and waiter UIs, and core frontend/backend components. | backend/src/orders/orders.controller.ts, frontend/src/app/guest/cart/page.tsx, frontend/src/app/guest/layout.tsx, frontend/src/app/guest/orders/page.tsx, frontend/src/app/guest/page.tsx, frontend/src/components/mobile/BottomNav.tsx, frontend/src/components/mobile/CategoryTabs.tsx, frontend/src/components/mobile/Header.tsx, frontend/src/lib/api/orders.ts, ... |
| 2026-01-16 | Dan Pham | small fix | frontend/src/app/layout.tsx |
| 2026-01-16 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-16 | Dan Pham | feat: Implement user authentication (registration, login) and backend order management. | backend/src/auth/auth.module.ts, backend/src/auth/auth.service.ts, backend/src/orders/dto/create-order.dto.ts, backend/src/orders/orders.controller.ts, backend/src/orders/orders.module.ts, backend/src/orders/orders.service.ts, frontend/src/app/api/auth/login/route.ts, frontend/src/app/api/auth/register/route.ts, frontend/src/app/guest/page.tsx, ... |
| 2026-01-16 | Hidebray | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-16 | Hidebray | feat: implement analytics and reporting dashboard | README.md, backend/src/app.module.ts, backend/src/reports/reports.controller.ts, backend/src/reports/reports.module.ts, backend/src/reports/reports.service.ts, frontend/package-lock.json, frontend/package.json, frontend/src/app/admin/layout.tsx, frontend/src/app/admin/reports/page.tsx, ... |
| 2026-01-16 | Hidebray | feat(modifiers): complete and stabilize product modifier workflow | README.md, frontend/src/app/admin/modifiers/ModifierGroupForm.tsx, frontend/src/components/CartDrawer.tsx, frontend/src/lib/api/orders.ts |
| 2026-01-16 | Hidebray | feat: implement product modifier management | backend/package-lock.json, backend/src/app.module.ts, backend/src/modifiers/dto/create-modifier-group.dto.ts, backend/src/modifiers/dto/create-modifier-option.dto.ts, backend/src/modifiers/dto/update-modifier-group.dto.ts, backend/src/modifiers/dto/update-modifier-option.dto.ts, backend/src/modifiers/entities/modifier-group.entity.ts, backend/src/modifiers/entities/modifier-option.entity.ts, backend/src/modifiers/modifiers.controller.ts, ... |
| 2026-01-15 | Dan Pham | docs: Revamp README with comprehensive project overview, features, tech stack, architecture, and setup instructions, and add frontend .env.example. | README.md, frontend/.env.example |
| 2026-01-15 | Dan Pham | make the text darker | frontend/src/app/kitchen/page.tsx, frontend/src/components/ProductModal.tsx |
| 2026-01-15 | Dan Pham | feat: Implement comprehensive table management with CRUD operations, QR code generation, and integrate table status updates into order processing. | backend/src/orders/orders.service.ts, backend/src/tables/tables.service.ts, frontend/src/app/admin/tables/TableList.tsx, frontend/src/lib/api/tables.ts |
| 2026-01-15 | Dan Pham | feat: Implement admin staff management page with user CRUD operations and role-based access. | backend/src/user/user.controller.ts, backend/src/user/user.service.ts, frontend/src/app/admin/staff/page.tsx, frontend/src/lib/api/users.ts |
| 2026-01-15 | Dan Pham | feat(admin): Add StaffForm component for creating new staff members with name, email, password, role, and phone fields. | frontend/src/app/admin/staff/StaffForm.tsx |
| 2026-01-15 | Dan Pham | feat: Implement full-stack authentication, user management, and role-based interfaces for admin, waiter, and kitchen. | backend/.env.example, backend/src/auth/auth.module.ts, backend/src/auth/strategies/jwt.strategy.ts, backend/src/tables/tables.service.ts, backend/src/user/dto/create-user.dto.ts, backend/src/user/user.controller.ts, backend/src/user/user.module.ts, backend/src/user/user.service.ts, frontend/debug-auth.js, ... |
| 2026-01-15 | Dan Pham | feat: implement initial frontend pages and components for kitchen order management, product display, and cart functionality. | frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/app/admin/products/ProductList.tsx, frontend/src/app/admin/products/page.tsx, frontend/src/app/admin/tables/TableList.tsx, frontend/src/app/guest/page.tsx, frontend/src/app/kitchen/page.tsx, frontend/src/app/login/page.tsx, frontend/src/app/tables/page.tsx, frontend/src/app/waiter/page.tsx, ... |
| 2026-01-15 | Dan Pham | feat: Add initial admin dashboard layout, kitchen order management page with real-time updates, and a logout API. | frontend/src/app/admin/layout.tsx, frontend/src/app/api/auth/logout/route.ts, frontend/src/app/kitchen/page.tsx, frontend/src/app/waiter/page.tsx |
| 2026-01-15 | Dan Pham | feat: Implement initial backend API for products and tables, and set up frontend with authentication middleware. | backend/src/products/products.controller.ts, backend/src/tables/tables.controller.ts, frontend/package-lock.json, frontend/package.json, frontend/src/middleware.ts |
| 2026-01-15 | Dan Pham | docs: Add database seeding command and default login credentials to README. | README.md |
| 2026-01-15 | Dan Pham | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant |  |
| 2026-01-15 | Dan Pham | Rename components | README.md, backend/.env.example, backend/package-lock.json, backend/package.json, backend/src/app.module.ts, frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/app/admin/products/ProductList.tsx, frontend/src/app/admin/products/page.tsx, frontend/src/app/admin/tables/QrCodeModal.tsx, ... |
| 2026-01-15 | Dan Pham | Rename components | frontend/src/app/admin/products/ProductFormModal.tsx, frontend/src/app/admin/products/ProductList.tsx, frontend/src/app/admin/tables/QrCodeModal.tsx, frontend/src/app/admin/tables/TableForm.tsx, frontend/src/app/admin/tables/TableList.tsx, frontend/src/components/ProductModal.tsx, frontend/src/components/ui/Dialog.tsx |
| 2026-01-15 | Dan Pham | docs: Add initial project description and self-assessment report. | PROJECT_DESCRIPTION.md, SELF_ASSESSMENT_REPORT.md |
| 2026-01-15 | vtpy23 | Merge pull request #1 from Hidebray/vu |  |
| 2026-01-15 | vtpy23 | setup admin layout and product list view, enable admin product creation and editing | backend/package-lock.json, backend/prisma/migrations/20260114165405_init/migration.sql, backend/prisma/migrations/migration_lock.toml, backend/src/products/dto/create-product.dto.ts, backend/src/products/products.controller.ts, backend/src/products/products.service.ts, frontend/package-lock.json, frontend/src/app/admin/layout.tsx, frontend/src/app/admin/products/page.tsx, ... |
| 2026-01-14 | Hidebray | feat: add middleware to protect private routes | README.md, frontend/src/app/admin/tables/page.tsx, frontend/src/app/admin/tables/qr-code-modal.tsx, frontend/src/app/admin/tables/table-form.tsx, frontend/src/app/admin/tables/table-list.tsx, frontend/src/app/api/auth/login/route.ts, frontend/src/app/guest/page.tsx, frontend/src/app/login/page.tsx, frontend/src/components/ui/Button.tsx, ... |
| 2026-01-14 | Hidebray | chore: update seed script to use hashed password | backend/prisma/seed.ts |
| 2026-01-14 | Hidebray | chore: update seed script to use hashed passwords | backend/prisma/seed.ts |
| 2026-01-14 | Hidebray | feat: implement login page UI and authentication flow | frontend/src/app/login/page.tsx, tasks.md |
| 2026-01-14 | Hidebray | feat: implement jwt authentication logic and login API | README.md, frontend/package-lock.json, frontend/package.json, frontend/src/app/api/auth/login/routes.ts, frontend/src/lib/auth.ts, tasks.md |
| 2026-01-14 | Hidebray | feat(frontend): send and display order modifiers; add tables QR page | frontend/src/app/kitchen/page.tsx, frontend/src/app/page.tsx, frontend/src/app/tables/page.tsx, frontend/src/app/waiter/page.tsx, frontend/src/components/CartDrawer.tsx |
| 2026-01-14 | Hidebray | feat(orders): support item modifiers and add Socket.IO order events | backend/package-lock.json, backend/package.json, backend/src/events/orders.gateway.ts, backend/src/orders/dto/create-order.dto.ts, backend/src/orders/orders.module.ts, backend/src/orders/orders.service.ts |
| 2026-01-13 | Hidebray | feat: implement table management and QR code generation | README.md, backend/package-lock.json, backend/package.json, backend/src/app.module.ts, backend/src/tables/dto/create-table.dto.ts, backend/src/tables/dto/update-table.dto.ts, backend/src/tables/tables.controller.ts, backend/src/tables/tables.module.ts, backend/src/tables/tables.service.ts, ... |
| 2026-01-13 | Hidebray | feat(auth): implement user authentication and authorization | backend/.gitignore, backend/.prettierrc, backend/README.md, backend/eslint.config.mjs, backend/nest-cli.json, backend/package-lock.json, backend/package.json, backend/prisma/schema.prisma, backend/prisma/seed.ts, ... |
| 2026-01-12 | Dan Pham | Update Readme | README.md |
| 2026-01-12 | Dan Pham | Delete unnecessary .gitignore files. | .gitignore |
| 2026-01-12 | Dan Pham | Standardize the standard folder structure. | backend/package.json, backend/src/server.ts, backend/tsconfig.json, frontend/src/app/api/orders/route.ts, frontend/src/app/api/products/route.ts, frontend/src/app/api/tables/route.ts, frontend/src/app/globals.css, frontend/src/app/guest/menu/page.tsx, frontend/src/app/kitchen/page.tsx, ... |
| 2026-01-12 | Dan Pham | Split the project into two repositories: frontend and backend. | backend/.gitignore, backend/docker-compose.yml, backend/package-lock.json, backend/package.json, backend/server.ts, backend/tsconfig.json, frontend/.gitignore, frontend/app/api/orders/route.ts, frontend/app/api/products/route.ts, ... |
| 2026-01-07 | Hidebray | docs: add project tasks tracking and comprehensive setup guide | app/favicon.ico, app/layout.tsx, app/page.tsx, tasks.md |
| 2026-01-07 | Hidebray | docs: add project tasks tracking and comprehensive setup guide | README.md |
| 2026-01-06 | Hidebray | feat: implement waiter dashboard and refine kitchen workflow (pending/accepted logic) | app/kitchen/page.tsx, app/waiter/page.tsx |
| 2026-01-06 | Hidebray | feat: implement kitchen kds dashboard with realtime order updates | app/api/orders/route.ts, app/kitchen/page.tsx |
| 2026-01-06 | Hidebray | feat: setup socket.io server and client connection | app/guest/menu/page.tsx, components/guest/CartDrawer.tsx, lib/socket.ts |
| 2026-01-06 | Hidebray | feat: setup standalone socket.io server for realtime features | package-lock.json, package.json, server.ts |
| 2026-01-06 | Hidebray | feat: complete guest ordering flow (menu display, cart drawer, order api) | app/api/orders/route.ts, app/guest/menu/page.tsx, components/guest/CartDrawer.tsx |
| 2026-01-06 | Hidebray | feat: connect guest menu to real api | app/api/products/route.ts, app/api/tables/route.ts, app/guest/menu/page.tsx, components/guest/ProductCard.tsx, lib/prisma.ts, package-lock.json, package.json, store/useCartStore.ts, store/useProductStore.ts, ... |
| 2026-01-06 | Hidebray | feat: setup prisma schema and seed data | .gitignore, docker-compose.yml, package-lock.json, package.json, prisma/schema.prisma, prisma/seed.ts |
| 2026-01-05 | Hidebray | chore: init nextjs project and setup docker postgres | .gitignore, App.tsx, README.md, app/api/auth/login/route.ts, app/api/orders/route.ts, app/api/products/route.ts, app/api/tables/route.ts, app/favicon.ico, app/globals.css, ... |
| 2026-01-05 | Hidebray | Generation by Google AI Studio & Gemini | .gitignore, App.tsx, README.md, app/api/auth/login/route.ts, app/api/orders/route.ts, app/api/products/route.ts, app/api/tables/route.ts, components/ui/Badge.tsx, components/ui/Button.tsx, ... |

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
