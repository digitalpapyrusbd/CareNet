import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { Button } from "../ui/button";

interface LowStockAlertsProps {
  items: {
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    category: string;
  }[];
  onUpdateStock: (itemId: string) => void;
  onViewItem: (itemId: string) => void;
}

export function LowStockAlerts({ items, onUpdateStock, onViewItem }: LowStockAlertsProps) {
  const getCriticalityColor = (current: number, min: number) => {
    const percentage = (current / min) * 100;
    if (percentage <= 25) return '#FF6B7A';
    if (percentage <= 50) return '#FFB74D';
    return '#FFD180';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Low Stock Alerts</h1>
          <p style={{ color: '#848484' }}>{items.length} items need attention</p>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const criticalityColor = getCriticalityColor(item.currentStock, item.minStock);
            const percentage = (item.currentStock / item.minStock) * 100;

            return (
              <div key={item.id} className="finance-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${criticalityColor}33` }}>
                      <AlertTriangle className="w-6 h-6" style={{ color: criticalityColor }} />
                    </div>
                    <div>
                      <h3 className="mb-1" style={{ color: '#535353' }}>{item.name}</h3>
                      <p className="text-sm" style={{ color: '#848484' }}>{item.category}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm"
                    style={{ background: `${criticalityColor}33`, color: criticalityColor }}>
                    {percentage <= 25 ? 'Critical' : percentage <= 50 ? 'Low' : 'Warning'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4" style={{ color: '#848484' }} />
                      <span className="text-sm" style={{ color: '#848484' }}>Current Stock</span>
                    </div>
                    <p className="text-xl" style={{ color: criticalityColor }}>{item.currentStock}</p>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4" style={{ color: '#848484' }} />
                      <span className="text-sm" style={{ color: '#848484' }}>Min Required</span>
                    </div>
                    <p className="text-xl" style={{ color: '#535353' }}>{item.minStock}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => onViewItem(item.id)} variant="outline" className="flex-1 bg-white/50 border-white/50">
                    View Details
                  </Button>
                  <Button onClick={() => onUpdateStock(item.id)} className="flex-1"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                    Update Stock
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

