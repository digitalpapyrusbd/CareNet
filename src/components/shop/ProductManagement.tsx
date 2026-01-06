'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Search, Filter, Download, Upload, Eye, Tag, DollarSign, Box, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: string;
  status: 'active' | 'low-stock' | 'out-of-stock' | 'discontinued';
  description: string;
  lastRestocked: string;
  salesThisMonth: number;
  margin: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
}

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Mock data
  const products: Product[] = [
    {
      id: 'P001',
      name: 'Glucose Monitor',
      category: 'Medical Equipment',
      sku: 'GLU-001',
      price: 2500,
      cost: 1800,
      stock: 15,
      minStock: 5,
      supplier: 'MediTech Supplies',
      status: 'active',
      description: 'Digital glucose monitoring device',
      lastRestocked: '2024-12-01',
      salesThisMonth: 23,
      margin: 28
    },
    {
      id: 'P002',
      name: 'Blood Pressure Monitor',
      category: 'Medical Equipment',
      sku: 'BPM-002',
      price: 3200,
      cost: 2400,
      stock: 8,
      minStock: 10,
      supplier: 'HealthCare Distributors',
      status: 'low-stock',
      description: 'Automatic blood pressure monitor',
      lastRestocked: '2024-11-15',
      salesThisMonth: 18,
      margin: 25
    },
    {
      id: 'P003',
      name: 'Diabetes Test Strips',
      category: 'Medicines',
      sku: 'DTS-003',
      price: 450,
      cost: 320,
      stock: 0,
      minStock: 20,
      supplier: 'Pharma Solutions',
      status: 'out-of-stock',
      description: 'Test strips for glucose monitoring',
      lastRestocked: '2024-10-20',
      salesThisMonth: 45,
      margin: 29
    },
    {
      id: 'P004',
      name: 'Walking Cane',
      category: 'Mobility Aids',
      sku: 'CAN-004',
      price: 1200,
      cost: 850,
      stock: 25,
      minStock: 5,
      supplier: 'Mobility Plus',
      status: 'active',
      description: 'Adjustable walking cane with rubber tip',
      lastRestocked: '2024-11-30',
      salesThisMonth: 12,
      margin: 29
    },
    {
      id: 'P005',
      name: 'Compression Stockings',
      category: 'Medical Supplies',
      sku: 'CS-005',
      price: 850,
      cost: 600,
      stock: 30,
      minStock: 10,
      supplier: 'Comfort Care',
      status: 'active',
      description: 'Graduated compression stockings',
      lastRestocked: '2024-12-05',
      salesThisMonth: 34,
      margin: 29
    }
  ];

  const categories = ['all', 'Medical Equipment', 'Medicines', 'Mobility Aids', 'Medical Supplies', 'Personal Care'];
  const statuses = ['all', 'active', 'low-stock', 'out-of-stock', 'discontinued'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Product];
    let bValue: any = b[sortBy as keyof Product];
    
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
      case 'active': return '#7CE577';
      case 'low-stock': return '#FFD180';
      case 'out-of-stock': return '#FF6B7A';
      case 'discontinued': return '#848484';
      default: return '#848484';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Medical Equipment': return '#5B9FFF';
      case 'Medicines': return '#FF6B7A';
      case 'Mobility Aids': return '#7CE577';
      case 'Medical Supplies': return '#FFD180';
      case 'Personal Care': return '#8EC5FC';
      default: return '#848484';
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < minStock) return 'low-stock';
    return 'active';
  };

  const getProfit = (price: number, cost: number) => {
    return price - cost;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
            Product Management
          </h1>
          <p style={{ color: '#848484' }} className="text-sm">
            Manage medical supplies and equipment inventory
          </p>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => console.log('Export Products')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
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

      {/* Filters */}
      <div className="finance-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 bg-white/50 border-white/50"
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
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="salesThisMonth">Sort by Sales</option>
              <option value="margin">Sort by Margin</option>
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

      {/* Product List */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Product Catalog
        </h2>
        <div className="space-y-3">
          {sortedProducts.map((product) => (
            <MobileCard key={product.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/50 flex items-center justify-center">
                    <Package className="w-6 h-6" style={{ color: getCategoryColor(product.category) }} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 style={{ color: '#535353' }} className="font-medium">
                        {product.name}
                      </h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getCategoryColor(product.category) + '20',
                          color: getCategoryColor(product.category)
                        }}
                      >
                        {product.category}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getStatusColor(product.status) + '20',
                          color: getStatusColor(product.status)
                        }}
                      >
                        {product.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span style={{ color: '#848484' }}>SKU:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{product.sku}</span>
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
                        <span style={{ color: '#535353' }} className="ml-2">{product.salesThisMonth}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" style={{ color: '#7CE577' }} />
                        <span style={{ color: '#848484' }}>Cost:</span>
                        <span style={{ color: '#535353' }}>৳{product.cost}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" style={{ color: '#FFD180' }} />
                        <span style={{ color: '#848484' }}>Margin:</span>
                        <span style={{ color: '#535353' }}>{product.margin}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#848484' }}>Min:</span>
                        <span style={{ color: '#535353' }}>{product.minStock}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" style={{ color: '#FF6B7A' }} />
                        <span style={{ color: '#848484' }}>Supplier:</span>
                        <span style={{ color: '#535353' }}>{product.supplier}</span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm" style={{ color: '#535353' }}>
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('View', product.name)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Edit', product.name)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Restock', product.name)}
                  >
                    <Box className="w-4 h-4 mr-1" />
                    Restock
                  </TouchButton>
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
            onClick={() => console.log('Bulk Import')}
            className="h-20"
          >
            <Upload className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Bulk Import</div>
              <div className="text-sm" style={{ color: '#848484' }}>Import products</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Inventory Audit')}
            className="h-20"
          >
            <Search className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Inventory Audit</div>
              <div className="text-sm" style={{ color: '#848484' }}>Check stock levels</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Pricing Analysis')}
            className="h-20"
          >
            <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Pricing Analysis</div>
              <div className="text-sm" style={{ color: '#848484' }}>Optimize margins</div>
            </div>
          </TouchButton>
        </div>
      </div>
    </div>
  );
}