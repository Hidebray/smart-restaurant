# 📊 BÁO CÁO DỰ ÁN CUỐI KỲ - SMART RESTAURANT MANAGEMENT SYSTEM

**Tên dự án:** Smart Restaurant - Hệ thống Quản lý Nhà hàng Thông minh  
**Môn học:** Web Development  
**Nhóm:** Phạm Hữu Đan (20120450), Trần Đại Hiệp (23120256), Lâm Hoàng Vũ (23122056)

---

## 1. MÔ TẢ HỆ THỐNG

### 1.1. Tổng quan

**Smart Restaurant** là hệ thống quản lý nhà hàng toàn diện, sử dụng công nghệ QR Code để khách hàng đặt món trực tiếp từ điện thoại. Hệ thống hỗ trợ quản lý đầy đủ các khía cạnh của nhà hàng từ menu, đơn hàng, thanh toán đến quản lý nhân viên và báo cáo doanh thu.

### 1.2. Mục tiêu

- Giảm thời gian chờ đợi của khách hàng
- Tối ưu hóa quy trình làm việc của nhà hàng
- Tăng trải nghiệm người dùng
- Quản lý hiệu quả kho hàng và đặt bàn
- Tích hợp hệ thống loyalty points để tăng lượng khách hàng quay lại

### 1.3. Tính năng chính

**Cho Khách hàng:**
- Quét QR Code để xem menu và đặt món
- Theo dõi đơn hàng real-time
- Thanh toán online qua Stripe
- Đánh giá sản phẩm
- Tích điểm loyalty và đổi voucher

**Cho Admin:**
- Quản lý menu, bàn, nhân viên
- Xem báo cáo doanh thu và analytics
- Quản lý kho hàng với cảnh báo hết hàng
- Quản lý đặt bàn và loyalty points

**Cho Waiter:**
- Xem và duyệt đơn hàng
- Quản lý bàn được phân công
- Tạo hóa đơn và áp dụng giảm giá
- In hóa đơn

**Cho Kitchen:**
- Xem đơn hàng cần chế biến
- Cập nhật trạng thái đơn hàng
- Timer theo dõi thời gian chế biến

---

## 2. THÔNG TIN NHÓM

### 2.1. Danh sách thành viên

| MSSV     | Họ và Tên     | Vai trò                                    |
| -------- | ------------- | ------------------------------------------ |
| 20120450 | Phạm Hữu Đan  | Frontend Developer, UI/UX Designer         |
| 23120256 | Trần Đại Hiệp | Backend Developer, Real-time Features      |
| 23122056 | Lâm Hoàng Vũ  | Full-stack Developer, DevOps, Git Manager  |

### 2.2. Phân công nhiệm vụ

**Phạm Hữu Đan (99 commits - 50.5%):**
- Thiết kế và phát triển toàn bộ giao diện frontend (Next.js)
- Implement UI/UX cho Customer, Admin, Waiter, Kitchen pages
- Multi-language support (EN/VI) với i18n
- Authentication flows (login, register, forgot password)
- Admin dashboard: Staff, Categories, Products, Orders, Tables, Reports
- Cloudinary integration cho upload ảnh
- Stripe payment integration (frontend)
- Role-based access control trong middleware

**Trần Đại Hiệp (49 commits - 25.0%):**
- Khởi tạo project và setup Docker PostgreSQL
- Thiết kế database schema với Prisma
- Xây dựng backend API (NestJS)
- JWT authentication và authorization
- Socket.IO server cho real-time features
- Kitchen KDS và Waiter dashboard
- Stripe integration (backend)
- QR code download, print bill, fuzzy search
- Order timer, chef recommendations, product popularity

**Lâm Hoàng Vũ (48 commits - 24.5%):**
- Admin products management và reports
- Discount functionality và billing
- Loyalty points system với tiers và vouchers
- Inventory management system
- Table reservation system
- Analytics module và dashboard
- Quản lý Git repository và merge pull requests
- Code review và integration

---

## 3. KẾ HOẠCH VÀ TIẾN ĐỘ DỰ ÁN

### 3.1. Project Plan Tracker

| Module | Tên Module                    | Tiến độ  | Thời gian | Ghi chú                            |
| ------ | ----------------------------- | -------- | --------- | ---------------------------------- |
| 1      | Authentication & Authorization | ✅ 100% | 2026-01   | Hoàn thành                         |
| 2      | Admin Dashboard               | ✅ 100%  | 2026-01   | Hoàn thành                         |
| 3      | Table & QR Code Management    | ✅ 100%  | 2026-01   | Hoàn thành                         |
| 4      | Payment & Checkout            | ✅ 100%  | 2026-01   | Hoàn thành                         |
| 5      | Deployment                    | ✅ 100%  | 2026-01   | Hoàn thành                         |
| 6      | Advanced Features             | ✅ 100%  | 2026-01   | Hoàn thành                         |
| 7      | Essential Missing Features    | ✅ 95%   | 2026-01   | Thiếu demo video và public hosting |
| 8      | Advanced Business Features    | ✅ 100%  | 2026-01   | Loyalty, Inventory, Reservations   |

### 3.2. Timeline

```
2026-01-05 → 2026-01-07: Setup project, database design, Prisma schema, Socket.IO
2026-01-12 → 2026-01-14: Authentication, JWT, table management, QR code
2026-01-15 → 2026-01-16: Admin dashboard, staff management, modifiers, analytics
2026-01-17:              Payment (Stripe), multi-language (EN/VI), print bill, QR download
2026-01-18:              Guest UI, cart, ordering, login/register flows
2026-01-19:              Loyalty, Inventory, Reservations, Cloudinary, reviews
2026-01-20:              Final fixes, role-based access, UI polish, documentation
```

### 3.3. Completed Tasks

✅ 196 commits từ 3 thành viên  
✅ 8 modules implemented  
✅ 3 advanced features (Loyalty, Inventory, Reservations)  
✅ Full documentation  
✅ Multi-language support (EN/VI)  
✅ Real-time updates với Socket.IO

---

## 4. PHÂN TÍCH CHỨC NĂNG

### 4.1. Authentication & Authorization

**Tính năng:**
- Đăng ký khách hàng với email verification
- Đăng nhập với JWT authentication
- Quên mật khẩu và reset password
- Google OAuth integration
- Role-based access control (Admin, Waiter, Kitchen, Customer)

**Công nghệ:**
- Passport.js với JWT strategy
- bcrypt cho password hashing
- Email verification với token

### 4.2. Customer Ordering

**Tính năng:**
- Quét QR Code để truy cập menu
- Xem menu theo danh mục
- Tìm kiếm sản phẩm (fuzzy search)
- Sắp xếp theo giá, độ phổ biến
- Thêm vào giỏ hàng với modifiers
- Theo dõi đơn hàng real-time
- Thanh toán online (Stripe)
- Đánh giá sản phẩm

**Công nghệ:**
- Next.js App Router
- Socket.IO cho real-time updates
- Stripe SDK cho payment
- Fuse.js cho fuzzy search
- Zustand cho state management

### 4.3. Admin Dashboard

**Tính năng:**
- Quản lý sản phẩm (CRUD)
- Quản lý danh mục và modifiers
- Quản lý bàn và QR codes
- Quản lý nhân viên
- Xem báo cáo doanh thu
- Analytics dashboard với charts
- Quản lý loyalty vouchers
- Quản lý kho hàng
- Quản lý đặt bàn

**Công nghệ:**
- Recharts cho data visualization
- Prisma cho database queries
- Cloudinary cho image upload
- react-to-print cho in hóa đơn
- qrcode cho QR code generation

### 4.4. Waiter Features

**Tính năng:**
- Xem đơn hàng chờ duyệt
- Duyệt/từ chối đơn hàng
- Xem bàn được phân công
- Tạo hóa đơn và áp dụng giảm giá
- In hóa đơn
- Đánh dấu đơn đã phục vụ

### 4.5. Kitchen Display System (KDS)

**Tính năng:**
- Xem đơn hàng đã được duyệt
- Cập nhật trạng thái (Preparing → Ready)
- Timer theo dõi thời gian chế biến
- Cảnh báo đơn quá thời gian

### 4.6. Advanced Features

**Loyalty Points System:**
- Tích điểm tự động khi hoàn thành đơn
- Hệ thống tier (Bronze, Silver, Gold, Platinum)
- Đổi điểm lấy voucher
- Quản lý voucher

**Inventory Management:**
- Theo dõi số lượng tồn kho
- Cảnh báo hết hàng
- Tự động trừ kho khi hoàn thành đơn
- Lịch sử nhập/xuất kho

**Table Reservation System:**
- Đặt bàn trước
- Phát hiện trùng lặp (overlap detection)
- Quản lý trạng thái đặt bàn
- Analytics đặt bàn

---

## 5. THIẾT KẾ DATABASE

### 5.1. Database Schema

**Công nghệ:** PostgreSQL với Prisma ORM

**Main Tables:**

1. **User** (users)
   - id, email, password, name, role, phone, avatar
   - Relations: orders, reviews, loyaltyPoints, reservations

2. **Product** (products)
   - id, name, description, price, categoryId, status
   - Relations: category, images, modifierGroups, orderItems, reviews

3. **Category** (categories)
   - id, name, description, displayOrder

4. **Table** (tables)
   - id, tableNumber, capacity, status, qrToken, assignedWaiterId
   - Relations: orders, reservations

5. **Order** (orders)
   - id, totalAmount, status, tableId, customerId, discountType, discountValue
   - Relations: items, table, customer, transactions

6. **OrderItem** (order_items)
   - id, orderId, productId, quantity, price, notes

7. **LoyaltyPoints** (loyalty_points)
   - id, userId, balance, tier
   - Relations: transactions

8. **Voucher** (vouchers)
   - id, code, name, discountType, discountValue, minOrderAmount, maxUses

9. **Inventory** (inventory)
   - id, productId, quantity, minStock, maxStock
   - Relations: transactions

10. **Reservation** (reservations)
    - id, tableId, guestName, reservationDate, status
    - Relations: table, customer

### 5.2. ERD Diagram

```
User (1) ────< (N) Order
User (1) ────< (N) Review
User (1) ────< (1) LoyaltyPoints
User (1) ────< (N) Reservation
User (1) ────< (N) Table (assignedWaiter)

Category (1) ────< (N) Product
Product (1) ────< (N) ProductImage
Product (1) ────< (N) OrderItem
Product (1) ────< (N) Review
Product (1) ────< (1) Inventory

Order (1) ────< (N) OrderItem
Order (1) ────< (N) PointsTransaction
Order (1) ────< (N) InventoryTransaction

Table (1) ────< (N) Order
Table (1) ────< (N) Reservation
```

### 5.3. Enums

- `UserRole`: ADMIN, WAITER, KITCHEN, CUSTOMER
- `OrderStatus`: PENDING, ACCEPTED, PREPARING, READY, SERVED, COMPLETED
- `ProductStatus`: AVAILABLE, UNAVAILABLE, SOLD_OUT
- `TableStatus`: AVAILABLE, OCCUPIED, RESERVED, INACTIVE
- `ReservationStatus`: PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
- `LoyaltyTier`: BRONZE, SILVER, GOLD, PLATINUM

---

## 6. THIẾT KẾ UI/UX

### 6.1. Layout Design

**Customer Layout:**
- Mobile-first responsive design
- Bottom navigation bar
- Header với language switcher
- Product grid với pagination

**Admin Layout:**
- Sidebar navigation với các modules
- Top header với user info
- Content area với breadcrumbs
- Responsive tables và forms

**Waiter Layout:**
- Kanban board với columns (Pending, Accepted, Ready, Served)
- Table cards với order details
- Quick actions (Accept, Reject, Serve)

**Kitchen Layout:**
- Kanban board tương tự Waiter
- Order cards với timer
- Visual alerts cho overdue orders

### 6.2. Color Scheme

- **Primary:** Orange (#EA580C) - Thể hiện ấm cúng của nhà hàng
- **Success:** Green (#10B981) - Trạng thái thành công
- **Warning:** Yellow (#F59E0B) - Cảnh báo
- **Error:** Red (#EF4444) - Lỗi
- **Neutral:** Gray (#6B7280) - Text và borders

### 6.3. Components

- **Cards:** Product cards, Order cards, Table cards
- **Modals:** Product detail, Bill modal, Forms
- **Forms:** Login, Register, Product form, Staff form
- **Charts:** Revenue charts, Top products pie chart
- **Tables:** Data tables với sorting và pagination

### 6.4. Responsive Design

- **Mobile (< 640px):** Single column, hamburger menu
- **Tablet (640px - 1024px):** 2 columns, sidebar
- **Desktop (> 1024px):** Full layout, multi-column

---

## 7. HƯỚNG DẪN SỬ DỤNG VÀ DEPLOYMENT

### 7.1. Hướng dẫn cài đặt Local

**Prerequisites:**
- Node.js v18+
- Docker Desktop
- npm hoặc yarn

**Backend Setup:**

```bash
cd backend
npm install
cp .env.example .env
# Cập nhật .env với DATABASE_URL, JWT_SECRET, etc.
docker compose up -d
npx prisma db push
npx prisma db seed
npm run start:dev
```

Backend chạy tại: `http://localhost:5000`

**Frontend Setup:**

```bash
cd frontend
npm install
cp .env.example .env
# Cập nhật .env với NEXT_PUBLIC_API_BASE_URL
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

### 7.2. Hướng dẫn Deployment

**Docker Compose:**

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker exec -it smart_restaurant_backend npx prisma db push
docker exec -it smart_restaurant_backend npx prisma db seed
```

**Production Deployment:**

1. **Frontend (Vercel/Netlify):**
   - Connect repository
   - Set environment variables
   - Deploy

2. **Backend (Railway/Render):**
   - Connect repository
   - Set environment variables
   - Setup PostgreSQL database
   - Run migrations

3. **Database:**
   - Setup PostgreSQL trên cloud (AWS RDS, Railway, etc.)
   - Update DATABASE_URL

### 7.3. Hướng dẫn sử dụng

**Khách hàng:**
1. Quét QR code trên bàn
2. Xem menu và thêm vào giỏ hàng
3. Chọn modifiers và số lượng
4. Đặt hàng và theo dõi trạng thái
5. Thanh toán khi hoàn thành

**Admin:**
1. Đăng nhập vào `/admin`
2. Quản lý sản phẩm, bàn, nhân viên
3. Xem báo cáo và analytics
4. Quản lý kho hàng và đặt bàn

**Waiter:**
1. Đăng nhập vào `/waiter`
2. Xem đơn hàng chờ duyệt
3. Duyệt đơn và theo dõi trạng thái
4. Tạo hóa đơn và thanh toán

**Kitchen:**
1. Đăng nhập vào `/kitchen`
2. Xem đơn hàng cần chế biến
3. Cập nhật trạng thái đơn hàng

---

## 8. KẾT LUẬN

Hệ thống Smart Restaurant đã được phát triển thành công với đầy đủ các tính năng cần thiết và một số tính năng nâng cao. Hệ thống sử dụng công nghệ hiện đại, có giao diện thân thiện và dễ sử dụng.

**Điểm mạnh:**
- Tính năng đầy đủ và đa dạng
- UI/UX tốt, responsive
- Code quality cao
- Documentation đầy đủ
- Real-time updates

**Hướng phát triển:**
- Thêm tính năng delivery
- Tích hợp nhiều payment gateway
- Mobile app (React Native)
- AI recommendations
- Advanced analytics với ML

---

**Ngày hoàn thành:** 2026-01-20  
**Nhóm:** Phạm Hữu Đan, Trần Đại Hiệp, Lâm Hoàng Vũ
