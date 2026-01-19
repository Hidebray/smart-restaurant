# 📋 Kế Hoạch Thêm 20,000 Dòng Code - 30 Commits

**Mục tiêu:** Thêm ~20,000 dòng code trong 30 commits, không ảnh hưởng đến code hiện tại

**Nguyên tắc:**
- Mỗi tính năng là module độc lập
- Có thể bật/tắt qua feature flags
- Không modify code hiện tại, chỉ thêm mới
- Mỗi commit là một feature nhỏ hoàn chỉnh

---

## 📊 Tổng Quan Các Tính Năng

| # | Tính Năng | Số Dòng | Số Commits | Mô Tả |
|---|-----------|---------|------------|-------|
| 1 | Loyalty Points System | ~4,000 | 5 | Hệ thống tích điểm, voucher, tier |
| 2 | Inventory Management | ~3,500 | 4 | Quản lý tồn kho, auto-update, alerts |
| 3 | Peak Hours Analysis | ~3,000 | 4 | Phân tích giờ cao điểm, heatmap |
| 4 | Export Reports (PDF/Excel) | ~2,000 | 3 | Export reports, invoices |
| 5 | Advanced Search & Filters | ~2,500 | 3 | Multi-filter search |
| 6 | Real-time Notifications | ~2,500 | 4 | Push notifications, email alerts |
| 7 | Customer Segmentation & CLV | ~2,000 | 3 | Phân nhóm khách hàng, CLV |
| 8 | Dynamic Pricing | ~1,500 | 2 | Time-based pricing rules |
| 9 | Order Queue Priority | ~1,000 | 2 | Priority scoring cho orders |
| **TỔNG** | | **~22,000** | **30** | |

---

## 🎯 Chi Tiết Từng Tính Năng

### 1. Loyalty Points System (~4,000 dòng, 5 commits)

#### Commit 1: Database Schema & Migrations
- **Files:** `backend/prisma/schema.prisma`, `backend/prisma/migrations/...`
- **Lines:** ~200
- **Changes:**
  - Thêm model `LoyaltyPoints` (userId, points, tier, totalEarned, totalRedeemed)
  - Thêm model `Voucher` (code, discountType, discountValue, minOrder, expiryDate, isActive)
  - Thêm model `PointsTransaction` (userId, points, type: EARN/REDEEM, orderId, description)
  - Thêm model `VoucherRedemption` (userId, voucherId, orderId, redeemedAt)

#### Commit 2: Backend Module - DTOs & Entities
- **Files:** 
  - `backend/src/loyalty/dto/*.ts` (4 files)
  - `backend/src/loyalty/entities/*.ts` (2 files)
- **Lines:** ~400
- **Changes:**
  - CreatePointsTransactionDto
  - RedeemVoucherDto
  - UpdateTierDto
  - GetPointsHistoryDto

#### Commit 3: Backend Service & Controller
- **Files:**
  - `backend/src/loyalty/loyalty.service.ts`
  - `backend/src/loyalty/loyalty.controller.ts`
  - `backend/src/loyalty/loyalty.module.ts`
- **Lines:** ~1,200
- **Changes:**
  - Service: calculatePoints(), redeemVoucher(), getPointsHistory(), updateTier()
  - Controller: endpoints cho points, vouchers, history
  - Integration với OrdersService để auto-add points

#### Commit 4: Frontend API & Types
- **Files:**
  - `frontend/src/lib/api/loyalty.ts`
  - `frontend/src/types/loyalty.ts`
- **Lines:** ~300
- **Changes:**
  - API client cho loyalty endpoints
  - TypeScript types cho points, vouchers, tiers

#### Commit 5: Frontend UI Components
- **Files:**
  - `frontend/src/components/loyalty/PointsDisplay.tsx`
  - `frontend/src/components/loyalty/VoucherList.tsx`
  - `frontend/src/components/loyalty/PointsHistory.tsx`
  - `frontend/src/app/guest/loyalty/page.tsx`
  - `frontend/src/app/admin/loyalty/page.tsx`
- **Lines:** ~1,900
- **Changes:**
  - Customer: View points, redeem vouchers, history
  - Admin: Manage vouchers, view points stats

---

### 2. Inventory Management (~3,500 dòng, 4 commits)

#### Commit 6: Database Schema
- **Files:** `backend/prisma/schema.prisma`, migration
- **Lines:** ~150
- **Changes:**
  - Thêm model `Inventory` (productId, quantity, minStock, maxStock, unit)
  - Thêm model `InventoryTransaction` (inventoryId, quantity, type: IN/OUT, orderId, reason)

#### Commit 7: Backend Module
- **Files:**
  - `backend/src/inventory/dto/*.ts`
  - `backend/src/inventory/inventory.service.ts`
  - `backend/src/inventory/inventory.controller.ts`
  - `backend/src/inventory/inventory.module.ts`
- **Lines:** ~1,200
- **Changes:**
  - Service: updateInventory(), checkLowStock(), getAlerts()
  - Auto-update khi order được tạo/completed
  - Alerts khi stock < minStock

#### Commit 8: Frontend API & Types
- **Files:**
  - `frontend/src/lib/api/inventory.ts`
  - `frontend/src/types/inventory.ts`
- **Lines:** ~200
- **Changes:**
  - API client và types

#### Commit 9: Frontend UI
- **Files:**
  - `frontend/src/app/admin/inventory/page.tsx`
  - `frontend/src/components/inventory/InventoryCard.tsx`
  - `frontend/src/components/inventory/LowStockAlert.tsx`
- **Lines:** ~1,950
- **Changes:**
  - Admin dashboard: View inventory, update stock, alerts
  - Auto-update indicators

---

### 3. Peak Hours Analysis (~3,000 dòng, 4 commits)

#### Commit 10: Backend Analytics Service
- **Files:**
  - `backend/src/analytics/analytics.service.ts`
  - `backend/src/analytics/analytics.controller.ts`
  - `backend/src/analytics/analytics.module.ts`
  - `backend/src/analytics/dto/peak-hours.dto.ts`
- **Lines:** ~800
- **Changes:**
  - Service: getPeakHours(), getHourlyStats(), getDailyHeatmap()
  - Aggregate orders theo giờ, ngày, tuần

#### Commit 11: Backend API Endpoints
- **Files:** `backend/src/analytics/analytics.controller.ts` (extend)
- **Lines:** ~200
- **Changes:**
  - GET /analytics/peak-hours
  - GET /analytics/hourly-stats
  - GET /analytics/heatmap

#### Commit 12: Frontend API & Types
- **Files:**
  - `frontend/src/lib/api/analytics.ts`
  - `frontend/src/types/analytics.ts`
- **Lines:** ~200
- **Changes:**
  - API client và types cho analytics

#### Commit 13: Frontend Dashboard với Charts
- **Files:**
  - `frontend/src/app/admin/analytics/page.tsx`
  - `frontend/src/components/analytics/PeakHoursChart.tsx`
  - `frontend/src/components/analytics/HeatmapCalendar.tsx`
  - `frontend/src/components/analytics/HourlyStatsChart.tsx`
- **Lines:** ~1,800
- **Changes:**
  - Recharts integration
  - Heatmap calendar component
  - Line charts cho peak hours

---

### 4. Export Reports PDF/Excel (~2,000 dòng, 3 commits)

#### Commit 14: Backend PDF Service
- **Files:**
  - `backend/src/export/export.service.ts`
  - `backend/src/export/export.controller.ts`
  - `backend/src/export/export.module.ts`
- **Lines:** ~800
- **Changes:**
  - PDF generation với PDFKit
  - Export revenue reports, invoices
  - Template cho PDF

#### Commit 15: Backend Excel Service
- **Files:** `backend/src/export/export.service.ts` (extend)
- **Lines:** ~400
- **Changes:**
  - Excel export với xlsx library
  - Export reports, order lists

#### Commit 16: Frontend Export UI
- **Files:**
  - `frontend/src/lib/api/export.ts`
  - `frontend/src/components/export/ExportButton.tsx`
  - `frontend/src/app/admin/reports/export/page.tsx`
- **Lines:** ~800
- **Changes:**
  - Export buttons trong reports page
  - Download handlers

---

### 5. Advanced Search & Filters (~2,500 dòng, 3 commits)

#### Commit 17: Backend Advanced Search
- **Files:**
  - `backend/src/products/products.service.ts` (extend)
  - `backend/src/products/dto/advanced-search.dto.ts`
- **Lines:** ~600
- **Changes:**
  - Advanced query builder
  - Multi-filter support (price, allergens, dietary, rating, category)

#### Commit 18: Frontend Filter Components
- **Files:**
  - `frontend/src/components/search/AdvancedFilters.tsx`
  - `frontend/src/components/search/FilterSidebar.tsx`
  - `frontend/src/components/search/PriceRangeSlider.tsx`
- **Lines:** ~1,200
- **Changes:**
  - Filter UI components
  - Multi-select filters
  - Price range slider

#### Commit 19: Frontend Integration
- **Files:**
  - `frontend/src/app/menu/page.tsx` (extend)
  - `frontend/src/lib/api/products.ts` (extend)
- **Lines:** ~700
- **Changes:**
  - Integrate filters vào menu page
  - URL params cho filters
  - Filter state management

---

### 6. Real-time Notifications (~2,500 dòng, 4 commits)

#### Commit 20: Backend Notification Service
- **Files:**
  - `backend/src/notifications/notifications.service.ts`
  - `backend/src/notifications/notifications.controller.ts`
  - `backend/src/notifications/notifications.module.ts`
- **Lines:** ~600
- **Changes:**
  - Notification service
  - Email service integration
  - Notification queue

#### Commit 21: Web Push Backend
- **Files:**
  - `backend/src/notifications/push.service.ts`
  - `backend/src/notifications/notifications.gateway.ts`
- **Lines:** ~500
- **Changes:**
  - Web Push API support
  - Socket.IO notifications

#### Commit 22: Frontend Notification Service
- **Files:**
  - `frontend/src/lib/notifications/notification.service.ts`
  - `frontend/src/lib/notifications/push.service.ts`
- **Lines:** ~400
- **Changes:**
  - Browser notification API
  - Push subscription management

#### Commit 23: Frontend Notification UI
- **Files:**
  - `frontend/src/components/notifications/NotificationCenter.tsx`
  - `frontend/src/components/notifications/NotificationBell.tsx`
  - `frontend/src/app/admin/notifications/page.tsx`
- **Lines:** ~1,000
- **Changes:**
  - Notification center component
  - Bell icon với badge
  - Notification list

---

### 7. Customer Segmentation & CLV (~2,000 dòng, 3 commits)

#### Commit 24: Backend Segmentation Service
- **Files:**
  - `backend/src/analytics/segmentation.service.ts`
  - `backend/src/analytics/segmentation.controller.ts`
- **Lines:** ~700
- **Changes:**
  - Calculate CLV
  - Customer segmentation (VIP, Regular, New)
  - Segmentation rules

#### Commit 25: Database Schema
- **Files:** `backend/prisma/schema.prisma`, migration
- **Lines:** ~100
- **Changes:**
  - Thêm field `segment` vào User model
  - Thêm field `clv` vào User model

#### Commit 26: Frontend Segmentation UI
- **Files:**
  - `frontend/src/app/admin/customers/page.tsx`
  - `frontend/src/components/customers/CustomerSegmentCard.tsx`
  - `frontend/src/components/customers/CLVChart.tsx`
- **Lines:** ~1,200
- **Changes:**
  - Customer list với segments
  - CLV visualization
  - Segment badges

---

### 8. Dynamic Pricing (~1,500 dòng, 2 commits)

#### Commit 27: Backend Pricing Rules
- **Files:**
  - `backend/src/pricing/pricing.service.ts`
  - `backend/src/pricing/pricing.controller.ts`
  - `backend/src/pricing/pricing.module.ts`
  - `backend/src/pricing/dto/pricing-rule.dto.ts`
- **Lines:** ~800
- **Changes:**
  - Pricing rules service
  - Time-based pricing
  - Happy hour logic

#### Commit 28: Frontend Dynamic Pricing UI
- **Files:**
  - `frontend/src/app/admin/pricing/page.tsx`
  - `frontend/src/components/pricing/PricingRuleForm.tsx`
  - `frontend/src/components/products/PriceDisplay.tsx` (extend)
- **Lines:** ~700
- **Changes:**
  - Admin: Manage pricing rules
  - Customer: Show dynamic prices, happy hour badges

---

### 9. Order Queue Priority (~1,000 dòng, 2 commits)

#### Commit 29: Backend Priority System
- **Files:**
  - `backend/src/orders/orders.service.ts` (extend)
  - `backend/src/orders/dto/priority.dto.ts`
- **Lines:** ~500
- **Changes:**
  - Priority scoring algorithm
  - VIP customer boost
  - Large order boost
  - Wait time boost

#### Commit 30: Frontend Priority Display
- **Files:**
  - `frontend/src/app/kitchen/page.tsx` (extend)
  - `frontend/src/components/orders/PriorityBadge.tsx`
- **Lines:** ~500
- **Changes:**
  - Priority indicators trong KDS
  - Sort orders by priority
  - Visual priority cues

---

## 📝 Lưu Ý Implementation

### 1. Feature Flags
Mỗi module mới nên có feature flag để có thể bật/tắt:
```typescript
// backend/src/config/features.config.ts
export const FEATURES = {
  LOYALTY_POINTS: process.env.ENABLE_LOYALTY === 'true',
  INVENTORY: process.env.ENABLE_INVENTORY === 'true',
  // ...
};
```

### 2. Module Isolation
- Mỗi tính năng là module NestJS riêng
- Không modify existing services, chỉ extend hoặc inject
- Sử dụng decorators và interceptors để integrate

### 3. Database Migrations
- Mỗi migration là một commit riêng
- Không modify existing tables, chỉ thêm mới
- Backward compatible

### 4. Frontend Integration
- Thêm routes mới, không modify existing routes
- Components mới trong folders riêng
- Optional features có thể ẩn/hiện qua config

### 5. Testing Strategy
- Unit tests cho services (optional, không tính vào 20k dòng)
- Integration tests cho APIs (optional)
- Manual testing checklist cho mỗi feature

---

## 🚀 Thứ Tự Implementation

**Tuần 1:** Commits 1-10 (Loyalty + Inventory + Peak Hours backend)
**Tuần 2:** Commits 11-20 (Peak Hours frontend + Export + Search backend)
**Tuần 3:** Commits 21-30 (Notifications + Segmentation + Pricing + Priority)

---

## ✅ Checklist Trước Mỗi Commit

- [ ] Code không conflict với existing code
- [ ] Feature flag được setup
- [ ] Database migration tested
- [ ] API endpoints tested
- [ ] Frontend components render correctly
- [ ] No breaking changes
- [ ] Commit message rõ ràng

---

## 📊 Metrics Tracking

Sau khi hoàn thành, có thể track:
- Total lines added: ~22,000
- Total commits: 30
- New modules: 9
- New database tables: ~8
- New API endpoints: ~40
- New frontend pages: ~10
- New components: ~25

---

**Lưu ý:** Kế hoạch này có thể điều chỉnh tùy theo thời gian và độ ưu tiên. Mỗi tính năng đều độc lập và có thể implement riêng lẻ.
