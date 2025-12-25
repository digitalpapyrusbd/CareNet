# 🏪 Manual Testing - Shop Manager Entity (Complete Guide)

**Date Created:** December 25, 2025  
**Entity:** Shop Manager (Shop Employee)  
**Testing Scope:** Order processing, inventory management, customer service  
**Estimated Time:** 1 hour  
**Prerequisites:** Development server running, database seeded with test data  

---

## 🏪 SHOP MANAGER USER ROLE & CAPABILITIES

### Role Definition
**Shop Manager** is a shop employee with limited access to manage daily operations.

| Property | Value |
|----------|-------|
| **Role Name** | SHOP_MANAGER |
| **Authority Level** | Level 3 (Employee) |
| **Core Function** | Process orders, manage inventory, customer service |
| **Access Level** | Operational access (no billing/analytics) |
| **MFA Requirement** | Optional |

### Shop Manager Permissions Overview

| Category | Permissions |
|----------|-------------|
| **Dashboard** | ✅ View manager dashboard |
| **Products** | 👁️ View only (cannot add/delete) |
| **Orders** | ✅ View and process orders |
| **Inventory** | ✅ Update stock levels |
| **Messages** | ✅ Respond to customer inquiries |
| **Analytics** | ❌ No access |
| **Billing** | ❌ No access |
| **Settings** | ❌ No access |

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
  - [ ] Shop Manager account exists
  - [ ] Associated with a shop
  - [ ] Orders available for processing

### Test Shop Manager Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345602` |
| **Email** | `shopmanager@carenet.com` |
| **Password** | `ShopMgr@123` |
| **Role** | SHOP_MANAGER |
| **Name** | Rahim Ahmed |
| **Associated Shop** | MediCare Supplies |
| **Is Active** | Yes |

---

## ✅ TEST EXECUTION PLAN

---

## Phase 1: Authentication & Access Control (15 minutes)

### SM1.1 - Shop Manager Login
**Objective:** Verify shop manager can login  
**URL:** `http://localhost:3000/shop-manager/login`

**Steps:**
1. Navigate to shop manager login
2. Enter credentials:
   - Phone: `+8801712345602`
   - Password: `ShopMgr@123`
3. Click "Login"

**Expected Outcome:**
- ✅ Login succeeds
- ✅ Redirects to manager dashboard
- ✅ Session created

---

### SM1.2 - Dashboard Access
**Objective:** Verify manager dashboard loads  
**URL:** `http://localhost:3000/shop-manager/dashboard`

**Dashboard Elements:**
- [ ] Welcome message
- [ ] Today's orders count
- [ ] Pending orders count
- [ ] Low stock alerts
- [ ] Quick action buttons

**Quick Actions:**
- [ ] View Orders
- [ ] Update Inventory
- [ ] Customer Messages

**Expected Outcome:**
- ✅ Dashboard loads
- ✅ Relevant data displays

---

### SM1.3 - Access Restrictions
**Objective:** Verify manager cannot access admin-only pages

**Restricted Routes:**

1. Try `/shop/products/new`
   - [ ] Should show 403 or redirect
   - [ ] Cannot add products

2. Try `/shop/analytics`
   - [ ] Should show 403 or redirect
   - [ ] No analytics access

3. Try `/shop/billing`
   - [ ] Should show 403 or redirect
   - [ ] No billing access

**Expected Outcome:**
- ✅ Cannot access restricted pages
- ✅ Clear error messages

---

## Phase 2: Order Management (20 minutes)

### SM2.1 - View Orders
**Objective:** Verify order listing access  
**URL:** `http://localhost:3000/shop-manager/orders`

**Page Elements:**
- [ ] Order list
- [ ] Filter by status
- [ ] Search by order ID
- [ ] Date range filter

**Order Card:**
- [ ] Order ID
- [ ] Customer name
- [ ] Order date
- [ ] Total amount
- [ ] Status
- [ ] "Process" button

**Test Actions:**
1. View all orders
2. Filter by "New" orders
3. Search for specific order

**Expected Outcome:**
- ✅ Orders display
- ✅ Filters work

---

### SM2.2 - Process Order
**Objective:** Verify order processing  
**URL:** `http://localhost:3000/shop-manager/orders/[id]`

**Order Details View:**
- [ ] Customer information
- [ ] Order items
- [ ] Delivery address
- [ ] Total amount
- [ ] Current status

**Processing Actions:**
- [ ] Mark as Processing
- [ ] Mark as Ready
- [ ] Mark as Shipped
- [ ] Print packing slip
- [ ] Add tracking number

**Test Actions:**
1. Open a "New" order
2. Click "Start Processing"
3. Review items
4. Mark as "Ready for Pickup" or "Shipped"
5. Add notes if needed

**Expected Outcome:**
- ✅ Can process orders
- ✅ Status updates
- ✅ Customer notified

---

### SM2.3 - Order History
**Objective:** Verify completed orders view

**Test Actions:**
1. View completed orders
2. Filter by date range
3. View order details

**Expected Outcome:**
- ✅ History accessible
- ✅ Details viewable

---

## Phase 3: Inventory Management (15 minutes)

### SM3.1 - View Inventory
**Objective:** Verify inventory access  
**URL:** `http://localhost:3000/shop-manager/inventory`

**Inventory List:**
- [ ] Product name
- [ ] SKU
- [ ] Current stock
- [ ] Low stock indicator
- [ ] "Update Stock" button

**Filters:**
- [ ] All products
- [ ] Low stock only
- [ ] Out of stock

**Test Actions:**
1. View inventory list
2. Filter by low stock
3. Identify items needing restock

**Expected Outcome:**
- ✅ Inventory displays
- ✅ Stock levels accurate

---

### SM3.2 - Update Stock
**Objective:** Verify stock update capability

**Stock Update Form:**
- [ ] Current stock display
- [ ] Adjustment type (Add/Remove)
- [ ] Quantity input
- [ ] Reason dropdown/input
- [ ] Submit button

**Test Actions:**
1. Select a product
2. Click "Update Stock"
3. Add stock: +10 units
4. Select reason: "Restock from supplier"
5. Submit

**Expected Outcome:**
- ✅ Stock updates
- ✅ Change recorded

---

### SM3.3 - Low Stock Alerts
**Objective:** Verify alert visibility

**Alerts Page:**
- [ ] List of low stock items
- [ ] Current quantity
- [ ] Threshold
- [ ] Reorder suggestion

**Expected Outcome:**
- ✅ Alerts visible
- ✅ Clear action needed

---

## Phase 4: Customer Service (15 minutes)

### SM4.1 - Customer Messages
**Objective:** Verify message handling  
**URL:** `http://localhost:3000/shop-manager/messages`

**Message List:**
- [ ] Customer inquiries
- [ ] Unread indicators
- [ ] Order-related questions
- [ ] Product inquiries

**Message View:**
- [ ] Customer name
- [ ] Related order (if any)
- [ ] Message content
- [ ] Reply textarea
- [ ] Send button

**Test Actions:**
1. View unread messages
2. Open a customer inquiry
3. Type response
4. Send reply

**Expected Outcome:**
- ✅ Can view messages
- ✅ Can reply
- ✅ Reply sent successfully

---

### SM4.2 - Order Support
**Objective:** Verify order-related support

**When customer asks about order:**
1. View related order details
2. Check order status
3. Provide update to customer
4. Link conversation to order

**Expected Outcome:**
- ✅ Order details accessible from message
- ✅ Can provide status update

---

## Phase 5: Product Information (10 minutes)

### SM5.1 - View Products (Read-Only)
**Objective:** Verify read-only product access  
**URL:** `http://localhost:3000/shop-manager/products`

**Product View:**
- [ ] Product list displays
- [ ] Product details viewable
- [ ] NO "Add Product" button
- [ ] NO "Edit" button
- [ ] NO "Delete" button

**Test Actions:**
1. View product list
2. Click on a product
3. Verify read-only access
4. Confirm cannot modify

**Expected Outcome:**
- ✅ Products viewable
- ✅ No edit options available

---

## Phase 6: Daily Operations (10 minutes)

### SM6.1 - Daily Summary
**Objective:** Verify daily operations view

**Dashboard Data:**
- [ ] Orders processed today
- [ ] Items shipped today
- [ ] Pending orders count
- [ ] Customer messages pending

**Expected Outcome:**
- ✅ Summary accurate
- ✅ Data current

---

### SM6.2 - Shift Handoff
**Objective:** Verify notes for shift changes

**Features:**
- [ ] Add shift notes
- [ ] View previous shift notes
- [ ] Pending items list

**Test Actions:**
1. Add note: "Order #123 waiting for customer callback"
2. Save note
3. Verify note visible

**Expected Outcome:**
- ✅ Notes saved
- ✅ Visible to next shift

---

## Phase 7: Edge Cases (10 minutes)

### SM7.1 - Session Handling
**Objective:** Verify session management

**Test Actions:**
1. Login as manager
2. Refresh page
3. Navigate between pages
4. Session should persist

**Expected Outcome:**
- ✅ Session persists
- ✅ No re-login required

---

### SM7.2 - No Orders State
**Objective:** Verify empty state handling

**When no orders:**
- [ ] Displays "No orders" message
- [ ] No errors
- [ ] Clear UI

**Expected Outcome:**
- ✅ Empty state handled gracefully

---

## 📊 TEST SUMMARY

### Quick Reference - URLs

| Page | URL |
|------|-----|
| Login | `/shop-manager/login` |
| Dashboard | `/shop-manager/dashboard` |
| Orders | `/shop-manager/orders` |
| Order Detail | `/shop-manager/orders/[id]` |
| Inventory | `/shop-manager/inventory` |
| Messages | `/shop-manager/messages` |
| Products (Read-only) | `/shop-manager/products` |

### Permission Summary

| Feature | Shop Admin | Shop Manager |
|---------|------------|--------------|
| Add Products | ✅ | ❌ |
| Edit Products | ✅ | ❌ |
| Delete Products | ✅ | ❌ |
| View Products | ✅ | ✅ (Read-only) |
| Process Orders | ✅ | ✅ |
| Update Inventory | ✅ | ✅ |
| View Analytics | ✅ | ❌ |
| View Billing | ✅ | ❌ |
| Customer Messages | ✅ | ✅ |

### Test Counts

| Phase | Test Cases | Est. Time |
|-------|------------|-----------|
| Authentication | 3 | 15 min |
| Order Management | 3 | 20 min |
| Inventory | 3 | 15 min |
| Customer Service | 2 | 15 min |
| Product View | 1 | 10 min |
| Daily Operations | 2 | 10 min |
| Edge Cases | 2 | 10 min |
| **Total** | **16** | **~1.5 hours** |

---

## ✅ SIGN-OFF

| Tester | Date | Total Passed | Total Failed | Notes |
|--------|------|--------------|--------------|-------|
| _______ | _______ | ___/16 | ___/16 | _______ |

