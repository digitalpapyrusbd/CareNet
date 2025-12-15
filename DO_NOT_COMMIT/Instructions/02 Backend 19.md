# Backend Documentation 19 - Shop & E-commerce

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Modules**: Shop  
**Priority**: �� Medium

---

## 📋 Overview

The Shop & E-commerce System allows verified shops to **sell care-related products** (medical equipment, supplements, etc.) with inventory management, order processing, and delivery tracking.

### **Key Features**
- Shop registration and verification
- Product catalog management
- Inventory tracking
- Order processing
- Payment integration (bKash/Nagad)
- Delivery management
- Customer reviews
- Shop analytics

**Module Path**: `/backend/src/shop/`

---

## 📁 Module Structure

```
shop/
├── shop.module.ts                # Module configuration
├── services/
│   ├── shop.service.ts          # Shop management
│   ├── product.service.ts       # Product management
│   ├── order.service.ts         # Order processing
│   └── inventory.service.ts     # Inventory management
├── controllers/
│   ├── shop.controller.ts       # Shop endpoints
│   ├── product.controller.ts    # Product endpoints
│   └── order.controller.ts      # Order endpoints
└── dto/
    ├── create-shop.dto.ts
    ├── create-product.dto.ts
    └── create-order.dto.ts
```

---

## 🎯 Core Features

### **1. Register Shop**

```typescript
POST /api/shop/register
Authorization: Bearer {accessToken}

Request Body:
{
  "shopName": "HealthCare Supplies BD",
  "description": "Medical equipment and healthcare products",
  "category": "MEDICAL_EQUIPMENT" | "SUPPLEMENTS" | "MOBILITY_AIDS" | "PERSONAL_CARE" | "OTHER",
  "address": {
    "street": "123 Main Road",
    "city": "Dhaka",
    "state": "Dhaka Division",
    "postalCode": "1200",
    "country": "Bangladesh"
  },
  "contactPhone": "+8801712345678",
  "contactEmail": "shop@example.com",
  "tradeLicense": "file-upload",
  "bankDetails": {
    "accountName": "HealthCare Supplies",
    "accountNumber": "1234567890",
    "bankName": "Dutch Bangla Bank",
    "routingNumber": "090260571"
  }
}

Response:
{
  "success": true,
  "message": "Shop registered successfully. Pending verification.",
  "data": {
    "id": "shop-uuid",
    "shopName": "HealthCare Supplies BD",
    "status": "PENDING_VERIFICATION",
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

---

### **2. Create Product**

```typescript
POST /api/shop/products
Authorization: Bearer {accessToken}
Role: SHOP_OWNER

Request Body:
{
  "name": "Digital Blood Pressure Monitor",
  "description": "Automatic digital BP monitor with large LCD display",
  "category": "MEDICAL_EQUIPMENT",
  "price": 2500,
  "compareAtPrice": 3000,        // Original price for discount display
  "stockQuantity": 50,
  "lowStockThreshold": 10,
  "sku": "BP-MON-001",
  "images": ["image1.jpg", "image2.jpg"],
  "specifications": {
    "brand": "Omron",
    "model": "HEM-7120",
    "warranty": "1 year"
  },
  "tags": ["blood pressure", "medical", "monitor"]
}

Response:
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "product-uuid",
    "name": "Digital Blood Pressure Monitor",
    "slug": "digital-blood-pressure-monitor",
    "price": 2500,
    "stockQuantity": 50,
    "status": "ACTIVE",
    "createdAt": "2025-12-11T10:30:00Z"
  }
}
```

---

### **3. Browse Products**

```typescript
GET /api/shop/products
Authorization: Optional

Query Parameters:
- category: string
- minPrice: number
- maxPrice: number
- search: string
- shopId: string
- sort: "PRICE_LOW" | "PRICE_HIGH" | "NEWEST" | "POPULAR"
- page: number
- limit: number

Response:
{
  "success": true,
  "data": [
    {
      "id": "product-uuid",
      "name": "Digital Blood Pressure Monitor",
      "slug": "digital-blood-pressure-monitor",
      "description": "Automatic digital BP monitor...",
      "price": 2500,
      "compareAtPrice": 3000,
      "discount": "17% off",
      "images": ["https://r2.com/products/image1.jpg"],
      "shop": {
        "id": "shop-uuid",
        "name": "HealthCare Supplies BD",
        "rating": 4.8
      },
      "stockStatus": "IN_STOCK",
      "rating": 4.5,
      "reviewCount": 28
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156
  }
}
```

---

### **4. Create Order**

```typescript
POST /api/shop/orders
Authorization: Bearer {accessToken}

Request Body:
{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "price": 2500
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1,
      "price": 1500
    }
  ],
  "shippingAddress": {
    "name": "Ahmed Hassan",
    "phone": "+8801712345678",
    "street": "456 Secondary Road",
    "city": "Dhaka",
    "postalCode": "1207"
  },
  "paymentMethod": "BKASH" | "NAGAD" | "COD",
  "specialInstructions": "Please call before delivery"
}

Response:
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-2025-00123",
    "items": [
      {
        "product": {
          "name": "Digital Blood Pressure Monitor",
          "image": "https://..."
        },
        "quantity": 2,
        "price": 2500,
        "subtotal": 5000
      }
    ],
    "subtotal": 6500,
    "shippingFee": 100,
    "total": 6600,
    "status": "PENDING_PAYMENT",
    "paymentMethod": "BKASH",
    "createdAt": "2025-12-11T11:00:00Z"
  }
}
```

---

### **5. Get My Orders**

```typescript
GET /api/shop/orders/my-orders
Authorization: Bearer {accessToken}

Query Parameters:
- status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
- page: number
- limit: number

Response:
{
  "success": true,
  "data": [
    {
      "id": "order-uuid",
      "orderNumber": "ORD-2025-00123",
      "items": [
        {
          "product": {...},
          "quantity": 2,
          "price": 2500
        }
      ],
      "total": 6600,
      "status": "SHIPPED",
      "paymentStatus": "PAID",
      "trackingNumber": "TRK123456789",
      "estimatedDelivery": "2025-12-15",
      "createdAt": "2025-12-11T11:00:00Z"
    }
  ]
}
```

---

### **6. Update Order Status (Shop Owner)**

```typescript
PATCH /api/shop/orders/:orderId/status
Authorization: Bearer {accessToken}
Role: SHOP_OWNER

Request Body:
{
  "status": "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  "trackingNumber": "TRK123456789",    // Required for SHIPPED
  "notes": "Package handed to courier"
}

Response:
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "orderId": "order-uuid",
    "status": "SHIPPED",
    "trackingNumber": "TRK123456789",
    "updatedAt": "2025-12-12T10:00:00Z"
  }
}

// Automatic notifications sent to customer on status change
```

---

### **7. Submit Product Review**

```typescript
POST /api/shop/products/:productId/reviews
Authorization: Bearer {accessToken}

Request Body:
{
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Works perfectly. Highly recommended.",
  "images": ["review1.jpg"]    // Optional
}

Response:
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": "review-uuid",
    "productId": "product-uuid",
    "rating": 5,
    "title": "Excellent product!",
    "comment": "Works perfectly. Highly recommended.",
    "createdAt": "2025-12-13T10:00:00Z"
  }
}

// Only users who purchased the product can review
```

---

### **8. Shop Analytics (Shop Owner)**

```typescript
GET /api/shop/analytics
Authorization: Bearer {accessToken}
Role: SHOP_OWNER

Query Parameters:
- startDate: date
- endDate: date

Response:
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 125000,
      "totalOrders": 78,
      "averageOrderValue": 1602,
      "totalProducts": 45,
      "lowStockProducts": 5
    },
    "topSellingProducts": [
      {
        "productId": "product-uuid",
        "name": "Digital Blood Pressure Monitor",
        "unitsSold": 24,
        "revenue": 60000
      }
    ],
    "revenueByDay": [
      {
        "date": "2025-12-01",
        "revenue": 12000,
        "orders": 8
      }
    ],
    "orderStatusBreakdown": {
      "pending": 5,
      "processing": 12,
      "shipped": 8,
      "delivered": 50,
      "cancelled": 3
    }
  }
}
```

---

## 📊 Database Schema

```prisma
model Shop {
  id                  String      @id @default(uuid())
  ownerId             String
  
  shopName            String
  slug                String      @unique
  description         String
  category            String
  
  logo                String?
  banner              String?
  
  address             Json
  contactPhone        String
  contactEmail        String
  
  tradeLicense        String
  bankDetails         Json
  
  status              ShopStatus  @default(PENDING_VERIFICATION)
  rating              Float       @default(0)
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  owner               User        @relation(fields: [ownerId], references: [id])
  products            Product[]
  orders              Order[]
}

model Product {
  id                  String          @id @default(uuid())
  shopId              String
  
  name                String
  slug                String          @unique
  description         String
  category            String
  
  price               Int
  compareAtPrice      Int?
  
  stockQuantity       Int
  lowStockThreshold   Int             @default(10)
  sku                 String          @unique
  
  images              String[]        @default([])
  specifications      Json?
  tags                String[]        @default([])
  
  status              ProductStatus   @default(ACTIVE)
  rating              Float           @default(0)
  
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt
  
  shop                Shop            @relation(fields: [shopId], references: [id])
  orderItems          OrderItem[]
  reviews             ProductReview[]
}

model Order {
  id                  String          @id @default(uuid())
  orderNumber         String          @unique
  
  shopId              String
  customerId          String
  
  subtotal            Int
  shippingFee         Int
  total               Int
  
  shippingAddress     Json
  paymentMethod       String
  
  status              OrderStatus     @default(PENDING_PAYMENT)
  paymentStatus       PaymentStatus   @default(PENDING)
  
  trackingNumber      String?
  specialInstructions String?
  
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt
  
  shop                Shop            @relation(fields: [shopId], references: [id])
  customer            User            @relation(fields: [customerId], references: [id])
  items               OrderItem[]
}

model OrderItem {
  id                  String      @id @default(uuid())
  orderId             String
  productId           String
  
  quantity            Int
  price               Int
  subtotal            Int
  
  order               Order       @relation(fields: [orderId], references: [id])
  product             Product     @relation(fields: [productId], references: [id])
}

model ProductReview {
  id                  String      @id @default(uuid())
  productId           String
  customerId          String
  orderId             String?
  
  rating              Int
  title               String?
  comment             String
  images              String[]    @default([])
  
  createdAt           DateTime    @default(now())
  
  product             Product     @relation(fields: [productId], references: [id])
  customer            User        @relation(fields: [customerId], references: [id])
}

enum ShopStatus {
  PENDING_VERIFICATION
  ACTIVE
  SUSPENDED
  REJECTED
}

enum ProductStatus {
  ACTIVE
  OUT_OF_STOCK
  DISCONTINUED
}

enum OrderStatus {
  PENDING_PAYMENT
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

---

## 🧪 Testing

```typescript
describe('ShopService', () => {
  it('should register shop');
  it('should create product');
  it('should browse products');
  it('should create order');
  it('should process payment');
  it('should update order status');
  it('should submit review');
  it('should get shop analytics');
});
```

---

## 🔧 Environment Variables

```env
# No specific environment variables
# Uses shared JWT, Database, Payment, and File Upload configs
```

---

## 📚 Related Documentation

- [02 Backend 11.md](02%20Backend%2011.md) - Payment Processing
- [02 Backend 15.md](02%20Backend%2015.md) - Notification System

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
