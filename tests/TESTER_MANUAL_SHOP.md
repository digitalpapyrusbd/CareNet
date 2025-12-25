# 🏪 Manual Testing - Shop Entity (Complete Guide)

**Date Created:** December 25, 2025  
**Entity:** Shop Admin (Medical Supply Shop)  
**Testing Scope:** Registration, products, orders, inventory, billing  
**Estimated Time:** 1-1.5 hours  
**Prerequisites:** Development server running, database seeded with test data  

---

## 🏪 SHOP USER ROLE & CAPABILITIES

### Role Definition
**Shop Admin** manages a medical supply shop on the CareNet marketplace.

| Property | Value |
|----------|-------|
| **Role Name** | SHOP |
| **Authority Level** | Level 4 (Merchant) |
| **Core Function** | Manage products, process orders, track inventory |
| **Access Level** | Full shop operations |
| **MFA Requirement** | Optional |

### Shop Admin Permissions Overview

| Category | Permissions |
|----------|-------------|
| **Profile** | ✅ Create, read, update shop profile |
| **Products** | ✅ Add, edit, delete products |
| **Orders** | ✅ View orders, update status, process |
| **Inventory** | ✅ Manage stock levels |
| **Analytics** | ✅ View sales analytics |
| **Billing** | ✅ View platform fees, transactions |
| **Messages** | ✅ Respond to customer inquiries |

---

## 🚀 SETUP & PREREQUISITES

### Test Environment Checklist

- [ ] **Development Server Running**
  - [ ] Next.js app: `npm run dev` (port 3000)
  - [ ] Backend/API available
  - [ ] Database connected and seeded

- [ ] **Browser & Tools**
  - [ ] Modern browser
  - [ ] DevTools available

- [ ] **Test Data**
  - [ ] Shop account (or will register)
  - [ ] Sample products

### Test Shop Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345601` |
| **Email** | `shop@carenet.com` |
| **Password** | `Shop@123` |
| **Role** | SHOP |
| **Shop Name** | MediCare Supplies |
| **Is Active** | Yes |
| **Verification Status** | VERIFIED |

---

## ✅ TEST EXECUTION PLAN

---

## Phase 1: Registration (20 minutes)

### S1.1 - Shop Registration
**Objective:** Verify shop registration process  
**URL:** `http://localhost:3000/shop/registration`

**Registration Form:**

**Shop Details:**
- [ ] **Shop Name** (required)
  - Enter: "Test Medical Supplies"

- [ ] **Owner Name** (required)
  - Enter: "Karim Rahman"

- [ ] **Email** (required)
  - Enter: "testshop@email.com"

- [ ] **Phone** (required)
  - Enter: "01712345678"

- [ ] **Business License Number** (required)
  - Enter: "BL-2024-123456"

**Address:**
- [ ] **Shop Address** (required)
  - Enter: "Shop 45, Gulshan Market, Dhaka"

- [ ] **City** (required)
  - Enter: "Dhaka"

- [ ] **Postal Code**
  - Enter: "1212"

**Product Categories:**
- [ ] Multi-select categories:
  - Select: "Medical Equipment"
  - Select: "Medications"
  - Select: "Mobility Aids"

**Description:**
- [ ] **Shop Description** (optional)
  - Enter: "Quality medical supplies and equipment"

**Logo Upload:**
- [ ] Upload shop logo image

**Validation Tests:**
1. Empty required fields
   - [ ] Error messages appear

2. Invalid email
   - [ ] Error: "Invalid email format"

3. Submit with all valid data
   - [ ] Success message
   - [ ] Redirects to pending verification

**Expected Outcome:**
- ✅ Registration form works
- ✅ All validations pass
- ✅ Application submitted

---

### S1.2 - Pending Verification
**Objective:** Verify pending page  
**URL:** `http://localhost:3000/shop/pending-verification`

**Page Elements:**
- [ ] Status message: "Application Under Review"
- [ ] Review time estimate (24-48 hours)
- [ ] Submitted details summary
- [ ] Contact support link
- [ ] Check status button

**Expected Outcome:**
- ✅ Clear status display
- ✅ Can check status

---

## Phase 2: Authentication (10 minutes)

### S2.1 - Shop Login
**Objective:** Verify shop can login  
**URL:** `http://localhost:3000/shop/login`

**Steps:**
1. Enter phone: `+8801712345601`
2. Enter password: `Shop@123`
3. Click "Login"

**Expected Outcome:**
- ✅ Login succeeds
- ✅ Redirects to dashboard

---

### S2.2 - Shop Dashboard
**Objective:** Verify dashboard displays  
**URL:** `http://localhost:3000/shop/dashboard`

**Dashboard Elements:**

**Stats Cards:**
- [ ] Today's Sales (৳ amount)
- [ ] Total Orders (count)
- [ ] Pending Orders (count)
- [ ] Low Stock Alerts (count)

**Quick Actions:**
- [ ] Add New Product
- [ ] View Orders
- [ ] Manage Inventory

**Recent Orders:**
- [ ] Order list preview
- [ ] Order ID, customer, amount, status

**Low Stock Alert:**
- [ ] Products with low stock
- [ ] Restock links

**Expected Outcome:**
- ✅ All sections render
- ✅ Data accurate

---

## Phase 3: Product Management (25 minutes)

### S3.1 - Product List
**Objective:** Verify product listing  
**URL:** `http://localhost:3000/shop/products`

**Page Elements:**
- [ ] Page title: "Products"
- [ ] "Add New Product" button
- [ ] Product list/grid
- [ ] Search bar
- [ ] Filter by category
- [ ] Filter by status (Active/Inactive/Out of Stock)

**Product Card:**
- [ ] Product image
- [ ] Product name
- [ ] Price
- [ ] Stock quantity
- [ ] Category
- [ ] Status badge
- [ ] Edit/Delete buttons

**Test Actions:**
1. View product list
2. Search for a product
3. Filter by category

**Expected Outcome:**
- ✅ Products display
- ✅ Search works
- ✅ Filters work

---

### S3.2 - Add New Product
**Objective:** Verify product creation  
**URL:** `http://localhost:3000/shop/products/new`

**Product Form:**

**Basic Info:**
- [ ] **Product Name** (required)
  - Enter: "Digital Blood Pressure Monitor"

- [ ] **Description** (required)
  - Enter: "Automatic digital BP monitor with LCD display"

- [ ] **Category** (required)
  - Select: "Medical Equipment"

- [ ] **Sub-category** (if available)
  - Select: "Diagnostic Tools"

**Pricing:**
- [ ] **Price** (required)
  - Enter: ৳2,500

- [ ] **Sale Price** (optional)
  - Enter: ৳2,200

- [ ] **Cost Price** (for profit tracking)
  - Enter: ৳1,800

**Inventory:**
- [ ] **Stock Quantity** (required)
  - Enter: 50

- [ ] **SKU** (optional)
  - Enter: "BP-MON-001"

- [ ] **Low Stock Alert** (threshold)
  - Enter: 10

**Images:**
- [ ] Product image upload (multiple)
- [ ] Primary image selection

**Specifications:**
- [ ] Brand
  - Enter: "Omron"
- [ ] Model
  - Enter: "HEM-7120"
- [ ] Features (list)
  - Add: "One-touch operation"
  - Add: "Memory for 30 readings"

**Shipping:**
- [ ] Weight (kg)
  - Enter: 0.5
- [ ] Dimensions (optional)

**Status:**
- [ ] Active / Inactive toggle

**Submit:**
1. Fill all required fields
2. Upload product images
3. Click "Add Product"
4. Verify:
   - [ ] Success message
   - [ ] Product appears in list

**Expected Outcome:**
- ✅ Product created
- ✅ All data saved

---

### S3.3 - Edit Product
**Objective:** Verify product editing  
**URL:** `http://localhost:3000/shop/products/[id]`

**Test Actions:**
1. Click "Edit" on a product
2. Change price: ৳2,500 → ৳2,400
3. Update stock: 50 → 45
4. Save changes

**Expected Outcome:**
- ✅ Edit form loads with data
- ✅ Changes save
- ✅ Updates reflected in list

---

### S3.4 - Delete Product
**Objective:** Verify product deletion

**Test Actions:**
1. Click "Delete" on a product
2. Confirm deletion dialog
3. Confirm delete

**Expected Outcome:**
- ✅ Confirmation required
- ✅ Product removed from list

---

## Phase 4: Order Management (20 minutes)

### S4.1 - Order List
**Objective:** Verify order listing  
**URL:** `http://localhost:3000/shop/orders`

**Page Elements:**
- [ ] Page title: "Orders"
- [ ] Order list
- [ ] Filter by status: New, Processing, Shipped, Delivered, Cancelled
- [ ] Date range filter
- [ ] Search by order ID

**Order Card:**
- [ ] Order ID
- [ ] Customer name
- [ ] Order date
- [ ] Total amount
- [ ] Status badge
- [ ] "View Details" button

**Test Actions:**
1. View all orders
2. Filter by "New" orders
3. Search by order ID

**Expected Outcome:**
- ✅ Orders display
- ✅ Filters work

---

### S4.2 - Order Details
**Objective:** Verify order detail view  
**URL:** `http://localhost:3000/shop/orders/[id]`

**Order Information:**

**Customer Details:**
- [ ] Name
- [ ] Phone
- [ ] Delivery address

**Order Items:**
- [ ] Product name
- [ ] Quantity
- [ ] Unit price
- [ ] Subtotal

**Pricing Summary:**
- [ ] Subtotal
- [ ] Delivery fee
- [ ] Discount (if any)
- [ ] Total

**Order Timeline:**
- [ ] Order placed time
- [ ] Payment status
- [ ] Processing status
- [ ] Shipping status

**Actions:**
- [ ] Update status button
- [ ] Print invoice
- [ ] Contact customer

**Expected Outcome:**
- ✅ All details visible
- ✅ Actions work

---

### S4.3 - Update Order Status
**Objective:** Verify status update  
**URL:** `http://localhost:3000/shop/orders/[id]/update-status`

**Status Options:**
- [ ] Processing
- [ ] Ready for Pickup
- [ ] Shipped
- [ ] Delivered
- [ ] Cancelled

**Test Actions:**
1. Select order with "New" status
2. Click "Update Status"
3. Change to "Processing"
4. Add note: "Preparing order"
5. Save

**Expected Outcome:**
- ✅ Status updates
- ✅ Customer notified
- ✅ Timeline updated

---

## Phase 5: Inventory Management (10 minutes)

### S5.1 - Stock Management
**Objective:** Verify inventory tracking

**From Product List:**
1. View stock levels
2. Identify low stock items
3. Update stock quantity

**Low Stock Alerts:**
- [ ] List of products below threshold
- [ ] Quick restock option

**Stock Update:**
1. Click on product
2. Update stock: +20 units
3. Add reason: "Restocked from supplier"
4. Save

**Expected Outcome:**
- ✅ Stock levels accurate
- ✅ Can update stock
- ✅ History tracked

---

## Phase 6: Analytics (10 minutes)

### S6.1 - Sales Analytics
**Objective:** Verify analytics dashboard  
**URL:** `http://localhost:3000/shop/analytics`

**Analytics Sections:**

**Revenue Overview:**
- [ ] Total revenue (this month)
- [ ] Growth percentage
- [ ] Revenue chart (daily/weekly)

**Order Statistics:**
- [ ] Total orders
- [ ] Average order value
- [ ] Order status breakdown

**Top Products:**
- [ ] Best selling products
- [ ] Units sold
- [ ] Revenue per product

**Date Range:**
- [ ] Last 7 days
- [ ] Last 30 days
- [ ] Custom range

**Expected Outcome:**
- ✅ Charts render
- ✅ Data accurate
- ✅ Filters work

---

## Phase 7: Billing (10 minutes)

### S7.1 - Billing Dashboard
**Objective:** Verify billing information  
**URL:** `http://localhost:3000/shop/billing`

**Billing Overview:**
- [ ] Total earnings
- [ ] Platform fees deducted
- [ ] Pending payout
- [ ] Payout history

**Transaction List:**
- [ ] Transaction ID
- [ ] Date
- [ ] Amount
- [ ] Type (Sale/Fee/Payout)
- [ ] Status

**Invoice Download:**
- [ ] Download monthly statement

**Expected Outcome:**
- ✅ Billing info accurate
- ✅ Transactions visible

---

## Phase 8: Messages (10 minutes)

### S8.1 - Customer Messages
**Objective:** Verify messaging system  
**URL:** `http://localhost:3000/shop/messages`

**Features:**
- [ ] Customer inquiry list
- [ ] Unread indicators
- [ ] Reply functionality

**Test Actions:**
1. View customer messages
2. Open a message
3. Send reply
4. Verify sent

**Expected Outcome:**
- ✅ Messages display
- ✅ Can reply

---

## Phase 9: Payment Warnings (10 minutes)

### S9.1 - Payment Reminder
**Objective:** Verify payment reminder page  
**URL:** `http://localhost:3000/shop/payment-reminder`

**Page Shows:**
- [ ] Outstanding platform fees
- [ ] Due date
- [ ] Pay now button

---

### S9.2 - Payment Warning
**Objective:** Verify warning page  
**URL:** `http://localhost:3000/shop/payment-warning`

**Page Shows:**
- [ ] Warning message
- [ ] Amount due
- [ ] Consequences
- [ ] Pay now button

---

### S9.3 - Account Locked
**Objective:** Verify locked state  
**URL:** `http://localhost:3000/shop/account-locked`

**Page Shows:**
- [ ] Locked message
- [ ] Payment required to unlock
- [ ] Contact support

---

## 📊 TEST SUMMARY

### Quick Reference - URLs

| Page | URL |
|------|-----|
| Registration | `/shop/registration` |
| Pending Verification | `/shop/pending-verification` |
| Login | `/shop/login` |
| Dashboard | `/shop/dashboard` |
| Products | `/shop/products` |
| Add Product | `/shop/products/new` |
| Product Detail | `/shop/products/[id]` |
| Orders | `/shop/orders` |
| Order Detail | `/shop/orders/[id]` |
| Analytics | `/shop/analytics` |
| Billing | `/shop/billing` |
| Messages | `/shop/messages` |

### Test Counts

| Phase | Test Cases | Est. Time |
|-------|------------|-----------|
| Registration | 2 | 20 min |
| Authentication | 2 | 10 min |
| Products | 4 | 25 min |
| Orders | 3 | 20 min |
| Inventory | 1 | 10 min |
| Analytics | 1 | 10 min |
| Billing | 1 | 10 min |
| Messages | 1 | 10 min |
| Payment Warnings | 3 | 10 min |
| **Total** | **18** | **~2 hours** |

---

## ✅ SIGN-OFF

| Tester | Date | Total Passed | Total Failed | Notes |
|--------|------|--------------|--------------|-------|
| _______ | _______ | ___/18 | ___/18 | _______ |

