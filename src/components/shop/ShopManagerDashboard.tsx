import { AlertCircle, Package, Clock, AlertTriangle } from "lucide-react";

interface ShopManagerDashboardProps {
  metrics: {
    pendingOrders: number;
    processing: number;
    lowStockItems: number;
  };
  onNavigateToOrders: () => void;
  onNavigateToInventory: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToInquiries: () => void;
}

export function ShopManagerDashboard({
  metrics,
  onNavigateToOrders,
  onNavigateToInventory,
  onNavigateToAlerts,
  onNavigateToInquiries
}: ShopManagerDashboardProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Shop Manager Dashboard</h1>

        {/* Restrictions Banner */}
        <div className="finance-card p-4 mb-6" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
            <div>
              <p style={{ color: '#535353' }}>Manager Access - Operations Only</p>
              <p className="text-sm" style={{ color: '#848484' }}>
                You can manage orders and inventory. Contact admin for pricing and product management.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.pendingOrders}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Pending</p>
          </div>

          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.processing}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Processing</p>
          </div>

          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.lowStockItems}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Low Stock</p>
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h2 className="mb-4" style={{ color: '#535353' }}>Quick Access</h2>
          <div className="space-y-3">
            <button onClick={onNavigateToOrders} className="w-full finance-card p-4 hover:shadow-lg transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>Order Queue</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Process and fulfill orders</p>
                </div>
              </div>
            </button>

            <button onClick={onNavigateToInventory} className="w-full finance-card p-4 hover:shadow-lg transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>Inventory Management</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Update stock levels</p>
                </div>
              </div>
            </button>

            <button onClick={onNavigateToAlerts} className="w-full finance-card p-4 hover:shadow-lg transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>Low Stock Alerts</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Items needing restock</p>
                </div>
              </div>
            </button>

            <button onClick={onNavigateToInquiries} className="w-full finance-card p-4 hover:shadow-lg transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>Customer Inquiries</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Respond to customers</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
