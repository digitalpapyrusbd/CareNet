import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

interface ShopAdminDashboardProps {
  stats: {
    totalProducts: number;
    activeOrders: number;
    monthlyRevenue: number;
    totalCustomers: number;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
}

export function ShopAdminDashboard({ stats, recentOrders, lowStockProducts }: ShopAdminDashboardProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Shop Dashboard</h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{stats.totalProducts}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Products</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{stats.activeOrders}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Active Orders</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#7CE577' }}>৳{stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Monthly Revenue</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{stats.totalCustomers}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Customers</p>
              </div>
            </div>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #FF6B7A' }}>
            <h3 className="mb-3" style={{ color: '#FF6B7A' }}>⚠️ Low Stock Alert</h3>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <span style={{ color: '#535353' }}>{product.name}</span>
                  <span className="px-2 py-1 rounded-full text-xs"
                    style={{ background: 'rgba(255, 107, 122, 0.2)', color: '#FF6B7A' }}>
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="finance-card p-4">
          <h3 className="mb-3" style={{ color: '#535353' }}>Recent Orders</h3>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <div>
                  <p className="text-sm" style={{ color: '#535353' }}>#{order.id}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: '#7CE577' }}>৳{order.amount.toLocaleString()}</p>
                  <p className="text-xs capitalize" style={{ color: '#848484' }}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

