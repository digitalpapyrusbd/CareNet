'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Package, DollarSign, TrendingUp, Users, BarChart3, FileText, Settings, Plus } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';

export default function ShopManagerPage() {
  const router = useRouter();
  const managerName = 'Shop Manager';
  const shopName = 'MediCare Supplies';

  const kpis = {
    totalRevenue: 125000,
    totalOrders: 156,
    activeProducts: 45,
    inventoryValue: 285000
  };

  const quickStats = [
    { label: 'Revenue', value: `৳${kpis.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#7CE577' },
    { label: 'Orders', value: kpis.totalOrders, icon: Package, color: '#5B9FFF' },
    { label: 'Products', value: kpis.activeProducts, icon: ShoppingBag, color: '#FFD180' },
    { label: 'Inventory', value: `৳${kpis.inventoryValue.toLocaleString()}`, icon: TrendingUp, color: '#FF6B7A' }
  ];

  const recentActivity = [
    { id: '1', action: 'New order received from Green Care Agency', time: '10 min ago' },
    { id: '2', action: 'Product restocked: Glucose Monitor (15 units)', time: '1 hour ago' },
    { id: '3', action: 'Order shipped: Mrs. Fatima Rahman', time: '2 hours ago' },
    { id: '4', action: 'Low stock alert: Diabetes Test Strips', time: '3 hours ago' }
  ];

  const navigationItems = [
    { 
      title: 'Dashboard', 
      description: 'Overview and analytics',
      icon: BarChart3,
      color: '#7CE577',
      onClick: () => router.push('/shop-manager/dashboard')
    },
    { 
      title: 'Product Management', 
      description: 'Manage inventory',
      icon: Package,
      color: '#5B9FFF',
      onClick: () => router.push('/shop-manager/products')
    },
    { 
      title: 'Order Management', 
      description: 'Process orders',
      icon: ShoppingBag,
      color: '#FFD180',
      onClick: () => router.push('/shop-manager/orders')
    },
    { 
      title: 'Customer Management', 
      description: 'Manage clients',
      icon: Users,
      color: '#FF6B7A',
      onClick: () => router.push('/shop-manager/customers')
    },
    { 
      title: 'Reports', 
      description: 'Generate reports',
      icon: FileText,
      color: '#8EC5FC',
      onClick: () => router.push('/shop-manager/reports')
    },
    { 
      title: 'Settings', 
      description: 'Store configuration',
      icon: Settings,
      color: '#FFB74D',
      onClick: () => router.push('/shop-manager/settings')
    }
  ];

  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <div className="min-h-screen pb-24 md:pt-14">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
              Shop Manager
            </h1>
            <p style={{ color: '#848484' }} className="text-sm">
              Welcome back, {managerName} • {shopName}
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {quickStats.map((stat, index) => (
              <MobileCard key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#848484' }}>{stat.label}</p>
                    <p className="text-xl font-bold" style={{ color: '#535353' }}>
                      {stat.value}
                    </p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${stat.color}20` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {navigationItems.map((item, index) => (
              <TouchButton
                key={index}
                variant="ghost"
                size="md"
                onClick={item.onClick}
                className="h-24 text-left"
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: `${item.color}20` }}
                      >
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div>
                        <h3 style={{ color: '#535353' }} className="font-medium">
                          {item.title}
                        </h3>
                        <p className="text-sm" style={{ color: '#848484' }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: `${item.color}20` }}
                    >
                      <Plus className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                  </div>
                </div>
              </TouchButton>
            ))}
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#535353' }} className="text-lg font-semibold">
                Recent Activity
              </h3>
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={() => router.push('/shop-manager/activity')}
              >
                View All
              </TouchButton>
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <MobileCard key={activity.id}>
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}
                    >
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p style={{ color: '#535353' }}>{activity.action}</p>
                      <p className="text-xs mt-1" style={{ color: '#848484' }}>{activity.time}</p>
                    </div>
                  </div>
                </MobileCard>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TouchButton
                variant="ghost"
                size="md"
                onClick={() => router.push('/shop-manager/products/new')}
                className="h-20"
              >
                <Plus className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
                <div className="text-left">
                  <div style={{ color: '#535353' }}>Add Product</div>
                  <div className="text-sm" style={{ color: '#848484' }}>New inventory item</div>
                </div>
              </TouchButton>
              
              <TouchButton
                variant="ghost"
                size="md"
                onClick={() => router.push('/shop-manager/orders/new')}
                className="h-20"
              >
                <ShoppingBag className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
                <div className="text-left">
                  <div style={{ color: '#535353' }}>New Order</div>
                  <div className="text-sm" style={{ color: '#848484' }}>Create order</div>
                </div>
              </TouchButton>
              
              <TouchButton
                variant="ghost"
                size="md"
                onClick={() => router.push('/shop-manager/reports')}
                className="h-20"
              >
                <FileText className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
                <div className="text-left">
                  <div style={{ color: '#535353' }}>Generate Report</div>
                  <div className="text-sm" style={{ color: '#848484' }}>Sales & inventory</div>
                </div>
              </TouchButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}