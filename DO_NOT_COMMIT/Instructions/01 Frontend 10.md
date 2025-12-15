# Frontend 10: Shop Portal Implementation

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [02: Auth](01%20Frontend%2002.md) | [03: Admin Portal](01%20Frontend%2003.md)

---

## 📋 Table of Contents

1. [Shop Portal Overview](#shop-portal-overview)
2. [Registration & Verification](#registration--verification)
3. [Dashboard](#dashboard)
4. [Product Management](#product-management)
5. [Order Processing](#order-processing)
6. [Inventory Management](#inventory-management)
7. [Analytics & Reports](#analytics--reports)
8. [Customer Support](#customer-support)
9. [Billing & Payments](#billing--payments)
10. [Shop Settings](#shop-settings)
11. [Debugging Guide](#debugging-guide)
12. [Testing Guide](#testing-guide)
13. [Testing Progress Log](#testing-progress-log)

---

## 🏠 Shop Portal Overview

### **Purpose**
The Shop Portal enables medical supply shops to:
- ✅ Register and get verified by admin
- ✅ Manage product catalog (add, edit, delete)
- ✅ Process orders from customers
- ✅ Track inventory and stock levels
- ✅ View analytics and sales reports
- ✅ Handle customer inquiries
- ✅ Manage billing and platform fees

### **Access Control**
- **Role Required**: `SHOP` or `SHOP_MANAGER`
- **Verification**: Admin verification required after registration
- **MFA**: Optional
- **Features**: 16 pages, 29 components

### **Shop Portal Routes**

```
/shop/
├── registration                 # Shop registration
├── pending-verification         # Waiting for admin verification
├── dashboard                    # Main dashboard
├── products/                    # Product management
│   ├── page                     # Product list
│   ├── new                      # Add product
│   └── [id]                     # Product details/edit
├── orders/                      # Order management
│   ├── page                     # Order list
│   ├── [id]                     # Order details
│   └── [id]/update-status       # Update order status
├── analytics                    # Sales analytics
├── billing                      # Platform fees & billing
├── messages                     # Customer messages
├── payment-reminder             # Payment reminder
├── payment-warning              # Payment warning
├── payment-final-warning        # Final warning
└── account-locked               # Account locked
```

---

## 📝 Registration & Verification

### **Shop Registration**

**Route**: `/shop/registration`  
**Component**: `ShopRegistration.tsx`

**Registration Form:**

```tsx
export function ShopRegistration({ onSubmit }: ShopRegistrationProps) {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessLicense: '',
    address: '',
    city: '',
    postalCode: '',
    categories: [] as string[],
    description: '',
    logo: null as File | null
  });

  const categoryOptions = [
    'Medical Equipment',
    'Medications',
    'Mobility Aids',
    'Wound Care',
    'Diagnostic Tools',
    'Personal Care',
    'Home Healthcare'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="finance-card p-8">
          <div className="text-center mb-8">
            <h1 className="mb-2" style={{ color: '#535353' }}>
              Register Your Medical Supply Shop
            </h1>
            <p style={{ color: '#848484' }}>
              Join CareNet marketplace and reach thousands of customers
            </p>
          </div>

          <div className="space-y-4">
            {/* Shop Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopName" style={{ color: '#535353' }}>
                  Shop Name *
                </Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  placeholder="Your shop name"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName" style={{ color: '#535353' }}>
                  Owner Name *
                </Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Your full name"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: '#535353' }}>
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="shop@example.com"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" style={{ color: '#535353' }}>
                  Phone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessLicense" style={{ color: '#535353' }}>
                  Business License Number *
                </Label>
                <Input
                  id="businessLicense"
                  value={formData.businessLicense}
                  onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                  placeholder="License number"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Product Categories *</Label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{
                      background: formData.categories.includes(category)
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                        : 'rgba(255, 255, 255, 0.5)',
                      color: formData.categories.includes(category) ? 'white' : '#535353'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" style={{ color: '#535353' }}>
                Shop Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
                className="bg-white/50 border-white/50 min-h-20"
                style={{ color: '#535353' }}
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: canSubmit ? 1 : 0.5
              }}
            >
              Submit Application
            </Button>

            <p className="text-xs text-center" style={{ color: '#848484' }}>
              Your application will be reviewed within 24-48 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### **Pending Verification**

**Route**: `/shop/pending-verification`  
**Component**: `ShopPendingVerification.tsx`

**Displays:**
- Verification status
- Documents submitted
- Expected review time
- Contact support option

---

## 📊 Dashboard

**Route**: `/shop/dashboard`  
**Component**: `ShopAdminDashboard.tsx`

### **Dashboard Overview**

```tsx
export function ShopAdminDashboard({ stats, recentOrders }: ShopAdminDashboardProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Shop Dashboard</h1>
          <p style={{ color: '#848484' }}>Welcome back to your shop</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Today's Sales</p>
                <p className="text-xl" style={{ color: '#7CE577' }}>
                  ৳{stats.todaySales.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                }}
              >
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Pending Orders</p>
                <p className="text-xl" style={{ color: '#535353' }}>
                  {stats.pendingOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Total Products</p>
                <p className="text-xl" style={{ color: '#535353' }}>
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)'
                }}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Low Stock</p>
                <p className="text-xl" style={{ color: '#FF8FA3' }}>
                  {stats.lowStockItems}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/shop/products/new">
            <Button className="w-full" style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
              color: 'white'
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
          
          <Link href="/shop/orders">
            <Button variant="outline" className="w-full bg-white/50 border-white/50">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Orders
            </Button>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: '#535353' }}>Recent Orders</h2>
            <Link href="/shop/orders" className="text-sm" style={{ color: '#5B9FFF' }}>
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/shop/orders/${order.id}`}>
                <div className="finance-card p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 style={{ color: '#535353' }}>Order #{order.id}</h3>
                    <span 
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: order.status === 'pending'
                          ? 'rgba(255, 143, 163, 0.2)'
                          : 'rgba(124, 229, 119, 0.2)',
                        color: order.status === 'pending' ? '#FF8FA3' : '#7CE577'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>
                    {order.customer}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: '#535353' }}>
                      {order.itemCount} items
                    </p>
                    <p style={{ color: '#7CE577' }}>
                      ৳{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📦 Product Management

**Route**: `/shop/products`  
**Component**: `ProductManagement.tsx`

### **Product List**

```tsx
export function ProductManagement({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onViewProduct 
}: ProductManagementProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'out_of_stock'>('all');

  const filteredProducts = products.filter(p => filter === 'all' || p.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'inactive': return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
      case 'out_of_stock': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Product Management</h1>
          <Button 
            onClick={onAddProduct} 
            size="sm"
            style={{ 
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', 
              color: 'white' 
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'active', 'inactive', 'out_of_stock'].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap" 
              style={{
                background: filter === f 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' 
                  : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        {filteredProducts.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const statusStyle = getStatusColor(product.status);
              return (
                <div key={product.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{ 
                        background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' 
                      }}
                    >
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      ) : (
                        <Package className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>{product.name}</h3>
                          <p className="text-xs" style={{ color: '#848484' }}>
                            {product.category}
                          </p>
                        </div>
                        <span 
                          className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}
                        >
                          {product.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <p style={{ color: '#7CE577' }}>
                          ৳{product.price.toLocaleString()}
                        </p>
                        <p className="text-sm" style={{ color: '#848484' }}>
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => onViewProduct(product.id)} 
                      size="sm" 
                      variant="outline"
                      className="flex-1 bg-white/50 border-white/50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      onClick={() => onEditProduct(product.id)} 
                      size="sm" 
                      variant="outline"
                      className="flex-1 bg-white/50 border-white/50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => onDeleteProduct(product.id)} 
                      size="sm" 
                      variant="outline"
                      className="bg-white/50 border-white/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

### **Add/Edit Product**

**Route**: `/shop/products/new` or `/shop/products/[id]`  
**Component**: `AddEditProduct.tsx`

**Product Form Fields:**
- Product name
- Category
- Description
- Price
- Stock quantity
- SKU
- Images (up to 5)
- Product specifications
- Status (active/inactive)

---

## 🛒 Order Processing

**Route**: `/shop/orders`  
**Component**: `OrderProcessing.tsx`

### **Order Queue**

```tsx
export function OrderProcessing({ 
  orders, 
  onStartProcessing, 
  onMarkReady 
}: OrderProcessingProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'ready'>('all');

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ready': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'processing': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      case 'pending': return { bg: 'rgba(255, 143, 163, 0.2)', text: '#FF8FA3' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Order Processing</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'processing', 'ready'].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" 
              style={{
                background: filter === f 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' 
                  : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Order Cards */}
        {filteredOrders.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No orders to process</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <div key={order.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: statusStyle.bg }}
                    >
                      <Package className="w-6 h-6" style={{ color: statusStyle.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>Order #{order.id}</h3>
                          <p className="text-sm" style={{ color: '#848484' }}>
                            {order.customer}
                          </p>
                        </div>
                        <span 
                          className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div 
                    className="p-3 rounded-lg mb-3" 
                    style={{ background: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <p className="text-xs mb-2" style={{ color: '#848484' }}>Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm" style={{ color: '#535353' }}>
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#848484' }}>
                      Ordered: {order.orderTime}
                    </p>
                    
                    {order.status === 'pending' && (
                      <Button 
                        onClick={() => onStartProcessing(order.id)} 
                        size="sm"
                        style={{ 
                          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)', 
                          color: 'white' 
                        }}
                      >
                        Start Processing
                      </Button>
                    )}
                    
                    {order.status === 'processing' && (
                      <Button 
                        onClick={() => onMarkReady(order.id)} 
                        size="sm"
                        style={{ 
                          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', 
                          color: 'white' 
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Ready
                      </Button>
                    )}
                    
                    {order.status === 'ready' && (
                      <span className="text-sm flex items-center gap-2" style={{ color: '#7CE577' }}>
                        <Truck className="w-4 h-4" />
                        Ready for Shipping
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

### **Order Detail**

**Route**: `/shop/orders/[id]`  
**Component**: `OrderDetail.tsx`

**Order Information:**
- Customer details
- Order items with quantities
- Delivery address
- Payment status
- Order timeline
- Update status button

---

## 📊 Inventory Management

**Route**: `/shop/products` (Inventory tab)  
**Component**: `InventoryManagement.tsx`

### **Inventory Tracking**

```tsx
export function InventoryManagement({ 
  inventory, 
  onUpdateStock, 
  onExport 
}: InventoryManagementProps) {
  const [filter, setFilter] = useState<'all' | 'low' | 'ok' | 'overstocked'>('all');

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock) return 'overstocked';
    return 'ok';
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    return getStockStatus(item) === filter;
  });

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Inventory Management</h1>
          <Button 
            onClick={onExport} 
            size="sm" 
            variant="outline" 
            className="bg-white/50 border-white/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'low', 'ok', 'overstocked'].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" 
              style={{
                background: filter === f 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' 
                  : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Inventory Items */}
        <div className="space-y-3">
          {filteredInventory.map((item) => {
            const status = getStockStatus(item);
            const statusStyle = getStatusColor(status);
            
            return (
              <div key={item.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: statusStyle.bg }}
                  >
                    {status === 'low' ? (
                      <AlertTriangle className="w-6 h-6" style={{ color: statusStyle.text }} />
                    ) : (
                      <Package className="w-6 h-6" style={{ color: statusStyle.text }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 style={{ color: '#535353' }}>{item.name}</h3>
                        <p className="text-xs" style={{ color: '#848484' }}>
                          SKU: {item.sku}
                        </p>
                      </div>
                      <span 
                        className="text-xs px-3 py-1 rounded-full capitalize"
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Levels */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div 
                    className="p-2 rounded-lg" 
                    style={{ background: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>Current</p>
                    <p style={{ color: '#535353' }}>{item.currentStock}</p>
                  </div>
                  <div 
                    className="p-2 rounded-lg" 
                    style={{ background: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>Min</p>
                    <p style={{ color: '#535353' }}>{item.minStock}</p>
                  </div>
                  <div 
                    className="p-2 rounded-lg" 
                    style={{ background: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>Max</p>
                    <p style={{ color: '#535353' }}>{item.maxStock}</p>
                  </div>
                </div>

                <p className="text-xs mb-2" style={{ color: '#848484' }}>
                  Last restocked: {item.lastRestocked}
                </p>

                <Button
                  onClick={() => onUpdateStock(item.id, item.currentStock)}
                  size="sm"
                  variant="outline"
                  className="w-full bg-white/50 border-white/50"
                >
                  Update Stock
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

**Inventory Features:**
- Track current, min, max stock levels
- Low stock alerts
- Overstocked warnings
- Last restock date
- Quick stock updates
- Export inventory report

---

## 📈 Analytics & Reports

**Route**: `/shop/analytics`  
**Component**: `ShopAnalytics.tsx`

### **Analytics Dashboard**

```tsx
export function ShopAnalytics({ stats, onExport }: ShopAnalyticsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Shop Analytics</h1>
          <Button 
            onClick={onExport} 
            size="sm" 
            variant="outline" 
            className="bg-white/50 border-white/50"
          >
            Export Report
          </Button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {['week', 'month', 'year'].map((p) => (
            <button 
              key={p} 
              onClick={() => setPeriod(p as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" 
              style={{
                background: period === p 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' 
                  : 'rgba(255, 255, 255, 0.5)',
                color: period === p ? 'white' : '#535353'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Revenue & Orders */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' 
                }}
              >
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Revenue</p>
                <p className="text-xl" style={{ color: '#7CE577' }}>
                  ৳{stats.totalRevenue.toLocaleString()}
                </p>
                <p 
                  className="text-xs" 
                  style={{ color: stats.revenueGrowth >= 0 ? '#7CE577' : '#FF6B7A' }}
                >
                  {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' 
                }}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Orders</p>
                <p className="text-xl" style={{ color: '#535353' }}>{stats.totalOrders}</p>
                <p 
                  className="text-xs" 
                  style={{ color: stats.ordersGrowth >= 0 ? '#7CE577' : '#FF6B7A' }}
                >
                  {stats.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.ordersGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4 col-span-2">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' 
                }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>
                  Average Order Value
                </p>
                <p className="text-xl" style={{ color: '#535353' }}>
                  ৳{stats.avgOrderValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="mb-6">
          <h2 className="mb-4" style={{ color: '#535353' }}>Top Selling Products</h2>
          <div className="space-y-3">
            {stats.topSellingProducts.map((product, idx) => (
              <div key={product.id} className="finance-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ background: 'rgba(91, 159, 255, 0.2)', color: '#5B9FFF' }}
                    >
                      {idx + 1}
                    </span>
                    <h3 style={{ color: '#535353' }}>{product.name}</h3>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: '#848484' }}>
                    {product.unitsSold} units sold
                  </p>
                  <p style={{ color: '#7CE577' }}>
                    ৳{product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Analytics Metrics:**
- Total revenue with growth percentage
- Total orders with growth percentage
- Average order value
- Top selling products
- Revenue by category
- Monthly revenue chart

---

## 💬 Customer Support

**Route**: `/shop/messages`  
**Component**: `CustomerSupport.tsx`

**Features:**
- Customer inquiries inbox
- Respond to messages
- Order-related questions
- Product inquiries
- Mark as resolved

---

## 💰 Billing & Payments

**Route**: `/shop/billing`  
**Component**: `ShopBilling.tsx`

**Billing Information:**
- Platform fees (commission on sales)
- Transaction history
- Payment reminders
- Payment warnings
- Invoice generation
- Payment methods

---

## ⚙️ Shop Settings

**Component**: `ShopSettings.tsx`

**Settings:**
- Shop profile (name, logo, description)
- Business hours
- Delivery options
- Payment methods accepted
- Notification preferences
- Account settings

---

## 🐛 Debugging Guide

### **Issue: Orders Not Updating**

**Problem**: Order status not updating when clicked.

**Debug Steps**:
```typescript
// Check state update
console.log('Updating order:', orderId);

const response = await fetch(`/api/shop/orders/${orderId}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status: 'processing' })
});

console.log('Response:', await response.json());

// Verify UI refresh
setOrders(prev => 
  prev.map(o => o.id === orderId ? { ...o, status: 'processing' } : o)
);
```

### **Issue: Inventory Not Syncing**

**Problem**: Stock levels not updating after order.

**Solution**:
```typescript
// Check inventory update hook
useEffect(() => {
  async function syncInventory() {
    const response = await fetch('/api/shop/inventory/sync');
    const data = await response.json();
    setInventory(data);
  }
  
  syncInventory();
}, [orders]); // Re-sync when orders change
```

---

## 🧪 Testing Guide

```typescript
describe('Shop Product Management', () => {
  it('adds new product successfully', async () => {
    const { user } = renderWithAuth(<ProductManagement />);
    
    await user.click(screen.getByText('Add Product'));
    await user.type(screen.getByLabelText('Product Name'), 'Digital Thermometer');
    await user.type(screen.getByLabelText('Price'), '500');
    await user.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(screen.getByText('Digital Thermometer')).toBeInTheDocument();
    });
  });
  
  it('filters products by status', async () => {
    const { user } = renderWithAuth(<ProductManagement />);
    
    await user.click(screen.getByText('Out of Stock'));
    
    expect(screen.queryByText('Active Product')).not.toBeInTheDocument();
  });
});

describe('Shop Order Processing', () => {
  it('processes order correctly', async () => {
    const onStartProcessing = jest.fn();
    const { user } = render(
      <OrderProcessing orders={mockOrders} onStartProcessing={onStartProcessing} />
    );
    
    await user.click(screen.getByText('Start Processing'));
    
    expect(onStartProcessing).toHaveBeenCalledWith('order-123');
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**
- **Registration**: 88% (Form submission working)
- **Product Management**: 92% (CRUD operations functional)
- **Order Processing**: 90% (Status updates working)
- **Inventory**: 85% (Stock tracking functional)
- **Analytics**: 87% (Reports generating correctly)

### **❌ TODO**
- [ ] Image upload for products
- [ ] Real-time order notifications
- [ ] Analytics chart visualization
- [ ] E2E test for full shop workflow

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
