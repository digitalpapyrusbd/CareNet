'use client';

import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, User, MapPin, DollarSign, Clock, CheckCircle, XCircle, Eye, Edit, Truck, Calendar } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod: 'cash' | 'card' | 'mobile';
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data
  const orders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Mrs. Fatima Rahman',
      customerEmail: 'fatima.rahman@example.com',
      customerPhone: '+880 1712 345678',
      items: [
        { id: 'P001', name: 'Glucose Monitor', quantity: 1, price: 2500 },
        { id: 'P003', name: 'Diabetes Test Strips', quantity: 2, price: 450 }
      ],
      total: 3400,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cash',
      shippingAddress: 'House 123, Road 45, Dhanmondi, Dhaka',
      orderDate: '2024-12-10',
      estimatedDelivery: '2024-12-12',
      notes: 'Call before delivery'
    },
    {
      id: 'ORD-002',
      customerName: 'Mr. Karim Ahmed',
      customerEmail: 'karim.ahmed@example.com',
      customerPhone: '+880 1712 345679',
      items: [
        { id: 'P004', name: 'Walking Cane', quantity: 1, price: 1200 }
      ],
      total: 1200,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      shippingAddress: 'House 456, Road 78, Gulshan, Dhaka',
      orderDate: '2024-12-09',
      estimatedDelivery: '2024-12-11'
    },
    {
      id: 'ORD-003',
      customerName: 'Green Care Agency',
      customerEmail: 'orders@greencare.com',
      customerPhone: '+880 1712 345680',
      items: [
        { id: 'P001', name: 'Glucose Monitor', quantity: 5, price: 2500 },
        { id: 'P005', name: 'Compression Stockings', quantity: 10, price: 850 }
      ],
      total: 21000,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'mobile',
      shippingAddress: '123 Medical Complex, Mohakhali, Dhaka',
      orderDate: '2024-12-08',
      estimatedDelivery: '2024-12-10',
      notes: 'Business account - priority delivery'
    },
    {
      id: 'ORD-004',
      customerName: 'Mrs. Shirin Begum',
      customerEmail: 'shirin.begum@example.com',
      customerPhone: '+880 1712 345681',
      items: [
        { id: 'P002', name: 'Blood Pressure Monitor', quantity: 1, price: 3200 }
      ],
      total: 3200,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'cash',
      shippingAddress: 'House 789, Road 12, Banani, Dhaka',
      orderDate: '2024-12-05',
      estimatedDelivery: '2024-12-07'
    }
  ];

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatuses = ['all', 'paid', 'pending', 'failed'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Order];
    let bValue: any = b[sortBy as keyof Order];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFD180';
      case 'processing': return '#FFB74D';
      case 'shipped': return '#7CE577';
      case 'delivered': return '#5B9FFF';
      case 'cancelled': return '#FF6B7A';
      default: return '#848484';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#7CE577';
      case 'pending': return '#FFD180';
      case 'failed': return '#FF6B7A';
      default: return '#848484';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <DollarSign className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTotalItems = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
            Order Management
          </h1>
          <p style={{ color: '#848484' }} className="text-sm">
            Process and track customer orders
          </p>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => console.log('Export Orders')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </TouchButton>
          <TouchButton
            variant="primary"
            size="sm"
            onClick={() => console.log('New Order')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </TouchButton>
        </div>
      </div>

      {/* Filters */}
      <div className="finance-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 rounded-lg border"
            style={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              background: "rgba(255, 255, 255, 0.5)",
              color: "#535353",
            }}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="p-2 rounded-lg border"
            style={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              background: "rgba(255, 255, 255, 0.5)",
              color: "#535353",
            }}
          >
            {paymentStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 rounded-lg border flex-1"
              style={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.5)",
                color: "#535353",
              }}
            >
              <option value="orderDate">Sort by Date</option>
              <option value="total">Sort by Amount</option>
              <option value="status">Sort by Status</option>
              <option value="customerName">Sort by Customer</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg border"
              style={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.5)",
                color: "#535353",
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Order List
        </h2>
        <div className="space-y-3">
          {sortedOrders.map((order) => (
            <MobileCard key={order.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: getStatusColor(order.status) + '20',
                      color: getStatusColor(order.status)
                    }}
                  >
                    <Package className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 style={{ color: '#535353' }} className="font-medium">
                        {order.id}
                      </h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getStatusColor(order.status) + '20',
                          color: getStatusColor(order.status)
                        }}
                      >
                        {order.status}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getPaymentStatusColor(order.paymentStatus) + '20',
                          color: getPaymentStatusColor(order.paymentStatus)
                        }}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#848484' }}>Customer:</span>
                        <span style={{ color: '#535353' }}>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" style={{ color: '#7CE577' }} />
                        <span style={{ color: '#848484' }}>Total:</span>
                        <span style={{ color: '#535353' }}>৳{order.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#FFD180' }} />
                        <span style={{ color: '#848484' }}>Items:</span>
                        <span style={{ color: '#535353' }}>{getTotalItems(order.items)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: '#FF6B7A' }} />
                        <span style={{ color: '#848484' }}>Date:</span>
                        <span style={{ color: '#535353' }}>{order.orderDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: '#8EC5FC' }} />
                        <span style={{ color: '#848484' }}>Address:</span>
                        <span style={{ color: '#535353' }}>{order.shippingAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#848484' }}>Method:</span>
                        <span style={{ color: '#535353' }}>{order.paymentMethod}</span>
                      </div>
                      {order.notes && (
                        <div className="flex items-center gap-2">
                          <span style={{ color: '#848484' }}>Notes:</span>
                          <span style={{ color: '#535353' }}>{order.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <p className="text-sm" style={{ color: '#848484' }}>Items:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm" style={{ color: '#535353' }}>
                            <span>{item.name} x{item.quantity}</span>
                            <span>৳{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('View', order.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Edit', order.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </TouchButton>
                  {order.status === 'pending' && (
                    <TouchButton
                      variant="primary"
                      size="sm"
                      onClick={() => console.log('Process', order.id)}
                    >
                      Process
                    </TouchButton>
                  )}
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Bulk Update')}
            className="h-20"
          >
            <Edit className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Bulk Update</div>
              <div className="text-sm" style={{ color: '#848484' }}>Update multiple orders</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Shipping Labels')}
            className="h-20"
          >
            <Truck className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Shipping</div>
              <div className="text-sm" style={{ color: '#848484' }}>Print labels</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Order Analytics')}
            className="h-20"
          >
            <BarChart3 className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Analytics</div>
              <div className="text-sm" style={{ color: '#848484' }}>Order performance</div>
            </div>
          </TouchButton>
        </div>
      </div>
    </div>
  );
}

// Import missing icons
import { CreditCard, Smartphone, Plus, BarChart3 } from 'lucide-react';