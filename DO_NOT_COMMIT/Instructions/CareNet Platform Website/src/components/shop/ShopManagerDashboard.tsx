import { Package, ShoppingCart, AlertTriangle, CheckCircle } from "lucide-react";

interface ShopManagerDashboardProps {
  stats: {
    pendingOrders: number;
    processingOrders: number;
    lowStockItems: number;
    todayOrders: number;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    items: number;
    status: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'low_stock' | 'urgent_order' | 'customer_inquiry';
    message: string;
  }>;
}

export function ShopManagerDashboard({ stats, recentOrders, alerts }: ShopManagerDashboardProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Manager Dashboard</h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{stats.pendingOrders}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Pending Orders</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)' }}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{stats.processingOrders}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Processing</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)' }}>
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{stats.lowStockItems}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Low Stock</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{stats.todayOrders}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Today's Orders</p>
              </div>
            </div>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #FF6B7A' }}>
            <h3 className="mb-3" style={{ color: '#FF6B7A' }}>⚠️ Alerts</h3>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#FF6B7A' }} />
                  <span style={{ color: '#535353' }}>{alert.message}</span>
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
                  <p className="text-xs" style={{ color: '#848484' }}>{order.customer} • {order.items} items</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full capitalize"
                  style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

