import { AlertTriangle, Package, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";

interface StockAlert {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  reorderPoint: number;
  status: 'critical' | 'low' | 'warning';
}

interface StockAlertsProps {
  alerts: StockAlert[];
  onRequestRestock: (id: string) => void;
}

export function StockAlerts({ alerts, onRequestRestock }: StockAlertsProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case 'low': return { bg: 'rgba(255, 143, 163, 0.2)', text: '#FF8FA3' };
      case 'warning': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  const criticalAlerts = alerts.filter(a => a.status === 'critical');
  const otherAlerts = alerts.filter(a => a.status !== 'critical');

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Stock Alerts</h1>

        {criticalAlerts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
              <h2 style={{ color: '#FF6B7A' }}>Critical - Out of Stock</h2>
            </div>
            <div className="space-y-3">
              {criticalAlerts.map((alert) => {
                const statusStyle = getStatusColor(alert.status);
                return (
                  <div key={alert.id} className="finance-card p-4"
                    style={{ borderLeft: `4px solid ${statusStyle.text}` }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: statusStyle.bg }}>
                        <Package className="w-6 h-6" style={{ color: statusStyle.text }} />
                      </div>
                      <div className="flex-1">
                        <h3 style={{ color: '#535353' }}>{alert.productName}</h3>
                        <p className="text-xs" style={{ color: '#848484' }}>SKU: {alert.sku}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span style={{ color: '#FF6B7A' }}>
                            <strong>Stock: {alert.currentStock}</strong>
                          </span>
                          <span style={{ color: '#848484' }}>Min: {alert.minStock}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => onRequestRestock(alert.id)} size="sm" className="w-full"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)', color: 'white' }}>
                      <TrendingUp className="w-4 h-4 mr-2" />Request Urgent Restock
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {otherAlerts.length > 0 && (
          <div>
            <h2 className="mb-3" style={{ color: '#535353' }}>Low Stock Warnings</h2>
            <div className="space-y-3">
              {otherAlerts.map((alert) => {
                const statusStyle = getStatusColor(alert.status);
                return (
                  <div key={alert.id} className="finance-card p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: statusStyle.bg }}>
                        <Package className="w-6 h-6" style={{ color: statusStyle.text }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 style={{ color: '#535353' }}>{alert.productName}</h3>
                            <p className="text-xs" style={{ color: '#848484' }}>SKU: {alert.sku}</p>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full capitalize"
                            style={{ background: statusStyle.bg, color: statusStyle.text }}>
                            {alert.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span style={{ color: '#535353' }}>
                            Stock: <strong>{alert.currentStock}</strong>
                          </span>
                          <span style={{ color: '#848484' }}>Min: {alert.minStock}</span>
                          <span style={{ color: '#848484' }}>Reorder: {alert.reorderPoint}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => onRequestRestock(alert.id)} size="sm" variant="outline"
                      className="w-full bg-white/50 border-white/50">
                      <TrendingUp className="w-4 h-4 mr-2" />Request Restock
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="finance-card p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#7CE577' }} />
            <p style={{ color: '#7CE577' }}>All stock levels are healthy!</p>
          </div>
        )}
      </div>
    </div>
  );
}

