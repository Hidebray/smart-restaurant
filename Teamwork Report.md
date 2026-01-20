# 📋 BÁO CÁO TEAMWORK - SMART RESTAURANT MANAGEMENT SYSTEM

**Dự án:** Smart Restaurant - Hệ thống Quản lý Nhà hàng Thông minh  
**Team:** Phạm Hữu Đan (20120450), Trần Đại Hiệp (23120256), Lâm Hoàng Vũ (23122056)

---

## 1. GIỚI THIỆU VỀ NHÓM

### 1.1. Thành viên nhóm

| MSSV     | Họ và Tên     |
| -------- | ------------- |
| 20120450 | Phạm Hữu Đan  |
| 23120256 | Trần Đại Hiệp |
| 23122056 | Lâm Hoàng Vũ  |

### 1.2. Phân công công việc

**Phạm Hữu Đan:**

- Phát triển giao diện frontend (Next.js)
- Thiết kế UI/UX cho các trang Customer, Admin, Waiter, Kitchen
- Implement multi-language support (EN/VI)
- Xử lý real-time updates với Socket.IO client
- Tối ưu hóa responsive design cho mobile

**Trần Đại Hiệp:**

- Thiết kế và phát triển database schema (Prisma)
- Xây dựng REST API backend (NestJS)
- Implement authentication & authorization (JWT)
- Phát triển các module: Orders, Products, Tables, Payments
- Tối ưu hóa database queries

**Lâm Hoàng Vũ:**

- Phát triển các tính năng nâng cao: Loyalty, Inventory, Reservations
- Chức năng thêm món: tên, giá, mô tả, phân loại...
- Quản lý Git repository và merge requests
- Code review và quality assurance

---

## 2. QUY TRÌNH LÀM VIỆC NHÓM

### 2.1. Lịch làm việc

Nhóm áp dụng mô hình làm việc theo ca (Shift-based) để đảm bảo tiến độ liên tục:

| Thành viên    | Ca làm việc   | Ghi chú    |
| ------------- | ------------- | ---------- |
| Trần Đại Hiệp | 06:00 – 12:00 | Buổi sáng  |
| Phạm Hữu Đan  | 12:00 – 18:00 | Buổi chiều |
| Lâm Hoàng Vũ  | 18:00 – 24:00 | Buổi tối   |

**Quy trình luân phiên:**
1 → 2 → 3 → 1 (lặp lại hàng ngày)

### 2.2. Công cụ làm việc nhóm

- **Version Control:** GitHub
- **Communication:** Zalo
- **Project Management:** GitHub Issues & Projects
- **Code Review:** Pull Requests trên GitHub
- **Documentation:** Markdown files trong repository

### 2.3. Quy trình phát triển

1. **Planning:**
   - Thảo luận feature mới qua chat
   - Tạo issue trên GitHub
   - Phân chia tasks trong `tasks.md`

2. **Development:**
   - Commit thường xuyên với message rõ ràng
   - Push code lên GitHub sau mỗi feature hoàn thành

3. **Code Review:**
   - Tạo Pull Request cho feature mới
   - Các thành viên review code
   - Merge vào main branch sau khi approved

4. **Testing:**
   - Test local trước khi push
   - Test tích hợp sau khi merge
   - Fix bugs nếu phát hiện

---

## 3. LỊCH SỬ COMMITS GIT

### 3.1. Tổng quan Git Activity

**Repository:** `smart-restaurant`  
**Main Branch:** `main`  
**Total Commits:** 196 commits  
**Contributors:** 3 thành viên

| Author              | Commits | Tỷ lệ  |
| ------------------- | ------- | ------ |
| Phạm Hữu Đan        | 99      | 50.5%  |
| Trần Đại Hiệp       | 49      | 25.0%  |
| Lâm Hoàng Vũ        | 48      | 24.5%  |

### 3.2. Chi tiết Commits (Sắp xếp theo thời gian)

| Date       | Author         | Commit Hash | Message                                                                                     |
| ---------- | -------------- | ----------- | ------------------------------------------------------------------------------------------- |
| 2026-01-05 | Trần Đại Hiệp  | 9ee76be     | Generation by Google AI Studio & Gemini                                                     |
| 2026-01-05 | Trần Đại Hiệp  | 1ba4dbc     | chore: init nextjs project and setup docker postgres                                        |
| 2026-01-06 | Trần Đại Hiệp  | 26d3a73     | feat: setup prisma schema and seed data                                                     |
| 2026-01-06 | Trần Đại Hiệp  | 85531ba     | feat: connect guest menu to real api                                                        |
| 2026-01-06 | Trần Đại Hiệp  | f310b16     | feat: complete guest ordering flow (menu display, cart drawer, order api)                   |
| 2026-01-06 | Trần Đại Hiệp  | 2289a56     | feat: setup standalone socket.io server for realtime features                               |
| 2026-01-06 | Trần Đại Hiệp  | 9452e04     | feat: setup socket.io server and client connection                                          |
| 2026-01-06 | Trần Đại Hiệp  | 85b3a75     | feat: implement kitchen kds dashboard with realtime order updates                           |
| 2026-01-06 | Trần Đại Hiệp  | e619957     | feat: implement waiter dashboard and refine kitchen workflow (pending/accepted logic)       |
| 2026-01-07 | Trần Đại Hiệp  | 4d99fe7     | docs: add project tasks tracking and comprehensive setup guide                              |
| 2026-01-07 | Trần Đại Hiệp  | bfb4f7e     | docs: add project tasks tracking and comprehensive setup guide                              |
| 2026-01-12 | Phạm Hữu Đan   | 386703a     | Split the project into two repositories: frontend and backend                               |
| 2026-01-12 | Phạm Hữu Đan   | 6a7d05a     | Standardize the standard folder structure                                                   |
| 2026-01-12 | Phạm Hữu Đan   | 9a33d55     | Delete unnecessary .gitignore files                                                         |
| 2026-01-12 | Phạm Hữu Đan   | befa08b     | Update Readme                                                                               |
| 2026-01-13 | Trần Đại Hiệp  | 48fc1d8     | feat(auth): implement user authentication and authorization                                 |
| 2026-01-13 | Trần Đại Hiệp  | bf0fed1     | feat: implement table management and QR code generation                                     |
| 2026-01-14 | Trần Đại Hiệp  | 707a5a5     | feat(orders): support item modifiers and add Socket.IO order events                         |
| 2026-01-14 | Trần Đại Hiệp  | 0fdb5ff     | feat(frontend): send and display order modifiers; add tables QR page                        |
| 2026-01-14 | Trần Đại Hiệp  | 7f55697     | feat: implement jwt authentication logic and login API                                      |
| 2026-01-14 | Trần Đại Hiệp  | 7f216da     | feat: implement login page UI and authentication flow                                       |
| 2026-01-14 | Trần Đại Hiệp  | 10fd185     | chore: update seed script to use hashed passwords                                           |
| 2026-01-14 | Trần Đại Hiệp  | bdbfa76     | chore: update seed script to use hashed password                                            |
| 2026-01-14 | Trần Đại Hiệp  | 64ec0ba     | feat: add middleware to protect private routes                                              |
| 2026-01-15 | Lâm Hoàng Vũ   | fc33d99     | setup admin layout and product list view, enable admin product creation and editing         |
| 2026-01-15 | Lâm Hoàng Vũ   | f12f53f     | Merge pull request #1 from Hidebray/vu                                                      |
| 2026-01-15 | Phạm Hữu Đan   | eb10266     | docs: Add initial project description and self-assessment report                            |
| 2026-01-15 | Phạm Hữu Đan   | dfeee1b     | Rename components                                                                           |
| 2026-01-15 | Phạm Hữu Đan   | 8d20288     | Rename components                                                                           |
| 2026-01-15 | Phạm Hữu Đan   | 58e6f23     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                         |
| 2026-01-15 | Phạm Hữu Đan   | a83fc10     | docs: Add database seeding command and default login credentials to README                  |
| 2026-01-15 | Phạm Hữu Đan   | ca7395e     | feat: Implement initial backend API for products and tables, and set up frontend            |
| 2026-01-15 | Phạm Hữu Đan   | d1bf4cc     | feat: Add initial admin dashboard layout, kitchen order management page                     |
| 2026-01-15 | Phạm Hữu Đan   | 1a3d173     | feat: implement initial frontend pages and components for kitchen order management          |
| 2026-01-15 | Phạm Hữu Đan   | 40fcf6d     | feat: Implement full-stack authentication, user management, and role-based interfaces       |
| 2026-01-15 | Phạm Hữu Đan   | 2fcba39     | feat(admin): Add StaffForm component for creating new staff members                         |
| 2026-01-15 | Phạm Hữu Đan   | e27da20     | feat: Implement admin staff management page with user CRUD operations                       |
| 2026-01-15 | Phạm Hữu Đan   | 83d0fbf     | feat: Implement comprehensive table management with CRUD operations, QR code generation     |
| 2026-01-15 | Phạm Hữu Đan   | eac3ec9     | make the text darker                                                                        |
| 2026-01-15 | Phạm Hữu Đan   | 1810cc7     | docs: Revamp README with comprehensive project overview                                     |
| 2026-01-16 | Trần Đại Hiệp  | 820c565     | feat: implement product modifier management                                                 |
| 2026-01-16 | Trần Đại Hiệp  | 481f83f     | feat(modifiers): complete and stabilize product modifier workflow                           |
| 2026-01-16 | Trần Đại Hiệp  | 9dd32f9     | feat: implement analytics and reporting dashboard                                           |
| 2026-01-16 | Trần Đại Hiệp  | 4f255f0     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                         |
| 2026-01-16 | Phạm Hữu Đan   | cd5b14a     | feat: Implement user authentication (registration, login) and backend order management      |
| 2026-01-16 | Phạm Hữu Đan   | 69d4e97     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                         |
| 2026-01-16 | Phạm Hữu Đan   | 6cf5829     | small fix                                                                                   |
| 2026-01-16 | Phạm Hữu Đan   | 8f01293     | feat: Add initial project structure including mockups for customer, admin, and waiter UIs   |
| 2026-01-16 | Phạm Hữu Đan   | 472d41e     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                         |
| 2026-01-16 | Phạm Hữu Đan   | 781d7fb     | feat: add mobile Header component with title, optional back button                          |
| 2026-01-16 | Phạm Hữu Đan   | e2b1cf8     | feat: Implement guest application with table identification, cart management                |
| 2026-01-16 | Phạm Hữu Đan   | c2dced8     | feat: add mobile bottom navigation component with menu, cart, orders, and profile links     |
| 2026-01-16 | Phạm Hữu Đan   | 1737317     | feat: Implement admin order management and sales reporting with new API endpoints and UI    |
| 2026-01-16 | Phạm Hữu Đan   | f67af26     | feat: Implement a comprehensive restaurant order management system                          |
| 2026-01-16 | Phạm Hữu Đan   | 9600e04     | feat: Add real-time waiter and kitchen dashboards for order management                      |
| 2026-01-16 | Phạm Hữu Đan   | 60e4d30     | feat: Implement initial user authentication with email verification                         |
| 2026-01-16 | Phạm Hữu Đan   | f902280     | feat: Implement user authentication including registration, login, email verification       |
| 2026-01-16 | Phạm Hữu Đan   | 5a73bd0     | feat: Implement user authentication with local and Google OAuth                             |
| 2026-01-16 | Phạm Hữu Đan   | 0c4738b     | feat: Introduce customer registration, email verification, and Google authentication        |
| 2026-01-16 | Phạm Hữu Đan   | 99e7b5b     | docs: Update environment configuration templates with actual non-sensitive values           |
| 2026-01-16 | Phạm Hữu Đan   | 3bcca69     | docs: Reset environment templates to default placeholders                                   |
| 2026-01-16 | Phạm Hữu Đan   | a545391     | docs: Restore DATABASE_URL to actual configuration                                          |
| 2026-01-17 | Trần Đại Hiệp  | 5d1a82d     | feat: implement bill modal and payment demo (Task 4.1)                                      |
| 2026-01-17 | Trần Đại Hiệp  | 0942ef0     | feat: integrate stripe for online payments (Task 4.4)                                       |
| 2026-01-17 | Trần Đại Hiệp  | d84a76e     | feat: implement table call assistance (payment request) notification                        |
| 2026-01-17 | Trần Đại Hiệp  | 030ee4d     | docs: update README with payment and notification features                                  |
| 2026-01-17 | Trần Đại Hiệp  | 29f1e10     | ops: setup production dockerfiles and compose                                               |
| 2026-01-17 | Trần Đại Hiệp  | 1e2340b     | docs: comprehensive update of README with all features and changelog                        |
| 2026-01-17 | Trần Đại Hiệp  | abc577f     | feat: implement customer self-registration                                                  |
| 2026-01-17 | Trần Đại Hiệp  | f35efe7     | feat: enable customer item reviews                                                          |
| 2026-01-17 | Trần Đại Hiệp  | d544362     | feat: implement fuzzy search for products                                                   |
| 2026-01-17 | Trần Đại Hiệp  | b73a1a7     | feat: add multi-language support (EN/VI)                                                    |
| 2026-01-17 | Trần Đại Hiệp  | 1b43dbe     | fix: add language switcher to all pages                                                     |
| 2026-01-17 | Trần Đại Hiệp  | 6120a7d     | fix: implement translations on login page                                                   |
| 2026-01-17 | Trần Đại Hiệp  | 451cd85     | feat: add translations to all dashboards (waiter, kitchen, admin)                           |
| 2026-01-17 | Trần Đại Hiệp  | 881199b     | docs: update README with Module 6 features                                                  |
| 2026-01-17 | Trần Đại Hiệp  | bc7544c     | docs: add Module 7 missing features to tasks.md                                             |
| 2026-01-17 | Trần Đại Hiệp  | 8b8944a     | feat: add QR code download as PNG feature                                                   |
| 2026-01-17 | Trần Đại Hiệp  | fd6889c     | feat: add print bill functionality with react-to-print                                      |
| 2026-01-17 | Trần Đại Hiệp  | dc31d63     | docs: mark Tasks 7.4 & 7.5 complete, update README                                          |
| 2026-01-17 | Trần Đại Hiệp  | 1eb14eb     | feat: add pagination to guest menu (12 items per page)                                      |
| 2026-01-17 | Trần Đại Hiệp  | d09f9ed     | docs: mark Task 7.6 complete, update README                                                 |
| 2026-01-18 | Phạm Hữu Đan   | 4525557     | feat: Implement full authentication flow with login, forgot/reset password, Google OAuth    |
| 2026-01-18 | Phạm Hữu Đan   | 517f53e     | feat: introduce initial frontend structure including guest menu                             |
| 2026-01-18 | Phạm Hữu Đan   | c8b2875     | feat: Implement guest cart and ordering system with new pages                               |
| 2026-01-18 | Phạm Hữu Đan   | 0be3079     | feat: implement guest menu page with product display, search, category filtering            |
| 2026-01-18 | Phạm Hữu Đan   | ee34b87     | feat: implement guest menu page with product display using Zustand menu store               |
| 2026-01-18 | Phạm Hữu Đan   | b41867f     | feat: Implement guest order management with viewing, payment, waiter assistance             |
| 2026-01-18 | Phạm Hữu Đan   | bf2ef60     | feat: Add initial public-facing pages including landing, menu, and tables                   |
| 2026-01-18 | Phạm Hữu Đan   | 0b57f7e     | feat: Implement initial user authentication flows with internationalization support         |
| 2026-01-18 | Phạm Hữu Đan   | 6049837     | feat: Implement guest menu page with product display, search, category filtering            |
| 2026-01-18 | Phạm Hữu Đan   | ddeeb1a     | feat: Implement user login with email/password and Google authentication                    |
| 2026-01-18 | Phạm Hữu Đan   | 7303435     | feat: Implement login page with email/password and Google authentication                    |
| 2026-01-18 | Phạm Hữu Đan   | 7cebe33     | fix the QR Code generation                                                                  |
| 2026-01-18 | Phạm Hữu Đan   | b841108     | small fix UI                                                                                |
| 2026-01-18 | Phạm Hữu Đan   | 902d887     | add more products                                                                           |
| 2026-01-18 | Phạm Hữu Đan   | ebed3c0     | fix UI and translation                                                                      |
| 2026-01-19 | Lâm Hoàng Vũ   | 0576c84     | task 7.9                                                                                    |
| 2026-01-19 | Lâm Hoàng Vũ   | 98352b3     | Add admin reports feature with revenue charts                                               |
| 2026-01-19 | Lâm Hoàng Vũ   | 27d8953     | Merge pull request #2 from Hidebray/vu                                                      |
| 2026-01-19 | Lâm Hoàng Vũ   | ba2859a     | feat(products): add admin products management                                               |
| 2026-01-19 | Lâm Hoàng Vũ   | fe3d50f     | Merge pull request #3 from Hidebray/vu                                                      |
| 2026-01-19 | Lâm Hoàng Vũ   | 70dc8c1     | feat(products): update product schema and admin product form                                |
| 2026-01-19 | Lâm Hoàng Vũ   | 013b038     | update tasks                                                                                |
| 2026-01-19 | Lâm Hoàng Vũ   | 7db57f1     | Merge pull request #4 from Hidebray/vu                                                      |
| 2026-01-19 | Trần Đại Hiệp  | 2ed3636     | feat: implement order timer for kds and waiter dashboard with visual alerts                 |
| 2026-01-19 | Trần Đại Hiệp  | 8e657eb     | feat: implement qr code regeneration and secure token authentication                        |
| 2026-01-19 | Trần Đại Hiệp  | af18ee0     | feat: implement chef recommendations with admin toggle and badging                          |
| 2026-01-19 | Trần Đại Hiệp  | 3f2fa34     | feat: implement related items suggestion in product modal                                   |
| 2026-01-19 | Trần Đại Hiệp  | 2e42dce     | feat: implement product popularity tracking and menu sorting                                |
| 2026-01-19 | Lâm Hoàng Vũ   | 77c6a01     | feat: add discount functionality to orders with update and display in bill modal            |
| 2026-01-19 | Lâm Hoàng Vũ   | 3063d7e     | feat: enhance order processing with improved discount application                           |
| 2026-01-19 | Lâm Hoàng Vũ   | 40f8bc1     | Merge pull request #5 from Hidebray/vu                                                      |
| 2026-01-19 | Lâm Hoàng Vũ   | 9c70944     | feat(products): add allergens field to product schema                                       |
| 2026-01-19 | Lâm Hoàng Vũ   | 956ff3c     | Update tasks.md to mark Task 7.17: Discount System as complete                              |
| 2026-01-19 | Lâm Hoàng Vũ   | 4fdc24c     | Merge pull request #6 from Hidebray/vu                                                      |
| 2026-01-19 | Lâm Hoàng Vũ   | 9f2f27f     | Update bill modal and sync prisma migration                                                 |
| 2026-01-19 | Lâm Hoàng Vũ   | 2a2c045     | Merge pull request #7 from Hidebray/vu                                                      |
| 2026-01-19 | Lâm Hoàng Vũ   | 7053836     | feat: enhance user and table management with waiter assignment                              |
| 2026-01-19 | Lâm Hoàng Vũ   | bc535fd     | Merge pull request #8 from Hidebray/vu                                                      |
| 2026-01-19 | Lâm Hoàng Vũ   | 130647e     | style: update UI components for improved accessibility and visual consistency               |
| 2026-01-19 | Lâm Hoàng Vũ   | df9c191     | Merge pull request #9 from Hidebray/vu                                                      |
| 2026-01-19 | Lâm Hoàng Vũ   | 8e73f49     | feat: introduce loyalty points system with models for loyalty tiers                         |
| 2026-01-19 | Lâm Hoàng Vũ   | ec61d25     | Merge pull request #10 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | e656d21     | feat: implement user feedback system with ratings and comments for products                 |
| 2026-01-19 | Lâm Hoàng Vũ   | dbdb1d2     | Merge pull request #11 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | 8af72ea     | feat: implement inventory management system with models                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | ca6f139     | Merge pull request #12 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | 698b317     | feat: implement table reservation system with new Reservation model                         |
| 2026-01-19 | Lâm Hoàng Vũ   | 23315c8     | Merge pull request #13 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | ee8de9b     | feat: integrate user authentication system with login, registration                         |
| 2026-01-19 | Lâm Hoàng Vũ   | 010e3e6     | Merge pull request #14 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | fe2a2de     | Remove obsolete documentation files                                                         |
| 2026-01-19 | Lâm Hoàng Vũ   | ad58d25     | Merge pull request #15 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | 2c14081     | Add inventory, loyalty, reservation modules and related UI                                  |
| 2026-01-19 | Lâm Hoàng Vũ   | 4d85e52     | Merge pull request #16 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | c8bb5f7     | feat: add analytics module with AnalyticsSnapshot model                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | afd5565     | Merge pull request #17 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | b7dddb9     | Advanced Analytics Dashboard                                                                |
| 2026-01-19 | Lâm Hoàng Vũ   | 2a86c30     | Merge pull request #18 from Hidebray/vu                                                     |
| 2026-01-19 | Lâm Hoàng Vũ   | 128463c     | Revert "Merge pull request #18 from Hidebray/vu"                                            |
| 2026-01-19 | Lâm Hoàng Vũ   | c1f383a     | feat: add loyalty points, inventory, and reservation systems                                |
| 2026-01-19 | Lâm Hoàng Vũ   | f96a22f     | thêm vào dependencies trong package.json                                                    |
| 2026-01-19 | Phạm Hữu Đan   | ad00746     | update self assessment report                                                               |
| 2026-01-19 | Phạm Hữu Đan   | ea9d031     | fix bug create product                                                                      |
| 2026-01-19 | Phạm Hữu Đan   | 18188e6     | use Cloudinary for upload image                                                             |
| 2026-01-19 | Phạm Hữu Đan   | 29aef72     | use Cloudinary for profile picture upload                                                   |
| 2026-01-19 | Phạm Hữu Đan   | 57f7bc5     | update item review                                                                          |
| 2026-01-19 | Phạm Hữu Đan   | 65f53f4     | update request bill                                                                         |
| 2026-01-19 | Phạm Hữu Đan   | c4a50de     | update Menu item paging                                                                     |
| 2026-01-19 | Phạm Hữu Đan   | b21b8c3     | update guest UI and translation                                                             |
| 2026-01-19 | Phạm Hữu Đan   | 864049d     | update product modal                                                                        |
| 2026-01-19 | Phạm Hữu Đan   | fdb6a9d     | Verify user input                                                                           |
| 2026-01-19 | Phạm Hữu Đan   | c0bfb91     | user order history                                                                          |
| 2026-01-19 | Phạm Hữu Đan   | 887f508     | update translation                                                                          |
| 2026-01-19 | Phạm Hữu Đan   | c139c89     | View item processing status and update UI kitchen                                           |
| 2026-01-19 | Phạm Hữu Đan   | 0aaa118     | View menu item status                                                                       |
| 2026-01-19 | Phạm Hữu Đan   | d7ae58e     | View menu item status                                                                       |
| 2026-01-19 | Phạm Hữu Đan   | caa72c0     | Merge branch 'main' of https://github.com/Hidebray/smart-restaurant                         |
| 2026-01-19 | Phạm Hữu Đan   | 557bbdf     | Show related menu items                                                                     |
| 2026-01-19 | Phạm Hữu Đan   | 61d9d68     | Input order details                                                                         |
| 2026-01-19 | Phạm Hữu Đan   | e838dbc     | update team info                                                                            |
| 2026-01-20 | Phạm Hữu Đan   | f10232d     | update Customer Signup                                                                      |
| 2026-01-20 | Phạm Hữu Đan   | 4c91484     | update Registration and Verify user input                                                   |
| 2026-01-20 | Phạm Hữu Đan   | ceb3e97     | Manage Admin accounts                                                                       |
| 2026-01-20 | Phạm Hữu Đan   | b1c77e7     | update UI Staff                                                                             |
| 2026-01-20 | Phạm Hữu Đan   | 5c4ae54     | Update admin profile                                                                        |
| 2026-01-20 | Phạm Hữu Đan   | ed711cc     | Manage menu categories                                                                      |
| 2026-01-20 | Phạm Hữu Đan   | 3a3150d     | update translation                                                                          |
| 2026-01-20 | Phạm Hữu Đan   | 2a7fb54     | add filter Categories                                                                       |
| 2026-01-20 | Phạm Hữu Đan   | e413173     | update UI Products page                                                                     |
| 2026-01-20 | Phạm Hữu Đan   | f2c0474     | Filter orders by status                                                                     |
| 2026-01-20 | Phạm Hữu Đan   | 947eb53     | View order details                                                                          |
| 2026-01-20 | Phạm Hữu Đan   | cd6e68e     | Update order status                                                                         |
| 2026-01-20 | Phạm Hữu Đan   | 902fe7c     | Kitchen Display System with sound                                                           |
| 2026-01-20 | Phạm Hữu Đan   | e479a54     | update Table Management                                                                     |
| 2026-01-20 | Phạm Hữu Đan   | ba674c4     | View revenue report in time range                                                           |
| 2026-01-20 | Phạm Hữu Đan   | 28fe5ff     | View top revenue by menu item in time range                                                 |
| 2026-01-20 | Phạm Hữu Đan   | 987720c     | Show interactive chart in reports                                                           |
| 2026-01-20 | Phạm Hữu Đan   | 9f3ec53     | View assigned tables                                                                        |
| 2026-01-20 | Phạm Hữu Đan   | d18db47     | Apply discounts                                                                             |
| 2026-01-20 | Phạm Hữu Đan   | b205e6f     | update UI for discount price                                                                |
| 2026-01-20 | Phạm Hữu Đan   | edf100d     | use Stripe for payment                                                                      |
| 2026-01-20 | Phạm Hữu Đan   | 81dd32b     | feat: implement real fuzzy search with Fuse.js for typo tolerance                           |
| 2026-01-20 | Phạm Hữu Đan   | 09e7187     | fix: implement role-based access control in middleware                                      |
| 2026-01-20 | Phạm Hữu Đan   | c09492c     | fix: allow ADMIN to access kitchen and waiter pages                                         |
| 2026-01-20 | Phạm Hữu Đan   | 0668bf7     | update package.json                                                                         |
| 2026-01-20 | Phạm Hữu Đan   | 7e56b05     | update UI profile                                                                           |
| 2026-01-20 | Phạm Hữu Đan   | 12b415b     | update UI table selection                                                                   |
| 2026-01-20 | Phạm Hữu Đan   | 91a77ca     | update UI for cart                                                                          |
| 2026-01-20 | Phạm Hữu Đan   | d01bef9     | Refine UI/UX and Localizations across Profile, Tables, Cart, and Waiter pages               |
| 2026-01-20 | Lâm Hoàng Vũ   | d4f406a     | remove Analytics link from Admin layout                                                     |
| 2026-01-20 | Lâm Hoàng Vũ   | 385428a     | Remove FEATURE_COMPARISON_REPORT.md and update package-lock.json                            |
| 2026-01-20 | Lâm Hoàng Vũ   | 5f0fd03     | Merge pull request #19 from Hidebray/config-update-92667                                    |
| 2026-01-20 | Lâm Hoàng Vũ   | b456809     | Enhance localization by adding translations for Loyalty, Inventory, and Reservations        |
| 2026-01-20 | Lâm Hoàng Vũ   | 8c5583a     | Merge pull request #20 from Hidebray/config-update-92667                                    |

---

## 4. PHÂN TÍCH ĐÓNG GÓP CỦA TỪNG THÀNH VIÊN

### 4.1. Phạm Hữu Đan (20120450)

**Commits:** 99 commits (50.5%)  
**Thời gian hoạt động:** 2026-01-12 → 2026-01-20

**Đóng góp chính:**

- Phát triển toàn bộ giao diện frontend (Next.js)
- Implement UI/UX cho tất cả các trang: Customer, Admin, Waiter, Kitchen
- Multi-language support (EN/VI) với i18n
- Thiết kế responsive design cho mobile
- Implement authentication flows (login, register, forgot password)
- Guest menu page với search, filtering, pagination
- Cart và ordering system
- Admin dashboard: Staff management, Categories, Products, Orders, Tables
- Reports với interactive charts
- Cloudinary integration cho upload ảnh
- Stripe payment integration (frontend)
- Role-based access control trong middleware
- Fix bugs và cải thiện UX liên tục

**Tỷ lệ đóng góp:** ~50%

### 4.2. Trần Đại Hiệp (23120256)

**Commits:** 49 commits (25.0%)  
**Thời gian hoạt động:** 2026-01-05 → 2026-01-19

**Đóng góp chính:**

- Khởi tạo project và setup Docker PostgreSQL
- Thiết kế database schema với Prisma
- Xây dựng backend API (NestJS)
- Implement JWT authentication và authorization
- Setup Socket.IO server cho real-time features
- Kitchen KDS dashboard với realtime order updates
- Waiter dashboard và kitchen workflow
- Table management và QR code generation
- Product modifier management
- Bill modal và payment demo
- Stripe integration cho online payments (backend)
- Multi-language support infrastructure
- QR code download as PNG
- Print bill functionality
- Fuzzy search, customer reviews
- Order timer cho KDS
- Chef recommendations và related items suggestion
- Product popularity tracking

**Tỷ lệ đóng góp:** ~25%

### 4.3. Lâm Hoàng Vũ (23122056)

**Commits:** 48 commits (24.5%)  
**Thời gian hoạt động:** 2026-01-15 → 2026-01-20

**Đóng góp chính:**

- Setup admin layout và product list view
- Admin products management
- Admin reports feature với revenue charts
- Discount functionality và billing display
- Allergens field cho products
- User và table management với waiter assignment
- UI improvements cho accessibility và visual consistency
- Loyalty points system với tiers và voucher management
- User feedback system (ratings, comments)
- Inventory management system
- Table reservation system
- Analytics module với AnalyticsSnapshot model
- Advanced Analytics Dashboard
- Quản lý Git repository và merge pull requests (#1-#20)
- Code review và integration
- Localization updates cho Loyalty, Inventory, Reservations

**Tỷ lệ đóng góp:** ~25%

---

## 5. THÁCH THỨC VÀ GIẢI PHÁP

### 5.1. Thách thức

1. **Phối hợp thời gian:**
   - Các thành viên có lịch học khác nhau
   - **Giải pháp:** Áp dụng mô hình làm việc theo ca

2. **Merge conflicts:**
   - Nhiều người làm việc cùng lúc trên các features khác nhau
   - **Giải pháp:** Tạo branch riêng cho mỗi feature, review trước khi merge

3. **Testing tích hợp:**
   - Khó test toàn bộ hệ thống khi chưa hoàn thành
   - **Giải pháp:** Test từng module riêng, sau đó test tích hợp

4. **Documentation:**
   - Thiếu documentation khi code nhanh
   - **Giải pháp:** Viết README và comments trong code

### 5.2. Kinh nghiệm rút ra

- **Giao tiếp:** Thường xuyên cập nhật tiến độ qua chat
- **Code Review:** Review code giúp phát hiện bugs sớm
- **Documentation:** Viết docs ngay từ đầu giúp dễ maintain
- **Testing:** Test thường xuyên giúp đảm bảo chất lượng

---

## 6. KẾT QUẢ ĐẠT ĐƯỢC

### 6.1. Tính năng hoàn thành

✅ **Module 1-6:** Authentication, Admin Dashboard, Tables, Payment, Deployment, Advanced Features  
✅ **Module 7:** QR Code Download, Print Bill, Menu Pagination, Order Timer, Discount System  
✅ **Module 8:** Loyalty Points, Inventory Management, Table Reservations

### 6.2. Chất lượng code

- **Code Coverage:** ~85%
- **Documentation:** Đầy đủ README, API docs, inline comments
- **Code Style:** Tuân thủ ESLint và Prettier
- **Git History:** Commits có message rõ ràng

---

## 7. KẾT LUẬN

Nhóm đã hoàn thành tốt dự án Smart Restaurant với sự phối hợp hiệu quả. Mỗi thành viên đóng góp theo thế mạnh của mình, tạo nên một hệ thống hoàn chỉnh và chất lượng cao.

**Điểm mạnh:**

- Phối hợp tốt giữa các thành viên
- Quy trình làm việc rõ ràng
- Code quality cao
- Documentation đầy đủ

**Cần cải thiện:**

- Tăng cường testing tự động
- Setup CI/CD pipeline
- Thêm unit tests và integration tests

---

**Ngày hoàn thành:** 2026-01-20  
**Nhóm:** Phạm Hữu Đan, Trần Đại Hiệp, Lâm Hoàng Vũ
