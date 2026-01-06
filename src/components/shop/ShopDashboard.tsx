'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, TrendingUp, DollarSign, Users, AlertTriangle, Plus, Search, Filter, BarChart3, LineChart } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: 'active' | 'low-stock' | 'out-of-stock' | 'discontinued';
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface SalesMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

export function ShopDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const salesMetrics: SalesMetric[] = [
    {
      id: '1',
      name: 'Total Revenue',
      value: 125000,
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" style={{ color: '#7CE577' }} />
    },
    {
      id: '2',
      name: 'Orders',
      value: 156,
      change: 8.2,
      icon: <Package className="w-6 h-6" style={{ color: '#5B9FFF' }} />
    },
    {
      id: '3',
      name: 'Customers',
      value: 89,
      change: 5.4,
      icon: <Users className="w-6 h-6" style={{ color: '#FFD180' }} />
    },
    {
      id: '4',
      name: 'Avg Order Value',
      value: 801,
      change: -2.1,
      icon: <TrendingUp className="w-6 h-6" style={{ color: '#FF6B7A' }} />
    }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Glucose Monitor',
      category: 'Medical Equipment',
      price: 2500,
      stock: 15,
      sales: 23,
      status: 'active'
    },
    {
      id: '2',
      name: 'Blood Pressure Monitor',
      category: 'Medical Equipment',
      price: 3200,
      stock: 8,
      sales: 18,
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'Diabetes Test Strips',
      category: 'Medicines',
      price: 450,
      stock: 0,
      sales: 45,
      status: 'out-of-stock'
    },
    {
      id: '4',
      name: 'Walking Cane',
      category: 'Mobility Aids',
      price: 1200,
      stock: 25,
      sales: 12,
      status: 'active'
    },
    {
      id: '5',
      name: 'Compression Stockings',
      category: 'Medical Supplies',
      price: 850,
      stock: 30,
      sales: 34,
      status: 'active'
    }
  ];

  const orders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Mrs. Fatima Rahman',
      items: 3,
      total: 4250,
      status: 'pending',
      date: '2024-12-10'
    },
    {
      id: 'ORD-002',
      customerName: 'Mr. Karim Ahmed',
      items: 1,
      total: 2500,
      status: 'processing',
      date: '2024-12-09'
    },
    {
      id: 'ORD-003',
      customerName: 'Green Care Agency',
      items: 15,
      total: 18750,
      status: 'shipped',
      date: '2024-12-08'
    }
  ];

  const categories = ['all', 'Medical Equipment', 'Medicines', 'Mobility Aids', 'Medical Supplies'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#7CE577';
      case 'low-stock': return '#FFD180';
      case 'out-of-stock': return '#FF6B7A';
      case 'discontinued': return '#848484';
      default: return '#848484';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'In Stock';
      case 'low-stock': return 'Low Stock';
      case 'out-of-stock': return 'Out of Stock';
      case 'discontinued': return 'Discontinued';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
            Shop Dashboard
          </h1>
          <p style={{ color: '#848484' }} className="text-sm">
            Medical supplies and equipment store
          </p>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => console.log('Generate Report')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TouchButton>
          <TouchButton
            variant="primary"
            size="sm"
            onClick={() => console.log('Add Product')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </TouchButton>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'quarter'].map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeframe === timeframe
                ? 'bg-gradient-to-r from-[#FFB3C1] to-[#FF8FA3] text-white'
                : 'bg-white/50 text-[#535353] hover:bg-white/70'
            }`}
          >
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </button>
        ))}
      </div>

      {/* Sales Metrics */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Sales Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {salesMetrics.map((metric) => (
            <MobileCard key={metric.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(142, 197, 252, 0.2)' }}
                  >
                    {metric.icon}
                  </div>
                  <div>
                    <h3 style={{ color: '#535353' }} className="font-medium">
                      {metric.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#848484' }}>
                      {selectedTimeframe} overview
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold" style={{ color: '#535353' }}>
                    {metric.name.includes('Revenue') ? '৳' : ''}{metric.value.toLocaleString()}
                  </div>
                  <div className={`text-sm ${
                    metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change >= 0 ? '↗' : '↘'} {Math.abs(metric.change)}%
                  </div>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#535353' }} className="text-lg font-semibold">
            Products
          </h2>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10 bg-white/50 border-white/50 w-64"
                style={{ color: '#535353' }}
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded-lg border"
              style={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.5)",
                color: "#535353",
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <MobileCard key={product.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/50 flex items-center justify-center">
                    <Package className="w-8 h-8" style={{ color: '#5B9FFF' }} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 style={{ color: '#535353' }} className="font-medium">
                        {product.name}
                      </h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getStatusColor(product.status) + '20',
                          color: getStatusColor(product.status)
                        }}
                      >
                        {getStatusText(product.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span style={{ color: '#848484' }}>Category:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{product.category}</span>
                      </div>
                      <div>
                        <span style={{ color: '#848484' }}>Price:</span>
                        <span style={{ color: '#535353' }} className="ml-2">৳{product.price}</span>
                      </div>
                      <div>
                        <span style={{ color: '#848484' }}>Stock:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{product.stock}</span>
                      </div>
                      <div>
                        <span style={{ color: '#848484' }}>Sales:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{product.sales}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Edit', product.name)}
                  >
                    Edit
                  </TouchButton>
                  <TouchButton
                    variant="secondary"
                    size="sm"
                    onClick={() => console.log('Manage Stock', product.name)}
                  >
                    Stock
                  </TouchButton>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div>
          <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {orders.map((order) => (
              <MobileCard key={order.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ 
                        background: 'rgba(142, 197, 252, 0.2)',
                        color: '#5B9FFF'
                      }}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 style={{ color: '#535353' }} className="font-medium">
                          {order.customerName}
                        </h4>
                        <span 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            background: order.status === 'pending' ? '#FFD18020' :
                                       order.status === 'processing' ? '#FFB74D20' :
                                       order.status === 'shipped' ? '#7CE57720' :
                                       order.status === 'delivered' ? '#5B9FFF20' : '#FF6B7A20',
                            color: order.status === 'pending' ? '#FFD180' :
                                   order.status === 'processing' ? '#FFB74D' :
                                   order.status === 'shipped' ? '#7CE577' :
                                   order.status === 'delivered' ? '#5B9FFF' : '#FF6B7A'
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span style={{ color: '#848484' }}>{order.items} items</span>
                        <span style={{ color: '#535353' }}>৳{order.total}</span>
                        <span style={{ color: '#848484' }}>{order.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <TouchButton
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('View', order.id)}
                    >
                      View
                    </TouchButton>
                    <TouchButton
                      variant="secondary"
                      size="sm"
                      onClick={() => console.log('Update Status', order.id)}
                    >
                      Update
                    </TouchButton>
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div>
          <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
            Inventory Alerts
          </h3>
          <div className="space-y-3">
            {products.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock').map((product) => (
              <MobileCard key={product.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ 
                        background: 'rgba(255, 179, 193, 0.2)',
                        color: '#FF6B7A'
                      }}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    
                    <div>
                      <h4 style={{ color: '#535353' }} className="font-medium">
                        {product.name}
                      </h4>
                      <p className="text-sm" style={{ color: '#848484' }}>
                        {product.stock} units remaining
                      </p>
                    </div>
                  </div>
                  
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Restock', product.name)}
                  >
                    Restock
                  </TouchButton>
                </div>
              </MobileCard>
            ))}
            
            {products.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock').length === 0 && (
              <div className="text-center py-4">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2" style={{ color: '#7CE577' }} />
                <p style={{ color: '#848484' }}>No inventory alerts</p>
              </div>
            )}
          </div>
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
            onClick={() => console.log('Manage Orders')}
            className="h-20"
          >
            <Package className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Manage Orders</div>
              <div className="text-sm" style={{ color: '#848484' }}>Process and track</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Inventory Management')}
            className="h-20"
          >
            <ShoppingBag className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Inventory</div>
              <div className="text-sm" style={{ color: '#848484' }}>Stock management</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Sales Reports')}
            className="h-20"
          >
            <LineChart className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Sales Reports</div>
              <div className="text-sm" style={{ color: '#848484' }}>Analytics & insights</div>
            </div>
          </TouchButton>
        </div>
      </div>
    </div>
  );
}